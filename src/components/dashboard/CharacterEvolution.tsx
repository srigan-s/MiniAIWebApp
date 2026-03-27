import React from 'react';
import { User } from '../../types';
import { RobotAvatar } from '../../lib/avatarOptions';

interface CharacterEvolutionProps {
  user: User;
}

const CharacterEvolution: React.FC<CharacterEvolutionProps> = ({ user }) => {
  const getCharacterSize = (): 'md' | 'lg' | 'xl' => {
    if (user.level >= 5) return 'xl';
    if (user.level >= 3) return 'lg';
    return 'md';
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
      <div className={`flex h-28 w-28 items-center justify-center rounded-[2rem] bg-gradient-to-br ${getCharacterBg()} ${getCharacterEffects()} transition-all duration-500`}>
        <RobotAvatar avatarId={user.avatar} size={getCharacterSize()} animated={user.level >= 3} />
      </div>
      <div className="mt-2">
        <p className="text-sm font-semibold text-gray-600">
          {user.level >= 5 ? 'AI Master' : user.level >= 3 ? 'AI Explorer' : 'AI Beginner'}
        </p>
      </div>
    </div>
  );
};

export default CharacterEvolution;
