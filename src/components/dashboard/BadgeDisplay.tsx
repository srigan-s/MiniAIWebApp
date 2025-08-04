import React from 'react';
import { Badge } from '../../types';
import { Award } from 'lucide-react';

interface BadgeDisplayProps {
  badges: Badge[];
}

const BadgeDisplay: React.FC<BadgeDisplayProps> = ({ badges }) => {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border-4 border-purple-200">
      <div className="flex items-center mb-6">
        <Award className="w-8 h-8 text-purple-600 mr-3" />
        <h2 className="text-3xl font-bold text-gray-800">Your Achievements</h2>
      </div>
      
      {badges.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏆</div>
          <p className="text-xl text-gray-600">No badges yet!</p>
          <p className="text-gray-500">Complete lessons and games to earn your first badge.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-4 text-center hover:scale-105 transition-transform duration-200 shadow-lg"
            >
              <div className="text-4xl mb-2">{badge.icon}</div>
              <h3 className="font-bold text-purple-700 mb-1">{badge.name}</h3>
              <p className="text-sm text-purple-600">{badge.description}</p>
              <p className="text-xs text-gray-500 mt-2">
                Earned {new Date(badge.unlockedAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BadgeDisplay;