import * as bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "./utils/httpErrors";
import { QueryResult } from "pg";
import { DbError, query } from './db';
import { User } from '../types/database';

/**
 * Creates an object composed of the picked `object` properties
 * Throws an error if property is undefined.
 * 
 * @param object The source object.
 * @param props The properties to pick. 
 */
export function pick<T extends object, U extends keyof T>(object: T, props: U[]): Pick<T, U> {
    return props.reduce((acc, prop): any => {
        if(typeof object[prop] === 'undefined') {
            throw new Error(`Pick: '${prop}' is undefined in ${JSON.stringify(object)}`);
        }
        return { ...acc, [prop]: object[prop]}
    }, {});
}

/**
 * Returns first row from QueryResult or null.
 * 
 * @param promise node-postgres Promsie<QueryResult>
 */
export async function firstOrNull<T>(promise: Promise<QueryResult>): Promise<T | null> {
    const result = await promise;
    return result.rowCount > 0 ? result.rows[0] as T : null;
}

/**
 * Returns first row from QueryResult or throws an error.
 * 
 * @param result node-postgres QueryResult
 */
export async function firstOrError<T>(promise: Promise<QueryResult>): Promise<T> {
    const result = await promise;
    if(result.rowCount < 1) throw new DbError(`Query returned empty result set (${result.command})`);
    return result.rows[0];
}

/**
 * Returns first row from QueryResult or throws an error.
 * 
 * @param result node-postgres QueryResult
 */
export async function queryFirstOrError<T>(sql: string, values?: any[]): Promise<T> {
    const result = await query(sql, values);
    if(result.rowCount < 1) throw new DbError(`Query returned empty result set`, sql, values);
    return result.rows[0];
}

/**
 * Returns reset password link.
 */
export const createPasswordResetLink = (token: string): string => (
    `${process.env.APP_SITE_URL}/password-reset/${token}`
);

/**
 * Validates user password.
 */
export async function isPasswordValid(password: string, encryptedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, encryptedPassword);
}

/**
 * Generates password reset token for given user.
 * 
 * The param will consist of 32 character reset password token followed by user id
 */
export const generateResetPasswordParam = (user: User): string => (`${user.reset_password_token}${user.id}`);

/**
 * Parses password reset endpoint parameter into user.id and user.reset_password_token.
 */
export function parseResetPasswordParam(param: string): { id: string; token: string } {
    if(param.length !== 68) throw new Error('Invalid reset password param');

    return {
        id: param.substr(32),
        token: param.substr(0, 32),
    }
}

/**
 * Middleware, checks if current user is authenticated.
 */
export function isAuthenticated(req: Request, res: Response, next: NextFunction): any {
    if(req.user) return next();

    return next(new UnauthorizedError());
}

/**
 * Returns encrypted password.
 */
export function encryptPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
}
