import { createUser, buildUserData } from '../utils';
import { findUserByEmail, insertUser, confirmUser } from '../../queries/users';

describe("users queries", (): void => {
    describe("findUserByEmail", (): void => {
        it("should find correct user", async (): Promise<void> => {
            const data = buildUserData();
            const user = await insertUser(data);
            await insertUser(buildUserData());

            const result = await findUserByEmail(data.email);

            expect(result.email).toEqual(user.email);
            expect(result.name).toEqual(user.name);
            expect(result.confirmed).toEqual(user.confirmed);
        });

        it("should return null when user not found", async (): Promise<void> => {
            const result = await findUserByEmail('wrong@email.com');
            expect(result).toBeNull();
        });
    });

    describe("insertUser", (): void => {
        it("should insert user to database", async (): Promise<void> => {
            const data = buildUserData();
            const user = await insertUser(data);

            expect(user.email).toEqual(data.email);
            expect(user.name).toEqual(data.name);
            expect(user.confirmed).toEqual(false);
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

        it("should return null when token invalid", async (): Promise<void> => {
            const confirmedUser = await confirmUser('invalidtoken');
            expect(confirmedUser).toEqual(null);
        });
    });
});
