import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    businessId?: string;
    email?: string;
    phone?: string;
    role?: string;
    type: 'customer' | 'business';
  };
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
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
              phone: true,
              email: true,
              name: true,
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
      
      req.user = {
        userId: session.user.id,
        phone: session.user.phone,
        email: session.user.email,
        type: 'customer'
      };
      
    } else if (decoded.type === 'business') {
      // Verify business session
      const session = await prisma.businessSession.findUnique({
        where: { token },
        include: {
          owner: {
            select: {
              id: true,
              businessId: true,
              email: true,
              phone: true,
              role: true,
              name: true,
              isActive: true
            }
          }
        }
      });
      
      if (!session || session.expiresAt < new Date() || !session.owner.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Invalid or expired token'
        });
      }
      
      req.user = {
        userId: session.owner.id,
        businessId: session.owner.businessId,
        email: session.owner.email,
        phone: session.owner.phone,
        role: session.owner.role,
        type: 'business'
      };
    } else {
      return res.status(401).json({
        success: false,
        message: 'Invalid token type'
      });
    }
    
    next();
    
  } catch (error) {
    logger.error('Authentication error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

export const businessAuthMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  await authMiddleware(req, res, () => {
    if (req.user?.type !== 'business') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Business account required.'
      });
    }
    next();
  });
};

export const customerAuthMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  await authMiddleware(req, res, () => {
    if (req.user?.type !== 'customer') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Customer account required.'
      });
    }
    next();
  });
};

export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user?.role || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
    }
    next();
  };
};
