import React from 'react';
import { CheckCircle, Lock, Star } from 'lucide-react';

interface GameCardProps {
  game: {
    id: string;
    title: string;
    description: string;
    xpReward: number;
    icon: string;
  };
  isCompleted: boolean;
  isLocked: boolean;
  onStart: () => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, isCompleted, isLocked, onStart }) => {
  const cardStyle = isLocked
    ? 'border-slate-200 bg-slate-100/90 shadow-none cursor-not-allowed opacity-80'
    : isCompleted
      ? 'border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-lime-50 shadow-[0_22px_55px_rgba(34,197,94,0.16)] cursor-pointer'
      : 'border-orange-200 bg-[linear-gradient(160deg,_rgba(255,247,237,0.96),_rgba(255,237,213,0.96)_55%,_rgba(255,255,255,0.92))] shadow-[0_22px_55px_rgba(249,115,22,0.16)] hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(249,115,22,0.22)] cursor-pointer';

  const iconStyle = isLocked
    ? 'bg-slate-200 text-slate-500'
    : isCompleted
      ? 'bg-emerald-200 text-emerald-900'
      : 'bg-orange-200 text-orange-900';

  return (
    <div
      className={`group relative overflow-hidden rounded-[1.75rem] border p-6 transition-all duration-300 ${cardStyle}`}
      onClick={() => {
        if (!isLocked) {
          onStart();
        }
      }}
    >
      <div className="absolute right-0 top-0 h-20 w-24 rounded-bl-[2.5rem] bg-white/[0.35]" />
      <div className="relative z-10 mb-5 flex items-start justify-between gap-4">
        <div className={`flex h-16 w-16 items-center justify-center rounded-[1.4rem] text-3xl shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] ${iconStyle}`}>
          {game.icon}
        </div>
        <div className="rounded-full border border-white/70 bg-white/70 px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
          Game
        </div>
      </div>

      <div className="relative z-10">
        <h3 className="text-xl font-black tracking-tight text-slate-900">{game.title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">{game.description}</p>

        <div className="mt-5 flex items-center justify-between gap-3">
          <div className="flex items-center space-x-1 rounded-full bg-amber-50 px-3 py-2">
            <Star className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-bold text-amber-700">{game.xpReward} XP</span>
          </div>

          {isCompleted ? (
            <div className="flex items-center space-x-1 rounded-full bg-emerald-100 px-3 py-2 text-emerald-700">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm font-bold">Completed</span>
            </div>
          ) : isLocked ? (
            <div className="flex items-center space-x-1 rounded-full bg-slate-200 px-3 py-2 text-slate-600">
              <Lock className="h-4 w-4" />
              <span className="text-sm font-bold">Locked</span>
            </div>
          ) : (
            <span className="rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white transition-colors duration-200 group-hover:bg-orange-600">
              Launch Game
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameCard;
