import type { Recipe, RecipePayload } from '@recipes/shared';

const BASE = '/api';

function extractErrorMessage(body: unknown): string {
  if (typeof body !== 'object' || body === null) return String(body);
  const b = body as Record<string, unknown>;
  if (typeof b.error === 'string') return b.error;
  // Zod flatten() returns { formErrors, fieldErrors } — make it readable
  if (typeof b.error === 'object' && b.error !== null) {
    const e = b.error as Record<string, unknown>;
    const fields = Object.entries(e.fieldErrors ?? {})
      .map(([k, v]) => `${k}: ${(v as string[]).join(', ')}`)
      .join('; ');
    const form = (e.formErrors as string[] | undefined)?.join(', ') ?? '';
    return [form, fields].filter(Boolean).join(' — ') || 'Ungültige Eingabe';
  }
  return `HTTP ${(body as { status?: number }).status ?? 'error'}`;
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE}${url}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
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
