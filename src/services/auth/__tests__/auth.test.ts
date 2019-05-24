import * as HttpStatus from 'http-status-codes';
import * as faker from 'faker';
import * as request from 'supertest';
import app from '../../../app';
import { buildErrorJson, InvalidAuthCredentialsError, UnauthorizedError, InvalidConfirmationTokenError, InvalidPasswordResetTokenError } from '../../../utils/httpErrors';
import { createUser, authenticateUser, buildUserData } from '../../../../test/utils';
import { isPasswordValid, generateResetPasswordParam } from '../../../utils';
import users from '../../../entities/users';
import { User } from '../../../../types/database';

describe("GET /auth/whoami", (): void => {
    it("should fail for unauthenticated users", async (): Promise<void> => {
        const result = await request(app).get('/auth/whoami');

        expect(result.body).toEqual({
            error: buildErrorJson(new UnauthorizedError())
        });
        expect(result.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it("should return authenticated user data", async (): Promise<void> => {
        const user = await createUser();
        const cookie = await authenticateUser(user);
        const result = await request(app)
            .get('/auth/whoami')
            .set('Cookie', [cookie])

        expect(result.body.user).toEqual(users.serializeAuthUser(user));
        expect(result.status).toEqual(HttpStatus.OK);
    });
});

describe("POST /auth/login", (): void => {
    it("it should fail when email invalid", async (): Promise<void> => {
        const result = await request(app)
            .post('/auth/login')
            .send({email: 'invalid@email.com', password: 'invalid'});
        
        expect(result.body).toEqual({
            error: buildErrorJson(new InvalidAuthCredentialsError())
        });
        expect(result.status).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it("it should fail when password invalid", async (): Promise<void> => {
        const { email } = await createUser();

        const result = await request(app)
            .post('/auth/login')
            .send({email, password: 'badpassword'});
        
        expect(result.body).toEqual({
            error: buildErrorJson(new InvalidAuthCredentialsError())
        });
        expect(result.status).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it("it should fail when user not confirmed", async (): Promise<void> => {
        const data = buildUserData();
        await users.insertUser(data);

        const result = await request(app)
            .post('/auth/login')
            .send({ email: data.email, password: data.password });
        
        expect(result.status).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
        expect(result.body).toEqual({
            error: buildErrorJson(new InvalidAuthCredentialsError())
        });
    });

    it("it should set HttpOnly session cookie and respond with user data when success", async (): Promise<void> => {
        const user = await createUser();
        const { email, password } = user;

        const result = await request(app)
            .post('/auth/login')
            .send({ email, password });

        expect(result.status).toEqual(HttpStatus.OK);
        expect(result.body.user).toEqual(users.serializeAuthUser(user));
        expect(result.header['set-cookie'][0]).toMatch(/connect\.sid/);
        expect(result.header['set-cookie'][0]).toMatch(/HttpOnly/);
    });
});

describe("POST /auth/register", (): void => {
    it("should create new unconfirmed user", async (): Promise<void> => {
        const { name, email, password } = buildUserData();

        const result = await request(app)
            .post('/auth/register')
            .send({ name, email, password });

        const user = await users.findUserByEmail(email) as User;
        expect(result.status).toEqual(HttpStatus.CREATED);
        expect(user.email).toEqual(email);
        expect(user.name).toEqual(name);
        expect(user.confirmed).toBeFalsy();
    });

    it("should fail when data is not provided", async (): Promise<void> => {
        const [name, email, password] = ['', '', ''];

        const result = await request(app)
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

        const result = await request(app)
            .post('/auth/register')
            .send({ name, email, password });

        // const user = await findUserByEmail(email);
        expect(result.status).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
        expect(result.body.error.data.email).toMatch(/taken/);
    });
});

describe("POST /auth/logout", (): void => {
    it("should fail for unauthenticated users", async (): Promise<void> => {
        const result = await request(app).post('/auth/logout');

        expect(result.status).toEqual(HttpStatus.UNAUTHORIZED);
        expect(result.body).toEqual({
            error: buildErrorJson(new UnauthorizedError())
        });
    });

    it("should logout authenticated user", async (): Promise<void> => {
        const user = await createUser();
        const cookie = await authenticateUser(user);

        const result = await request(app)
            .post('/auth/logout')
            .set('Cookie', [cookie])

        expect(result.status).toEqual(HttpStatus.OK);

        const checkLogout = await request(app)
            .get('/auth/whoami')
            .set('Cookie', [cookie])

        expect(checkLogout.status).toEqual(HttpStatus.UNAUTHORIZED);
        expect(checkLogout.body).toEqual({
            error: buildErrorJson(new UnauthorizedError())
        });
    });
});

describe("POST /auth/confirm", (): void => {
    it("should confirm user", async (): Promise<void> => {
        const data = buildUserData();
        const user = await users.insertUser(data);
        expect(user.confirmed).toBeFalsy();

        const result = await request(app)
            .post('/auth/confirm')
            .send({ token: user.confirm_token });

        expect(result.status).toEqual(HttpStatus.OK);

        const confirmedUser = await users.findUserByEmail(user.email) as User;
        expect(confirmedUser.email).toEqual(user.email);
        expect(confirmedUser.confirmed).toBeTruthy();
    });

    it("should return error when token invalid", async (): Promise<void> => {
        const result = await request(app)
            .post('/auth/confirm')
            .send({ token: 'invalid' });

        expect(result.status).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
        expect(result.body).toEqual({
            error: buildErrorJson(new InvalidConfirmationTokenError())
        });
    });
});

describe("POST /auth/reset_password", (): void => {
    it("it should send password reset email if only email param is provided", async (): Promise<void> => {
        const { email } = await createUser();

        const result = await request(app)
            .post('/auth/reset_password')
            .send({ email });

        expect(result.status).toEqual(HttpStatus.OK);
    });

    it("should reset password if token and password is provided", async (): Promise<void> => {
        const user = await createUser();
        const newPassword = faker.random.alphaNumeric(10)  
        const token = generateResetPasswordParam(user)

        const result = await request(app)
            .post(`/auth/reset_password/${token}`)
            .send({ password: newPassword });

        const updatedUser = await users.findUserByEmail(user.email) as User;

        expect(result.status).toEqual(HttpStatus.OK);
        expect(updatedUser.password).not.toEqual(user.password);
        const passwordValid = await isPasswordValid(newPassword, updatedUser.password);
        expect(passwordValid).toBeTruthy();
    });

    it("should validate new password", async (): Promise<void> => {
        const user = await createUser();
        const newPassword = faker.random.alphaNumeric(3)  
        const token = generateResetPasswordParam(user)

        const result = await request(app)
            .post(`/auth/reset_password/${token}`)
            .send({ password: newPassword });


        expect(result.status).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
        expect(result.body.error.data.password).toMatch(/must be at least/);

        // check if password has not changed
        const updatedUser = await users.findUserByEmail(user.email) as User;
        const passwordValid = await isPasswordValid(user.password, updatedUser.password);
        expect(passwordValid).toBeTruthy();
    });

    it("should fail if token not valid", async (): Promise<void> => {
        const { email, password } = await createUser();

        const result = await request(app)
            .post('/auth/reset_password/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
            .send({ password: faker.random.alphaNumeric(10) });

        expect(result.status).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
        expect(result.body).toEqual({
            error: buildErrorJson(new InvalidPasswordResetTokenError())
        });

        // check if password has not changed
        const updatedUser = await users.findUserByEmail(email) as User;
        const passwordValid = await isPasswordValid(password, updatedUser.password);
        expect(passwordValid).toBeTruthy();
    });
});
