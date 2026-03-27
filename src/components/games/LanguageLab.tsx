import React, { useMemo, useState } from 'react';
import { ArrowRight, CheckCircle, MessagesSquare } from 'lucide-react';

interface LanguageLabProps {
  onComplete: () => void;
}

const levelOneSentences = [
  { id: 'sunny', text: 'The sunny robot waves hello.', answer: 'describing' },
  { id: 'jump', text: 'Kids jump over puddles.', answer: 'action' },
  { id: 'park', text: 'The park is our place to play.', answer: 'thing' },
];

const levelTwoTasks = [
  {
    id: 'who',
    sentence: 'The blue bird sings loudly.',
    choices: ['blue bird', 'sings', 'loudly'],
    answer: 'blue bird',
    hint: 'Who or what is doing the action?',
  },
  {
    id: 'action',
    sentence: 'The blue bird sings loudly.',
    choices: ['blue bird', 'sings', 'loudly'],
    answer: 'sings',
    hint: 'Which word tells the action?',
  },
  {
    id: 'how',
    sentence: 'The blue bird sings loudly.',
    choices: ['blue bird', 'sings', 'loudly'],
    answer: 'loudly',
    hint: 'Which word gives extra detail?',
  },
];

const LanguageLab: React.FC<LanguageLabProps> = ({ onComplete }) => {
  const [level, setLevel] = useState(0);
  const [levelOneAnswers, setLevelOneAnswers] = useState<Record<string, string>>({});
  const [levelTwoAnswers, setLevelTwoAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const levelOneCorrect = useMemo(
    () => levelOneSentences.filter((item) => levelOneAnswers[item.id] === item.answer).length,
    [levelOneAnswers]
  );

  const levelTwoCorrect = useMemo(
    () => levelTwoTasks.filter((item) => levelTwoAnswers[item.id] === item.answer).length,
    [levelTwoAnswers]
  );

  const finishGame = () => {
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

  if (showResults) {
    return (
      <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-green-200 text-center">
        <div className="text-6xl mb-4 animate-bounce">💬</div>
        <h1 className="text-3xl font-bold text-green-700 mb-4">Language Lab Complete!</h1>
        <p className="text-xl text-gray-600 mb-6">
          You taught the AI to notice words, jobs, and simple sentence structure.
        </p>
        <div className="bg-green-100 rounded-2xl p-4">
          <p className="text-green-700 font-semibold">+70 XP Earned!</p>
        </div>
        <div className="bg-green-100 rounded-2xl p-4 mt-4">
          <p className="text-green-700 font-semibold">Redirecting in {countdown}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-indigo-200">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <MessagesSquare className="w-8 h-8 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-800">Language Lab</h1>
        </div>
        <div className="bg-indigo-100 px-4 py-2 rounded-full">
          <span className="text-indigo-700 font-semibold">Level {level + 1} of 2</span>
        </div>
      </div>

      {level === 0 ? (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Words Have Different Jobs</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Natural language processing means helping AI look at words and sentence patterns. Start by spotting
              whether a word tells an action, names a thing, or describes something.
            </p>
          </div>

          <div className="space-y-4">
            {levelOneSentences.map((item) => (
              <div key={item.id} className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-5">
                <p className="text-lg font-semibold text-slate-800 mb-4">{item.text}</p>
                <div className="flex flex-wrap gap-3">
                  {['thing', 'action', 'describing'].map((choice) => (
                    <button
                      key={choice}
                      onClick={() =>
                        setLevelOneAnswers((prev) => ({
                          ...prev,
                          [item.id]: choice,
                        }))
                      }
                      className={`rounded-full px-4 py-2 font-medium transition-all ${
                        levelOneAnswers[item.id] === choice
                          ? 'bg-indigo-600 text-white shadow-md scale-105'
                          : 'bg-white text-slate-700 border border-indigo-200 hover:border-indigo-400'
                      }`}
                    >
                      {choice === 'thing' ? 'Names a thing' : choice === 'action' ? 'Shows an action' : 'Describes more'}
                    </button>
                  ))}
                </div>
                {levelOneAnswers[item.id] && (
                  <div className="mt-3 text-sm">
                    {levelOneAnswers[item.id] === item.answer ? (
                      <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-green-700">
                        <CheckCircle className="w-4 h-4" />
                        Great language clue spotting!
                      </div>
                    ) : (
                      <div className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-amber-700">
                        Try again and think about what the highlighted word is doing in the sentence.
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center text-indigo-700 font-semibold">
            Correct answers: {levelOneCorrect}/{levelOneSentences.length}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Syntax Means Word Order and Roles</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              AI also looks at who is doing something, what the action is, and what extra details appear around it.
            </p>
          </div>

          <div className="rounded-3xl bg-gradient-to-r from-indigo-100 to-cyan-100 p-6 text-center shadow-inner">
            <p className="text-sm uppercase tracking-[0.35em] text-indigo-600 font-bold mb-2">Sentence Lab</p>
            <p className="text-3xl font-bold text-slate-800">The blue bird sings loudly.</p>
          </div>

          <div className="space-y-4">
            {levelTwoTasks.map((task) => (
              <div key={task.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600 mb-2">{task.hint}</p>
                <div className="flex flex-wrap gap-3">
                  {task.choices.map((choice) => (
                    <button
                      key={choice}
                      onClick={() =>
                        setLevelTwoAnswers((prev) => ({
                          ...prev,
                          [task.id]: choice,
                        }))
                      }
                      className={`rounded-full px-4 py-2 font-medium transition-all ${
                        levelTwoAnswers[task.id] === choice
                          ? 'bg-indigo-600 text-white shadow-md scale-105'
                          : 'bg-white text-slate-700 border border-indigo-200 hover:border-indigo-400'
                      }`}
                    >
                      {choice}
                    </button>
                  ))}
                </div>
                {levelTwoAnswers[task.id] && (
                  <div className="mt-3 text-sm">
                    {levelTwoAnswers[task.id] === task.answer ? (
                      <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-green-700">
                        <CheckCircle className="w-4 h-4" />
                        Exactly right.
                      </div>
                    ) : (
                      <div className="inline-flex rounded-full bg-rose-100 px-3 py-1 text-rose-700">
                        Not quite. Read the sentence again and look for that job.
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center text-indigo-700 font-semibold">
            Correct answers: {levelTwoCorrect}/{levelTwoTasks.length}
          </div>
        </div>
      )}

      <div className="flex justify-center mt-8">
        <button
          onClick={() => (level === 0 ? setLevel(1) : finishGame())}
          disabled={
            (level === 0 && Object.keys(levelOneAnswers).length < levelOneSentences.length) ||
            (level === 1 && Object.keys(levelTwoAnswers).length < levelTwoTasks.length)
          }
          className={`px-8 py-3 rounded-xl font-bold text-lg transition-all duration-200 flex items-center space-x-2 ${
            !(
              (level === 0 && Object.keys(levelOneAnswers).length < levelOneSentences.length) ||
              (level === 1 && Object.keys(levelTwoAnswers).length < levelTwoTasks.length)
            )
              ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white hover:from-indigo-600 hover:to-cyan-600 hover:scale-105 shadow-lg'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <span>{level === 0 ? 'Next Level' : 'Complete Game'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default LanguageLab;
