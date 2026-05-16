import { Router, Request, Response } from 'express';
import { getAllRecipes, getRecipeById, createRecipe, updateRecipe, deleteRecipe } from '../db/database';
import { recipePayloadSchema } from './validation';
import { requireAdminToken } from '../middleware/auth';
import type { RecipePayload } from '@recipes/shared';

export const recipeRouter = Router();

// GET /recipes
recipeRouter.get('/', (_req: Request, res: Response) => {
  const data = getAllRecipes();
  res.json({ data });
});

// GET /recipes/:id
recipeRouter.get('/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return void res.status(400).json({ error: 'Ungültige ID' });

  const recipe = getRecipeById(id);
  if (!recipe) return void res.status(404).json({ error: 'Rezept nicht gefunden' });

  res.json({ data: recipe });
});

// POST /recipes
recipeRouter.post('/', requireAdminToken, (req: Request, res: Response) => {
  const parsed = recipePayloadSchema.safeParse(req.body);
  if (!parsed.success) {
    return void res.status(422).json({ error: parsed.error.flatten() });
  }
  const recipe = createRecipe(parsed.data as RecipePayload);
  res.status(201).json({ data: recipe });
});

// PUT /recipes/:id
recipeRouter.put('/:id', requireAdminToken, (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return void res.status(400).json({ error: 'Ungültige ID' });

  const parsed = recipePayloadSchema.safeParse(req.body);
  if (!parsed.success) {
    return void res.status(422).json({ error: parsed.error.flatten() });
  }

  const recipe = updateRecipe(id, parsed.data as RecipePayload);
  if (!recipe) return void res.status(404).json({ error: 'Rezept nicht gefunden' });

  res.json({ data: recipe });
});

// DELETE /recipes/:id
recipeRouter.delete('/:id', requireAdminToken, (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return void res.status(400).json({ error: 'Ungültige ID' });

  const ok = deleteRecipe(id);
  if (!ok) return void res.status(404).json({ error: 'Rezept nicht gefunden' });

  res.status(204).send();
});
