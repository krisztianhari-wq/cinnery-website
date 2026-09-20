# Cinnery – website

Static website for **Cinnery**, a cinnamon roll bakery at Zwanestraat 29, Groningen (NL).
Two design variants share the same content, translations and images.

| | Variant A · *Cream* | Variant B · *Modern* |
|---|---|---|
| Folder | `variant-a/` | `variant-b/` |
| Mood | light, minimal, product-grid | full-bleed hero, floating pill nav, bento facts, rounded photo cards |
| Display font | Plus Jakarta Sans | Fredoka (matches the logo wordmark) |
| Body font | Plus Jakarta Sans | Inter |
| Photos | own photos | stock photos hotlinked from Unsplash (`images.unsplash.com`) |
| Menu | 6 rolls + 5 cookies as pastel tiles | 6 rolls + 5 cookies as photo cards |

`index.html` at the root is a simple chooser page linking to both.

## Structure

```
assets/
  i18n.js      translations: en (default), nl, hu – one key per text
  app.js       shared behaviour: language switch, mobile nav, FAQ accordion,
               reveal-on-scroll, "Open now / Closed now", inline roll icon
  roll.svg     the cinnamon roll icon (favicon + inline)
  img/         photos (640×480 originals) and logo files
variant-a/     index.html + style.css
variant-b/     index.html + style.css
```

No build step. Open any `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8791
```

## Editing text

All copy lives in `assets/i18n.js`. Each element in the HTML has a `data-i18n="key"`;
change the value under `en`, `nl` and `hu` and both variants update.
Answers with HTML (lists) use `data-i18n-html`.

The language is remembered in `localStorage`; the default is the browser language if it is
EN/NL/HU, otherwise English.

## Deploying

Any static host works (GitHub Pages, Netlify, Cloudflare Pages, classic hosting).
For GitHub Pages: Settings → Pages → Deploy from branch `main`, folder `/ (root)`.
To ship only one variant, copy `variant-x/index.html`, `variant-x/style.css` and `assets/`
and change the `../assets/` paths to `assets/`.

## Brand

- Pink `#F0A3AF` (Pantone 494 C) · Eggplant `#614051` (Pantone 7659 C)
- Instagram: [@cinnery_rolls](https://www.instagram.com/cinnery_rolls/) · info@cinnery.nl

