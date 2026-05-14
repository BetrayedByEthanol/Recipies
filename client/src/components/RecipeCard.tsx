import type { Recipe } from '@shared/types';

interface Props {
  recipe: Recipe;
  onClick: (recipe: Recipe) => void;
  style?: React.CSSProperties;
}

function formatDuration(min: number): string {
  if (min < 60) return `${min} Min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h} Std ${m} Min` : `${h} Std`;
}

export function RecipeCard({ recipe, onClick, style }: Props) {
  return (
    <article
      className="bg-white border border-parchment-dark rounded-xl overflow-hidden cursor-pointer shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg active:scale-98 select-none"
      style={style}
      onClick={() => onClick(recipe)}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onClick(recipe)}
      tabIndex={0}
      role="button"
      aria-label={`${recipe.title} öffnen`}
    >
      {recipe.image_url ? (
        <img
          src={recipe.image_url}
          alt={recipe.title}
          className="w-full h-44 object-cover block"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-44 bg-parchment-dark flex items-center justify-center text-5xl" aria-hidden="true">
          {recipe.emoji}
        </div>
      )}

      <div className="p-4">
        <span className="inline-block font-hand text-sm text-sage bg-sage-bg px-3 py-0.5 rounded-full mb-2">
          {recipe.category}
        </span>
        <h2 className="font-display text-lg font-semibold leading-snug mb-2">
          {recipe.title}
        </h2>
        <div className="flex gap-4 text-sm text-ink-light font-body">
          <span>⏱ {formatDuration(recipe.duration_minutes)}</span>
          <span>👤 {recipe.servings} Port.</span>
        </div>
      </div>
    </article>
  );
}
