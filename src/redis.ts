import * as config from 'config';
import * as session from 'express-session';
import * as connectRedis from 'connect-redis';

const RedisStore = connectRedis(session);

export const redisStore = new RedisStore({
    url: config.get('redis.uri'),
});
