import * as bcrypt from 'bcrypt';
import * as local from 'passport-local'
import { findUserByEmail } from '../../utils/db';

export const localAuthStrategy = new local.Strategy(
    {
        usernameField : 'email',
        passwordField : 'password'
    },
    async function(email, password, done): Promise<void> {
        const user = await findUserByEmail(email);
        if (!user || !user.confirmed) {
            return done(null, false);
        }

        const passwordValid = await bcrypt.compare(password, user.password);
        if (!passwordValid) {
            return done(null, false);
        }

        done(null, user);
    }
);
