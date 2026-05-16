import { useState, useEffect, useCallback } from 'react';
import { api } from '../api/recipes';
import type { Recipe, RecipePayload } from '@recipes/shared';

interface UseRecipesReturn {
  recipes: Recipe[];
  loading: boolean;
  error: string | null;
  create: (payload: RecipePayload) => Promise<Recipe>;
  update: (id: number, payload: RecipePayload) => Promise<Recipe>;
  remove: (id: number) => Promise<void>;
  refresh: () => void;
}

export function useRecipes(): UseRecipesReturn {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getRecipes();
      setRecipes(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unbekannter Fehler');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const create = async (payload: RecipePayload) => {
    const recipe = await api.createRecipe(payload);
    setRecipes(prev => [recipe, ...prev]);
    return recipe;
  };

  const update = async (id: number, payload: RecipePayload) => {
    const recipe = await api.updateRecipe(id, payload);
    setRecipes(prev => prev.map(r => r.id === id ? recipe : r));
    return recipe;
  };

  const remove = async (id: number) => {
    await api.deleteRecipe(id);
    setRecipes(prev => prev.filter(r => r.id !== id));
  };

  return { recipes, loading, error, create, update, remove, refresh: load };
}
