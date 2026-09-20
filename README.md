# Cinnery – website

Static website for **Cinnery**, a cinnamon roll bakery at Zwanestraat 29, Groningen (NL).
Two design variants share the same content, translations and images.

| | Variant A · *Sugar Rush* | Variant B · *Midnight Glaze* |
|---|---|---|
| Folder | `variant-a/` | `variant-b/` |
| Mood | light, playful, sticker-style | dark eggplant, editorial, glaze gradients |
| Display font | Fredoka | Unbounded |
| Body font | Nunito | DM Sans |
| Extras | marquee ticker, rotating badge, polaroids | horizontal menu rail, mosaic gallery, mobile order bar |

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
- [ ] Optional: replace hero photos with higher-resolution images (current photos are 640×480,
      fine for cards, soft when shown large). Drop new files into `assets/img/` and update the
      `<img src>` in the hero.
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
