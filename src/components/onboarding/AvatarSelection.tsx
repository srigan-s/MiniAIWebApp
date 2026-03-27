import React, { useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { AVATAR_OPTIONS, RobotAvatar, getAvatarOptionById } from '../../lib/avatarOptions';

interface AvatarSelectionProps {
  onNext: (data: { avatar: string }) => void;
  onBack: () => void;
  selectedAvatar?: string;
}

const AvatarSelection: React.FC<AvatarSelectionProps> = ({ onNext, onBack, selectedAvatar }) => {
  const [selected, setSelected] = useState(getAvatarOptionById(selectedAvatar).id);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const activeAvatar = useMemo(() => getAvatarOptionById(selected), [selected]);

  const handleContinue = () => {
    onNext({ avatar: selected });
  };

  const scrollByCard = (direction: 'left' | 'right') => {
    const container = scrollRef.current;
    if (!container) return;

    const cardWidth = container.clientWidth * 0.82;
    container.scrollBy({
      left: direction === 'left' ? -cardWidth : cardWidth,
      behavior: 'smooth',
    });
  };

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    const container = scrollRef.current;
    if (!container) return;

    if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
      event.preventDefault();
      container.scrollBy({ left: event.deltaY, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-cyan-100/80 bg-[linear-gradient(160deg,rgba(240,253,250,0.96)_0%,rgba(236,254,255,0.96)_38%,rgba(245,243,255,0.98)_100%)] p-6 shadow-[0_24px_80px_rgba(14,165,233,0.16)] sm:p-8 lg:p-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-[-15%] h-48 w-48 rounded-full bg-emerald-300/25 blur-3xl"></div>
        <div className="absolute right-[-8%] top-[10%] h-56 w-56 rounded-full bg-violet-300/20 blur-3xl"></div>
        <div className="absolute bottom-[-18%] left-[30%] h-64 w-64 rounded-full bg-cyan-300/20 blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <div className="mb-8 text-center lg:mb-10">
          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-white/80 shadow-[0_16px_40px_rgba(15,23,42,0.08)] lg:h-32 lg:w-32">
            <RobotAvatar avatarId={selected} size="xl" animated />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 lg:text-4xl">Choose Your AI Robot</h1>
          <p className="mt-2 text-slate-600 lg:mx-auto lg:max-w-2xl lg:text-lg">Scroll through five 3D robot companions and pick the one that feels most like you.</p>
        </div>

        <div className="mb-6 rounded-[1.75rem] border border-white/70 bg-white/70 p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)] lg:mb-8 lg:p-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-700">Selected Robot</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900 lg:text-3xl">{activeAvatar.name}</h2>
              <p className="text-sm font-semibold text-violet-700 lg:text-base">{activeAvatar.title}</p>
            </div>
            <div className={`rounded-full px-4 py-2 text-sm font-semibold text-slate-700 lg:text-base ${activeAvatar.accentClassName}`}>
              <span className="inline-flex items-center gap-2"><Sparkles className="h-4 w-4" /> {activeAvatar.tagline}</span>
            </div>
          </div>
          <p className="mt-4 text-base leading-7 text-slate-600 lg:max-w-4xl lg:text-lg">{activeAvatar.description}</p>
        </div>

        <div className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-600">Swipe or use your mouse wheel to browse</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => scrollByCard('left')}
                className="rounded-full border border-slate-200 bg-white/90 p-2 text-slate-600 transition hover:border-cyan-300 hover:text-cyan-700"
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollByCard('right')}
                className="rounded-full border border-slate-200 bg-white/90 p-2 text-slate-600 transition hover:border-cyan-300 hover:text-cyan-700"
                aria-label="Scroll right"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div
            ref={scrollRef}
            onWheel={handleWheel}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [-ms-overflow-style:none] lg:gap-6 [&::-webkit-scrollbar]:hidden"
          >
            {AVATAR_OPTIONS.map((avatar) => {
              const isSelected = avatar.id === selected;

              return (
                <button
                  key={avatar.id}
                  type="button"
                  onClick={() => setSelected(avatar.id)}
                  className={`group min-w-[88%] snap-center rounded-[1.75rem] border p-5 text-left transition-all duration-300 sm:min-w-[72%] lg:min-w-[48%] xl:min-w-[42%] ${
                    isSelected
                      ? 'border-cyan-300 bg-white shadow-[0_18px_50px_rgba(34,211,238,0.18)]'
                      : 'border-white/70 bg-white/65 hover:border-cyan-200 hover:bg-white'
                  }`}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="mx-auto rounded-[1.5rem] bg-slate-50/80 p-3 shadow-inner sm:mx-0 lg:p-4">
                      <RobotAvatar avatarId={avatar.id} size="xl" animated={isSelected} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-2xl font-bold text-slate-900 lg:text-3xl">{avatar.name}</h3>
                        {isSelected && (
                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm font-semibold text-violet-700">{avatar.title}</p>
                      <p className="mt-3 text-sm leading-6 text-slate-600 lg:text-base">{avatar.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onBack}
            className="flex-1 rounded-xl bg-slate-200 py-3 font-semibold text-slate-700 transition hover:bg-slate-300"
          >
            Back
          </button>
          <button
            onClick={handleContinue}
            className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-sky-500 py-3 font-bold text-white shadow-[0_12px_30px_rgba(34,197,94,0.28)] transition hover:scale-[1.02]"
          >
            Continue with {activeAvatar.name}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes float-avatar {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        .animate-float-avatar {
          animation: float-avatar 3.8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default AvatarSelection;
