import React, { createContext, useContext, useRef, useState } from 'react';
import { User, Badge } from '../types';
import { syncUserProgress } from '../lib/authApi';
import { games, lessons } from '../data/learningContent';

const USER_STORAGE_KEY = 'aiLearningUserSession';

export interface BadgeToast {
  id: string;
  badge: Badge;
}

export interface LevelCelebration {
  id: string;
  level: number;
  missionLabel: string;
  avatarId?: string;
}

export interface CourseCompletionNotice {
  id: string;
  studentName: string;
}

interface UserContextType {
  user: User | null;
  updateUser: (updates: Partial<User>) => void;
  addXP: (amount: number) => void;
  addBadge: (badge: Badge) => void;
  completeLesson: (lessonId: number, xpReward: number) => void;
  completeGame: (gameId: string, xpReward: number) => void;
  badgeToasts: BadgeToast[];
  dismissBadgeToast: (toastId: string) => void;
  levelCelebration: LevelCelebration | null;
  dismissLevelCelebration: () => void;
  courseCompletionNotice: CourseCompletionNotice | null;
  dismissCourseCompletionNotice: () => void;
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
  const normalizeUserLevel = (nextUser: User | null) => {
    if (!nextUser) {
      return nextUser;
    }

    return {
      ...nextUser,
      level: nextUser.completedLessons.length + nextUser.completedGames.length + 1,
    };
  };

  const [user, setUser] = useState<User | null>(normalizeUserLevel(initialUser));
  const [badgeToasts, setBadgeToasts] = useState<BadgeToast[]>([]);
  const [levelCelebration, setLevelCelebration] = useState<LevelCelebration | null>(null);
  const [courseCompletionNotice, setCourseCompletionNotice] = useState<CourseCompletionNotice | null>(null);
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

      return {
        ...currentUser,
        xp: newXP,
      };
    });
  };

  const createBadge = (id: string, name: string, description: string, icon: string): Badge => ({
    id,
    name,
    description,
    icon,
    unlockedAt: new Date(),
  });

  const getUnlockedBadges = (
    currentUser: User,
    completedLessons: number[],
    completedGames: string[],
    nextXP: number
  ) => {
    const earnedIds = new Set(currentUser.badges.map((badge) => badge.id));
    const totalCompleted = completedLessons.length + completedGames.length;
    const newBadges: Badge[] = [];

    const unlock = (badge: Badge, condition: boolean) => {
      if (!condition || earnedIds.has(badge.id)) {
        return;
      }

      earnedIds.add(badge.id);
      newBadges.push(badge);
    };

    unlock(
      createBadge('first-lesson', 'First Steps', 'Completed your first lesson!', '🌟'),
      completedLessons.length >= 1
    );
    unlock(
      createBadge('first-game', 'Game On', 'Played your first AI challenge game!', '🎮'),
      completedGames.length >= 1
    );
    unlock(
      createBadge('lesson-explorer', 'Lesson Explorer', 'Completed 3 learning adventures.', '🧭'),
      completedLessons.length >= 3
    );
    unlock(
      createBadge('challenge-starter', 'Challenge Starter', 'Completed 3 AI challenge games.', '⚡'),
      completedGames.length >= 3
    );
    unlock(
      createBadge('halfway-hero', 'Halfway Hero', 'Reached the halfway point of the full quest path.', '🚀'),
      totalCompleted >= Math.ceil((lessons.length + games.length) / 2)
    );
    unlock(
      createBadge('visionary-scholar', 'Visionary Scholar', 'Finished every learning adventure.', '🎓'),
      completedLessons.length === lessons.length
    );
    unlock(
      createBadge('challenge-champion', 'Challenge Champion', 'Finished every AI challenge game.', '🏅'),
      completedGames.length === games.length
    );
    unlock(
      createBadge('xp-milestone-100', 'XP Master', 'Earned 100 XP!', '🏆'),
      nextXP >= 100
    );
    unlock(
      createBadge('xp-milestone-250', 'XP Rocket', 'Blasted past 250 XP.', '✨'),
      nextXP >= 250
    );
    unlock(
      createBadge('xp-milestone-500', 'XP Legend', 'Collected 500 XP in your adventure.', '👑'),
      nextXP >= 500
    );
    unlock(
      createBadge('quest-master', 'Quest Master', 'Completed every lesson and challenge on the map.', '🗺️'),
      completedLessons.length === lessons.length && completedGames.length === games.length
    );

    return newBadges;
  };

  const completeMission = ({
    lessonId,
    gameId,
    xpReward,
  }: {
    lessonId?: number;
    gameId?: string;
    xpReward: number;
  }) => {
    let queuedToasts: BadgeToast[] = [];
    let queuedCelebration: LevelCelebration | null = null;
    let queuedCourseCompletionNotice: CourseCompletionNotice | null = null;

    setUser((currentUser) => {
      if (!currentUser) {
        return currentUser;
      }

      if (typeof lessonId === 'number' && currentUser.completedLessons.includes(lessonId)) {
        return currentUser;
      }

      if (typeof gameId === 'string' && currentUser.completedGames.includes(gameId)) {
        return currentUser;
      }

      const completedLessons = typeof lessonId === 'number'
        ? [...currentUser.completedLessons, lessonId]
        : currentUser.completedLessons;
      const completedGames = typeof gameId === 'string'
        ? [...currentUser.completedGames, gameId]
        : currentUser.completedGames;
      const xp = currentUser.xp + xpReward;
      const level = completedLessons.length + completedGames.length + 1;
      const newBadges = getUnlockedBadges(currentUser, completedLessons, completedGames, xp);
      const missionLabel = typeof lessonId === 'number'
        ? lessons.find((lesson) => lesson.id === lessonId)?.title ?? 'Learning adventure'
        : games.find((game) => game.id === gameId)?.title ?? 'AI challenge';

      queuedToasts = newBadges.map((badge) => ({
        id: `${badge.id}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        badge,
      }));
      if (newBadges.some((badge) => badge.id === 'quest-master')) {
        queuedCourseCompletionNotice = {
          id: `course-complete-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          studentName: currentUser.name,
        };
      }
      queuedCelebration = {
        id: `level-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        level,
        missionLabel,
        avatarId: currentUser.avatar,
      };

      const nextUser = {
        ...currentUser,
        xp,
        level,
        completedLessons,
        completedGames,
        badges: [...currentUser.badges, ...newBadges],
      };

      persistUserSession(nextUser);
      enqueueProgressSync(nextUser);
      return nextUser;
    });

    if (queuedToasts.length > 0) {
      setBadgeToasts((currentToasts) => [...currentToasts, ...queuedToasts]);
    }

    if (queuedCelebration) {
      setLevelCelebration(queuedCelebration);
    }

    if (queuedCourseCompletionNotice) {
      setCourseCompletionNotice(queuedCourseCompletionNotice);
    }
  };

  const completeLesson = (lessonId: number, xpReward: number) => {
    completeMission({ lessonId, xpReward });
  };

  const completeGame = (gameId: string, xpReward: number) => {
    completeMission({ gameId, xpReward });
  };

  const dismissBadgeToast = (toastId: string) => {
    setBadgeToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== toastId));
  };

  const dismissLevelCelebration = () => {
    setLevelCelebration(null);
  };

  const dismissCourseCompletionNotice = () => {
    setCourseCompletionNotice(null);
  };

  return (
    <UserContext.Provider value={{
      user,
      updateUser,
      addXP,
      addBadge,
      completeLesson,
      completeGame,
      badgeToasts,
      dismissBadgeToast,
      levelCelebration,
      dismissLevelCelebration,
      courseCompletionNotice,
      dismissCourseCompletionNotice,
    }}>
      {children}
    </UserContext.Provider>
  );
};
