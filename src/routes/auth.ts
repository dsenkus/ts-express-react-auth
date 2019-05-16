import * as passport from 'passport';
import Router from 'express-promise-router';
import { insertUser, confirmUser } from '../queries/users';
import { InvalidAuthCredentialsError, InvalidConfirmationTokenError } from '../errors';
import { userCreateSchema } from '../validators/users';
import { isAuthenticated } from '../utils';

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

export default router;
