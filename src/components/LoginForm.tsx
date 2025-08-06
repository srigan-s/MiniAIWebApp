import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header Section */}
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
            <p className="text-gray-600">Sign in to continue your AI learning journey</p>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-emerald-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-lg font-semibold text-gray-700 mb-2">
                Email Address 📧
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 border-3 border-gray-200 rounded-xl focus:border-emerald-400 focus:outline-none text-lg transition-all duration-200"
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-lg font-semibold text-gray-700 mb-2">
                Password 🔒
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-4 py-3 border-3 border-gray-200 rounded-xl focus:border-emerald-400 focus:outline-none text-lg transition-all duration-200"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white py-4 rounded-xl font-bold text-lg hover:from-emerald-600 hover:to-cyan-600 transition-all duration-200 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing In...' : 'Sign In 🚀'}
            </button>
          </form>

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