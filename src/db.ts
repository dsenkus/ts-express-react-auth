import { Pool, QueryResult } from 'pg';

console.log("Connecting to ", process.env.DATABASE_URI);
const pool = new Pool({ connectionString: process.env.DATABASE_URI })

export const query = (text: string, values?: any[]): Promise<QueryResult> => pool.query(text, values);
export const dbClose = (): void => { pool.end() }

