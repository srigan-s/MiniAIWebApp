import React from 'react';

interface ProgressBarProps {
  progress: number;
  totalActivities: number;
  completedActivities: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, totalActivities, completedActivities }) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm font-medium text-gray-600">
        <span>Overall Progress ({completedActivities}/{totalActivities} activities)</span>
        <span>{Math.min(Math.round(progress), 100)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
        <div 
          className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-4 rounded-full transition-all duration-500 ease-out shadow-lg"
          style={{ width: `${Math.min(progress, 100)}%` }}
        >
          <div className="h-full w-full bg-white opacity-30 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;