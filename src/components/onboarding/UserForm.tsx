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
    email: initialData.email || ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.age || formData.age < 5 || formData.age > 18) {
      newErrors.age = 'Age must be between 5 and 18';
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      newErrors.email = 'Please enter a valid email';
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
        email: formData.email
      });
    }
  };

  return (
    <div className="relative overflow-hidden min-h-screen bg-[#F9FBF8] flex flex-col items-center justify-center p-6">
      {/* Background bubbles behind entire form */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        {[...Array(12)].map((_, i) => (
          <span key={i} className={`bg-bubble bubble-${i + 1}`}></span>
        ))}
      </div>

      {/* Main content container */}
      <div className="bg-white rounded-3xl shadow-2xl p-10 border-4 border-[#A3D9A5] max-w-lg w-full relative z-10">
        {/* Logo with orbiting bubbles */}
        <div className="relative w-36 h-36 mx-auto mb-6 rounded-full bg-[#E6F2E9] flex items-center justify-center">
          {/* The MiniAI logo */}
          <img
            src="/miniAiElement.png"
            alt="MiniAI Logo"
            className="w-28 h-28 object-contain relative z-20"
          />

          {/* Orbiting bubbles */}
          {[...Array(8)].map((_, i) => (
            <span
              key={i}
              className={`orbit-bubble orbit-bubble-${i + 1} absolute rounded-full bg-[#A3D9A5] opacity-70`}
            />
          ))}
        </div>

        <h1 className="text-4xl font-bold text-gray-800 mb-3 text-center">
          Welcome to MiniAI!
        </h1>
        <p className="text-gray-600 text-center mb-8 text-lg">
          Let's get to know you better
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label
              htmlFor="name"
              className="block text-xl font-semibold text-gray-700 mb-3"
            >
              What's your name? 😊
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full px-5 py-4 border-3 border-gray-300 rounded-xl focus:border-[#A3D9A5] focus:outline-none text-xl transition-all duration-200"
              placeholder="Enter your first name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="age"
              className="block text-xl font-semibold text-gray-700 mb-3"
            >
              How old are you? 🎂
            </label>
            <input
              type="number"
              id="age"
              value={formData.age}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, age: e.target.value }))
              }
              className="w-full px-5 py-4 border-3 border-gray-300 rounded-xl focus:border-[#A3D9A5] focus:outline-none text-xl transition-all duration-200"
              placeholder="Your age"
              min={5}
              max={18}
            />
            {errors.age && (
              <p className="text-red-500 text-sm mt-1">{errors.age}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-xl font-semibold text-gray-700 mb-3"
            >
              Email address 📧
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full px-5 py-4 border-3 border-gray-300 rounded-xl focus:border-[#A3D9A5] focus:outline-none text-xl transition-all duration-200"
              placeholder="your.email@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white py-5 rounded-xl font-bold text-xl hover:from-emerald-600 hover:to-cyan-600 transition-all duration-200 hover:scale-105 shadow-lg"
          >
            Continue to Avatar Selection 🚀
          </button>
        </form>
      </div>

      {/* Styles */}
      <style>{`
        /* Background bubbles behind form */
        .bg-bubble {
          position: absolute;
          bottom: -60px;
          border-radius: 50%;
          opacity: 0.5;
          animation-name: bubble-rise;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          background: rgba(163, 217, 165, 0.6);
          filter: drop-shadow(0 0 2px rgba(163,217,165,0.8));
        }
        @keyframes bubble-rise {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0.5;
          }
          100% {
            transform: translateY(-130vh) scale(1.4);
            opacity: 0;
          }
        }
        ${[...Array(12)].map((_, i) => `
          .bubble-${i + 1} {
            width: ${14 + (i % 4) * 6}px;
            height: ${14 + (i % 4) * 6}px;
            left: ${(i * 8 + 5) % 100}%;
            animation-duration: ${7 + (i % 5) * 3}s;
            animation-delay: -${(i * 2)}s;
          }
        `).join('')}

        /* Orbiting bubbles around logo */
        .orbit-bubble {
          width: 12px;
          height: 12px;
          opacity: 0.7;
          filter: drop-shadow(0 0 1px rgba(163, 217, 165, 0.8));
        }
        /* Positions and orbit animations */
        .orbit-bubble-1 {
          top: 8%;
          left: 50%;
          animation: orbit-1 5s linear infinite;
          transform-origin: 50% 180%;
          animation-delay: 0s;
        }
        .orbit-bubble-2 {
          top: 25%;
          left: 20%;
          animation: orbit-2 7s linear infinite;
          transform-origin: 70% 150%;
          animation-delay: 1s;
        }
        .orbit-bubble-3 {
          top: 60%;
          left: 10%;
          animation: orbit-3 6s linear infinite;
          transform-origin: 90% 120%;
          animation-delay: 2s;
        }
        .orbit-bubble-4 {
          top: 80%;
          left: 35%;
          animation: orbit-4 8s linear infinite;
          transform-origin: 40% 90%;
          animation-delay: 3s;
        }
        .orbit-bubble-5 {
          top: 85%;
          left: 75%;
          animation: orbit-5 7.5s linear infinite;
          transform-origin: 80% 85%;
          animation-delay: 4s;
        }
        .orbit-bubble-6 {
          top: 45%;
          left: 85%;
          animation: orbit-6 6.5s linear infinite;
          transform-origin: 100% 110%;
          animation-delay: 5s;
        }
        .orbit-bubble-7 {
          top: 20%;
          left: 80%;
          animation: orbit-7 7.2s linear infinite;
          transform-origin: 75% 130%;
          animation-delay: 6s;
        }
        .orbit-bubble-8 {
          top: 5%;
          left: 65%;
          animation: orbit-8 6.8s linear infinite;
          transform-origin: 60% 150%;
          animation-delay: 7s;
        }

        /* Orbit keyframes for gentle circular motion */
        @keyframes orbit-1 {
          0% { transform: rotate(0deg) translateX(60px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(60px) rotate(-360deg); }
        }
        @keyframes orbit-2 {
          0% { transform: rotate(0deg) translateX(50px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(50px) rotate(-360deg); }
        }
        @keyframes orbit-3 {
          0% { transform: rotate(0deg) translateX(55px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(55px) rotate(-360deg); }
        }
        @keyframes orbit-4 {
          0% { transform: rotate(0deg) translateX(45px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(45px) rotate(-360deg); }
        }
        @keyframes orbit-5 {
          0% { transform: rotate(0deg) translateX(65px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(65px) rotate(-360deg); }
        }
        @keyframes orbit-6 {
          0% { transform: rotate(0deg) translateX(55px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(55px) rotate(-360deg); }
        }
        @keyframes orbit-7 {
          0% { transform: rotate(0deg) translateX(50px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(50px) rotate(-360deg); }
        }
        @keyframes orbit-8 {
          0% { transform: rotate(0deg) translateX(60px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(60px) rotate(-360deg); }
        }
      `}</style>
    </div>
  );
};

export default UserForm;
