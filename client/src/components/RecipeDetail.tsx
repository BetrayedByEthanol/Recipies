import { useEffect } from 'react';
import type { Recipe } from '@recipes/shared';

interface Props {
  recipe: Recipe;
  onClose: () => void;
  onEdit: (recipe: Recipe) => void;
  onDelete: (id: number) => void;
}

function formatDuration(min: number): string {
  if (min < 60) return `${min} Min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h} Std ${m} Min` : `${h} Std`;
}

export function RecipeDetail({ recipe, onClose, onEdit, onDelete }: Props) {
  // ESC to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleDelete = () => {
    if (window.confirm('Rezept wirklich löschen?')) {
      onDelete(recipe.id);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={recipe.title}
    >
      <div className="bg-parchment w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-2xl shadow-2xl overscroll-contain animate-slide-up">
        {/* Drag handle */}
        <div className="w-10 h-1 bg-parchment-dark rounded-full mx-auto mt-3" />

        {/* Image */}
        {recipe.image_url ? (
          <img src={recipe.image_url} alt={recipe.title} className="w-full h-56 object-cover" />
        ) : (
          <div className="w-full h-48 bg-parchment-dark flex items-center justify-center text-7xl">
            {recipe.emoji}
          </div>
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow text-ink text-lg leading-none"
          aria-label="Schließen"
        >
          ✕
        </button>

        <div className="p-6 pb-10">
          <p className="font-hand text-sage text-base mb-1">{recipe.category}</p>
          <h2 className="font-display text-3xl font-bold mb-3 leading-tight">{recipe.title}</h2>

          <div className="flex flex-wrap gap-4 text-sm text-ink-light font-body mb-6 pb-5 border-b-2 border-dashed border-parchment-dark">
            <span>⏱ {formatDuration(recipe.duration_minutes)}</span>
            <span>👤 {recipe.servings} Portionen</span>
            <span>🥕 {recipe.ingredients.length} Zutaten</span>
          </div>

          {/* Ingredients */}
          <h3 className="font-display text-xl font-semibold text-terracotta mb-3 flex items-center gap-2">
            🥕 Zutaten
          </h3>
          <ul className="space-y-2 mb-6">
            {recipe.ingredients.map((ing, i) => (
              <li key={i} className="flex items-baseline gap-3 bg-sage-bg border-l-4 border-sage rounded-lg px-4 py-2.5 text-sm">
                <span className="font-hand text-sage font-semibold min-w-[90px] shrink-0">
                  {ing.amount} {ing.unit}
                </span>
                <span className="font-body">{ing.name}</span>
              </li>
            ))}
          </ul>

          {/* Steps */}
          <h3 className="font-display text-xl font-semibold text-terracotta mb-3 flex items-center gap-2">
            👩‍🍳 Zubereitung
          </h3>
          <ol className="space-y-4 mb-8">
            {recipe.steps.map((step, i) => (
              <li key={i} className="flex gap-4 items-start">
                <span className="shrink-0 w-8 h-8 bg-terracotta text-white rounded-full flex items-center justify-center font-display font-bold text-sm">
                  {i + 1}
                </span>
                <p className="font-body leading-relaxed pt-1 text-[0.97rem]">{step}</p>
              </li>
            ))}
          </ol>

          {/* Actions */}
          <div className="flex gap-3 flex-wrap pt-5 border-t border-parchment-dark">
            <button
              onClick={() => { onClose(); onEdit(recipe); }}
              className="flex items-center gap-2 px-5 py-3 bg-sage text-white rounded-xl font-body text-sm font-medium shadow-md shadow-sage/30 hover:bg-sage-light active:scale-95 transition-all"
            >
              ✏️ Bearbeiten
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-5 py-3 bg-red-50 text-red-600 border border-red-200 rounded-xl font-body text-sm font-medium hover:bg-red-100 active:scale-95 transition-all"
            >
              🗑 Löschen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
