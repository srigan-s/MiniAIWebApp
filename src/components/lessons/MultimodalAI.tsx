import React, { useState } from 'react';
import { ArrowRight, CheckCircle, Layers3, RotateCcw } from 'lucide-react';

interface MultimodalAIProps {
  onComplete: () => void;
}

const inputCards = [
  {
    id: 'text',
    icon: '📝',
    title: 'Text',
    description: 'Words from books, messages, or questions.',
    color: 'from-sky-100 to-cyan-100',
  },
  {
    id: 'image',
    icon: '🖼️',
    title: 'Images',
    description: 'Photos, drawings, and shapes that AI can inspect.',
    color: 'from-pink-100 to-rose-100',
  },
  {
    id: 'audio',
    icon: '🎵',
    title: 'Audio',
    description: 'Voices, music, and other sounds.',
    color: 'from-yellow-100 to-orange-100',
  },
  {
    id: 'video',
    icon: '🎬',
    title: 'Video',
    description: 'Moving pictures that combine images over time.',
    color: 'from-violet-100 to-fuchsia-100',
  },
  {
    id: 'sensor',
    icon: '🌡️',
    title: 'Sensor Data',
    description: 'Numbers from things like temperature or movement tools.',
    color: 'from-emerald-100 to-teal-100',
  },
];

const activityMatches = [
  { id: 'read-caption', text: 'Read a message from a friend', answer: 'text' },
  { id: 'spot-dog', text: 'Look at a picture and find the dog', answer: 'image' },
  { id: 'hear-song', text: 'Listen to a song and guess its mood', answer: 'audio' },
  { id: 'watch-game', text: 'Watch a short clip of a soccer kick', answer: 'video' },
  { id: 'feel-temp', text: 'Check a room temperature reading', answer: 'sensor' },
];

const MultimodalAI: React.FC<MultimodalAIProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [practiceRound, setPracticeRound] = useState(1);
  const [gradeResult, setGradeResult] = useState<{ correct: number; incorrect: number } | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const correctCount = activityMatches.filter((item) => answers[item.id] === item.answer).length;
  const allAnswered = Object.keys(answers).length === activityMatches.length;

  const handleFinish = () => {
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
  };

  const handleAutograde = () => {
    const nextGradeResult = {
      correct: correctCount,
      incorrect: activityMatches.length - correctCount,
    };
    setGradeResult(nextGradeResult);
  };

  const handleRetryRound = () => {
    setAnswers({});
    setGradeResult(null);
    setPracticeRound(2);
  };

  if (showResults) {
    return (
      <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-green-200 text-center">
        <div className="text-6xl mb-4 animate-bounce">🎉</div>
        <h1 className="text-3xl font-bold text-green-700 mb-4">Adventure Complete!</h1>
        <p className="text-xl text-gray-600 mb-6">
          You learned that AI can use many kinds of input, not just words.
        </p>
        <div className="bg-green-100 rounded-2xl p-4">
          <p className="text-green-700 font-semibold">+60 XP Earned!</p>
        </div>
        <div className="bg-green-100 rounded-2xl p-4 mt-4">
          <p className="text-green-700 font-semibold">Redirecting in {countdown}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-cyan-200">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <Layers3 className="w-8 h-8 text-cyan-600" />
          <h1 className="text-2xl font-bold text-gray-800">Lesson 7: Multimodal AI Adventure</h1>
        </div>
        <div className="bg-cyan-100 px-4 py-2 rounded-full">
          <span className="text-cyan-700 font-semibold">Step {step + 1} of 2</span>
        </div>
      </div>

      {step === 0 ? (
        <div className="space-y-8">
          <div className="text-center">
            <div className="text-6xl mb-4">🤹</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">AI Can Listen, Look, Read, and Measure</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Some AI systems work with one kind of input, but multimodal AI can combine several kinds of clues
              to understand what is happening.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
            {inputCards.map((card) => (
              <div
                key={card.id}
                className={`rounded-3xl bg-gradient-to-br ${card.color} p-5 shadow-lg border border-white/70`}
              >
                <div className="text-4xl mb-3">{card.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{card.title}</h3>
                <p className="text-sm text-gray-700">{card.description}</p>
              </div>
            ))}
          </div>

          <div className="rounded-3xl bg-slate-50 border border-slate-200 p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-3">Why combine them?</h3>
            <p className="text-slate-600 leading-7">
              If an AI reads the words "happy birthday" and also sees candles in a picture, it has more clues to
              understand the full scene. More clue types can help an AI make smarter guesses.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Match Each Task to the Input Type</h2>
            <p className="text-gray-600">
              Pick the kind of input an AI would use for each challenge, then press Autograde.
            </p>
            <div className="mt-3 inline-flex rounded-full bg-cyan-100 px-4 py-2 text-cyan-700 font-semibold">
              Practice Round {practiceRound} of 2
            </div>
          </div>

          <div className="space-y-4">
            {activityMatches.map((activity) => (
              <div key={activity.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-lg font-semibold text-slate-800">{activity.text}</p>
                  </div>
                  <select
                    value={answers[activity.id] ?? ''}
                    onChange={(event) =>
                      setAnswers((prev) => ({ ...prev, [activity.id]: event.target.value }))
                    }
                    disabled={Boolean(gradeResult)}
                    className="rounded-xl border border-cyan-200 bg-white px-4 py-3 text-slate-700 focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="">Choose one...</option>
                    {inputCards.map((card) => (
                      <option key={card.id} value={card.id}>
                        {card.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>

          {gradeResult && (
            <div className="rounded-3xl border-2 border-cyan-200 bg-cyan-50 p-6 text-center">
              <h3 className="text-2xl font-bold text-cyan-800 mb-3">Autograde Results</h3>
              <div className="flex flex-wrap justify-center gap-3 mb-4">
                <div className="rounded-full bg-green-100 px-4 py-2 font-semibold text-green-700">
                  Correct: {gradeResult.correct}
                </div>
                <div className="rounded-full bg-rose-100 px-4 py-2 font-semibold text-rose-700">
                  Incorrect: {gradeResult.incorrect}
                </div>
              </div>

              {practiceRound === 1 ? (
                gradeResult.correct === activityMatches.length ? (
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-green-700 font-semibold">
                      <CheckCircle className="w-5 h-5" />
                      Perfect score. You can finish the lesson now.
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-cyan-800">
                      Nice work. Now complete this level one more time to practice the different kinds of AI input.
                    </p>
                    <button
                      onClick={handleRetryRound}
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 font-bold text-white shadow-lg transition-transform hover:scale-105"
                    >
                      <RotateCcw className="w-5 h-5" />
                      Try Level Again
                    </button>
                  </div>
                )
              ) : (
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-green-700 font-semibold">
                    <CheckCircle className="w-5 h-5" />
                    Practice complete. You can finish the lesson now.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="flex justify-center mt-8">
        {step === 0 ? (
          <button
            onClick={() => setStep(1)}
            className="px-8 py-3 rounded-xl font-bold text-lg transition-all duration-200 flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 hover:scale-105 shadow-lg"
          >
            <span>Next</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        ) : gradeResult && (practiceRound === 2 || gradeResult.correct === activityMatches.length) ? (
          <button
            onClick={handleFinish}
            className="px-8 py-3 rounded-xl font-bold text-lg transition-all duration-200 flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 hover:scale-105 shadow-lg"
          >
            <span>Complete Lesson</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={handleAutograde}
            disabled={!allAnswered || Boolean(gradeResult)}
            className={`px-8 py-3 rounded-xl font-bold text-lg transition-all duration-200 flex items-center space-x-2 ${
              allAnswered && !gradeResult
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 hover:scale-105 shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <span>Autograde</span>
            <CheckCircle className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default MultimodalAI;
