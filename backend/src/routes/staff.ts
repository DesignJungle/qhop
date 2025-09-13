import express from 'express';
import { PrismaClient } from '@prisma/client';
import { businessAuthMiddleware, roleMiddleware } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { staffSchemas } from '../schemas/staffSchemas';
import { logger } from '../utils/logger';
import bcrypt from 'bcryptjs';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @route GET /api/staff/business/:businessId
 * @desc Get all staff members for a business
 */
router.get('/business/:businessId', businessAuthMiddleware, async (req, res) => {
  try {
    const { businessId } = req.params;
    const { role, status, search } = req.query;

    // Verify business ownership
    if (req.user?.businessId !== businessId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const whereClause: any = { businessId };
    
    if (role) whereClause.role = role;
    if (status === 'active') whereClause.isActive = true;
    if (status === 'inactive') whereClause.isActive = false;
    if (search) {
      whereClause.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const staff = await prisma.staff.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        permissions: true,
        schedule: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: [
        { isActive: 'desc' },
        { role: 'asc' },
        { name: 'asc' }
      ]
    });

    res.status(200).json({
      success: true,
      staff,
      total: staff.length
    });

  } catch (error) {
    logger.error('Error fetching staff:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch staff'
    });
  }
});

/**
 * @route POST /api/staff
 * @desc Add new staff member
 */
router.post('/', businessAuthMiddleware, roleMiddleware(['OWNER', 'MANAGER']), validateRequest(staffSchemas.createStaff), async (req, res) => {
  try {
    const { name, email, phone, role, permissions, schedule } = req.body;
    const businessId = req.user?.businessId;

    if (!businessId) {
      return res.status(400).json({
        success: false,
        message: 'Business ID is required'
      });
    }

    // Check if email already exists
    const existingStaff = await prisma.staff.findFirst({
      where: {
        email,
        businessId
      }
    });

    if (existingStaff) {
      return res.status(409).json({
        success: false,
        message: 'Staff member with this email already exists'
      });
    }

    // Create staff member
    const staff = await prisma.staff.create({
      data: {
        businessId,
        name,
        email,
        phone,
        role,
        permissions: permissions || {},
        schedule: schedule || {},
        isActive: true
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        permissions: true,
        schedule: true,
        isActive: true,
        createdAt: true
      }
    });

    logger.info(`Staff member created: ${staff.name} (${staff.email}) for business ${businessId}`);

    res.status(201).json({
      success: true,
      message: 'Staff member added successfully',
      staff
    });

  } catch (error) {
    logger.error('Error creating staff member:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add staff member'
    });
  }
});

/**
 * @route PUT /api/staff/:staffId
 * @desc Update staff member
 */
router.put('/:staffId', businessAuthMiddleware, roleMiddleware(['OWNER', 'MANAGER']), validateRequest(staffSchemas.updateStaff), async (req, res) => {
  try {
    const { staffId } = req.params;
    const { name, email, phone, role, permissions, schedule, isActive } = req.body;
    const businessId = req.user?.businessId;

    // Verify staff belongs to business
    const existingStaff = await prisma.staff.findFirst({
      where: {
        id: staffId,
        businessId
      }
    });

    if (!existingStaff) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found'
      });
    }

    // Check email uniqueness if email is being changed
    if (email && email !== existingStaff.email) {
      const emailExists = await prisma.staff.findFirst({
        where: {
          email,
          businessId,
          id: { not: staffId }
        }
      });

      if (emailExists) {
        return res.status(409).json({
          success: false,
          message: 'Email already in use by another staff member'
        });
      }
    }

    // Update staff member
    const updatedStaff = await prisma.staff.update({
      where: { id: staffId },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(phone && { phone }),
        ...(role && { role }),
        ...(permissions && { permissions }),
        ...(schedule && { schedule }),
        ...(isActive !== undefined && { isActive })
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        permissions: true,
        schedule: true,
        isActive: true,
        updatedAt: true
      }
    });

    logger.info(`Staff member updated: ${updatedStaff.name} (${updatedStaff.email})`);

    res.status(200).json({
      success: true,
      message: 'Staff member updated successfully',
      staff: updatedStaff
    });

  } catch (error) {
    logger.error('Error updating staff member:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update staff member'
    });
  }
});

/**
 * @route DELETE /api/staff/:staffId
 * @desc Remove staff member
 */
router.delete('/:staffId', businessAuthMiddleware, roleMiddleware(['OWNER']), async (req, res) => {
  try {
    const { staffId } = req.params;
    const businessId = req.user?.businessId;

    // Verify staff belongs to business
    const staff = await prisma.staff.findFirst({
      where: {
        id: staffId,
        businessId
      }
    });

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found'
      });
    }

    // Soft delete by setting isActive to false
    await prisma.staff.update({
      where: { id: staffId },
      data: { isActive: false }
    });

    logger.info(`Staff member deactivated: ${staff.name} (${staff.email})`);

    res.status(200).json({
      success: true,
      message: 'Staff member removed successfully'
    });

  } catch (error) {
    logger.error('Error removing staff member:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove staff member'
    });
  }
});

/**
 * @route GET /api/staff/:staffId/performance
 * @desc Get staff performance metrics
 */
router.get('/:staffId/performance', businessAuthMiddleware, async (req, res) => {
  try {
    const { staffId } = req.params;
    const { period = '30d' } = req.query;
    const businessId = req.user?.businessId;

    // Verify staff belongs to business
    const staff = await prisma.staff.findFirst({
      where: {
        id: staffId,
        businessId
      }
    });

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found'
      });
    }

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - parseInt(period.replace('d', '')));

    // Calculate performance metrics
    const performance = await calculateStaffPerformance(staffId, startDate, endDate);

    res.status(200).json({
      success: true,
      performance: {
        ...performance,
        staffId,
        staffName: staff.name,
        period
      }
    });

  } catch (error) {
    logger.error('Error fetching staff performance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch performance metrics'
    });
  }
});

/**
 * @route POST /api/staff/:staffId/schedule
 * @desc Update staff schedule
 */
router.post('/:staffId/schedule', businessAuthMiddleware, roleMiddleware(['OWNER', 'MANAGER']), validateRequest(staffSchemas.updateSchedule), async (req, res) => {
  try {
    const { staffId } = req.params;
    const { schedule } = req.body;
    const businessId = req.user?.businessId;

    // Verify staff belongs to business
    const staff = await prisma.staff.findFirst({
      where: {
        id: staffId,
        businessId
      }
    });

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found'
      });
    }

    // Update schedule
    const updatedStaff = await prisma.staff.update({
      where: { id: staffId },
      data: { schedule },
      select: {
        id: true,
        name: true,
        schedule: true,
        updatedAt: true
      }
    });

    logger.info(`Schedule updated for staff: ${staff.name}`);

    res.status(200).json({
      success: true,
      message: 'Schedule updated successfully',
      staff: updatedStaff
    });

  } catch (error) {
    logger.error('Error updating staff schedule:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update schedule'
    });
  }
});

/**
 * @route GET /api/staff/roles
 * @desc Get available staff roles and permissions
 */
router.get('/roles', businessAuthMiddleware, async (req, res) => {
  try {
    const roles = [
      {
        value: 'STAFF',
        label: 'Staff Member',
        description: 'Basic staff with limited permissions',
        permissions: [
          'view_queue',
          'call_customers',
          'update_ticket_status',
          'view_own_schedule'
        ]
      },
      {
        value: 'MANAGER',
        label: 'Manager',
        description: 'Manager with advanced permissions',
        permissions: [
          'view_queue',
          'call_customers',
          'update_ticket_status',
          'view_own_schedule',
          'manage_queue',
          'view_analytics',
          'manage_staff_schedule',
          'view_all_staff'
        ]
      },
      {
        value: 'OWNER',
        label: 'Owner',
        description: 'Full access to all features',
        permissions: [
          'all_permissions'
        ]
      }
    ];

    res.status(200).json({
      success: true,
      roles
    });

  } catch (error) {
    logger.error('Error fetching roles:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch roles'
    });
  }
});

// Helper function to calculate staff performance
async function calculateStaffPerformance(staffId: string, startDate: Date, endDate: Date) {
  // Mock performance calculation - in production, this would analyze actual data
  return {
    customersServed: Math.floor(Math.random() * 200) + 50,
    avgServiceTime: Math.floor(Math.random() * 10) + 15, // minutes
    customerSatisfaction: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10,
    punctuality: Math.round((Math.random() * 20 + 80) * 10) / 10, // percentage
    efficiency: Math.round((Math.random() * 30 + 70) * 10) / 10, // percentage
    hoursWorked: Math.floor(Math.random() * 40) + 120,
    overtimeHours: Math.floor(Math.random() * 10),
    absences: Math.floor(Math.random() * 3),
    lateArrivals: Math.floor(Math.random() * 5),
    performanceScore: Math.round((Math.random() * 20 + 80) * 10) / 10
  };
}

export default router;
