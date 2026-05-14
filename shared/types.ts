export type Category =
  | 'Fleisch'
  | 'Geflügel'
  | 'Fisch'
  | 'Vegetarisch'
  | 'Vegan'
  | 'Suppen'
  | 'Beilagen'
  | 'Backen'
  | 'Desserts'
  | 'Sonstiges';

export const CATEGORIES: Category[] = [
  'Fleisch',
  'Geflügel',
  'Fisch',
  'Vegetarisch',
  'Vegan',
  'Suppen',
  'Beilagen',
  'Backen',
  'Desserts',
  'Sonstiges',
];

export interface Ingredient {
  amount: string;
  unit: string;
  name: string;
}

export interface Recipe {
  id: number;
  title: string;
  category: Category;
  emoji: string;
  duration_minutes: number;
  servings: number;
  image_url: string | null;
  ingredients: Ingredient[];
  steps: string[];
  created_at: string;
  updated_at: string;
}

// Shape accepted by POST /recipes and PUT /recipes/:id
export interface RecipePayload {
  title: string;
  category: Category;
  emoji?: string;
  duration_minutes: number;
  servings: number;
  image_url?: string | null;
  ingredients: Ingredient[];
  steps: string[];
}

export interface ApiResponse<T> {
  data: T;
}

export interface ApiError {
  error: string;
}
