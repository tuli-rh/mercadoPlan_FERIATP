// Utilidad de carga JSON con fallback de rutas
async function tryFetch(path) {
    try {
        const r = await fetch(path, { cache: 'no-store' });
        if (!r.ok) throw new Error('HTTP ' + r.status);
        const txt = await r.text();
        // Si el archivo termina en .js pero contiene JSON, intenta parsear igual
        return JSON.parse(txt);
    } catch (e) {
        return null;
    }
}

async function loadJSONSmart(base) {
    // orden de prueba: raíz .json → /static/js .json → /static/js .js
    const a = await tryFetch(`${base}.json`);
    if (a) return a;
    const b = await tryFetch(`./static/js/${base}.json`);
    if (b) return b;
    const c = await tryFetch(`./static/js/${base}.js`);
    if (c) return c;
    throw new Error(`No se pudo cargar ${base} (intenté .json y /static/js)`);
}

async function loadBaseData() {
    const [products, stores] = await Promise.all([
        loadJSONSmart('productos'),
        loadJSONSmart('stores'),
    ]);
    return { products, stores };
}

async function loadAllData() {
    const { products, stores } = await loadBaseData();
    // intenta snapshot en raíz y en /static/js (json o js)
    const prices = await loadJSONSmart('prices_2025-08-15');
    return { products, stores, prices };
}

function clp(n) { return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(n || 0); }

function promoLabel(p) {
    if (!p) return '<span class="badge text-bg-secondary">—</span>';
    if (p.type === 'percent') return `<span class="badge text-bg-success">-${p.value}%</span>`;
    if (p.type === 'xforY') return `<span class="badge text-bg-info">${p.x}x${p.y}</span>`;
    return '<span class="badge text-bg-secondary">Promo</span>';
}

function applyPromo(item) {
    let price = item.price_clp;
    const p = item.promo;
    if (!p) return price;
    if (p.type === 'percent') return Math.round(price * (1 - (p.value / 100)));
    if (p.type === 'xforY' && p.x > p.y) return Math.round(price * (p.y / p.x));
    return price;
}

// Detecta la fecha del snapshot por el nombre del archivo
async function detectSnapshotDate() {
    // Busca "prices_YYYY-MM-DD"
    const m = '2025-08-15'; // puedes derivarlo si cambias el nombre
    return m;
}
