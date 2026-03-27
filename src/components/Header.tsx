import React from 'react';
import { ArrowLeft, LogOut, UserRound } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { RobotAvatar } from '../lib/avatarOptions';

interface HeaderProps {
  onBackToDashboard: () => void;
  showBackButton: boolean;
  onLogout: () => void;
  onOpenProfile: () => void;
  isProfileView: boolean;
}

const Header: React.FC<HeaderProps> = ({
  onBackToDashboard,
  showBackButton,
  onLogout,
  onOpenProfile,
  isProfileView,
}) => {
  const { user } = useUser();

  return (
    <header className="border-b border-white/70 bg-white/[0.85] shadow-[0_18px_45px_rgba(14,116,144,0.1)] backdrop-blur">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            {showBackButton && (
              <button
                onClick={onBackToDashboard}
                className="flex items-center space-x-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-sky-700"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-semibold">Back</span>
              </button>
            )}

            <div className="flex items-center space-x-3">
              <div className="rounded-2xl bg-gradient-to-br from-cyan-100 to-emerald-100 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                <img src="/images/miniAiElement.png" alt="Brain Icon" className="w-13.5 h-12" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-900">MiniAI</h1>
                <p className="text-sm text-slate-600">Quest through playful AI worlds.</p>
              </div>
            </div>
          </div>

          {user && (
            <div className="flex flex-wrap items-center justify-start gap-3 lg:justify-end">
              <div className="min-w-[140px] rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] sm:text-right">
                <p className="font-semibold text-slate-800">Hey, {user.name}! 👋</p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm sm:justify-end">
                  <span className="rounded-full bg-yellow-100 px-2 py-1 font-medium text-yellow-700">
                    Level {user.level}
                  </span>
                  <span className="rounded-full bg-emerald-100 px-2 py-1 font-medium text-emerald-700">
                    {user.xp} XP
                  </span>
                </div>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-white shadow-lg">
                <RobotAvatar avatarId={user.avatar} size="sm" />
              </div>
              <button
                onClick={onOpenProfile}
                className={`flex items-center space-x-2 rounded-2xl px-4 py-2.5 transition-all duration-200 hover:scale-105 shadow-lg ${
                  isProfileView
                    ? 'bg-sky-700 text-white'
                    : 'bg-sky-500 text-white hover:bg-sky-600'
                }`}
                title="View profile and progress"
              >
                <UserRound className="w-5 h-5" />
                <span className="font-semibold">Profile</span>
              </button>
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 rounded-2xl bg-rose-500 px-4 py-2.5 text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-rose-600"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-semibold">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
