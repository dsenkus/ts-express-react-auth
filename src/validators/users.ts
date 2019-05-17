import * as yup from 'yup';
import { findUserByEmail } from '../queries/users';

const userPasswordValidator = yup.string().required().min(5).max(256);

const userEmailValidator = yup.string().required().email().max(256).test({
    name: 'taken',
    message: 'email already taken',
    test: async (email: string): Promise<boolean> => {
        // check if email already taken
        const user = await findUserByEmail(email);
        return !Boolean(user);
    }
});

export const userCreateSchema = yup.object().shape({
    name: yup.string().required().min(5).max(256),
    email: userEmailValidator,
    password: userPasswordValidator,
});

export const userPasswordChangeSchema = yup.object({
    password: userPasswordValidator
});
