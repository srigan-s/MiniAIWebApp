import React, { useState } from 'react';
import { Scale, CheckCircle, ArrowRight } from 'lucide-react';

interface AIBiasProps {
  onComplete: () => void;
}

const AIBias: React.FC<AIBiasProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [fairDecisions, setFairDecisions] = useState<{[key: string]: string}>({});
  const [showResults, setShowResults] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const steps = [
    {
      type: 'animation',
      title: 'AI Bias & Fairness',
      content: (
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-blue-400 rounded-full mx-auto flex items-center justify-center text-6xl animate-pulse">
              ⚖️
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
              ❤️
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-800">AI Bias & Fairness</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              AI should be fair to everyone! Sometimes AI can make unfair decisions, so we need to teach it to be fair and kind to all people.
            </p>
            <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-200">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-4xl mb-2">👥</div>
                  <p className="font-semibold">Fair to All</p>
                  <p className="text-sm text-gray-600">Everyone is equal</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">🔍</div>
                  <p className="font-semibold">Check for Bias</p>
                  <p className="text-sm text-gray-600">Look for unfairness</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">🛠️</div>
                  <p className="font-semibold">Fix Problems</p>
                  <p className="text-sm text-gray-600">Make it better</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      type: 'game',
      title: 'Fairness Detective',
      content: (
        <FairnessGame 
          fairDecisions={fairDecisions}
          onDecisionMade={(scenario, decision) => setFairDecisions(prev => ({ ...prev, [scenario]: decision }))}
        />
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
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

  if (showResults) {
    return (
      <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-green-200 text-center">
        <div className="text-6xl mb-4 animate-bounce">🎉</div>
        <h1 className="text-3xl font-bold text-green-700 mb-4">AI Bias Lesson Complete!</h1>
        <p className="text-xl text-gray-600 mb-6">You made {Object.keys(fairDecisions).length} fair decisions!</p>
        <div className="bg-green-100 rounded-2xl p-4">
          <p className="text-green-700 font-semibold">+55 XP Earned!</p>
        </div>
        <div className="bg-green-100 rounded-2xl p-4 mt-4">
          <p className="text-green-700 font-semibold">Redirecting in {countdown}...</p>
        </div>
      </div>
    );
  }

  const canProceed = currentStep === 0 || Object.keys(fairDecisions).length >= 3;

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-green-200">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <Scale className="w-8 h-8 text-green-600" />
          <h1 className="text-2xl font-bold text-gray-800">Lesson 6: AI Bias & Fairness</h1>
        </div>
        <div className="bg-green-100 px-4 py-2 rounded-full">
          <span className="text-green-700 font-semibold">Step {currentStep + 1} of {steps.length}</span>
        </div>
      </div>

      <div className="mb-8">
        {steps[currentStep].content}
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleNext}
          disabled={!canProceed}
          className={`px-8 py-3 rounded-xl font-bold text-lg transition-all duration-200 flex items-center space-x-2 ${
            canProceed
              ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600 hover:scale-105 shadow-lg'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <span>{currentStep === steps.length - 1 ? 'Complete Lesson' : 'Next'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const FairnessGame: React.FC<{
  fairDecisions: {[key: string]: string};
  onDecisionMade: (scenario: string, decision: string) => void;
}> = ({ fairDecisions, onDecisionMade }) => {
  const scenarios = [
    {
      id: 'hiring',
      title: 'Job Application AI',
      description: 'An AI is helping choose people for jobs. What should it focus on?',
      options: [
        { id: 'skills', text: 'Skills and qualifications only', fair: true },
        { id: 'name', text: 'The person\'s name', fair: false },
        { id: 'photo', text: 'How they look in photos', fair: false }
      ]
    },
    {
      id: 'lending',
      title: 'Loan Approval AI',
      description: 'An AI decides who gets loans. What should it consider?',
      options: [
        { id: 'income', text: 'Income and ability to pay back', fair: true },
        { id: 'neighborhood', text: 'What neighborhood they live in', fair: false },
        { id: 'friends', text: 'Who their friends are', fair: false }
      ]
    },
    {
      id: 'school',
      title: 'School Admission AI',
      description: 'An AI helps choose students for a school. What matters most?',
      options: [
        { id: 'grades', text: 'Grades and test scores', fair: true },
        { id: 'parents', text: 'What jobs their parents have', fair: false },
        { id: 'hobbies', text: 'If they play expensive sports', fair: false }
      ]
    },
    {
      id: 'healthcare',
      title: 'Medical AI',
      description: 'An AI helps doctors decide treatment. What should it use?',
      options: [
        { id: 'symptoms', text: 'Medical symptoms and history', fair: true },
        { id: 'insurance', text: 'How much money they have', fair: false },
        { id: 'age', text: 'Only their age', fair: false }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Be a Fairness Detective!</h3>
        <p className="text-gray-600">Help make AI decisions fair for everyone. Choose the most fair option for each scenario!</p>
        <div className="mt-2">
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
            Fair Decisions: {Object.keys(fairDecisions).length}/{scenarios.length}
          </span>
        </div>
      </div>

      <div className="grid gap-6">
        {scenarios.map((scenario) => {
          const userDecision = fairDecisions[scenario.id];
          const hasDecided = userDecision !== undefined;
          
          return (
            <div key={scenario.id} className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border-2 border-green-200">
              <div className="mb-4">
                <h4 className="text-lg font-bold text-gray-800 mb-2">{scenario.title}</h4>
                <p className="text-gray-600">{scenario.description}</p>
              </div>
              
              <div className="space-y-3">
                {scenario.options.map((option) => {
                  const isSelected = userDecision === option.id;
                  const showFeedback = hasDecided;
                  
                  return (
                    <button
                      key={option.id}
                      onClick={() => !hasDecided && onDecisionMade(scenario.id, option.id)}
                      disabled={hasDecided}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                        isSelected
                          ? showFeedback
                            ? option.fair
                              ? 'bg-green-100 border-green-400 text-green-700'
                              : 'bg-red-100 border-red-400 text-red-700'
                            : 'bg-blue-100 border-blue-400 text-blue-700'
                          : showFeedback && option.fair
                          ? 'bg-green-50 border-green-200 text-green-600'
                          : hasDecided
                          ? 'bg-gray-50 border-gray-200 text-gray-500'
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{option.text}</span>
                        {showFeedback && (
                          <div className="ml-2">
                            {(isSelected && option.fair) || (!isSelected && option.fair) ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : isSelected && !option.fair ? (
                              <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">✗</div>
                            ) : null}
                          </div>
                        )}
                      </div>
                      {showFeedback && isSelected && (
                        <p className="text-sm mt-2 opacity-80">
                          {option.fair 
                            ? "Great choice! This is fair because it focuses on relevant qualifications. 🎉" 
                            : "This could be unfair because it might discriminate against certain groups. 🤔"}
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {Object.keys(fairDecisions).length > 0 && (
        <div className="bg-green-50 rounded-2xl p-4 border-2 border-green-200">
          <h4 className="font-bold text-green-700 mb-2">Making AI Fairer! 🎉</h4>
          <p className="text-green-600">
            You're helping create AI that treats everyone fairly! When we build AI systems, we must always think about fairness and make sure they don't discriminate against anyone.
          </p>
        </div>
      )}
    </div>
  );
};

export default AIBias;