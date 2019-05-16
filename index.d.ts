declare interface JWTAuthToken {
    uid: string;
}

declare interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    confirmed: boolean;
    confirm_token: string;
    reset_password_token: string;
    reset_password_expires: string;
    created_at: string;
    updated_at: string;
}

declare type UserCreateData = Pick<User, 'email' | 'password' | 'name'>
declare type UserCreateDataOptional = Partial<UserCreateData>

declare interface JsonError {
    type: string;
    status: number;
    message: string;
    data?: any;
}
