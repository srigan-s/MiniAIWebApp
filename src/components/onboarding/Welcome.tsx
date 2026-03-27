import React, { useEffect, useState } from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { User } from '../../types';
import { RobotAvatar, getAvatarOptionById } from '../../lib/avatarOptions';

interface WelcomeProps {
  onComplete: (data: Record<string, never>) => void;
  onBack: () => void;
  userData: Partial<User>;
  isSubmitting?: boolean;
}

const aiFacts = [
  'AI can help spot patterns in pictures, words, and sounds.',
  'Recommendation tools use AI to suggest shows, music, and videos.',
  'Computer vision is the part of AI that helps machines understand images.',
  'Some AI systems learn from examples instead of fixed instructions.',
  'Fair AI needs balanced data so it works well for many people.',
  'Voice assistants use AI to turn spoken words into actions.',
];

const Welcome: React.FC<WelcomeProps> = ({ onComplete, onBack, userData, isSubmitting = false }) => {
  const avatar = getAvatarOptionById(userData.avatar);
  const [factIndex, setFactIndex] = useState(0);

  useEffect(() => {
    if (!isSubmitting) {
      setFactIndex(0);
      return;
    }

    const interval = window.setInterval(() => {
      setFactIndex((current) => (current + 1) % aiFacts.length);
    }, 2400);

    return () => window.clearInterval(interval);
  }, [isSubmitting]);

  const handleStart = () => {
    onComplete({});
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-emerald-200">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-900 font-semibold transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="text-center">
        <div className="mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-[2rem] bg-gradient-to-br from-white to-emerald-50 shadow-xl">
          <RobotAvatar avatarId={avatar.id} size="xl" animated />
        </div>

        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome, {userData.name}! 🎉
        </h1>
        <p className="mb-6 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
          Your robot guide is {avatar.name}, {avatar.title}
        </p>

        <div className="bg-gradient-to-r from-emerald-100 to-cyan-100 rounded-2xl p-6 mb-6">
          {!isSubmitting ? (
            <>
              <p className="text-lg text-gray-700 mb-4">
                You're about to embark on an amazing journey to discover the world of Artificial Intelligence!
              </p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-white rounded-xl p-3">
                  <div className="text-2xl mb-1">🎮</div>
                  <div className="font-semibold">Fun Games</div>
                  <div className="text-gray-600">Interactive challenges</div>
                </div>
                <div className="bg-white rounded-xl p-3">
                  <div className="text-2xl mb-1">🏆</div>
                  <div className="font-semibold">Earn Badges</div>
                  <div className="text-gray-600">Unlock achievements</div>
                </div>
                <div className="bg-white rounded-xl p-3">
                  <div className="text-2xl mb-1">⭐</div>
                  <div className="font-semibold">Level Up</div>
                  <div className="text-gray-600">Gain XP points</div>
                </div>
                <div className="bg-white rounded-xl p-3">
                  <div className="text-2xl mb-1">🧠</div>
                  <div className="font-semibold">Learn AI</div>
                  <div className="text-gray-600">Discover the future</div>
                </div>
              </div>
            </>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-emerald-200 bg-white/80 p-5 shadow-sm">
              <div className="flex items-center justify-center gap-2 text-emerald-700">
                <Sparkles className="h-5 w-5" />
                <p className="text-sm font-semibold uppercase tracking-[0.24em]">AI Fun Facts</p>
              </div>
              <div className="relative mt-4 min-h-[92px]">
                <div
                  key={factIndex}
                  className="rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-6 text-white shadow-lg animate-fact-slide"
                >
                  <p className="text-lg font-semibold leading-8">{aiFacts[factIndex]}</p>
                </div>
              </div>
              <div className="mt-4 flex justify-center gap-2">
                {aiFacts.map((_, index) => (
                  <span
                    key={index}
                    className={`h-2.5 rounded-full transition-all ${index === factIndex ? 'w-8 bg-emerald-500' : 'w-2.5 bg-emerald-200'}`}
                  ></span>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleStart}
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white py-4 rounded-xl font-bold text-xl hover:from-emerald-600 hover:to-cyan-600 transition-all duration-200 hover:scale-105 shadow-lg animate-pulse disabled:opacity-90 disabled:cursor-progress"
        >
          {isSubmitting ? 'Creating your account...' : 'Start Your AI Adventure! 🚀'}
        </button>
      </div>

      <style>{`
        @keyframes fact-slide {
          0% { opacity: 0; transform: translateX(22px); }
          12% { opacity: 1; transform: translateX(0); }
          88% { opacity: 1; transform: translateX(0); }
          100% { opacity: 0; transform: translateX(-22px); }
        }
        .animate-fact-slide { animation: fact-slide 2.4s ease-in-out; }
      `}</style>
    </div>
  );
};

export default Welcome;
