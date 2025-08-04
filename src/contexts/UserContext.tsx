import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Badge } from '../types';

interface UserContextType {
  user: User | null;
  updateUser: (updates: Partial<User>) => void;
  addXP: (amount: number) => void;
  addBadge: (badge: Badge) => void;
  completeLesson: (lessonId: number) => void;
  completeGame: (gameId: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider: React.FC<{ children: React.ReactNode; initialUser: User | null }> = ({ 
  children, 
  initialUser 
}) => {
  const [user, setUser] = useState<User | null>(initialUser);

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('aiLearningUser', JSON.stringify(updatedUser));
  };

  const addXP = (amount: number) => {
    if (!user) return;
    
    const newXP = user.xp + amount;
    const newLevel = Math.floor(newXP / 100) + 1;
    
    updateUser({ xp: newXP, level: newLevel });
    
    // Check for milestone badges
    if (newXP >= 100 && !user.badges.find(b => b.id === 'xp-milestone-100')) {
      const badge: Badge = {
        id: 'xp-milestone-100',
        name: 'XP Master',
        description: 'Earned 100 XP!',
        icon: '🏆',
        unlockedAt: new Date()
      };
      addBadge(badge);
    }
  };

  const addBadge = (badge: Badge) => {
    if (!user) return;
    
    const badges = [...user.badges, badge];
    updateUser({ badges });
  };

  const completeLesson = (lessonId: number) => {
    if (!user) return;
    
    if (!user.completedLessons.includes(lessonId)) {
      const completedLessons = [...user.completedLessons, lessonId];
      updateUser({ completedLessons });
      
      // First lesson badge
      if (completedLessons.length === 1 && !user.badges.find(b => b.id === 'first-lesson')) {
        const badge: Badge = {
          id: 'first-lesson',
          name: 'First Steps',
          description: 'Completed your first lesson!',
          icon: '🌟',
          unlockedAt: new Date()
        };
        addBadge(badge);
      }
    }
  };

  const completeGame = (gameId: string) => {
    if (!user) return;
    
    if (!user.completedGames.includes(gameId)) {
      const completedGames = [...user.completedGames, gameId];
      updateUser({ completedGames });
    }
  };

  return (
    <UserContext.Provider value={{
      user,
      updateUser,
      addXP,
      addBadge,
      completeLesson,
      completeGame
    }}>
      {children}
    </UserContext.Provider>
  );
};