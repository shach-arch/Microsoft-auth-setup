import type { RequestHandler } from './$types';
import { json, redirect } from '@sveltejs/kit';
import pkg from 'jsonwebtoken';
const { sign } = pkg;

export const POST: RequestHandler = async ({ request, cookies }) => {
    try {
        const { idToken, account } = await request.json();

        if (!idToken || !account) {
            return json({ error: 'Missing required data' }, { status: 400 });
        }

        // Create session token
        const sessionToken = sign(
            {
                id: account.id,
                name: account.name,
                email: account.email
            },
            process.env.COOKIE_SECRET || 'default-secret',
            { expiresIn: '24h' }
        );

        // Set session cookie
        cookies.set('session', sessionToken, {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 // 24 hours
        });

        return json({ success: true });
    } catch (error) {
        console.error('Auth callback error:', error);
        return json({ error: 'Authentication failed' }, { status: 500 });
    }
};

export const GET: RequestHandler = async () => {
    // Handle redirect callback if using redirect flow
    throw redirect(303, '/protect');
};