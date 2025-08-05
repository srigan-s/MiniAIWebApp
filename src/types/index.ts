export interface User {
  id: string;
  name: string;
  age: number;
  email: string;
  password: string;
  avatar: string;
  parentalConsent: boolean;
  xp: number;
  level: number;
  badges: Badge[];
  completedLessons: number[];
  completedGames: string[];
  createdAt: Date;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
}

export interface Lesson {
  id: number;
  title: string;
  description: string;
  type: 'animation-quiz' | 'spot-difference' | 'matching';
  xpReward: number;
  content: LessonContent;
}

export interface LessonContent {
  title: string;
  description: string;
  steps: LessonStep[];
}

export interface LessonStep {
  type: 'animation' | 'quiz' | 'game';
  content: any;
}

export interface GameState {
  currentGame: string | null;
  score: number;
  level: number;
  isPlaying: boolean;
}

export interface MiniGameConfig {
  id: string;
  title: string;
  description: string;
  type: 'robot-training' | 'data-sorting' | 'quiz-battle';
  xpReward: number;
}