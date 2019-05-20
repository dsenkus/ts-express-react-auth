import * as config from 'config';
import { Pool, QueryResult } from 'pg';
import { logger } from './logger';

const pool = new Pool({ connectionString: config.get('db.uri') });
logger.log('info', 'Database connection initiated');

export const query = (text: string, values?: any[]): Promise<QueryResult> => {
    return pool.query(text, values)
        .catch((err): Promise<any> => {
            logger.log('error', `SQL Error: ${err.message}`, {
                query: text,
                values,
                error: err
            });
            throw err;
        })
}
export const dbClose = (): void => { 
    pool.end();
    logger.log('info', 'Database connection closed');
}
