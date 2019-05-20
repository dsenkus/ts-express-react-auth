import * as fs from 'fs';
import { createPasswordResetLink } from '../utils';
import { client } from '../sparkpost';

const buildEmail = (content: string): string => {
    const template = fs.readFileSync(__dirname + '/emailTemplate.html', 'utf8');
    return template
        .replace('!!!PLACEHOLDER_TITLE!!!', 'Password Reset')
        .replace('!!!PLACEHOLDER_CONTENT!!!', content)
        .replace('!!!PLACEHOLDER_PREHEADER!!!', '')
        .replace('!!!PLACEHOLDER_YEAR!!!', (new Date()).getFullYear().toString())
};

export const sendPasswordResetEmail = async (user: User): Promise<void> => {
    if(!client) return;
    const resetLink = createPasswordResetLink(user.reset_password_token)

    await client.transmissions.send({
        options: {
            // sandbox: true
            inline_css: true
        },
        content: {
            from: 'no-reply@robojs.com',
            subject: 'RoboJS Password Reset',
            html: buildEmail(`<p>Hello, ${user.name}</p>
                <p>Click on the link below to reset your password:</p>
                <a href="${resetLink}">${resetLink}</a>`
            ),
        },
        recipients: [
            {address: user.email}
        ],
    });
}
