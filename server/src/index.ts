import express from 'express';
import cors from 'cors';
import { recipeRouter } from './routes/recipes';

const app = express();
const PORT = parseInt(process.env.PORT ?? '3001', 10);
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ?? 'http://localhost:5173';

app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Routes
app.use('/api/recipes', recipeRouter);

// 404
app.use((_req, res) => res.status(404).json({ error: 'Nicht gefunden' }));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
