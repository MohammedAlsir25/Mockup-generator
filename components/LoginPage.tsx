import React, { useState } from 'react';
import { Alert } from './Alert';
import { PasswordResetModal } from './PasswordResetModal';

interface LoginPageProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onGoogleLogin: () => Promise<void>;
  onNavigate: (view: 'signup') => void;
}

const GoogleIcon: React.FC = () => (
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5 mr-3">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
        <path fill="none" d="M0 0h48v48H0z"></path>
    </svg>
);

const EyeIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
    </svg>
);

const EyeOffIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074L3.707 2.293zM10 12a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        <path d="M2 10s3.939 4 8 4 8-4 8-4-3.939-4-8-4-8 4-8 4z" />
    </svg>
);


export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onGoogleLogin, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await onLogin(email, password);
    } catch (err: any) {
      console.error("Firebase Login Error:", err);
      let message = `An unknown error occurred. (Code: ${err.code || 'unknown'})`;
      const code = err.code;

      if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        message = 'Invalid email or password.';
      } else if (code === 'auth/operation-not-allowed') {
        message = "Login failed. Please ensure 'Email/Password' sign-in is enabled in your Firebase project's Authentication settings.";
      } else if (code === 'auth/network-request-failed') {
        message = "Network error. Please check your internet connection and ensure your Firebase domain is not blocked.";
      } else if (code === 'auth/invalid-api-key') {
        message = "Authentication failed: The API key in your `firebaseConfig` is invalid. Please double-check it in `config.ts`.";
      } else if (code === 'auth/app-deleted') {
        message = "Authentication failed: This Firebase project has been deleted.";
      }
      
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError(null);
    try {
        await onGoogleLogin();
    } catch (err: any) {
        console.error("Google Sign-In Error:", err);
        let message = `An unknown error occurred. (Code: ${err.code || 'unknown'})`;
        const code = err.code;

        if (code === 'auth/operation-not-allowed') {
            message = "Google Sign-In is not enabled for this project. Please go to your Firebase Console -> Authentication -> Sign-in method, and enable the 'Google' provider.";
        } else if (code === 'auth/popup-closed-by-user') {
            message = "Sign-in cancelled. The popup was closed before authentication could complete.";
        } else if (code === 'auth/unauthorized-domain') {
            message = `This website's domain is not authorized for sign-in.\n\nThis is a required security setting in your Firebase project.\n\nTo fix this, please follow these steps:\n1. Go to your Firebase Console -> Authentication -> Settings tab.\n2. Under 'Authorized domains', click 'Add domain'.\n3. Enter the following domain name exactly as shown:\n\n${window.location.hostname}\n\nAfter adding the domain, please wait a minute and try again.`;
        } else if (code === 'auth/popup-blocked') {
            message = "Google Sign-In popup was blocked by your browser. Please disable your popup blocker for this site and try again.";
        } else if (code === 'auth/internal-error') {
            message = "An internal authentication error occurred. This can happen if the API key has restrictions. Please check your Google Cloud Console to ensure your API key has no HTTP referrer restrictions, or that they are configured correctly for this domain.";
        } else if (code === 'auth/network-request-failed') {
            message = "A network error occurred. Please check your internet connection or any browser extensions (like ad-blockers) that might be interfering with the request.";
        }
        
        setError(message);
    } finally {
        setIsGoogleLoading(false);
    }
  };

  return (
    <>
      <div className="max-w-md mx-auto">
        <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700">
          <h2 className="text-3xl font-bold text-center mb-6">Welcome Back</h2>
          
          {error && <Alert title="Login Failed" message={error} type="error" />}

          <button
              onClick={handleGoogleSignIn}
              disabled={isLoading || isGoogleLoading}
              className="w-full mt-4 bg-white text-gray-700 font-semibold py-3 px-4 border border-gray-300 rounded-md hover:bg-gray-50 disabled:bg-gray-200 disabled:text-gray-500 transition duration-300 flex items-center justify-center"
          >
              {isGoogleLoading ? (
                  <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                  </>
              ) : (
                  <>
                      <GoogleIcon />
                      Continue with Google
                  </>
              )}
          </button>

          <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                  <span className="bg-gray-800 px-2 text-gray-400">OR</span>
              </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 outline-none"
                disabled={isLoading || isGoogleLoading}
              />
            </div>
            <div>
              <label htmlFor="password"className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={isPasswordVisible ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-4 pr-10 py-3 bg-gray-800 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 outline-none"
                  disabled={isLoading || isGoogleLoading}
                />
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-200"
                  aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                >
                  {isPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>
            
            <div className="text-right">
              <button
                type="button"
                onClick={() => setIsResetModalOpen(true)}
                className="text-sm font-medium text-indigo-400 hover:underline disabled:text-gray-500 disabled:cursor-not-allowed"
                disabled={isLoading || isGoogleLoading}
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="w-full bg-indigo-600 text-white font-semibold py-3 px-8 rounded-md hover:bg-indigo-500 disabled:bg-indigo-800 disabled:text-gray-400 transition duration-300 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </>
              ) : (
                'Login with Email'
              )}
            </button>
          </form>
          <p className="text-center text-sm text-gray-400 mt-6">
            Don't have an account?{' '}
            <button onClick={() => onNavigate('signup')} className="font-medium text-indigo-400 hover:underline" disabled={isLoading || isGoogleLoading}>
              Sign Up
            </button>
          </p>
        </div>
      </div>
      {isResetModalOpen && (
        <PasswordResetModal onClose={() => setIsResetModalOpen(false)} />
      )}
    </>
  );
};
