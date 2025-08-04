import React, { useState } from 'react';
import { BarChart3, CheckCircle, ArrowRight } from 'lucide-react';

interface DataSortingProps {
  onComplete: () => void;
}

const DataSorting: React.FC<DataSortingProps> = ({ onComplete }) => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [sortedItems, setSortedItems] = useState<{[key: string]: string[]}>({});
  const [showResults, setShowResults] = useState(false);

  const levels = [
    {
      id: 0,
      title: "Sort by Animal Type",
      description: "Help AI organize these animals into the right groups!",
      items: [
        { id: 'dog', text: '🐕 Dog', category: 'mammals' },
        { id: 'cat', text: '🐱 Cat', category: 'mammals' },
        { id: 'bird', text: '🐦 Bird', category: 'birds' },
        { id: 'fish', text: '🐟 Fish', category: 'fish' },
        { id: 'eagle', text: '🦅 Eagle', category: 'birds' },
        { id: 'whale', text: '🐋 Whale', category: 'mammals' }
      ],
      categories: [
        { id: 'mammals', name: 'Mammals', icon: '🐾', color: 'emerald' },
        { id: 'birds', name: 'Birds', icon: '🪶', color: 'blue' },
        { id: 'fish', name: 'Fish', icon: '🌊', color: 'cyan' }
      ]
    },
    {
      id: 1,
      title: "Sort by Color",
      description: "Organize these objects by their colors for the AI!",
      items: [
        { id: 'apple', text: '🍎 Apple', category: 'red' },
        { id: 'banana', text: '🍌 Banana', category: 'yellow' },
        { id: 'grape', text: '🍇 Grapes', category: 'purple' },
        { id: 'orange', text: '🍊 Orange', category: 'orange' },
        { id: 'sun', text: '☀️ Sun', category: 'yellow' },
        { id: 'heart', text: '❤️ Heart', category: 'red' }
      ],
      categories: [
        { id: 'red', name: 'Red Things', icon: '🔴', color: 'red' },
        { id: 'yellow', name: 'Yellow Things', icon: '🟡', color: 'yellow' },
        { id: 'purple', name: 'Purple Things', icon: '🟣', color: 'purple' },
        { id: 'orange', name: 'Orange Things', icon: '🟠', color: 'orange' }
      ]
    }
  ];

  const handleDrop = (itemId: string, categoryId: string) => {
    setSortedItems(prev => {
      const newSorted = { ...prev };
      
      // Remove item from any existing category
      Object.keys(newSorted).forEach(catId => {
        newSorted[catId] = newSorted[catId]?.filter(id => id !== itemId) || [];
      });
      
      // Add to new category
      if (!newSorted[categoryId]) {
        newSorted[categoryId] = [];
      }
      newSorted[categoryId].push(itemId);
      
      return newSorted;
    });
  };

  const handleNext = () => {
    if (currentLevel < levels.length - 1) {
      setCurrentLevel(currentLevel + 1);
      setSortedItems({});
    } else {
      setShowResults(true);
      setTimeout(() => {
        onComplete();
      }, 3000);
    }
  };

  const getCurrentLevel = () => levels[currentLevel];
  const level = getCurrentLevel();
  
  const allItemsSorted = level.items.every(item => 
    Object.values(sortedItems).some(categoryItems => categoryItems.includes(item.id))
  );

  const correctlySorted = level.items.filter(item => {
    const categoryId = Object.keys(sortedItems).find(catId => 
      sortedItems[catId]?.includes(item.id)
    );
    return categoryId === item.category;
  }).length;

  if (showResults) {
    return (
      <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-green-200 text-center">
        <div className="text-6xl mb-4 animate-bounce">📊</div>
        <h1 className="text-3xl font-bold text-green-700 mb-4">Data Sorting Complete!</h1>
        <p className="text-xl text-gray-600 mb-6">
          You helped AI learn to organize data perfectly!
        </p>
        <div className="bg-green-100 rounded-2xl p-4">
          <p className="text-green-700 font-semibold">+35 XP Earned!</p>
        </div>
      </div>
    );
  }

  const getColorClasses = (color: string) => {
    const colorMaps = {
      emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' },
      blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
      cyan: { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-700' },
      red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' },
      yellow: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700' },
      purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' },
      orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700' }
    };
    return colorMaps[color as keyof typeof colorMaps] || colorMaps.blue;
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-purple-200">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <BarChart3 className="w-8 h-8 text-purple-600" />
          <h1 className="text-2xl font-bold text-gray-800">Sort the Data</h1>
        </div>
        <div className="bg-purple-100 px-4 py-2 rounded-full">
          <span className="text-purple-700 font-semibold">
            Level {currentLevel + 1} of {levels.length}
          </span>
        </div>
      </div>

      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{level.title}</h2>
          <p className="text-lg text-gray-600">{level.description}</p>
          <div className="mt-4">
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
              Sorted: {Object.values(sortedItems).flat().length}/{level.items.length} | 
              Correct: {correctlySorted}/{level.items.length}
            </span>
          </div>
        </div>

        {/* Items to sort */}
        <div className="bg-gray-50 rounded-2xl p-6">
          <h3 className="font-bold text-gray-700 mb-4 text-center">Items to Sort</h3>
          <div className="flex flex-wrap gap-3 justify-center">
            {level.items.filter(item => 
              !Object.values(sortedItems).some(categoryItems => categoryItems.includes(item.id))
            ).map(item => (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => e.dataTransfer.setData('text/plain', item.id)}
                className="bg-white px-4 py-3 rounded-xl shadow-md cursor-move hover:shadow-lg transition-all border-2 border-gray-200 hover:border-gray-300"
              >
                {item.text}
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {level.categories.map(category => {
            const colors = getColorClasses(category.color);
            const itemsInCategory = sortedItems[category.id] || [];
            
            return (
              <div
                key={category.id}
                onDrop={(e) => {
                  e.preventDefault();
                  const itemId = e.dataTransfer.getData('text/plain');
                  handleDrop(itemId, category.id);
                }}
                onDragOver={(e) => e.preventDefault()}
                className={`${colors.bg} ${colors.border} border-2 border-dashed rounded-2xl p-4 min-h-32 transition-all hover:scale-102`}
              >
                <div className="text-center mb-3">
                  <div className="text-3xl mb-1">{category.icon}</div>
                  <h4 className={`font-bold ${colors.text}`}>{category.name}</h4>
                </div>
                
                <div className="space-y-2">
                  {itemsInCategory.map(itemId => {
                    const item = level.items.find(i => i.id === itemId);
                    const isCorrect = item?.category === category.id;
                    
                    return (
                      <div
                        key={itemId}
                        className={`p-2 rounded-lg text-sm flex items-center justify-between ${
                          isCorrect 
                            ? 'bg-green-100 border border-green-300' 
                            : 'bg-red-100 border border-red-300'
                        }`}
                      >
                        <span>{item?.text}</span>
                        {isCorrect ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">✗</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {allItemsSorted && (
          <div className="text-center">
            <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-200 mb-6">
              <h3 className="text-lg font-bold text-green-700 mb-2">
                Level Complete! 🎉
              </h3>
              <p className="text-green-600">
                You sorted {correctlySorted} out of {level.items.length} items correctly!
              </p>
            </div>
            
            <button
              onClick={handleNext}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-bold text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 hover:scale-105 shadow-lg flex items-center space-x-2 mx-auto"
            >
              <span>{currentLevel === levels.length - 1 ? 'Complete Game' : 'Next Level'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataSorting;