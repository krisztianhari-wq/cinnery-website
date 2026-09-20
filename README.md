# Cinnery – website

Static website for **Cinnery**, a cinnamon roll bakery at Zwanestraat 29, Groningen (NL).
Two design variants share the same content, translations and images.

| | Variant A · *Cream* | Variant B · *Eggplant* |
|---|---|---|
| Folder | `variant-a/` | `variant-b/` |
| Mood | light, minimal, product-grid | editorial, eggplant hero band, menu as numbered list |
| Display font | Plus Jakarta Sans | Fraunces (soft serif) |
| Body font | Plus Jakarta Sans | Inter |
| Menu | 6 rolls + 5 cookies as pastel tiles (swap in photos later) | 6 rolls + 5 cookies as a list with descriptions |

Design references: canela.amsterdam, cinnamoodrolls.com – lots of whitespace, one typeface,
product photography, almost no decoration.

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

## Before going live – TODO

- [ ] Replace the placeholder order links (`https://www.thuisbezorgd.nl/`, `https://www.ubereats.com/`)
      with the bakery's real restaurant pages (search `TODO` in both `index.html`).
- [ ] Add the WhatsApp number if you want a WhatsApp button (currently only mentioned in the FAQ text).
- [ ] Check the Google Maps embed shows the right pin (it geocodes the address).
- [ ] Proofread the Dutch translation (`nl` block in `assets/i18n.js`).
- [ ] Product photos: Variant A shows a coloured tile per flavour (`.tile-*` in `variant-a/style.css`).
      When real photos exist, replace each `<div class="tile ...">` with `<img>` (4:3, ≥ 900 px wide).
- [ ] Higher-resolution hero photos (current photos are 640×480, soft when shown large).
- [ ] Set `og:image` to an absolute URL once the domain is live.

## Deploying

Any static host works (GitHub Pages, Netlify, Cloudflare Pages, classic hosting).
For GitHub Pages: Settings → Pages → Deploy from branch `main`, folder `/ (root)`.
To ship only one variant, copy `variant-x/index.html`, `variant-x/style.css` and `assets/`
and change the `../assets/` paths to `assets/`.

## Brand

- Pink `#F0A3AF` (Pantone 494 C) · Eggplant `#614051` (Pantone 7659 C)
- Instagram: [@cinnery_rolls](https://www.instagram.com/cinnery_rolls/) · info@cinnery.nl

Site by sadrobot.
