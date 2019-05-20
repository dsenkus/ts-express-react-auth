import * as faker from 'faker';
import * as dateFns from 'date-fns';
import { buildUserData, createUser } from '../utils';
import { confirmUser, findUserByEmail, generateResetPasswordToken, insertUser, resetPasswordWithToken } from '../../queries/users';
import { isPasswordValid } from '../../utils';

describe("users queries", (): void => {
    describe("findUserByEmail", (): void => {
        it("should find correct user", async (): Promise<void> => {
            const data = buildUserData();
            const user = await insertUser(data);
            await insertUser(buildUserData());

            const result = await findUserByEmail(data.email) as User;

            expect(result.email).toEqual(user.email);
            expect(result.name).toEqual(user.name);
            expect(result.confirmed).toEqual(user.confirmed);
        });

        it("should throw error when user not found", async (): Promise<void> => {
            const result = findUserByEmail('wrong@email.com');
            await expect(result).rejects.toThrowError(/empty result/);
        });
    });

    describe("insertUser", (): void => {
        it("should insert user to database", async (): Promise<void> => {
            const data = buildUserData();
            const user = await insertUser(data);

            expect(user.email).toEqual(data.email);
            expect(user.name).toEqual(data.name);
            expect(user.confirmed).toEqual(false);
            expect(user.confirm_token.length).toEqual(32);
        });

        it("should throw exception when duplicate email was provided", async (): Promise<void> => {
            const data1 = buildUserData();
            const data2 = buildUserData({ email: data1.email });

            try {
                await insertUser(data1);
                await insertUser(data2);
            } catch(e) {
                expect(e.name).toEqual('error');
            }
        });
    });

    describe("confirmUser", (): void => {
        it("should set confirmed=true when valid token", async (): Promise<void> => {
            const data = buildUserData();
            const user = await insertUser(data);
            const confirmedUser = await confirmUser(user.confirm_token);

            expect(confirmedUser.email).toEqual(data.email);
            expect(confirmedUser.confirmed).toEqual(true);
        });

        it("should throw werror when token invalid", async (): Promise<void> => {
            const confirmedUser = confirmUser('invalidtoken');
            await expect(confirmedUser).rejects.toThrowError(/empty result/);
        });
    });

    describe("generateResetPasswordToken", (): void => {
        it("should generate new token and set it's creation date", async (): Promise<void> => {
            const user = await createUser();
            const result = await generateResetPasswordToken(user.id);

            expect(result.reset_password_token).not.toEqual(user.reset_password_token);
            expect(result.reset_password_created_at).not.toEqual(user.reset_password_created_at);
            expect(result.reset_password_token.length).toEqual(32);
            expect(dateFns.differenceInMilliseconds(new Date(), result.reset_password_created_at)).toBeLessThan(100);
        });

        it("should throw error when user id invalid", async (): Promise<void> => {
            const confirmedUser = generateResetPasswordToken(faker.random.uuid());
            await expect(confirmedUser).rejects.toThrowError(/empty result/);
        });
    });

    describe("resetPasswordWithToken", (): void => {
        it("should change password and generate new token", async (): Promise<void> => {
            const user = await createUser();
            const result = await resetPasswordWithToken(user.id, user.reset_password_token, 'newpassword') as User;

            expect(result.reset_password_token).not.toEqual(user.reset_password_token);
            expect(result.reset_password_created_at).not.toEqual(user.reset_password_created_at);
            expect(result.reset_password_token.length).toEqual(32);
            expect(dateFns.differenceInMilliseconds(new Date(), result.reset_password_created_at)).toBeLessThan(100);
            const passwordValid = await isPasswordValid('newpassword', result.password);
            expect (passwordValid).toBeTruthy();
        });

        it("should throw error if user id/reset_password_token is incorrect", async (): Promise<void> => {
            const user = await createUser();
            const result = resetPasswordWithToken(user.id, 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'newpassword');
            await expect(result).rejects.toThrowError(/empty result/);
        });
    });
});
