import * as config from 'config';
import { Pool, QueryResult } from 'pg';

const pool = new Pool({ connectionString: config.get('db.uri') });

export const query = (text: string, values?: any[]): Promise<QueryResult> => pool.query(text, values);
export const dbClose = (): void => { pool.end() }
