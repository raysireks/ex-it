# Custom Domain Setup for Firebase Authentication

This guide explains how to configure your Firebase project to work with custom domains like `ex-it-now.com`.

## Problem

When using Google Sign-In with Firebase Authentication, you may encounter issues when your app is accessed through a custom domain instead of the default Firebase hosting domain (`*.firebaseapp.com` or `*.web.app`).

## Solution

The application has been configured to automatically detect and use the current domain as the `authDomain` in production. However, you still need to whitelist your custom domain in Firebase Console.

## Steps to Configure Firebase Console

### 1. Add Custom Domain to Firebase Hosting

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (`ex-it-d2598`)
3. Navigate to **Hosting** in the left sidebar
4. Click **Add custom domain**
5. Follow the wizard to:
   - Enter your domain name (e.g., `ex-it-now.com`)
   - Verify domain ownership
   - Configure DNS settings

### 2. Add Custom Domain to Authorized Domains

After setting up your custom domain for hosting, you need to authorize it for authentication:

1. In Firebase Console, navigate to **Authentication** > **Settings**
2. Click on the **Authorized domains** tab
3. Click **Add domain**
4. Enter your custom domain: `ex-it-now.com`
5. Click **Add**

### 3. Configure OAuth Consent Screen (Google Cloud)

If you're using Google Sign-In, you also need to update the OAuth consent screen:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **APIs & Services** > **OAuth consent screen**
4. Under **Authorized domains**, add:
   - `ex-it-now.com`
5. Click **Save**

### 4. Update OAuth Client Authorized Origins (if needed)

For Google Sign-In to work properly:

1. In Google Cloud Console, go to **APIs & Services** > **Credentials**
2. Find your OAuth 2.0 Client ID (the one used by Firebase)
3. Under **Authorized JavaScript origins**, add:
   - `https://ex-it-now.com`
4. Under **Authorized redirect URIs**, add:
   - `https://ex-it-now.com/__/auth/handler`
5. Click **Save**

> **Note:** Firebase Authentication usually handles OAuth credentials automatically. You only need to manually configure OAuth clients if you're experiencing issues after completing the above steps.

## How It Works

The application code has been updated to automatically use the current hostname as the `authDomain` when running in production:

```typescript
// In src/lib/firebase.ts
const firebaseConfig = __FIREBASE_CONFIG__;
if (!import.meta.env.DEV && typeof window !== 'undefined') {
    // In production, use the current hostname as authDomain
    firebaseConfig.authDomain = window.location.hostname;
}
```

This means:
- When accessed via `ex-it-d2598.firebaseapp.com`, it uses that as authDomain
- When accessed via `ex-it-now.com`, it uses that as authDomain
- In development, it uses the configured authDomain from your config file

## Troubleshooting

### Error: "This domain is not authorized..."

If you see an error like "This domain is not authorized for OAuth operations for your Firebase project", it means:
1. You haven't added the domain to **Authorized domains** in Firebase Authentication settings
2. DNS changes are still propagating (wait 24-48 hours)
3. You need to update Google Cloud OAuth settings

### Google Sign-In Popup Closes Immediately

This usually indicates:
1. The domain is not whitelisted in Firebase Console
2. OAuth client configuration is incorrect
3. Browser is blocking third-party cookies

### Testing

To test that your custom domain authentication is working:

1. Open your app at `https://ex-it-now.com`
2. Click "Sign in with Google"
3. Complete the Google sign-in flow
4. You should be successfully authenticated

Check the browser console for any errors. You should see:
```
Firebase: Using current hostname as authDomain: ex-it-now.com
```

## Additional Resources

- [Firebase Custom Domain Documentation](https://firebase.google.com/docs/hosting/custom-domain)
- [Firebase Authentication Authorized Domains](https://firebase.google.com/docs/auth/web/redirect-best-practices#customize-trusted-domains)
- [Google OAuth Configuration](https://developers.google.com/identity/protocols/oauth2)
