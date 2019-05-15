import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "./errors";

export const isAuthenticated = (req: Request, res: Response, next: NextFunction): any => {
    if(req.user) return next();

    return next(new UnauthorizedError());
}
