import { Pool, QueryResult } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URI })

export const query = (text: string, values?: any[]): Promise<QueryResult> => pool.query(text, values);
export const dbClose = (): void => { pool.end() }

