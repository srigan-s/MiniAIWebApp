import React, { useEffect } from 'react';
import { Award, X } from 'lucide-react';
import { BadgeToast } from '../../contexts/UserContext';

interface BadgeToastContainerProps {
  toasts: BadgeToast[];
  onDismiss: (toastId: string) => void;
}

const BadgeToastContainer: React.FC<BadgeToastContainerProps> = ({ toasts, onDismiss }) => {
  useEffect(() => {
    const timers = toasts.map((toast) =>
      window.setTimeout(() => {
        onDismiss(toast.id);
      }, 4500)
    );

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [toasts, onDismiss]);

  return (
    <div className="pointer-events-none fixed inset-x-4 top-20 z-[70] flex flex-col gap-3 sm:left-auto sm:right-4 sm:top-24 sm:w-full sm:max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto animate-[toast-pop_0.35s_ease-out] rounded-[1.5rem] border border-amber-200 bg-white/95 p-4 shadow-[0_24px_60px_rgba(249,115,22,0.18)] backdrop-blur"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 text-2xl">
              {toast.badge.icon}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-amber-600">
                <Award className="h-3.5 w-3.5" />
                Badge Unlocked
              </div>
              <p className="mt-1 text-base font-black text-slate-900">{toast.badge.name}</p>
              <p className="mt-1 text-sm leading-5 text-slate-600">{toast.badge.description}</p>
            </div>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              aria-label="Dismiss badge notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BadgeToastContainer;
