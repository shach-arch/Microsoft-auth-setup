import { PublicClientApplication } from '@azure/msal-browser';
import { browser } from '$app/environment';

// MSAL configuration
const msalConfig = {
    auth: {
        clientId: import.meta.env.VITE_AZURE_CLIENT_ID,
        authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID}`,
        redirectUri: import.meta.env.VITE_AZURE_REDIRECT_URI
    },
    cache: {
        cacheLocation: 'sessionStorage',
        storeAuthStateInCookie: false
    }
};

// Create MSAL instance
export let msalInstance = browser ? new PublicClientApplication(msalConfig) : null;

// Login request configuration
export const loginRequest = {
    scopes: ['openid', 'profile', 'email', 'User.Read']
};

// Initialize MSAL (call this before using any MSAL methods)
export async function initializeMsal() {
    if (browser && msalInstance) {
        try {
            await msalInstance.initialize();

            // Handle redirect response if coming back from redirect flow
            const response = await msalInstance.handleRedirectPromise();
            if (response) {
                console.log('Redirect response:', response);
            }

            return msalInstance;
        } catch (error) {
            console.error('MSAL initialization failed:', error);
            throw error;
        }
    }
    return null;
}