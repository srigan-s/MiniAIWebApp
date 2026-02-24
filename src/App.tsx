import React, { useState, useEffect } from 'react';
import { User } from './types';
import { UserProvider } from './contexts/UserContext';
import { GameProvider } from './contexts/GameContext';
import OnboardingFlow from './components/OnboardingFlow';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import LessonModule from './components/LessonModule';
import MiniGame from './components/MiniGame';
import Header from './components/Header';

const FloatingBubbles = () => (
  <>
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      <div className="ambient-glow ambient-glow-one"></div>
      <div className="ambient-glow ambient-glow-two"></div>
      <div className="ambient-glow ambient-glow-three"></div>

      <span className="bubble bubble-one"></span>
      <span className="bubble bubble-two"></span>
      <span className="bubble bubble-three"></span>
      <span className="bubble bubble-four"></span>
      <span className="bubble bubble-five"></span>
      <span className="bubble bubble-six"></span>
      <span className="bubble bubble-seven"></span>
      <span className="bubble bubble-eight"></span>
      <span className="bubble bubble-nine"></span>
      <span className="bubble bubble-ten"></span>
      <span className="bubble bubble-eleven"></span>
      <span className="bubble bubble-twelve"></span>

      <span className="sparkle sparkle-one"></span>
      <span className="sparkle sparkle-two"></span>
      <span className="sparkle sparkle-three"></span>
      <span className="sparkle sparkle-four"></span>
    </div>
    <style>{`
      .ambient-glow {
        position: absolute;
        border-radius: 9999px;
        filter: blur(40px);
        opacity: 0.4;
        animation: glow-drift 12s ease-in-out infinite;
      }
      .ambient-glow-one {
        top: -8%; left: -6%; width: 260px; height: 260px;
        background: rgba(110, 231, 183, 0.45);
      }
      .ambient-glow-two {
        top: 24%; right: -8%; width: 300px; height: 300px;
        background: rgba(56, 189, 248, 0.28);
        animation-delay: 2s;
      }
      .ambient-glow-three {
        bottom: -14%; left: 30%; width: 340px; height: 340px;
        background: rgba(52, 211, 153, 0.30);
        animation-delay: 5s;
      }

      .bubble {
        position: absolute;
        bottom: -140px;
        border-radius: 9999px;
        background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.82), rgba(52,211,153,0.22) 68%, rgba(16,185,129,0.08));
        backdrop-filter: blur(2px);
        border: 1px solid rgba(255,255,255,0.5);
        box-shadow: 0 0 24px rgba(16,185,129,0.18);
        animation: bubble-float linear infinite;
      }
      .bubble-one { left: 4%; width: 68px; height: 68px; animation-duration: 20s; }
      .bubble-two { left: 13%; width: 22px; height: 22px; animation-duration: 14s; animation-delay: 2s; }
      .bubble-three { left: 22%; width: 44px; height: 44px; animation-duration: 18s; animation-delay: 5s; }
      .bubble-four { left: 31%; width: 82px; height: 82px; animation-duration: 23s; animation-delay: 1s; }
      .bubble-five { left: 45%; width: 30px; height: 30px; animation-duration: 15s; animation-delay: 3s; }
      .bubble-six { left: 55%; width: 58px; height: 58px; animation-duration: 21s; animation-delay: 6s; }
      .bubble-seven { left: 64%; width: 26px; height: 26px; animation-duration: 13s; animation-delay: 4s; }
      .bubble-eight { left: 72%; width: 72px; height: 72px; animation-duration: 22s; animation-delay: 2.5s; }
      .bubble-nine { left: 81%; width: 34px; height: 34px; animation-duration: 17s; animation-delay: 7s; }
      .bubble-ten { left: 88%; width: 50px; height: 50px; animation-duration: 19s; animation-delay: 1.5s; }
      .bubble-eleven { left: 94%; width: 24px; height: 24px; animation-duration: 12s; animation-delay: 8s; }
      .bubble-twelve { left: 38%; width: 18px; height: 18px; animation-duration: 11s; animation-delay: 6.5s; }

      .sparkle {
        position: absolute;
        border-radius: 9999px;
        background: rgba(255, 255, 255, 0.85);
        box-shadow: 0 0 12px rgba(16,185,129,0.3);
        animation: sparkle-twinkle ease-in-out infinite;
      }
      .sparkle-one { top: 16%; left: 18%; width: 6px; height: 6px; animation-duration: 3.5s; }
      .sparkle-two { top: 28%; right: 22%; width: 8px; height: 8px; animation-duration: 4.2s; animation-delay: 1s; }
      .sparkle-three { bottom: 26%; left: 74%; width: 5px; height: 5px; animation-duration: 3.1s; animation-delay: 2s; }
      .sparkle-four { bottom: 34%; left: 12%; width: 7px; height: 7px; animation-duration: 4.6s; animation-delay: 1.4s; }

      @keyframes bubble-float {
        0% { transform: translateY(0) translateX(0) scale(0.94); opacity: 0; }
        8% { opacity: 0.75; }
        50% { transform: translateY(-58vh) translateX(18px) scale(1); opacity: 0.55; }
        100% { transform: translateY(-125vh) translateX(-24px) scale(1.1); opacity: 0; }
      }

      @keyframes glow-drift {
        0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
        50% { transform: translate3d(18px, -20px, 0) scale(1.08); }
      }

      @keyframes sparkle-twinkle {
        0%, 100% { opacity: 0.2; transform: scale(0.7); }
        50% { opacity: 0.9; transform: scale(1.15); }
      }
    `}</style>
  </>
);

function App() {
  const [currentView, setCurrentView] = useState<'login' | 'onboarding' | 'dashboard' | 'lesson' | 'game'>('login');
  const [currentLesson, setCurrentLesson] = useState<number | null>(null);
  const [currentGame, setCurrentGame] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('aiLearningUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setCurrentView('dashboard');
    }
  }, []);

  const handleLogin = (email: string, password: string) => {
    const savedUser = localStorage.getItem('aiLearningUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      if (userData.email === email && userData.password === password) {
        setUser(userData);
        setCurrentView('dashboard');
        return true;
      }
    }
    return false;
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('login');
    setCurrentLesson(null);
    setCurrentGame(null);
  };

  const handleGoToSignup = () => {
    setCurrentView('onboarding');
  };

  const handleOnboardingComplete = (userData: User) => {
    setUser(userData);
    localStorage.setItem('aiLearningUser', JSON.stringify(userData));
    setCurrentView('dashboard');
  };

  const handleStartLesson = (lessonId: number) => {
    setCurrentLesson(lessonId);
    setCurrentView('lesson');
  };

  const handleStartGame = (gameId: string) => {
    setCurrentGame(gameId);
    setCurrentView('game');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setCurrentLesson(null);
    setCurrentGame(null);
  };

  if (currentView === 'login') {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50">
        <FloatingBubbles />
        <LoginForm 
          onLogin={handleLogin}
          onGoToSignup={handleGoToSignup}
        />
      </div>
    );
  }

  if (currentView === 'onboarding') {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50">
        <FloatingBubbles />
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      </div>
    );
  }

  return (
    <UserProvider initialUser={user}>
      <GameProvider>
        <div className="relative min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50">
          <FloatingBubbles />
          <Header onBackToDashboard={handleBackToDashboard} showBackButton={currentView !== 'dashboard'} onLogout={handleLogout} />
          
          <main className="container mx-auto px-4 py-8 relative z-10">
            {currentView === 'dashboard' && (
              <Dashboard 
                onStartLesson={handleStartLesson}
                onStartGame={handleStartGame}
              />
            )}
            
            {currentView === 'lesson' && currentLesson !== null && (
              <LessonModule 
                lessonId={currentLesson}
                onComplete={handleBackToDashboard}
              />
            )}
            
            {currentView === 'game' && currentGame && (
              <MiniGame 
                gameId={currentGame}
                onComplete={handleBackToDashboard}
              />
            )}
          </main>
        </div>
      </GameProvider>
    </UserProvider>
  );
}

export default App;
