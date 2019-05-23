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
    reset_password_created_at: string;
    created_at: string;
    updated_at: string;
}

declare type UserAuthData = Pick<User, 'id' | 'email' | 'name'>
declare type UserCreateData = Pick<User, 'email' | 'password' | 'name'>
declare type UserCreateDataOptional = Partial<UserCreateData>

declare interface JsonError {
    type: string;
    status: number;
    message: string;
    data?: any;
}

//----------------------------------------------------------------------------- 
// Response Schema
//----------------------------------------------------------------------------- 
declare interface BaseResponse {
    success: boolean;
}
declare interface AuthWhoamiResponse extends BaseResponse {
    user: UserAuthData;
}
declare interface AuthRegisterResponse extends BaseResponse {}
declare interface AuthConfirmResponse extends BaseResponse {}
declare interface AuthLoginResponse extends BaseResponse {
    user: UserAuthData;
}
declare interface AuthLogoutResponse extends BaseResponse {}
declare interface AuthResetPasswordResponse extends BaseResponse {}
