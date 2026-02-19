import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import {
  getAuth,
  getMultiFactorResolver,
  completeMfaSignIn,
  finalizePhoneEnrollment,
  signInWithGoogle,
  startMfaSignIn,
  startPhoneEnrollment,
} from '../lib/firebase';

interface LoginFormProps {
  onLoginSuccess: () => void;
  onGoToSignup: () => void;
}

const auth = getAuth();

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, onGoToSignup }) => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneCode, setPhoneCode] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [setupStep, setSetupStep] = useState<'none' | 'phone' | 'otp'>('none');

  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true);

    try {
      const result = await signInWithGoogle();
      const enrolledFactors = result.user.multiFactor.enrolledFactors;

      if (!enrolledFactors.length) {
        setSetupStep('phone');
        return;
      }

      onLoginSuccess();
    } catch (signInError: unknown) {
      const firebaseError = signInError as { code?: string };

      if (firebaseError.code === 'auth/multi-factor-auth-required') {
        try {
          const resolver = getMultiFactorResolver(signInError);
          const firstPhoneFactor = resolver.hints[0];

          if (!firstPhoneFactor?.uid) {
            setError('No SMS second factor is available for this account.');
            return;
          }

          const smsVerificationId = await startMfaSignIn(
            resolver,
            firstPhoneFactor.uid,
            'recaptcha-container',
          );

          setVerificationId(smsVerificationId);
          setSetupStep('otp');

          const verificationCode = window.prompt('Enter the SMS code sent to your phone');

          if (!verificationCode) {
            setError('Second factor verification was cancelled.');
            return;
          }

          await completeMfaSignIn(resolver, smsVerificationId, verificationCode);
          onLoginSuccess();
        } catch {
          setError('Unable to complete two-factor verification. Please try again.');
        }
      } else {
        setError('Google sign-in failed. Please check your Firebase configuration.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnrollPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!auth.currentUser) {
      setError('Please sign in with Google first.');
      return;
    }

    try {
      const session = await auth.currentUser.multiFactor.getSession();
      const smsVerificationId = await startPhoneEnrollment(phoneNumber, session, 'recaptcha-container');
      setVerificationId(smsVerificationId);
      setSetupStep('otp');
    } catch {
      setError('Could not send verification code. Confirm your phone number format (e.g. +15551234567).');
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!verificationId) {
      setError('Missing verification session. Please restart sign in.');
      return;
    }

    try {
      await finalizePhoneEnrollment(verificationId, phoneCode, 'Primary phone');
      onLoginSuccess();
    } catch {
      setError('Invalid verification code. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-emerald-200 mb-8">
          <div className="text-center">
            <div className="relative w-28 h-28 mx-auto mb-4 flex items-center justify-center rounded-full bg-[#E6F2E9]">
              <div className="absolute inset-0 rounded-full border-4 border-[#A3D9A5] animate-spin-fast"></div>
              <img
                src="/images/miniAiElement.png"
                alt="MiniAI Logo"
                className="relative w-20 h-20 object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back!</h1>
            <p className="text-gray-600">Sign in with Google and complete 2FA to continue.</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-emerald-200">
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-center space-x-3 mb-6">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {setupStep === 'none' && (
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white py-4 rounded-xl font-bold text-lg hover:from-emerald-600 hover:to-cyan-600 transition-all duration-200 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing In...' : 'Continue with Google 🔐'}
            </button>
          )}

          {setupStep === 'phone' && (
            <form onSubmit={handleEnrollPhone} className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800">Set up Two-Factor Authentication</h2>
              <p className="text-gray-600">Enter your phone number to receive your one-time verification code.</p>
              <input
                type="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+15551234567"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-400 focus:outline-none"
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white py-3 rounded-xl font-semibold"
              >
                Send Verification Code
              </button>
            </form>
          )}

          {setupStep === 'otp' && (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800">Enter verification code</h2>
              <input
                type="text"
                required
                value={phoneCode}
                onChange={(e) => setPhoneCode(e.target.value)}
                placeholder="123456"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-400 focus:outline-none"
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white py-3 rounded-xl font-semibold"
              >
                Verify & Continue
              </button>
            </form>
          )}

          <div id="recaptcha-container" />

          <div className="mt-6 text-center">
            <p className="text-gray-600 mb-4">Don't have an account yet?</p>
            <button
              onClick={onGoToSignup}
              className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors duration-200"
            >
              Create a new account →
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin-fast {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-fast {
          animation: spin-fast 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LoginForm;
