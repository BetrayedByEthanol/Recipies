import { useState, useMemo } from 'react';
import { clearAdminToken, getAdminToken, setAdminToken } from './lib/adminToken';
import { useRecipes } from './hooks/useRecipes';
import { RecipeCard } from './components/RecipeCard';
import { RecipeDetail } from './components/RecipeDetail';
import { RecipeForm } from './components/RecipeForm';
import type { Recipe, Category } from '@recipes/shared';
import { CATEGORIES } from '@recipes/shared';

type Modal =
  | { kind: 'none' }
  | { kind: 'detail'; recipe: Recipe }
  | { kind: 'form'; initial?: Recipe };

export default function App() {
  const { recipes, loading, error, create, update, remove } = useRecipes();
  const [modal,     setModal]     = useState<Modal>({ kind: 'none' });
  const [search,    setSearch]    = useState('');
  const [category,  setCategory]  = useState<'Alle' | Category>('Alle');
  const [toastMsg,  setToastMsg]  = useState('');
  const [toastShow, setToastShow] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [tokenInput, setTokenInput] = useState(getAdminToken() ?? '');

  const toast = (msg: string) => {
    setToastMsg(msg);
    setToastShow(true);
    setTimeout(() => setToastShow(false), 2800);
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return recipes.filter(r => {
      const matchCat = category === 'Alle' || r.category === category;
      const matchQ   = !q
        || r.title.toLowerCase().includes(q)
        || r.category.toLowerCase().includes(q)
        || r.ingredients.some(i => i.name.toLowerCase().includes(q));
      return matchCat && matchQ;
    });
  }, [recipes, search, category]);

  return (
    <div className="min-h-screen bg-parchment font-body">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-sage shadow-md shadow-ink/10">
        <div className="max-w-4xl mx-auto px-4 flex items-center gap-3 h-16">
          <h1 className="font-display text-2xl font-bold text-white tracking-wide">
            Rezepte <span className="italic font-normal text-green-200">App</span>
          </h1>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => {
                setTokenInput(getAdminToken() ?? '');
                setSettingsOpen(true);
              }}
              className="w-10 h-10 border-2 border-white/40 text-white rounded-xl text-lg hover:bg-white/15 active:scale-95 transition-all"
              aria-label="Admin-Token Einstellungen"
              title="Admin-Token"
            >
              ⚙️
            </button>
            <button
              onClick={() => setModal({ kind: 'form' })}
              className="flex items-center gap-2 px-4 py-2 border-2 border-white/40 text-white rounded-xl text-sm font-body hover:bg-white/15 active:scale-95 transition-all"
            >
              <span className="text-lg leading-none">+</span> Rezept
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-4 pt-6 pb-20">
        {/* Search */}
        <div className="relative mb-3">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-light" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rezept oder Zutat suchen …"
            className="w-full pl-12 pr-10 py-3.5 font-body bg-white border-2 border-parchment-dark rounded-xl focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/15 transition-colors shadow-sm"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-light hover:text-ink transition-colors"
              aria-label="Suche leeren"
            >✕</button>
          )}
        </div>

        {/* Category chips */}
        <div className="flex flex-wrap gap-2 mb-5" role="group" aria-label="Kategorien">
          {(['Alle', ...CATEGORIES] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full border-2 text-sm font-body transition-all select-none ${
                category === cat
                  ? 'bg-sage border-sage text-white shadow-md shadow-sage/25'
                  : 'bg-white border-parchment-dark text-ink-light hover:border-sage-light hover:text-sage'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results info */}
        <p className="font-hand text-ink-light mb-4" aria-live="polite">
          {search || category !== 'Alle'
            ? `${filtered.length} von ${recipes.length} Rezepten`
            : `${recipes.length} Rezept${recipes.length !== 1 ? 'e' : ''}`
          }
        </p>

        {/* States */}
        {loading && (
          <div className="flex items-center justify-center py-20 text-ink-light font-body">
            <span className="text-2xl mr-3 animate-spin">⏳</span> Lade Rezepte …
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-5 font-body">
            <strong>Fehler:</strong> {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-ink-light">
                <p className="text-4xl mb-3">🔍</p>
                <h3 className="font-display text-xl mb-1">Kein Rezept gefunden</h3>
                <p className="font-body text-sm">Anderen Begriff oder Kategorie versuchen.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filtered.map((r, i) => (
                  <RecipeCard
                    key={r.id}
                    recipe={r}
                    onClick={recipe => setModal({ kind: 'detail', recipe })}
                    style={{ animationDelay: `${i * 35}ms` }}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Detail modal */}
      {modal.kind === 'detail' && (
        <RecipeDetail
          recipe={modal.recipe}
          onClose={() => setModal({ kind: 'none' })}
          onEdit={recipe => setModal({ kind: 'form', initial: recipe })}
          onDelete={async id => {
            await remove(id);
            toast('Rezept gelöscht');
          }}
        />
      )}

      {/* Add/Edit form modal */}
      {modal.kind === 'form' && (
        <RecipeForm
          initial={modal.initial}
          onClose={() => setModal({ kind: 'none' })}
          onSave={async payload => {
            if (modal.initial) {
              await update(modal.initial.id, payload);
              toast('Rezept aktualisiert ✓');
            } else {
              await create(payload);
              toast('Rezept gespeichert ✓');
            }
          }}
        />
      )}


      {settingsOpen && (
        <div
          className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm flex items-start justify-center p-4"
          onClick={e => { if (e.target === e.currentTarget) setSettingsOpen(false); }}
          role="dialog"
          aria-modal="true"
          aria-label="Admin-Token Einstellungen"
        >
          <div className="w-full max-w-sm mt-20 bg-parchment rounded-2xl shadow-2xl p-4 sm:p-5">
            <h2 className="font-display text-xl mb-2">Admin-Token</h2>
            <p className="text-sm text-ink-light mb-3">Wird nur für POST/PUT/DELETE API-Aufrufe genutzt.</p>
            <input
              type="password"
              value={tokenInput}
              onChange={e => setTokenInput(e.target.value)}
              placeholder="Bearer Token"
              className="w-full px-4 py-2.5 font-body bg-white border-2 border-parchment-dark rounded-xl focus:outline-none focus:border-sage"
            />
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  clearAdminToken();
                  setTokenInput('');
                }}
                className="px-3 py-2 rounded-lg border border-parchment-dark text-ink-light hover:text-ink"
              >
                Löschen
              </button>
              <button
                type="button"
                onClick={() => {
                  setAdminToken(tokenInput);
                  setSettingsOpen(false);
                  toast(tokenInput.trim() ? 'Admin-Token gespeichert' : 'Admin-Token entfernt');
                }}
                className="px-4 py-2 rounded-lg bg-sage text-white"
              >
                Speichern
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      <div
        role="status"
        aria-live="polite"
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 bg-ink text-white px-6 py-3 rounded-full font-body text-sm shadow-xl whitespace-nowrap transition-all duration-300 ${
          toastShow ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'
        }`}
      >
        {toastMsg}
      </div>
    </div>
  );
}
