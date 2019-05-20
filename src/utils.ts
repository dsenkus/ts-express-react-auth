import * as config from 'config';
import * as bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "./errors";

/**
 * Returns reset password link.
 */
export const createPasswordResetLink = (token: string): string => (
    `${config.get('app.siteUrl')}/password-reset/${token}`
);

/**
 * Validates user password.
 */
export const isPasswordValid = async (password: string, encryptedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, encryptedPassword);
}

/**
 * Generates password reset token for given user.
 * 
 * The param will consist of 32 character reset password token followed by user id
 */
export const generateResetPasswordParam = (user: User): string => {
    return `${user.reset_password_token}${user.id}`;
}

/**
 * Parses password reset endpoint parameter into user.id and user.reset_password_token.
 */
export const parseResetPasswordParam = (param: string): { id: string; token: string } => {
    if(param.length !== 68) throw new Error('Invalid reset password param');

    return {
        id: param.substr(32),
        token: param.substr(0, 32),
    }
}

/**
 * Middleware, checks if current user is authenticated.
 */
export const isAuthenticated = (req: Request, res: Response, next: NextFunction): any => {
    if(req.user) return next();

    return next(new UnauthorizedError());
}

/**
 * Returns encrypted password.
 */
export const encryptPassword = (password: string): Promise<string> => bcrypt.hash(password, 10);
