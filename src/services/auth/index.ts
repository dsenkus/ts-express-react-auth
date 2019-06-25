import * as passport from 'passport';
import Router from 'express-promise-router';
import users from '../../entities/users';
import { InvalidAuthCredentialsError, InvalidConfirmationTokenError, InvalidPasswordResetTokenError } from '../../utils/httpErrors';
import { userCreateSchema, userPasswordResetSchema, userUpdateSchema, userPasswordChangeSchema, userDeleteAccountSchema } from '../../entities/users/validators';
import { isAuthenticated, generateResetPasswordParam } from '../../utils';
import { parseResetPasswordParam } from '../../utils';
import { sendPasswordResetEmail } from './mail/passwordResetEmail';
import { logger } from '../../logger';
import { AuthWhoamiResponse, AuthRegisterResponse, AuthConfirmResponse, AuthLoginResponse, AuthLogoutResponse, AuthRequestPasswordResetResponse, AuthDeleteAccountResponse, AuthUpdateProfileResponse } from '../../../types/common';
import { User } from '../../../types/database';
import { serializeAuthUser } from '../../entities/users/serializers';

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
    logger.log('info', `Registered user ${user.email} (confirmation token: ${user.confirm_token})`);

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
// POST /auth/request_password_reset :: Send reset password email
// -----------------------------------------------------------------------------

router.post('/request_password_reset', async (req, res): Promise<void> => {
    const { email } = req.body;

    try {
        const user = await users.generateResetPasswordToken(email);
        const token = generateResetPasswordParam(user);
        logger.log('info', `Reset Password requested by ${user.email} (reset token: ${token})`);
        if(process.env.APP_SEND_MAIL === 'true') sendPasswordResetEmail(user, token);
    } catch(err) {
        // ignore errors, so action always succeeds. Prevents email fishing.
    }

    const response: AuthRequestPasswordResetResponse = { success: true };
    res.json(response);
});

// -----------------------------------------------------------------------------
// POST /auth/change_password :: Change user password
// -----------------------------------------------------------------------------

router.post('/change_password', async (req, res): Promise<void> => {
    const { token, password, currentPassword, confirmPassword } = req.body;

    // validate password
    if(req.user)  {
        await userPasswordChangeSchema(req.user).validate({ password, currentPassword, confirmPassword }, { abortEarly: false });
        await users.changePassword(req.user.id, password);
        logger.log('info', `Password changed for ${req.user.email} (authenticated)`);
    } else if(token) {
        await userPasswordResetSchema.validate(req.body, { abortEarly: false });
        try {
            const tokenData = parseResetPasswordParam(token);
            const user = await users.resetPasswordWithToken(tokenData.id, tokenData.token, password);
            logger.log('info', `Password changed for ${user.email} (reset token)`);
        } catch(err) {
            throw new InvalidPasswordResetTokenError();
        }
    }


    const response: AuthRequestPasswordResetResponse = { success: true };
    res.json(response);
});

// -----------------------------------------------------------------------------
// POST /auth/update_profile :: Update user profile data
// -----------------------------------------------------------------------------

router.post('/update_profile', isAuthenticated, async (req, res, next): Promise<void> => {
    await userUpdateSchema.validate(req.body, { abortEarly: false });

    const user = await users.updateUserProfile(req.user.id, req.body);

    req.logIn(user, (err): any => {
        if (err) return next(err);

        const response: AuthUpdateProfileResponse = { 
            success: true,
            user: serializeAuthUser(user)
        };
        res.json(response);
    });
});

// -----------------------------------------------------------------------------
// POST /auth/delete_account :: Delete your account
// -----------------------------------------------------------------------------

router.post('/delete_account', isAuthenticated, async (req, res): Promise<void> => {
    const user: User = req.user;

    await userDeleteAccountSchema(user).validate(req.body, { abortEarly: false });
    await users.deleteUser(user.id);

    const response: AuthDeleteAccountResponse = { success: true };
    res.json(response);
});

export default router;
