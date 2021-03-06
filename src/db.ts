import { Pool, QueryResult } from 'pg';
import { logger } from './logger';

const pool = new Pool({ connectionString: process.env.DB_URI });
logger.log('info', 'Database connection initiated');

export class DbError extends Error {
    public query: string;
    public values: any;

    public constructor(err: Error | string, query?: string, values?: any ) {
        if (typeof err === 'string') {
            super(err);
        } else {
            super(err.message);

            for(var prop in err) {
                if(err.hasOwnProperty(prop)) {
                    // @ts-ignore
                    this[prop] = err[prop];
                }
            }
        }

        if(query) this.query = query;
        if(values) this.values = values;

        logger.log('error', 'DbError', { error: err, query, values });
    }    
}

export function query(text: string, values?: any[]): Promise<QueryResult> {
    return pool.query(text, values)
        .catch((err): Promise<any> => {
            throw new DbError(err, text, values);
        })
}

export function dbClose(): void { 
    pool.end();
    logger.log('info', 'Database connection closed');
}
