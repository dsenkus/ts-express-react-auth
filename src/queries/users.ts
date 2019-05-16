import { query } from "../db";
import { encryptPassword } from "../utils";

export const findUserByEmail = async (email: string): Promise<User> => {
    const sql = 'SELECT * FROM users WHERE email = $1';
    const result = await query(sql, [email]);
    return result.rows[0] as User;
}

export const insertUser = async(name: string, email: string, password: string): Promise<User> => {
    const sql = 'INSERT INTO users(name, email, password) VALUES($1, $2, $3) RETURNING *';
    const encryptedPassword = await encryptPassword(password);
    const result = await query(sql, [name, email, encryptedPassword]);
    return result.rows[0] as User;
}

export const confirmUser = async(id: string): Promise<User> => {
    const sql = 'UPDATE users SET confirmed = true WHERE id = $1 RETURNING *';
    const result = await query(sql, [id]);
    return result.rows[0] as User;
}
