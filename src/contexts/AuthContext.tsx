import { createContext, useEffect, useState, ReactNode } from "react";
import {
    User,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPhoneNumber,
    OAuthProvider,
    ApplicationVerifier,
    ConfirmationResult,
    linkWithPopup,
    fetchSignInMethodsForEmail
} from "firebase/auth";
import { auth } from "../lib/firebase";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signInWithApple: () => Promise<void>;
    signInWithEmail: (email: string, pass: string) => Promise<void>;
    signUpWithEmail: (email: string, pass: string) => Promise<void>;
    signInWithPhone: (phoneNumber: string, appVerifier: ApplicationVerifier) => Promise<ConfirmationResult>;
    logout: () => Promise<void>;
    linkWithGoogle: () => Promise<void>;
    resolveAccountConflict: (error: any) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    signInWithGoogle: async () => { },
    signInWithApple: async () => { },
    signInWithEmail: async () => { },
    signUpWithEmail: async () => { },
    signInWithPhone: async () => { throw new Error("Not implemented"); },
    logout: async () => { },
    linkWithGoogle: async () => { },
    resolveAccountConflict: async () => { },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error: any) {
            if (error.code === 'auth/account-exists-with-different-credential') {
                throw error; // Let component handle re-auth flow
            }
            console.error("Error signing in with Google", error);
            throw error;
        }
    };

    const signInWithApple = async () => {
        const provider = new OAuthProvider('apple.com');
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Error signing in with Apple", error);
            throw error;
        }
    };

    const signInWithEmail = async (email: string, pass: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, pass);
        } catch (error) {
            console.error("Error signing in with Email", error);
            throw error;
        }
    };

    const signUpWithEmail = async (email: string, pass: string) => {
        try {
            await createUserWithEmailAndPassword(auth, email, pass);
        } catch (error) {
            console.error("Error signing up with Email", error);
            throw error;
        }
    };

    const signInWithPhone = async (phoneNumber: string, appVerifier: ApplicationVerifier): Promise<ConfirmationResult> => {
        try {
            return await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
        } catch (error) {
            console.error("Error signing in with Phone", error);
            throw error;
        }
    };

    const linkWithGoogle = async () => {
        if (!auth.currentUser) return;
        const provider = new GoogleAuthProvider();
        try {
            await linkWithPopup(auth.currentUser, provider);
        } catch (error) {
            console.error("Error linking with Google", error);
            throw error;
        }
    };

    const resolveAccountConflict = async (error: any) => {
        // This is a helper to handle the specific merging logic if we want to centralize it.
        // For now, we will expose the primitives and let the UI drive the flow.
        const pendingCred = OAuthProvider.credentialFromError(error);
        const email = error.customData?.email;
        if (!email || !pendingCred) throw new Error("Invalid conflict error");

        const methods = await fetchSignInMethodsForEmail(auth, email);
        // Return info needed for UI to prompt user
        throw { ...error, methods, pendingCred };
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error signing out", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            signInWithGoogle,
            signInWithApple,
            signInWithEmail,
            signUpWithEmail,
            signInWithPhone,
            logout,
            linkWithGoogle,
            resolveAccountConflict
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
