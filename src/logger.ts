import * as winston from 'winston';

export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: []
});

if(process.env.LOGGER_LOG_TO_FILE === 'true') {
    logger.add(new winston.transports.File({ 
        filename: 'error.log', 
        level: 'error' 
    }));
    logger.add(new winston.transports.File({ 
        filename: 'combined.log' 
    }));
}

if(process.env.LOGGER_LOG_TO_CONSOLE === 'true') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}
