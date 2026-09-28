/* Cinnery – shared behaviour: language switch, nav, accordion, reveal, open-now, roll icon */
(function () {
  const LANGS = ['en', 'nl'];
  const T = window.CINNERY_I18N || {};

  /* ---- language ---- */
  /* Always start in English, regardless of browser language or previous visits. */
  function pickLang() { return 'en'; }
  function apply(lang) {
    const dict = T[lang] || T.en;
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = dict[key] ?? (T.en && T.en[key]);
      if (val == null) return;
      if (el.hasAttribute('data-i18n-html')) el.innerHTML = val; else el.textContent = val;
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
      el.getAttribute('data-i18n-attr').split(',').forEach(pair => {
        const [attr, key] = pair.split(':').map(s => s.trim());
        const val = dict[key] ?? (T.en && T.en[key]);
        if (val != null) el.setAttribute(attr, val);
      });
    });
    document.querySelectorAll('[data-lang]').forEach(b => {
      const on = b.getAttribute('data-lang') === lang;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    document.dispatchEvent(new CustomEvent('cinnery:lang', { detail: lang }));
  }
  document.querySelectorAll('[data-lang]').forEach(b => b.addEventListener('click', () => apply(b.getAttribute('data-lang'))));
  apply(pickLang());

  /* ---- mobile nav ---- */
  const burger = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  if (burger && nav) {
    burger.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.classList.toggle('nav-open', open);
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); document.body.classList.remove('nav-open');
    }));
  }

  /* ---- header shadow on scroll ---- */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 12);
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- FAQ accordion (native <details>, one open at a time) ---- */
  const faqs = document.querySelectorAll('.faq details');
  faqs.forEach(d => d.addEventListener('toggle', () => {
    if (d.open) faqs.forEach(o => { if (o !== d) o.open = false; });
  }));

  /* ---- reveal on scroll ---- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  } else { revealEls.forEach(el => el.classList.add('is-visible')); }

  /* ---- open now? (Europe/Amsterdam) ---- */
  const HOURS = { 0: [12, 17], 1: null, 2: [10, 18], 3: [10, 18], 4: [10, 18], 5: [10, 18], 6: [10, 18] };
  const OPEN_TXT = { en: ['Open now', 'Closed now'], nl: ['Nu open', 'Nu gesloten'] };
  function updateOpen() {
    const el = document.querySelector('.open-now'); if (!el) return;
    const now = new Date();
    const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Amsterdam', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(now);
    const wd = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(parts.find(p => p.type === 'weekday').value);
    const h = +parts.find(p => p.type === 'hour').value + (+parts.find(p => p.type === 'minute').value) / 60;
    const win = HOURS[wd];
    const open = !!(win && h >= win[0] && h < win[1]);
    const lang = document.documentElement.lang || 'en';
    el.textContent = (OPEN_TXT[lang] || OPEN_TXT.en)[open ? 0 : 1];
    el.classList.toggle('is-open', open);
    el.classList.toggle('is-closed', !open);
  }
  updateOpen();
  document.querySelectorAll('[data-lang]').forEach(b => b.addEventListener('click', updateOpen));
  setInterval(updateOpen, 60000);

  /* ---- Google Maps: load only after the visitor asks for it (no third-party request before consent) ---- */
  document.querySelectorAll('.map[data-map-src]').forEach(box => {
    const btn = box.querySelector('.map-load'); if (!btn) return;
    btn.addEventListener('click', () => {
      const f = document.createElement('iframe');
      f.title = 'Map: Zwanestraat 29, Groningen';
      f.src = box.getAttribute('data-map-src');
      f.loading = 'lazy';
      f.referrerPolicy = 'no-referrer';
      f.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox');
      box.replaceChildren(f);
    });
  });

  /* ---- year ---- */
  document.querySelectorAll('.year').forEach(el => el.textContent = new Date().getFullYear());
})();
