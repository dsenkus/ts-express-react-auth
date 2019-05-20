import * as config from 'config';
import * as winston from 'winston';

export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: []
});

if(config.get('logger.logToFile')) {
    logger.add(new winston.transports.File({ 
        filename: 'error.log', 
        level: 'error' 
    }));
    logger.add(new winston.transports.File({ 
        filename: 'combined.log' 
    }));
}

if(config.get('logger.logToConsole')) {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}
