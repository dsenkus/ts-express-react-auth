import * as bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "./errors";

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
