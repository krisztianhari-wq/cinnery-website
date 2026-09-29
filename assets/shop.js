/* Cinnery – shop skeleton: menu cards, price lists, product page (incl. combo choices), cart (localStorage, first-party only) */
(function () {
  const P = window.CINNERY_PRODUCTS || [];
  const T = window.CINNERY_I18N || {};
  const KEY = 'cinnery-cart';
  const SCRIPT = document.currentScript && document.currentScript.src;
  const ROOT = SCRIPT ? new URL('..', SCRIPT) : new URL('./', location.href);
  const src = path => new URL(path, ROOT).href;

  const CAT_TITLE = { roll: 'menu.title', savory: 'menu.savory.title', cookie: 'menu.cookies.title', combo: 'menu.offers.title',
    coffee: 'menu.coffee.title', hotchoco: 'menu.hotchoco.title', matcha: 'menu.matcha.title', soft: 'menu.soft.title' };

  const lang = () => document.documentElement.lang || 'en';
  const t = key => (T[lang()] && T[lang()][key]) || (T.en && T.en[key]) || key;
  const money = n => new Intl.NumberFormat(lang() === 'nl' ? 'nl-NL' : 'en-IE', { style: 'currency', currency: 'EUR' }).format(n);
  const byId = id => P.find(p => p.id === id);
  const nm = p => p.name[lang()] || p.name.en;
  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
  const pageOf = id => 'product.html?id=' + encodeURIComponent(id);
  const choicesFor = f => P.filter(x => f.cats.includes(x.cat) && (!f.tiers || f.tiers.includes(x.tier)));

  /* ---- cart storage: key = "id" or "id|choice|choice" ---- */
  function getCart() { try { const c = JSON.parse(localStorage.getItem(KEY) || '{}'); return typeof c === 'object' && c ? c : {}; } catch (e) { return {}; } }
  function setCart(c) { try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) {} updateBadge(); }
  function add(key, qty) { const c = getCart(); c[key] = Math.min(99, (c[key] || 0) + qty); setCart(c); }
  function setQty(key, qty) { const c = getCart(); if (qty <= 0) delete c[key]; else c[key] = Math.min(99, qty); setCart(c); }
  function count() { return Object.values(getCart()).reduce((a, b) => a + b, 0); }
  function updateBadge() { const n = count(); document.querySelectorAll('.cart-count').forEach(b => { b.textContent = n; b.hidden = n === 0; }); }
  function parseKey(key) {
    const [id, ...picks] = key.split('|'); const p = byId(id); if (!p) return null;
    if (p.options && (picks.length !== p.options.length || picks.some(x => !byId(x)))) return null;
    return { p, picks: picks.map(byId) };
  }

  /* ---- icons ---- */
  const CART_SVG = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6h15l-1.5 8.5H7.5z"/><path d="M6 6 5 3H2"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/></svg>';
  document.querySelectorAll('.cart-icon').forEach(e => { e.innerHTML = CART_SVG; });

  /* photo, or a logo tile when the product has no photo yet */
  function media(p, cls) {
    if (p.img) { const img = el('img', cls); img.src = src(p.img); img.alt = nm(p); img.loading = 'lazy'; return img; }
    const ph = el('div', 'ph ' + (cls || '') + ' ph-' + p.cat); ph.setAttribute('role', 'img'); ph.setAttribute('aria-label', nm(p));
    ph.appendChild(el('span', 'logo logo-icon')); return ph;
  }
  function tags(p) {
    const box = el('div', 'tags');
    if (p.tier) box.appendChild(el('span', 'tier tier-' + p.tier.toLowerCase().replace(/\s+/g, ''), p.tier));
    if (p.badge === 'veg') box.appendChild(el('span', 'tier tier-veg', t('shop.veg')));
    return box.childNodes.length ? box : null;
  }

  /* ---- product card ---- */
  function card(p, small) {
    const a = el('article', 'card' + (small ? ' card-sm' : '') + ' card-shop');
    const link = el('a', 'card-img-link'); link.href = pageOf(p.id); link.appendChild(media(p)); a.appendChild(link);
    const body = el('div', 'card-body');
    const tg = tags(p); if (tg) body.appendChild(tg);
    body.appendChild(el('h3', null, nm(p)));
    body.appendChild(el('p', null, p.desc[lang()] || p.desc.en));
    const row = el('div', 'card-row');
    row.appendChild(el('span', 'price', money(p.price)));
    const btn = el('a', 'btn btn-pink btn-sm', t('shop.order')); btn.href = pageOf(p.id);
    row.appendChild(btn); body.appendChild(row); a.appendChild(body);
    return a;
  }

  /* ---- index: menu grids and price lists ---- */
  function renderMenus() {
    document.querySelectorAll('[data-products]').forEach(grid => {
      const cat = grid.getAttribute('data-products');
      const small = grid.hasAttribute('data-small');
      grid.replaceChildren(...P.filter(p => p.cat === cat).map((p, i) => {
        const c = card(p, small);
        if (cat === 'roll') c.prepend(el('span', 'num', String(i + 1).padStart(2, '0')));
        return c;
      }));
    });
    document.querySelectorAll('[data-pricelist]').forEach(list => {
      const cat = list.getAttribute('data-pricelist');
      list.replaceChildren(...P.filter(p => p.cat === cat).map(p => {
        const li = el('li'); const a = el('a'); a.href = pageOf(p.id);
        a.append(el('span', 'pl-name', nm(p)), el('span', 'pl-dots'), el('span', 'pl-price', money(p.price)), el('span', 'pl-add', '+'));
        a.setAttribute('aria-label', nm(p) + ', ' + money(p.price) + ', ' + t('shop.order'));
        li.appendChild(a); return li;
      }));
    });
  }

  /* ---- product page ---- */
  function renderProduct() {
    const box = document.getElementById('product'); if (!box) return;
    const p = byId(new URLSearchParams(location.search).get('id'));
    if (!p) { box.replaceChildren(el('p', 'lead', t('shop.notfound'))); return; }
    document.title = 'Cinnery – ' + nm(p);
    const fig = el('div', 'product-img'); fig.appendChild(media(p));
    const info = el('div', 'product-info');
    info.appendChild(el('p', 'eyebrow', t(CAT_TITLE[p.cat] || 'menu.title')));
    const tg = tags(p); if (tg) info.appendChild(tg);
    info.appendChild(el('h1', null, nm(p)));
    info.appendChild(el('p', 'lead', p.desc[lang()] || p.desc.en));
    info.appendChild(el('p', 'product-price', money(p.price)));

    /* combo choices */
    const selects = (p.options || []).map(o => {
      const row = el('label', 'opt-row'); row.appendChild(el('span', 'qty-label', o.label[lang()] || o.label.en));
      const s = el('select', 'opt-select');
      choicesFor(o.from).forEach(x => { const op = el('option', null, nm(x) + (x.cat === 'roll' ? ' – ' + t('shop.kind.roll') : x.cat === 'cookie' ? ' – ' + t('shop.kind.cookie') : '')); op.value = x.id; s.appendChild(op); });
      row.appendChild(s); info.appendChild(row); return s;
    });

    const qtyRow = el('div', 'qty-row');
    qtyRow.appendChild(el('span', 'qty-label', t('shop.qty')));
    const stepper = el('div', 'stepper');
    const minus = el('button', null, '−'); minus.type = 'button'; minus.setAttribute('aria-label', '−');
    const input = el('input'); input.type = 'number'; input.min = '1'; input.max = '99'; input.value = '1'; input.inputMode = 'numeric';
    input.setAttribute('aria-label', t('shop.qty'));
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
      const key = [p.id, ...selects.map(s => s.value)].join('|');
      add(key, clamp(input.value));
      const n = count(); note.textContent = t('shop.added') + ' · ' + n + ' ' + (n === 1 ? t('shop.item') : t('shop.items'));
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
    const c = getCart(); const keys = Object.keys(c).filter(parseKey);
    if (!keys.length) { box.replaceChildren(el('p', 'lead', t('shop.empty'))); sum.replaceChildren(); return; }
    let total = 0; const lines = [];
    const rows = keys.map(key => {
      const { p, picks } = parseKey(key); const q = c[key]; const line = p.price * q; total += line;
      const extra = picks.length ? ' (' + picks.map(nm).join(' + ') + ')' : '';
      lines.push(q + ' × ' + nm(p) + extra + ' – ' + money(line));
      const r = el('div', 'cart-row');
      r.appendChild(media(p, 'cart-media'));
      const mid = el('div', 'cart-mid');
      const name = el('a', 'cart-name', nm(p)); name.href = pageOf(p.id); mid.appendChild(name);
      if (picks.length) mid.appendChild(el('span', 'cart-picks small', picks.map(nm).join(' + ')));
      mid.appendChild(el('span', 'muted small', money(p.price) + ' ' + t('shop.each')));
      const stepper = el('div', 'stepper stepper-sm');
      const minus = el('button', null, '−'); minus.type = 'button'; minus.setAttribute('aria-label', '−');
      const plus = el('button', null, '+'); plus.type = 'button'; plus.setAttribute('aria-label', '+');
      const qv = el('span', 'qv', String(q));
      minus.addEventListener('click', () => { setQty(key, q - 1); renderCart(); });
      plus.addEventListener('click', () => { setQty(key, q + 1); renderCart(); });
      stepper.append(minus, qv, plus); mid.appendChild(stepper); r.appendChild(mid);
      const right = el('div', 'cart-right');
      right.appendChild(el('strong', null, money(line)));
      const rm = el('button', 'linkbtn', t('shop.remove')); rm.type = 'button'; rm.addEventListener('click', () => { setQty(key, 0); renderCart(); });
      right.appendChild(rm); r.appendChild(right);
      return r;
    });
    box.replaceChildren(...rows);

    const n = keys.reduce((a, k) => a + c[k], 0);
    const box2 = el('div', 'summary-box');
    box2.appendChild(el('h2', null, t('shop.total')));
    const l1 = el('div', 'sum-row'); l1.append(el('span', null, n + ' ' + (n === 1 ? t('shop.item') : t('shop.items'))), el('span', null, money(total))); box2.appendChild(l1);
    const l2 = el('div', 'sum-row sum-total'); l2.append(el('strong', null, t('shop.total')), el('strong', null, money(total))); box2.appendChild(l2);
    box2.appendChild(el('p', 'muted small', t('shop.checkout.soon')));
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
