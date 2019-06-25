import * as session from 'express-session';
import * as connectRedis from 'connect-redis';
import { logger } from './logger';

const RedisStore = connectRedis(session);

export const redisStore = new RedisStore({
    url: process.env.REDIS_URI,
});

redisStore.on('connect', (): void => {
    logger.log('info', 'Connected to Redis');
});

redisStore.on('error', (error): void => {
    logger.log('error', `Redis error: ${error}`, { error });
});
