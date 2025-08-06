import React, { useState } from 'react';
import { Search, CheckCircle, ArrowRight, AlertTriangle } from 'lucide-react';

interface BiasDetectorProps {
  onComplete: () => void;
}

const BiasDetector: React.FC<BiasDetectorProps> = ({ onComplete }) => {
  const [currentCase, setCurrentCase] = useState(0);
  const [detectedBiases, setDetectedBiases] = useState<{[key: string]: boolean}>({});
  const [showResults, setShowResults] = useState(false);

  const cases = [
    {
      id: 'hiring-ai',
      title: 'Hiring AI System',
      description: 'This AI helps companies hire people. Can you spot the bias?',
      scenario: 'The AI always recommends men for engineering jobs and women for nursing jobs, even when qualifications are similar.',
      biases: [
        { id: 'gender', text: 'Gender bias - assumes jobs based on gender', correct: true },
        { id: 'age', text: 'Age bias - discriminates by age', correct: false },
        { id: 'location', text: 'Location bias - prefers certain cities', correct: false }
      ],
      explanation: 'This shows gender bias because the AI makes assumptions about who should do certain jobs based on gender, not skills.'
    },
    {
      id: 'loan-ai',
      title: 'Bank Loan AI',
      description: 'This AI decides who gets loans. What\'s wrong here?',
      scenario: 'The AI denies loans to people from certain neighborhoods, even when they have good credit scores and steady income.',
      biases: [
        { id: 'racial', text: 'Racial/Geographic bias - discriminates by location', correct: true },
        { id: 'income', text: 'Income bias - only looks at salary', correct: false },
        { id: 'credit', text: 'Credit bias - ignores credit history', correct: false }
      ],
      explanation: 'This is geographic/racial bias because the AI unfairly judges people based on where they live, not their actual ability to repay.'
    },
    {
      id: 'school-ai',
      title: 'School Admission AI',
      description: 'This AI selects students for a special program. Find the problem!',
      scenario: 'The AI only selects students who can afford expensive test prep courses and extracurricular activities.',
      biases: [
        { id: 'economic', text: 'Economic bias - favors wealthy families', correct: true },
        { id: 'academic', text: 'Academic bias - only looks at grades', correct: false },
        { id: 'social', text: 'Social bias - prefers popular students', correct: false }
      ],
      explanation: 'This shows economic bias because it gives advantages to students whose families can afford expensive preparation, not based on natural ability.'
    }
  ];

  const handleBiasDetected = (caseId: string, biasId: string) => {
    const case_ = cases.find(c => c.id === caseId);
    const bias = case_?.biases.find(b => b.id === biasId);
    
    if (bias?.correct) {
      setDetectedBiases(prev => ({ ...prev, [caseId]: true }));
    }
  };

  const handleNext = () => {
    if (currentCase < cases.length - 1) {
      setCurrentCase(currentCase + 1);
    } else {
      setShowResults(true);
      setTimeout(() => {
        onComplete();
      }, 3000);
    }
  };

  if (showResults) {
    const correctDetections = Object.values(detectedBiases).filter(Boolean).length;
    
    return (
      <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-green-200 text-center">
        <div className="text-6xl mb-4 animate-bounce">🕵️</div>
        <h1 className="text-3xl font-bold text-green-700 mb-4">Bias Detective Complete!</h1>
        <p className="text-xl text-gray-600 mb-6">
          You detected {correctDetections} out of {cases.length} biases correctly!
        </p>
        <div className="bg-green-100 rounded-2xl p-4">
          <p className="text-green-700 font-semibold">+65 XP Earned!</p>
        </div>
      </div>
    );
  }

  const case_ = cases[currentCase];
  const hasDetectedBias = detectedBiases[case_.id];

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-yellow-200">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <Search className="w-8 h-8 text-yellow-600" />
          <h1 className="text-2xl font-bold text-gray-800">Bias Detective</h1>
        </div>
        <div className="bg-yellow-100 px-4 py-2 rounded-full">
          <span className="text-yellow-700 font-semibold">
            Case {currentCase + 1} of {cases.length}
          </span>
        </div>
      </div>

      <div className="space-y-8">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full mx-auto mb-6 flex items-center justify-center text-5xl animate-pulse">
            🕵️
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{case_.title}</h2>
          <p className="text-lg text-gray-600">{case_.description}</p>
        </div>

        <div className="bg-red-50 rounded-2xl p-6 border-2 border-red-200">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-red-600 mt-1" />
            <div>
              <h3 className="font-bold text-red-800 mb-2">Suspicious Behavior:</h3>
              <p className="text-red-700">{case_.scenario}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-center text-gray-700">
            What type of bias do you detect?
          </h3>
          <div className="grid gap-4">
            {case_.biases.map((bias) => (
              <button
                key={bias.id}
                onClick={() => handleBiasDetected(case_.id, bias.id)}
                disabled={hasDetectedBias}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  hasDetectedBias
                    ? bias.correct
                      ? 'bg-green-100 border-green-400 text-green-700'
                      : 'bg-gray-100 border-gray-200 text-gray-500'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 cursor-pointer hover:scale-102'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{bias.text}</span>
                  {hasDetectedBias && bias.correct && (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {hasDetectedBias && (
          <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-200">
            <h4 className="font-bold text-green-700 mb-2 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Great Detective Work! 🎉
            </h4>
            <p className="text-green-600 mb-4">{case_.explanation}</p>
            
            <div className="bg-white rounded-xl p-4 border border-green-200">
              <h5 className="font-semibold text-green-700 mb-2">How to Fix This:</h5>
              <ul className="text-sm text-green-600 space-y-1">
                <li>• Remove unfair factors from the AI's decision-making</li>
                <li>• Test the AI with diverse groups of people</li>
                <li>• Regularly check for biased outcomes</li>
                <li>• Include diverse perspectives in AI development</li>
              </ul>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={handleNext}
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-3 rounded-xl font-bold text-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 hover:scale-105 shadow-lg flex items-center space-x-2 mx-auto"
              >
                <span>{currentCase === cases.length - 1 ? 'Complete Investigation' : 'Next Case'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BiasDetector;