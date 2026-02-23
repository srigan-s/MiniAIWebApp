import React, { useState } from 'react';
import { Brain, CheckCircle, ArrowRight } from 'lucide-react';

interface WhatIsAIProps {
  onComplete: () => void;
}

const WhatIsAI: React.FC<WhatIsAIProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<{[key: number]: string}>({});
  const [showResults, setShowResults] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const steps = [
    {
      type: 'animation',
      title: 'What is AI?',
      content: (
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-full mx-auto flex items-center justify-center text-6xl animate-pulse">
              🧠
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
              ✨
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-800">Artificial Intelligence (AI)</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              AI is like giving computers a brain! It helps machines think, learn, and make decisions just like humans do.
            </p>
            <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-4xl mb-2">🤖</div>
                  <p className="font-semibold">AI can think</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">📚</div>
                  <p className="font-semibold">AI can learn</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      type: 'quiz',
      title: 'Drag & Drop Quiz',
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center text-gray-800">Match the AI Examples!</h2>
          <DragDropQuiz onAnswerChange={(answers) => setQuizAnswers(answers)} />
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Show results
      setShowResults(true);
      setCountdown(3);
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(countdownInterval);
            onComplete();
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  if (showResults) {
    return (
      <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-green-200 text-center">
        <div className="text-6xl mb-4 animate-bounce">🎉</div>
        <h1 className="text-3xl font-bold text-green-700 mb-4">Lesson Complete!</h1>
        <p className="text-xl text-gray-600 mb-6">Great job learning about AI!</p>
        <div className="bg-green-100 rounded-2xl p-4">
          <p className="text-green-700 font-semibold">+25 XP Earned!</p>
        </div>
        <div className="bg-green-100 rounded-2xl p-4 mt-4">
          <p className="text-green-700 font-semibold">Redirecting in {countdown}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-emerald-200">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <Brain className="w-8 h-8 text-emerald-600" />
          <h1 className="text-2xl font-bold text-gray-800">Lesson 1: What is AI?</h1>
        </div>
        <div className="bg-emerald-100 px-4 py-2 rounded-full">
          <span className="text-emerald-700 font-semibold">Step {currentStep + 1} of {steps.length}</span>
        </div>
      </div>

      <div className="mb-8">
        {steps[currentStep].content}
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleNext}
          className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-8 py-3 rounded-xl font-bold text-lg hover:from-emerald-600 hover:to-cyan-600 transition-all duration-200 hover:scale-105 shadow-lg flex items-center space-x-2"
        >
          <span>{currentStep === steps.length - 1 ? 'Complete Lesson' : 'Next'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const DragDropQuiz: React.FC<{ onAnswerChange: (answers: {[key: number]: string}) => void }> = ({ onAnswerChange }) => {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [droppedItems, setDroppedItems] = useState<{[key: string]: string}>({});

  const items = [
    { id: 'siri', text: 'Siri (Voice Assistant)', category: 'ai' },
    { id: 'calculator', text: 'Calculator', category: 'not-ai' },
    { id: 'netflix', text: 'Netflix Recommendations', category: 'ai' },
    { id: 'book', text: 'Paper Book', category: 'not-ai' }
  ];

  const categories = [
    { id: 'ai', title: 'This is AI! 🤖', color: 'emerald' },
    { id: 'not-ai', title: 'Not AI 📝', color: 'gray' }
  ];

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId);
  };

  const handleDrop = (e: React.DragEvent, categoryId: string) => {
    e.preventDefault();
    if (draggedItem) {
      setDroppedItems(prev => ({ ...prev, [draggedItem]: categoryId }));
      setDraggedItem(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 justify-center p-4 bg-gray-50 rounded-2xl">
        {items.filter(item => !droppedItems[item.id]).map(item => (
          <div
            key={item.id}
            draggable
            onDragStart={(e) => handleDragStart(e, item.id)}
            className="bg-white px-4 py-3 rounded-xl shadow-md cursor-move hover:shadow-lg transition-shadow border-2 border-blue-200"
          >
            {item.text}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {categories.map(category => (
          <div
            key={category.id}
            onDrop={(e) => handleDrop(e, category.id)}
            onDragOver={handleDragOver}
            className={`min-h-32 p-4 border-3 border-dashed rounded-2xl transition-all ${
              category.color === 'emerald' 
                ? 'border-emerald-300 bg-emerald-50' 
                : 'border-gray-300 bg-gray-50'
            }`}
          >
            <h3 className="text-lg font-bold mb-3 text-center">{category.title}</h3>
            <div className="space-y-2">
              {Object.entries(droppedItems)
                .filter(([_, catId]) => catId === category.id)
                .map(([itemId, _]) => {
                  const item = items.find(i => i.id === itemId);
                  const isCorrect = item?.category === category.id;
                  return (
                    <div
                      key={itemId}
                      className={`p-3 rounded-xl flex items-center justify-between ${
                        isCorrect 
                          ? 'bg-green-100 border-2 border-green-300' 
                          : 'bg-red-100 border-2 border-red-300'
                      }`}
                    >
                      <span>{item?.text}</span>
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">✗</div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhatIsAI;