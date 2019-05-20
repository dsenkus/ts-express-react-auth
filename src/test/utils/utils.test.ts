import { createUser } from "../utils";
import { generateResetPasswordParam, parseResetPasswordParam } from "../../utils";

describe("generateResetPasswordParam", (): void => {
    it("should generate correct value", async (): Promise<void> => {
        const user = await createUser();
        expect(generateResetPasswordParam(user)).toEqual(`${user.reset_password_token}${user.id}`);
    });
});

describe("parseResetPasswordParam", (): void => {
    it("should parse and return correct value", async (): Promise<void> => {
        const user = await createUser();
        const param = generateResetPasswordParam(user);
        expect(parseResetPasswordParam(param)).toEqual({
            id: user.id,
            token: user.reset_password_token
        });
    });

    it("should throw error if invalid format param is provided", async (): Promise<void> => {
        const user = await createUser();
        const param = generateResetPasswordParam(user) + '!';
        expect((): void => { parseResetPasswordParam(param) }).toThrow();
    });
});
