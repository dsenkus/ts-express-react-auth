import { query } from "../../db";
import { encryptPassword, firstOrError } from "../../utils";
import { User } from "../../../types/database";
import { UserCreateData } from "../../../types/common";

export async function findUserByEmail(email: string): Promise<User> {
    const sql = 'SELECT * FROM users WHERE email = $1';
    return firstOrError<User>(query(sql, [email]));
}

export async function insertUser({ name, email, password }: UserCreateData): Promise<User> {
    const sql = 'INSERT INTO users(name, email, password) VALUES($1, $2, $3) RETURNING *';
    const encryptedPassword = await encryptPassword(password);
    return firstOrError<User>(query(sql, [name, email, encryptedPassword]));
}

export async function confirmUser(token: string): Promise<User> {
    const sql = 'UPDATE users SET confirmed = true WHERE confirm_token = $1 AND confirmed = false RETURNING *';
    return firstOrError<User>(query(sql, [token]));
}

export async function generateResetPasswordToken(email: string): Promise<User> {
    const sql = `UPDATE users SET 
        reset_password_token = md5(random()::text),
        reset_password_created_at = current_timestamp
        WHERE email = $1 RETURNING *`;
    return firstOrError<User>(query(sql, [email]));
}

export async function resetPasswordWithToken(id: string, token: string, password: string): Promise<User> {
    const sql = `UPDATE users SET
        password = $1,
        reset_password_token = md5(random()::text),
        reset_password_created_at = current_timestamp
        WHERE id = $2 AND reset_password_token = $3 RETURNING *`;
    const encryptedPassword = await encryptPassword(password);
    return firstOrError(query(sql, [encryptedPassword, id, token]));
}
