import React, { useState } from 'react';
import { Camera, CheckCircle, ArrowRight } from 'lucide-react';

interface ImageClassifierProps {
  onComplete: () => void;
}

const ImageClassifier: React.FC<ImageClassifierProps> = ({ onComplete }) => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [trainedImages, setTrainedImages] = useState<{[key: string]: string}>({});
  const [showResults, setShowResults] = useState(false);

  const levels = [
    {
      id: 0,
      title: "Animal Classifier",
      description: "Train AI to recognize different animals!",
      images: [
        { id: 'cat1', emoji: '🐱', category: 'cat', name: 'Fluffy Cat' },
        { id: 'dog1', emoji: '🐕', category: 'dog', name: 'Happy Dog' },
        { id: 'bird1', emoji: '🐦', category: 'bird', name: 'Little Bird' },
        { id: 'cat2', emoji: '🐈', category: 'cat', name: 'Sleepy Cat' },
        { id: 'dog2', emoji: '🐶', category: 'dog', name: 'Puppy' },
        { id: 'bird2', emoji: '🦅', category: 'bird', name: 'Eagle' }
      ],
      categories: ['cat', 'dog', 'bird']
    },
    {
      id: 1,
      title: "Food Classifier",
      description: "Teach AI to identify different foods!",
      images: [
        { id: 'fruit1', emoji: '🍎', category: 'fruit', name: 'Red Apple' },
        { id: 'veg1', emoji: '🥕', category: 'vegetable', name: 'Carrot' },
        { id: 'fruit2', emoji: '🍌', category: 'fruit', name: 'Banana' },
        { id: 'veg2', emoji: '🥬', category: 'vegetable', name: 'Lettuce' },
        { id: 'fruit3', emoji: '🍊', category: 'fruit', name: 'Orange' },
        { id: 'veg3', emoji: '🍅', category: 'vegetable', name: 'Tomato' }
      ],
      categories: ['fruit', 'vegetable']
    }
  ];

  const handleImageTrained = (imageId: string, category: string) => {
    setTrainedImages(prev => ({ ...prev, [imageId]: category }));
  };

  const handleNextLevel = () => {
    if (currentLevel < levels.length - 1) {
      setCurrentLevel(currentLevel + 1);
      setTrainedImages({});
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
        <div className="text-6xl mb-4 animate-bounce">📸</div>
        <h1 className="text-3xl font-bold text-green-700 mb-4">Image Classifier Complete!</h1>
        <p className="text-xl text-gray-600 mb-6">
          You trained AI to recognize images perfectly!
        </p>
        <div className="bg-green-100 rounded-2xl p-4">
          <p className="text-green-700 font-semibold">+55 XP Earned!</p>
        </div>
      </div>
    );
  }

  const level = levels[currentLevel];
  const allImagesTrained = level.images.every(img => trainedImages[img.id]);
  const correctlyTrained = level.images.filter(img => trainedImages[img.id] === img.category).length;

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-blue-200">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <Camera className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">Image Classifier</h1>
        </div>
        <div className="bg-blue-100 px-4 py-2 rounded-full">
          <span className="text-blue-700 font-semibold">
            Level {currentLevel + 1} of {levels.length}
          </span>
        </div>
      </div>

      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{level.title}</h2>
          <p className="text-lg text-gray-600">{level.description}</p>
          <div className="mt-4">
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
              Trained: {Object.keys(trainedImages).length}/{level.images.length} | 
              Correct: {correctlyTrained}/{level.images.length}
            </span>
          </div>
        </div>

        <ImageTrainingInterface
          level={level}
          trainedImages={trainedImages}
          onImageTrained={handleImageTrained}
        />

        {allImagesTrained && (
          <div className="text-center">
            <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-200 mb-6">
              <h3 className="text-lg font-bold text-green-700 mb-2">
                Training Complete! 🎉
              </h3>
              <p className="text-green-600">
                AI accuracy: {Math.round((correctlyTrained / level.images.length) * 100)}%
              </p>
            </div>
            
            <button
              onClick={handleNextLevel}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-3 rounded-xl font-bold text-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 hover:scale-105 shadow-lg flex items-center space-x-2 mx-auto"
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

const ImageTrainingInterface: React.FC<{
  level: any;
  trainedImages: {[key: string]: string};
  onImageTrained: (imageId: string, category: string) => void;
}> = ({ level, trainedImages, onImageTrained }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageClick = (imageId: string) => {
    setSelectedImage(imageId);
  };

  const handleCategoryClick = (category: string) => {
    if (selectedImage && !trainedImages[selectedImage]) {
      onImageTrained(selectedImage, category);
      setSelectedImage(null);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      cat: 'orange',
      dog: 'blue',
      bird: 'green',
      fruit: 'red',
      vegetable: 'green'
    };
    return colors[category as keyof typeof colors] || 'gray';
  };

  const getColorClasses = (color: string) => {
    const colorMaps = {
      orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700' },
      blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
      green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' },
      red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' },
      gray: { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700' }
    };
    return colorMaps[color as keyof typeof colorMaps] || colorMaps.gray;
  };

  return (
    <div className="space-y-6">
      {/* Images to classify */}
      <div className="bg-gray-50 rounded-2xl p-6">
        <h3 className="font-bold text-gray-700 mb-4 text-center">Images to Train</h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {level.images.filter(img => !trainedImages[img.id]).map((image: any) => (
            <button
              key={image.id}
              onClick={() => handleImageClick(image.id)}
              className={`p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                selectedImage === image.id
                  ? 'bg-yellow-100 border-yellow-400 shadow-lg scale-105'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-4xl mb-2">{image.emoji}</div>
              <p className="text-xs font-medium text-gray-600">{image.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {level.categories.map((category: string) => {
          const color = getCategoryColor(category);
          const colors = getColorClasses(color);
          const imagesInCategory = Object.entries(trainedImages).filter(([_, cat]) => cat === category);
          
          return (
            <div
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`${colors.bg} ${colors.border} border-2 rounded-2xl p-4 cursor-pointer transition-all hover:scale-105 min-h-32`}
            >
              <div className="text-center mb-3">
                <h4 className={`font-bold ${colors.text} capitalize`}>{category}</h4>
              </div>
              
              <div className="space-y-2">
                {imagesInCategory.map(([imageId, _]) => {
                  const image = level.images.find((img: any) => img.id === imageId);
                  const isCorrect = image?.category === category;
                  return (
                    <div
                      key={imageId}
                      className={`p-2 rounded-lg text-sm flex items-center justify-between ${
                        isCorrect 
                          ? 'bg-green-100 border border-green-300' 
                          : 'bg-red-100 border border-red-300'
                      }`}
                    >
                      <span>{image?.emoji} {image?.name}</span>
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

      {selectedImage && (
        <div className="text-center">
          <p className="text-blue-600 font-medium">
            Selected: {level.images.find((img: any) => img.id === selectedImage)?.name}. 
            Click a category to train the AI! 🎯
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageClassifier;