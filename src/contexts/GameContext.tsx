import React, { createContext, useContext, useState } from 'react';
import { GameState } from '../types';

interface GameContextType {
  gameState: GameState;
  updateGameState: (updates: Partial<GameState>) => void;
  startGame: (gameId: string) => void;
  endGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>({
    currentGame: null,
    score: 0,
    level: 1,
    isPlaying: false
  });

  const updateGameState = (updates: Partial<GameState>) => {
    setGameState(prev => ({ ...prev, ...updates }));
  };

  const startGame = (gameId: string) => {
    setGameState({
      currentGame: gameId,
      score: 0,
      level: 1,
      isPlaying: true
    });
  };

  const endGame = () => {
    setGameState({
      currentGame: null,
      score: 0,
      level: 1,
      isPlaying: false
    });
  };

  return (
    <GameContext.Provider value={{
      gameState,
      updateGameState,
      startGame,
      endGame
    }}>
      {children}
    </GameContext.Provider>
  );
};