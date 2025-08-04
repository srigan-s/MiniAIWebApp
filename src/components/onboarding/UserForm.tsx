import React, { useState } from 'react';
import { User } from '../../types';

interface UserFormProps {
  onNext: (data: Partial<User>) => void;
  initialData: Partial<User>;
}

const UserForm: React.FC<UserFormProps> = ({ onNext, initialData }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    age: initialData.age || '',
    email: initialData.email || '',
    password: ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.age || +formData.age < 5 || +formData.age > 18) newErrors.age = 'Age must be between 5 and 18';
    if (!formData.email.trim() || !formData.email.includes('@')) newErrors.email = 'Please enter a valid email';
    if (!formData.password.trim() || formData.password.length < 4) newErrors.password = 'Password must be at least 4 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onNext({
        name: formData.name,
        age: Number(formData.age),
        email: formData.email
      });
    }
  };

  return (
    <div className="relative overflow-hidden min-h-screen bg-black text-white">
      {/* Floating Bubbles */}
      <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <span key={i} className={`big-bubble big-bubble-${i}`}></span>
        ))}
      </div>

      {/* Matrix Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-10 font-mono text-green-500 text-[11px] whitespace-pre-line">
        {"101011001011000111010\n010011100100101001011\n110010100010101010011\n001011010101011100101\n110101010100100110100"}
      </div>

      {/* Main UI */}
      <div className="relative z-10 max-w-lg mx-auto pt-20 px-6">
        <div className="bg-white rounded-3xl shadow-2xl p-10 border-4 border-emerald-300 text-gray-800">
          <div className="text-center mb-6">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <div className="absolute inset-0 border-4 border-emerald-300 rounded-full animate-spin-slow"></div>
              <img src="/miniAiElement.png" alt="MiniAI Logo" className="relative w-24 h-24 mx-auto object-contain" />
              {[...Array(6)].map((_, i) => (
                <span key={i} className={`bubble small-bubble-${i}`}></span>
              ))}
            </div>
            <h1 className="text-4xl font-bold">Welcome to MiniAI</h1>
            <p className="text-gray-600">Let's get to know you better!</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {['name', 'age', 'email', 'password'].map((field) => (
              <div key={field}>
                <label htmlFor={field} className="block text-lg font-semibold mb-2 capitalize">
                  {field === 'password' ? 'Create a password 🔒' : `Your ${field}`}
                </label>
                <input
                  type={field === 'password' ? 'password' : field === 'age' ? 'number' : 'text'}
                  id={field}
                  value={(formData as any)[field]}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
                  }
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-emerald-400 text-lg text-black"
                  placeholder={field === 'password' ? 'Choose a password' : `Enter your ${field}`}
                />
                {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>}
              </div>
            ))}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white py-4 rounded-xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Continue to Avatar Selection 🚀
            </button>
          </form>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 15s linear infinite;
        }

        .big-bubble {
          position: absolute;
          border-radius: 50%;
          background: rgba(163, 217, 165, 0.2);
          animation: floatUp linear infinite;
        }
        ${[...Array(30)].map((_, i) => `
          .big-bubble-${i} {
            width: ${30 + Math.random() * 100}px;
            height: ${30 + Math.random() * 100}px;
            left: ${Math.random() * 100}%;
            animation-duration: ${10 + Math.random() * 20}s;
            animation-delay: -${Math.random() * 10}s;
            bottom: -150px;
          }
        `).join('')}
        @keyframes floatUp {
          0% { transform: translateY(0); opacity: 0.6; }
          100% { transform: translateY(-120vh); opacity: 0; }
        }

        .bubble {
          position: absolute;
          background: rgba(163, 217, 165, 0.5);
          border-radius: 50%;
          opacity: 0.7;
          animation: pulse 4s infinite ease-in-out;
        }
        ${[...Array(6)].map((_, i) => `
          .small-bubble-${i} {
            width: ${6 + i * 2}px;
            height: ${6 + i * 2}px;
            top: ${20 + i * 10}px;
            left: ${20 + i * 10}px;
            animation-delay: ${i * 0.5}s;
          }
        `).join('')}
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.4); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default UserForm;

