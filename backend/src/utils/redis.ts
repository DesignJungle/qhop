import Redis from 'ioredis';
import { logger } from './logger';

// Redis client configuration
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
  lazyConnect: true,
};

// Create Redis client
export const redisClient = new Redis(redisConfig);

// Redis connection event handlers
redisClient.on('connect', () => {
  logger.info('📡 Redis connected successfully');
});

redisClient.on('ready', () => {
  logger.info('📡 Redis ready for operations');
});

redisClient.on('error', (error) => {
  logger.error('📡 Redis connection error:', error);
});

redisClient.on('close', () => {
  logger.warn('📡 Redis connection closed');
});

redisClient.on('reconnecting', () => {
  logger.info('📡 Redis reconnecting...');
});

// Helper functions for common Redis operations
export const redisHelpers = {
  // Set key with expiration
  async setex(key: string, seconds: number, value: string): Promise<void> {
    try {
      await redisClient.setex(key, seconds, value);
    } catch (error) {
      logger.error(`Redis SETEX error for key ${key}:`, error);
      throw error;
    }
  },

  // Get key value
  async get(key: string): Promise<string | null> {
    try {
      return await redisClient.get(key);
    } catch (error) {
      logger.error(`Redis GET error for key ${key}:`, error);
      throw error;
    }
  },

  // Delete key
  async del(key: string): Promise<number> {
    try {
      return await redisClient.del(key);
    } catch (error) {
      logger.error(`Redis DEL error for key ${key}:`, error);
      throw error;
    }
  },

  // Check if key exists
  async exists(key: string): Promise<boolean> {
    try {
      const result = await redisClient.exists(key);
      return result === 1;
    } catch (error) {
      logger.error(`Redis EXISTS error for key ${key}:`, error);
      throw error;
    }
  },

  // Set key with JSON value
  async setJSON(key: string, value: any, seconds?: number): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      if (seconds) {
        await redisClient.setex(key, seconds, jsonValue);
      } else {
        await redisClient.set(key, jsonValue);
      }
    } catch (error) {
      logger.error(`Redis SET JSON error for key ${key}:`, error);
      throw error;
    }
  },

  // Get key with JSON value
  async getJSON<T>(key: string): Promise<T | null> {
    try {
      const value = await redisClient.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error(`Redis GET JSON error for key ${key}:`, error);
      throw error;
    }
  },

  // Increment counter
  async incr(key: string): Promise<number> {
    try {
      return await redisClient.incr(key);
    } catch (error) {
      logger.error(`Redis INCR error for key ${key}:`, error);
      throw error;
    }
  },

  // Set expiration for existing key
  async expire(key: string, seconds: number): Promise<boolean> {
    try {
      const result = await redisClient.expire(key, seconds);
      return result === 1;
    } catch (error) {
      logger.error(`Redis EXPIRE error for key ${key}:`, error);
      throw error;
    }
  },

  // Get time to live for key
  async ttl(key: string): Promise<number> {
    try {
      return await redisClient.ttl(key);
    } catch (error) {
      logger.error(`Redis TTL error for key ${key}:`, error);
      throw error;
    }
  },

  // Add to set
  async sadd(key: string, ...members: string[]): Promise<number> {
    try {
      return await redisClient.sadd(key, ...members);
    } catch (error) {
      logger.error(`Redis SADD error for key ${key}:`, error);
      throw error;
    }
  },

  // Remove from set
  async srem(key: string, ...members: string[]): Promise<number> {
    try {
      return await redisClient.srem(key, ...members);
    } catch (error) {
      logger.error(`Redis SREM error for key ${key}:`, error);
      throw error;
    }
  },

  // Get all set members
  async smembers(key: string): Promise<string[]> {
    try {
      return await redisClient.smembers(key);
    } catch (error) {
      logger.error(`Redis SMEMBERS error for key ${key}:`, error);
      throw error;
    }
  },

  // Check if member exists in set
  async sismember(key: string, member: string): Promise<boolean> {
    try {
      const result = await redisClient.sismember(key, member);
      return result === 1;
    } catch (error) {
      logger.error(`Redis SISMEMBER error for key ${key}:`, error);
      throw error;
    }
  },

  // Push to list
  async lpush(key: string, ...values: string[]): Promise<number> {
    try {
      return await redisClient.lpush(key, ...values);
    } catch (error) {
      logger.error(`Redis LPUSH error for key ${key}:`, error);
      throw error;
    }
  },

  // Pop from list
  async lpop(key: string): Promise<string | null> {
    try {
      return await redisClient.lpop(key);
    } catch (error) {
      logger.error(`Redis LPOP error for key ${key}:`, error);
      throw error;
    }
  },

  // Get list range
  async lrange(key: string, start: number, stop: number): Promise<string[]> {
    try {
      return await redisClient.lrange(key, start, stop);
    } catch (error) {
      logger.error(`Redis LRANGE error for key ${key}:`, error);
      throw error;
    }
  },

  // Get list length
  async llen(key: string): Promise<number> {
    try {
      return await redisClient.llen(key);
    } catch (error) {
      logger.error(`Redis LLEN error for key ${key}:`, error);
      throw error;
    }
  }
};

// Graceful shutdown
export const closeRedisConnection = async (): Promise<void> => {
  try {
    await redisClient.quit();
    logger.info('📡 Redis connection closed gracefully');
  } catch (error) {
    logger.error('📡 Error closing Redis connection:', error);
  }
};

export default redisClient;
