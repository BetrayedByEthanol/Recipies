import type { Recipe, RecipePayload } from '@shared/types';

const BASE = '/api';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (res.status === 204) return undefined as T;

  const json = await res.json();

  if (!res.ok) {
    throw new Error((json as { error?: string }).error ?? `HTTP ${res.status}`);
  }

  return (json as { data: T }).data;
}

export const api = {
  getRecipes: (): Promise<Recipe[]> =>
    request('/recipes'),

  getRecipe: (id: number): Promise<Recipe> =>
    request(`/recipes/${id}`),

  createRecipe: (payload: RecipePayload): Promise<Recipe> =>
    request('/recipes', { method: 'POST', body: JSON.stringify(payload) }),

  updateRecipe: (id: number, payload: RecipePayload): Promise<Recipe> =>
    request(`/recipes/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),

  deleteRecipe: (id: number): Promise<void> =>
    request(`/recipes/${id}`, { method: 'DELETE' }),
};
