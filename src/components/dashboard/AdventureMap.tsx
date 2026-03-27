import React from 'react';
import { CheckCircle2, Lock, Play, Sparkles } from 'lucide-react';

type MapLesson = {
  id: number;
  title: string;
  description: string;
  xpReward: number;
  icon: string;
};

type MapGame = {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  icon: string;
};

interface AdventureMapProps {
  lessons: MapLesson[];
  games: MapGame[];
  completedLessons: number[];
  completedGames: string[];
  isLessonLocked: (lessonId: number) => boolean;
  isGameLocked: (gameId: string) => boolean;
  onStartLesson: (lessonId: number) => void;
  onStartGame: (gameId: string) => void;
}

type PathNode = {
  key: string;
  title: string;
  description: string;
  xpReward: number;
  icon: string;
  kind: 'lesson' | 'game';
  isCompleted: boolean;
  isLocked: boolean;
  onStart: () => void;
};

const AdventureMap: React.FC<AdventureMapProps> = ({
  lessons,
  games,
  completedLessons,
  completedGames,
  isLessonLocked,
  isGameLocked,
  onStartLesson,
  onStartGame,
}) => {
  const pathNodes: PathNode[] = [
    ...lessons.map((lesson) => ({
      key: `lesson-${lesson.id}`,
      title: lesson.title,
      description: lesson.description,
      xpReward: lesson.xpReward,
      icon: lesson.icon,
      kind: 'lesson' as const,
      isCompleted: completedLessons.includes(lesson.id),
      isLocked: isLessonLocked(lesson.id),
      onStart: () => onStartLesson(lesson.id),
    })),
    ...games.map((game) => ({
      key: `game-${game.id}`,
      title: game.title,
      description: game.description,
      xpReward: game.xpReward,
      icon: game.icon,
      kind: 'game' as const,
      isCompleted: completedGames.includes(game.id),
      isLocked: isGameLocked(game.id),
      onStart: () => onStartGame(game.id),
    })),
  ];

  const completedCount = pathNodes.filter((node) => node.isCompleted).length;
  const totalXP = pathNodes.reduce((sum, node) => sum + node.xpReward, 0);
  const nextNode = pathNodes.find((node) => !node.isCompleted);

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-slate-200/70 bg-[#101a2e]/95 px-4 py-6 text-white shadow-[0_30px_90px_rgba(15,23,42,0.32)] sm:px-6 sm:py-8 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.25),_transparent_35%),radial-gradient(circle_at_85%_20%,_rgba(251,146,60,0.18),_transparent_28%),linear-gradient(180deg,_rgba(255,255,255,0.04),_rgba(255,255,255,0))]" />
      <div className="relative z-10">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100">
              <Sparkles className="h-3.5 w-3.5" />
              Quest Path
            </div>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Follow the winding road from lessons into live AI challenges.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
              Each stop unlocks the next one. Start at the glowing node, collect XP, and make your way down the path just like a learning map.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/[0.08] px-4 py-3 backdrop-blur">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Cleared</div>
              <div className="mt-1 text-2xl font-black text-white">{completedCount}/{pathNodes.length}</div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/[0.08] px-4 py-3 backdrop-blur">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Treasure</div>
              <div className="mt-1 text-2xl font-black text-amber-300">{totalXP} XP</div>
            </div>
            <div className="col-span-2 rounded-3xl border border-white/10 bg-white/[0.08] px-4 py-3 backdrop-blur sm:col-span-1">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Next Stop</div>
              <div className="mt-1 text-sm font-bold text-white">{nextNode?.title ?? 'All paths complete'}</div>
            </div>
          </div>
        </div>

        <div className="relative mt-8">
          <div className="absolute bottom-8 left-7 top-8 w-[3px] rounded-full bg-gradient-to-b from-cyan-300 via-sky-400 to-orange-300 md:left-1/2 md:-translate-x-1/2" />

          <div className="space-y-2">
            {pathNodes.map((node, index) => {
              const isLeftLane = index % 2 === 0;
              const actionLabel = node.isCompleted ? 'Replay' : node.kind === 'lesson' ? 'Start lesson' : 'Play game';
              const nodeStateClasses = node.isLocked
                ? 'border-slate-600/80 bg-slate-800/90 text-slate-500 shadow-none'
                : node.isCompleted
                  ? 'border-emerald-300/50 bg-emerald-300 text-emerald-950 shadow-[0_0_0_8px_rgba(16,185,129,0.16)]'
                  : 'border-cyan-200/80 bg-gradient-to-br from-cyan-300 to-sky-400 text-slate-950 shadow-[0_0_0_8px_rgba(56,189,248,0.18)]';
              const cardStateClasses = node.isLocked
                ? 'border-slate-700/80 bg-slate-900/80 text-slate-400'
                : node.isCompleted
                  ? 'border-emerald-300/20 bg-emerald-400/12 text-white'
                  : 'border-cyan-300/20 bg-white/10 text-white hover:-translate-y-1 hover:bg-white/[0.14]';

              return (
                <button
                  key={node.key}
                  type="button"
                  onClick={node.onStart}
                  disabled={node.isLocked}
                  className="group relative block w-full py-4 text-left disabled:cursor-not-allowed"
                >
                  <span
                    className={`absolute left-0 top-6 z-10 flex h-14 w-14 items-center justify-center rounded-full border-4 text-2xl transition-all duration-300 md:left-1/2 md:-translate-x-1/2 ${nodeStateClasses}`}
                  >
                    {node.icon}
                  </span>

                  <span
                    className={`block rounded-[1.75rem] border px-5 py-4 shadow-[0_18px_50px_rgba(15,23,42,0.22)] backdrop-blur transition-all duration-300 md:w-[calc(50%-3.5rem)] ${
                      isLeftLane
                        ? 'ml-20 md:ml-0 md:mr-[calc(50%+3.5rem)]'
                        : 'ml-20 md:ml-[calc(50%+3.5rem)] md:mr-0'
                    } ${cardStateClasses}`}
                  >
                    <span className="flex items-start justify-between gap-4">
                      <span className="block">
                        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.08] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-slate-200">
                          {node.kind === 'lesson' ? 'Lesson' : 'Challenge'}
                        </span>
                        <span className="mt-3 block text-lg font-black leading-tight sm:text-xl">{node.title}</span>
                        <span className="mt-2 block max-w-md text-sm leading-6 text-slate-300">
                          {node.description}
                        </span>
                      </span>

                      <span className="hidden rounded-2xl border border-white/10 bg-slate-950/30 px-3 py-2 text-right sm:block">
                        <span className="block text-[11px] uppercase tracking-[0.2em] text-slate-400">Reward</span>
                        <span className="mt-1 block text-lg font-black text-amber-300">{node.xpReward} XP</span>
                      </span>
                    </span>

                    <span className="mt-4 flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-2 text-sm font-semibold">
                        {node.isCompleted ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                            Completed
                          </>
                        ) : node.isLocked ? (
                          <>
                            <Lock className="h-4 w-4" />
                            Locked for now
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 text-cyan-200" />
                            Ready to go
                          </>
                        )}
                      </span>

                      <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-sm font-bold text-white">
                        {actionLabel}
                      </span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdventureMap;
