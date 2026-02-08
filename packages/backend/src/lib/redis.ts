import Redis from 'ioredis';
import { config } from '@/config';
import { logger } from '@/lib/logger';

export const redisClient = new Redis(config.redis);

redisClient.on('connect', () => {
    logger.info('Connected to Redis server.');
});

redisClient.on('error', err => {
    logger.error({ err }, 'Redis error.');
});
