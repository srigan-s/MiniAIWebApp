import express from 'express';
import cors from 'cors';
import apiRouter from './routes/api.js';
import { getDb } from './db.js';

const app = express();
const port = Number(process.env.PORT) || 3001;

app.use(cors());
app.use(express.json());

app.use('/api', apiRouter);

app.use((error, _req, res, _next) => {
  console.error('API error:', error);
  res.status(500).json({ error: 'Internal server error.' });
});

const startServer = async () => {
  await getDb();

  app.listen(port, () => {
    console.log(`MiniAI API listening on http://localhost:${port}`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
