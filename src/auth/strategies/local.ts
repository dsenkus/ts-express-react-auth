import * as bcrypt from 'bcrypt';
import * as local from 'passport-local';
import { findUserByEmail } from '../../queries/users';

export const localAuthStrategy = new local.Strategy(
    {
        usernameField : 'email',
        passwordField : 'password'
    },
    async function(email, password, done): Promise<void> {
        const user = await findUserByEmail(email);

        // fail if user not found or user is not confirmed
        if (!user || !user.confirmed) {
            return done(null, false);
        }

        // fail if password does not match
        const passwordValid = await bcrypt.compare(password, user.password);
        if (!passwordValid) {
            return done(null, false);
        }

        // success
        done(null, user);
    }
);
