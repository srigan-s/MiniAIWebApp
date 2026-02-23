import React, { useState } from 'react';
import { Brain, CheckCircle, ArrowRight } from 'lucide-react';

interface NeuralNetworkBuilderProps {
  onComplete: () => void;
}

const NeuralNetworkBuilder: React.FC<NeuralNetworkBuilderProps> = ({ onComplete }) => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [connections, setConnections] = useState<string[]>([]);
  const [trainedNetworks, setTrainedNetworks] = useState<number>(0);
  const [showResults, setShowResults] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const levels = [
    {
      id: 0,
      title: "Simple Pattern Recognition",
      description: "Build a network to recognize if a shape is a circle or square!",
      requiredConnections: 4,
      inputs: ['Shape Size', 'Roundness', 'Corners'],
      outputs: ['Circle', 'Square']
    },
    {
      id: 1,
      title: "Color Classification",
      description: "Create a network that can identify different colors!",
      requiredConnections: 6,
      inputs: ['Red Value', 'Green Value', 'Blue Value', 'Brightness'],
      outputs: ['Red', 'Blue', 'Green', 'Yellow']
    }
  ];

  const handleConnectionMade = () => {
    setConnections(prev => [...prev, `connection-${Date.now()}`]);
  };

  const handleTrainNetwork = () => {
    const level = levels[currentLevel];
    if (connections.length >= level.requiredConnections) {
      setTrainedNetworks(prev => prev + 1);
      
      if (currentLevel < levels.length - 1) {
        setTimeout(() => {
          setCurrentLevel(currentLevel + 1);
          setConnections([]);
        }, 2000);
      } else {
        setTimeout(() => {
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
        }, 2000);
      }
    }
  };

  if (showResults) {
    return (
      <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-green-200 text-center">
        <div className="text-6xl mb-4 animate-bounce">🧠</div>
        <h1 className="text-3xl font-bold text-green-700 mb-4">Neural Network Builder Complete!</h1>
        <p className="text-xl text-gray-600 mb-6">
          You built and trained {trainedNetworks} neural networks!
        </p>
        <div className="bg-green-100 rounded-2xl p-4">
          <p className="text-green-700 font-semibold">+60 XP Earned!</p>
        </div>
        <div className="bg-green-100 rounded-2xl p-4 mt-4">
          <p className="text-green-700 font-semibold">Redirecting in {countdown}...</p>
        </div>
      </div>
    );
  }

  const level = levels[currentLevel];
  const canTrain = connections.length >= level.requiredConnections;

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-purple-200">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <Brain className="w-8 h-8 text-purple-600" />
          <h1 className="text-2xl font-bold text-gray-800">Build a Neural Network</h1>
        </div>
        <div className="bg-purple-100 px-4 py-2 rounded-full">
          <span className="text-purple-700 font-semibold">
            Level {currentLevel + 1} of {levels.length}
          </span>
        </div>
      </div>

      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{level.title}</h2>
          <p className="text-lg text-gray-600">{level.description}</p>
          <div className="mt-4">
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
              Connections: {connections.length}/{level.requiredConnections}
            </span>
          </div>
        </div>

        <NetworkBuilder
          inputs={level.inputs}
          outputs={level.outputs}
          connections={connections}
          onConnectionMade={handleConnectionMade}
        />

        {canTrain && (
          <div className="text-center">
            <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-200 mb-6">
              <h3 className="text-lg font-bold text-green-700 mb-2">
                Network Ready! 🎉
              </h3>
              <p className="text-green-600">
                Your neural network has enough connections. Time to train it!
              </p>
            </div>
            
            <button
              onClick={handleTrainNetwork}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-bold text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 hover:scale-105 shadow-lg flex items-center space-x-2 mx-auto"
            >
              <span>Train Neural Network</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const NetworkBuilder: React.FC<{
  inputs: string[];
  outputs: string[];
  connections: string[];
  onConnectionMade: () => void;
}> = ({ inputs, outputs, connections, onConnectionMade }) => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [madeConnections, setMadeConnections] = useState<Set<string>>(new Set());

  const handleNodeClick = (nodeId: string) => {
    if (!selectedNode) {
      setSelectedNode(nodeId);
    } else {
      if (selectedNode !== nodeId) {
        const connectionKey = `${selectedNode}-${nodeId}`;
        const reverseKey = `${nodeId}-${selectedNode}`;
        
        if (!madeConnections.has(connectionKey) && !madeConnections.has(reverseKey)) {
          setMadeConnections(prev => new Set([...prev, connectionKey]));
          onConnectionMade();
        }
      }
      setSelectedNode(null);
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-200">
      <div className="grid grid-cols-3 gap-8 items-center min-h-80">
        {/* Input Layer */}
        <div className="text-center">
          <h4 className="font-bold text-purple-700 mb-4">Input Layer</h4>
          <div className="space-y-4">
            {inputs.map((input, index) => (
              <div key={`input-${index}`} className="space-y-2">
                <button
                  onClick={() => handleNodeClick(`input-${index}`)}
                  className={`w-16 h-16 rounded-full border-4 transition-all hover:scale-110 ${
                    selectedNode === `input-${index}`
                      ? 'bg-yellow-400 border-yellow-600 animate-pulse'
                      : 'bg-blue-400 border-blue-600 hover:bg-blue-500'
                  }`}
                >
                  <div className="text-white font-bold text-2xl">🔵</div>
                </button>
                <p className="text-xs font-medium text-gray-600">{input}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Hidden Layer */}
        <div className="text-center">
          <h4 className="font-bold text-purple-700 mb-4">Hidden Layer</h4>
          <div className="space-y-4">
            {[0, 1, 2].map((index) => (
              <button
                key={`hidden-${index}`}
                onClick={() => handleNodeClick(`hidden-${index}`)}
                className={`w-16 h-16 rounded-full border-4 transition-all hover:scale-110 ${
                  selectedNode === `hidden-${index}`
                    ? 'bg-yellow-400 border-yellow-600 animate-pulse'
                    : 'bg-green-400 border-green-600 hover:bg-green-500'
                }`}
              >
                <div className="text-white font-bold text-2xl">🟢</div>
              </button>
            ))}
          </div>
        </div>

        {/* Output Layer */}
        <div className="text-center">
          <h4 className="font-bold text-purple-700 mb-4">Output Layer</h4>
          <div className="space-y-4">
            {outputs.map((output, index) => (
              <div key={`output-${index}`} className="space-y-2">
                <button
                  onClick={() => handleNodeClick(`output-${index}`)}
                  className={`w-16 h-16 rounded-full border-4 transition-all hover:scale-110 ${
                    selectedNode === `output-${index}`
                      ? 'bg-yellow-400 border-yellow-600 animate-pulse'
                      : 'bg-red-400 border-red-600 hover:bg-red-500'
                  }`}
                >
                  <div className="text-white font-bold text-2xl">🔴</div>
                </button>
                <p className="text-xs font-medium text-gray-600">{output}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Connection visualization */}
      {connections.length > 0 && (
        <div className="mt-6 text-center">
          <div className="bg-white rounded-xl p-4 border-2 border-purple-200">
            <h5 className="font-bold text-purple-700 mb-2">Neural Connections Active! ⚡</h5>
            <div className="flex justify-center space-x-2">
              {connections.map((_, index) => (
                <div key={index} className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedNode && (
        <div className="mt-4 text-center">
          <p className="text-purple-600 font-medium">
            Selected: {selectedNode}. Click another node to connect! 🔗
          </p>
        </div>
      )}
    </div>
  );
};

export default NeuralNetworkBuilder;