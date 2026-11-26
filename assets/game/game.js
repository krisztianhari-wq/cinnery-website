/* Cinnery mini-game: run through Amsterdam and Groningen, collect cinnamon-roll ingredients,
   then the bakery machine bakes the rolls. Vanilla JS + canvas, no external requests, no sound.
   Settings come from data-* attributes on #game (CSP: no inline script). */
(function () {
  'use strict';
  const root = document.getElementById('game');
  if (!root) return;
  const canvas = root.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const LANG = document.documentElement.lang === 'nl' ? 'nl' : 'en';
  const BASE = root.dataset.base || '';          // e.g. "../assets/game/"
  const SITE = root.dataset.site || '../';       // site root, relative to this page
  const VER = root.dataset.v ? '?v=' + root.dataset.v : '';
  const FAST = +(location.hash.match(/^#fast=(\d+)$/) || [0, 1])[1];   // test aid: #fast=8 runs the game 8× faster
  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- text ---------- */
  const T = {
    en: {
      cities: ['Amsterdam', 'Groningen'], bakery: 'Cinnery bakery',
      stations: ['Knead', 'Roll', 'Bake', 'Glaze'],
      baked: n => n === 1 ? 'You baked 1 cinnamon roll!' : `You baked ${n} cinnamon rolls!`,
      none: 'No rolls this time…',
      short: x => `You were short on ${x}.`, flavour: x => `Today’s flavour: ${x}`,
      record: n => `Your record: ${n}`, newRecord: 'New record!',
      shareText: n => `I baked ${n} cinnamon rolls in the Cinnery game. Can you beat me?`, copied: 'Link copied',
      ing: { flour: 'flour', sugar: 'sugar', butter: 'butter', egg: 'eggs', yeast: 'yeast', cinnamon: 'cinnamon',
        creamcheese: 'cream cheese', cocoa: 'cocoa', biscoff: 'Biscoff biscuits', pistachio: 'pistachios', caramel: 'caramel & pecans', blueberry: 'blueberries' },
    },
    nl: {
      cities: ['Amsterdam', 'Groningen'], bakery: 'Bakkerij Cinnery',
      stations: ['Kneden', 'Rollen', 'Bakken', 'Glazuren'],
      baked: n => n === 1 ? 'Je hebt 1 kaneelbroodje gebakken!' : `Je hebt ${n} kaneelbroodjes gebakken!`,
      none: 'Deze keer geen broodjes…',
      short: x => `Je kwam ${x} tekort.`, flavour: x => `Smaak van vandaag: ${x}`,
      record: n => `Jouw record: ${n}`, newRecord: 'Nieuw record!',
      shareText: n => `Ik heb ${n} kaneelbroodjes gebakken in de Cinnery-game. Kun jij dat beter?`, copied: 'Link gekopieerd',
      ing: { flour: 'bloem', sugar: 'suiker', butter: 'boter', egg: 'eieren', yeast: 'gist', cinnamon: 'kaneel',
        creamcheese: 'roomkaas', cocoa: 'cacao', biscoff: 'Biscoff-koekjes', pistachio: 'pistachenoten', caramel: 'karamel & pecannoten', blueberry: 'blauwe bessen' },
    },
  }[LANG];

  /* ---------- data ---------- */
  const BASIC = ['flour', 'sugar', 'butter', 'egg', 'yeast', 'cinnamon'];
  const SPECIAL = ['creamcheese', 'cocoa', 'biscoff', 'pistachio', 'caramel', 'blueberry'];
  const ROLL = { creamcheese: 'classic-cream-cheese', cocoa: 'red-velvet', biscoff: 'biscoff', pistachio: 'pistachio',
    caramel: 'salted-caramel-pecan', blueberry: 'blueberry-crumble', none: 'classic' };
  const ROLL_NAME = { 'classic-cream-cheese': 'Classic Cream Cheese', 'red-velvet': 'Red Velvet', biscoff: 'Biscoff', pistachio: 'Pistachio',
    'salted-caramel-pecan': 'Salted Caramel Pecan', 'blueberry-crumble': 'Blueberry Crumble', classic: 'Classic Naked' };
  const ROLL_IMG = { 'classic-cream-cheese': 'roll-classic-cream-cheese', 'red-velvet': 'roll-red-velvet', biscoff: 'roll-biscoff', pistachio: 'roll-pistachio',
    'salted-caramel-pecan': 'roll-salted-caramel-pecan', 'blueberry-crumble': 'roll-blueberry-crumble', classic: 'roll-classic-naked' };
  const CITY_SPECIALS = [['creamcheese', 'biscoff', 'cocoa'], ['pistachio', 'blueberry', 'caramel']];
  const COL = { ink: '#2B1C25', plum: '#614051', deep: '#4A2F3E', pink: '#F0A3AF', soft: '#FBE3E6', cream: '#FFFCFA',
    brown: '#A8643A', butter: '#F4C95D', green: '#5E9C6B', blue: '#6FA8C7' };
  const ING_COL = { flour: '#FFFFFF', sugar: '#F3F0FF', butter: COL.butter, egg: '#C98B5A', yeast: '#E8D9A8', cinnamon: COL.brown,
    creamcheese: '#FFF6EA', cocoa: '#8A3B3B', biscoff: '#C9853F', pistachio: '#93B65A', caramel: '#D99A3A', blueberry: '#4F5DA8' };

  /* ---------- art (sprites that exist in BASE; everything else is drawn as a placeholder) ---------- */
  const ART = ['flour', 'sugar', 'butter', 'egg', 'yeast', 'cinnamon', 'creamcheese', 'cocoa', 'biscoff', 'pistachio', 'caramel', 'blueberry'].map(k => 'ing-' + k)
    .concat(['run1', 'run2', 'run3', 'run4', 'jump', 'fall', 'hit', 'pour'].map(k => 'baker-' + k),
      ['bike', 'cobble', 'tulip', 'tram', 'pigeon', 'gull', 'puddle', 'canal', 'bakery', 'bake-room', 'machine'],
      ['amsterdam', 'groningen'].flatMap(c => ['bg-' + c + '-far', 'bg-' + c + '-near']));                                 // file names (without .png) in assets/game/, filled in as the art is approved
  const IMG = {};
  ART.forEach(n => { const im = new Image(); im.src = BASE + n + '.png' + VER; IMG[n] = im; });
  const img = n => { const im = IMG[n]; return im && im.complete && im.naturalWidth ? im : null; };
  const aspect = n => { const im = img(n); return im ? im.naturalWidth / im.naturalHeight : 1; };
  // the real Cinnery wordmark, tinted pink, for the bakery sign (the generated sign board is empty)
  const LOGO = new Image(); LOGO.src = SITE + 'assets/img/logo-word.png' + VER;
  let logoTint = null;
  function tintedLogo() {
    if (logoTint || !LOGO.complete || !LOGO.naturalWidth) return logoTint;
    const c = document.createElement('canvas'); c.width = LOGO.naturalWidth; c.height = LOGO.naturalHeight;
    const x = c.getContext('2d'); x.drawImage(LOGO, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = '#F0A3AF'; x.fillRect(0, 0, c.width, c.height);
    return (logoTint = c);
  }

  /* ---------- world constants (logical units; height is always 360) ---------- */
  const H = 360, GROUND = 304;
  const GRAV = 2300, JUMP = 780, HOLD_G = 0.42, HOLD_MAX = 0.24;
  const PW = 30, PH = 60;                          // player hitbox
  let W = 640, scale = 1, dpr = 1;

  let state = 'title', slow = false, last = 0, raf = 0;
  let speed, length, cam, P, objs, items, parts, got, hitT, holding, holdT, buffer, coyote, cityShown, endT, bakeT, result, rng, drops;

  function seedRng(s) { return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; }
  const rr = (a, b) => a + rng() * (b - a);
  const pick = a => a[Math.floor(rng() * a.length)];

  /* ---------- level ---------- */
  function build() {
    rng = seedRng((Date.now() ^ 0x5eed) >>> 0);
    speed = slow ? 170 : 230;
    length = 230 * 48;                               // same course in slow mode, it just takes longer
    objs = []; items = [];
    let x = 700, b = 0;
    const basic = () => BASIC[b++ % BASIC.length];
    const add = (o) => objs.push(o);
    const item = (ix, iy, kind) => items.push({ x: ix, y: iy, kind, got: false });
    const special = (ix, iy) => { const c = city(ix); item(ix, iy, rng() < .7 ? pick(CITY_SPECIALS[c]) : pick(SPECIAL)); };
    let n = 0;
    while (x < length - 500) {
      const c = city(x), pats = ['bike', 'cobble', 'pigeon', 'gull', 'tulip', 'air', 'water'];
      if (c === 0) pats.push('tram');           // Groningen has no trams
      const p = pick(pats), sp = ++n % 3 === 0;
      if (p === 'bike' || p === 'cobble' || p === 'pigeon') {
        const w = p === 'bike' ? 58 : p === 'cobble' ? 28 : 30, h = p === 'bike' ? 42 : p === 'cobble' ? 16 : 24;
        add({ type: p, x, y: GROUND - h, w, h, hazard: true, vx: p === 'pigeon' ? -35 : 0 });
        for (let i = -1; i <= 1; i++) item(x + w / 2 + i * 46, GROUND - 70 - (i ? 0 : 30), basic());
        if (sp) special(x + w / 2, GROUND - 150);
        x += w;
      } else if (p === 'water') {
        const pud = rng() < .4, w = pud ? 70 : 104;
        add({ type: pud ? 'puddle' : 'canal', x, y: GROUND - 4, w, h: 8, hazard: true, water: true });
        for (let i = 0; i < 3; i++) item(x + w / 2 + (i - 1) * 40, GROUND - 90 - (i === 1 ? 24 : 0), basic());
        if (sp) special(x + w / 2, GROUND - 160);
        x += w;
      } else if (p === 'gull') {
        add({ type: 'gull', x: x + 80, y: GROUND - 118, w: 44, h: 22, hazard: true, vx: -70, fly: true, y0: GROUND - 118 });
        for (let i = 0; i < 4; i++) item(x + i * 40, GROUND - 26, basic());
        if (sp) special(x + 230, GROUND - 26);
        x += 160;
      } else if (p === 'tulip' || p === 'tram') {
        const w = p === 'tram' ? 230 : 92, im = img(p), h = im ? Math.round(w / (im.naturalWidth / im.naturalHeight)) : p === 'tram' ? 80 : 46;
        add({ type: p, x, y: GROUND - h, w, h, block: true });
        for (let i = 0; i < 3; i++) item(x + w * (i + 1) / 4, GROUND - h - 26, basic());
        if (sp) special(x + w / 2, GROUND - h - 110);
        x += w;
      } else { // air row
        for (let i = 0; i < 4; i++) item(x + i * 42, GROUND - 120 - Math.sin(i / 3 * Math.PI) * 30, basic());
        if (sp) special(x + 210, GROUND - 26);
        x += 170;
      }
      x += rr(330, 520);
    }
  }
  const city = x => x < length / 2 ? 0 : 1;          // 0 Amsterdam, 1 Groningen

  function reset() {
    build();
    cam = 0; P = { x: 0, y: GROUND - PH, vy: 0, ground: true, frame: 0 };
    parts = []; drops = [];
    got = {}; [...BASIC, ...SPECIAL].forEach(k => got[k] = 0);
    hitT = 0; holding = false; holdT = 0; buffer = 0; coyote = 0; cityShown = -1; endT = 0; bakeT = 0; result = null;
  }

  /* ---------- input ---------- */
  function press() {
    if (state === 'run') { holding = true; buffer = 0.12; }
    else if (state === 'bake' && bakeT > 1) bakeT = Math.max(bakeT, 7);   // tap skips the machine
  }
  function release() { holding = false; }
  canvas.addEventListener('pointerdown', e => { e.preventDefault(); press(); });
  addEventListener('pointerup', release);
  addEventListener('pointercancel', release);
  addEventListener('keydown', e => {
    if (!['Space', 'ArrowUp', 'KeyW'].includes(e.code) || state === 'title' || state === 'result') return;
    e.preventDefault(); if (!e.repeat) press();
  });
  addEventListener('keyup', e => { if (['Space', 'ArrowUp', 'KeyW'].includes(e.code)) release(); });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) last = performance.now(); });

  /* ---------- update ---------- */
  function update(dt) {
    if (state === 'run') run(dt);
    else if (state === 'bake') { bakeT += dt; if (bakeT > 8.2) finish(); }
    parts = parts.filter(p => (p.t -= dt) > 0);
    parts.forEach(p => { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 900 * dt; });
  }

  function run(dt) {
    const px = W * 0.24;
    const doorX = length + 120 + (img('bakery') ? 0.6 * 250 * aspect('bakery') : 155);   // bakery door, world x
    if (cam + px < doorX - 220) cam += speed * dt;
    else if (cam + px + P.x < doorX || !P.ground) P.x += 170 * dt;
    else { endT += dt; if (endT > 0.6) { state = 'bake'; bakeT = 0; } }
    const wx = cam + px + P.x;
    // jump
    buffer -= dt; coyote = P.ground ? 0.09 : coyote - dt;
    if (buffer > 0 && coyote > 0 && endT === 0) { P.vy = -JUMP; P.ground = false; coyote = 0; buffer = 0; holdT = 0; }
    const g = holding && P.vy < 0 && (holdT += dt) < HOLD_MAX ? GRAV * HOLD_G : GRAV;
    const prevBottom = P.y + PH;
    P.vy += g * dt; P.y += P.vy * dt; P.ground = false;
    if (P.y + PH >= GROUND) { P.y = GROUND - PH; P.vy = 0; P.ground = true; }
    hitT -= dt;
    const box = { x: wx - PW / 2, y: P.y, w: PW, h: PH };
    for (const o of objs) {
      if (o.vx) o.x += o.vx * dt;
      if (o.fly && !REDUCED) o.y = o.y0 + Math.sin((o.x + cam) / 40) * 6;
      if (o.x > wx + 60 || o.x + o.w < wx - 60) continue;
      if (!overlap(box, o)) continue;
      if (o.block) {
        if (prevBottom <= o.y + 10 && P.vy >= 0) { P.y = o.y - PH; P.vy = 0; P.ground = true; }
        else { hit(wx); P.y = o.y - PH; P.vy = -260; }
      } else if (o.hazard) {
        if (o.water && P.y + PH < GROUND - 2) continue;
        hit(wx);
      }
    }
    for (const it of items) {
      if (it.got || Math.abs(it.x - wx) > 40) continue;
      if (Math.abs(it.x - wx) < 26 && it.y > P.y - 14 && it.y < P.y + PH + 10) {
        it.got = true; got[it.kind]++;
        burst(px + P.x, it.y, SPECIAL.includes(it.kind) ? COL.pink : COL.butter, SPECIAL.includes(it.kind) ? 10 : 5);
      }
    }
    if (P.ground) P.frame += dt * speed / 26;
    const c = city(Math.min(cam + px, length - 1));
    if (c !== cityShown) { cityShown = c; banner = { text: T.cities[c], t: 2.2 }; }
    if (banner) banner.t -= dt;
  }
  let banner = null;

  function overlap(a, b) { return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y; }

  function hit(wx) {
    if (hitT > 0) return;
    hitT = 1.3;
    const have = [...BASIC, ...SPECIAL].flatMap(k => Array(got[k]).fill(k));
    for (let i = 0; i < 3 && have.length; i++) {
      const k = have.splice(Math.floor(Math.random() * have.length), 1)[0];
      got[k]--;
      parts.push({ x: W * 0.24 + P.x, y: P.y + 20, vx: -80 - Math.random() * 120, vy: -320 - Math.random() * 150, t: 1, kind: k });
    }
  }
  function burst(x, y, color, n) {
    if (REDUCED) n = Math.min(n, 3);
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      parts.push({ x, y, vx: Math.cos(a) * 120, vy: Math.sin(a) * 120 - 80, t: .45, color });
    }
  }

  /* ---------- result ---------- */
  function score() {
    const rolls = Math.min(...BASIC.map(k => got[k]));
    const shortOf = BASIC.reduce((a, k) => got[k] < got[a] ? k : a, BASIC[0]);
    const bestSp = SPECIAL.reduce((a, k) => got[k] > (got[a] || 0) ? k : a, null);
    return { rolls, shortOf, flavour: ROLL[bestSp && got[bestSp] ? bestSp : 'none'] };
  }
  function finish() {
    state = 'result';
    const s = result = score();
    let rec = 0, isNew = false;
    try { rec = +localStorage.getItem('cinnery-game-record') || 0; if (s.rolls > rec) { localStorage.setItem('cinnery-game-record', s.rolls); isNew = s.rolls > 0; rec = s.rolls; } } catch (e) { /* storage blocked */ }
    const r = root.querySelector('.game-result');
    r.querySelector('.res-title').textContent = s.rolls ? T.baked(s.rolls) : T.none;
    r.querySelector('.res-flavour').textContent = T.flavour(ROLL_NAME[s.flavour]);
    const im = r.querySelector('.res-img');
    im.src = SITE + 'assets/img/own/' + ROLL_IMG[s.flavour] + '.jpg' + VER; im.alt = ROLL_NAME[s.flavour];
    const link = r.querySelector('.res-link');
    link.href = SITE + 'product.html?id=' + s.flavour + (LANG === 'nl' ? '&lang=nl' : '');
    r.querySelector('.res-short').textContent = s.rolls < 12 ? T.short(T.ing[s.shortOf]) : '';
    r.querySelector('.res-record').textContent = isNew ? T.newRecord : T.record(rec);
    r.hidden = false;
    r.querySelector('.res-again').focus({ preventScroll: true });
  }

  /* ---------- drawing ---------- */
  function resize() {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(2, devicePixelRatio || 1);
    canvas.width = Math.round(r.width * dpr); canvas.height = Math.round(r.height * dpr);
    scale = canvas.height / H; W = canvas.width / scale;
  }

  function draw() {
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    if (state === 'bake' || state === 'result') return drawBake();
    const px = W * 0.24, c = city(Math.min(cam + px, length - 1));
    drawSky(c);
    drawCity(c, REDUCED ? 0 : cam * 0.25, 0.55);
    drawCity(c, cam * 0.6, 1);
    ctx.fillStyle = 'rgba(255,252,250,.38)'; ctx.fillRect(0, 0, W, GROUND);   // soft veil: the baker and pickups pop out of the street
    // ground
    ctx.fillStyle = ['#D9C7C0', '#D6C4B4'][c]; ctx.fillRect(0, GROUND, W, H - GROUND);
    ctx.fillStyle = 'rgba(43,28,37,.12)';
    for (let x = -((cam) % 40); x < W; x += 40) ctx.fillRect(x, GROUND + 14, 22, 3);
    ctx.fillStyle = COL.deep; ctx.fillRect(0, GROUND, W, 3);
    drawBakery(length + 120 - cam);
    for (const o of objs) { const sx = o.x - cam; if (sx > -260 && sx < W + 40) drawObj(o, sx); }
    for (const it of items) { const sx = it.x - cam; if (!it.got && sx > -30 && sx < W + 30) drawIng(it.kind, sx, it.y + (REDUCED ? 0 : Math.sin((it.x + performance.now() / 4) / 60) * 3), 36); }
    drawPlayer(px + P.x);
    for (const p of parts) {
      ctx.globalAlpha = Math.min(1, p.t * 2);
      if (p.kind) drawIng(p.kind, p.x, p.y, 24);
      else { ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, 3.5, 0, 7); ctx.fill(); }
      ctx.globalAlpha = 1;
    }
    drawHud(c);
  }

  function drawSky(c) {
    ctx.fillStyle = ['#FBE3E6', '#FCEBDD'][c]; ctx.fillRect(0, 0, W, GROUND);
  }
  function drawCity(c, off, depth) {
    const name = 'bg-' + ['amsterdam', 'groningen'][c] + (depth < 1 ? '-far' : '-near'), im = img(name);
    if (im) {
      const h = depth < 1 ? GROUND : GROUND * 0.6, w = im.naturalWidth / im.naturalHeight * h;
      for (let x = -(off % w); x < W; x += w) ctx.drawImage(im, x, GROUND - h, w, h);
      return;
    }
    // placeholder skyline
    const unit = depth < 1 ? 70 : 54, base = GROUND;
    ctx.fillStyle = depth < 1 ? 'rgba(97,64,81,.18)' : ['#C98F9E', '#C9A58A'][c];
    const start = Math.floor(off / unit);
    for (let i = start - 1; i < start + W / unit + 2; i++) {
      const x = i * unit - off, h = (depth < 1 ? 120 : 70) + ((i * 37) % 5) * 14;
      if (c === 0 && depth === 1) { // canal houses with step gables
        ctx.fillRect(x + 4, base - h, unit - 8, h);
        ctx.fillRect(x + 12, base - h - 12, unit - 24, 12); ctx.fillRect(x + 20, base - h - 22, unit - 40, 10);
      } else if (c === 1 && i % 9 === 0 && depth < 1) { // Martinitoren
        ctx.fillRect(x, base - 230, 34, 230); ctx.fillRect(x + 6, base - 262, 22, 32); ctx.fillRect(x + 13, base - 285, 8, 24);
      } else ctx.fillRect(x + 3, base - h, unit - 6, h);
      if (depth === 1) {
        ctx.fillStyle = 'rgba(255,252,250,.7)';
        for (let wy = base - h + 14; wy < base - 18; wy += 22) ctx.fillRect(x + unit / 2 - 8, wy, 16, 12);
        ctx.fillStyle = ['#C98F9E', '#C9A58A'][c];
      }
    }
  }
  function drawBakery(sx) {
    if (sx > W + 20 || sx < -360) return;
    const im = img('bakery');
    if (im) {
      const h = 250, w = im.naturalWidth / im.naturalHeight * h; ctx.drawImage(im, sx, GROUND - h, w, h);
      const lg = tintedLogo();   // sign board: x 0.12–0.88, y 0.01–0.15 of the image
      if (lg) { const bh = h * 0.14 * 0.62, bw = Math.min(w * 0.7, bh * lg.width / lg.height); ctx.drawImage(lg, sx + w / 2 - bw / 2, GROUND - h + h * 0.08 - bw * lg.height / lg.width / 2, bw, bw * lg.height / lg.width); }
      return;
    }
    ctx.fillStyle = COL.cream; ctx.strokeStyle = COL.ink; ctx.lineWidth = 3;
    rect(sx, GROUND - 230, 300, 230, true);
    ctx.fillStyle = COL.plum; rect(sx - 10, GROUND - 250, 320, 44, true);
    ctx.fillStyle = COL.pink; ctx.font = '600 22px Fredoka, sans-serif'; ctx.textAlign = 'center'; ctx.fillText('Cinnery', sx + 150, GROUND - 221);
    ctx.fillStyle = COL.plum; rect(sx + 120, GROUND - 130, 70, 130, true);
    ctx.fillStyle = COL.soft; rect(sx + 20, GROUND - 160, 80, 80, true); rect(sx + 210, GROUND - 160, 70, 80, true);
  }
  function rect(x, y, w, h, stroke) { ctx.fillRect(x, y, w, h); if (stroke) ctx.strokeRect(x, y, w, h); }

  function drawObj(o, sx) {
    const im = img(o.type);
    if (im) {
      const ar = im.naturalWidth / im.naturalHeight, byW = o.block || o.water;
      const w = byW ? o.w * (o.water ? 1.15 : 1.04) : (o.h + (o.fly ? 16 : 8)) * ar, h = w / ar;
      const bottom = o.water ? GROUND + h * 0.45 : o.y + o.h + (o.block ? 2 : 3);
      ctx.drawImage(im, sx + o.w / 2 - w / 2, bottom - h, w, h); return;
    }
    ctx.lineWidth = 2.5; ctx.strokeStyle = COL.ink;
    switch (o.type) {
      case 'bike':
        ctx.beginPath(); ctx.arc(sx + 12, o.y + 30, 12, 0, 7); ctx.arc(sx + 46, o.y + 30, 12, 0, 7); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(sx + 12, o.y + 30); ctx.lineTo(sx + 26, o.y + 8); ctx.lineTo(sx + 46, o.y + 30); ctx.moveTo(sx + 26, o.y + 8); ctx.lineTo(sx + 40, o.y + 4); ctx.stroke();
        break;
      case 'cobble': ctx.fillStyle = '#9C8D8F'; rect(sx, o.y, o.w, o.h, true); break;
      case 'pigeon': ctx.fillStyle = '#9FA9B8'; ctx.beginPath(); ctx.ellipse(sx + 15, o.y + 13, 15, 11, 0, 0, 7); ctx.fill(); ctx.stroke(); break;
      case 'gull': ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(sx, o.y + 6); ctx.quadraticCurveTo(sx + 11, o.y - 8, sx + 22, o.y + 8); ctx.quadraticCurveTo(sx + 33, o.y - 8, sx + 44, o.y + 6); ctx.stroke(); break;
      case 'puddle': case 'canal': ctx.fillStyle = COL.blue; ctx.beginPath(); ctx.ellipse(sx + o.w / 2, GROUND + 3, o.w / 2, 7, 0, 0, 7); ctx.fill(); break;
      case 'tulip':
        ctx.fillStyle = COL.brown; rect(sx, o.y + 16, o.w, o.h - 16, true);
        for (let i = 0; i < 5; i++) { ctx.fillStyle = i % 2 ? COL.pink : '#E25A6B'; ctx.beginPath(); ctx.arc(sx + 10 + i * 18, o.y + 10, 7, 0, 7); ctx.fill(); }
        break;
      case 'tram':
        ctx.fillStyle = COL.butter; rect(sx, o.y, o.w, o.h - 12, true);
        ctx.fillStyle = '#fff'; for (let i = 0; i < 5; i++) rect(sx + 12 + i * 43, o.y + 12, 30, 26, true);
        ctx.fillStyle = COL.ink; ctx.beginPath(); ctx.arc(sx + 40, o.y + o.h - 8, 8, 0, 7); ctx.arc(sx + o.w - 40, o.y + o.h - 8, 8, 0, 7); ctx.fill();
        break;
    }
  }

  function drawIng(k, x, y, s) {
    const im = img('ing-' + k);
    if (im) { const k = s * 1.15 / Math.max(im.naturalWidth, im.naturalHeight), w = im.naturalWidth * k, h = im.naturalHeight * k; return ctx.drawImage(im, x - w / 2, y - h / 2, w, h); }
    const sp = SPECIAL.includes(k);
    if (sp) { ctx.fillStyle = 'rgba(240,163,175,.45)'; ctx.beginPath(); ctx.arc(x, y, s * .62, 0, 7); ctx.fill(); }
    ctx.fillStyle = ING_COL[k]; ctx.strokeStyle = COL.ink; ctx.lineWidth = 2;
    ctx.beginPath();
    if (k === 'egg') ctx.ellipse(x, y, s * .3, s * .4, 0, 0, 7);
    else if (k === 'butter' || k === 'yeast') ctx.rect(x - s * .38, y - s * .25, s * .76, s * .5);
    else if (k === 'cinnamon') ctx.rect(x - s * .4, y - s * .12, s * .8, s * .24);
    else ctx.arc(x, y, s * .36, 0, 7);
    ctx.fill(); ctx.stroke();
  }

  function drawPlayer(x) {
    const blink = hitT > 0 && (REDUCED ? true : Math.floor(hitT * 10) % 2 === 0);
    ctx.globalAlpha = endT > 0 ? Math.max(0, 1 - endT / 0.6) : blink ? 0.45 : 1;
    const name = hitT > 1 ? 'baker-hit' : !P.ground ? (P.vy < 0 ? 'baker-jump' : 'baker-fall') : 'baker-run' + (1 + Math.floor(P.frame) % 4);
    const im = img(name);
    if (state === 'run') {   // ground shadow, smaller while in the air
      const k = Math.max(0.35, 1 - (GROUND - P.y - PH) / 200);
      ctx.fillStyle = 'rgba(43,28,37,.28)'; ctx.beginPath(); ctx.ellipse(x, GROUND + 2, 24 * k, 6 * k, 0, 0, 7); ctx.fill();
    }
    if (im) { const h = 92, w = im.naturalWidth / im.naturalHeight * h; ctx.drawImage(im, x - w / 2, P.y + PH - h + 6, w, h); }
    else {
      const y = P.y, step = P.ground ? Math.sin(P.frame * Math.PI / 2) * 6 : 0;
      ctx.strokeStyle = COL.ink; ctx.lineWidth = 2.5;
      ctx.fillStyle = COL.deep; rect(x - 9 + step, y + 44, 7, 16, true); rect(x + 2 - step, y + 44, 7, 16, true);
      ctx.fillStyle = COL.plum; rect(x - 12, y + 18, 24, 30, true);
      ctx.fillStyle = '#F2D2B6'; ctx.beginPath(); ctx.arc(x + 2, y + 10, 10, 0, 7); ctx.fill(); ctx.stroke();
      ctx.fillStyle = COL.pink; ctx.beginPath(); ctx.arc(x + 2, y + 4, 10, Math.PI, 0); ctx.fill(); ctx.stroke();
      ctx.fillStyle = COL.cream; rect(x - 18, y + 22, 9, 14, true);
    }
    ctx.globalAlpha = 1;
  }

  function drawHud(c) {
    // progress bar
    const bw = Math.min(260, W * .42), bx = W / 2 - bw / 2, prog = Math.min(1, cam / length);
    ctx.fillStyle = 'rgba(255,252,250,.85)'; roundRect(bx - 8, 8, bw + 16, 18, 9); ctx.fill();
    ctx.fillStyle = COL.soft; roundRect(bx, 13, bw, 8, 4); ctx.fill();
    ctx.fillStyle = COL.plum; roundRect(bx, 13, Math.max(8, bw * prog), 8, 4); ctx.fill();
    ctx.fillStyle = COL.deep; ctx.fillRect(bx + bw / 2 - 1, 11, 2, 12);
    // basics (left) and specials (below)
    const s = 22, y = 46;
    ctx.font = '600 15px Fredoka, sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    const colW = Math.min(52, (W - 20) / 6);
    ctx.fillStyle = 'rgba(255,252,250,.85)'; roundRect(6, 32, colW * 6 + 8, 28, 14); ctx.fill();
    BASIC.forEach((k, i) => { const x = 22 + i * colW; drawIng(k, x, y, s); ctx.fillStyle = COL.ink; ctx.fillText(got[k], x + 13, y + 1); });
    const sp = SPECIAL.filter(k => got[k]);
    if (sp.length) {
      ctx.fillStyle = 'rgba(255,252,250,.85)'; roundRect(6, 64, sp.length * colW + 8, 28, 14); ctx.fill();
      sp.forEach((k, i) => { const x = 22 + i * colW; drawIng(k, x, y + 32, s); ctx.fillStyle = COL.ink; ctx.fillText(got[k], x + 13, y + 33); });
    }
    if (banner && banner.t > 0) {
      ctx.globalAlpha = Math.min(1, banner.t * 2);
      ctx.font = '700 30px Fredoka, sans-serif'; ctx.textAlign = 'center';
      ctx.lineWidth = 6; ctx.strokeStyle = COL.cream; ctx.strokeText(banner.text, W / 2, 120);
      ctx.fillStyle = COL.plum; ctx.fillText(banner.text, W / 2, 120);
      ctx.globalAlpha = 1;
    }
    ctx.textBaseline = 'alphabetic';
  }
  function roundRect(x, y, w, h, r) { ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x, y, w, h, r) : ctx.rect(x, y, w, h); }

  /* ---------- bakery machine scene ---------- */
  const MACHINE = { st: [0.25, 0.43, 0.64, 0.78], belt: 0.55, hop: 0.11 };   // station centres etc. as fractions of the machine image
  function drawBake() {
    const t = bakeT, s = result || score();
    const room = img('bake-room');
    if (room) { const k = Math.max(W / room.naturalWidth, H / room.naturalHeight); ctx.drawImage(room, (W - room.naturalWidth * k) / 2, H - room.naturalHeight * k, room.naturalWidth * k, room.naturalHeight * k); }
    else { ctx.fillStyle = COL.soft; ctx.fillRect(0, 0, W, H); ctx.fillStyle = '#E8D3CC'; ctx.fillRect(0, GROUND, W, H - GROUND); ctx.fillStyle = COL.deep; ctx.fillRect(0, GROUND, W, 3); }
    let m0 = Math.max(W * 0.3, 150), mw = W - m0 - 30, top, belt, hop, xs;
    const mach = img('machine');
    ctx.strokeStyle = COL.ink; ctx.lineWidth = 3;
    if (mach) {
      let mh = mw * mach.naturalHeight / mach.naturalWidth;
      if (mh > 170) { mh = 170; mw = mh * mach.naturalWidth / mach.naturalHeight; m0 = W - 30 - mw; }
      top = GROUND - mh; ctx.drawImage(mach, m0, top, mw, mh);
      xs = MACHINE.st.map(f => m0 + mw * f); belt = top + mh * MACHINE.belt; hop = [m0 + mw * MACHINE.hop, top + 6];
    } else {
      const st = mw / 4; top = GROUND - 190;
      ctx.fillStyle = COL.plum; rect(m0, GROUND - 150, mw, 110, true);
      ctx.fillStyle = COL.deep; rect(m0, GROUND - 40, mw, 40, true);
      ctx.fillStyle = COL.pink; ctx.beginPath(); ctx.moveTo(m0 + 10, GROUND - 150); ctx.lineTo(m0 + 70, GROUND - 150); ctx.lineTo(m0 + 56, GROUND - 190); ctx.lineTo(m0 - 4, GROUND - 190); ctx.closePath(); ctx.fill(); ctx.stroke();
      xs = [0, 1, 2, 3].map(i => m0 + st * i + st / 2); belt = GROUND - 98; hop = [m0 + 30, GROUND - 190];
      xs.forEach(x => { ctx.fillStyle = COL.cream; rect(x - st * .36, GROUND - 130, st * .72, 54, true); });
    }
    const phase = Math.min(3, Math.floor((t - 1.4) / 1.2));
    // station names: small pills above the machine, the active one highlighted
    ctx.font = '600 12px Fredoka, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineWidth = 2;
    T.stations.forEach((name, i) => {
      const on = t > 1.4 && t < 6.2 && phase === i, w = ctx.measureText(name).width + 14;
      ctx.fillStyle = on ? COL.butter : 'rgba(255,252,250,.9)'; roundRect(xs[i] - w / 2, top - 26, w, 18, 9); ctx.fill(); ctx.stroke();
      ctx.fillStyle = COL.ink; ctx.fillText(name, xs[i], top - 16);
    });
    ctx.textBaseline = 'alphabetic'; ctx.lineWidth = 3;
    // baker pours
    const bx = Math.max(50, m0 - 60);
    const im = img(t < 1.6 ? 'baker-pour' : 'baker-run1');
    if (im) { const h = 100, w = im.naturalWidth / im.naturalHeight * h; ctx.drawImage(im, bx - w / 2, GROUND - h + 4, w, h); }
    else { P.y = GROUND - PH; P.ground = true; P.frame = 0; hitT = 0; drawPlayer(bx); }
    if (t < 1.4) {
      const list = [...BASIC, ...SPECIAL].filter(k => got[k]);
      list.forEach((k, i) => { const f = ((t * 1.4 + i / list.length) % 1); drawIng(k, bx + 20 + (hop[0] - bx - 20) * f, GROUND - 70 + (hop[1] - GROUND + 70) * f - Math.sin(f * Math.PI) * 90, 22); });
    } else if (t < 6.2 && s.rolls) {
      const f = Math.min(1, (t - 1.4) / 4.8), x = xs[0] + (xs[3] - xs[0]) * f, y = belt;
      ctx.fillStyle = phase < 2 ? '#F6E3C8' : COL.brown; ctx.beginPath();
      if (phase === 0) ctx.ellipse(x, y + 4, 18 + (REDUCED ? 0 : Math.sin(t * 20) * 3), 12, 0, 0, 7);
      else ctx.arc(x, y, 14, 0, 7);
      ctx.fill(); ctx.stroke();
      if (phase >= 1) { ctx.beginPath(); ctx.arc(x, y, 8, 0, 5); ctx.stroke(); }
      if (phase === 3) { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y - 6, 9, Math.PI, 0); ctx.fill(); }
    }
    // tray of rolls
    if (t > 6.2) {
      const n = Math.min(s.rolls, Math.floor((t - 6.2) * 12)), cols = Math.min(10, Math.max(1, s.rolls)), ty = top - 44;
      ctx.fillStyle = COL.cream; rect(m0 + mw - 20 - cols * 20, ty, cols * 20 + 16, 12, true);
      for (let i = 0; i < Math.min(n, 30); i++) {
        const x = m0 + mw - 20 - (i % cols) * 20, y = ty - 10 - Math.floor(i / cols) * 16;
        ctx.fillStyle = COL.brown; ctx.beginPath(); ctx.arc(x, y, 8, 0, 7); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y - 2, 4, 0, 7); ctx.fill();
      }
      ctx.font = '700 34px Fredoka, sans-serif'; ctx.textAlign = 'center';
      ctx.lineWidth = 6; ctx.strokeStyle = COL.cream; ctx.strokeText('× ' + n, W / 2, 56);
      ctx.fillStyle = COL.plum; ctx.fillText('× ' + n, W / 2, 56);
    }
    for (const p of parts) { ctx.fillStyle = p.color || COL.pink; ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, 7); ctx.fill(); }
  }

  /* ---------- loop ---------- */
  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (document.hidden) return;
    const dt = Math.min(0.05, (now - last) / 1000 || 0); last = now;
    for (let i = 0; i < FAST; i++) update(dt);
    draw();
  }

  function start() {
    slow = root.querySelector('.game-slow input').checked;
    reset();
    state = 'run';
    root.querySelector('.game-start').hidden = true;
    root.querySelector('.game-result').hidden = true;
    root.classList.add('is-playing');
    canvas.focus({ preventScroll: true });
    last = performance.now();
    if (!raf) raf = requestAnimationFrame(frame);
  }
  root.querySelectorAll('.game-play, .res-again').forEach(b => b.addEventListener('click', start));
  root.querySelector('.res-share').addEventListener('click', async e => {
    const url = location.href.split('#')[0], text = T.shareText(result ? result.rolls : 0);
    try {
      if (navigator.share) await navigator.share({ title: document.title, text, url });
      else { await navigator.clipboard.writeText(text + ' ' + url); e.target.textContent = T.copied; }
    } catch (err) { /* cancelled */ }
  });

  new ResizeObserver(() => { resize(); if (state === 'title') { reset(); draw(); } }).observe(canvas);
  resize(); reset(); draw();
})();
