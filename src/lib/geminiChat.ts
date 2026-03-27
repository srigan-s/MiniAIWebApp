import { games, lessons } from '../data/learningContent';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

type ChatRole = 'user' | 'assistant';

interface RequestMessage {
  role: ChatRole;
  text: string;
}

interface GeminiChatContext {
  currentActivitySummary: string;
  progressSummary: string;
  recommendation: string;
}

type ChatStatusResponse = {
  configured: boolean;
};

type ChatReplyResponse = {
  reply: string;
};

const buildSystemPrompt = (context: GeminiChatContext) => {
  const lessonGuide = lessons
    .map((lesson) => `${lesson.title}: ${lesson.helperSummary}`)
    .join('\n');
  const gameGuide = games
    .map((game) => `${game.title}: ${game.helperSummary}`)
    .join('\n');

  return `You are MiniAI Helper, a friendly educational chatbot for children ages 6 to 12.
Use short, clear language.
Be encouraging without sounding childish.
Stay focused on AI education, the user's progress, and the activities available inside the app.
If the user asks something unrelated or unsafe, gently redirect back to the learning app.
Do not claim to perform actions you cannot perform.

User progress:
${context.progressSummary}

Recommendation:
${context.recommendation}

Current activity:
${context.currentActivitySummary}

Lessons:
${lessonGuide}

Games:
${gameGuide}`;
};

const parseError = async (response: Response) => {
  const data = (await response.json().catch(() => null)) as { error?: string } | null;
  return data?.error || 'Gemini request failed.';
};

export const hasGeminiConfig = async () => {
  const response = await fetch(`${API_BASE_URL}/chat/status`);

  if (!response.ok) {
    return false;
  }

  const data = (await response.json()) as ChatStatusResponse;
  return data.configured;
};

export const requestGeminiChatReply = async (
  messages: RequestMessage[],
  context: GeminiChatContext
) => {
  const response = await fetch(`${API_BASE_URL}/chat/gemini`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages,
      systemPrompt: buildSystemPrompt(context),
    }),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  const data = (await response.json()) as ChatReplyResponse;
  return data.reply || 'I could not generate a response right now.';
};
