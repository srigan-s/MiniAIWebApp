import React, { useEffect, useRef, useState } from 'react';
import { Brain, CheckCircle, Mic, MicOff, Sparkles } from 'lucide-react';

interface WhatIsAIProps {
  onComplete: () => void;
}

type AnswerLabel = 'ai' | 'not-ai';

interface FlashcardItem {
  id: number;
  title: string;
  emoji: string;
  description: string;
  answer: AnswerLabel;
}

interface SpeechRecognitionResultEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionLike extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  }
}

const flashcards: FlashcardItem[] = [
  { id: 1, title: 'Voice Assistant', emoji: '🗣️', description: 'A helper like Siri or Alexa that answers spoken questions.', answer: 'ai' },
  { id: 2, title: 'Paper Map', emoji: '🗺️', description: 'A printed map that never changes by itself.', answer: 'not-ai' },
  { id: 3, title: 'Netflix Recommendations', emoji: '🎬', description: 'A system that suggests shows you might like.', answer: 'ai' },
  { id: 4, title: 'Light Switch', emoji: '💡', description: 'A simple switch that only turns the lights on or off.', answer: 'not-ai' },
  { id: 5, title: 'Face Unlock', emoji: '📱', description: 'A phone tool that recognizes your face to unlock.', answer: 'ai' },
  { id: 6, title: 'Toaster', emoji: '🍞', description: 'A machine that heats bread the same way each time.', answer: 'not-ai' },
  { id: 7, title: 'Spam Filter', emoji: '📧', description: 'An email tool that learns which messages are junk.', answer: 'ai' },
  { id: 8, title: 'Bicycle Bell', emoji: '🚲', description: 'A bell that rings when you press it.', answer: 'not-ai' },
  { id: 9, title: 'Photo Search by Face', emoji: '📸', description: 'An app that can find pictures of the same person.', answer: 'ai' },
  { id: 10, title: 'Regular Alarm Clock', emoji: '⏰', description: 'A basic clock that rings at a set time.', answer: 'not-ai' },
];

const WhatIsAI: React.FC<WhatIsAIProps> = ({ onComplete }) => {
  const [cardIndex, setCardIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerLabel[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [heardText, setHeardText] = useState('');
  const [feedback, setFeedback] = useState('Say "AI" or "Not AI" to sort the flashcard.');
  const [speechError, setSpeechError] = useState('');
  const [detectedAnswer, setDetectedAnswer] = useState<AnswerLabel | null>(null);
  const [transitionState, setTransitionState] = useState<'idle' | 'swipe-ai' | 'swipe-not-ai' | 'enter'>('idle');
  const [finalScore, setFinalScore] = useState(0);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [soundBubbleLevel, setSoundBubbleLevel] = useState(0);

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const submitAnswerRef = useRef<(answer: AnswerLabel) => void>(() => undefined);

  useEffect(() => {
    const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      setSpeechSupported(false);
      setSpeechError('Voice recognition is not available in this browser. Use the backup buttons below.');
      return;
    }

    setSpeechSupported(true);
    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0]?.transcript ?? '')
        .join(' ')
        .trim();
      const lastResult = event.results[event.results.length - 1];
      const confidence = lastResult?.[0]?.confidence ?? 0.45;

      setHeardText(transcript);
      setSoundBubbleLevel(Math.max(0.35, confidence));

      if (!lastResult?.isFinal) {
        return;
      }

      setIsListening(false);
      setSoundBubbleLevel(1);

      const normalized = transcript.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();

      if (normalized.includes('not ai') || normalized.includes('not a i') || normalized === 'not') {
        submitAnswerRef.current('not-ai');
        return;
      }

      if (normalized.includes('ai') || normalized.includes('a i')) {
        submitAnswerRef.current('ai');
        return;
      }

      setSpeechError('I could not clearly detect "AI" or "Not AI". Please try again or click the correct button.');
      setFeedback('Try saying your answer again, or tap one of the big answer buttons below.');
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      setSoundBubbleLevel(0);
      setSpeechError(`Voice input error: ${event.error}. Try again.`);
    };

    recognition.onend = () => {
      setIsListening(false);
      setSoundBubbleLevel(0);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, []);

  const currentCard = flashcards[cardIndex];

  const submitAnswer = (answer: AnswerLabel) => {
    if (isAdvancing || !currentCard) {
      return;
    }

    const isCorrect = answer === currentCard.answer;
    const nextAnswers = [...answers, answer];
    const nextScore = nextAnswers.reduce(
      (total, nextAnswer, index) => total + (nextAnswer === flashcards[index].answer ? 1 : 0),
      0,
    );

    setIsAdvancing(true);
    setDetectedAnswer(answer);
    setAnswers(nextAnswers);
    setFeedback(
      isCorrect ? 'Correct! Swiping to the next flashcard.' : `Nice try. This one was ${currentCard.answer === 'ai' ? 'AI' : 'Not AI'}.`,
    );
    setSpeechError('');

    if (cardIndex === flashcards.length - 1) {
      setFinalScore(nextScore);
      setTimeout(() => {
        setShowResults(true);
        setIsAdvancing(false);
        setDetectedAnswer(null);
      }, 450);

      return;
    }

    setTimeout(() => {
      setTransitionState(answer === 'ai' ? 'swipe-ai' : 'swipe-not-ai');
    }, 80);

    setTimeout(() => {
      setCardIndex((prev) => prev + 1);
      setHeardText('');
      setDetectedAnswer(null);
      setTransitionState('enter');
      setFeedback('Say "AI" or "Not AI" to sort the flashcard.');
    }, 360);

    setTimeout(() => {
      setTransitionState('idle');
      setIsAdvancing(false);
    }, 700);
  };
  submitAnswerRef.current = submitAnswer;

  const startListening = () => {
    if (!recognitionRef.current) {
      return;
    }

    setSpeechError('');
    setHeardText('');
    setIsListening(true);
    setSoundBubbleLevel(0.25);
    recognitionRef.current.start();
  };

  if (showResults) {
    const percentage = Math.round((finalScore / flashcards.length) * 100);

    return (
      <div className="rounded-3xl border-4 border-green-200 bg-white p-8 text-center shadow-2xl">
        <div className="mb-4 text-6xl animate-bounce">🎉</div>
        <h1 className="mb-4 text-3xl font-bold text-green-700">Lesson 1 Complete!</h1>
        <p className="mb-4 text-xl text-gray-600">You sorted all 10 flashcards.</p>
        <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Final Grade</p>
          <p className="mt-2 text-4xl font-bold text-emerald-800">{finalScore} / {flashcards.length}</p>
          <p className="mt-2 text-lg font-semibold text-emerald-700">{percentage}% correct</p>
        </div>
        <div className="mt-4 rounded-2xl border-2 border-yellow-200 bg-yellow-50 p-4">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-yellow-700">Mission Reward</p>
          <p className="mt-2 text-2xl font-bold text-yellow-800">+25 XP Earned!</p>
        </div>
        <button
          onClick={() => {
            setIsFinishing(true);
            onComplete();
          }}
          disabled={isFinishing}
          className={`mt-6 rounded-2xl px-8 py-4 text-lg font-bold text-white shadow-lg transition ${
            isFinishing ? 'cursor-not-allowed bg-emerald-300' : 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:scale-[1.02]'
          }`}
        >
          {isFinishing ? 'Finishing lesson...' : 'Collect XP and Finish Lesson'}
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border-4 border-emerald-200 bg-white p-8 shadow-2xl">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center space-x-3">
          <Brain className="h-8 w-8 text-emerald-600" />
          <h1 className="text-2xl font-bold text-gray-800">Lesson 1: What is AI?</h1>
        </div>
        <div className="rounded-full bg-emerald-100 px-4 py-2">
          <span className="font-semibold text-emerald-700">Card {cardIndex + 1} of {flashcards.length}</span>
        </div>
      </div>

      <div className="mb-8 text-center">
        <div className="relative mx-auto mb-5 flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 text-6xl shadow-xl">
          {currentCard.emoji}
          <div className="absolute -right-1 -top-1 flex h-10 w-10 items-center justify-center rounded-full bg-yellow-300 text-xl animate-bounce">
            <Sparkles className="h-5 w-5 text-yellow-800" />
          </div>
        </div>

        <div className="mx-auto max-w-3xl overflow-visible">
          <div
            className={`relative rounded-[2rem] border-[6px] border-emerald-300 bg-[linear-gradient(135deg,rgba(255,255,255,1)_0%,rgba(236,253,245,1)_38%,rgba(236,254,255,1)_70%,rgba(255,255,255,1)_100%)] p-8 shadow-[0_22px_60px_rgba(16,185,129,0.18),0_8px_0_rgba(16,185,129,0.18)] before:pointer-events-none before:absolute before:inset-[12px] before:rounded-[1.4rem] before:border-2 before:border-emerald-100/80 before:content-[''] ${
              transitionState === 'swipe-ai'
                ? 'animate-card-swipe-ai'
                : transitionState === 'swipe-not-ai'
                  ? 'animate-card-swipe-not-ai'
                  : transitionState === 'enter'
                    ? 'animate-card-enter'
                    : ''
            }`}
          >
            <div className="pointer-events-none absolute left-6 top-6 h-4 w-16 rounded-full bg-emerald-200/60"></div>
            <div className="pointer-events-none absolute bottom-6 right-6 h-3 w-12 rounded-full bg-cyan-200/60"></div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">Flashcard {currentCard.id}</p>
            <h2 className="mt-3 text-3xl font-bold text-gray-800">{currentCard.title}</h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">{currentCard.description}</p>
          </div>
        </div>
      </div>

      <div className="mb-6 rounded-3xl border border-cyan-200 bg-[linear-gradient(135deg,rgba(240,249,255,1)_0%,rgba(236,253,245,1)_100%)] p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-700">Voice Mission</p>
        <p className="mt-3 text-lg font-semibold text-slate-800">Say "AI" or "Not AI" to answer this card.</p>
        <p className="mt-2 text-slate-600">{feedback}</p>
        <div className="mt-4 flex items-center justify-center gap-4">
          <div
            className={`relative flex h-16 w-16 items-center justify-center rounded-full border-4 border-cyan-200 bg-gradient-to-br from-cyan-300 to-emerald-400 transition-all duration-150 ${
              isListening ? 'shadow-[0_0_30px_rgba(34,211,238,0.55)]' : 'opacity-85'
            }`}
            style={{
              transform: `scale(${1 + soundBubbleLevel * 0.35})`,
              filter: `saturate(${1 + soundBubbleLevel * 0.7}) brightness(${1 + soundBubbleLevel * 0.15})`,
            }}
          >
            <span className="text-2xl text-white">🔊</span>
            <span
              className={`absolute inset-0 rounded-full border-4 border-cyan-300/70 ${isListening ? 'animate-sound-ping' : ''}`}
              style={{ opacity: Math.min(0.9, 0.25 + soundBubbleLevel * 0.6) }}
            ></span>
          </div>
          <div className="flex gap-1">
            {[0.25, 0.45, 0.65, 0.85].map((threshold, index) => (
              <span
                key={threshold}
                className="w-2 rounded-full bg-cyan-400 transition-all duration-150"
                style={{
                  height: `${16 + index * 7}px`,
                  opacity: soundBubbleLevel >= threshold ? 1 : 0.28,
                  transform: `scaleY(${soundBubbleLevel >= threshold ? 1.15 : 0.75})`,
                }}
              ></span>
            ))}
          </div>
        </div>
        {heardText && (
          <p className="mt-3 rounded-2xl bg-white/80 px-4 py-3 text-sm text-slate-700 shadow-sm">
            Heard: <span className="font-semibold">{heardText}</span>
          </p>
        )}
        {speechError && (
          <p className="mt-3 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600 shadow-sm">
            {speechError}
          </p>
        )}
      </div>

      <div className="flex flex-col items-center gap-4">
        <button
          onClick={startListening}
          disabled={!speechSupported || isListening || isAdvancing}
          className={`inline-flex items-center gap-3 rounded-2xl px-8 py-4 text-lg font-bold transition ${
            !speechSupported
              ? 'cursor-not-allowed bg-slate-200 text-slate-500'
              : isListening
                ? 'bg-rose-500 text-white shadow-lg'
                : 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg hover:scale-[1.02]'
          }`}
        >
          {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          {isListening ? 'Listening...' : 'Answer With Your Voice'}
        </button>

        <div className="grid w-full max-w-3xl gap-4 md:grid-cols-2">
          <button
            onClick={() => submitAnswer('ai')}
            disabled={isAdvancing}
            className={`rounded-[1.5rem] border-2 px-6 py-6 text-left text-white shadow-lg transition ${
              detectedAnswer === 'ai'
                ? 'scale-[1.02] border-emerald-200 bg-emerald-400 shadow-[0_18px_45px_rgba(34,197,94,0.42)]'
                : 'border-emerald-400 bg-emerald-600 hover:bg-emerald-500 hover:shadow-[0_16px_35px_rgba(34,197,94,0.28)]'
            } ${isAdvancing ? 'cursor-not-allowed opacity-90' : ''}`}
          >
            <div className="text-4xl font-black tracking-wide text-white">AI</div>
            <p className="mt-3 text-sm leading-6 text-emerald-50">Choose this if the flashcard shows something that learns, predicts, or makes smart decisions.</p>
          </button>

          <button
            onClick={() => submitAnswer('not-ai')}
            disabled={isAdvancing}
            className={`rounded-[1.5rem] border-2 px-6 py-6 text-left text-white shadow-lg transition ${
              detectedAnswer === 'not-ai'
                ? 'scale-[1.02] border-rose-200 bg-rose-400 shadow-[0_18px_45px_rgba(244,63,94,0.42)]'
                : 'border-rose-400 bg-rose-600 hover:bg-rose-500 hover:shadow-[0_16px_35px_rgba(244,63,94,0.28)]'
            } ${isAdvancing ? 'cursor-not-allowed opacity-90' : ''}`}
          >
            <div className="text-4xl font-black tracking-wide text-white">NOT AI</div>
            <p className="mt-3 text-sm leading-6 text-rose-50">Choose this if the flashcard shows a simple tool or object that does not learn on its own.</p>
          </button>
        </div>

        <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
          <CheckCircle className="h-4 w-4 text-emerald-600" />
          <span>Your answer is recorded, the correct button lights up, and the flashcard swipes away.</span>
        </div>
      </div>

      <style>{`
        @keyframes card-swipe-ai {
          0% { transform: translateX(0) rotate(0deg); opacity: 1; }
          100% { transform: translateX(120%) rotate(8deg); opacity: 0; }
        }
        @keyframes card-swipe-not-ai {
          0% { transform: translateX(0) rotate(0deg); opacity: 1; }
          100% { transform: translateX(-120%) rotate(-8deg); opacity: 0; }
        }
        @keyframes card-enter {
          0% { transform: translateX(28%) scale(0.96); opacity: 0; }
          100% { transform: translateX(0) scale(1); opacity: 1; }
        }
        @keyframes sound-ping {
          0% { transform: scale(0.9); opacity: 0.8; }
          100% { transform: scale(1.45); opacity: 0; }
        }
        .animate-card-swipe-ai { animation: card-swipe-ai 0.34s ease-in forwards; }
        .animate-card-swipe-not-ai { animation: card-swipe-not-ai 0.34s ease-in forwards; }
        .animate-card-enter { animation: card-enter 0.3s ease-out forwards; }
        .animate-sound-ping { animation: sound-ping 0.9s ease-out infinite; }
      `}</style>
    </div>
  );
};

export default WhatIsAI;
