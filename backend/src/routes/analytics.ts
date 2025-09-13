import express from 'express';
import { PrismaClient } from '@prisma/client';
import { businessAuthMiddleware } from '../middleware/auth';
import { validateQuery } from '../middleware/validation';
import { analyticsSchemas } from '../schemas/analyticsSchemas';
import { logger } from '../utils/logger';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @route GET /api/analytics/dashboard/:businessId
 * @desc Get comprehensive dashboard analytics for a business
 */
router.get('/dashboard/:businessId', businessAuthMiddleware, async (req, res) => {
  try {
    const { businessId } = req.params;
    const { period = '7d' } = req.query;

    // Verify business ownership
    if (req.user?.businessId !== businessId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const endDate = new Date();
    const startDate = new Date();
    
    // Calculate date range based on period
    switch (period) {
      case '1d':
        startDate.setDate(endDate.getDate() - 1);
        break;
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(endDate.getDate() - 90);
        break;
      default:
        startDate.setDate(endDate.getDate() - 7);
    }

    // Get analytics data
    const [
      totalCustomers,
      avgWaitTime,
      customerSatisfaction,
      noShowRate,
      peakHours,
      dailyStats,
      queuePerformance,
      serviceMetrics
    ] = await Promise.all([
      getTotalCustomers(businessId, startDate, endDate),
      getAverageWaitTime(businessId, startDate, endDate),
      getCustomerSatisfaction(businessId, startDate, endDate),
      getNoShowRate(businessId, startDate, endDate),
      getPeakHours(businessId, startDate, endDate),
      getDailyStats(businessId, startDate, endDate),
      getQueuePerformance(businessId, startDate, endDate),
      getServiceMetrics(businessId, startDate, endDate)
    ]);

    res.status(200).json({
      success: true,
      analytics: {
        overview: {
          totalCustomers,
          avgWaitTime,
          customerSatisfaction,
          noShowRate,
          period: period as string
        },
        peakHours,
        dailyStats,
        queuePerformance,
        serviceMetrics,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error('Error fetching dashboard analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics'
    });
  }
});

/**
 * @route GET /api/analytics/revenue/:businessId
 * @desc Get revenue analytics and trends
 */
router.get('/revenue/:businessId', businessAuthMiddleware, async (req, res) => {
  try {
    const { businessId } = req.params;
    const { period = '30d' } = req.query;

    if (req.user?.businessId !== businessId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - parseInt(period.replace('d', '')));

    const revenueData = await getRevenueAnalytics(businessId, startDate, endDate);

    res.status(200).json({
      success: true,
      revenue: revenueData
    });

  } catch (error) {
    logger.error('Error fetching revenue analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch revenue analytics'
    });
  }
});

/**
 * @route GET /api/analytics/customers/:businessId
 * @desc Get customer behavior analytics
 */
router.get('/customers/:businessId', businessAuthMiddleware, async (req, res) => {
  try {
    const { businessId } = req.params;
    const { period = '30d' } = req.query;

    if (req.user?.businessId !== businessId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - parseInt(period.replace('d', '')));

    const customerData = await getCustomerAnalytics(businessId, startDate, endDate);

    res.status(200).json({
      success: true,
      customers: customerData
    });

  } catch (error) {
    logger.error('Error fetching customer analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customer analytics'
    });
  }
});

/**
 * @route GET /api/analytics/performance/:businessId
 * @desc Get operational performance metrics
 */
router.get('/performance/:businessId', businessAuthMiddleware, async (req, res) => {
  try {
    const { businessId } = req.params;
    const { period = '30d' } = req.query;

    if (req.user?.businessId !== businessId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - parseInt(period.replace('d', '')));

    const performanceData = await getPerformanceMetrics(businessId, startDate, endDate);

    res.status(200).json({
      success: true,
      performance: performanceData
    });

  } catch (error) {
    logger.error('Error fetching performance analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch performance analytics'
    });
  }
});

/**
 * @route POST /api/analytics/export/:businessId
 * @desc Export analytics data to CSV/PDF
 */
router.post('/export/:businessId', businessAuthMiddleware, async (req, res) => {
  try {
    const { businessId } = req.params;
    const { format = 'csv', period = '30d', metrics } = req.body;

    if (req.user?.businessId !== businessId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - parseInt(period.replace('d', '')));

    const exportData = await generateAnalyticsExport(businessId, startDate, endDate, metrics);

    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="qhop-analytics-${businessId}-${period}.csv"`);
      res.send(exportData.csv);
    } else {
      res.status(200).json({
        success: true,
        data: exportData.json,
        downloadUrl: `/api/analytics/download/${businessId}/${exportData.fileId}`
      });
    }

  } catch (error) {
    logger.error('Error exporting analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export analytics'
    });
  }
});

// Helper functions for analytics calculations

async function getTotalCustomers(businessId: string, startDate: Date, endDate: Date): Promise<number> {
  const result = await prisma.ticket.count({
    where: {
      businessId,
      createdAt: {
        gte: startDate,
        lte: endDate
      }
    }
  });
  return result;
}

async function getAverageWaitTime(businessId: string, startDate: Date, endDate: Date): Promise<number> {
  const tickets = await prisma.ticket.findMany({
    where: {
      businessId,
      createdAt: {
        gte: startDate,
        lte: endDate
      },
      servedAt: { not: null },
      status: 'COMPLETED'
    },
    select: {
      createdAt: true,
      servedAt: true
    }
  });

  if (tickets.length === 0) return 0;

  const totalWaitTime = tickets.reduce((sum, ticket) => {
    if (ticket.servedAt) {
      return sum + (ticket.servedAt.getTime() - ticket.createdAt.getTime());
    }
    return sum;
  }, 0);

  return Math.round(totalWaitTime / tickets.length / (1000 * 60)); // Convert to minutes
}

async function getCustomerSatisfaction(businessId: string, startDate: Date, endDate: Date): Promise<number> {
  const reviews = await prisma.review.aggregate({
    where: {
      businessId,
      createdAt: {
        gte: startDate,
        lte: endDate
      }
    },
    _avg: {
      rating: true
    }
  });

  return reviews._avg.rating || 0;
}

async function getNoShowRate(businessId: string, startDate: Date, endDate: Date): Promise<number> {
  const [totalTickets, noShowTickets] = await Promise.all([
    prisma.ticket.count({
      where: {
        businessId,
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      }
    }),
    prisma.ticket.count({
      where: {
        businessId,
        createdAt: {
          gte: startDate,
          lte: endDate
        },
        status: 'NO_SHOW'
      }
    })
  ]);

  return totalTickets > 0 ? (noShowTickets / totalTickets) * 100 : 0;
}

async function getPeakHours(businessId: string, startDate: Date, endDate: Date) {
  const tickets = await prisma.ticket.findMany({
    where: {
      businessId,
      createdAt: {
        gte: startDate,
        lte: endDate
      }
    },
    select: {
      createdAt: true
    }
  });

  const hourCounts: { [hour: number]: number } = {};
  
  tickets.forEach(ticket => {
    const hour = ticket.createdAt.getHours();
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });

  return Object.entries(hourCounts)
    .map(([hour, count]) => ({
      hour: parseInt(hour),
      count,
      label: `${hour}:00`
    }))
    .sort((a, b) => b.count - a.count);
}

async function getDailyStats(businessId: string, startDate: Date, endDate: Date) {
  const analytics = await prisma.businessAnalytics.findMany({
    where: {
      businessId,
      date: {
        gte: startDate,
        lte: endDate
      }
    },
    orderBy: {
      date: 'asc'
    }
  });

  return analytics.map(day => ({
    date: day.date.toISOString().split('T')[0],
    customers: day.totalCustomers,
    avgWaitTime: day.avgWaitTime,
    revenue: day.revenue,
    satisfaction: day.customerSatisfaction,
    noShowRate: day.noShowRate
  }));
}

async function getQueuePerformance(businessId: string, startDate: Date, endDate: Date) {
  const queues = await prisma.queue.findMany({
    where: { businessId },
    include: {
      _count: {
        select: {
          tickets: {
            where: {
              createdAt: {
                gte: startDate,
                lte: endDate
              }
            }
          }
        }
      }
    }
  });

  return queues.map(queue => ({
    queueId: queue.id,
    name: queue.name,
    totalTickets: queue._count.tickets,
    maxSize: queue.maxSize,
    utilizationRate: (queue._count.tickets / queue.maxSize) * 100
  }));
}

async function getServiceMetrics(businessId: string, startDate: Date, endDate: Date) {
  const services = await prisma.service.findMany({
    where: { businessId },
    include: {
      _count: {
        select: {
          tickets: {
            where: {
              createdAt: {
                gte: startDate,
                lte: endDate
              }
            }
          }
        }
      }
    }
  });

  return services.map(service => ({
    serviceId: service.id,
    name: service.name,
    totalBookings: service._count.tickets,
    duration: service.duration,
    price: service.price,
    revenue: service._count.tickets * service.price
  }));
}

async function getRevenueAnalytics(businessId: string, startDate: Date, endDate: Date) {
  // Implementation for revenue analytics
  return {
    totalRevenue: 0,
    dailyRevenue: [],
    revenueByService: [],
    projectedRevenue: 0
  };
}

async function getCustomerAnalytics(businessId: string, startDate: Date, endDate: Date) {
  // Implementation for customer analytics
  return {
    newCustomers: 0,
    returningCustomers: 0,
    customerRetentionRate: 0,
    averageVisitsPerCustomer: 0
  };
}

async function getPerformanceMetrics(businessId: string, startDate: Date, endDate: Date) {
  // Implementation for performance metrics
  return {
    efficiency: 0,
    throughput: 0,
    capacity: 0,
    bottlenecks: []
  };
}

async function generateAnalyticsExport(businessId: string, startDate: Date, endDate: Date, metrics: string[]) {
  // Implementation for data export
  return {
    csv: '',
    json: {},
    fileId: 'export-' + Date.now()
  };
}

export default router;
