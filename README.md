# Microsoft-auth-setup
# SvelteKit Microsoft Authentication

A complete implementation of Microsoft Azure Active Directory authentication in SvelteKit using MSAL.js. This project provides secure user authentication with session management, protected routes, and a clean, modern UI.

## 🚀 Features

- **Microsoft Azure AD Integration** - Secure authentication using MSAL.js
- **Session Management** - JWT-based sessions with secure HTTP-only cookies
- **Protected Routes** - Route-level authentication guards
- **Modern UI** - Clean, responsive design with SvelteKit
- **TypeScript Support** - Full type safety throughout the application
- **Multiple Login Flows** - Support for both popup and redirect authentication
- **Production Ready** - Proper error handling and security configurations

## 📋 Prerequisites

Before running this project, ensure you have:

- **Node.js 16+** installed
- **npm** or **yarn** package manager
- **Azure account** with access to Azure Portal
- **Azure Active Directory** app registration

## 🛠 Installation

### 1. Clone or create the project

```bash
# Create new SvelteKit project
npx sv create sveltekit-microsoft-auth
cd sveltekit-microsoft-auth

# Or clone existing repository
git clone <your-repo-url>
cd sveltekit-microsoft-auth
```

### 2. Install dependencies

```bash
npm install --legacy-peer-deps

# Install authentication packages
npm install @azure/msal-browser jsonwebtoken
npm install -D @types/jsonwebtoken
```

### 3. Sync SvelteKit types

```bash
npx svelte-kit sync
```

## ⚙️ Configuration

### 1. Azure App Registration

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** → **App registrations**
3. Click **New registration**
4. Configure your application:
    - **Name**: Your App Name
    - **Supported account types**: Choose based on your needs
    - **Redirect URI**: Add `http://localhost:5173/auth/callback` (Single-page application)
5. Note down:
    - **Application (client) ID** (GUID format)
    - **Directory (tenant) ID** (GUID format)
6. Go to **Authentication**:
    - Ensure platform is **Single-page application**
    - Add redirect URI: `http://localhost:5173/auth/callback`
    - Disable **Implicit grant and hybrid flows**
7. Go to **API permissions** → Add permissions for **Microsoft Graph** (User.Read)

### 2. Environment Variables

Create a `.env` file in the project root:

```env
# Azure AD Configuration
VITE_AZURE_CLIENT_ID=your-application-client-id-guid
VITE_AZURE_TENANT_ID=your-directory-tenant-id-guid
VITE_AZURE_REDIRECT_URI=http://localhost:5173/auth/callback

# Session Secret (generate a random string)
COOKIE_SECRET=your-super-secret-random-string-make-it-long-and-secure
```

**⚠️ Important:**
- Client ID and Tenant ID should be GUIDs (e.g., `12345678-1234-1234-1234-123456789012`)
- Variables for browser use must have `VITE_` prefix
- Never commit `.env` files to version control

### 3. Example values

```env
VITE_AZURE_CLIENT_ID=12345678-1234-5678-9abc-123456789012
VITE_AZURE_TENANT_ID=87654321-4321-8765-4321-210987654321
VITE_AZURE_REDIRECT_URI=http://localhost:5173/auth/callback
COOKIE_SECRET=super-secret-random-string-for-jwt-signing-make-this-very-long-and-random
```

## 🚀 Quick Start

1. **Start the development server:**
```bash
npm run dev
```

2. **Open your browser:**
```
http://localhost:5173
```

3. **Test the authentication:**
    - Click "Login with Microsoft"
    - Sign in with your Microsoft account
    - You'll be redirected to the protected page

## 📁 Project Structure

```
sveltekit-microsoft-auth/
├── src/
│   ├── lib/
│   │   └── msal.js                 # MSAL configuration and initialization
│   ├── routes/
│   │   ├── +layout.svelte          # Main layout with navigation
│   │   ├── +layout.server.ts       # Layout server load function
│   │   ├── +page.svelte            # Home page
│   │   ├── login/
│   │   │   └── +page.svelte        # Login page with MSAL integration
│   │   ├── auth/
│   │   │   └── callback/
│   │   │       └── +server.ts      # Auth callback API endpoint
│   │   ├── protected/
│   │   │   ├── +page.svelte        # Protected page (requires auth)
│   │   │   └── +page.server.ts     # Protected page server logic
│   │   └── logout/
│   │       └── +server.ts          # Logout endpoint
│   ├── app.d.ts                    # App type definitions
│   ├── app.html                    # HTML template
│   └── hooks.server.ts             # Server-side hooks for session/auth
├── static/                         # Static assets
├── .env                           # Environment variables (create this)
├── .env.example                   # Environment variables template
├── package.json                   # Dependencies and scripts
├── svelte.config.js              # SvelteKit configuration
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # This file
```

## 🔐 How It Works

### Authentication Flow

1. **User clicks login** → Redirected to Microsoft login page
2. **User authenticates** → Microsoft returns with auth code
3. **MSAL processes response** → Extracts user info and tokens
4. **Client sends data to server** → `/auth/callback` endpoint
5. **Server creates session** → JWT stored in HTTP-only cookie
6. **User redirected to protected area** → Session validated on each request

### Session Management

- **JWT tokens** stored in secure HTTP-only cookies
- **Server-side validation** on every protected route request
- **Automatic expiration** after 24 hours (configurable)
- **Secure logout** clears all session data

### Route Protection

Protected routes automatically redirect unauthenticated users to login:

```typescript
// hooks.server.ts
if (event.url.pathname.startsWith('/protected')) {
  if (!event.locals.user) {
    return new Response('Redirect', {
      status: 303,
      headers: { Location: '/login' }
    });
  }
}
```

## 🎯 Usage Examples

### Basic Login Flow

```svelte
<!-- src/routes/login/+page.svelte -->
<script lang="ts">
  import { initializeMsal, loginRequest } from '$lib/msal';
  
  async function login() {
    const msalInstance = await initializeMsal();
    const response = await msalInstance.loginPopup(loginRequest);
    
    // Send to server for session creation
    await fetch('/auth/callback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        idToken: response.idToken,
        account: {
          id: response.account.homeAccountId,
          name: response.account.name,
          email: response.account.username
        }
      })
    });
  }
</script>

<button on:click={login}>Login with Microsoft</button>
```

### Accessing User Data

```svelte
<!-- In any page component -->
<script lang="ts">
  import type { PageData } from './$types';
  export let data: PageData;
</script>

{#if data.user}
  <p>Welcome, {data.user.name}!</p>
  <p>Email: {data.user.email}</p>
{:else}
  <p>Please log in</p>
{/if}
```

### Creating Protected Routes

```typescript
// src/routes/admin/+page.server.ts
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) {
    throw redirect(303, '/login');
  }
  
  return {
    user: locals.user
  };
};
```

## 🔧 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run check

# Type checking with watch mode
npm run check:watch
```

### Environment Setup

1. **Development**: Uses `http://localhost:5173`
2. **Production**: Update redirect URIs in Azure Portal

### Testing

```bash
# Test environment variables loading
curl http://localhost:5173/test-env

# Test authentication endpoint
curl -X POST http://localhost:5173/auth/callback \
  -H "Content-Type: application/json" \
  -d '{"idToken":"test","account":{"id":"test","name":"Test","email":"test@example.com"}}'
```

## 🐛 Troubleshooting

### Common Issues

1. **"Missing script: dev"**
    - Ensure `package.json` has `"dev": "vite dev"` in scripts

2. **"Cannot find module './$types'"**
    - Run `npx svelte-kit sync` to generate types

3. **"Environment variables missing"**
    - Check `.env` file location (project root)
    - Ensure variables start with `VITE_`
    - Restart dev server after changes

4. **"MSAL initialization failed"**
    - Verify Azure app is configured as Single-page application
    - Check Client ID and Tenant ID are GUIDs, not secrets

5. **"Cross-origin token redemption error"**
    - Ensure Azure app platform is **Single-page application**, not Web

6. **"Form actions expect form-encoded data"**
    - Use `+server.ts` for JSON APIs, `+page.server.ts` for form actions

### Debug Mode

Enable detailed logging by adding to your MSAL config:

```javascript
const msalConfig = {
  // ... existing config
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        console.log(message);
      },
      piiLoggingEnabled: false,
      logLevel: 'Info'
    }
  }
};
```

### Getting Help

- Check the [troubleshooting guide](./TROUBLESHOOTING.md) for detailed solutions
- Review [SvelteKit documentation](https://kit.svelte.dev/docs)
- Check [MSAL.js documentation](https://github.com/AzureAD/microsoft-authentication-library-for-js)

## 🚀 Deployment

### Production Environment Variables

```env
VITE_AZURE_CLIENT_ID=your-production-client-id
VITE_AZURE_TENANT_ID=your-production-tenant-id
VITE_AZURE_REDIRECT_URI=https://yourdomain.com/auth/callback
COOKIE_SECRET=very-secure-random-production-secret
```

### Azure Configuration Updates

1. Add production redirect URI in Azure Portal
2. Update CORS settings if needed
3. Configure appropriate API permissions

### Security Considerations

- Use HTTPS in production
- Set secure cookie flags
- Implement proper CORS policies
- Regular security audits
- Monitor authentication logs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Add tests for new features
- Update documentation for changes
- Follow existing code style
- Test with both popup and redirect flows

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [SvelteKit](https://kit.svelte.dev/) for the amazing framework
- [Microsoft MSAL.js](https://github.com/AzureAD/microsoft-authentication-library-for-js) for authentication
- [Azure Active Directory](https://azure.microsoft.com/en-us/services/active-directory/) for identity services

## 📚 Additional Resources

- [Microsoft Identity Platform Documentation](https://docs.microsoft.com/en-us/azure/active-directory/develop/)
- [SvelteKit Authentication Patterns](https://kit.svelte.dev/docs/authentication)
- [MSAL.js API Reference](https://azuread.github.io/microsoft-authentication-library-for-js/ref/msal-browser/)
- [Azure Portal](https://portal.azure.com)

---

**Questions or issues?** Please check the [troubleshooting guide](./TROUBLESHOOTING.md) or open an issue on GitHub.