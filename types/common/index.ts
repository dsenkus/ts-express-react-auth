import { User } from "../database";

export type UserAuthData = Pick<User, 'id' | 'email' | 'name'>
export type UserCreateData = Pick<User, 'email' | 'password' | 'name'>
export type UserCreateDataOptional = Partial<UserCreateData>

export interface JsonError {
    type: string;
    status: number;
    message: string;
    data?: any;
}

//----------------------------------------------------------------------------- 
// Response Schema
//----------------------------------------------------------------------------- 
export interface BaseResponse {
    success: boolean;
}
export interface AuthWhoamiResponse extends BaseResponse {
    user: UserAuthData;
}
export interface AuthRegisterResponse extends BaseResponse {}
export interface AuthConfirmResponse extends BaseResponse {}
export interface AuthLoginResponse extends BaseResponse {
    user: UserAuthData;
}
export interface AuthLogoutResponse extends BaseResponse {}
export interface AuthResetPasswordResponse extends BaseResponse {}
