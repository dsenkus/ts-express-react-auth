export interface User {
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
