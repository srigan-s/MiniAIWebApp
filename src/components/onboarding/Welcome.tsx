import React from 'react';
import { User } from '../../types';
import { RobotAvatar, getAvatarOptionById } from '../../lib/avatarOptions';

interface WelcomeProps {
  onComplete: (data: Record<string, never>) => void;
  userData: Partial<User>;
  isSubmitting?: boolean;
}

const Welcome: React.FC<WelcomeProps> = ({ onComplete, userData, isSubmitting = false }) => {
  const avatar = getAvatarOptionById(userData.avatar);

  const handleStart = () => {
    onComplete({});
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-emerald-200">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-[2rem] bg-gradient-to-br from-white to-emerald-50 shadow-xl">
          <RobotAvatar avatarId={avatar.id} size="xl" animated />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome, {userData.name}! 🎉
        </h1>
        <p className="mb-6 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
          Your robot guide is {avatar.name}, {avatar.title}
        </p>
        
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
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white py-4 rounded-xl font-bold text-xl hover:from-emerald-600 hover:to-cyan-600 transition-all duration-200 hover:scale-105 shadow-lg animate-pulse"
        >
          {isSubmitting ? 'Creating your account...' : 'Start Your AI Adventure! 🚀'}
        </button>
      </div>
    </div>
  );
};

export default Welcome;
