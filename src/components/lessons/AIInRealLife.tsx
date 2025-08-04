import React, { useState } from 'react';
import { Smartphone, CheckCircle, ArrowRight } from 'lucide-react';

interface AIInRealLifeProps {
  onComplete: () => void;
}

const AIInRealLife: React.FC<AIInRealLifeProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [matches, setMatches] = useState<{[key: string]: string}>({});
  const [showResults, setShowResults] = useState(false);

  const steps = [
    {
      type: 'animation',
      title: 'AI in Real Life',
      content: (
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4 animate-bounce">🌍</div>
          <h2 className="text-3xl font-bold text-gray-800">AI is Everywhere!</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            AI helps us every day in ways we might not even notice. Let's discover where AI is hiding!
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: '📱', text: 'Your Phone' },
              { icon: '🎵', text: 'Music Apps' },
              { icon: '🚗', text: 'Smart Cars' },
              { icon: '🏠', text: 'Smart Homes' },
              { icon: '🛒', text: 'Online Shopping' },
              { icon: '🎮', text: 'Video Games' },
              { icon: '📺', text: 'TV Shows' },
              { icon: '🗺️', text: 'Navigation' }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-xl p-4 shadow-lg hover:scale-105 transition-transform">
                <div className="text-3xl mb-2">{item.icon}</div>
                <p className="text-sm font-medium text-gray-700">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      type: 'game',
      title: 'Matching Game',
      content: (
        <MatchingGame 
          matches={matches}
          onMatch={(item, category) => setMatches(prev => ({ ...prev, [item]: category }))}
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
        <p className="text-xl text-gray-600 mb-6">You matched {Object.keys(matches).length} AI examples!</p>
        <div className="bg-green-100 rounded-2xl p-4">
          <p className="text-green-700 font-semibold">+35 XP Earned!</p>
        </div>
      </div>
    );
  }

  const canProceed = currentStep === 0 || Object.keys(matches).length >= 4;

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-orange-200">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <Smartphone className="w-8 h-8 text-orange-600" />
          <h1 className="text-2xl font-bold text-gray-800">Lesson 3: AI in Real Life</h1>
        </div>
        <div className="bg-orange-100 px-4 py-2 rounded-full">
          <span className="text-orange-700 font-semibold">Step {currentStep + 1} of {steps.length}</span>
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
              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 hover:scale-105 shadow-lg'
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

const MatchingGame: React.FC<{
  matches: {[key: string]: string};
  onMatch: (item: string, category: string) => void;
}> = ({ matches, onMatch }) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const items = [
    { id: 'voice-assistant', text: '🗣️ Voice Assistant', category: 'smart-helper' },
    { id: 'recommendations', text: '📱 App Recommendations', category: 'smart-helper' },
    { id: 'translation', text: '🌐 Language Translation', category: 'communication' },
    { id: 'maps', text: '🗺️ GPS Navigation', category: 'navigation' },
    { id: 'photos', text: '📸 Photo Recognition', category: 'smart-helper' },
    { id: 'music', text: '🎵 Music Suggestions', category: 'entertainment' },
    { id: 'games', text: '🎮 Game AI Characters', category: 'entertainment' },
    { id: 'weather', text: '🌤️ Weather Prediction', category: 'navigation' }
  ];

  const categories = [
    { id: 'smart-helper', name: 'Smart Helpers', icon: '🤖', color: 'emerald' },
    { id: 'communication', name: 'Communication', icon: '💬', color: 'blue' },
    { id: 'navigation', name: 'Navigation & Info', icon: '🧭', color: 'purple' },
    { id: 'entertainment', name: 'Entertainment', icon: '🎉', color: 'pink' }
  ];

  const handleItemClick = (itemId: string) => {
    setSelectedItem(itemId);
  };

  const handleCategoryClick = (categoryId: string) => {
    if (selectedItem && !matches[selectedItem]) {
      onMatch(selectedItem, categoryId);
      setSelectedItem(null);
    }
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'emerald': return { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' };
      case 'blue': return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' };
      case 'purple': return { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' };
      case 'pink': return { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-700' };
      default: return { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700' };
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Match AI examples to their categories!</h3>
        <p className="text-gray-600">Click an item, then click the category it belongs to. Match at least 4 to continue!</p>
        <div className="mt-2">
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
            Matched: {Object.keys(matches).length}/{items.length}
          </span>
        </div>
      </div>

      {/* Items to match */}
      <div className="bg-gray-50 rounded-2xl p-6">
        <h4 className="font-bold text-gray-700 mb-4 text-center">AI Examples</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {items.filter(item => !matches[item.id]).map(item => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`p-3 rounded-xl border-2 transition-all hover:scale-105 ${
                selectedItem === item.id
                  ? 'bg-yellow-100 border-yellow-400 shadow-lg scale-105'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <div className="text-sm font-medium">{item.text}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map(category => {
          const colors = getColorClasses(category.color);
          const itemsInCategory = Object.entries(matches).filter(([_, catId]) => catId === category.id);
          
          return (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`${colors.bg} ${colors.border} border-2 rounded-2xl p-4 cursor-pointer transition-all hover:scale-105 min-h-32`}
            >
              <div className="text-center mb-3">
                <div className="text-3xl mb-1">{category.icon}</div>
                <h4 className={`font-bold ${colors.text}`}>{category.name}</h4>
              </div>
              
              <div className="space-y-1">
                {itemsInCategory.map(([itemId, _]) => {
                  const item = items.find(i => i.id === itemId);
                  const isCorrect = item?.category === category.id;
                  return (
                    <div
                      key={itemId}
                      className={`p-2 rounded-lg text-xs flex items-center justify-between ${
                        isCorrect 
                          ? 'bg-green-100 border border-green-300' 
                          : 'bg-red-100 border border-red-300'
                      }`}
                    >
                      <span>{item?.text}</span>
                      {isCorrect ? (
                        <CheckCircle className="w-3 h-3 text-green-600" />
                      ) : (
                        <div className="w-3 h-3 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">✗</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {selectedItem && (
        <div className="text-center">
          <p className="text-blue-600 font-medium">
            Selected: {items.find(i => i.id === selectedItem)?.text}. Now click a category! 👆
          </p>
        </div>
      )}
    </div>
  );
};

export default AIInRealLife;