import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyA33ZEst700tguqe6QoX7zGLeJIWnRNPd8",
    authDomain: "ex-it-d2598.firebaseapp.com",
    projectId: "ex-it-d2598",
    storageBucket: "ex-it-d2598.firebasestorage.app",
    messagingSenderId: "974662548496",
    appId: "1:974662548496:web:46ae4b1e3719c5fdc61e95",
    measurementId: "G-4V8RGQ79MN"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);

// Only connect to emulator if explicitly enabled via environment variable
if (import.meta.env.VITE_USE_AUTH_EMULATOR === 'true') {
    connectAuthEmulator(auth, "http://localhost:9099");
    // Disable phone auth verification for testing
    auth.settings.appVerificationDisabledForTesting = true;
    console.log('Firebase Auth Emulator Connected');
}
