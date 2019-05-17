import * as passport from 'passport';
import Router from 'express-promise-router';
import { insertUser, confirmUser, findUserByEmail, resetPasswordWithToken } from '../queries/users';
import { InvalidAuthCredentialsError, InvalidConfirmationTokenError, InvalidPasswordResetTokenError } from '../errors';
import { userCreateSchema, userPasswordChangeSchema } from '../validators/users';
import { isAuthenticated } from '../utils';
import { parseResetPasswordParam } from '../utils';
import { sendPasswordResetEmail } from '../mail/passwordResetEmail';

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
    await insertUser(req.body);
    res.status(200).send();
});

// -----------------------------------------------------------------------------
// POST /auth/confirm :: Confirm user account
// -----------------------------------------------------------------------------

router.post('/confirm', async (req, res): Promise<void> => {
    const { token } = req.body;

    const user = await confirmUser(token);
    if(!user) throw new InvalidConfirmationTokenError();

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

    const user = await findUserByEmail(email);
    if(user) sendPasswordResetEmail(user);

    res.status(200).send();
});

// -----------------------------------------------------------------------------
// POST /auth/reset_password/:token :: Reset user password
// -----------------------------------------------------------------------------

router.post('/reset_password/:token', async (req, res): Promise<void> => {
    const { password } = req.body;
    const { token } = req.params;

    // parse token
    const tokenData = parseResetPasswordParam(token);
    if(!tokenData) throw new InvalidPasswordResetTokenError();

    // validate password
    await userPasswordChangeSchema.validate(req.body, { abortEarly: false });

    // update password
    const user = await resetPasswordWithToken(tokenData.id, tokenData.token, password);
    if(!user) throw new InvalidPasswordResetTokenError();

    res.status(200).send();
});

export default router;
