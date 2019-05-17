import { query } from "../db";
import { encryptPassword } from "../utils";
import { QueryResult } from "pg";

/**
 * Returns first row from QueryResult or null.
 * 
 * @param result node-postgres QueryResult
 */
const firstOrNull = <T>(result: QueryResult): T => {
    return result.rowCount > 0 ? result.rows[0] as T : null;
}

export const findUserByEmail = async (email: string): Promise<User | null> => {
    const sql = 'SELECT * FROM users WHERE email = $1';
    const result = await query(sql, [email]);
    return firstOrNull<User>(result);
}

export const insertUser = async({ name, email, password }: UserCreateData): Promise<User> => {
    const sql = 'INSERT INTO users(name, email, password) VALUES($1, $2, $3) RETURNING *';
    const encryptedPassword = await encryptPassword(password);
    const result = await query(sql, [name, email, encryptedPassword]);
    return firstOrNull<User>(result);
}

export const confirmUser = async(token: string): Promise<User> => {
    const sql = 'UPDATE users SET confirmed = true WHERE confirm_token = $1 AND confirmed = false RETURNING *';
    const result = await query(sql, [token]);
    return firstOrNull<User>(result);
}

export const generateResetPasswordToken = async(id: string): Promise<User> => {
    const sql = `UPDATE users SET 
        reset_password_token = md5(random()::text),
        reset_password_created_at = current_timestamp
        WHERE id = $1 RETURNING *`;
    const result = await query(sql, [id]);
    return firstOrNull<User>(result);
}

export const resetPasswordWithToken = async (id: string, token: string, password: string): Promise<User | null> => {
    const sql = `UPDATE users SET
        password = $1,
        reset_password_token = md5(random()::text),
        reset_password_created_at = current_timestamp
        WHERE id = $2 AND reset_password_token = $3 RETURNING *`;
    const encryptedPassword = await encryptPassword(password);
    try {
        const result = await query(sql, [encryptedPassword, id, token]);
        return firstOrNull<User>(result);
    } catch(err) {
        return null;
    }
}
