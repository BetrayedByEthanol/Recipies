import { z } from 'zod';
import { CATEGORIES } from '@recipes/shared';

export const ingredientSchema = z.object({
  amount: z.string().min(1, 'Menge angeben'),
  unit:   z.string().min(1, 'Einheit angeben'),
  name:   z.string().min(1, 'Zutatenname angeben'),
});

export const recipePayloadSchema = z.object({
  title:            z.string().min(1).max(200),
  category:         z.enum(CATEGORIES as [string, ...string[]]),
  emoji:            z.string().max(8).optional(),
  duration_minutes: z.number().int().min(1).max(1440),
  servings:         z.number().int().min(1).max(100),
  image_url:        z.string().url().nullable().optional(),
  ingredients:      z.array(ingredientSchema).min(1),
  steps:            z.array(z.string().min(1)).min(1),
});

export type ValidatedPayload = z.infer<typeof recipePayloadSchema>;
