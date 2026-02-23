import React, { useState } from 'react';
import { Eye, CheckCircle, ArrowRight } from 'lucide-react';

interface ComputerVisionProps {
  onComplete: () => void;
}

const ComputerVision: React.FC<ComputerVisionProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [identifiedObjects, setIdentifiedObjects] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const steps = [
    {
      type: 'animation',
      title: 'Computer Vision',
      content: (
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full mx-auto flex items-center justify-center text-6xl animate-pulse">
              👁️
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
              📷
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-800">Computer Vision</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Computer Vision helps AI "see" and understand images, just like how your eyes help you see the world!
            </p>
            <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-4xl mb-2">📸</div>
                  <p className="font-semibold">Takes Pictures</p>
                  <p className="text-sm text-gray-600">Like a camera</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">🔍</div>
                  <p className="font-semibold">Analyzes Images</p>
                  <p className="text-sm text-gray-600">Looks for patterns</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">🏷️</div>
                  <p className="font-semibold">Identifies Objects</p>
                  <p className="text-sm text-gray-600">Names what it sees</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      type: 'game',
      title: 'Object Detection Game',
      content: (
        <ObjectDetectionGame 
          identifiedObjects={identifiedObjects}
          onObjectIdentified={(object) => setIdentifiedObjects(prev => [...prev, object])}
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
        <h1 className="text-3xl font-bold text-green-700 mb-4">Computer Vision Lesson Complete!</h1>
        <p className="text-xl text-gray-600 mb-6">You identified {identifiedObjects.length} objects!</p>
        <div className="bg-green-100 rounded-2xl p-4">
          <p className="text-green-700 font-semibold">+50 XP Earned!</p>
        </div>
        <div className="bg-green-100 rounded-2xl p-4 mt-4">
          <p className="text-green-700 font-semibold">Redirecting in {countdown}...</p>
        </div>
      </div>
    );
  }

  const canProceed = currentStep === 0 || identifiedObjects.length >= 4;

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-blue-200">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <Eye className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">Lesson 5: Computer Vision</h1>
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
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 hover:scale-105 shadow-lg'
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

const ObjectDetectionGame: React.FC<{
  identifiedObjects: string[];
  onObjectIdentified: (object: string) => void;
}> = ({ identifiedObjects, onObjectIdentified }) => {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);

  const objects = [
    { id: 'car', name: '🚗 Car', position: { top: '20%', left: '15%' } },
    { id: 'tree', name: '🌳 Tree', position: { top: '30%', left: '60%' } },
    { id: 'house', name: '🏠 House', position: { top: '45%', left: '30%' } },
    { id: 'person', name: '👤 Person', position: { top: '60%', left: '70%' } },
    { id: 'dog', name: '🐕 Dog', position: { top: '70%', left: '20%' } },
    { id: 'bird', name: '🐦 Bird', position: { top: '15%', left: '80%' } }
  ];

  const handleAreaClick = (objectId: string) => {
    if (!identifiedObjects.includes(objectId)) {
      onObjectIdentified(objectId);
      setSelectedArea(objectId);
      setTimeout(() => setSelectedArea(null), 1000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Train the AI to See!</h3>
        <p className="text-gray-600">Click on objects in the scene to help AI learn to identify them. Find at least 4 objects!</p>
        <div className="mt-2">
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
            Objects Found: {identifiedObjects.length}/{objects.length}
          </span>
        </div>
      </div>

      <div className="relative bg-gradient-to-b from-sky-200 to-green-200 rounded-2xl p-8 border-2 border-blue-200 min-h-96">
        <div className="text-center mb-4">
          <h4 className="font-bold text-blue-700">🏞️ Scene Analysis</h4>
          <p className="text-sm text-blue-600">Click on objects you can identify</p>
        </div>

        {objects.map((object) => {
          const isIdentified = identifiedObjects.includes(object.id);
          const isSelected = selectedArea === object.id;
          
          return (
            <div
              key={object.id}
              className="absolute cursor-pointer"
              style={object.position}
              onClick={() => handleAreaClick(object.id)}
            >
              {isIdentified ? (
                <div className="relative">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center animate-pulse border-4 border-green-300">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-green-100 px-2 py-1 rounded text-xs font-medium text-green-700 whitespace-nowrap">
                    {object.name}
                  </div>
                </div>
              ) : (
                <div className={`w-8 h-8 rounded-full transition-all ${
                  isSelected 
                    ? 'bg-yellow-400 animate-ping scale-150' 
                    : 'bg-blue-400 hover:bg-blue-500 animate-pulse opacity-75 hover:opacity-100'
                }`}>
                </div>
              )}
            </div>
          );
        })}

        {/* Scene elements */}
        <div className="absolute bottom-0 left-0 w-full h-16 bg-green-300 rounded-b-2xl"></div>
        <div className="absolute top-0 left-0 w-full h-16 bg-sky-300 rounded-t-2xl"></div>
      </div>

      {identifiedObjects.length > 0 && (
        <div className="bg-green-50 rounded-2xl p-4 border-2 border-green-200">
          <h4 className="font-bold text-green-700 mb-2">AI Learning Progress! 🎉</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {identifiedObjects.map(objectId => {
              const object = objects.find(obj => obj.id === objectId);
              return (
                <div key={objectId} className="bg-white rounded-lg p-2 text-center border border-green-200">
                  <span className="text-sm font-medium text-green-700">{object?.name}</span>
                </div>
              );
            })}
          </div>
          <p className="text-green-600 mt-2 text-sm">
            The AI is learning to recognize these objects in images!
          </p>
        </div>
      )}
    </div>
  );
};

export default ComputerVision;