import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
    // Redirect GET requests to protected page
    throw redirect(303, '/protect');
};