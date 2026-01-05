import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "REDACTED_API_KEY",
    authDomain: "ex-it-d2598.firebaseapp.com",
    projectId: "ex-it-d2598",
    storageBucket: "ex-it-d2598.firebasestorage.app",
    messagingSenderId: "REDACTED_SENDER_ID",
    appId: "1:REDACTED_SENDER_ID:web:46ae4b1e3719c5fdc61e95",
    measurementId: "REDACTED_MEASUREMENT_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);

// Only connect to emulator if explicitly enabled via environment variable
if (import.meta.env.VITE_USE_AUTH_EMULATOR === 'true') {
    connectAuthEmulator(auth, "http://localhost:9099");
    console.log('Firebase Auth Emulator Connected');
}
