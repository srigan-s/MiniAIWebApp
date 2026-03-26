import React, { createContext, useContext, useRef, useState } from 'react';
import { User, Badge } from '../types';
import { syncUserProgress } from '../lib/authApi';

const USER_STORAGE_KEY = 'aiLearningUserSession';

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
  const syncQueueRef = useRef(Promise.resolve());

  const persistUserSession = (nextUser: User) => {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
  };

  const enqueueProgressSync = (nextUser: User) => {
    syncQueueRef.current = syncQueueRef.current
      .catch(() => undefined)
      .then(async () => {
        try {
          const syncedUser = await syncUserProgress(nextUser.id, {
            xp: nextUser.xp,
            level: nextUser.level,
            badges: nextUser.badges,
            completedLessons: nextUser.completedLessons,
            completedGames: nextUser.completedGames,
          });

          setUser((currentUser) => {
            if (!currentUser || currentUser.id !== syncedUser.id) {
              return currentUser;
            }

            const mergedUser = {
              ...currentUser,
              ...syncedUser,
            };
            persistUserSession(mergedUser);
            return mergedUser;
          });
        } catch (error) {
          console.error('Failed to sync user progress:', error);
        }
      });
  };

  const applyUserUpdate = (updater: (currentUser: User) => User) => {
    setUser((currentUser) => {
      if (!currentUser) {
        return currentUser;
      }

      const nextUser = updater(currentUser);
      persistUserSession(nextUser);
      enqueueProgressSync(nextUser);
      return nextUser;
    });
  };

  const updateUser = (updates: Partial<User>) => {
    applyUserUpdate((currentUser) => ({ ...currentUser, ...updates }));
  };

  const addBadge = (badge: Badge) => {
    applyUserUpdate((currentUser) => {
      if (currentUser.badges.some((existingBadge) => existingBadge.id === badge.id)) {
        return currentUser;
      }

      return {
        ...currentUser,
        badges: [...currentUser.badges, badge],
      };
    });
  };

  const addXP = (amount: number) => {
    applyUserUpdate((currentUser) => {
      const newXP = currentUser.xp + amount;
      const newLevel = Math.floor(newXP / 100) + 1;
      const hasMilestoneBadge = currentUser.badges.some((badge) => badge.id === 'xp-milestone-100');

      const badges = hasMilestoneBadge || newXP < 100
        ? currentUser.badges
        : [
            ...currentUser.badges,
            {
              id: 'xp-milestone-100',
              name: 'XP Master',
              description: 'Earned 100 XP!',
              icon: '🏆',
              unlockedAt: new Date(),
            },
          ];

      return {
        ...currentUser,
        xp: newXP,
        level: newLevel,
        badges,
      };
    });
  };

  const completeLesson = (lessonId: number) => {
    applyUserUpdate((currentUser) => {
      if (currentUser.completedLessons.includes(lessonId)) {
        return currentUser;
      }

      const completedLessons = [...currentUser.completedLessons, lessonId];
      const hasFirstLessonBadge = currentUser.badges.some((badge) => badge.id === 'first-lesson');
      const badges = hasFirstLessonBadge
        ? currentUser.badges
        : [
            ...currentUser.badges,
            {
              id: 'first-lesson',
              name: 'First Steps',
              description: 'Completed your first lesson!',
              icon: '🌟',
              unlockedAt: new Date(),
            },
          ];

      return {
        ...currentUser,
        completedLessons,
        badges,
      };
    });
  };

  const completeGame = (gameId: string) => {
    applyUserUpdate((currentUser) => {
      if (currentUser.completedGames.includes(gameId)) {
        return currentUser;
      }

      return {
        ...currentUser,
        completedGames: [...currentUser.completedGames, gameId],
      };
    });
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
