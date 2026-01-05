import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return {
    user: context.user,
    loading: context.loading,
    login: context.signInWithGoogle,
    loginWithApple: context.signInWithApple,
    loginWithEmail: context.signInWithEmail,
    signupWithEmail: context.signUpWithEmail,
    loginWithPhone: context.signInWithPhone,
    logout: context.logout,
    isAuthenticated: !!context.user
  };
};
