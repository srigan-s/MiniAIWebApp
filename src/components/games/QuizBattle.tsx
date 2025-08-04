import React, { useState, useEffect } from 'react';
import { Zap, Clock, CheckCircle, X } from 'lucide-react';

interface QuizBattleProps {
  onComplete: () => void;
}

const QuizBattle: React.FC<QuizBattleProps> = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const questions = [
    {
      id: 0,
      question: "What does AI stand for?",
      options: [
        { id: 'a', text: 'Artificial Intelligence', correct: true },
        { id: 'b', text: 'Automatic Information', correct: false },
        { id: 'c', text: 'Advanced Internet', correct: false },
        { id: 'd', text: 'Animal Intelligence', correct: false }
      ],
      difficulty: 'easy'
    },
    {
      id: 1,
      question: "Which of these is an example of AI you might use?",
      options: [
        { id: 'a', text: 'A pencil', correct: false },
        { id: 'b', text: 'Voice assistants like Siri', correct: true },
        { id: 'c', text: 'A paper book', correct: false },
        { id: 'd', text: 'A wooden chair', correct: false }
      ],
      difficulty: 'easy'
    },
    {
      id: 2,
      question: "How is AI different from a calculator?",
      options: [
        { id: 'a', text: 'AI can only add numbers', correct: false },
        { id: 'b', text: 'AI can learn and adapt', correct: true },
        { id: 'c', text: 'AI is always wrong', correct: false },
        { id: 'd', text: 'There is no difference', correct: false }
      ],
      difficulty: 'medium'
    },
    {
      id: 3,
      question: "What can AI do that's similar to humans?",
      options: [
        { id: 'a', text: 'Recognize faces in photos', correct: true },
        { id: 'b', text: 'Feel physical pain', correct: false },
        { id: 'c', text: 'Eat food for energy', correct: false },
        { id: 'd', text: 'Sleep at night', correct: false }
      ],
      difficulty: 'medium'
    },
    {
      id: 4,
      question: "Where might you find AI helping you at home?",
      options: [
        { id: 'a', text: 'In smart speakers', correct: true },
        { id: 'b', text: 'In regular mirrors', correct: false },
        { id: 'c', text: 'In wooden furniture', correct: false },
        { id: 'd', text: 'In printed books', correct: false }
      ],
      difficulty: 'hard'
    }
  ];

  // Timer effect
  useEffect(() => {
    if (!gameStarted || gameOver || showFeedback) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, gameOver, showFeedback, currentQuestion]);

  const handleTimeout = () => {
    setShowFeedback(true);
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        nextQuestion();
      } else {
        endGame();
      }
    }, 2000);
  };

  const handleAnswerSelect = (answerId: string) => {
    if (showFeedback) return;
    
    setSelectedAnswer(answerId);
    setShowFeedback(true);
    
    const question = questions[currentQuestion];
    const selectedOption = question.options.find(opt => opt.id === answerId);
    
    if (selectedOption?.correct) {
      const timeBonus = Math.floor(timeLeft / 5);
      const difficultyMultiplier = question.difficulty === 'hard' ? 3 : question.difficulty === 'medium' ? 2 : 1;
      const points = (10 + timeBonus) * difficultyMultiplier;
      setScore(prev => prev + points);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        nextQuestion();
      } else {
        endGame();
      }
    }, 2000);
  };

  const nextQuestion = () => {
    setCurrentQuestion(prev => prev + 1);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setTimeLeft(30);
  };

  const endGame = () => {
    setGameOver(true);
    setTimeout(() => {
      onComplete();
    }, 3000);
  };

  const startGame = () => {
    setGameStarted(true);
    setTimeLeft(30);
  };

  if (!gameStarted) {
    return (
      <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-yellow-200 text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full mx-auto mb-6 flex items-center justify-center text-5xl animate-pulse">
          ⚡
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">AI Quiz Battle!</h1>
        <p className="text-xl text-gray-600 mb-6">
          Test your AI knowledge in this fast-paced challenge!
        </p>
        
        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-bold text-orange-700 mb-4">Game Rules:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              <span>Answer as fast as you can!</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <span>30 seconds per question</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">+</div>
              <span>Bonus points for speed</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs">★</div>
              <span>Harder questions = more points</span>
            </div>
          </div>
        </div>

        <button
          onClick={startGame}
          className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 rounded-xl font-bold text-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 hover:scale-105 shadow-lg animate-pulse"
        >
          Start Quiz Battle! ⚡
        </button>
      </div>
    );
  }

  if (gameOver) {
    const maxScore = questions.reduce((total, q) => {
      const difficultyMultiplier = q.difficulty === 'hard' ? 3 : q.difficulty === 'medium' ? 2 : 1;
      return total + (16 * difficultyMultiplier); // 10 base + 6 time bonus max
    }, 0);

    const percentage = Math.round((score / maxScore) * 100);

    return (
      <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-green-200 text-center">
        <div className="text-6xl mb-4 animate-bounce">
          {percentage >= 80 ? '🏆' : percentage >= 60 ? '🥈' : percentage >= 40 ? '🥉' : '🎖️'}
        </div>
        <h1 className="text-3xl font-bold text-green-700 mb-4">Quiz Battle Complete!</h1>
        <div className="space-y-4 mb-6">
          <div className="text-4xl font-bold text-purple-600">{score} Points!</div>
          <div className="bg-purple-100 rounded-2xl p-4">
            <p className="text-purple-700 font-semibold">
              You scored {percentage}% - {
                percentage >= 80 ? 'Outstanding!' : 
                percentage >= 60 ? 'Great job!' : 
                percentage >= 40 ? 'Good effort!' : 
                'Keep learning!'
              }
            </p>
          </div>
        </div>
        <div className="bg-green-100 rounded-2xl p-4">
          <p className="text-green-700 font-semibold">+50 XP Earned!</p>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-yellow-200">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <Zap className="w-8 h-8 text-yellow-600" />
          <h1 className="text-2xl font-bold text-gray-800">AI Quiz Battle</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-yellow-100 px-4 py-2 rounded-full">
            <span className="text-yellow-700 font-semibold">Score: {score}</span>
          </div>
          <div className={`px-4 py-2 rounded-full flex items-center space-x-2 ${
            timeLeft <= 10 ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-blue-100 text-blue-700'
          }`}>
            <Clock className="w-4 h-4" />
            <span className="font-semibold">{timeLeft}s</span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm font-medium text-gray-600 mb-2">
          <span>Question {currentQuestion + 1} of {questions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="space-y-8">
        <div className="text-center">
          <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${
            question.difficulty === 'hard' ? 'bg-red-100 text-red-700' :
            question.difficulty === 'medium' ? 'bg-orange-100 text-orange-700' :
            'bg-green-100 text-green-700'
          }`}>
            {question.difficulty.toUpperCase()}
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{question.question}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {question.options.map((option) => {
            const isSelected = selectedAnswer === option.id;
            const showResult = showFeedback;
            
            let buttonClass = "p-4 rounded-xl border-2 transition-all text-left font-medium ";
            
            if (showResult) {
              if (option.correct) {
                buttonClass += "bg-green-100 border-green-400 text-green-700";
              } else if (isSelected) {
                buttonClass += "bg-red-100 border-red-400 text-red-700";
              } else {
                buttonClass += "bg-gray-100 border-gray-200 text-gray-600";
              }
            } else {
              buttonClass += isSelected 
                ? "bg-yellow-100 border-yellow-400 text-yellow-700 scale-105"
                : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:scale-102 cursor-pointer";
            }

            return (
              <button
                key={option.id}
                onClick={() => handleAnswerSelect(option.id)}
                disabled={showFeedback}
                className={buttonClass}
              >
                <div className="flex items-center justify-between">
                  <span>{option.text}</span>
                  {showResult && (
                    <div className="ml-2">
                      {option.correct ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : isSelected ? (
                        <X className="w-6 h-6 text-red-600" />
                      ) : null}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {showFeedback && (
          <div className="text-center">
            <div className={`p-4 rounded-2xl ${
              selectedAnswer && question.options.find(opt => opt.id === selectedAnswer)?.correct
                ? 'bg-green-100 border-2 border-green-200'
                : 'bg-red-100 border-2 border-red-200'
            }`}>
              <p className={`text-lg font-semibold ${
                selectedAnswer && question.options.find(opt => opt.id === selectedAnswer)?.correct
                  ? 'text-green-700'
                  : 'text-red-700'
              }`}>
                {selectedAnswer && question.options.find(opt => opt.id === selectedAnswer)?.correct
                  ? '🎉 Correct! Great job!'
                  : timeLeft === 0
                  ? '⏰ Time\'s up!'
                  : '❌ Not quite right!'
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizBattle;