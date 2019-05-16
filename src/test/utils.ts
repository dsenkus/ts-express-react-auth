import * as request from 'supertest';
import app from '../app';
import { confirmUser, insertUser } from '../utils/db';

export const createUser = async (): Promise<User> => {
    const email = 'test@test.com';
    const password = 'password';
    const user = await insertUser('John Doe', email, password);
    await confirmUser(user.id);
    return { 
        ...user,
        password
    };
}

export const authenticateUser = async (user: User): Promise<string> => {
    const authenticate = await request(app)
        .post('/auth/login')
        .send({ email: user.email, password: user.password });
    const sessionCookie = authenticate.header['set-cookie'][0].split(';')[0];
    return sessionCookie
}
