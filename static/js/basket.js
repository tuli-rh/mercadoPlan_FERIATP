// Si prefieres CERO storage, reemplaza localStorage por una variable global.
const KEY = 'mercaplan.basket';

function getBasket() { try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch { return [] } }
function setBasket(arr) { localStorage.setItem(KEY, JSON.stringify(arr)); }

function addToBasket(id) {
    const b = new Set(getBasket()); b.add(id); setBasket([...b]);
    toast('Agregado a tu canasta');
}

function removeFromBasket(id, reload = false) {
    const b = new Set(getBasket()); b.delete(id); setBasket([...b]);
    if (reload) location.reload();
}

function clearBasket() {
    setBasket([]);
    location.reload();
}

// Toast muy simple sin librerías
function toast(msg) {
    const el = document.createElement('div');
    el.className = 'toast-mini';
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.classList.add('show'), 10);
    setTimeout(() => {
        el.classList.remove('show');
        setTimeout(() => el.remove(), 200);
    }, 1600);
}
