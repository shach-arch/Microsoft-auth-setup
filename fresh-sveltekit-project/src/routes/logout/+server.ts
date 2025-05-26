import type { RequestHandler } from './$types';
import { redirect } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ cookies, locals }) => {
    // Clear session cookie
    cookies.delete('session', { path: '/' });

    // Clear locals
    locals.user = undefined;

    // Redirect to home
    throw redirect(303, '/');
};