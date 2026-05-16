import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import type { Application } from 'express';

let app: Application;

beforeAll(async () => {
  process.env.DB_PATH = ':memory:';
  const mod = await import('../app');
  app = mod.createApp();
});

afterAll(() => {
  delete process.env.DB_PATH;
});

const validPayload = {
  title: 'Testrezept',
  category: 'Vegetarisch',
  emoji: '🥦',
  duration_minutes: 20,
  servings: 2,
  image_url: null,
  ingredients: [{ amount: '200', unit: 'g', name: 'Brokkoli' }],
  steps: ['Brokkoli dünsten.'],
};

describe('GET /health', () => {
  it('returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});

describe('GET /api/recipes', () => {
  it('returns an array', async () => {
    const res = await request(app).get('/api/recipes');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe('POST /api/recipes', () => {
  it('creates a recipe with valid payload', async () => {
    const res = await request(app).post('/api/recipes').send(validPayload);
    expect(res.status).toBe(201);
    expect(res.body.data.title).toBe('Testrezept');
    expect(typeof res.body.data.id).toBe('number');
  });

  it('rejects missing title with 422', async () => {
    const res = await request(app).post('/api/recipes').send({ title: '' });
    expect(res.status).toBe(422);
    expect(res.body).toHaveProperty('error');
  });

  it('rejects unknown category with 422', async () => {
    const res = await request(app)
      .post('/api/recipes')
      .send({ ...validPayload, category: 'INVALID' });
    expect(res.status).toBe(422);
  });
});

describe('PUT /api/recipes/:id', () => {
  it('returns 404 for missing recipe', async () => {
    const res = await request(app).put('/api/recipes/99999').send(validPayload);
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/recipes/:id', () => {
  it('returns 404 for missing recipe', async () => {
    const res = await request(app).delete('/api/recipes/99999');
    expect(res.status).toBe(404);
  });
});
