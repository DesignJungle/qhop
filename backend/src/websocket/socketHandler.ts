import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';
import { redisClient } from '../utils/redis';

const prisma = new PrismaClient();

interface AuthenticatedSocket extends Socket {
  userId?: string;
  businessId?: string;
  userType?: 'customer' | 'business';
}

interface QueueUpdate {
  queueId: string;
  businessId: string;
  totalInQueue: number;
  averageWaitTime: number;
  currentlyServing?: string;
}

interface TicketUpdate {
  ticketId: string;
  userId: string;
  businessId: string;
  position: number;
  estimatedTime: string;
  status: string;
}

export function initializeWebSocket(io: SocketIOServer) {
  // Authentication middleware for WebSocket
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }
      
      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      
      if (decoded.type === 'customer') {
        // Verify customer session
        const session = await prisma.userSession.findUnique({
          where: { token },
          include: { user: true }
        });
        
        if (!session || session.expiresAt < new Date()) {
          return next(new Error('Authentication error: Invalid or expired token'));
        }
        
        socket.userId = session.user.id;
        socket.userType = 'customer';
        
      } else if (decoded.type === 'business') {
        // Verify business session
        const session = await prisma.businessSession.findUnique({
          where: { token },
          include: { owner: true }
        });
        
        if (!session || session.expiresAt < new Date()) {
          return next(new Error('Authentication error: Invalid or expired token'));
        }
        
        socket.userId = session.owner.id;
        socket.businessId = session.owner.businessId;
        socket.userType = 'business';
      }
      
      next();
    } catch (error) {
      logger.error('WebSocket authentication error:', error);
      next(new Error('Authentication error'));
    }
  });
  
  io.on('connection', (socket: AuthenticatedSocket) => {
    logger.info(`🔌 WebSocket connected: ${socket.id} (${socket.userType})`);
    
    // Join appropriate rooms based on user type
    if (socket.userType === 'customer' && socket.userId) {
      socket.join(`user:${socket.userId}`);
      
      // Join business rooms for tickets the user has
      getUserActiveTickets(socket.userId).then(tickets => {
        tickets.forEach(ticket => {
          socket.join(`business:${ticket.businessId}`);
          socket.join(`queue:${ticket.queueId}`);
        });
      });
      
    } else if (socket.userType === 'business' && socket.businessId) {
      socket.join(`business:${socket.businessId}`);
      socket.join(`business-owner:${socket.businessId}`);
    }
    
    // Customer Events
    socket.on('join-queue', async (data: { businessId: string; queueId: string }) => {
      try {
        if (socket.userType !== 'customer') return;
        
        socket.join(`business:${data.businessId}`);
        socket.join(`queue:${data.queueId}`);
        
        logger.info(`👤 Customer ${socket.userId} joined queue ${data.queueId}`);
        
        // Notify business of new customer
        socket.to(`business-owner:${data.businessId}`).emit('customer-joined', {
          userId: socket.userId,
          queueId: data.queueId,
          timestamp: new Date().toISOString()
        });
        
      } catch (error) {
        logger.error('Error joining queue:', error);
        socket.emit('error', { message: 'Failed to join queue' });
      }
    });
    
    socket.on('leave-queue', async (data: { businessId: string; queueId: string; ticketId: string }) => {
      try {
        if (socket.userType !== 'customer') return;
        
        socket.leave(`business:${data.businessId}`);
        socket.leave(`queue:${data.queueId}`);
        
        logger.info(`👤 Customer ${socket.userId} left queue ${data.queueId}`);
        
        // Notify business of customer leaving
        socket.to(`business-owner:${data.businessId}`).emit('customer-left', {
          userId: socket.userId,
          queueId: data.queueId,
          ticketId: data.ticketId,
          timestamp: new Date().toISOString()
        });
        
      } catch (error) {
        logger.error('Error leaving queue:', error);
        socket.emit('error', { message: 'Failed to leave queue' });
      }
    });
    
    // Business Events
    socket.on('call-next-customer', async (data: { queueId: string }) => {
      try {
        if (socket.userType !== 'business') return;
        
        const nextTicket = await getNextTicketInQueue(data.queueId);
        if (!nextTicket) {
          socket.emit('error', { message: 'No customers in queue' });
          return;
        }
        
        // Update ticket status
        await prisma.ticket.update({
          where: { id: nextTicket.id },
          data: { 
            status: 'CALLED',
            calledAt: new Date()
          }
        });
        
        // Notify customer
        socket.to(`user:${nextTicket.userId}`).emit('ticket-called', {
          ticketId: nextTicket.id,
          ticketNumber: nextTicket.ticketNumber,
          message: 'You have been called for service!',
          timestamp: new Date().toISOString()
        });
        
        // Notify all customers in queue about position updates
        await broadcastQueueUpdate(data.queueId, socket.businessId!);
        
        logger.info(`📢 Business ${socket.businessId} called ticket ${nextTicket.ticketNumber}`);
        
      } catch (error) {
        logger.error('Error calling next customer:', error);
        socket.emit('error', { message: 'Failed to call next customer' });
      }
    });
    
    socket.on('update-ticket-status', async (data: { ticketId: string; status: string; notes?: string }) => {
      try {
        if (socket.userType !== 'business') return;
        
        const ticket = await prisma.ticket.update({
          where: { id: data.ticketId },
          data: { 
            status: data.status as any,
            notes: data.notes,
            ...(data.status === 'IN_SERVICE' && { servedAt: new Date() }),
            ...(data.status === 'COMPLETED' && { completedAt: new Date() })
          },
          include: { user: true, queue: true }
        });
        
        // Notify customer
        socket.to(`user:${ticket.userId}`).emit('ticket-updated', {
          ticketId: ticket.id,
          status: ticket.status,
          message: getStatusMessage(ticket.status),
          timestamp: new Date().toISOString()
        });
        
        // Update queue positions if ticket was completed/cancelled
        if (['COMPLETED', 'CANCELLED', 'NO_SHOW'].includes(data.status)) {
          await broadcastQueueUpdate(ticket.queueId, socket.businessId!);
        }
        
        logger.info(`🎫 Ticket ${ticket.ticketNumber} status updated to ${data.status}`);
        
      } catch (error) {
        logger.error('Error updating ticket status:', error);
        socket.emit('error', { message: 'Failed to update ticket status' });
      }
    });
    
    socket.on('broadcast-announcement', async (data: { message: string; queueId?: string }) => {
      try {
        if (socket.userType !== 'business') return;
        
        const room = data.queueId ? `queue:${data.queueId}` : `business:${socket.businessId}`;
        
        socket.to(room).emit('business-announcement', {
          businessId: socket.businessId,
          message: data.message,
          timestamp: new Date().toISOString()
        });
        
        logger.info(`📢 Business ${socket.businessId} sent announcement: ${data.message}`);
        
      } catch (error) {
        logger.error('Error broadcasting announcement:', error);
        socket.emit('error', { message: 'Failed to send announcement' });
      }
    });
    
    // Real-time analytics updates
    socket.on('request-analytics-update', async () => {
      try {
        if (socket.userType !== 'business') return;
        
        const analytics = await getTodayAnalytics(socket.businessId!);
        socket.emit('analytics-update', analytics);
        
      } catch (error) {
        logger.error('Error getting analytics update:', error);
        socket.emit('error', { message: 'Failed to get analytics update' });
      }
    });
    
    // Disconnect handler
    socket.on('disconnect', () => {
      logger.info(`🔌 WebSocket disconnected: ${socket.id} (${socket.userType})`);
    });
  });
  
  // Periodic queue updates (every 30 seconds)
  setInterval(async () => {
    try {
      const activeQueues = await prisma.queue.findMany({
        where: { isActive: true },
        select: { id: true, businessId: true }
      });
      
      for (const queue of activeQueues) {
        await broadcastQueueUpdate(queue.id, queue.businessId);
      }
    } catch (error) {
      logger.error('Error in periodic queue updates:', error);
    }
  }, 30000);
}

// Helper functions
async function getUserActiveTickets(userId: string) {
  return await prisma.ticket.findMany({
    where: {
      userId,
      status: { in: ['WAITING', 'CALLED', 'IN_SERVICE'] }
    },
    select: { businessId: true, queueId: true }
  });
}

async function getNextTicketInQueue(queueId: string) {
  return await prisma.ticket.findFirst({
    where: {
      queueId,
      status: 'WAITING'
    },
    orderBy: { position: 'asc' }
  });
}

async function broadcastQueueUpdate(queueId: string, businessId: string) {
  const queueStats = await prisma.ticket.groupBy({
    by: ['status'],
    where: { queueId },
    _count: { status: true }
  });
  
  const totalInQueue = queueStats.find(s => s.status === 'WAITING')?._count.status || 0;
  
  // Calculate average wait time (simplified)
  const avgWaitTime = totalInQueue * 15; // Assume 15 minutes per customer
  
  const update: QueueUpdate = {
    queueId,
    businessId,
    totalInQueue,
    averageWaitTime: avgWaitTime
  };
  
  // Note: In production, you would get the io instance differently
  // For now, this is a placeholder for the broadcast functionality
}

async function getTodayAnalytics(businessId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const analytics = await prisma.businessAnalytics.findUnique({
    where: {
      businessId_date: {
        businessId,
        date: today
      }
    }
  });
  
  return analytics;
}

function getStatusMessage(status: string): string {
  const messages = {
    'WAITING': 'You are in the queue. Please wait for your turn.',
    'CALLED': 'You have been called! Please proceed to the service area.',
    'IN_SERVICE': 'You are currently being served.',
    'COMPLETED': 'Service completed. Thank you for using QHop!',
    'CANCELLED': 'Your ticket has been cancelled.',
    'NO_SHOW': 'Marked as no-show. Please rejoin the queue if needed.'
  };
  
  return messages[status as keyof typeof messages] || 'Status updated.';
}
