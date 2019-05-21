import * as yup from 'yup';
import { findUserByEmail } from './queries';

const userPasswordValidator = yup.string().required().min(5).max(256);

const userEmailValidator = yup.string().required().email().max(256).test({
    name: 'taken',
    message: 'email already taken',
    test: async (email: string): Promise<boolean> => {
        // check if email already taken
        try {
            await findUserByEmail(email);
            return false;
        } catch(err) {
            return true;
        }
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