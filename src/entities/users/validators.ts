import * as yup from 'yup';
import * as bcrypt from 'bcrypt';
import { findUserByEmail } from './queries';
import { User } from '../../../types/database';

const userNameValidator = yup.string().required().min(5).max(256);

const userPasswordValidator = yup.string().required().min(5).max(256);

const userCurrentPasswordValidator = (user: User): yup.StringSchema => {
    return yup.string().required().test({
        name: 'match',
        message: 'password is incorrect',
        test: async (value: any): Promise<boolean> => {
            return await bcrypt.compare(value, user.password)
        }
    });
}

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
    name: userNameValidator,
    email: userEmailValidator,
    password: userPasswordValidator,
});

export const userUpdateSchema = yup.object().shape({
    name: userNameValidator,
});

export const userPasswordResetSchema = yup.object({
    password: userPasswordValidator
});

export const userPasswordChangeSchema = (user: User) => yup.object({
    password: userPasswordValidator,
    currentPassword: userCurrentPasswordValidator(user),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password'), ''], 'passwords do not match')
        .required('confirm password is required')
});

export const userDeleteAccountSchema = (user: User) => yup.object({
    password: userCurrentPasswordValidator(user),
});
