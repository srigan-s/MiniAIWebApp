import React, { useState } from 'react';
import { Brain, CheckCircle, ArrowRight } from 'lucide-react';

interface NeuralNetworksProps {
  onComplete: () => void;
}

const NeuralNetworks: React.FC<NeuralNetworksProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [connections, setConnections] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const steps = [
    {
      type: 'animation',
      title: 'Neural Networks',
      content: (
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mx-auto flex items-center justify-center text-6xl animate-pulse">
              🧬
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
              ⚡
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-800">Neural Networks</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Neural networks are like a digital brain! They have lots of connected "neurons" that work together to learn and make decisions.
            </p>
            <div className="bg-purple-50 rounded-2xl p-6 border-2 border-purple-200">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-4xl mb-2">🧠</div>
                  <p className="font-semibold">Like a Brain</p>
                  <p className="text-sm text-gray-600">Connected neurons</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">🔗</div>
                  <p className="font-semibold">Connections</p>
                  <p className="text-sm text-gray-600">Neurons talk to each other</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">📚</div>
                  <p className="font-semibold">Learning</p>
                  <p className="text-sm text-gray-600">Gets smarter with practice</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      type: 'interactive',
      title: 'Build Your Neural Network',
      content: (
        <NeuralNetworkBuilder 
          connections={connections}
          onConnectionMade={(connection) => setConnections(prev => [...prev, connection])}
        />
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResults(true);
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(countdownInterval);
            onComplete();
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  if (showResults) {
    return (
      <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-green-200 text-center">
        <div className="text-6xl mb-4 animate-bounce">🎉</div>
        <h1 className="text-3xl font-bold text-green-700 mb-4">Neural Network Lesson Complete!</h1>
        <p className="text-xl text-gray-600 mb-6">You made {connections.length} neural connections!</p>
        <div className="bg-green-100 rounded-2xl p-4">
          <p className="text-green-700 font-semibold">+45 XP Earned!</p>
        </div>
        <div className="bg-green-100 rounded-2xl p-4 mt-4">
          <p className="text-green-700 font-semibold">Redirecting in {countdown}...</p>
        </div>
      </div>
    );
  }

  const canProceed = currentStep === 0 || connections.length >= 3;

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-purple-200">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <Brain className="w-8 h-8 text-purple-600" />
          <h1 className="text-2xl font-bold text-gray-800">Lesson 4: Neural Networks</h1>
        </div>
        <div className="bg-purple-100 px-4 py-2 rounded-full">
          <span className="text-purple-700 font-semibold">Step {currentStep + 1} of {steps.length}</span>
        </div>
      </div>

      <div className="mb-8">
        {steps[currentStep].content}
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleNext}
          disabled={!canProceed}
          className={`px-8 py-3 rounded-xl font-bold text-lg transition-all duration-200 flex items-center space-x-2 ${
            canProceed
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 hover:scale-105 shadow-lg'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <span>{currentStep === steps.length - 1 ? 'Complete Lesson' : 'Next'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const NeuralNetworkBuilder: React.FC<{
  connections: string[];
  onConnectionMade: (connection: string) => void;
}> = ({ connections, onConnectionMade }) => {
  const [selectedNeuron, setSelectedNeuron] = useState<string | null>(null);

  const neurons = {
    input: ['input1', 'input2', 'input3'],
    hidden: ['hidden1', 'hidden2'],
    output: ['output1']
  };

  const handleNeuronClick = (neuronId: string) => {
    if (!selectedNeuron) {
      setSelectedNeuron(neuronId);
    } else {
      if (selectedNeuron !== neuronId) {
        const connection = `${selectedNeuron}-${neuronId}`;
        const reverseConnection = `${neuronId}-${selectedNeuron}`;
        
        if (!connections.includes(connection) && !connections.includes(reverseConnection)) {
          onConnectionMade(connection);
        }
      }
      setSelectedNeuron(null);
    }
  };

  const isConnected = (neuron1: string, neuron2: string) => {
    return connections.includes(`${neuron1}-${neuron2}`) || connections.includes(`${neuron2}-${neuron1}`);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Connect the Neurons!</h3>
        <p className="text-gray-600">Click two neurons to connect them. Make at least 3 connections!</p>
        <div className="mt-2">
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
            Connections: {connections.length}/3+
          </span>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-200">
        <div className="grid grid-cols-3 gap-8 items-center">
          {/* Input Layer */}
          <div className="text-center">
            <h4 className="font-bold text-purple-700 mb-4">Input Layer</h4>
            <div className="space-y-4">
              {neurons.input.map((neuron) => (
                <button
                  key={neuron}
                  onClick={() => handleNeuronClick(neuron)}
                  className={`w-16 h-16 rounded-full border-4 transition-all hover:scale-110 ${
                    selectedNeuron === neuron
                      ? 'bg-yellow-400 border-yellow-600 animate-pulse'
                      : 'bg-blue-400 border-blue-600 hover:bg-blue-500'
                  }`}
                >
                  <div className="text-white font-bold">🔵</div>
                </button>
              ))}
            </div>
          </div>

          {/* Hidden Layer */}
          <div className="text-center">
            <h4 className="font-bold text-purple-700 mb-4">Hidden Layer</h4>
            <div className="space-y-4">
              {neurons.hidden.map((neuron) => (
                <button
                  key={neuron}
                  onClick={() => handleNeuronClick(neuron)}
                  className={`w-16 h-16 rounded-full border-4 transition-all hover:scale-110 ${
                    selectedNeuron === neuron
                      ? 'bg-yellow-400 border-yellow-600 animate-pulse'
                      : 'bg-green-400 border-green-600 hover:bg-green-500'
                  }`}
                >
                  <div className="text-white font-bold">🟢</div>
                </button>
              ))}
            </div>
          </div>

          {/* Output Layer */}
          <div className="text-center">
            <h4 className="font-bold text-purple-700 mb-4">Output Layer</h4>
            <div className="space-y-4">
              {neurons.output.map((neuron) => (
                <button
                  key={neuron}
                  onClick={() => handleNeuronClick(neuron)}
                  className={`w-16 h-16 rounded-full border-4 transition-all hover:scale-110 ${
                    selectedNeuron === neuron
                      ? 'bg-yellow-400 border-yellow-600 animate-pulse'
                      : 'bg-red-400 border-red-600 hover:bg-red-500'
                  }`}
                >
                  <div className="text-white font-bold">🔴</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Connection Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
          {connections.map((connection, index) => (
            <line
              key={index}
              x1="25%"
              y1="50%"
              x2="75%"
              y2="50%"
              stroke="#8B5CF6"
              strokeWidth="3"
              strokeDasharray="5,5"
              className="animate-pulse"
            />
          ))}
        </svg>
      </div>

      {connections.length > 0 && (
        <div className="bg-green-50 rounded-2xl p-4 border-2 border-green-200">
          <h4 className="font-bold text-green-700 mb-2">Great work! 🎉</h4>
          <p className="text-green-600">
            You've created {connections.length} neural connections! This is how AI learns - by strengthening connections between neurons.
          </p>
        </div>
      )}
    </div>
  );
};

export default NeuralNetworks;