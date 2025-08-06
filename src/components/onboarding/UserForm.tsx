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
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.age || formData.age < 5 || formData.age > 18) {
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
    <div className="relative overflow-hidden">
      {/* Bubbles Container */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        {/* Render multiple bubbles */}
        {[...Array(15)].map((_, i) => (
          <span key={i} className={`bubble bubble-${i + 1}`}></span>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10">
        {/* Header Section with faster rotating light green globe effect */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-emerald-200 mb-8 max-w-md mx-auto">
          <div className="text-center">
            <div className="relative w-28 h-28 mx-auto mb-4 flex items-center justify-center rounded-full bg-[#E6F2E9]">
              {/* Rotating ring/globe effect */}
              <div className="absolute inset-0 rounded-full border-4 border-[#A3D9A5] animate-spin-fast"></div>
              {/* Logo */}
              <img
                src="images/miniAiElement.png"
                alt="MiniAI Logo"
                className="relative w-20 h-20 object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to MiniAI!</h1>
            <p className="text-gray-600">Let's get to know you better</p>
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
          <div>
            <label htmlFor="name" className="block text-lg font-semibold text-gray-700 mb-2">
              What's your name? 😊
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 border-3 border-gray-200 rounded-xl focus:border-emerald-400 focus:outline-none text-lg transition-all duration-200"
              placeholder="Enter your first name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="age" className="block text-lg font-semibold text-gray-700 mb-2">
              How old are you? 🎂
            </label>
            <input
              type="number"
              id="age"
              value={formData.age}
              onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
              className="w-full px-4 py-3 border-3 border-gray-200 rounded-xl focus:border-emerald-400 focus:outline-none text-lg transition-all duration-200"
              placeholder="Your age"
              min={5}
              max={18}
            />
            {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-lg font-semibold text-gray-700 mb-2">
              Email address 📧
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-3 border-3 border-gray-200 rounded-xl focus:border-emerald-400 focus:outline-none text-lg transition-all duration-200"
              placeholder="your.email@example.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-lg font-semibold text-gray-700 mb-2">
              Create a password 🔒
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="w-full px-4 py-3 border-3 border-gray-200 rounded-xl focus:border-emerald-400 focus:outline-none text-lg transition-all duration-200"
              placeholder="Enter a password"
              minLength={4}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white py-4 rounded-xl font-bold text-lg hover:from-emerald-600 hover:to-cyan-600 transition-all duration-200 hover:scale-105 shadow-lg"
          >
            Continue to Avatar Selection 🚀
          </button>
        </form>
      </div>

      {/* Inline styles for animations */}
      <style>{`
        @keyframes spin-fast {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-fast {
          animation: spin-fast 3s linear infinite;
        }

        /* Bubble base style */
        .bubble {
          position: absolute;
          bottom: -50px;
          background: rgba(163, 217, 165, 0.6);
          border-radius: 50%;
          opacity: 0.7;
          animation-name: bubble-rise;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        @keyframes bubble-rise {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0.7;
          }
          100% {
            transform: translateY(-120vh) scale(1.3);
            opacity: 0;
          }
        }

        /* Different sizes, left positions, delays, durations for bubbles */
        ${[...Array(15)].map((_, i) => `
          .bubble-${i + 1} {
            width: ${10 + (i % 5) * 5}px;
            height: ${10 + (i % 5) * 5}px;
            left: ${(i * 7) % 100}%;
            animation-duration: ${6 + (i % 5) * 2}s;
            animation-delay: -${(i * 1.5)}s;
          }
        `).join('')}
      `}</style>
    </div>
  );
};

export default UserForm;
