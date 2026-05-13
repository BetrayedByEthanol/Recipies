'use strict';

// ── Default recipes ──────────────────────────────────────────────────────────
const DEFAULT_RECIPES = [
  {
    id: 'r1',
    title: 'Rindergulasch',
    category: 'Fleisch',
    emoji: '🥩',
    duration: 120,
    servings: 4,
    image: '',
    ingredients: [
      { amount: '800 g',   name: 'Rindfleisch (Schulter), gewürfelt' },
      { amount: '4',       name: 'Zwiebeln, fein gehackt' },
      { amount: '2 EL',    name: 'Paprikapulver (edelsüß)' },
      { amount: '1 TL',    name: 'Kümmel, gemahlen' },
      { amount: '2 EL',    name: 'Tomatenmark' },
      { amount: '400 ml',  name: 'Rinderbrühe' },
      { amount: '2 EL',    name: 'Butterschmalz' },
      { amount: 'nach Belieben', name: 'Salz & Pfeffer' }
    ],
    steps: [
      'Butterschmalz in einem schweren Topf erhitzen. Zwiebeln darin bei mittlerer Hitze goldbraun dünsten – das dauert 15–20 Minuten und ist das Geheimnis eines guten Gulaschs.',
      'Fleisch in Portionen rundherum kräftig anbraten, dann beiseitelegen.',
      'Topf vom Herd nehmen, Paprikapulver und Kümmel zu den Zwiebeln geben und kurz anschwitzen. Tomatenmark einrühren.',
      'Fleisch zurück in den Topf geben. Mit Brühe aufgießen und alles gut vermengen.',
      'Bei kleiner Hitze zugedeckt ca. 1,5 Stunden schmoren lassen, bis das Fleisch zart ist. Gelegentlich umrühren und bei Bedarf etwas Brühe nachgießen.',
      'Mit Salz und Pfeffer abschmecken. Mit Semmelknödeln oder Brötchen servieren.'
    ]
  },
  {
    id: 'r2',
    title: 'Apfelkuchen vom Blech',
    category: 'Backen',
    emoji: '🍎',
    duration: 75,
    servings: 12,
    image: '',
    ingredients: [
      { amount: '300 g',   name: 'Mehl' },
      { amount: '200 g',   name: 'Butter, zimmerwarm' },
      { amount: '150 g',   name: 'Zucker' },
      { amount: '3',       name: 'Eier' },
      { amount: '1 Pck.',  name: 'Backpulver' },
      { amount: '1 Prise', name: 'Salz' },
      { amount: '6',       name: 'Äpfel, geschält & in Scheiben' },
      { amount: '2 TL',    name: 'Zimtpulver' },
      { amount: '2 EL',    name: 'Zucker zum Bestreuen' }
    ],
    steps: [
      'Ofen auf 180 °C Ober-/Unterhitze vorheizen. Ein Backblech (ca. 30×40 cm) einfetten und bemehlen.',
      'Butter und Zucker cremig rühren. Eier einzeln unterrühren.',
      'Mehl, Backpulver und Salz mischen und unter die Buttermasse heben. Der Teig wird etwas zäh – das ist normal.',
      'Teig gleichmäßig auf dem Blech verteilen. Apfelscheiben fächerartig auflegen.',
      'Zimt und Zucker mischen und gleichmäßig über die Äpfel streuen.',
      'Im vorgeheizten Ofen 35–40 Minuten backen, bis der Kuchen goldbraun ist. Mit einem Zahnstocher prüfen – er soll sauber herauskommen.'
    ]
  },
  {
    id: 'r3',
    title: 'Kartoffelsuppe',
    category: 'Suppen',
    emoji: '🥣',
    duration: 45,
    servings: 6,
    image: '',
    ingredients: [
      { amount: '1 kg',    name: 'Kartoffeln, geschält & gewürfelt' },
      { amount: '2',       name: 'Möhren, in Scheiben' },
      { amount: '1',       name: 'Stange Lauch, in Ringe geschnitten' },
      { amount: '200 g',   name: 'Speck, gewürfelt' },
      { amount: '1,5 L',   name: 'Gemüsebrühe' },
      { amount: '150 ml',  name: 'Sahne' },
      { amount: '1',       name: 'Lorbeerblatt' },
      { amount: 'nach Belieben', name: 'Majoran, Salz & Pfeffer' }
    ],
    steps: [
      'Speck in einem großen Topf auslassen. Lauch und Möhren dazugeben und kurz andünsten.',
      'Kartoffeln hinzufügen, mit Brühe aufgießen. Lorbeerblatt einlegen.',
      'Alles ca. 20–25 Minuten bei mittlerer Hitze kochen, bis die Kartoffeln weich sind.',
      'Lorbeerblatt entfernen. Einen Teil der Suppe mit einem Stabmixer pürieren – nicht alles, die Suppe soll Stückchen haben.',
      'Sahne einrühren, mit Majoran, Salz und Pfeffer abschmecken. Heiß servieren.',
    ]
  },
  {
    id: 'r4',
    title: 'Semmelknödel',
    category: 'Beilagen',
    emoji: '🫓',
    duration: 50,
    servings: 4,
    image: '',
    ingredients: [
      { amount: '6',       name: 'altbackene Brötchen' },
      { amount: '250 ml',  name: 'lauwarme Milch' },
      { amount: '2',       name: 'Eier' },
      { amount: '1',       name: 'mittelgroße Zwiebel, fein gewürfelt' },
      { amount: '2 EL',    name: 'Butter' },
      { amount: '3 EL',    name: 'Petersilie, gehackt' },
      { amount: 'nach Belieben', name: 'Salz, Pfeffer, Muskatnuss' }
    ],
    steps: [
      'Brötchen in dünne Scheiben schneiden und in eine große Schüssel geben.',
      'Milch erwärmen (nicht kochen) und über die Brötchen gießen. 15 Minuten einweichen lassen.',
      'Zwiebel in Butter glasig dünsten. Zusammen mit Eiern, Petersilie, Salz, Pfeffer und Muskat zur Brötchenmasse geben.',
      'Alles gut vermengen. Wenn die Masse zu feucht ist, etwas Semmelbrösel zugeben.',
      'Mit nassen Händen gleichmäßige Knödel formen (ca. Tennisballgröße).',
      'In siedendem Salzwasser 20 Minuten bei mittlerer Hitze ziehen lassen. Nicht kochen, nur simmern!'
    ]
  },
  {
    id: 'r5',
    title: 'Käsespätzle',
    category: 'Vegetarisch',
    emoji: '🧀',
    duration: 40,
    servings: 4,
    image: '',
    ingredients: [
      { amount: '400 g',  name: 'Mehl' },
      { amount: '4',      name: 'Eier' },
      { amount: '200 ml', name: 'Wasser (lauwarm)' },
      { amount: '1 TL',   name: 'Salz' },
      { amount: '300 g',  name: 'Allgäuer Emmentaler, gerieben' },
      { amount: '3',      name: 'Zwiebeln, in Ringe geschnitten' },
      { amount: '3 EL',   name: 'Butter' },
      { amount: '1 TL',   name: 'Zucker' }
    ],
    steps: [
      'Mehl, Eier, Wasser und Salz zu einem glatten, zähen Teig schlagen. Der Teig soll Blasen werfen.',
      'Salzwasser zum Kochen bringen. Teig portionsweise durch ein Spätzlesieb oder -brett direkt ins kochende Wasser streichen.',
      'Spätzle herausnehmen, wenn sie oben schwimmen. In eine gebutterte ofenfeste Form schichten, dabei mit Käse abwechseln.',
      'Im Ofen bei 180 °C ca. 10 Minuten überbacken, bis der Käse schmilzt.',
      'Währenddessen Zwiebeln mit Butter und etwas Zucker in der Pfanne goldbraun karamellisieren.',
      'Röstzwiebeln über die heißen Käsespätzle geben und sofort servieren.'
    ]
  },
  {
    id: 'r6',
    title: 'Zwetschgendatschi',
    category: 'Backen',
    emoji: '🍑',
    duration: 80,
    servings: 16,
    image: '',
    ingredients: [
      { amount: '500 g',  name: 'Mehl' },
      { amount: '1 Pck.', name: 'Trockenhefe' },
      { amount: '80 g',   name: 'Zucker' },
      { amount: '80 g',   name: 'Butter, zimmerwarm' },
      { amount: '1',      name: 'Ei' },
      { amount: '250 ml', name: 'lauwarme Milch' },
      { amount: '1,5 kg', name: 'Zwetschgen, entsteinst & geviertelt' },
      { amount: '2 EL',   name: 'Zucker zum Bestreuen' },
      { amount: '1 TL',   name: 'Zimt' }
    ],
    steps: [
      'Hefe in lauwarmer Milch auflösen. Mehl, Zucker, Salz in eine Schüssel geben.',
      'Hefemilch, Butter und Ei zugeben. Alles zu einem glatten Hefeteig kneten. Zugedeckt an einem warmen Ort 45 Minuten gehen lassen.',
      'Teig auf einem gefetteten Backblech ausrollen/drücken.',
      'Zwetschgen dicht an dicht auf den Teig legen. Mit Zucker und Zimt bestreuen.',
      'Nochmals 15 Minuten ruhen lassen. Dann im vorgeheizten Ofen bei 190 °C ca. 35 Minuten backen.',
      'Noch warm mit Schlagsahne servieren – Pflicht!'
    ]
  }
];

const CATEGORIES = ['Alle', 'Fleisch', 'Backen', 'Suppen', 'Beilagen', 'Vegetarisch', 'Desserts', 'Sonstiges'];

// ── State ────────────────────────────────────────────────────────────────────
let recipes = [];
let activeCategory = 'Alle';
let searchTerm = '';
let editingId = null;

// ── Storage ──────────────────────────────────────────────────────────────────
function loadRecipes() {
  try {
    const stored = localStorage.getItem('omas-rezepte');
    if (stored) {
      recipes = JSON.parse(stored);
    } else {
      recipes = DEFAULT_RECIPES.map(r => ({ ...r }));
      saveRecipes();
    }
  } catch {
    recipes = DEFAULT_RECIPES.map(r => ({ ...r }));
  }
}

function saveRecipes() {
  try {
    localStorage.setItem('omas-rezepte', JSON.stringify(recipes));
  } catch (e) {
    console.warn('Speichern fehlgeschlagen:', e);
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function uid() {
  return 'r' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function formatDuration(min) {
  if (min < 60) return `${min} Min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h} Std ${m} Min` : `${h} Std`;
}

function filtered() {
  return recipes.filter(r => {
    const matchCat = activeCategory === 'Alle' || r.category === activeCategory;
    const q = searchTerm.toLowerCase();
    const matchSearch = !q ||
      r.title.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q) ||
      r.ingredients.some(i => i.name.toLowerCase().includes(q));
    return matchCat && matchSearch;
  });
}

// ── Render grid ──────────────────────────────────────────────────────────────
function renderGrid() {
  const list = filtered();
  const grid = document.getElementById('grid');
  const info = document.getElementById('results-info');

  const total = recipes.length;
  const shown = list.length;
  if (searchTerm || activeCategory !== 'Alle') {
    info.textContent = `${shown} von ${total} Rezept${total !== 1 ? 'en' : ''} gefunden`;
  } else {
    info.textContent = `${total} Rezept${total !== 1 ? 'e' : ''}`;
  }

  if (list.length === 0) {
    grid.innerHTML = `
      <div class="empty">
        <div class="empty-icon">🔍</div>
        <h3>Kein Rezept gefunden</h3>
        <p>Versuche einen anderen Suchbegriff oder eine andere Kategorie.</p>
      </div>`;
    return;
  }

  grid.innerHTML = list.map((r, i) => `
    <article class="card" style="animation-delay:${i * 40}ms" data-id="${r.id}" role="button" tabindex="0" aria-label="${r.title} öffnen">
      ${r.image
        ? `<img class="card-img" src="${escHtml(r.image)}" alt="${escHtml(r.title)}" loading="lazy">`
        : `<div class="card-img-placeholder" aria-hidden="true">${r.emoji || '🍽️'}</div>`
      }
      <div class="card-body">
        <span class="card-tag">${escHtml(r.category)}</span>
        <h2 class="card-title">${escHtml(r.title)}</h2>
        <div class="card-meta">
          <span>⏱ ${formatDuration(r.duration)}</span>
          <span>👤 ${r.servings} Portionen</span>
        </div>
      </div>
    </article>
  `).join('');

  grid.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => openRecipe(card.dataset.id));
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openRecipe(card.dataset.id); });
  });
}

function escHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Filter chips ─────────────────────────────────────────────────────────────
function renderChips() {
  const wrap = document.getElementById('chips');
  wrap.innerHTML = CATEGORIES.map(cat => `
    <button class="chip${cat === activeCategory ? ' active' : ''}" data-cat="${escHtml(cat)}">${escHtml(cat)}</button>
  `).join('');
  wrap.querySelectorAll('.chip').forEach(btn => {
    btn.addEventListener('click', () => {
      activeCategory = btn.dataset.cat;
      renderChips();
      renderGrid();
    });
  });
}

// ── Recipe detail modal ───────────────────────────────────────────────────────
function openRecipe(id) {
  const r = recipes.find(x => x.id === id);
  if (!r) return;

  const overlay = document.getElementById('detail-overlay');
  const body    = document.getElementById('detail-body');

  body.innerHTML = `
    <div class="modal-drag-handle"></div>
    ${r.image
      ? `<img class="modal-img" src="${escHtml(r.image)}" alt="${escHtml(r.title)}">`
      : `<div class="modal-img-placeholder">${r.emoji || '🍽️'}</div>`
    }
    <button class="modal-close" id="detail-close" aria-label="Schließen">✕</button>
    <div class="modal-content">
      <div class="modal-category">${escHtml(r.category)}</div>
      <h2 class="modal-title">${escHtml(r.title)}</h2>
      <div class="modal-meta">
        <span>⏱ ${formatDuration(r.duration)}</span>
        <span>👤 ${r.servings} Portionen</span>
        <span>${r.ingredients.length} Zutaten</span>
      </div>

      <h3 class="section-title">🥕 Zutaten</h3>
      <ul class="ingredients-list">
        ${r.ingredients.map(i => `
          <li>
            <span class="ingredient-amount">${escHtml(i.amount)}</span>
            <span>${escHtml(i.name)}</span>
          </li>
        `).join('')}
      </ul>

      <h3 class="section-title">👩‍🍳 Zubereitung</h3>
      <ol class="steps-list">
        ${r.steps.map((s, n) => `
          <li class="step">
            <span class="step-num">${n + 1}</span>
            <p class="step-text">${escHtml(s)}</p>
          </li>
        `).join('')}
      </ol>

      <div style="display:flex;gap:12px;margin-top:32px;flex-wrap:wrap;">
        <button class="btn btn-primary" id="detail-edit">✏️ Bearbeiten</button>
        <button class="btn" style="background:#fee;color:#c44;border:none;" id="detail-delete">🗑 Löschen</button>
      </div>
    </div>
  `;

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  overlay.querySelector('#detail-close').onclick = closeDetail;
  overlay.querySelector('#detail-edit').onclick   = () => { closeDetail(); openAddModal(id); };
  overlay.querySelector('#detail-delete').onclick = () => deleteRecipe(id);
  overlay.onclick = e => { if (e.target === overlay) closeDetail(); };
}

function closeDetail() {
  document.getElementById('detail-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

function deleteRecipe(id) {
  if (!confirm('Rezept wirklich löschen?')) return;
  recipes = recipes.filter(r => r.id !== id);
  saveRecipes();
  closeDetail();
  renderGrid();
  toast('Rezept gelöscht');
}

// ── Add / Edit modal ──────────────────────────────────────────────────────────
function openAddModal(editId = null) {
  editingId = editId;
  const r = editId ? recipes.find(x => x.id === editId) : null;

  const overlay = document.getElementById('add-overlay');
  const body    = document.getElementById('add-body');

  const ingredientRows = (r ? r.ingredients : [{ amount: '', name: '' }])
    .map((i, idx) => ingredientRowHTML(idx, i.amount, i.name)).join('');

  const stepRows = (r ? r.steps : [''])
    .map((s, idx) => stepRowHTML(idx, s)).join('');

  body.innerHTML = `
    <div class="modal-drag-handle"></div>
    <div class="modal-content add-modal">
      <h2 class="add-title">${r ? 'Rezept bearbeiten' : 'Neues Rezept'}</h2>

      <div class="form-group">
        <label for="f-title">Rezeptname *</label>
        <input type="text" id="f-title" placeholder="z.B. Omas Gulasch" value="${escHtml(r?.title ?? '')}">
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="f-cat">Kategorie</label>
          <select id="f-cat">
            ${CATEGORIES.filter(c => c !== 'Alle').map(c =>
              `<option${r?.category === c ? ' selected' : ''}>${escHtml(c)}</option>`
            ).join('')}
          </select>
        </div>
        <div class="form-group">
          <label for="f-emoji">Emoji</label>
          <input type="text" id="f-emoji" placeholder="🍽️" maxlength="4" value="${escHtml(r?.emoji ?? '')}">
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="f-duration">Dauer (Minuten)</label>
          <input type="number" id="f-duration" min="1" max="1440" value="${r?.duration ?? 30}">
        </div>
        <div class="form-group">
          <label for="f-servings">Portionen</label>
          <input type="number" id="f-servings" min="1" max="100" value="${r?.servings ?? 4}">
        </div>
      </div>

      <div class="form-group">
        <label for="f-image">Bild-URL (optional)</label>
        <input type="url" id="f-image" placeholder="https://..." value="${escHtml(r?.image ?? '')}">
        <p class="form-hint">Direkt-Link zu einem Foto (jpg, png, webp)</p>
      </div>

      <div class="form-group">
        <label>Zutaten *</label>
        <div class="ingredient-rows" id="ingredient-rows">${ingredientRows}</div>
        <button type="button" class="btn-add-row" id="add-ingredient-row">+ Zutat hinzufügen</button>
      </div>

      <div class="form-group">
        <label>Zubereitung *</label>
        <div class="step-rows" id="step-rows">${stepRows}</div>
        <button type="button" class="btn-add-row" id="add-step-row">+ Schritt hinzufügen</button>
      </div>

      <div class="form-actions">
        <button class="btn btn-primary" id="save-recipe">💾 Speichern</button>
        <button class="btn btn-ghost" style="background:transparent;color:var(--ink-lt);border:2px solid var(--border);" id="cancel-add">Abbrechen</button>
      </div>
    </div>
  `;

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  document.getElementById('add-ingredient-row').onclick = () => {
    const rows = document.getElementById('ingredient-rows');
    const idx = rows.querySelectorAll('.ingredient-row').length;
    rows.insertAdjacentHTML('beforeend', ingredientRowHTML(idx, '', ''));
    bindRemoveButtons();
  };

  document.getElementById('add-step-row').onclick = () => {
    const rows = document.getElementById('step-rows');
    const idx = rows.querySelectorAll('.step-row').length;
    rows.insertAdjacentHTML('beforeend', stepRowHTML(idx, ''));
    bindRemoveButtons();
  };

  bindRemoveButtons();

  document.getElementById('save-recipe').onclick  = saveRecipe;
  document.getElementById('cancel-add').onclick   = closeAdd;
  overlay.onclick = e => { if (e.target === overlay) closeAdd(); };
}

function ingredientRowHTML(idx, amount, name) {
  return `
    <div class="ingredient-row">
      <input type="text" placeholder="Menge" value="${escHtml(amount)}" data-ing-amount="${idx}">
      <input type="text" placeholder="Zutat" value="${escHtml(name)}" data-ing-name="${idx}">
      <button type="button" class="btn-remove" data-remove>✕</button>
    </div>
  `;
}

function stepRowHTML(idx, text) {
  return `
    <div class="step-row">
      <textarea placeholder="Schritt ${idx + 1} beschreiben …" data-step="${idx}">${escHtml(text)}</textarea>
      <button type="button" class="btn-remove" data-remove>✕</button>
    </div>
  `;
}

function bindRemoveButtons() {
  document.querySelectorAll('[data-remove]').forEach(btn => {
    btn.onclick = () => {
      const row = btn.closest('.ingredient-row, .step-row');
      if (row) row.remove();
    };
  });
}

function closeAdd() {
  document.getElementById('add-overlay').classList.remove('open');
  document.body.style.overflow = '';
  editingId = null;
}

function saveRecipe() {
  const title = document.getElementById('f-title').value.trim();
  if (!title) { alert('Bitte einen Rezeptnamen eingeben.'); return; }

  const ingredients = Array.from(document.querySelectorAll('.ingredient-row')).map(row => ({
    amount: row.querySelector('[data-ing-amount]').value.trim(),
    name:   row.querySelector('[data-ing-name]').value.trim()
  })).filter(i => i.name);

  const steps = Array.from(document.querySelectorAll('[data-step]'))
    .map(t => t.value.trim())
    .filter(Boolean);

  if (ingredients.length === 0) { alert('Bitte mindestens eine Zutat angeben.'); return; }
  if (steps.length === 0)       { alert('Bitte mindestens einen Schritt angeben.'); return; }

  const rec = {
    id:          editingId || uid(),
    title,
    category:    document.getElementById('f-cat').value,
    emoji:       document.getElementById('f-emoji').value.trim() || '🍽️',
    duration:    parseInt(document.getElementById('f-duration').value) || 30,
    servings:    parseInt(document.getElementById('f-servings').value) || 4,
    image:       document.getElementById('f-image').value.trim(),
    ingredients,
    steps
  };

  if (editingId) {
    recipes = recipes.map(r => r.id === editingId ? rec : r);
  } else {
    recipes.unshift(rec);
  }

  saveRecipes();
  closeAdd();
  renderGrid();
  toast(editingId ? 'Rezept aktualisiert ✓' : 'Rezept gespeichert ✓');
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2800);
}

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadRecipes();

  // Search
  const searchEl = document.getElementById('search');
  searchEl.addEventListener('input', () => {
    searchTerm = searchEl.value;
    renderGrid();
  });

  // Clear search
  document.getElementById('search-clear').addEventListener('click', () => {
    searchEl.value = '';
    searchTerm = '';
    renderGrid();
    searchEl.focus();
  });

  // Add recipe button
  document.getElementById('btn-add').addEventListener('click', () => openAddModal());

  renderChips();
  renderGrid();
});

// ── Service Worker ────────────────────────────────────────────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}
