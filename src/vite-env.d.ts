/// <reference types="vite/client" />
import { RecaptchaVerifier } from "firebase/auth";

declare global {
    interface Window {
        recaptchaVerifier: RecaptchaVerifier;
    }
}

interface ImportMetaEnv {
    readonly VITE_USE_AUTH_EMULATOR: string
    // more env variables...
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
