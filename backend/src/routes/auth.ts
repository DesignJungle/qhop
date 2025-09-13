import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { validateRequest } from '../middleware/validation';
import { authSchemas } from '../schemas/authSchemas';
import { logger } from '../utils/logger';
import { sendSMS } from '../services/smsService';
import { generateOTP } from '../utils/otpGenerator';
import { redisClient } from '../utils/redis';

const router = express.Router();
const prisma = new PrismaClient();

// Customer Authentication Routes

/**
 * @route POST /api/auth/customer/request-otp
 * @desc Request OTP for customer phone verification
 */
router.post('/customer/request-otp', validateRequest(authSchemas.requestOTP), async (req, res) => {
  try {
    const { phone } = req.body;
    
    // Generate OTP
    const otp = generateOTP();
    const sessionId = jwt.sign({ phone }, process.env.JWT_SECRET!, { expiresIn: '5m' });
    
    // Store OTP in Redis with 5-minute expiration
    await redisClient.setex(`otp:${sessionId}`, 300, otp);
    
    // Send SMS (in development, log to console)
    if (process.env.NODE_ENV === 'development') {
      logger.info(`📱 OTP for ${phone}: ${otp}`);
    } else {
      await sendSMS(phone, `Your QHop verification code is: ${otp}`);
    }
    
    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      sessionId,
      expiresIn: 300 // 5 minutes
    });
    
  } catch (error) {
    logger.error('Error requesting OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP'
    });
  }
});

/**
 * @route POST /api/auth/customer/verify-otp
 * @desc Verify OTP and authenticate customer
 */
router.post('/customer/verify-otp', validateRequest(authSchemas.verifyOTP), async (req, res) => {
  try {
    const { sessionId, otp, name } = req.body;
    
    // Verify session
    const decoded = jwt.verify(sessionId, process.env.JWT_SECRET!) as { phone: string };
    const phone = decoded.phone;
    
    // Check OTP
    const storedOTP = await redisClient.get(`otp:${sessionId}`);
    if (!storedOTP || storedOTP !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }
    
    // Clear OTP from Redis
    await redisClient.del(`otp:${sessionId}`);
    
    // Find or create user
    let user = await prisma.user.findUnique({
      where: { phone }
    });
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          phone,
          name: name || 'QHop User',
          isVerified: true
        }
      });
    } else {
      // Update verification status
      user = await prisma.user.update({
        where: { id: user.id },
        data: { isVerified: true }
      });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, phone: user.phone, type: 'customer' },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );
    
    // Store session in database
    await prisma.userSession.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      }
    });
    
    res.status(200).json({
      success: true,
      message: 'Authentication successful',
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        avatar: user.avatar,
        isVerified: user.isVerified
      },
      token,
      expiresIn: 86400 // 24 hours in seconds
    });
    
  } catch (error) {
    logger.error('Error verifying OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication failed'
    });
  }
});

// Business Owner Authentication Routes

/**
 * @route POST /api/auth/business/login
 * @desc Business owner login with email and password
 */
router.post('/business/login', validateRequest(authSchemas.businessLogin), async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find business owner
    const owner = await prisma.businessOwner.findUnique({
      where: { email },
      include: {
        business: {
          select: {
            id: true,
            name: true,
            category: true,
            address: true,
            phone: true,
            isActive: true
          }
        }
      }
    });
    
    if (!owner || !owner.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, owner.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        ownerId: owner.id, 
        businessId: owner.businessId,
        email: owner.email,
        role: owner.role,
        type: 'business'
      },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );
    
    // Store session in database
    await prisma.businessSession.create({
      data: {
        ownerId: owner.id,
        token,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      }
    });
    
    // Update last login
    await prisma.businessOwner.update({
      where: { id: owner.id },
      data: { lastLogin: new Date() }
    });
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      owner: {
        id: owner.id,
        name: owner.name,
        email: owner.email,
        phone: owner.phone,
        role: owner.role,
        business: owner.business
      },
      token,
      expiresIn: 86400 // 24 hours in seconds
    });
    
  } catch (error) {
    logger.error('Error in business login:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
});

/**
 * @route POST /api/auth/logout
 * @desc Logout user (customer or business)
 */
router.post('/logout', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'No token provided'
      });
    }
    
    // Decode token to determine type
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    // Remove session from database
    if (decoded.type === 'customer') {
      await prisma.userSession.deleteMany({
        where: { token }
      });
    } else if (decoded.type === 'business') {
      await prisma.businessSession.deleteMany({
        where: { token }
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
    
  } catch (error) {
    logger.error('Error in logout:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
});

/**
 * @route GET /api/auth/verify
 * @desc Verify token and return user info
 */
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }
    
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    if (decoded.type === 'customer') {
      // Verify customer session
      const session = await prisma.userSession.findUnique({
        where: { token },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              phone: true,
              email: true,
              avatar: true,
              isVerified: true
            }
          }
        }
      });
      
      if (!session || session.expiresAt < new Date()) {
        return res.status(401).json({
          success: false,
          message: 'Invalid or expired token'
        });
      }
      
      res.status(200).json({
        success: true,
        user: session.user,
        type: 'customer'
      });
      
    } else if (decoded.type === 'business') {
      // Verify business session
      const session = await prisma.businessSession.findUnique({
        where: { token },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              role: true,
              business: {
                select: {
                  id: true,
                  name: true,
                  category: true,
                  address: true,
                  phone: true,
                  isActive: true
                }
              }
            }
          }
        }
      });
      
      if (!session || session.expiresAt < new Date()) {
        return res.status(401).json({
          success: false,
          message: 'Invalid or expired token'
        });
      }
      
      res.status(200).json({
        success: true,
        owner: session.owner,
        type: 'business'
      });
    }
    
  } catch (error) {
    logger.error('Error verifying token:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
});

export default router;
