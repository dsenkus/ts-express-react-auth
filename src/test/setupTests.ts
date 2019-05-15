import { server } from "../app";
import { redisStore } from '../utils/redis';
import { query, dbClose } from "../db";
import * as redis from 'redis';
import * as redisMock from 'redis-mock';

jest.spyOn(redis, 'createClient').mockImplementation(redisMock.createClient);

beforeEach(async (): Promise<void> => {
    await query('DELETE FROM users');
});

afterEach((): void => {
    server.close();
});

afterAll((): void => {
    dbClose();
    redisStore.client.quit();
});
