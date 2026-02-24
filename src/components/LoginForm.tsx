import React, { useState } from 'react';
import { AlertCircle, Eye, EyeOff, Sparkles } from 'lucide-react';

interface LoginFormProps {
  onLogin: (email: string, password: string) => boolean;
  onGoToSignup: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onGoToSignup }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    const success = onLogin(formData.email, formData.password);

    if (!success) {
      setError('Invalid email or password. Please try again.');
    }

    setIsLoading(false);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden z-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-15%] top-[-10%] h-80 w-80 rounded-full bg-cyan-400/25 blur-3xl animate-float-slow"></div>
        <div className="absolute right-[-10%] bottom-[-20%] h-96 w-96 rounded-full bg-violet-500/25 blur-3xl animate-float-delay"></div>
        <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-emerald-400/20 blur-3xl animate-pulse-glow"></div>
      </div>

      <div className="relative w-full max-w-md z-10">
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-[0_0_45px_rgba(16,185,129,0.16)] p-8 border border-emerald-200/70 mb-6 animate-rise-in">
          <div className="text-center">
            <div className="relative w-36 h-36 mx-auto mb-4 flex items-center justify-center rounded-full bg-white/80 border border-emerald-300/60 shadow-[0_0_30px_rgba(52,211,153,0.35)]">
              <div className="absolute inset-0 rounded-full border-2 border-emerald-300/45 animate-spin-slow"></div>
              <div className="absolute inset-2 rounded-full border border-fuchsia-300/40 animate-spin-reverse"></div>
              <img
                src="/images/miniAiElement.png"
                alt="MiniAI Logo"
                className="relative w-28 h-28 object-contain drop-shadow-[0_0_12px_rgba(74,222,128,0.6)]"
              />
            </div>
            <h1 className="text-3xl font-bold text-emerald-900 mb-2 tracking-wide">Welcome Back!</h1>
            <p className="text-emerald-800/90">Sign in to continue your AI learning journey</p>
          </div>
        </div>

        <div className="relative bg-white/72 backdrop-blur-xl rounded-3xl shadow-[0_0_45px_rgba(16,185,129,0.14)] p-8 border border-emerald-200/70 overflow-hidden animate-rise-in-delay">
          <div className="absolute inset-0 opacity-35 bg-[linear-gradient(120deg,transparent_0%,#6ee7b7_50%,transparent_100%)] animate-scan"></div>
          <form onSubmit={handleSubmit} className="relative space-y-6">
            {error && (
              <div className="bg-rose-50/90 border border-rose-200 rounded-xl p-4 flex items-center space-x-3 text-rose-700">
                <AlertCircle className="w-5 h-5 text-rose-300" />
                <p>{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-lg font-semibold text-emerald-900 mb-2">
                Email Address 📧
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 border border-emerald-200 bg-white/90 text-emerald-900 rounded-xl focus:border-emerald-400 focus:outline-none focus:shadow-[0_0_18px_rgba(16,185,129,0.24)] text-lg transition-all duration-300"
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-lg font-semibold text-emerald-900 mb-2">
                Password 🔒
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-4 py-3 pr-12 border border-emerald-200 bg-white/90 text-emerald-900 rounded-xl focus:border-emerald-400 focus:outline-none focus:shadow-[0_0_18px_rgba(16,185,129,0.24)] text-lg transition-all duration-300"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 flex items-center px-4 text-emerald-600 hover:text-emerald-700 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full relative overflow-hidden bg-gradient-to-r from-emerald-500 via-emerald-400 to-cyan-400 text-white py-4 rounded-xl font-bold text-lg hover:scale-[1.02] transition-all duration-300 shadow-[0_10px_24px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="relative z-10 inline-flex items-center gap-2">
                {isLoading ? 'Signing In...' : 'Sign In'}
                <Sparkles className="w-5 h-5" />
              </span>
              <span className="absolute inset-0 bg-[linear-gradient(120deg,transparent_20%,rgba(255,255,255,0.35)_50%,transparent_80%)] animate-button-shimmer"></span>
            </button>
          </form>

          <div className="relative mt-6 text-center">
            <p className="text-emerald-700 mb-4">Don't have an account yet?</p>
            <button
              onClick={onGoToSignup}
              className="w-full relative overflow-hidden bg-gradient-to-r from-emerald-500 via-emerald-400 to-cyan-400 text-white py-4 rounded-xl font-bold text-lg hover:scale-[1.02] transition-all duration-300 shadow-[0_10px_24px_rgba(16,185,129,0.3)]"
            >
              <span className="relative z-10 inline-flex items-center gap-2">
                Create New Account
                <Sparkles className="w-5 h-5" />
              </span>
              <span className="absolute inset-0 bg-[linear-gradient(120deg,transparent_20%,rgba(255,255,255,0.35)_50%,transparent_80%)] animate-button-shimmer"></span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-24px); }
        }
        @keyframes float-delay {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(20px); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; transform: scale(0.9); }
          50% { opacity: 0.9; transform: scale(1.08); }
        }
        @keyframes rise-in {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scan {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(120%); }
        }
        @keyframes button-shimmer {
          0% { transform: translateX(-130%); }
          100% { transform: translateX(130%); }
        }
        .animate-spin-slow { animation: spin-slow 10s linear infinite; }
        .animate-spin-reverse { animation: spin-reverse 7s linear infinite; }
        .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
        .animate-float-delay { animation: float-delay 10s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 9s ease-in-out infinite; }
        .animate-rise-in { animation: rise-in 0.65s ease-out forwards; }
        .animate-rise-in-delay { animation: rise-in 0.8s ease-out forwards; }
        .animate-scan { animation: scan 6s linear infinite; }
        .animate-button-shimmer { animation: button-shimmer 2.8s linear infinite; }
      `}</style>
    </div>
  );
};

export default LoginForm;
