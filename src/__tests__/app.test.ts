import { server } from "../app";
import { redisStore } from '../utils/redis';
import * as request from "supertest";
import { insertUser, confirmUser, findUserByEmail } from "../utils/db";
import { query, dbClose } from "../db";
import * as HttpStatus from 'http-status-codes';
import * as redis from 'redis';
import * as redisMock from 'redis-mock';
import { buildErrorJson, UnauthorizedError, InvalidAuthCredentialsError } from "../utils/errors";

jest.spyOn(redis, 'createClient').mockImplementation(redisMock.createClient);

// close the server after each test
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

const createUser = async (): Promise<User> => {
    const email = 'test@test.com';
    const password = 'password';
    const user = await insertUser('John Doe', email, password);
    await confirmUser(user.id);
    return { 
        ...user,
        password
    };
}

const authenticateUser = async (user: User): Promise<string> => {
    const authenticate = await request(server)
        .post('/auth/login')
        .send({ email: user.email, password: user.password });
    const sessionCookie = authenticate.header['set-cookie'][0].split(';')[0];
    return sessionCookie
}

describe("GET /auth/whoami", (): void => {
    it("should fail for unauthenticated users", async (): Promise<void> => {
        const result = await request(server).get('/auth/whoami');

        expect(result.body).toEqual({
            error: buildErrorJson(new UnauthorizedError())
        });
        expect(result.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it("should return authenticated user data", async (): Promise<void> => {
        const user = await createUser();
        const cookie = await authenticateUser(user);
        const result = await request(server)
            .get('/auth/whoami')
            .set('Cookie', [cookie])

        expect(result.body.name).toEqual(user.name)
        expect(result.status).toEqual(HttpStatus.OK);
    });
});

describe("POST /auth/login", (): void => {
    it("it should fail when email invalid", async (): Promise<void> => {
        const result = await request(server)
            .post('/auth/login')
            .send({email: 'invalid@email.com', password: 'invalid'});
        
        expect(result.body).toEqual({
            error: buildErrorJson(new InvalidAuthCredentialsError())
        });
        expect(result.status).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it("it should fail when password invalid", async (): Promise<void> => {
        const { email } = await createUser();

        const result = await request(server)
            .post('/auth/login')
            .send({email, password: 'badpassword'});
        
        expect(result.body).toEqual({
            error: buildErrorJson(new InvalidAuthCredentialsError())
        });
        expect(result.status).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it("it should fail when user not confirmed", async (): Promise<void> => {
        const email = 'test@test.com';
        const password = 'password';
        await insertUser('John Doe', email, password);

        const result = await request(server)
            .post('/auth/login')
            .send({email, password });
        
        expect(result.status).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
        expect(result.body).toEqual({
            error: buildErrorJson(new InvalidAuthCredentialsError())
        });
    });

    it("it should set HttpOnly session cookie when success", async (): Promise<void> => {
        const { email, password } = await createUser();

        const result = await request(server)
            .post('/auth/login')
            .send({ email, password });

        expect(result.status).toEqual(HttpStatus.OK);
        expect(result.header['set-cookie'][0]).toMatch(/connect\.sid/);
        expect(result.header['set-cookie'][0]).toMatch(/HttpOnly/);
    });
});

describe("POST /auth/register", (): void => {
    it("should create new unconfirmed user", async (): Promise<void> => {
        const [name, email, password] = ['John Doe', 'test@test.com', 'testpass'];

        const result = await request(server)
            .post('/auth/register')
            .send({ name, email, password });

        const user = await findUserByEmail(email);
        expect(result.status).toEqual(HttpStatus.OK);
        expect(user.email).toEqual(email);
        expect(user.name).toEqual(name);
        expect(user.confirmed).toBeFalsy();
    });

    it("should fail when data is not provided", async (): Promise<void> => {
        const [name, email, password] = ['', '', ''];

        const result = await request(server)
            .post('/auth/register')
            .send({ name, email, password });

        // const user = await findUserByEmail(email);
        expect(result.status).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
        expect(result.body.error.data.email).toMatch(/required/);
        expect(result.body.error.data.name).toMatch(/at least/);
        expect(result.body.error.data.password).toMatch(/at least/);
    });

    it("should fail if email already taken", async (): Promise<void> => {
        const { email } = await createUser();
        const [name, password] = ['Jane Doe', 'testpass'];

        const result = await request(server)
            .post('/auth/register')
            .send({ name, email, password });

        // const user = await findUserByEmail(email);
        expect(result.status).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
        expect(result.body.error.data.email).toMatch(/taken/);
    });
});

describe("POST /auth/logout", (): void => {
    it("should fail for unauthenticated users", async (): Promise<void> => {
        const result = await request(server).post('/auth/logout');

        expect(result.status).toEqual(HttpStatus.UNAUTHORIZED);
        expect(result.body).toEqual({
            error: buildErrorJson(new UnauthorizedError())
        });
    });

    it("should logout authenticated user", async (): Promise<void> => {
        const user = await createUser();
        const cookie = await authenticateUser(user);

        const result = await request(server)
            .post('/auth/logout')
            .set('Cookie', [cookie])

        expect(result.status).toEqual(HttpStatus.OK);

        const checkLogout = await request(server)
            .post('/auth/logout')
            .set('Cookie', [cookie])

        expect(checkLogout.body).toEqual({
            error: buildErrorJson(new UnauthorizedError())
        });
        expect(checkLogout.status).toEqual(HttpStatus.UNAUTHORIZED);
    });
});
