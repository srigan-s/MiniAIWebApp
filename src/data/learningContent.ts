export const lessons = [
  {
    id: 1,
    title: 'What is AI?',
    description: 'Learn the basics of artificial intelligence with fun animations!',
    type: 'animation-quiz' as const,
    xpReward: 25,
    icon: '🧠',
    keywords: ['ai', 'artificial intelligence', 'what is ai', 'basics'],
    helperSummary:
      'AI is a computer system that learns patterns and uses them to make predictions, spot images, or answer questions.',
  },
  {
    id: 2,
    title: 'AI vs. Human Thinking',
    description: 'Discover the differences between how AI and humans think!',
    type: 'spot-difference' as const,
    xpReward: 30,
    icon: '🤔',
    keywords: ['human', 'thinking', 'ai vs human', 'difference'],
    helperSummary:
      'Humans use feelings, creativity, and life experience. AI is fast with patterns and data, but it does not think or feel like a person.',
  },
  {
    id: 3,
    title: 'AI in Real Life',
    description: 'Find AI examples all around us in this matching game!',
    type: 'matching' as const,
    xpReward: 35,
    icon: '🌟',
    keywords: ['real life', 'examples', 'everyday', 'around us'],
    helperSummary:
      'AI appears in voice assistants, recommendation systems, maps, photo filters, and tools that help people sort information.',
  },
  {
    id: 4,
    title: 'Neural Networks',
    description: 'Discover how AI learns like a brain with connected neurons!',
    type: 'animation-quiz' as const,
    xpReward: 45,
    icon: '🧬',
    keywords: ['neural', 'neural network', 'neurons', 'brain'],
    helperSummary:
      'A neural network is a set of connected layers that learns by adjusting many tiny weights until it gets better at a task.',
  },
  {
    id: 5,
    title: 'Computer Vision',
    description: 'Learn how AI can see and understand images!',
    type: 'spot-difference' as const,
    xpReward: 50,
    icon: '👁️',
    keywords: ['vision', 'computer vision', 'images', 'see'],
    helperSummary:
      'Computer vision helps AI find shapes, colors, and patterns in pictures so it can classify or describe what it sees.',
  },
  {
    id: 6,
    title: 'AI Bias & Fairness',
    description: 'Understand why AI needs to be fair for everyone!',
    type: 'matching' as const,
    xpReward: 55,
    icon: '⚖️',
    keywords: ['bias', 'fairness', 'fair', 'unfair'],
    helperSummary:
      'AI bias happens when training data or rules lead to unfair results. Fair AI checks for missing voices and uneven outcomes.',
  },
  {
    id: 7,
    title: 'Multimodal AI Adventure',
    description: 'Explore the many kinds of input AI can understand, like text, images, sound, and more!',
    type: 'animation-quiz' as const,
    xpReward: 60,
    icon: '🎒',
    keywords: ['multimodal', 'inputs', 'text image sound', 'different types of input'],
    helperSummary:
      'Multimodal AI can work with more than one kind of input, such as words, pictures, audio, video, or sensor signals, to better understand a task.',
  },
];

export const lessonSequence = [1, 5, 3, 4, 2, 6, 7];

export const games = [
  {
    id: 'robot-training',
    title: 'Train a Robot',
    description: 'Teach a virtual robot how to make decisions!',
    type: 'robot-training' as const,
    xpReward: 40,
    icon: '🤖',
    keywords: ['robot', 'train a robot', 'decisions'],
    helperSummary:
      'This game shows how AI improves when you give it examples and feedback.',
  },
  {
    id: 'data-sorting',
    title: 'Sort the Data',
    description: 'Help AI organize information in this puzzle game!',
    type: 'data-sorting' as const,
    xpReward: 35,
    icon: '📊',
    keywords: ['data', 'sorting', 'organize'],
    helperSummary:
      'Sorting data helps AI find patterns, because clean and organized examples are easier to learn from.',
  },
  {
    id: 'quiz-battle',
    title: 'AI Quiz Battle',
    description: 'Test your AI knowledge in this timed challenge!',
    type: 'quiz-battle' as const,
    xpReward: 50,
    icon: '⚡',
    keywords: ['quiz', 'battle', 'test knowledge'],
    helperSummary:
      'This game helps you review AI concepts quickly and spot what you already know well.',
  },
  {
    id: 'neural-network-builder',
    title: 'Build a Neural Network',
    description: 'Connect neurons to create your own AI brain!',
    type: 'neural-network-builder' as const,
    xpReward: 60,
    icon: '🔗',
    keywords: ['build', 'network', 'neural network builder'],
    helperSummary:
      'This activity turns neural networks into a hands-on puzzle so you can see how connected layers work together.',
  },
  {
    id: 'image-classifier',
    title: 'Image Classifier',
    description: 'Train AI to recognize different objects in pictures!',
    type: 'image-classifier' as const,
    xpReward: 55,
    icon: '🖼️',
    keywords: ['image', 'classifier', 'recognize pictures'],
    helperSummary:
      'This game shows how AI learns from example images and then predicts what new pictures contain.',
  },
  {
    id: 'bias-detector',
    title: 'Bias Detective',
    description: 'Find and fix unfair decisions in AI systems!',
    type: 'bias-detector' as const,
    xpReward: 65,
    icon: '🕵️',
    keywords: ['bias detective', 'detective', 'fairness'],
    helperSummary:
      'This game teaches you to notice when an AI system may be unfair and why balanced data matters.',
  },
  {
    id: 'language-lab',
    title: 'Language Lab',
    description: 'Help an AI sort words, spot sentence patterns, and understand simple syntax clues!',
    type: 'language-lab' as const,
    xpReward: 70,
    icon: '💬',
    keywords: ['language', 'nlp', 'words', 'syntax', 'sentence'],
    helperSummary:
      'This game introduces natural language processing by showing how AI looks at words, order, and sentence clues to understand language.',
  },
];

export const gameSequence = [
  'robot-training',
  'data-sorting',
  'quiz-battle',
  'neural-network-builder',
  'image-classifier',
  'bias-detector',
  'language-lab',
];

export const lessonMap = new Map(lessons.map((lesson) => [lesson.id, lesson]));
export const gameMap = new Map(games.map((game) => [game.id, game]));
