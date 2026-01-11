import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { RecaptchaVerifier, ConfirmationResult, AuthCredential, linkWithCredential } from 'firebase/auth';
import { auth } from '../lib/firebase';

interface LoginModalProps {
  onClose: () => void;
}

type AuthMethod = 'options' | 'email-login' | 'email-signup' | 'phone' | 'conflict';

const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  const { login, loginWithApple, loginWithEmail, signupWithEmail, loginWithPhone, resolveAccountConflict } = useAuth();
  const [error, setError] = useState('');
  const [method, setMethod] = useState<AuthMethod>('options');

  // Conflict state
  const [pendingCred, setPendingCred] = useState<AuthCredential | null>(null);
  const [conflictEmail, setConflictEmail] = useState('');

  // Email state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Phone state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationId, setVerificationId] = useState<ConfirmationResult | null>(null);

  const handleConflict = async (err: any) => {
    if (err.code === 'auth/account-exists-with-different-credential') {
      try {
        const resolution = await resolveAccountConflict(err).catch(e => e);
        if (resolution.pendingCred) {
          setPendingCred(resolution.pendingCred);
          setConflictEmail(resolution.customData?.email || '');
          setMethod('conflict');
          setError(`An account already exists with ${resolution.customData?.email}. Please sign in with your existing account to link them.`);
          return true;
        }
      } catch (resolvingErr) {
        console.error("Error resolving conflict details", resolvingErr);
      }
    }
    return false;
  };

  const handleLinkComplete = async () => {
    if (auth.currentUser && pendingCred) {
      try {
        await linkWithCredential(auth.currentUser, pendingCred);
        onClose();
      } catch (linkErr) {
        console.error("Linking failed", linkErr);
        setError("Failed to link accounts.");
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      if (method === 'conflict') {
        await login(); // Sign in with existing Google account
        await handleLinkComplete();
      } else {
        await login();
        onClose();
      }
    } catch (err: any) {
      const handled = await handleConflict(err);
      if (!handled) {
        setError(`Failed to sign in via Google: ${err.message || 'Unknown error'}`);
        console.error(err);
      }
    }
  };

  const handleAppleLogin = async () => {
    try {
      setError('');
      await loginWithApple();
      onClose();
    } catch (err: any) {
      const handled = await handleConflict(err);
      if (!handled) {
        setError('Failed to sign in via Apple.');
        console.error(err);
      }
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      await loginWithEmail(email, password);
      if (method === 'conflict') {
        await handleLinkComplete();
      } else {
        onClose();
      }
    } catch (err) {
      setError('Invalid email or password.');
      console.error(err);
    }
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      await signupWithEmail(email, password);
      onClose();
    } catch (err) {
      setError('Failed to create account.');
      console.error(err);
    }
  };

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': () => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        }
      });
    }
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const confirmationResult = await loginWithPhone(phoneNumber, appVerifier);
      setVerificationId(confirmationResult);
    } catch (err) {
      setError('Failed to send verification code. Format: +15555555555');
      console.error(err);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationId) return;
    try {
      setError('');
      await verificationId.confirm(verificationCode);
      onClose();
    } catch (err) {
      setError('Invalid verification code.');
      console.error(err);
    }
  };

  const renderOptions = () => (
    <>
      <button className="google-login-button" onClick={handleGoogleLogin}>
        <svg className="google-icon" viewBox="0 0 24 24">
          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.24-1.19-2.24z" />
          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Sign in with Google
      </button>

      <button className="apple-login-button" onClick={handleAppleLogin}>
        <svg className="apple-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.07-.5-2.05-.5-3.17 0-1.4.63-2 .35-3.03-.68-1.85-1.85-3.2-5.27-1.3-8.32 1.04-1.66 2.76-2.64 4.54-2.5 1.5.12 2.68 1.05 3.38 1.05.7 0 2.27-1.29 4.14-1.01 1.55.12 2.75.82 3.61 2.07-3.11 1.88-2.58 5.75.81 7.15-.65 1.58-1.52 3.14-2.74 4.38l-.1.09h-.01l-.01.01-.01.01c-.17.15-.35.31-.53.45zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.17 2.45-2.55 4.34-3.74 4.25z" />
        </svg>
        Sign in with Apple
      </button>

      <div className="auth-divider">
        <span>OR</span>
      </div>

      <button className="method-button" onClick={() => setMethod('email-login')}>
        Sign in with Email
      </button>

      <button className="method-button" onClick={() => setMethod('phone')}>
        Sign in with Phone
      </button>
    </>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="login-content">
          <h2>
            {method === 'options' && 'Welcome Back'}
            {method === 'email-login' && 'Email Login'}
            {method === 'email-signup' && 'Create Account'}
            {method === 'phone' && 'Phone Login'}
            {method === 'conflict' && 'Link Account'}
          </h2>

          {method === 'options' && (
            <p className="login-subtitle">Sign in to sync your progress across devices.</p>
          )}

          {method === 'conflict' && (
            <p className="login-subtitle">
              Please sign in with your <strong>existing account</strong> to link {conflictEmail}.
            </p>
          )}

          {error && <div className="error-message">{error}</div>}

          {(method === 'options' || method === 'conflict') && renderOptions()}

          {(method === 'email-login' || method === 'email-signup') && (
            <form className="auth-form" onSubmit={method === 'email-login' ? handleEmailLogin : handleEmailSignup}>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
              </div>
              <button type="submit" className="login-button">
                {method === 'email-login' ? 'Sign In' : 'Sign Up'}
              </button>

              <div className="auth-switch">
                {method === 'email-login' ? (
                  <p>Don't have an account? <a onClick={() => setMethod('email-signup')}>Sign up</a></p>
                ) : (
                  <p>Already have an account? <a onClick={() => setMethod('email-login')}>Log in</a></p>
                )}
                <a className="back-link" onClick={() => setMethod('options')}>← Back to options</a>
              </div>
            </form>
          )}

          {method === 'phone' && (
            <div className="auth-form">
              {!verificationId ? (
                <form onSubmit={handleSendCode}>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={e => setPhoneNumber(e.target.value)}
                      placeholder="+1 555 555 5555"
                      required
                    />
                  </div>
                  <div id="recaptcha-container"></div>
                  <button type="submit" className="login-button">Send Code</button>
                </form>
              ) : (
                <form onSubmit={handleVerifyCode}>
                  <div className="form-group">
                    <label>Verification Code</label>
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={e => setVerificationCode(e.target.value)}
                      placeholder="123456"
                      required
                    />
                  </div>
                  <button type="submit" className="login-button">Verify Code</button>
                </form>
              )}
              <div className="auth-switch">
                <a className="back-link" onClick={() => setMethod('options')}>← Back to options</a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
