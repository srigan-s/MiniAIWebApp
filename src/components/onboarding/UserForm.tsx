import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, Sparkles } from 'lucide-react';
import { User } from '../../types';

interface UserFormProps {
  onNext: (data: Partial<User>) => void;
  onBackToLogin: () => void;
  initialData: Partial<User>;
}

const UserForm: React.FC<UserFormProps> = ({ onNext, onBackToLogin, initialData }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    age: initialData.age || '',
    email: initialData.email || '',
    password: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.age || Number(formData.age) < 5 || Number(formData.age) > 18) {
      newErrors.age = 'Age must be between 5 and 18';
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password || formData.password.length < 4) {
      newErrors.password = 'Password must be at least 4 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onNext({
        name: formData.name,
        age: Number(formData.age),
        email: formData.email,
        password: formData.password
      });
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden z-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-15%] top-[-10%] h-80 w-80 rounded-full bg-cyan-400/25 blur-3xl animate-float-slow"></div>
        <div className="absolute right-[-10%] bottom-[-20%] h-96 w-96 rounded-full bg-violet-500/25 blur-3xl animate-float-delay"></div>
        <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-emerald-400/20 blur-3xl animate-pulse-glow"></div>
      </div>

      <div className="relative w-full max-w-md z-10">
        <div className="relative bg-white/75 backdrop-blur-xl rounded-[2rem] shadow-[0_0_45px_rgba(16,185,129,0.16)] p-8 border border-emerald-200/70 overflow-hidden animate-rise-in">
          <div className="absolute inset-0 opacity-60 bg-[linear-gradient(110deg,rgba(16,185,129,0.14)_0%,rgba(34,211,238,0.28)_24%,rgba(99,102,241,0.3)_50%,rgba(168,85,247,0.27)_74%,rgba(16,185,129,0.16)_100%)] animate-scan-color"></div>

          <button
            type="button"
            onClick={onBackToLogin}
            className="relative z-10 inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-900 font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Sign In
          </button>

          <div className="relative z-10 text-center mt-4 mb-6">
            <div className="relative w-36 h-36 mx-auto mb-4 flex items-center justify-center rounded-full bg-white/80 border border-emerald-300/60 shadow-[0_0_30px_rgba(52,211,153,0.35)]">
              <div className="absolute inset-0 rounded-full border-2 border-emerald-300/45 animate-spin-slow"></div>
              <div className="absolute inset-2 rounded-full border border-fuchsia-300/40 animate-spin-reverse"></div>
              <img
                src="/images/miniAiElement.png"
                alt="MiniAI Logo"
                className="relative w-28 h-28 object-contain drop-shadow-[0_0_12px_rgba(74,222,128,0.6)]"
              />
            </div>
            <h1 className="text-3xl font-bold text-emerald-900 mb-2 tracking-wide">Create Your Account</h1>
            <p className="text-emerald-800/90">Let's get to know you better</p>
          </div>

          <form onSubmit={handleSubmit} className="relative z-10 space-y-5">
            <div>
              <label htmlFor="name" className="block text-lg font-semibold text-emerald-900 mb-2">What's your name? 😊</label>
              <input type="text" id="name" value={formData.name} onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 border border-emerald-200 bg-white/90 text-emerald-900 rounded-2xl focus:border-emerald-400 focus:outline-none focus:shadow-[0_0_18px_rgba(16,185,129,0.24)] text-lg transition-all duration-300"
                placeholder="Enter your first name" />
              {errors.name && <p className="text-rose-600 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="age" className="block text-lg font-semibold text-emerald-900 mb-2">How old are you? 🎂</label>
              <input type="number" id="age" value={formData.age} onChange={(e) => setFormData((prev) => ({ ...prev, age: e.target.value }))}
                className="w-full px-4 py-3 border border-emerald-200 bg-white/90 text-emerald-900 rounded-2xl focus:border-emerald-400 focus:outline-none focus:shadow-[0_0_18px_rgba(16,185,129,0.24)] text-lg transition-all duration-300"
                placeholder="Your age" min={5} max={18} />
              {errors.age && <p className="text-rose-600 text-sm mt-1">{errors.age}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-lg font-semibold text-emerald-900 mb-2">Email address 📧</label>
              <input type="email" id="email" value={formData.email} onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 border border-emerald-200 bg-white/90 text-emerald-900 rounded-2xl focus:border-emerald-400 focus:outline-none focus:shadow-[0_0_18px_rgba(16,185,129,0.24)] text-lg transition-all duration-300"
                placeholder="your.email@example.com" />
              {errors.email && <p className="text-rose-600 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-lg font-semibold text-emerald-900 mb-2">Create a password 🔒</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} id="password" value={formData.password}
                  onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                  className="w-full px-4 py-3 pr-12 border border-emerald-200 bg-white/90 text-emerald-900 rounded-2xl focus:border-emerald-400 focus:outline-none focus:shadow-[0_0_18px_rgba(16,185,129,0.24)] text-lg transition-all duration-300"
                  placeholder="Enter a password" minLength={4} />
                <button type="button" onClick={() => setShowPassword((prev) => !prev)} aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 flex items-center px-4 text-emerald-600 hover:text-emerald-700 transition-colors duration-200">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-rose-600 text-sm mt-1">{errors.password}</p>}
            </div>

            <button type="submit" className="w-full relative overflow-hidden bg-gradient-to-r from-emerald-500 via-emerald-400 to-cyan-400 text-white py-4 rounded-xl font-bold text-lg hover:scale-[1.02] transition-all duration-300 shadow-[0_10px_24px_rgba(16,185,129,0.3)]">
              <span className="relative z-10 inline-flex items-center gap-2">Continue to Avatar Selection <Sparkles className="w-5 h-5" /></span>
              <span className="absolute inset-0 bg-[linear-gradient(120deg,transparent_20%,rgba(255,255,255,0.35)_50%,transparent_80%)] animate-button-shimmer"></span>
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes spin-slow { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes spin-reverse { 0% { transform: rotate(360deg); } 100% { transform: rotate(0deg); } }
        @keyframes float-slow { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-24px); } }
        @keyframes float-delay { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(20px); } }
        @keyframes pulse-glow { 0%, 100% { opacity: 0.4; transform: scale(0.9); } 50% { opacity: 0.9; transform: scale(1.08); } }
        @keyframes rise-in { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scan-color {
          0% { transform: translate3d(-32%, 0, 0) scaleX(1.02); filter: hue-rotate(0deg) saturate(1); }
          50% { transform: translate3d(0%, 0, 0) scaleX(1.06); filter: hue-rotate(16deg) saturate(1.15); }
          100% { transform: translate3d(32%, 0, 0) scaleX(1.02); filter: hue-rotate(0deg) saturate(1); }
        }
        @keyframes button-shimmer { 0% { transform: translateX(-130%); } 100% { transform: translateX(130%); } }
        .animate-spin-slow { animation: spin-slow 10s linear infinite; }
        .animate-spin-reverse { animation: spin-reverse 7s linear infinite; }
        .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
        .animate-float-delay { animation: float-delay 10s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 9s ease-in-out infinite; }
        .animate-rise-in { animation: rise-in 0.65s ease-out forwards; }
        .animate-scan-color { animation: scan-color 4.8s ease-in-out infinite; }
        .animate-button-shimmer { animation: button-shimmer 2.8s linear infinite; }
      `}</style>
    </div>
  );
};

export default UserForm;
