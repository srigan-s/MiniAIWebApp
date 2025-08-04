import React, { useState } from 'react';
import { Eye, CheckCircle, ArrowRight } from 'lucide-react';

interface AIvsHumanProps {
  onComplete: () => void;
}

const AIvsHuman: React.FC<AIvsHumanProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [foundDifferences, setFoundDifferences] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  const differences = [
    { id: 'speed', position: { top: '20%', left: '25%' }, description: 'AI processes faster' },
    { id: 'memory', position: { top: '40%', left: '60%' }, description: 'AI has perfect memory' },
    { id: 'creativity', position: { top: '65%', left: '15%' }, description: 'Humans are more creative' },
    { id: 'emotions', position: { top: '75%', left: '75%' }, description: 'Humans have emotions' }
  ];

  const steps = [
    {
      type: 'animation',
      title: 'AI vs Human Thinking',
      content: (
        <div className="text-center space-y-6">
          <div className="flex justify-center space-x-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full mx-auto flex items-center justify-center text-4xl animate-pulse">
                🤖
              </div>
              <h3 className="text-xl font-bold mt-2">AI Brain</h3>
              <ul className="text-sm text-gray-600 mt-2 space-y-1">
                <li>⚡ Super fast</li>
                <li>💾 Perfect memory</li>
                <li>🔢 Great with numbers</li>
              </ul>
            </div>
            
            <div className="text-6xl flex items-center animate-bounce">⚡</div>
            
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-red-400 rounded-full mx-auto flex items-center justify-center text-4xl animate-pulse">
                🧠
              </div>
              <h3 className="text-xl font-bold mt-2">Human Brain</h3>
              <ul className="text-sm text-gray-600 mt-2 space-y-1">
                <li>🎨 Creative</li>
                <li>❤️ Has emotions</li>
                <li>🤝 Great with people</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-2xl p-6 border-2 border-purple-200">
            <h4 className="text-lg font-semibold text-purple-700 mb-2">Both are amazing!</h4>
            <p className="text-purple-600">AI and humans work best when they help each other! 🤝</p>
          </div>
        </div>
      )
    },
    {
      type: 'game',
      title: 'Spot the Differences Game',
      content: (
        <SpotTheDifferencesGame 
          differences={differences}
          foundDifferences={foundDifferences}
          onDifferenceFound={(id) => setFoundDifferences(prev => [...prev, id])}
        />
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResults(true);
      setTimeout(() => {
        onComplete();
      }, 3000);
    }
  };

  if (showResults) {
    return (
      <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-green-200 text-center">
        <div className="text-6xl mb-4 animate-bounce">🎉</div>
        <h1 className="text-3xl font-bold text-green-700 mb-4">Lesson Complete!</h1>
        <p className="text-xl text-gray-600 mb-6">You found {foundDifferences.length} differences!</p>
        <div className="bg-green-100 rounded-2xl p-4">
          <p className="text-green-700 font-semibold">+30 XP Earned!</p>
        </div>
      </div>
    );
  }

  const canProceed = currentStep === 0 || foundDifferences.length >= 2;

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-blue-200">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <Eye className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">Lesson 2: AI vs Human Thinking</h1>
        </div>
        <div className="bg-blue-100 px-4 py-2 rounded-full">
          <span className="text-blue-700 font-semibold">Step {currentStep + 1} of {steps.length}</span>
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
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 hover:scale-105 shadow-lg'
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

const SpotTheDifferencesGame: React.FC<{
  differences: any[];
  foundDifferences: string[];
  onDifferenceFound: (id: string) => void;
}> = ({ differences, foundDifferences, onDifferenceFound }) => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>, differenceId: string) => {
    e.preventDefault();
    if (!foundDifferences.includes(differenceId)) {
      onDifferenceFound(differenceId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Find the differences between AI and Human thinking!</h3>
        <p className="text-gray-600">Click on the spots to discover the differences. Find at least 2 to continue!</p>
        <div className="mt-2">
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
            Found: {foundDifferences.length}/{differences.length}
          </span>
        </div>
      </div>
      
      <div className="relative bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-8 border-2 border-purple-200 min-h-96">
        <div className="grid grid-cols-2 gap-8 h-full">
          <div className="text-center">
            <h4 className="text-lg font-bold text-blue-700 mb-4">🤖 AI Thinking</h4>
            <div className="bg-blue-50 rounded-xl p-4 h-64 relative">
              <div className="text-6xl mb-2">🤖</div>
              <p className="text-sm text-gray-600">Click around to find differences!</p>
            </div>
          </div>
          
          <div className="text-center">
            <h4 className="text-lg font-bold text-pink-700 mb-4">🧠 Human Thinking</h4>
            <div className="bg-pink-50 rounded-xl p-4 h-64 relative">
              <div className="text-6xl mb-2">🧠</div>
              <p className="text-sm text-gray-600">Keep exploring!</p>
            </div>
          </div>
        </div>
        
        {differences.map((diff) => (
          <div
            key={diff.id}
            className="absolute cursor-pointer"
            style={diff.position}
            onClick={(e) => handleClick(e, diff.id)}
          >
            {foundDifferences.includes(diff.id) ? (
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            ) : (
              <div className="w-6 h-6 bg-yellow-400 rounded-full animate-ping opacity-75 hover:opacity-100"></div>
            )}
          </div>
        ))}
      </div>
      
      {foundDifferences.length > 0 && (
        <div className="bg-green-50 rounded-2xl p-4 border-2 border-green-200">
          <h4 className="font-bold text-green-700 mb-2">Great discoveries! 🎉</h4>
          <ul className="space-y-1">
            {foundDifferences.map(id => {
              const diff = differences.find(d => d.id === id);
              return (
                <li key={id} className="text-green-600 flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>{diff?.description}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AIvsHuman;