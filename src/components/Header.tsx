import React from 'react';
import { ArrowLeft, LogOut } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface HeaderProps {
  onBackToDashboard: () => void;
  showBackButton: boolean;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onBackToDashboard, showBackButton, onLogout }) => {
  const { user } = useUser();

  return (
    <header className="bg-white shadow-lg border-b-4 border-emerald-400">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <button
                onClick={onBackToDashboard}
                className="flex items-center space-x-2 px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all duration-200 hover:scale-105 shadow-lg"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-semibold">Back</span>
              </button>
            )}

            <div className="flex items-center space-x-2">
              <div className="p-2 bg-emerald-100 rounded-xl">
                <img src="/miniAiElement.png" alt="Brain Icon" className="w-13.5 h-12" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">MiniAI</h1>
                <p className="text-sm text-gray-600">Discover the magic of AI!</p>
              </div>
            </div>
          </div>

          {user && (
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-semibold text-gray-800">Hey, {user.name}! 👋</p>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full font-medium">
                    Level {user.level}
                  </span>
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full font-medium">
                    {user.xp} XP
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-2xl shadow-lg">
                {user.avatar}
              </div>
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 hover:scale-105 shadow-lg"
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
