import React from 'react';
import { useUser } from '../contexts/UserContext';
import RobotTraining from './games/RobotTraining';
import DataSorting from './games/DataSorting';
import QuizBattle from './games/QuizBattle';
import NeuralNetworkBuilder from './games/NeuralNetworkBuilder';
import ImageClassifier from './games/ImageClassifier';
import BiasDetector from './games/BiasDetector';

interface MiniGameProps {
  gameId: string;
  onComplete: () => void;
}

const MiniGame: React.FC<MiniGameProps> = ({ gameId, onComplete }) => {
  const { addXP, completeGame } = useUser();

  const handleGameComplete = (xpReward: number) => {
    addXP(xpReward);
    completeGame(gameId);
    
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  const renderGame = () => {
    switch (gameId) {
      case 'robot-training':
        return <RobotTraining onComplete={() => handleGameComplete(40)} />;
      case 'data-sorting':
        return <DataSorting onComplete={() => handleGameComplete(35)} />;
      case 'quiz-battle':
        return <QuizBattle onComplete={() => handleGameComplete(50)} />;
      case 'neural-network-builder':
        return <NeuralNetworkBuilder onComplete={() => handleGameComplete(60)} />;
      case 'image-classifier':
        return <ImageClassifier onComplete={() => handleGameComplete(55)} />;
      case 'bias-detector':
        return <BiasDetector onComplete={() => handleGameComplete(65)} />;
      default:
        return <div>Game not found</div>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {renderGame()}
    </div>
  );
};

export default MiniGame;