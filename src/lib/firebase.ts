import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";


const app = initializeApp(__FIREBASE_CONFIG__);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
export const functions = getFunctions(app);

// Initialize Firebase AI with GoogleAIBackend (Client-side)
// This uses the Gemini Developer API (Free Tier) via Firebase SDK
import { getAI, GoogleAIBackend } from "firebase/ai";

export const ai = getAI(app, {
    backend: new GoogleAIBackend()
});

// Only connect to emulator if explicitly enabled via environment variable
if (import.meta.env.VITE_USE_AUTH_EMULATOR === 'true') {
    connectAuthEmulator(auth, "http://localhost:9099");
    connectFunctionsEmulator(functions, "localhost", 5001);
    // Disable phone auth verification for testing
    auth.settings.appVerificationDisabledForTesting = true;
    console.log('Firebase Auth & Functions Emulator Connected');
}
