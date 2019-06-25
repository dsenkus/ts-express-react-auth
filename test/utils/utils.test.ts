import { createUser } from "../utils";
import { generateResetPasswordParam, parseResetPasswordParam, pick } from "../../src/utils";

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

describe("pick", (): void => {
    interface Result {
        prop1: string;
        prop2: string;
    }

    it('should return correct object structure', (): void => {
        const testObj = { prop1: 'test', prop2: 'test', prop3: 'test' };
        const result: Result = pick(testObj, ['prop1', 'prop2'])
        expect(result).toEqual({ prop1: 'test', 'prop2': 'test' });
    });

    it('should throw an error when property is undefined', (): void => {
        // @ts-ignore
        expect((): Result => pick({ prop1: 'test' }, ['prop1', 'prop2'])).toThrowError(/'prop2' is undefined/)
    });
});
