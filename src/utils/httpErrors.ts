import * as HttpStatus from 'http-status-codes';
import { ValidationError as YupValidationError } from 'yup';

/**
 * Base class for all errors.
 */
export class ApplicationError extends Error {
    public status: number;
    public data: any;
    public type: string;

    public constructor(message?: string, data?: any, status?: number) {
        super();
        this.type = this.constructor.name;
        this.message = message || 'Something went wrong. Please try again.';
        this.status = status || HttpStatus.UNPROCESSABLE_ENTITY;
        this.data = data || null;
    }
}

export class InternalServerError extends ApplicationError {
    public constructor(message: string = 'Internal Server Error', data?: any) {
        super(message, data, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

export class InvalidAuthCredentialsError extends ApplicationError {
    public constructor(data?: any) {
        super('Invalid Email or Password', data, HttpStatus.UNPROCESSABLE_ENTITY);
    }
}

export class InvalidAuthTokenError extends ApplicationError {
    public constructor(data?: any) {
        super('Invalid Authorization Token', data, HttpStatus.UNAUTHORIZED);
    }
}

export class InvalidPasswordResetTokenError extends ApplicationError {
    public constructor(data?: any) {
        super('Invalid Password Reset Token', data, HttpStatus.UNPROCESSABLE_ENTITY);
    }
}

export class UnauthorizedError extends ApplicationError {
    public constructor(data?: any) {
        super('Not Authorized', data, HttpStatus.UNAUTHORIZED);
    }
}

export class InvalidConfirmationTokenError extends ApplicationError {
    public constructor(data?: any) {
        super('Invalid Confirmation Token', data, HttpStatus.UNPROCESSABLE_ENTITY);
    }
}

/**
 * Get default app error.
 */
function getDefaultError(): JsonError {
    return {
        type: 'InternalServerError',
        message: 'Internal Server Error',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
    }
}

/**
 * Builds ValidationError from `Yup` error. 
 */
function getValidationError(error: YupValidationError): JsonError {
    return {
        type: 'ValidationError',
        message: error.message,
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        data: error.inner.reduce((acc, item): any => ({
            ...acc,
            [item.path]: item.message
        }), {})
    }
}

/**
 * Builds error in JSON format. 
 */
export function buildErrorJson(error: any): JsonError {
    // check for Yup validation errors
    if(error instanceof YupValidationError) return getValidationError(error);

    // check if error contains necessary fields
    if(!('message' in error || 'status' in error || 'type' in error)) {
        return getDefaultError();
    }

    const json: JsonError = {
        type: error.type,
        message: error.message,
        status: error.status,
    }

    if(error.data) {
        json.data = error.data;
    }

    return json;
}
