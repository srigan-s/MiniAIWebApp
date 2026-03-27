import React from 'react';
import { Badge } from '../../types';
import { Award } from 'lucide-react';

interface BadgeDisplayProps {
  badges: Badge[];
}

const BadgeDisplay: React.FC<BadgeDisplayProps> = ({ badges }) => {
  const sortedBadges = [...badges].sort(
    (left, right) => new Date(right.unlockedAt).getTime() - new Date(left.unlockedAt).getTime()
  );

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-fuchsia-100 bg-white/[0.94] p-5 shadow-[0_24px_70px_rgba(168,85,247,0.12)] backdrop-blur sm:p-8">
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-r from-fuchsia-100/90 via-pink-50 to-amber-50" />
      <div className="relative z-10 mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-fuchsia-500 p-3 text-white shadow-lg shadow-fuchsia-200">
            <Award className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900">Your Achievements</h2>
            <p className="text-sm text-slate-600 sm:text-base">Badges appear here as you complete milestones across lessons, games, and XP goals.</p>
          </div>
        </div>
        <div className="inline-flex items-center rounded-full border border-fuchsia-200 bg-fuchsia-50 px-4 py-2 text-sm font-semibold text-fuchsia-700">
          {badges.length} badge{badges.length === 1 ? '' : 's'} earned
        </div>
      </div>
      
      {badges.length === 0 ? (
        <div className="relative z-10 py-12 text-center">
          <div className="mb-4 text-6xl">🏆</div>
          <p className="text-xl font-bold text-slate-700">No badges yet!</p>
          <p className="text-slate-500">Complete lessons and games to start filling your trophy shelf.</p>
        </div>
      ) : (
        <div className="relative z-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {sortedBadges.map((badge) => (
            <div
              key={badge.id}
              className="rounded-[1.6rem] border border-fuchsia-100 bg-gradient-to-br from-fuchsia-50 via-white to-amber-50 p-5 text-center shadow-[0_18px_45px_rgba(168,85,247,0.12)] transition-transform duration-200 hover:-translate-y-1"
            >
              <div className="mb-3 text-4xl">{badge.icon}</div>
              <h3 className="mb-1 text-lg font-black text-fuchsia-700">{badge.name}</h3>
              <p className="text-sm leading-6 text-fuchsia-700/80">{badge.description}</p>
              <p className="mt-3 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                Earned {new Date(badge.unlockedAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BadgeDisplay;
