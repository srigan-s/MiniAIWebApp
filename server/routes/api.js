import { Router } from 'express';
import authRouter from './auth.js';
import { findUserById, updateUserProgress } from '../models/users.js';
import { hasGeminiConfig, requestGeminiChatReply } from '../services/gemini.js';

const apiRouter = Router();

apiRouter.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'MiniAI API',
    timestamp: new Date().toISOString(),
  });
});

apiRouter.use('/auth', authRouter);

apiRouter.get('/chat/status', (_req, res) => {
  res.json({
    configured: hasGeminiConfig(),
  });
});

apiRouter.post('/chat/gemini', async (req, res) => {
  const { messages, systemPrompt } = req.body ?? {};

  if (!Array.isArray(messages) || typeof systemPrompt !== 'string' || !systemPrompt.trim()) {
    return res.status(400).json({ error: 'Chat payload is invalid.' });
  }

  if (!hasGeminiConfig()) {
    return res.status(503).json({ error: 'Gemini is not configured on the server.' });
  }

  const reply = await requestGeminiChatReply(messages, systemPrompt);
  return res.json({ reply });
});

apiRouter.patch('/users/:id/progress', async (req, res) => {
  const { id } = req.params;
  const { xp, level, badges, completedLessons, completedGames } = req.body ?? {};

  if (
    !Number.isFinite(xp) ||
    !Number.isFinite(level) ||
    !Array.isArray(badges) ||
    !Array.isArray(completedLessons) ||
    !Array.isArray(completedGames)
  ) {
    return res.status(400).json({ error: 'Progress payload is invalid.' });
  }

  const existingUser = await findUserById(id);
  if (!existingUser) {
    return res.status(404).json({ error: 'User not found.' });
  }

  const user = await updateUserProgress(id, {
    xp,
    level,
    badges,
    completedLessons,
    completedGames,
  });

  return res.json({ user });
});
apiRouter.get('/example', (_req, res) => {
  res.json({
    message: 'Future API endpoints can be added under server/routes/api.js or split into more route files.',
  });
});

export default apiRouter;
