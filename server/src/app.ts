import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { recipeRouter } from './routes/recipes';

export function createApp(): express.Application {
  const app = express();
  const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ?? 'http://localhost:5173';

  app.use(helmet());
  app.use(cors({ origin: CLIENT_ORIGIN }));
  app.use(express.json({ limit: '100kb' }));

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));
  app.use('/api/recipes', recipeRouter);
  app.use((_req, res) => res.status(404).json({ error: 'Nicht gefunden' }));

  return app;
}
