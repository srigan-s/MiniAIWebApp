import React, { useState } from 'react';

interface ParentalConsentProps {
  onNext: (data: { parentalConsent: boolean }) => void;
  onBack: () => void;
  initialConsent?: boolean;
}

const ParentalConsent: React.FC<ParentalConsentProps> = ({ onNext, onBack, initialConsent }) => {
  const [consent, setConsent] = useState(initialConsent || false);

  const handleContinue = () => {
    onNext({ parentalConsent: consent });
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-emerald-200">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-400 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
          👨‍👩‍👧‍👦
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Parent Permission</h1>
        <p className="text-gray-600">We want to make sure it's okay with your parents!</p>
      </div>

      <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-8">
        <div className="flex items-start space-x-3">
          <div className="text-2xl">ℹ️</div>
          <div>
            <h3 className="font-semibold text-blue-800 mb-2">For Parents:</h3>
            <p className="text-blue-700 text-sm leading-relaxed">
              MiniAI is an educational platform designed to teach children about artificial intelligence 
              in a fun, safe, and age-appropriate way. We collect minimal information and do not share data with third parties.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="w-5 h-5 text-emerald-500 border-2 border-gray-300 rounded focus:ring-emerald-400 focus:ring-2 mt-1"
          />
          <div className="flex-1">
            <span className="text-lg font-medium text-gray-800">
              I have permission from my parent or guardian to use this learning platform
            </span>
            <p className="text-sm text-gray-600 mt-1">
              (Optional: This helps us ensure a safe learning environment)
            </p>
          </div>
        </label>
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
          Continue ✨
        </button>
      </div>
    </div>
  );
};

export default ParentalConsent;