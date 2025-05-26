import { sequence } from '@sveltejs/kit/hooks';
import type { Handle } from '@sveltejs/kit';
import pkg from 'jsonwebtoken';
const { verify, sign } = pkg;

const sessionHandle: Handle = async ({ event, resolve }) => {
    const sessionCookie = event.cookies.get('session');

    if (sessionCookie) {
        try {
            // Use the destructured verify function
            const session = verify(sessionCookie, process.env.COOKIE_SECRET || 'default-secret');
            event.locals.user = session as any;
        } catch (err) {
            event.cookies.delete('session', { path: '/' });
        }
    }

    return await resolve(event);
};

const authHandle: Handle = async ({ event, resolve }) => {
    if (event.url.pathname.startsWith('/protected')) {
        if (!event.locals.user) {
            return new Response('Redirect', {
                status: 303,
                headers: { Location: '/login' }
            });
        }
    }

    return await resolve(event);
};

export const handle = sequence(sessionHandle, authHandle);