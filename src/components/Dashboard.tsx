import React from 'react';
import { useUser } from '../contexts/UserContext';
import { Brain, Trophy, Star, Gamepad2, BookOpen, Target } from 'lucide-react';
import ProgressBar from './dashboard/ProgressBar';
import BadgeDisplay from './dashboard/BadgeDisplay';
import CharacterEvolution from './dashboard/CharacterEvolution';
import LessonCard from './dashboard/LessonCard';
import GameCard from './dashboard/GameCard';

interface DashboardProps {
  onStartLesson: (lessonId: number) => void;
  onStartGame: (gameId: string) => void;
}

const lessons = [
  {
    id: 1,
    title: "What is AI?",
    description: "Learn the basics of artificial intelligence with fun animations!",
    type: "animation-quiz" as const,
    xpReward: 25,
    icon: "🧠"
  },
  {
    id: 2,
    title: "AI vs. Human Thinking",
    description: "Discover the differences between how AI and humans think!",
    type: "spot-difference" as const,
    xpReward: 30,
    icon: "🤔"
  },
  {
    id: 3,
    title: "AI in Real Life",
    description: "Find AI examples all around us in this matching game!",
    type: "matching" as const,
    xpReward: 35,
    icon: "🌟"
  },
  {
    id: 4,
    title: "Neural Networks",
    description: "Discover how AI learns like a brain with connected neurons!",
    type: "animation-quiz" as const,
    xpReward: 45,
    icon: "🧬"
  },
  {
    id: 5,
    title: "Computer Vision",
    description: "Learn how AI can see and understand images!",
    type: "spot-difference" as const,
    xpReward: 50,
    icon: "👁️"
  },
  {
    id: 6,
    title: "AI Bias & Fairness",
    description: "Understand why AI needs to be fair for everyone!",
    type: "matching" as const,
    xpReward: 55,
    icon: "⚖️"
  }
];

const lessonSequence = [1, 4, 5, 2, 3, 6];

const games = [
  {
    id: "robot-training",
    title: "Train a Robot",
    description: "Teach a virtual robot how to make decisions!",
    type: "robot-training" as const,
    xpReward: 40,
    icon: "🤖"
  },
  {
    id: "data-sorting",
    title: "Sort the Data",
    description: "Help AI organize information in this puzzle game!",
    type: "data-sorting" as const,
    xpReward: 35,
    icon: "📊"
  },
  {
    id: "quiz-battle",
    title: "AI Quiz Battle",
    description: "Test your AI knowledge in this timed challenge!",
    type: "quiz-battle" as const,
    xpReward: 50,
    icon: "⚡"
  },
  {
    id: "neural-network-builder",
    title: "Build a Neural Network",
    description: "Connect neurons to create your own AI brain!",
    type: "neural-network-builder" as const,
    xpReward: 60,
    icon: "🔗"
  },
  {
    id: "image-classifier",
    title: "Image Classifier",
    description: "Train AI to recognize different objects in pictures!",
    type: "image-classifier" as const,
    xpReward: 55,
    icon: "🖼️"
  },
  {
    id: "bias-detector",
    title: "Bias Detective",
    description: "Find and fix unfair decisions in AI systems!",
    type: "bias-detector" as const,
    xpReward: 65,
    icon: "🕵️"
  }
];

const Dashboard: React.FC<DashboardProps> = ({ onStartLesson, onStartGame }) => {
  const { user } = useUser();

  if (!user) return null;

  const lessonsById = new Map(lessons.map((lesson) => [lesson.id, lesson]));
  const orderedLessons = lessonSequence
    .map((lessonId) => lessonsById.get(lessonId))
    .filter((lesson): lesson is (typeof lessons)[number] => Boolean(lesson));

  const isLessonLocked = (lessonId: number) => {
    const lessonIndex = lessonSequence.indexOf(lessonId);
    if (lessonIndex <= 0) return false;

    const previousLessonId = lessonSequence[lessonIndex - 1];
    return !user.completedLessons.includes(previousLessonId);
  };

  // Calculate progress based on completed activities
  const totalActivities = lessons.length + games.length;
  const completedActivities = user.completedLessons.length + user.completedGames.length;
  const progressPercentage = totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-3xl shadow-xl p-8 border-4 border-emerald-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Welcome back, {user.name}! 👋
            </h1>
            <p className="text-xl text-gray-600">Ready to learn more about AI?</p>
          </div>
          <CharacterEvolution user={user} />
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl p-6 text-center">
            <Star className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
            <div className="text-3xl font-bold text-emerald-700">{user.xp}</div>
            <div className="text-emerald-600 font-medium">Total XP</div>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl p-6 text-center">
            <Trophy className="w-10 h-10 text-yellow-600 mx-auto mb-2" />
            <div className="text-3xl font-bold text-yellow-700">{user.level}</div>
            <div className="text-yellow-600 font-medium">Level</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl p-6 text-center">
            <Target className="w-10 h-10 text-purple-600 mx-auto mb-2" />
            <div className="text-3xl font-bold text-purple-700">{user.badges.length}</div>
            <div className="text-purple-600 font-medium">Badges</div>
          </div>
        </div>

        <div className="mt-6">
          <ProgressBar progress={progressPercentage} totalActivities={totalActivities} completedActivities={completedActivities} />
        </div>
      </div>

      {/* Learning Modules */}
      <div className="bg-white rounded-3xl shadow-xl p-8 border-4 border-cyan-200">
        <div className="flex items-center mb-6">
          <BookOpen className="w-8 h-8 text-cyan-600 mr-3" />
          <h2 className="text-3xl font-bold text-gray-800">Learning Adventures</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orderedLessons.map((lesson) => {
            const isCompleted = user.completedLessons.includes(lesson.id);
            const isLocked = isLessonLocked(lesson.id);

            return (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                isCompleted={isCompleted}
                isLocked={isLocked}
                onStart={() => onStartLesson(lesson.id)}
              />
            );
          })}
        </div>
      </div>

      {/* Mini Games */}
      <div className="bg-white rounded-3xl shadow-xl p-8 border-4 border-orange-200">
        <div className="flex items-center mb-6">
          <Gamepad2 className="w-8 h-8 text-orange-600 mr-3" />
          <h2 className="text-3xl font-bold text-gray-800">AI Challenge Games</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              isCompleted={user.completedGames.includes(game.id)}
              onStart={() => onStartGame(game.id)}
            />
          ))}
        </div>
      </div>

      {/* Badges Section */}
      <BadgeDisplay badges={user.badges} />
    </div>
  );
};

export default Dashboard;
