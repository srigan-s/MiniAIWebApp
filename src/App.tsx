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
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50">
        <LoginForm 
          onLogin={handleLogin}
          onGoToSignup={handleGoToSignup}
        />
      </div>
    );
  }

  if (currentView === 'onboarding') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50">
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      </div>
    );
  }

  return (
    <UserProvider initialUser={user}>
      <GameProvider>
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50">
          <Header onBackToDashboard={handleBackToDashboard} showBackButton={currentView !== 'dashboard'} onLogout={handleLogout} />
          
          <main className="container mx-auto px-4 py-8">
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