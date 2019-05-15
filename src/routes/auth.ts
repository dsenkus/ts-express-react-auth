import Router from 'express-promise-router';
import { InvalidAuthCredentialsError } from '../utils/errors';
import * as passport from 'passport';
import { isAuthenticated } from '../utils/isAuthenticated';
import { insertUser } from '../utils/db';
import { userCreateSchema } from '../utils/validators';

const router = Router();

router.get('/whoami', isAuthenticated, async (req, res): Promise<void> => {
    const user = req.user;

    res.send({
        ...user
    });
});

router.post('/logout', isAuthenticated, async (req, res): Promise<void> => {
    req.logOut();
    res.status(200).send();
});

router.post('/register', async (req, res): Promise<void> => {
    await userCreateSchema.validate(req.body, { abortEarly: false });

    const { name, email, password } = req.body;
    await insertUser(name, email, password)
    res.status(200).send();
});

router.post('/login', (req, res, next): any => {
    passport.authenticate('login', {}, (err, user, info): any => {
        if(err || !user) return next(new InvalidAuthCredentialsError());

        // create user session
        req.logIn(user, (err): any => {
            if (err) return next(err);
            res.status(200).send();
        });

    })(req, res, next);
});

export default router;
