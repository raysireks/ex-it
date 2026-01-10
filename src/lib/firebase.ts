import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { getAI } from "firebase/ai";

// Fix for custom domain authentication
// When using a custom domain (ex-it-now.com), Firebase Auth requires the authDomain
// to match the current domain. In production, we use the current hostname.
// In development, we use the configured authDomain from the config.
const firebaseConfig = { ...__FIREBASE_CONFIG__ };
if (!import.meta.env.DEV && typeof window !== 'undefined') {
    // In production, use the current hostname as authDomain
    // This allows authentication to work on both Firebase domains and custom domains
    firebaseConfig.authDomain = window.location.hostname;
}

export const app = initializeApp(firebaseConfig);

// Enable App Check debug mode for local development
// Set VITE_APPCHECK_DEBUG_TOKEN in your .env.local file with a UUID
// Register this token ONCE in Firebase Console > App Check > Apps > Manage debug tokens
if (import.meta.env.DEV) {
    if (import.meta.env.VITE_APPCHECK_DEBUG_TOKEN) {
        // @ts-expect-error - This is a special debug flag for App Check
        self.FIREBASE_APPCHECK_DEBUG_TOKEN = import.meta.env.VITE_APPCHECK_DEBUG_TOKEN;
        console.log('App Check: Using debug token from .env.local');
    } else {
        // @ts-expect-error - This is a special debug flag for App Check
        self.FIREBASE_APPCHECK_DEBUG_TOKEN = "4C03A0BA-627A-4E9D-ABA8-105DAB90D449";
        console.log('App Check: Using hardcoded debug token');
    }
}

// Initialize App Check with reCAPTCHA v3 for security
// This ensures only your app can access Firebase resources
export const appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(import.meta.env.VITE_RECAPTCHA_SITE_KEY),
    isTokenAutoRefreshEnabled: true
});
console.log('App Check: Initialized with reCAPTCHA v3');

export const auth = getAuth(app);
export const analytics = getAnalytics(app);
export const functions = getFunctions(app);

export const ai = getAI(app);

// Only connect to emulator if in DEV mode AND explicitly enabled via environment variable
// Note: This will NEVER run in production builds (import.meta.env.DEV is false in production)
if (import.meta.env.DEV && import.meta.env.VITE_USE_AUTH_EMULATOR === 'true') {
    connectAuthEmulator(auth, "http://localhost:9099");
    connectFunctionsEmulator(functions, "localhost", 5001);
    // Disable phone auth verification for testing
    auth.settings.appVerificationDisabledForTesting = true;
    console.log('Firebase Auth & Functions Emulator Connected');
}
