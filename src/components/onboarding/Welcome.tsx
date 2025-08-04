import React from 'react';
import { User } from '../../types';

interface WelcomeProps {
  onComplete: (data: {}) => void;
  userData: Partial<User>;
}

const Welcome: React.FC<WelcomeProps> = ({ onComplete, userData }) => {
  const handleStart = () => {
    onComplete({});
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-emerald-200">
      <div className="text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-full mx-auto mb-6 flex items-center justify-center text-5xl animate-bounce">
          {userData.avatar || '🤖'}
        </div>
        
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome, {userData.name}! 🎉
        </h1>
        
        <div className="bg-gradient-to-r from-emerald-100 to-cyan-100 rounded-2xl p-6 mb-6">
          <p className="text-lg text-gray-700 mb-4">
            You're about to embark on an amazing journey to discover the world of Artificial Intelligence!
          </p>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-white rounded-xl p-3">
              <div className="text-2xl mb-1">🎮</div>
              <div className="font-semibold">Fun Games</div>
              <div className="text-gray-600">Interactive challenges</div>
            </div>
            <div className="bg-white rounded-xl p-3">
              <div className="text-2xl mb-1">🏆</div>
              <div className="font-semibold">Earn Badges</div>
              <div className="text-gray-600">Unlock achievements</div>
            </div>
            <div className="bg-white rounded-xl p-3">
              <div className="text-2xl mb-1">⭐</div>
              <div className="font-semibold">Level Up</div>
              <div className="text-gray-600">Gain XP points</div>
            </div>
            <div className="bg-white rounded-xl p-3">
              <div className="text-2xl mb-1">🧠</div>
              <div className="font-semibold">Learn AI</div>
              <div className="text-gray-600">Discover the future</div>
            </div>
          </div>
        </div>

        <button
          onClick={handleStart}
          className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white py-4 rounded-xl font-bold text-xl hover:from-emerald-600 hover:to-cyan-600 transition-all duration-200 hover:scale-105 shadow-lg animate-pulse"
        >
          Start Your AI Adventure! 🚀
        </button>
      </div>
    </div>
  );
};

export default Welcome;