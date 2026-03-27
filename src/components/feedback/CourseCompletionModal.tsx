import React from 'react';
import { Download, Sparkles, Trophy, X } from 'lucide-react';
import { CourseCompletionNotice } from '../../contexts/UserContext';

interface CourseCompletionModalProps {
  notice: CourseCompletionNotice | null;
  onDismiss: () => void;
}

const CourseCompletionModal: React.FC<CourseCompletionModalProps> = ({ notice, onDismiss }) => {
  if (!notice) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-emerald-100 bg-white px-6 py-8 text-center shadow-[0_40px_120px_rgba(15,23,42,0.35)] animate-[level-pop_0.45s_ease-out] sm:px-10">
        <button
          type="button"
          onClick={onDismiss}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          aria-label="Close course completion message"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.28),_transparent_58%),linear-gradient(180deg,_rgba(236,253,245,0.95),_transparent)]" />

        <div className="relative">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-emerald-700">
            <Sparkles className="h-3.5 w-3.5" />
            Course Complete
          </div>

          <div className="mx-auto mt-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 text-white shadow-[0_20px_50px_rgba(16,185,129,0.35)]">
            <Trophy className="h-11 w-11" />
          </div>

          <h2 className="mt-6 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Congratulations, {notice.studentName}!
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            You completed the full MiniAI Learn course. Visit your profile to download your PDF certificate for
            <span className="font-bold text-slate-900"> Introduction to AI Principles</span>.
          </p>

          <div className="mt-6 rounded-[1.5rem] border border-cyan-100 bg-gradient-to-r from-emerald-50 via-white to-cyan-50 px-5 py-5 text-left shadow-sm">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
                <Download className="h-5 w-5" />
              </div>
              <div>
                <p className="text-base font-bold text-slate-900">Next step</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Open the Profile page and use the certificate section to download your personalized PDF.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onDismiss}
            className="mt-7 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:scale-[1.02]"
          >
            Awesome, I’ll Check My Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCompletionModal;
