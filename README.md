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

No build step. Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8791
```

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
- Instagram: [@cinnery_rolls](https://www.instagram.com/cinnery_rolls/) · info@cinnery.nl

Site by sadrobot.

## Cache-busting

Every local CSS, JS and image link in the HTML ends in `?v=<version>`, and product photos inherit the
same version from the `shop.js` link. After changing any asset, bump the version in all pages at once:

    sed -i '' 's/?v=OLD/?v=NEW/g' index.html product.html cart.html

