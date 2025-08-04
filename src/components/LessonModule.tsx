import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import WhatIsAI from './lessons/WhatIsAI';
import AIvsHuman from './lessons/AIvsHuman';
import AIInRealLife from './lessons/AIInRealLife';

interface LessonModuleProps {
  lessonId: number;
  onComplete: () => void;
}

const LessonModule: React.FC<LessonModuleProps> = ({ lessonId, onComplete }) => {
  const { addXP, completeLesson } = useUser();
  const [isCompleted, setIsCompleted] = useState(false);

  const handleLessonComplete = (xpReward: number) => {
    if (!isCompleted) {
      addXP(xpReward);
      completeLesson(lessonId);
      setIsCompleted(true);
      
      // Delay before returning to dashboard to show completion animation
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
  };

  const renderLesson = () => {
    switch (lessonId) {
      case 1:
        return <WhatIsAI onComplete={() => handleLessonComplete(25)} />;
      case 2:
        return <AIvsHuman onComplete={() => handleLessonComplete(30)} />;
      case 3:
        return <AIInRealLife onComplete={() => handleLessonComplete(35)} />;
      default:
        return <div>Lesson not found</div>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {renderLesson()}
    </div>
  );
};

export default LessonModule;