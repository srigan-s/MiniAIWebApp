import React, { useState } from 'react';
import { Bot, ArrowRight, CheckCircle } from 'lucide-react';

interface RobotTrainingProps {
  onComplete: () => void;
}

const RobotTraining: React.FC<RobotTrainingProps> = ({ onComplete }) => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [robotDecisions, setRobotDecisions] = useState<{[key: number]: string}>({});
  const [showResults, setShowResults] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const scenarios = [
    {
      id: 0,
      title: "Teaching Robot to Identify Fruits",
      description: "Your robot sees a round, red object. What should it do?",
      image: "🍎",
      options: [
        { id: 'apple', text: 'Say: "This is an apple!"', correct: true },
        { id: 'ball', text: 'Say: "This is a ball!"', correct: false },
        { id: 'confused', text: 'Say: "I don\'t know!"', correct: false }
      ]
    },
    {
      id: 1,
      title: "Robot Navigation",
      description: "Your robot encounters a wall. What should it think?",
      image: "🧱",
      options: [
        { id: 'stop', text: 'Stop and find another path', correct: true },
        { id: 'crash', text: 'Keep moving forward', correct: false },
        { id: 'wait', text: 'Wait for the wall to move', correct: false }
      ]
    },
    {
      id: 2,
      title: "Pattern Recognition",
      description: "Show the robot this pattern: 🔴🔵🔴🔵🔴... What comes next?",
      image: "🔴🔵🔴🔵🔴❓",
      options: [
        { id: 'blue', text: 'Blue circle 🔵', correct: true },
        { id: 'red', text: 'Red circle 🔴', correct: false },
        { id: 'green', text: 'Green circle 🟢', correct: false }
      ]
    }
  ];

  const handleDecision = (scenarioId: number, optionId: string) => {
    setRobotDecisions(prev => ({ ...prev, [scenarioId]: optionId }));
  };

  const handleNext = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
    } else {
      setShowResults(true);
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

  const getCurrentScenario = () => scenarios[currentScenario];
  const hasDecision = robotDecisions[currentScenario] !== undefined;

  if (showResults) {
    const correctAnswers = scenarios.filter(scenario => {
      const decision = robotDecisions[scenario.id];
      const option = scenario.options.find(opt => opt.id === decision);
      return option?.correct;
    }).length;

    return (
      <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-green-200 text-center">
        <div className="text-6xl mb-4 animate-bounce">🤖</div>
        <h1 className="text-3xl font-bold text-green-700 mb-4">Robot Training Complete!</h1>
        <p className="text-xl text-gray-600 mb-6">
          Your robot learned {correctAnswers} out of {scenarios.length} lessons correctly!
        </p>
        <div className="bg-green-100 rounded-2xl p-4">
          <p className="text-green-700 font-semibold">+40 XP Earned!</p>
        </div>
        <div className="bg-green-100 rounded-2xl p-4 mt-4">
          <p className="text-green-700 font-semibold">Redirecting in {countdown}...</p>
        </div>
      </div>
    );
  }

  const scenario = getCurrentScenario();

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-blue-200">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <Bot className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">Train a Robot</h1>
        </div>
        <div className="bg-blue-100 px-4 py-2 rounded-full">
          <span className="text-blue-700 font-semibold">
            Scenario {currentScenario + 1} of {scenarios.length}
          </span>
        </div>
      </div>

      <div className="space-y-8">
        <div className="text-center">
          <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full mx-auto mb-6 flex items-center justify-center text-6xl animate-pulse">
            🤖
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{scenario.title}</h2>
          <p className="text-lg text-gray-600 mb-4">{scenario.description}</p>
          <div className="text-6xl mb-6">{scenario.image}</div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-center text-gray-700">
            Choose what the robot should think:
          </h3>
          <div className="grid gap-4">
            {scenario.options.map((option) => {
              const isSelected = robotDecisions[currentScenario] === option.id;
              const showFeedback = hasDecision;
              
              return (
                <button
                  key={option.id}
                  onClick={() => handleDecision(currentScenario, option.id)}
                  disabled={hasDecision}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    isSelected
                      ? showFeedback
                        ? option.correct
                          ? 'bg-green-100 border-green-400 text-green-700'
                          : 'bg-red-100 border-red-400 text-red-700'
                        : 'bg-blue-100 border-blue-400 text-blue-700'
                      : showFeedback && option.correct
                      ? 'bg-green-50 border-green-200 text-green-600'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  } ${hasDecision ? 'cursor-default' : 'cursor-pointer hover:scale-102'}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option.text}</span>
                    {showFeedback && isSelected && (
                      <div className="ml-2">
                        {option.correct ? (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white text-sm">✗</div>
                        )}
                      </div>
                    )}
                    {showFeedback && !isSelected && option.correct && (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    )}
                  </div>
                  {showFeedback && isSelected && (
                    <p className="text-sm mt-2 opacity-80">
                      {option.correct 
                        ? "Great choice! The robot learned correctly! 🎉" 
                        : "Not quite right, but that's how robots learn! 🤖"}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {hasDecision && (
          <div className="text-center">
            <button
              onClick={handleNext}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-xl font-bold text-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 hover:scale-105 shadow-lg flex items-center space-x-2 mx-auto"
            >
              <span>{currentScenario === scenarios.length - 1 ? 'Complete Training' : 'Next Scenario'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RobotTraining;