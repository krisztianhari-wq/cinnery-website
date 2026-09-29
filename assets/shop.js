/* Cinnery – shop skeleton: menu cards, product page, cart (localStorage, first-party only) */
(function () {
  const P = window.CINNERY_PRODUCTS || [];
  const T = window.CINNERY_I18N || {};
  const KEY = 'cinnery-cart';
  const SCRIPT = document.currentScript && document.currentScript.src;
  const ROOT = SCRIPT ? new URL('..', SCRIPT) : new URL('./', location.href);
  const src = path => new URL(path, ROOT).href;

  const lang = () => document.documentElement.lang || 'en';
  const t = key => (T[lang()] && T[lang()][key]) || (T.en && T.en[key]) || key;
  const money = n => new Intl.NumberFormat(lang() === 'nl' ? 'nl-NL' : 'en-IE', { style: 'currency', currency: 'EUR' }).format(n);
  const byId = id => P.find(p => p.id === id);
  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };

  /* ---- cart storage ---- */
  function getCart() { try { const c = JSON.parse(localStorage.getItem(KEY) || '{}'); return typeof c === 'object' && c ? c : {}; } catch (e) { return {}; } }
  function setCart(c) { try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) {} updateBadge(); }
  function add(id, qty) { const c = getCart(); c[id] = Math.min(99, (c[id] || 0) + qty); setCart(c); }
  function setQty(id, qty) { const c = getCart(); if (qty <= 0) delete c[id]; else c[id] = Math.min(99, qty); setCart(c); }
  function count() { return Object.values(getCart()).reduce((a, b) => a + b, 0); }
  function updateBadge() {
    const n = count();
    document.querySelectorAll('.cart-count').forEach(b => { b.textContent = n; b.hidden = n === 0; });
  }

  /* ---- cart icon svg ---- */
  const CART_SVG = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6h15l-1.5 8.5H7.5z"/><path d="M6 6 5 3H2"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/></svg>';
  document.querySelectorAll('.cart-icon').forEach(e => { e.innerHTML = CART_SVG; });

  /* ---- product card ---- */
  function card(p, small) {
    const a = el('article', 'card' + (small ? ' card-sm' : '') + ' card-shop');
    const link = el('a', 'card-img-link'); link.href = 'product.html?id=' + encodeURIComponent(p.id);
    const img = el('img'); img.src = src(p.img); img.alt = p.name[lang()] || p.name.en; img.loading = 'lazy'; link.appendChild(img);
    a.appendChild(link);
    const body = el('div', 'card-body');
    body.appendChild(el('h3', null, p.name[lang()] || p.name.en));
    body.appendChild(el('p', null, p.desc[lang()] || p.desc.en));
    const row = el('div', 'card-row');
    row.appendChild(el('span', 'price', money(p.price)));
    const btn = el('a', 'btn btn-pink btn-sm', t('shop.order')); btn.href = 'product.html?id=' + encodeURIComponent(p.id);
    row.appendChild(btn); body.appendChild(row); a.appendChild(body);
    return a;
  }

  /* ---- index: render menu grids ---- */
  function renderMenus() {
    document.querySelectorAll('[data-products]').forEach(grid => {
      const cat = grid.getAttribute('data-products');
      grid.replaceChildren(...P.filter(p => p.cat === cat).map((p, i) => {
        const c = card(p, cat === 'cookie');
        if (cat === 'roll') { const n = el('span', 'num', String(i + 1).padStart(2, '0')); c.prepend(n); }
        return c;
      }));
    });
  }

  /* ---- product page ---- */
  function renderProduct() {
    const box = document.getElementById('product'); if (!box) return;
    const id = new URLSearchParams(location.search).get('id');
    const p = byId(id);
    if (!p) { box.replaceChildren(el('p', 'lead', t('shop.notfound'))); return; }
    document.title = 'Cinnery – ' + (p.name[lang()] || p.name.en);
    const fig = el('div', 'product-img'); const img = el('img'); img.src = src(p.img); img.alt = p.name[lang()] || p.name.en; fig.appendChild(img);
    const info = el('div', 'product-info');
    info.appendChild(el('p', 'eyebrow', t(p.cat === 'roll' ? 'menu.title' : 'menu.cookies.title')));
    info.appendChild(el('h1', null, p.name[lang()] || p.name.en));
    info.appendChild(el('p', 'lead', p.desc[lang()] || p.desc.en));
    info.appendChild(el('p', 'product-price', money(p.price)));
    const qtyRow = el('div', 'qty-row');
    qtyRow.appendChild(el('span', 'qty-label', t('shop.qty')));
    const stepper = el('div', 'stepper');
    const minus = el('button', null, '−'); minus.type = 'button'; minus.setAttribute('aria-label', '−');
    const input = el('input'); input.type = 'number'; input.min = '1'; input.max = '99'; input.value = '1'; input.inputMode = 'numeric';
    const plus = el('button', null, '+'); plus.type = 'button'; plus.setAttribute('aria-label', '+');
    const clamp = v => Math.max(1, Math.min(99, parseInt(v, 10) || 1));
    minus.addEventListener('click', () => { input.value = clamp(+input.value - 1); });
    plus.addEventListener('click', () => { input.value = clamp(+input.value + 1); });
    input.addEventListener('change', () => { input.value = clamp(input.value); });
    stepper.append(minus, input, plus); qtyRow.appendChild(stepper); info.appendChild(qtyRow);
    const actions = el('div', 'cta-row');
    const addBtn = el('button', 'btn btn-pink', t('shop.add')); addBtn.type = 'button';
    const cartBtn = el('a', 'btn btn-outline-dark', t('shop.cart')); cartBtn.href = 'cart.html';
    const note = el('p', 'added muted small'); note.hidden = true;
    addBtn.addEventListener('click', () => {
      add(p.id, clamp(input.value));
      note.textContent = t('shop.added') + ' · ' + count() + ' ' + (count() === 1 ? t('shop.item') : t('shop.items'));
      note.hidden = false;
    });
    actions.append(addBtn, cartBtn); info.appendChild(actions); info.appendChild(note);
    info.appendChild(el('p', 'muted small', t('shop.pickup.note')));
    box.replaceChildren(fig, info);

    const also = document.getElementById('also');
    if (also) also.replaceChildren(...P.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 3).map(x => card(x, false)));
  }

  /* ---- cart page ---- */
  function renderCart() {
    const box = document.getElementById('cart'); const sum = document.getElementById('summary'); if (!box || !sum) return;
    const c = getCart(); const ids = Object.keys(c).filter(byId);
    if (!ids.length) { box.replaceChildren(el('p', 'lead', t('shop.empty'))); sum.replaceChildren(); return; }
    let total = 0;
    const rows = ids.map(id => {
      const p = byId(id); const q = c[id]; const line = p.price * q; total += line;
      const r = el('div', 'cart-row');
      const img = el('img'); img.src = src(p.img); img.alt = ''; r.appendChild(img);
      const mid = el('div', 'cart-mid');
      const name = el('a', 'cart-name', p.name[lang()] || p.name.en); name.href = 'product.html?id=' + encodeURIComponent(p.id); mid.appendChild(name);
      mid.appendChild(el('span', 'muted small', money(p.price) + ' ' + t('shop.each')));
      const stepper = el('div', 'stepper stepper-sm');
      const minus = el('button', null, '−'); minus.type = 'button'; const plus = el('button', null, '+'); plus.type = 'button';
      const qv = el('span', 'qv', String(q));
      minus.addEventListener('click', () => { setQty(id, q - 1); renderCart(); });
      plus.addEventListener('click', () => { setQty(id, q + 1); renderCart(); });
      stepper.append(minus, qv, plus); mid.appendChild(stepper); r.appendChild(mid);
      const right = el('div', 'cart-right');
      right.appendChild(el('strong', null, money(line)));
      const rm = el('button', 'linkbtn', t('shop.remove')); rm.type = 'button'; rm.addEventListener('click', () => { setQty(id, 0); renderCart(); });
      right.appendChild(rm); r.appendChild(right);
      return r;
    });
    box.replaceChildren(...rows);

    const n = count();
    const box2 = el('div', 'summary-box');
    box2.appendChild(el('h2', null, t('shop.total')));
    const l1 = el('div', 'sum-row'); l1.append(el('span', null, n + ' ' + (n === 1 ? t('shop.item') : t('shop.items'))), el('span', null, money(total))); box2.appendChild(l1);
    const l2 = el('div', 'sum-row sum-total'); l2.append(el('strong', null, t('shop.total')), el('strong', null, money(total))); box2.appendChild(l2);
    box2.appendChild(el('p', 'muted small', t('shop.checkout.soon')));
    const lines = ids.map(id => { const p = byId(id); return c[id] + ' × ' + (p.name[lang()] || p.name.en) + ' (' + money(p.price * c[id]) + ')'; });
    const body = lines.join('\n') + '\n\n' + t('shop.total') + ': ' + money(total) + '\n\n' + t('shop.pickup.note');
    const mail = el('a', 'btn btn-pink', t('shop.checkout.email'));
    mail.href = 'mailto:info@cinnery.nl?subject=' + encodeURIComponent('Cinnery pre-order') + '&body=' + encodeURIComponent(body);
    box2.appendChild(mail);
    box2.appendChild(el('p', 'muted small', t('shop.pickup.note')));
    sum.replaceChildren(box2);
  }

  function renderAll() { updateBadge(); renderMenus(); renderProduct(); renderCart(); }
  renderAll();
  document.addEventListener('cinnery:lang', renderAll);
})();
