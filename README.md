# Cinnery – website

Static website for **Cinnery**, a cinnamon roll bakery at Zwanestraat 29, Groningen (NL).
Live at https://krisztianhari-wq.github.io/cinnery-website/ and https://rolls.sadrobot.eu/

## Structure

```
index.html          home page: menu, story, order, visit, FAQ
product.html        product page (price, quantity, combo choices)
cart.html           cart and pre-order
style.css           design: pink theme, eggplant header, split hero (overrides assets/base.css)
assets/
  base.css          shared styles (Fredoka + Inter, brand pink #F0A3AF / eggplant #614051)
  products.js       product catalogue: id, category, price (EUR), photo, name and description in EN/NL
  i18n.js           all other texts: en (default), nl
  app.js            language switch, mobile nav, FAQ accordion, "Open now / Closed now", Google Maps on click
  shop.js           menu cards, product page, cart (stored in the browser)
  fonts/            self-hosted Fredoka + Inter (woff2)
  img/              logo artwork (logo-*.png), own product and shop photos (own/)
```

Privacy and security: no third-party requests on page load (fonts and photos are served from this
repo), the Google Maps embed loads only after the visitor clicks "Show map", external links open
with `noopener noreferrer`, and a Content Security Policy is set in `index.html`.

No framework. Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8791
```

## Search engines and AI assistants

`index.html` (English) and `nl/index.html` (Dutch, generated from the English page) ship pre-rendered: the menu, prices and all English texts are in the HTML itself, so crawlers that
do not run JavaScript (most AI crawlers) see the full page. It also carries Schema.org JSON-LD (Bakery + menu with
prices), and `llms.txt` gives AI assistants a plain-text summary; `sitemap.xml` links both languages with hreflang. All three are generated from `assets/products.js`
and `assets/i18n.js`:

```bash
node tools/build.mjs
```

Run it after every change to the menu, the texts or `index.html` (needs Node 18+ and Google Chrome).

## Editing text

Texts live in `assets/i18n.js` (`en` and `nl`), products and prices in `assets/products.js`.
Each element in the HTML has a `data-i18n="key"`; answers with HTML (lists) use `data-i18n-html`.

The page always opens in English; visitors switch with the EN / NL buttons.

## Deploying

GitHub Pages serves the `main` branch root. Any other static host works the same way.

Earlier design versions are kept on the `archive/design-versions` branch (versions A/B with chooser)
and the `archive-all-variants` tag (all five variants).

## Brand

- Pink `#F0A3AF` (Pantone 494 C) · Eggplant `#614051` (Pantone 7659 C)
- Instagram: [@cinnery_rolls](https://www.instagram.com/cinnery_rolls/) · cinnery.nl@gmail.com

Site by sadrobot.

## Cache-busting

Every local CSS, JS and image link in the HTML ends in `?v=<version>`, and product photos inherit the
same version from the `shop.js` link. After changing any asset, bump the version in all pages at once:

    sed -i '' 's/?v=OLD/?v=NEW/g' index.html product.html cart.html

