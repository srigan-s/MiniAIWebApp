import React, { useState } from 'react';

interface AvatarSelectionProps {
  onNext: (data: { avatar: string }) => void;
  onBack: () => void;
  selectedAvatar?: string;
}

const avatars = [
  '🤖', '👦', '👧', '🧑', '👨', '👩',
  '🦄', '🐱', '🐶', '🐼', '🦊', '🐸',
  '⭐', '🌟', '💫', '🌈', '🎈', '🎯'
];

const AvatarSelection: React.FC<AvatarSelectionProps> = ({ onNext, onBack, selectedAvatar }) => {
  const [selected, setSelected] = useState(selectedAvatar || '🤖');

  const handleContinue = () => {
    onNext({ avatar: selected });
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-emerald-200">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
          {selected}
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Choose Your Avatar</h1>
        <p className="text-gray-600">Pick one that represents you!</p>
      </div>

      <div className="grid grid-cols-6 gap-3 mb-8">
        {avatars.map((avatar) => (
          <button
            key={avatar}
            onClick={() => setSelected(avatar)}
            className={`w-16 h-16 rounded-2xl text-3xl flex items-center justify-center transition-all duration-200 hover:scale-110 ${
              selected === avatar
                ? 'bg-emerald-500 shadow-lg scale-110'
                : 'bg-gray-100 hover:bg-emerald-100'
            }`}
          >
            {avatar}
          </button>
        ))}
      </div>

      <div className="flex space-x-4">
        <button
          onClick={onBack}
          className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-200"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          className="flex-1 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white py-3 rounded-xl font-bold hover:from-emerald-600 hover:to-cyan-600 transition-all duration-200 hover:scale-105 shadow-lg"
        >
          Continue 🎉
        </button>
      </div>
    </div>
  );
};

export default AvatarSelection;