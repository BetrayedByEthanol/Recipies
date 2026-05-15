import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import type { Recipe, RecipePayload, Ingredient } from '@recipes/shared';

const DB_PATH = process.env.DB_PATH ?? path.join(__dirname, '../../data/recipes.db');
const SEEDS_PATH = path.join(__dirname, '../../../seeds/recipes.json');

// Ensure data directory exists
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

export const db = new Database(DB_PATH);

// ── Schema ────────────────────────────────────────────────────────────────────
db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS recipes (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    title            TEXT    NOT NULL,
    category         TEXT    NOT NULL,
    emoji            TEXT    NOT NULL DEFAULT '🍽️',
    duration_minutes INTEGER NOT NULL DEFAULT 30,
    servings         INTEGER NOT NULL DEFAULT 4,
    image_url        TEXT,
    ingredients      TEXT    NOT NULL DEFAULT '[]',
    steps            TEXT    NOT NULL DEFAULT '[]',
    created_at       TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    updated_at       TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
  );

  CREATE TRIGGER IF NOT EXISTS recipes_updated_at
  AFTER UPDATE ON recipes
  BEGIN
    UPDATE recipes SET updated_at = strftime('%Y-%m-%dT%H:%M:%SZ', 'now')
    WHERE id = NEW.id;
  END;
`);

// ── Seed ──────────────────────────────────────────────────────────────────────
const count = (db.prepare('SELECT COUNT(*) as n FROM recipes').get() as { n: number }).n;

if (count === 0 && fs.existsSync(SEEDS_PATH)) {
  const seeds: RecipePayload[] = JSON.parse(fs.readFileSync(SEEDS_PATH, 'utf8'));
  const insert = db.prepare(`
    INSERT INTO recipes (title, category, emoji, duration_minutes, servings, image_url, ingredients, steps)
    VALUES (@title, @category, @emoji, @duration_minutes, @servings, @image_url, @ingredients, @steps)
  `);
  const insertMany = db.transaction((rows: RecipePayload[]) => {
    for (const r of rows) {
      insert.run({
        ...r,
        emoji: r.emoji ?? '🍽️',
        image_url: r.image_url ?? null,
        ingredients: JSON.stringify(r.ingredients),
        steps: JSON.stringify(r.steps),
      });
    }
  });
  insertMany(seeds);
  console.log(`Seeded ${seeds.length} recipes.`);
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function parseRow(row: Record<string, unknown>): Recipe {
  return {
    ...(row as Omit<Recipe, 'ingredients' | 'steps'>),
    ingredients: JSON.parse(row.ingredients as string) as Ingredient[],
    steps: JSON.parse(row.steps as string) as string[],
  };
}

// ── Queries ───────────────────────────────────────────────────────────────────
export function getAllRecipes(): Recipe[] {
  const rows = db.prepare('SELECT * FROM recipes ORDER BY created_at DESC').all();
  return (rows as Record<string, unknown>[]).map(parseRow);
}

export function getRecipeById(id: number): Recipe | undefined {
  const row = db.prepare('SELECT * FROM recipes WHERE id = ?').get(id);
  return row ? parseRow(row as Record<string, unknown>) : undefined;
}

export function createRecipe(payload: RecipePayload): Recipe {
  const result = db.prepare(`
    INSERT INTO recipes (title, category, emoji, duration_minutes, servings, image_url, ingredients, steps)
    VALUES (@title, @category, @emoji, @duration_minutes, @servings, @image_url, @ingredients, @steps)
  `).run({
    ...payload,
    emoji: payload.emoji ?? '🍽️',
    image_url: payload.image_url ?? null,
    ingredients: JSON.stringify(payload.ingredients),
    steps: JSON.stringify(payload.steps),
  });
  return getRecipeById(result.lastInsertRowid as number)!;
}

export function updateRecipe(id: number, payload: RecipePayload): Recipe | undefined {
  db.prepare(`
    UPDATE recipes SET
      title = @title,
      category = @category,
      emoji = @emoji,
      duration_minutes = @duration_minutes,
      servings = @servings,
      image_url = @image_url,
      ingredients = @ingredients,
      steps = @steps
    WHERE id = @id
  `).run({
    ...payload,
    id,
    emoji: payload.emoji ?? '🍽️',
    image_url: payload.image_url ?? null,
    ingredients: JSON.stringify(payload.ingredients),
    steps: JSON.stringify(payload.steps),
  });
  return getRecipeById(id);
}

export function deleteRecipe(id: number): boolean {
  const result = db.prepare('DELETE FROM recipes WHERE id = ?').run(id);
  return result.changes > 0;
}
