const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export const hasGeminiConfig = () => Boolean(GEMINI_API_KEY);

export const requestGeminiChatReply = async (messages, systemPrompt) => {
  if (!GEMINI_API_KEY) {
    throw new Error('Missing GEMINI_API_KEY');
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: messages.map((message) => ({
          role: message.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: message.text }],
        })),
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    try {
      const parsedError = JSON.parse(errorText);
      throw new Error(parsedError.error?.message || parsedError.error?.status || errorText);
    } catch {
      throw new Error(errorText || 'Gemini request failed');
    }
  }

  const data = await response.json();

  if (data.promptFeedback?.blockReason) {
    return 'I could not answer that request right now. Please try asking about AI lessons, games, or your progress.';
  }

  const outputText = data.candidates
    ?.flatMap((candidate) => candidate.content?.parts ?? [])
    .map((part) => part.text?.trim() || '')
    .filter(Boolean)
    .join('\n')
    .trim();

  return outputText || 'I could not generate a response right now.';
};
