import { query } from "../../db";
import { encryptPassword, firstOrError, queryFirstOrError } from "../../utils";
import { User } from "../../../types/database";
import { UserCreateData, UserUpdateData } from "../../../types/common";

export async function findUserByEmail(email: string): Promise<User> {
    const sql = 'SELECT * FROM users WHERE email = $1';
    return queryFirstOrError<User>(sql, [email]);
}

export async function insertUser({ name, email, password }: UserCreateData): Promise<User> {
    const sql = 'INSERT INTO users(name, email, password) VALUES($1, $2, $3) RETURNING *';
    const encryptedPassword = await encryptPassword(password);
    return queryFirstOrError<User>(sql, [name, email, encryptedPassword]);
}

export async function updateUserProfile(id: string, { name }: UserUpdateData): Promise<User> {
    const sql = 'UPDATE users SET name = $1 WHERE id = $2 RETURNING *';
    return queryFirstOrError<User>(sql, [name, id]);
}


export async function confirmUser(token: string): Promise<User> {
    const sql = 'UPDATE users SET confirmed = true WHERE confirm_token = $1 AND confirmed = false RETURNING *';
    return queryFirstOrError<User>(sql, [token]);
}

export async function generateResetPasswordToken(email: string): Promise<User> {
    const sql = `UPDATE users SET 
        reset_password_token = md5(random()::text),
        reset_password_created_at = current_timestamp
        WHERE confirmed = true AND email = $1 RETURNING *`;
    return queryFirstOrError<User>(sql, [email]);
}

export async function resetPasswordWithToken(id: string, token: string, password: string): Promise<User> {
    const sql = `UPDATE users SET
        password = $1,
        reset_password_token = md5(random()::text),
        reset_password_created_at = current_timestamp
        WHERE confirmed = true AND id = $2 AND reset_password_token = $3 RETURNING *`;
    const encryptedPassword = await encryptPassword(password);
    return queryFirstOrError(sql, [encryptedPassword, id, token]);
}

export async function changePassword(id: string, password: string): Promise<User> {
    const sql = `UPDATE users SET password = $1 WHERE confirmed = true AND id = $2 RETURNING *`;
    const encryptedPassword = await encryptPassword(password);
    return queryFirstOrError(sql, [encryptedPassword, id]);
}

export async function deleteUser(id: string): Promise<string> {
    const sql = 'DELETE FROM users WHERE id = $1 RETURNING id';
    return queryFirstOrError<string>(sql, [id]);
}
