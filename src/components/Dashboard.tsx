import React from 'react';
import { useUser } from '../contexts/UserContext';
import { Trophy, Star, Gamepad2, BookOpen, Target } from 'lucide-react';
import ProgressBar from './dashboard/ProgressBar';
import BadgeDisplay from './dashboard/BadgeDisplay';
import CharacterEvolution from './dashboard/CharacterEvolution';
import LessonCard from './dashboard/LessonCard';
import GameCard from './dashboard/GameCard';
import AdventureMap from './dashboard/AdventureMap';
import { games, gameSequence, lessons, lessonSequence } from '../data/learningContent';

interface DashboardProps {
  onStartLesson: (lessonId: number) => void;
  onStartGame: (gameId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onStartLesson, onStartGame }) => {
  const { user } = useUser();

  if (!user) return null;

  const lessonsById = new Map(lessons.map((lesson) => [lesson.id, lesson]));
  const orderedLessons = lessonSequence
    .map((lessonId) => lessonsById.get(lessonId))
    .filter((lesson): lesson is (typeof lessons)[number] => Boolean(lesson));
  const gamesById = new Map(games.map((game) => [game.id, game]));
  const orderedGames = gameSequence
    .map((gameId) => gamesById.get(gameId))
    .filter((game): game is (typeof games)[number] => Boolean(game));

  const isLessonLocked = (lessonId: number) => {
    const lessonIndex = lessonSequence.indexOf(lessonId);
    if (lessonIndex <= 0) return false;

    const previousLessonId = lessonSequence[lessonIndex - 1];
    return !user.completedLessons.includes(previousLessonId);
  };

  const isGameLocked = (gameId: string) => {
    const gameIndex = gameSequence.indexOf(gameId);
    if (gameIndex <= 0) return false;

    const previousGameId = gameSequence[gameIndex - 1];
    return !user.completedGames.includes(previousGameId);
  };

  // Calculate progress based on completed activities
  const totalActivities = lessons.length + games.length;
  const completedActivities = user.completedLessons.length + user.completedGames.length;
  const progressPercentage = totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0;

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-[#fffaf1]/95 p-5 shadow-[0_30px_80px_rgba(14,116,144,0.14)] sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(125,211,252,0.26),_transparent_28%),radial-gradient(circle_at_85%_15%,_rgba(251,146,60,0.18),_transparent_22%),linear-gradient(135deg,_rgba(255,255,255,0.8),_rgba(255,255,255,0.45))]" />
        <div className="relative z-10 flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center rounded-full border border-sky-200 bg-sky-100/90 px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-sky-700">
              Mission Control
            </div>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
              Welcome back, {user.name}! Build your AI path your own way.
            </h1>
            <p className="mt-3 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Explore bright lesson worlds, follow the quest trail, and jump into challenge games when you are ready.
            </p>
          </div>

          <div className="mx-auto xl:mx-0">
            <CharacterEvolution user={user} />
          </div>
        </div>

        <div className="relative z-10 mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-[1.75rem] border border-emerald-200 bg-gradient-to-br from-emerald-100 to-emerald-50 p-6 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
            <Star className="mx-auto mb-3 h-10 w-10 text-emerald-700" />
            <div className="text-3xl font-black text-emerald-800">{user.xp}</div>
            <div className="font-semibold text-emerald-700">Total XP</div>
          </div>

          <div className="rounded-[1.75rem] border border-amber-200 bg-gradient-to-br from-amber-100 to-orange-50 p-6 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
            <Trophy className="mx-auto mb-3 h-10 w-10 text-amber-700" />
            <div className="text-3xl font-black text-amber-800">{user.level}</div>
            <div className="font-semibold text-amber-700">Explorer Level</div>
          </div>

          <div className="rounded-[1.75rem] border border-rose-200 bg-gradient-to-br from-rose-100 to-fuchsia-50 p-6 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
            <Target className="mx-auto mb-3 h-10 w-10 text-rose-700" />
            <div className="text-3xl font-black text-rose-800">{user.badges.length}</div>
            <div className="font-semibold text-rose-700">Treasure Badges</div>
          </div>
        </div>

        <div className="relative z-10 mt-6 rounded-[1.75rem] border border-slate-200 bg-white/80 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur">
          <ProgressBar progress={progressPercentage} totalActivities={totalActivities} completedActivities={completedActivities} />
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[2rem] border border-cyan-100/80 bg-white/90 p-5 shadow-[0_24px_70px_rgba(14,116,144,0.14)] backdrop-blur sm:p-8">
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-r from-cyan-100/80 via-sky-100/50 to-teal-100/70" />
        <div className="relative z-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-cyan-500 p-3 text-white shadow-lg shadow-cyan-200">
                <BookOpen className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-3xl font-black tracking-tight text-slate-900">Learning Adventures</h2>
                <p className="text-sm text-slate-600 sm:text-base">Pick a lesson card to learn core ideas before jumping into challenge mode.</p>
              </div>
            </div>
          </div>

          <div className="inline-flex items-center rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-700">
            {user.completedLessons.length}/{lessons.length} lessons finished
          </div>
        </div>

        <div className="relative z-10 mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
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

      <div className="relative overflow-hidden rounded-[2rem] border border-orange-100/90 bg-white/[0.92] p-5 shadow-[0_24px_70px_rgba(249,115,22,0.12)] backdrop-blur sm:p-8">
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-r from-orange-100/80 via-amber-50 to-rose-100/70" />
        <div className="relative z-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-orange-500 p-3 text-white shadow-lg shadow-orange-200">
              <Gamepad2 className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tight text-slate-900">AI Challenge Games</h2>
              <p className="text-sm text-slate-600 sm:text-base">Practice what you learned with more hands-on, high-energy mini games.</p>
            </div>
          </div>

          <div className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700">
            {user.completedGames.length}/{games.length} games completed
          </div>
        </div>

        <div className="relative z-10 mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {orderedGames.map((game) => {
            const isCompleted = user.completedGames.includes(game.id);
            const isLocked = isGameLocked(game.id);

            return (
              <GameCard
                key={game.id}
                game={game}
                isCompleted={isCompleted}
                isLocked={isLocked}
                onStart={() => onStartGame(game.id)}
              />
            );
          })}
        </div>
      </div>

      <AdventureMap
        lessons={orderedLessons}
        games={orderedGames}
        completedLessons={user.completedLessons}
        completedGames={user.completedGames}
        isLessonLocked={isLessonLocked}
        isGameLocked={isGameLocked}
        onStartLesson={onStartLesson}
        onStartGame={onStartGame}
      />

      <BadgeDisplay badges={user.badges} />
    </div>
  );
};

export default Dashboard;
