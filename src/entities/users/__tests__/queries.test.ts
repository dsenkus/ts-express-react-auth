import * as faker from 'faker';
import * as dateFns from 'date-fns';
import { buildUserData, createUser } from '../../../../test/utils';
import users from '..';
import { isPasswordValid } from '../../../utils';

describe("users queries", (): void => {
    describe("findUserByEmail", (): void => {
        it("should find correct user", async (): Promise<void> => {
            const data = buildUserData();
            const user = await users.insertUser(data);
            await users.insertUser(buildUserData());

            const result = await users.findUserByEmail(data.email) as User;

            expect(result.email).toEqual(user.email);
            expect(result.name).toEqual(user.name);
            expect(result.confirmed).toEqual(user.confirmed);
        });

        it("should throw error when user not found", async (): Promise<void> => {
            const result = users.findUserByEmail('wrong@email.com');
            await expect(result).rejects.toThrowError(/empty result/);
        });
    });

    describe("insertUser", (): void => {
        it("should insert user to database", async (): Promise<void> => {
            const data = buildUserData();
            const user = await users.insertUser(data);

            expect(user.email).toEqual(data.email);
            expect(user.name).toEqual(data.name);
            expect(user.confirmed).toEqual(false);
            expect(user.confirm_token.length).toEqual(32);
        });

        it("should throw exception when duplicate email was provided", async (): Promise<void> => {
            const data1 = buildUserData();
            const data2 = buildUserData({ email: data1.email });

            try {
                await users.insertUser(data1);
                await users.insertUser(data2);
            } catch(e) {
                expect(e.name).toEqual('error');
            }
        });
    });

    describe("confirmUser", (): void => {
        it("should set confirmed=true when valid token", async (): Promise<void> => {
            const data = buildUserData();
            const user = await users.insertUser(data);
            const confirmedUser = await users.confirmUser(user.confirm_token);

            expect(confirmedUser.email).toEqual(data.email);
            expect(confirmedUser.confirmed).toEqual(true);
        });

        it("should throw werror when token invalid", async (): Promise<void> => {
            const confirmedUser = users.confirmUser('invalidtoken');
            await expect(confirmedUser).rejects.toThrowError(/empty result/);
        });
    });

    describe("generateResetPasswordToken", (): void => {
        it("should generate new token and set it's creation date", async (): Promise<void> => {
            const user = await createUser();
            const result = await users.generateResetPasswordToken(user.id);

            expect(result.reset_password_token).not.toEqual(user.reset_password_token);
            expect(result.reset_password_created_at).not.toEqual(user.reset_password_created_at);
            expect(result.reset_password_token.length).toEqual(32);
            expect(dateFns.differenceInMilliseconds(new Date(), result.reset_password_created_at)).toBeLessThan(100);
        });

        it("should throw error when user id invalid", async (): Promise<void> => {
            const confirmedUser = users.generateResetPasswordToken(faker.random.uuid());
            await expect(confirmedUser).rejects.toThrowError(/empty result/);
        });
    });

    describe("resetPasswordWithToken", (): void => {
        it("should change password and generate new token", async (): Promise<void> => {
            const user = await createUser();
            const result = await users.resetPasswordWithToken(user.id, user.reset_password_token, 'newpassword') as User;

            expect(result.reset_password_token).not.toEqual(user.reset_password_token);
            expect(result.reset_password_created_at).not.toEqual(user.reset_password_created_at);
            expect(result.reset_password_token.length).toEqual(32);
            expect(dateFns.differenceInMilliseconds(new Date(), result.reset_password_created_at)).toBeLessThan(100);
            const passwordValid = await isPasswordValid('newpassword', result.password);
            expect (passwordValid).toBeTruthy();
        });

        it("should throw error if user id/reset_password_token is incorrect", async (): Promise<void> => {
            const user = await createUser();
            const result = users.resetPasswordWithToken(user.id, 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'newpassword');
            await expect(result).rejects.toThrowError(/empty result/);
        });
    });
});
