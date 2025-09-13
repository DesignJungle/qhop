import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { queueSchemas } from '../schemas/queueSchemas';
import { logger } from '../utils/logger';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @route GET /api/queue/business/:businessId
 * @desc Get all queues for a business
 */
router.get('/business/:businessId', async (req, res) => {
  try {
    const { businessId } = req.params;
    
    const queues = await prisma.queue.findMany({
      where: { businessId },
      include: {
        _count: {
          select: {
            tickets: {
              where: { status: 'WAITING' }
            }
          }
        },
        tickets: {
          where: { status: { in: ['WAITING', 'CALLED', 'IN_SERVICE'] } },
          orderBy: { position: 'asc' },
          take: 5,
          include: {
            user: {
              select: { id: true, name: true, phone: true }
            },
            service: {
              select: { id: true, name: true, duration: true }
            }
          }
        }
      }
    });
    
    const queuesWithStats = queues.map(queue => ({
      ...queue,
      currentQueueSize: queue._count.tickets,
      estimatedWaitTime: queue._count.tickets * 15, // 15 minutes per customer
      nextCustomers: queue.tickets
    }));
    
    res.status(200).json({
      success: true,
      queues: queuesWithStats
    });
    
  } catch (error) {
    logger.error('Error fetching business queues:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch queues'
    });
  }
});

/**
 * @route POST /api/queue/join
 * @desc Join a queue (customer)
 */
router.post('/join', authMiddleware, validateRequest(queueSchemas.joinQueue), async (req, res) => {
  try {
    const { businessId, queueId, serviceId } = req.body;
    const userId = req.user.userId;
    
    // Check if user already has an active ticket in this business
    const existingTicket = await prisma.ticket.findFirst({
      where: {
        userId,
        businessId,
        status: { in: ['WAITING', 'CALLED', 'IN_SERVICE'] }
      }
    });
    
    if (existingTicket) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active ticket in this business'
      });
    }
    
    // Check queue capacity
    const queue = await prisma.queue.findUnique({
      where: { id: queueId },
      include: {
        _count: {
          select: {
            tickets: {
              where: { status: 'WAITING' }
            }
          }
        }
      }
    });
    
    if (!queue || !queue.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Queue is not available'
      });
    }
    
    if (queue._count.tickets >= queue.maxSize) {
      return res.status(400).json({
        success: false,
        message: 'Queue is full'
      });
    }
    
    // Generate ticket number
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const ticketCount = await prisma.ticket.count({
      where: {
        businessId,
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }
    });
    
    const ticketNumber = `${today}-${String(ticketCount + 1).padStart(3, '0')}`;
    
    // Calculate position
    const position = queue._count.tickets + 1;
    
    // Calculate estimated time
    const estimatedTime = new Date(Date.now() + (position * 15 * 60 * 1000)); // 15 minutes per position
    
    // Create ticket
    const ticket = await prisma.ticket.create({
      data: {
        businessId,
        queueId,
        userId,
        serviceId,
        ticketNumber,
        position,
        estimatedTime,
        status: 'WAITING'
      },
      include: {
        business: {
          select: { id: true, name: true, address: true, phone: true }
        },
        queue: {
          select: { id: true, name: true }
        },
        service: {
          select: { id: true, name: true, duration: true, price: true }
        }
      }
    });
    
    res.status(201).json({
      success: true,
      message: 'Successfully joined queue',
      ticket: {
        id: ticket.id,
        ticketNumber: ticket.ticketNumber,
        position: ticket.position,
        estimatedTime: ticket.estimatedTime,
        status: ticket.status,
        business: ticket.business,
        queue: ticket.queue,
        service: ticket.service,
        createdAt: ticket.createdAt
      }
    });
    
  } catch (error) {
    logger.error('Error joining queue:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to join queue'
    });
  }
});

/**
 * @route POST /api/queue/leave
 * @desc Leave a queue (customer)
 */
router.post('/leave', authMiddleware, validateRequest(queueSchemas.leaveQueue), async (req, res) => {
  try {
    const { ticketId } = req.body;
    const userId = req.user.userId;
    
    // Find and update ticket
    const ticket = await prisma.ticket.findFirst({
      where: {
        id: ticketId,
        userId,
        status: { in: ['WAITING', 'CALLED'] }
      }
    });
    
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found or cannot be cancelled'
      });
    }
    
    // Update ticket status
    await prisma.ticket.update({
      where: { id: ticketId },
      data: { status: 'CANCELLED' }
    });
    
    // Update positions for remaining tickets
    await prisma.ticket.updateMany({
      where: {
        queueId: ticket.queueId,
        position: { gt: ticket.position },
        status: 'WAITING'
      },
      data: {
        position: { decrement: 1 }
      }
    });
    
    res.status(200).json({
      success: true,
      message: 'Successfully left queue'
    });
    
  } catch (error) {
    logger.error('Error leaving queue:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to leave queue'
    });
  }
});

/**
 * @route GET /api/queue/:queueId/status
 * @desc Get queue status and waiting times
 */
router.get('/:queueId/status', async (req, res) => {
  try {
    const { queueId } = req.params;
    
    const queueStats = await prisma.ticket.groupBy({
      by: ['status'],
      where: { queueId },
      _count: { status: true }
    });
    
    const waitingCount = queueStats.find(s => s.status === 'WAITING')?._count.status || 0;
    const calledCount = queueStats.find(s => s.status === 'CALLED')?._count.status || 0;
    const inServiceCount = queueStats.find(s => s.status === 'IN_SERVICE')?._count.status || 0;
    
    // Get current serving ticket
    const currentlyServing = await prisma.ticket.findFirst({
      where: {
        queueId,
        status: 'IN_SERVICE'
      },
      include: {
        user: {
          select: { name: true }
        }
      }
    });
    
    // Calculate average wait time based on recent completions
    const recentCompletions = await prisma.ticket.findMany({
      where: {
        queueId,
        status: 'COMPLETED',
        completedAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        }
      },
      select: {
        createdAt: true,
        servedAt: true
      }
    });
    
    let averageWaitTime = 15; // Default 15 minutes
    if (recentCompletions.length > 0) {
      const totalWaitTime = recentCompletions.reduce((sum, ticket) => {
        if (ticket.servedAt) {
          return sum + (ticket.servedAt.getTime() - ticket.createdAt.getTime());
        }
        return sum;
      }, 0);
      averageWaitTime = Math.round(totalWaitTime / recentCompletions.length / (1000 * 60)); // Convert to minutes
    }
    
    res.status(200).json({
      success: true,
      queueStatus: {
        queueId,
        waiting: waitingCount,
        called: calledCount,
        inService: inServiceCount,
        total: waitingCount + calledCount + inServiceCount,
        averageWaitTime,
        estimatedWaitTime: waitingCount * averageWaitTime,
        currentlyServing: currentlyServing ? {
          ticketNumber: currentlyServing.ticketNumber,
          customerName: currentlyServing.user.name
        } : null,
        lastUpdated: new Date().toISOString()
      }
    });
    
  } catch (error) {
    logger.error('Error fetching queue status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch queue status'
    });
  }
});

/**
 * @route POST /api/queue/call-next
 * @desc Call next customer in queue (business)
 */
router.post('/call-next', authMiddleware, validateRequest(queueSchemas.callNext), async (req, res) => {
  try {
    const { queueId } = req.body;
    const businessId = req.user.businessId;
    
    // Verify business owns this queue
    const queue = await prisma.queue.findFirst({
      where: { id: queueId, businessId }
    });
    
    if (!queue) {
      return res.status(404).json({
        success: false,
        message: 'Queue not found'
      });
    }
    
    // Find next waiting ticket
    const nextTicket = await prisma.ticket.findFirst({
      where: {
        queueId,
        status: 'WAITING'
      },
      orderBy: { position: 'asc' },
      include: {
        user: {
          select: { id: true, name: true, phone: true }
        }
      }
    });
    
    if (!nextTicket) {
      return res.status(400).json({
        success: false,
        message: 'No customers waiting in queue'
      });
    }
    
    // Update ticket status
    const updatedTicket = await prisma.ticket.update({
      where: { id: nextTicket.id },
      data: {
        status: 'CALLED',
        calledAt: new Date()
      }
    });
    
    res.status(200).json({
      success: true,
      message: 'Customer called successfully',
      ticket: {
        id: updatedTicket.id,
        ticketNumber: updatedTicket.ticketNumber,
        customer: nextTicket.user,
        calledAt: updatedTicket.calledAt
      }
    });
    
  } catch (error) {
    logger.error('Error calling next customer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to call next customer'
    });
  }
});

export default router;
