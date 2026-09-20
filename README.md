# Cinnery – website

Static website for **Cinnery**, a cinnamon roll bakery at Zwanestraat 29, Groningen (NL).
Live at https://krisztianhari-wq.github.io/cinnery-website/

## Structure

```
index.html     the page
style.css      styles (Fredoka + Inter, brand pink #F0A3AF / eggplant #614051)
assets/
  i18n.js      translations: en (default), nl, hu – one key per text
  app.js       shared behaviour: language switch, mobile nav, FAQ accordion,
               "Open now / Closed now", inline roll icon
  roll.svg     the cinnamon roll icon (favicon + inline)
  img/         logo files
```

Photos are hotlinked from Unsplash (`images.unsplash.com`).

No build step. Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8791
```

## Editing text

All copy lives in `assets/i18n.js`. Each element in the HTML has a `data-i18n="key"`;
change the value under `en`, `nl` and `hu`. Answers with HTML (lists) use `data-i18n-html`.

The language is remembered in `localStorage`; the default is the browser language if it is
EN/NL/HU, otherwise English.

## Deploying

GitHub Pages serves the `main` branch root. Any other static host works the same way.

## Brand

- Pink `#F0A3AF` (Pantone 494 C) · Eggplant `#614051` (Pantone 7659 C)
- Instagram: [@cinnery_rolls](https://www.instagram.com/cinnery_rolls/) · info@cinnery.nl

Site by sadrobot.
