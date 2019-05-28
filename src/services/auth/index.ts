import * as passport from 'passport';
import Router from 'express-promise-router';
import users from '../../entities/users';
import { InvalidAuthCredentialsError, InvalidConfirmationTokenError, InvalidPasswordResetTokenError } from '../../utils/httpErrors';
import { userCreateSchema, userPasswordChangeSchema } from '../../entities/users/validators';
import { isAuthenticated } from '../../utils';
import { parseResetPasswordParam } from '../../utils';
import { sendPasswordResetEmail } from './mail/passwordResetEmail';
import { logger } from '../../logger';
import { AuthWhoamiResponse, AuthRegisterResponse, AuthConfirmResponse, AuthLoginResponse, AuthLogoutResponse, AuthResetPasswordResponse } from '../../../types/common';

const router = Router();

// -----------------------------------------------------------------------------
// GET /auth/whoami :: Return current authenticated user
// -----------------------------------------------------------------------------

router.get('/whoami', isAuthenticated, async (req, res): Promise<void> => {
    const user = req.user;

    const response: AuthWhoamiResponse = {
        success: true,
        user: users.serializeAuthUser(user)
    };
    res.json(response);
});

// -----------------------------------------------------------------------------
// POST /auth/register :: Create new user
// -----------------------------------------------------------------------------

router.post('/register', async (req, res): Promise<void> => {
    await userCreateSchema.validate(req.body, { abortEarly: false });
    const user = await users.insertUser(req.body);
    logger.log('info', `Registered user ${user.email}`);

    const response: AuthRegisterResponse = { success: true };
    res.status(201).json(response);
});

// -----------------------------------------------------------------------------
// POST /auth/confirm :: Confirm user account
// -----------------------------------------------------------------------------

router.post('/confirm', async (req, res): Promise<void> => {
    const { token } = req.body;

    try {
        const user = await users.confirmUser(token);
        logger.log('info', `Confirmed user ${user.email}`);
    } catch (err) {
        throw new InvalidConfirmationTokenError();
    }

    const response: AuthConfirmResponse = { success: true };
    res.json(response);
});

// -----------------------------------------------------------------------------
// POST /auth/login :: Authenticate user
// -----------------------------------------------------------------------------

router.post('/login', (req, res, next): any => {
    passport.authenticate('login', { }, (err, user, info): any => {
        if(err || !user) return next(new InvalidAuthCredentialsError());

        // create user session
        req.logIn(user, { }, (err): any => {
            if (err) return next(err);
            const response: AuthLoginResponse = { 
                success: true,
                user: users.serializeAuthUser(user)
            };

            if(req.body.rememberMe === true && req.session) {
                req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // Cookie expires after 30 days
            }

            res.json(response);
        });

    })(req, res, next);
});

// -----------------------------------------------------------------------------
// POST /auth/logout :: Delete user session
// -----------------------------------------------------------------------------

router.post('/logout', isAuthenticated, async (req, res): Promise<void> => {
    req.logOut();
    const response: AuthLogoutResponse = { success: true };
    res.json(response);
});

// -----------------------------------------------------------------------------
// POST /auth/reset_password :: Send reset password email
// -----------------------------------------------------------------------------

router.post('/reset_password', async (req, res): Promise<void> => {
    const { email } = req.body;

    try {
        const user = await users.findUserByEmail(email);
        sendPasswordResetEmail(user);
        logger.log('info', `Reset Password requested by ${user.email}`);
    } catch(err) {
        // ignore errors, so action always succeeds. Prevents email fishing.
    }

    const response: AuthResetPasswordResponse = { success: true };
    res.json(response);
});

// -----------------------------------------------------------------------------
// POST /auth/reset_password/:token :: Reset user password
// -----------------------------------------------------------------------------

router.post('/reset_password/:token', async (req, res): Promise<void> => {
    const { password } = req.body;
    const { token } = req.params;

    // validate password
    await userPasswordChangeSchema.validate(req.body, { abortEarly: false });

    // parse token
    try {
        const tokenData = parseResetPasswordParam(token);
        const user = await users.resetPasswordWithToken(tokenData.id, tokenData.token, password);
        logger.log('info', `Password reseted by ${user.email}`);
    } catch(err) {
        throw new InvalidPasswordResetTokenError();
    }

    const response: AuthResetPasswordResponse = { success: true };
    res.json(response);
});

export default router;
