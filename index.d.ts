declare interface JWTAuthToken {
    uid: string;
}

declare interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    confirmed: boolean;
    reset_password_token: string;
    reset_password_expires: string;
    created_at: string;
    updated_at: string;
}

declare interface JsonError {
    type: string;
    status: number;
    message: string;
    data?: any;
}
