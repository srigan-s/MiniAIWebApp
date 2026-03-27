import React, { useEffect, useMemo, useState } from 'react';
import { Brain, Loader2, Send, Sparkles, X } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import {
  gameMap,
  gameSequence,
  games,
  lessonMap,
  lessonSequence,
  lessons,
} from '../data/learningContent';
import { hasGeminiConfig, requestGeminiChatReply } from '../lib/geminiChat';

type ViewName = 'dashboard' | 'lesson' | 'game';

interface ChatMessage {
  id: number;
  role: 'bot' | 'user';
  text: string;
}

interface ChatbotHelperProps {
  currentView: ViewName;
  currentLesson: number | null;
  currentGame: string | null;
  onStartLesson: (lessonId: number) => void;
  onStartGame: (gameId: string) => void;
}

const quickPrompts = [
  'What should I do next?',
  'Explain AI in simple words',
  'Show my progress',
  'Which game should I play?',
];

const ChatbotHelper: React.FC<ChatbotHelperProps> = ({
  currentView,
  currentLesson,
  currentGame,
  onStartLesson,
  onStartGame,
}) => {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeminiReady, setIsGeminiReady] = useState(false);
  const [companionOffset, setCompanionOffset] = useState({ x: 0, y: 0 });
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: 'bot',
      text: "Hi! I'm the MiniAI Helper. Ask me anything about AI, your progress, or what to do next.",
    },
  ]);

  const nextLesson = useMemo(
    () => lessonSequence.find((lessonId) => !user?.completedLessons.includes(lessonId)) ?? null,
    [user]
  );

  const nextGame = useMemo(
    () => gameSequence.find((gameId) => !user?.completedGames.includes(gameId)) ?? null,
    [user]
  );

  const progressSummary = useMemo(() => {
    if (!user) return '';
    const totalActivities = lessons.length + games.length;
    const completedActivities = user.completedLessons.length + user.completedGames.length;
    return `${user.name}, you are on level ${user.level} with ${user.xp} XP. You have finished ${completedActivities} of ${totalActivities} activities and earned ${user.badges.length} badges.`;
  }, [user]);

  const currentActivitySummary = useMemo(() => {
    if (currentView === 'lesson' && currentLesson) {
      const lesson = lessonMap.get(currentLesson);
      return lesson
        ? `You are currently in the lesson "${lesson.title}". ${lesson.helperSummary}`
        : '';
    }

    if (currentView === 'game' && currentGame) {
      const game = gameMap.get(currentGame);
      return game
        ? `You are currently in the game "${game.title}". ${game.helperSummary}`
        : '';
    }

    return 'You are on the dashboard, so this is a good time to pick your next lesson or game.';
  }, [currentGame, currentLesson, currentView]);

  useEffect(() => {
    let isMounted = true;

    const loadStatus = async () => {
      const configured = await hasGeminiConfig();

      if (isMounted) {
        setIsGeminiReady(configured);
      }
    };

    void loadStatus();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const screenCenterX = window.innerWidth / 2;
      const screenCenterY = window.innerHeight / 2;
      const x = Math.max(-10, Math.min(10, (event.clientX - screenCenterX) / 45));
      const y = Math.max(-8, Math.min(8, (event.clientY - screenCenterY) / 60));
      setCompanionOffset({ x, y });
    };

    window.addEventListener('pointermove', handlePointerMove);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);

  if (!user) return null;

  const appendBotMessage = (text: string) => {
    setMessages((prev) => [...prev, { id: prev.length + 1, role: 'bot', text }]);
  };

  const appendUserMessage = (text: string) => {
    setMessages((prev) => [...prev, { id: prev.length + 1, role: 'user', text }]);
  };

  const handleStartRecommended = () => {
    if (nextLesson) {
      onStartLesson(nextLesson);
      appendBotMessage(`Opening "${lessonMap.get(nextLesson)?.title}" for you. Have fun learning.`);
      return;
    }

    if (nextGame) {
      onStartGame(nextGame);
      appendBotMessage(`Opening "${gameMap.get(nextGame)?.title}" for you. Good luck.`);
    }
  };

  const getRecommendation = () => {
    if (nextLesson) {
      const lesson = lessonMap.get(nextLesson);
      return `Your best next step is "${lesson?.title}" for ${lesson?.xpReward} XP. It fits your lesson path and keeps the sequence unlocked.`;
    }

    if (nextGame) {
      const game = gameMap.get(nextGame);
      return `You have finished all lessons, so try "${game?.title}" next for ${game?.xpReward} XP.`;
    }

    return 'You have completed every lesson and game in MiniAI. You can replay any activity to review your favorite topic.';
  };

  const findTopicAnswer = (message: string) => {
    const normalized = message.toLowerCase();

    const lessonMatch = lessons.find((lesson) =>
      lesson.keywords.some((keyword) => normalized.includes(keyword))
    );
    if (lessonMatch) {
      return `${lessonMatch.title}: ${lessonMatch.helperSummary}`;
    }

    const gameMatch = games.find((game) =>
      game.keywords.some((keyword) => normalized.includes(keyword))
    );
    if (gameMatch) {
      return `${gameMatch.title}: ${gameMatch.helperSummary}`;
    }

    return null;
  };

  const generateReply = (message: string) => {
    const normalized = message.toLowerCase();
    const topicAnswer = findTopicAnswer(message);

    if (
      normalized.includes('progress') ||
      normalized.includes('xp') ||
      normalized.includes('level') ||
      normalized.includes('badge')
    ) {
      return progressSummary;
    }

    if (
      normalized.includes('next') ||
      normalized.includes('recommend') ||
      normalized.includes('suggest') ||
      normalized.includes('what should')
    ) {
      return `${getRecommendation()} ${currentActivitySummary}`;
    }

    if (
      normalized.includes('play') ||
      normalized.includes('game') ||
      normalized.includes('lesson') ||
      normalized.includes('start')
    ) {
      return getRecommendation();
    }

    if (
      normalized.includes('help') ||
      normalized.includes('what can you do') ||
      normalized.includes('how do i use')
    ) {
      return 'I can explain MiniAI topics, tell you what lesson or game to try next, and summarize your progress. Try asking about neural networks, computer vision, AI bias, or your XP.';
    }

    if (
      normalized.includes('what is ai') ||
      normalized.includes('explain ai') ||
      normalized === 'ai'
    ) {
      return 'AI is a computer system that learns from examples and patterns. It can help with tasks like recognizing images, answering questions, or organizing information.';
    }

    if (topicAnswer) {
      return topicAnswer;
    }

    return `I can help with AI topics, activity recommendations, and your progress. ${currentActivitySummary}`;
  };

  const submitMessage = async (rawMessage: string) => {
    const message = rawMessage.trim();
    if (!message || isLoading) return;

    const nextMessages = [...messages, { id: messages.length + 1, role: 'user' as const, text: message }];
    appendUserMessage(message);
    setInput('');
    setIsLoading(true);

    try {
      if (isGeminiReady) {
        const reply = await requestGeminiChatReply(
          nextMessages
            .filter((entry) => entry.role === 'user' || entry.role === 'bot')
            .map((entry) => ({
              role: entry.role === 'bot' ? 'assistant' : 'user',
              text: entry.text,
            })),
          {
            currentActivitySummary,
            progressSummary,
            recommendation: getRecommendation(),
          }
        );
        appendBotMessage(reply);
      } else {
        appendBotMessage(generateReply(message));
      }
    } catch (error) {
      const details = error instanceof Error ? error.message : 'Unknown Gemini error';
      console.error('Gemini chat request failed:', details);
      appendBotMessage(
        `${generateReply(message)} Live AI is unavailable right now, so I answered with local help instead. Error: ${details}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-28 right-4 z-50 w-[calc(100vw-2rem)] max-w-sm rounded-[2rem] border-4 border-cyan-200 bg-white/95 shadow-2xl backdrop-blur-sm">
          <div className="rounded-t-[1.7rem] bg-gradient-to-r from-cyan-500 via-sky-500 to-emerald-500 p-4 text-white">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-white/20 p-2">
                  <Brain className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">MiniAI Helper</h2>
                  <p className="text-sm text-cyan-50">Answers questions and suggests your next step</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full bg-white/15 p-2 transition-colors hover:bg-white/25"
                aria-label="Close chatbot helper"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="space-y-4 p-4">
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Sparkles className="h-4 w-4 text-amber-500" />
                Quick actions
              </div>
              <div className="flex flex-wrap gap-2">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => {
                      void submitMessage(prompt);
                    }}
                    disabled={isLoading}
                    className="rounded-full border border-cyan-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-cyan-300 hover:bg-cyan-50"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
                    message.role === 'bot'
                      ? 'bg-cyan-50 text-slate-700'
                      : 'ml-8 bg-emerald-500 text-white'
                  }`}
                >
                  {message.text}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-center gap-2 rounded-2xl bg-cyan-50 px-4 py-3 text-sm text-slate-700">
                  <Loader2 className="h-4 w-4 animate-spin text-cyan-600" />
                  MiniAI Helper is thinking...
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <p className="mb-3 text-sm text-slate-600">{currentActivitySummary}</p>
              {!isGeminiReady && (
                <p className="mb-3 text-xs font-medium text-amber-700">
                  Live Gemini replies are off until `GEMINI_API_KEY` is set on the backend.
                </p>
              )}
              <button
                onClick={handleStartRecommended}
                className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-3 font-semibold text-white shadow-lg transition-transform hover:scale-[1.01]"
              >
                Start recommended activity
              </button>
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                submitMessage(input);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about AI, lessons, or your progress"
                className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition-colors focus:border-cyan-400"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-2xl bg-slate-900 p-3 text-white transition-colors hover:bg-slate-800"
                aria-label="Send message"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      )}

      <div
        className="fixed bottom-5 right-4 z-50 flex items-end gap-3"
        style={{
          transform: `translate(${companionOffset.x}px, ${companionOffset.y}px)`,
        }}
      >
        {!isOpen && (
          <div className="max-w-[10rem] rounded-2xl border border-cyan-200 bg-white/90 px-3 py-2 text-sm font-medium text-slate-700 shadow-[0_16px_30px_rgba(14,116,144,0.18)] backdrop-blur-sm animate-[robot-bubble_4s_ease-in-out_infinite]">
            Need help? Tap me and I will follow along.
          </div>
        )}

        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="group relative h-24 w-24 rounded-[2rem] border-4 border-cyan-200 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.98),rgba(186,230,253,0.92)_40%,rgba(52,211,153,0.88)_100%)] shadow-[0_18px_40px_rgba(14,116,144,0.28)] transition-transform duration-300 hover:scale-105"
          aria-label={isOpen ? 'Hide chatbot helper' : 'Open chatbot helper'}
        >
          <span className="absolute left-1/2 top-[-0.8rem] h-6 w-2 -translate-x-1/2 rounded-full bg-cyan-300"></span>
          <span className="absolute left-1/2 top-[-1.25rem] h-4 w-4 -translate-x-1/2 rounded-full bg-amber-300 shadow-[0_0_16px_rgba(253,224,71,0.9)]"></span>
          <span className="absolute inset-x-5 top-5 h-10 rounded-[1.25rem] border border-cyan-100 bg-slate-900/85">
            <span className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(34,211,238,0.95)] transition-transform duration-300 group-hover:translate-x-1"></span>
            <span className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(34,211,238,0.95)] transition-transform duration-300 group-hover:-translate-x-1"></span>
          </span>
          <span className="absolute inset-x-7 bottom-5 h-3 rounded-full bg-white/70">
            <span className="absolute inset-x-2 top-1/2 h-1 -translate-y-1/2 rounded-full bg-emerald-400"></span>
          </span>
          <span className="absolute left-3 top-9 h-7 w-2 rounded-full bg-cyan-200/90 rotate-[18deg]"></span>
          <span className="absolute right-3 top-9 h-7 w-2 rounded-full bg-cyan-200/90 -rotate-[18deg]"></span>
          <span className="absolute bottom-[-0.45rem] left-6 h-4 w-2 rounded-full bg-cyan-300"></span>
          <span className="absolute bottom-[-0.45rem] right-6 h-4 w-2 rounded-full bg-cyan-300"></span>
          <span className="absolute inset-0 rounded-[2rem] border border-white/50"></span>
        </button>
      </div>

      <style>{`
        @keyframes robot-bubble {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </>
  );
};

export default ChatbotHelper;
