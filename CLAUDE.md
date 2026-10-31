# Cinnery weboldal – fejlesztői jegyzet

Statikus weboldal + webshop-váz a Cinnery fahéjascsiga-pékségnek (Groningen). Szerkezet és szerkesztés: README.md.

## Indítás és ellenőrzés
- Nincs keretrendszer. `python3 -m http.server 8791` a repó gyökeréből (launch config: `cinnery`).
- **Generálás (kötelező minden menü-/szöveg-/index.html-változás után):** `node tools/build.mjs` – JSON-LD (Bakery + teljes menü árakkal) mindkét főoldal `<head>`-jébe, a holland főoldal (`nl/index.html`, SOHA ne szerkeszd kézzel – az angol `index.html`-ből generálódik), `llms.txt`, `sitemap.xml` (hreflang), és mindkét főoldal előrenderelése headless Chrome-mal (a menü, árak, angol szövegek benne vannak a HTML-ben JS nélkül is; az AI-lánctalpasok nagy része nem futtat JS-t). Idempotens; a böngészőben a JS ugyanúgy újrarajzol. A `?v=` léptetése ELŐTT/UTÁN is futtasd, mert a generált képcímek is tartalmazzák.
- Ellenőrzés: asztali nézet + 320/390/700/882/1024/1150 px (hajtogatható telefon), konzolhiba nélkül; a menü tördelődjön, ne zsugorodjon el.

## Felépítés
- `index.html` (főoldal), `product.html?id=…` és `cart.html` (noindex), `style.css` (csak az `assets/base.css`-t írja felül), `404.html`.
- `assets/products.js` – termékkatalógus (id, cat, price EUR, img, name/desc EN+NL, tier Classic/De Luxe/Signature, kombóknál options). A menü, terméklap és kosár innen épül; kombó kosárkulcsa `id|pick|pick`.
- `assets/i18n.js` – minden más szöveg (`en`, `nl`; azonos kulcsok). `assets/app.js` – nyelvváltás, mobil menü, GYIK, nyitva/zárva, Maps kattintásra. `assets/shop.js` – menükártyák, terméklap, kosár (localStorage).
- `assets/img/logo-*.png` – az EREDETI logó, CSS mask-ként (currentColor). Soha ne rajzold újra SVG-be.
- `assets/img/own/` – saját stúdiófotók (minden terméken); `assets/stock/` gitignore-olt, nem használt.
- `robots.txt`, `sitemap.xml`, canonical/og a cinnery.nl-re mutat. A `.htaccess` csak Apache-tárhelyhez kell (a sadroboton a Caddy adja a fejléceket).

## Telepítés
- GitHub Pages a `main` gyökeréből: push után 1–2 perc.
- **Éles: cinnery.nl a sadrobot szerveren** (2026-10-11 óta; www és cinnery.eu oda irányít), tükör: rolls.sadrobot.eu – ugyanaz a `cinnery-web` oldal. Feltöltés: `git archive HEAD` mínusz README/.gitignore/.nojekyll/.htaccess/CLAUDE*.md/tools/ → /deploy-sadrobot skill (`deploy-site.sh … cinnery-web <mappa>`).
- `dist/` (gitignore): laikus útmutatók (Lightspeed-kulcsok, e-mail költöztetés), a régi ZXCS-feltöltő csomag már nem kell.
- Cache-busting: minden helyi CSS/JS/kép link `?v=<verzió>` (most `20261031b`); a `shop.js` a saját `?v`-jét adja tovább a termékfotóknak. Minden asset-változásnál léptesd mindhárom oldalon: `sed -i '' 's/?v=OLD/?v=NEW/g' index.html product.html cart.html` – különben a böngésző új HTML-t régi CSS-sel kever.
- Git identitás repo-szinten: GitHub noreply cím; céges e-mail nem kerülhet vissza a historyba.
- Korábbi dizájnok: `archive/design-versions` ág (A/B + választó) és `archive-all-variants` tag (mind az öt).

## Nyitvatartás
- 2026-10-17 óta Krisz kérésére **nincs nyitvatartás a weboldalon** (sem a bento-kártyán, sem a Visit részben). Az `app.js` nyitva/zárva-logikája (`HOURS`, `.open-now`) bent maradt, elem híján nem csinál semmit; visszatételhez a `.open-now` elemeket és a `visit.hours`/`visit.mon`… szövegeket kell visszarakni (git-előzmény: `0283b06`).

## Rendelés ki/be (kapcsoló)
- 2026-10-12 óta **KI**: `<html lang="en" class="no-ordering">` az `index.html`, `product.html`, `cart.html` tetején. Ilyenkor csak árak látszanak: nincs kosár ikon, „Add to cart”/„Choose”/sor-gomb, lebegő kosársáv, rendelési panel és „order ahead” GYIK; a `cart.html` a menüre irányít; a fejlécben „See the menu” van.
- **Visszakapcsolás** (Krisz ~2026-11 közepére tervezi): a három fájlból töröld a `class="no-ordering"`-t, léptesd a `?v=`-t, teszteld a kosarat és az e-mailes előrendelést, telepítsd. Kód: `ORDERING` a `shop.js`-ben, `.order-only` / `.menu-only` a `base.css`-ben. Bájtra pontos utolsó bekapcsolt állapot: `ordering-2026-10-12` tag.

1. A gyökér (`/`) mindig angolul nyílik, a `/nl/` hollandul (2026-10-31 óta saját URL + hreflang); a főoldali EN/NL gomb a két URL között vált, a termék-/kosároldalak `?lang=nl`-lel öröklik a nyelvet. Nincs mentett nyelv, böngészőnyelv figyelmen kívül; magyar nincs. localStorage csak a kosárhoz.
2. Adatvédelem: betöltéskor nulla harmadik feles kérés (fontok, képek helyben), Google Maps csak a „Show map” kattintásra, CSP meta az `index.html`-ben, külső linkek `noopener noreferrer`. Új külső erőforrás → CSP-t is bővíteni.
3. Fizetés még nincs: a kosár mailto előrendelést nyit (cinnery.nl@gmail.com). Nincs házhozszállítás, nincs WhatsApp.
4. Halal-állítás sehol (a menüben volt bacon roll). A hero alatti kiemelés „Artisan”.
5. Kávé és üdítő: árlista-sor közvetlen kosárba gombbal, terméklap nélkül (kérésre, bár van kávéfotó). Extrák: kompakt fotókártya (`.cards-row`).
6. Dizájn: nincs matrica, animáció, gradiens; nagy lekerekített kártyák, sok fehér tér, Fredoka + Inter. Lábléc: „Site by sadrobot”.
7. Belső jegyzet és TODO nem kerülhet a README-be vagy a kódba.

## Buktatók
- Szövegváltozás mindig mindkét nyelven, azonos kulccsal; új elem `data-i18n` (HTML-es szöveg: `data-i18n-html`).
- Elfelejtett cache-bust → fehér hero-szöveg, hiányzó kép a felhasználónál.
