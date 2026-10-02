# Cinnery – website

Static website for **Cinnery**, a cinnamon roll bakery at Zwanestraat 29, Groningen (NL).
Live at https://krisztianhari-wq.github.io/cinnery-website/ and https://rolls.sadrobot.eu/

## Structure

```
index.html          chooser: version A (v5/, plate & logo photo) and version B (v4/, baking tray photo)
chooser.css         chooser styles
v4/ v5/             the design: pink theme, eggplant header, split hero; v5 reuses v4/style.css
                    and differs only in the opening photo
assets/
  base.css          shared styles (Fredoka + Inter, brand pink #F0A3AF / eggplant #614051)
  products.js       product catalogue: id, category, price (EUR), photo, name and description in EN/NL
  i18n.js           all other texts: en (default), nl
  app.js            language switch, mobile nav, FAQ accordion, "Open now / Closed now", Google Maps on click
  shop.js           menu cards, product page, cart (stored in the browser)
  fonts/            self-hosted Fredoka + Inter (woff2)
  img/              logo artwork (logo-*.png), own photos (own/), Unsplash photos (stock/), chooser previews (preview/)
```

Privacy and security: no third-party requests on page load (fonts and photos are served from this
repo), the Google Maps embed loads only after the visitor clicks "Show map", external links open
with `noopener noreferrer`, and a Content Security Policy is set in `index.html`.

No build step. Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8791
```

## Editing text

Texts live in `assets/i18n.js` (`en` and `nl`), products and prices in `assets/products.js`.
Each element in the HTML has a `data-i18n="key"`; answers with HTML (lists) use `data-i18n-html`.
Both versions share these files, so a change shows up in both.

The page always opens in English; visitors switch with the EN / NL buttons.

## Deploying

GitHub Pages serves the `main` branch root. Any other static host works the same way.

## Brand

- Pink `#F0A3AF` (Pantone 494 C) · Eggplant `#614051` (Pantone 7659 C)
- Instagram: [@cinnery_rolls](https://www.instagram.com/cinnery_rolls/) · info@cinnery.nl

Site by sadrobot.
