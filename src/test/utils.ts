import * as request from 'supertest';
import app from '../app';
import * as faker from 'faker';
import users from '../entities/users';

/**
 * Builds new user data.
 */
export const buildUserData = (data: UserCreateDataOptional = {}): UserCreateData => ({
    email: faker.internet.email(),
    name: `${faker.name.findName()} ${faker.name.lastName()}`,
    password: faker.random.alphaNumeric(8),
    ...data,
});

/**
 * Creates new confirmed user and adds it to database.
 */
export const createUser = async (): Promise<User> => {
    const data = buildUserData();
    const user = await users.insertUser(data);
    await users.confirmUser(user.confirm_token);
    return { 
        ...user,
        confirmed: true,
        password: data.password
    };
}
/**
 * Authenticates `user` and returns session id.
 */
export const authenticateUser = async (user: User): Promise<string> => {
    const authenticate = await request(app)
        .post('/auth/login')
        .send({ email: user.email, password: user.password });
    const sessionCookie = authenticate.header['set-cookie'][0].split(';')[0]/*  */;
    return sessionCookie;
}
