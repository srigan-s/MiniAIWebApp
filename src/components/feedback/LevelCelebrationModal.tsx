import React, { useEffect } from 'react';
import { ArrowUpCircle, Sparkles, X } from 'lucide-react';
import { LevelCelebration } from '../../contexts/UserContext';
import { RobotAvatar, getAvatarOptionById } from '../../lib/avatarOptions';

interface LevelCelebrationModalProps {
  celebration: LevelCelebration | null;
  onDismiss: () => void;
}

const LevelCelebrationModal: React.FC<LevelCelebrationModalProps> = ({ celebration, onDismiss }) => {
  useEffect(() => {
    if (!celebration) {
      return;
    }

    const timer = window.setTimeout(() => {
      onDismiss();
    }, 3200);

    return () => {
      window.clearTimeout(timer);
    };
  }, [celebration, onDismiss]);

  if (!celebration) {
    return null;
  }

  const avatar = getAvatarOptionById(celebration.avatarId);

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-cyan-100 bg-white px-6 py-8 text-center shadow-[0_40px_120px_rgba(15,23,42,0.35)] animate-[level-pop_0.45s_ease-out]">
        <button
          type="button"
          onClick={onDismiss}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          aria-label="Close level celebration"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.3),_transparent_55%),linear-gradient(180deg,_rgba(236,254,255,0.9),_transparent)]" />
        <div className="relative">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-cyan-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-cyan-700">
            <Sparkles className="h-3.5 w-3.5" />
            New Level Unlocked
          </div>

          <div className="relative mx-auto mt-6 flex h-36 w-36 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-200 via-sky-100 to-emerald-100 opacity-80 blur-xl" />
            <div className="absolute inset-4 rounded-full border-4 border-dashed border-cyan-300/80 animate-[spin_12s_linear_infinite]" />
            <RobotAvatar avatarId={celebration.avatarId} size="xl" animated className="animate-[avatar-bounce_0.9s_ease-in-out_infinite]" />
          </div>

          <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900">
            Level {celebration.level}
          </h2>
          <p className="mt-2 text-base text-slate-600">
            {avatar.name} just powered up after <span className="font-bold text-slate-900">{celebration.missionLabel}</span>.
          </p>

          <div className="mt-5 rounded-[1.5rem] border border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-cyan-50 px-4 py-4">
            <div className="flex items-center justify-center gap-2 text-emerald-700">
              <ArrowUpCircle className="h-5 w-5" />
              <span className="font-bold">Adventure rank increased</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Every finished mission boosts your explorer level and moves your avatar further along the quest path.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelCelebrationModal;
