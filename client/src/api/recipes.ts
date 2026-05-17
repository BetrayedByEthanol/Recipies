import type { Recipe, RecipePayload } from '@recipes/shared';
import { getAdminToken } from '../lib/adminToken';

const BASE = '/api';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((entry): entry is string => typeof entry === 'string');
}

function extractErrorMessage(body: unknown): string {
  if (!isRecord(body)) return String(body);

  if (typeof body.error === 'string') return body.error;

  // Zod flatten() returns { formErrors, fieldErrors } — make it readable
  if (isRecord(body.error)) {
    const formErrors = asStringArray(body.error.formErrors).join(', ');

    const fieldErrors = isRecord(body.error.fieldErrors)
      ? Object.entries(body.error.fieldErrors)
          .map(([key, value]) => {
            const messages = asStringArray(value);
            return messages.length > 0 ? `${key}: ${messages.join(', ')}` : '';
          })
          .filter(Boolean)
          .join('; ')
      : '';

    return [formErrors, fieldErrors].filter(Boolean).join(' — ') || 'Ungültige Eingabe';
  }

  return typeof body.status === 'number' ? `HTTP ${body.status}` : 'Ungültige Eingabe';
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  let res: Response;
  try {
    const token = getAdminToken();

    res = await fetch(`${BASE}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options?.headers,
      },
    });
  } catch {
    throw new Error('Keine Verbindung zum Server');
  }

  if (res.status === 204) return undefined as T;

  // Guard against empty or non-JSON bodies
  const text = await res.text();
  if (!text) {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return undefined as T;
  }

  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    throw new Error(res.ok ? 'Ungültige Serverantwort' : `HTTP ${res.status}`);
  }

  if (!res.ok) throw new Error(extractErrorMessage(body));

  return (body as { data: T }).data;
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
