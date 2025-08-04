import React from 'react';
import { CheckCircle, Lock, Star } from 'lucide-react';

interface LessonCardProps {
  lesson: {
    id: number;
    title: string;
    description: string;
    xpReward: number;
    icon: string;
  };
  isCompleted: boolean;
  onStart: () => void;
}

const LessonCard: React.FC<LessonCardProps> = ({ lesson, isCompleted, onStart }) => {
  return (
    <div className={`rounded-2xl p-6 border-3 transition-all duration-200 hover:scale-105 cursor-pointer ${
      isCompleted 
        ? 'bg-green-50 border-green-200 shadow-lg' 
        : 'bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200 shadow-md hover:shadow-xl'
    }`} onClick={onStart}>
      <div className="text-center mb-4">
        <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center text-3xl ${
          isCompleted ? 'bg-green-200' : 'bg-cyan-200'
        }`}>
          {lesson.icon}
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-gray-800 mb-2">{lesson.title}</h3>
      <p className="text-gray-600 text-sm mb-4">{lesson.description}</p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <Star className="w-4 h-4 text-yellow-500" />
          <span className="text-sm font-medium text-gray-700">{lesson.xpReward} XP</span>
        </div>
        
        {isCompleted ? (
          <div className="flex items-center space-x-1 text-green-600">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Completed</span>
          </div>
        ) : (
          <button className="bg-cyan-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-cyan-600 transition-colors duration-200">
            Start
          </button>
        )}
      </div>
    </div>
  );
};

export default LessonCard;