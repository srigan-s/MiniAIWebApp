import React from 'react';
import { User } from '../../types';

interface CharacterEvolutionProps {
  user: User;
}

const CharacterEvolution: React.FC<CharacterEvolutionProps> = ({ user }) => {
  const getCharacterSize = () => {
    if (user.level >= 5) return "text-8xl";
    if (user.level >= 3) return "text-6xl";
    return "text-4xl";
  };

  const getCharacterBg = () => {
    if (user.level >= 5) return "from-purple-400 via-pink-400 to-red-400";
    if (user.level >= 3) return "from-emerald-400 via-cyan-400 to-blue-400";
    return "from-emerald-400 to-cyan-400";
  };

  const getCharacterEffects = () => {
    if (user.level >= 5) return "animate-pulse shadow-2xl";
    if (user.level >= 3) return "animate-bounce shadow-xl";
    return "shadow-lg";
  };

  return (
    <div className="text-center">
      <div className={`w-24 h-24 bg-gradient-to-br ${getCharacterBg()} rounded-full flex items-center justify-center ${getCharacterEffects()} transition-all duration-500`}>
        <div className={getCharacterSize()}>
          {user.avatar}
        </div>
      </div>
      <div className="mt-2">
        <p className="text-sm font-semibold text-gray-600">
          {user.level >= 5 ? "AI Master" : user.level >= 3 ? "AI Explorer" : "AI Beginner"}
        </p>
      </div>
    </div>
  );
};

export default CharacterEvolution;