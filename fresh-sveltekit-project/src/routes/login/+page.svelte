<script lang="ts">
    import { initializeMsal, loginRequest } from '$lib/msal';
    import { browser } from '$app/environment';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';

    let loading = false;
    let error = '';
    let msalReady = false;
    let localMsalInstance: any = null;
    let debugInfo = '';

    // Initialize MSAL when component mounts
    onMount(async () => {
        if (browser) {
            debugInfo = 'Checking environment variables...\n';

            const clientId = import.meta.env.VITE_AZURE_CLIENT_ID;
            const tenantId = import.meta.env.VITE_AZURE_TENANT_ID;
            const redirectUri = import.meta.env.VITE_AZURE_REDIRECT_URI;

            debugInfo += `Client ID: ${clientId ? 'Present' : 'Missing'}\n`;
            debugInfo += `Tenant ID: ${tenantId ? 'Present' : 'Missing'}\n`;
            debugInfo += `Redirect URI: ${redirectUri}\n`;

            if (!clientId || !tenantId || !redirectUri) {
                error = 'Missing required environment variables. Check your .env file.';
                return;
            }

            debugInfo += 'Attempting to initialize MSAL...\n';

            try {
                localMsalInstance = await initializeMsal();
                if (localMsalInstance) {
                    msalReady = true;
                    debugInfo += 'MSAL initialized successfully!';
                } else {
                    error = 'MSAL returned null instance';
                }
            } catch (err) {
                error = `MSAL initialization failed: ${err.message}`;
                debugInfo += `Error details: ${JSON.stringify(err, null, 2)}`;
                console.error('Full MSAL error:', err);
            }
        } else {
            error = 'Not running in browser environment';
        }
    });

    // ... rest of your functions remain the same
    async function loginWithPopup() {
        if (!browser || !localMsalInstance) {
            error = 'Authentication system not ready';
            return;
        }

        loading = true;
        error = '';

        try {
            const response = await localMsalInstance.loginPopup(loginRequest);

            const account = response.account;

            const res = await fetch('/auth/callback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    idToken: response.idToken,
                    account: {
                        id: account.homeAccountId,
                        name: account.name,
                        email: account.username
                    }
                })
            });

            if (res.ok) {
                goto('/protected');
            } else {
                error = 'Failed to create session';
            }
        } catch (err) {
            error = err instanceof Error ? err.message : 'Login failed';
            console.error('Login error:', err);
        } finally {
            loading = false;
        }
    }

    async function loginWithRedirect() {
        if (!browser || !localMsalInstance) {
            error = 'Authentication system not ready';
            return;
        }

        try {
            await localMsalInstance.loginRedirect(loginRequest);
        } catch (err) {
            error = err instanceof Error ? err.message : 'Login failed';
            console.error('Login redirect error:', err);
        }
    }
</script>

<h1>Login</h1>

<div class="login-container">
    <p>Choose your login method:</p>

    <button on:click={loginWithPopup} disabled={loading || !msalReady}>
        {loading ? 'Logging in...' : 'Sign in with Microsoft (Popup)'}
    </button>

    <button on:click={loginWithRedirect} disabled={loading || !msalReady}>
        Sign in with Microsoft (Redirect)
    </button>

    {#if !msalReady && browser && !error}
        <p class="info">Initializing authentication system...</p>
    {/if}

    {#if error}
        <div class="error">
            <strong>Error:</strong> {error}
        </div>
    {/if}

    {#if debugInfo}
        <div class="debug">
            <strong>Debug Info:</strong>
            <pre>{debugInfo}</pre>
        </div>
    {/if}
</div>

<style>
    .login-container {
        max-width: 600px;
        margin: 2rem auto;
        text-align: center;
    }

    button {
        display: block;
        width: 100%;
        padding: 1rem;
        margin: 0.5rem 0;
        background-color: #0078d4;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1rem;
    }

    button:hover:not(:disabled) {
        background-color: #106ebe;
    }

    button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .error {
        color: red;
        margin-top: 1rem;
        padding: 0.75rem;
        background-color: #fee;
        border: 1px solid #fcc;
        border-radius: 4px;
        text-align: left;
    }

    .debug {
        color: #666;
        margin-top: 1rem;
        padding: 0.75rem;
        background-color: #f5f5f5;
        border: 1px solid #ddd;
        border-radius: 4px;
        text-align: left;
    }

    .debug pre {
        white-space: pre-wrap;
        margin: 0;
    }

    .info {
        color: #666;
        font-style: italic;
    }
</style>