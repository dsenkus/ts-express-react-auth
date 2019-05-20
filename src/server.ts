import * as config from 'config';
import app from "./app";
import { logger } from './logger';

process.on("uncaughtException", (error): void => {
    logger.log('error', `Uncaught Exception: ${error}`, { error })
    process.exit(1);
});
  
process.on("unhandledRejection", (error): void => {
    logger.log('error', `Unhandled Rejection: ${error}`, { error })
    process.exit(1);
});

export const server = app.listen(config.get('app.port'), (): void => {
    logger.log('info', `Server started on port ${config.get('app.port')}`);
});
