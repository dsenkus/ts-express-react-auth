import * as redis from 'redis';
import * as redisMock from 'redis-mock';
import { dbClose, query } from '../db';
import { redisStore } from '../redis';

// mock Redis
jest.spyOn(redis, 'createClient').mockImplementation(redisMock.createClient);

beforeEach(async (): Promise<void> => {
    // clear database before each test
    await query('DELETE FROM users');
});

afterAll((): void => {
    // close connections when all tests finished
    dbClose();
    redisStore.client.quit();
});
