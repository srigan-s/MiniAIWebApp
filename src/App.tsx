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
      <span className="bubble bubble-one"></span>
      <span className="bubble bubble-two"></span>
      <span className="bubble bubble-three"></span>
      <span className="bubble bubble-four"></span>
      <span className="bubble bubble-five"></span>
      <span className="bubble bubble-six"></span>
    </div>
    <style>{`
      .bubble {
        position: absolute;
        bottom: -120px;
        border-radius: 9999px;
        background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.75), rgba(52,211,153,0.2) 65%, rgba(16,185,129,0.08));
        backdrop-filter: blur(2px);
        border: 1px solid rgba(255,255,255,0.4);
        box-shadow: 0 0 24px rgba(16,185,129,0.15);
        animation: bubble-float linear infinite;
      }
      .bubble-one { left: 6%; width: 64px; height: 64px; animation-duration: 19s; }
      .bubble-two { left: 20%; width: 24px; height: 24px; animation-duration: 14s; animation-delay: 2s; }
      .bubble-three { left: 38%; width: 80px; height: 80px; animation-duration: 23s; animation-delay: 4s; }
      .bubble-four { left: 57%; width: 34px; height: 34px; animation-duration: 16s; animation-delay: 1s; }
      .bubble-five { left: 76%; width: 56px; height: 56px; animation-duration: 21s; animation-delay: 3s; }
      .bubble-six { left: 90%; width: 28px; height: 28px; animation-duration: 15s; animation-delay: 5s; }

      @keyframes bubble-float {
        0% { transform: translateY(0) translateX(0) scale(0.95); opacity: 0; }
        10% { opacity: 0.75; }
        50% { transform: translateY(-56vh) translateX(18px) scale(1); opacity: 0.5; }
        100% { transform: translateY(-120vh) translateX(-20px) scale(1.08); opacity: 0; }
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
