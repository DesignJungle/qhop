import winston from 'winston';
import path from 'path';

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Tell winston that you want to link the colors
winston.addColors(colors);

// Define which level to log based on environment
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

// Define format for logs
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

// Define transports
const transports = [
  // Console transport
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }),
  
  // File transport for errors
  new winston.transports.File({
    filename: path.join(process.cwd(), 'logs', 'error.log'),
    level: 'error',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    )
  }),
  
  // File transport for all logs
  new winston.transports.File({
    filename: path.join(process.cwd(), 'logs', 'combined.log'),
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    )
  }),
];

// Create the logger
export const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
  // Handle uncaught exceptions
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'exceptions.log')
    })
  ],
  // Handle unhandled promise rejections
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'rejections.log')
    })
  ]
});

// Create a stream object for Morgan HTTP logging
export const morganStream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

// Helper functions for structured logging
export const logError = (message: string, error?: any, metadata?: any) => {
  logger.error(message, {
    error: error?.message || error,
    stack: error?.stack,
    ...metadata
  });
};

export const logInfo = (message: string, metadata?: any) => {
  logger.info(message, metadata);
};

export const logWarn = (message: string, metadata?: any) => {
  logger.warn(message, metadata);
};

export const logDebug = (message: string, metadata?: any) => {
  logger.debug(message, metadata);
};

// Performance logging helper
export const logPerformance = (operation: string, startTime: number, metadata?: any) => {
  const duration = Date.now() - startTime;
  logger.info(`Performance: ${operation} completed in ${duration}ms`, {
    operation,
    duration,
    ...metadata
  });
};

// Request logging helper
export const logRequest = (req: any, metadata?: any) => {
  logger.http(`${req.method} ${req.url}`, {
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    ...metadata
  });
};

// Database operation logging
export const logDatabase = (operation: string, table: string, metadata?: any) => {
  logger.debug(`Database: ${operation} on ${table}`, {
    operation,
    table,
    ...metadata
  });
};

// WebSocket logging
export const logWebSocket = (event: string, socketId: string, metadata?: any) => {
  logger.debug(`WebSocket: ${event} for socket ${socketId}`, {
    event,
    socketId,
    ...metadata
  });
};

// Business logic logging
export const logBusiness = (action: string, businessId: string, metadata?: any) => {
  logger.info(`Business: ${action} for business ${businessId}`, {
    action,
    businessId,
    ...metadata
  });
};

// Queue operation logging
export const logQueue = (action: string, queueId: string, metadata?: any) => {
  logger.info(`Queue: ${action} for queue ${queueId}`, {
    action,
    queueId,
    ...metadata
  });
};

// Authentication logging
export const logAuth = (action: string, userId: string, userType: string, metadata?: any) => {
  logger.info(`Auth: ${action} for ${userType} ${userId}`, {
    action,
    userId,
    userType,
    ...metadata
  });
};

// Security logging
export const logSecurity = (event: string, severity: 'low' | 'medium' | 'high', metadata?: any) => {
  const logLevel = severity === 'high' ? 'error' : severity === 'medium' ? 'warn' : 'info';
  logger[logLevel](`Security: ${event}`, {
    event,
    severity,
    timestamp: new Date().toISOString(),
    ...metadata
  });
};
