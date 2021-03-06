import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as passport from 'passport';
import * as session from 'express-session';
import * as HttpStatus from 'http-status-codes';
import * as cors from 'cors';
import auth from './services/auth';
import { buildErrorJson } from './utils/httpErrors';
import { localAuthStrategy } from './services/auth/strategies/local';
import { NextFunction, Request, Response } from 'express';
import { redisStore } from './redis';
import { logger } from './logger';
import { DbError } from './db';
import { User } from '../types/database';

const app = express();

// session middleware
// ----------------------------------------------------------------------------- 
app.use(session({
    store: redisStore,
    secret: process.env.REDIS_SECRET,
    cookie: {
        secure: process.env.APP_SECURE_COOKIE === 'true',
        sameSite: 'lax',
    },
    resave: false,
    saveUninitialized: false
}))
// handle lost connection to Redis
app.use(function (req, res, next): void {
    if (!req.session) {
        return next(new Error('oh no')) // handle error
    }
    next() // otherwise continue
})

// passport middleware
// ----------------------------------------------------------------------------- 
passport.use('login', localAuthStrategy);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user: User, done): void => {
    done(null, user);
});

passport.deserializeUser((user: User, done): void => {
    done(null, user);
});

// Body-Parser middleware
// ----------------------------------------------------------------------------- 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Cors
// ----------------------------------------------------------------------------- 
// TODO: disable in production
app.use(cors({ 
    origin: true,
    credentials: true,
}));

// Routes
// ----------------------------------------------------------------------------- 
app.use('/auth', auth);

// Global Error handler
// ----------------------------------------------------------------------------- 
app.use((err: any, req: Request, res: Response, next: NextFunction): void => {
    const error = buildErrorJson(err);

    if(err instanceof DbError) {
        logger.log('warn', `DbError: ${err}`, { error: err })
    } else if(!error.status || error.status === HttpStatus.INTERNAL_SERVER_ERROR) {
        logger.log('error', `Global Error Handler: ${err}`, { error: err })
    }

    res.status(error.status).json({ error });
})

// Application error logging.
app.on('error', (error): void => {
    logger.log('error', `Application Error Handler: ${error}`, { error });
});

export default app;
