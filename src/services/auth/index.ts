import * as passport from 'passport';
import Router from 'express-promise-router';
import users from '../../entities/users';
import { InvalidAuthCredentialsError, InvalidConfirmationTokenError, InvalidPasswordResetTokenError } from '../../utils/httpErrors';
import { userCreateSchema, userPasswordChangeSchema } from '../../entities/users/validators';
import { isAuthenticated } from '../../utils';
import { parseResetPasswordParam } from '../../utils';
import { sendPasswordResetEmail } from './mail/passwordResetEmail';

const router = Router();

// -----------------------------------------------------------------------------
// GET /auth/whoami :: Return current authenticated user
// -----------------------------------------------------------------------------

router.get('/whoami', isAuthenticated, async (req, res): Promise<void> => {
    const user = req.user;

    res.send({
        ...user
    });
});

// -----------------------------------------------------------------------------
// POST /auth/register :: Create new user
// -----------------------------------------------------------------------------

router.post('/register', async (req, res): Promise<void> => {
    await userCreateSchema.validate(req.body, { abortEarly: false });
    try {
        await users.insertUser(req.body);
    } catch(err) { }
    res.status(200).send();
});

// -----------------------------------------------------------------------------
// POST /auth/confirm :: Confirm user account
// -----------------------------------------------------------------------------

router.post('/confirm', async (req, res): Promise<void> => {
    const { token } = req.body;

    try {
        await users.confirmUser(token);
    } catch (err) {
        throw new InvalidConfirmationTokenError();
    }

    res.status(200).send();
});

// -----------------------------------------------------------------------------
// POST /auth/login :: Authenticate user
// -----------------------------------------------------------------------------

router.post('/login', (req, res, next): any => {
    passport.authenticate('login', (err, user, info): any => {
        if(err || !user) return next(new InvalidAuthCredentialsError());

        // create user session
        req.logIn(user, (err): any => {
            if (err) return next(err);
            res.status(200).send();
        });

    })(req, res, next);
});

// -----------------------------------------------------------------------------
// POST /auth/logout :: Delete user session
// -----------------------------------------------------------------------------

router.post('/logout', isAuthenticated, async (req, res): Promise<void> => {
    req.logOut();
    res.status(200).send();
});

// -----------------------------------------------------------------------------
// POST /auth/reset_password :: Send reset password email
// -----------------------------------------------------------------------------

router.post('/reset_password', async (req, res): Promise<void> => {
    const { email } = req.body;

    try {
        const user = await users.findUserByEmail(email);
        sendPasswordResetEmail(user);
    } catch(err) {
        // ignore errors, always succeeds
    }

    res.status(200).send();
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
        await users.resetPasswordWithToken(tokenData.id, tokenData.token, password);
    } catch(err) {
        throw new InvalidPasswordResetTokenError();
    }

    res.status(200).send();
});

export default router;
