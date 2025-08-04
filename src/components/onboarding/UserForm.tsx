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
    <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-emerald-200">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
          🧠
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to MiniAI!</h1>
        <p className="text-gray-600">Let's get to know you better</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
            min="5"
            max="18"
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

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white py-4 rounded-xl font-bold text-lg hover:from-emerald-600 hover:to-cyan-600 transition-all duration-200 hover:scale-105 shadow-lg"
        >
          Continue to Avatar Selection 🚀
        </button>
      </form>
    </div>
  );
};

export default UserForm;