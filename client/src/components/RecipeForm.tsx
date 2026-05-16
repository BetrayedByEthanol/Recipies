import { useState, useEffect } from 'react';
import type { Recipe, RecipePayload, Ingredient, Category } from '@recipes/shared';
import { CATEGORIES } from '@recipes/shared';

interface Props {
  initial?: Recipe;
  onSave: (payload: RecipePayload) => Promise<void>;
  onClose: () => void;
}

const emptyIngredient = (): Ingredient => ({ amount: '', unit: '', name: '' });

export function RecipeForm({ initial, onSave, onClose }: Props) {
  const [title,    setTitle]    = useState(initial?.title ?? '');
  const [category, setCategory] = useState<Category>(initial?.category ?? 'Sonstiges');
  const [emoji,    setEmoji]    = useState(initial?.emoji ?? '🍽️');
  const [duration, setDuration] = useState(initial?.duration_minutes ?? 30);
  const [servings, setServings] = useState(initial?.servings ?? 4);
  const [imageUrl, setImageUrl] = useState(initial?.image_url ?? '');
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    initial?.ingredients.length ? initial.ingredients : [emptyIngredient()]
  );
  const [steps, setSteps] = useState<string[]>(
    initial?.steps.length ? initial.steps : ['']
  );
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  // ESC to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const validate = (): boolean => {
    const errs: string[] = [];
    if (!title.trim()) errs.push('Rezeptname fehlt');
    if (ingredients.filter(i => i.name.trim()).length === 0) errs.push('Mindestens eine Zutat');
    if (steps.filter(s => s.trim()).length === 0) errs.push('Mindestens ein Schritt');
    setErrors(errs);
    return errs.length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave({
        title: title.trim(),
        category,
        emoji: emoji.trim() || '🍽️',
        duration_minutes: duration,
        servings,
        image_url: imageUrl.trim() || null,
        ingredients: ingredients.filter(i => i.name.trim()),
        steps: steps.filter(s => s.trim()),
      });
      onClose();
    } catch (e) {
      setErrors([e instanceof Error ? e.message : 'Speichern fehlgeschlagen']);
    } finally {
      setSaving(false);
    }
  };

  // Ingredient helpers
  const setIng = (idx: number, field: keyof Ingredient, val: string) =>
    setIngredients(prev => prev.map((r, i) => i === idx ? { ...r, [field]: val } : r));

  const addIng = () => setIngredients(prev => [...prev, emptyIngredient()]);

  const removeIng = (idx: number) =>
    setIngredients(prev => prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev);

  // Step helpers
  const setStep = (idx: number, val: string) =>
    setSteps(prev => prev.map((s, i) => i === idx ? val : s));

  const addStep = () => setSteps(prev => [...prev, '']);

  const removeStep = (idx: number) =>
    setSteps(prev => prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 backdrop-blur-sm p-2 sm:p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-parchment w-full max-w-2xl max-h-[92dvh] flex flex-col overflow-hidden rounded-t-2xl sm:rounded-2xl shadow-2xl overscroll-contain animate-slide-up">
        <div className="w-10 h-1 bg-parchment-dark rounded-full mx-auto mt-3" />

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-24">
          <h2 className="font-display text-2xl font-bold mb-6">
            {initial ? 'Rezept bearbeiten' : 'Neues Rezept'}
          </h2>

          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm space-y-1 font-body">
              {errors.map((e, i) => <p key={i}>• {e}</p>)}
            </div>
          )}

          {/* Title */}
          <div className="mb-4">
            <label className="block font-hand text-sage text-base font-semibold mb-1">Rezeptname *</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="z.B. Mamas Gulasch"
              className="w-full px-4 py-3 font-body bg-white border-2 border-parchment-dark rounded-xl focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/20 transition-colors"
            />
          </div>

          {/* Category + Emoji */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block font-hand text-sage text-base font-semibold mb-1">Kategorie</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as Category)}
                className="w-full px-4 py-3 font-body bg-white border-2 border-parchment-dark rounded-xl focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/20 transition-colors appearance-none"
              >
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-hand text-sage text-base font-semibold mb-1">Emoji</label>
              <input
                type="text"
                value={emoji}
                onChange={e => setEmoji(e.target.value)}
                placeholder="🍽️"
                maxLength={4}
                className="w-full px-4 py-3 font-body bg-white border-2 border-parchment-dark rounded-xl focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/20 transition-colors"
              />
            </div>
          </div>

          {/* Duration + Servings */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block font-hand text-sage text-base font-semibold mb-1">Dauer (Minuten)</label>
              <input
                type="number"
                value={duration}
                onChange={e => setDuration(Math.max(1, parseInt(e.target.value) || 1))}
                min={1}
                max={1440}
                className="w-full px-4 py-3 font-body bg-white border-2 border-parchment-dark rounded-xl focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/20 transition-colors"
              />
            </div>
            <div>
              <label className="block font-hand text-sage text-base font-semibold mb-1">Portionen</label>
              <input
                type="number"
                value={servings}
                onChange={e => setServings(Math.max(1, parseInt(e.target.value) || 1))}
                min={1}
                max={100}
                className="w-full px-4 py-3 font-body bg-white border-2 border-parchment-dark rounded-xl focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/20 transition-colors"
              />
            </div>
          </div>

          {/* Image URL */}
          <div className="mb-6">
            <label className="block font-hand text-sage text-base font-semibold mb-1">Bild-URL (optional)</label>
            <input
              type="url"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-3 font-body bg-white border-2 border-parchment-dark rounded-xl focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/20 transition-colors"
            />
          </div>

          {/* Ingredients */}
          <div className="mb-6">
            <label className="block font-hand text-sage text-base font-semibold mb-2">Zutaten *</label>
            <div className="space-y-2">
              {ingredients.map((ing, i) => (
                <div key={i} className="grid grid-cols-[90px_80px_1fr_36px] gap-2 items-center">
                  <input
                    type="text"
                    value={ing.amount}
                    onChange={e => setIng(i, 'amount', e.target.value)}
                    placeholder="Menge"
                    className="px-3 py-2 font-body text-sm bg-white border-2 border-parchment-dark rounded-lg focus:outline-none focus:border-sage transition-colors"
                  />
                  <input
                    type="text"
                    value={ing.unit}
                    onChange={e => setIng(i, 'unit', e.target.value)}
                    placeholder="Einheit"
                    className="px-3 py-2 font-body text-sm bg-white border-2 border-parchment-dark rounded-lg focus:outline-none focus:border-sage transition-colors"
                  />
                  <input
                    type="text"
                    value={ing.name}
                    onChange={e => setIng(i, 'name', e.target.value)}
                    placeholder="Zutat"
                    className="px-3 py-2 font-body text-sm bg-white border-2 border-parchment-dark rounded-lg focus:outline-none focus:border-sage transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => removeIng(i)}
                    className="w-9 h-9 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-sm hover:bg-red-100 transition-colors"
                    aria-label="Zutat entfernen"
                  >✕</button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addIng}
              className="w-full mt-2 py-2.5 border-2 border-dashed border-parchment-dark rounded-xl font-hand text-ink-light hover:border-sage hover:text-sage hover:bg-sage-bg transition-all"
            >
              + Zutat hinzufügen
            </button>
          </div>

          {/* Steps */}
          <div className="mb-6">
            <label className="block font-hand text-sage text-base font-semibold mb-2">Zubereitung *</label>
            <div className="space-y-2">
              {steps.map((step, i) => (
                <div key={i} className="grid grid-cols-[1fr_36px] gap-2 items-start">
                  <textarea
                    value={step}
                    onChange={e => setStep(i, e.target.value)}
                    placeholder={`Schritt ${i + 1} …`}
                    rows={2}
                    className="px-3 py-2 font-body text-sm bg-white border-2 border-parchment-dark rounded-lg focus:outline-none focus:border-sage transition-colors resize-y leading-relaxed"
                  />
                  <button
                    type="button"
                    onClick={() => removeStep(i)}
                    className="w-9 h-9 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-sm hover:bg-red-100 transition-colors mt-0.5"
                    aria-label="Schritt entfernen"
                  >✕</button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addStep}
              className="w-full mt-2 py-2.5 border-2 border-dashed border-parchment-dark rounded-xl font-hand text-ink-light hover:border-sage hover:text-sage hover:bg-sage-bg transition-all"
            >
              + Schritt hinzufügen
            </button>
          </div>

          {/* Actions */}
          <div className="sticky bottom-0 -mx-4 sm:-mx-6 mt-6 px-4 sm:px-6 pt-4 border-t border-parchment-dark bg-parchment pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex-1 py-3 bg-sage text-white rounded-xl font-body font-medium shadow-md shadow-sage/30 hover:bg-sage-light active:scale-95 transition-all disabled:opacity-60"
            >
              {saving ? 'Speichern …' : '💾 Speichern'}
            </button>
            <button
              onClick={onClose}
              disabled={saving}
              className="px-6 py-3 border-2 border-parchment-dark text-ink-light rounded-xl font-body font-medium hover:bg-parchment-dark transition-colors"
            >
              Abbrechen
            </button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
