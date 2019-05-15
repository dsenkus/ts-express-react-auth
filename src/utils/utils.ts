import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { InvalidAuthTokenError } from './errors';

// returns encrypted password
export const encryptPassword = (password: string): Promise<string> => bcrypt.hash(password, 10);

// returns JWT auth token for given user id
export const createAuthToken = (userId: string): string => {
    const data: JWTAuthToken = {
        uid: userId
    }

    return jwt.sign(data, process.env.APP_SECRET, {
        // expiresIn: 3600
    })
}

// tries to validate JWT auth token or throws an error
export const validateAuthToken = (token: string): JWTAuthToken => {
    try {
        return jwt.verify(token, process.env.APP_SECRET) as JWTAuthToken
    } catch (e) {
        throw new InvalidAuthTokenError()
    }
}
