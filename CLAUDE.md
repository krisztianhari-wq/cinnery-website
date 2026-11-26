# Cinnery weboldal – fejlesztői jegyzet

Statikus weboldal + webshop-váz a Cinnery fahéjascsiga-pékségnek (Groningen). Szerkezet és szerkesztés: README.md.

## Indítás és ellenőrzés
- Nincs keretrendszer. `python3 -m http.server 8791` a repó gyökeréből (launch config: `cinnery`).
- **Generálás (kötelező minden menü-/szöveg-/index.html-változás után):** `node tools/build.mjs` – JSON-LD (Bakery + teljes menü árakkal) mindkét főoldal `<head>`-jébe, a holland főoldal (`nl/index.html`, SOHA ne szerkeszd kézzel – az angol `index.html`-ből generálódik), `llms.txt`, `sitemap.xml` (hreflang), és mindkét főoldal előrenderelése headless Chrome-mal (a menü, árak, angol szövegek benne vannak a HTML-ben JS nélkül is; az AI-lánctalpasok nagy része nem futtat JS-t). Idempotens; a böngészőben a JS ugyanúgy újrarajzol. A `?v=` léptetése ELŐTT/UTÁN is futtasd, mert a generált képcímek is tartalmazzák.
- Ellenőrzés: asztali nézet + 320/390/700/882/1024/1150 px (hajtogatható telefon), konzolhiba nélkül; a menü tördelődjön, ne zsugorodjon el.

## Felépítés
- `index.html` (főoldal), `product.html?id=…` és `cart.html` (noindex), `style.css` (csak az `assets/base.css`-t írja felül), `404.html`.
- **A menü forrása 2026-11-26 óta a Planner** (cinnery-rota, Website ág, csak admin): elemek, árak, szövegek EN+NL, fotók, heti/napi elérhetőség.
  `assets/products.js` GENERÁLT (ne szerkeszd kézzel): a `node tools/build.mjs` első lépése a `https://cinnery.nl/api/menu`-ból írja (más forrás:
  `CINNERY_MENU_URL=…`, kihagyás: `--offline`; ha nem elérhető, a meglévő marad), a fotók `assets/img/menu/<id>.jpg`-be kerülnek. Minden elem
  elérhetőként kerül bele, így a JS nélküli robotok (JSON-LD, előrenderelés, llms.txt) mindig a teljes menüt látják. Új elem vagy árváltozás a robotoknál a következő build+telepítéskor jelenik meg.
- Böngészőben a `shop.js` először a beépített `products.js`-ből rajzol, majd lekéri a `/api/menu`-t (Caddy → rota konténer), és újrarajzol: a ma nem elérhető elemek a
  „Not on the menu right now – maybe next time” (`#not-now`) listába kerülnek; az üressé vált blokk/szekció elrejtődik; terméklapon nincs kosár-gomb; a kombó-választóban nem szerepel.
  A már letöltött fotót helyben használja (`assets/img/menu/<id>.jpg`), csak az újat kéri az API-ról. Hiba/tükör (GitHub Pages) esetén a beépített menü marad.
  Helyi próba élő menüvel: `tools/dev-live.mjs` (launch `cinnery-live` a rota repóban, 8793 → Planner-demó).
- Termékadat: id, cat, price EUR, img, gallery, name/desc EN+NL, kombóknál options (kosárkulcs `id|pick|pick`).
- `assets/i18n.js` – minden más szöveg (`en`, `nl`; azonos kulcsok). `assets/app.js` – nyelvváltás, mobil menü, GYIK, nyitva/zárva, Maps kattintásra. `assets/shop.js` – menükártyák, terméklap, kosár (localStorage).
- `assets/img/logo-*.png` – az EREDETI logó, CSS mask-ként (currentColor). Soha ne rajzold újra SVG-be.
- `assets/img/own/` – saját stúdiófotók (minden terméken); `assets/stock/` gitignore-olt, nem használt.
- `robots.txt`, `sitemap.xml`, canonical/og a cinnery.nl-re mutat. A `.htaccess` csak Apache-tárhelyhez kell (a sadroboton a Caddy adja a fejléceket).

## Telepítés
- GitHub Pages a `main` gyökeréből: push után 1–2 perc.
- **Éles: cinnery.nl a sadrobot szerveren** (2026-10-11 óta; www és cinnery.eu oda irányít), tükör: rolls.sadrobot.eu – ugyanaz a `cinnery-web` oldal. Feltöltés: `git archive HEAD` mínusz README/.gitignore/.nojekyll/.htaccess/CLAUDE*.md/tools/ → /deploy-sadrobot skill (`deploy-site.sh … cinnery-web <mappa>`).
- `dist/` (gitignore): laikus útmutatók (Lightspeed-kulcsok, e-mail költöztetés), a régi ZXCS-feltöltő csomag már nem kell.
- Cache-busting: minden helyi CSS/JS/kép link `?v=<verzió>` (most `20261126f`); a `shop.js` a saját `?v`-jét adja tovább a termékfotóknak. Minden asset-változásnál léptesd az összes oldalon: `sed -i '' 's/?v=OLD/?v=NEW/g' index.html product.html cart.html game/index.html nl/spel/index.html` (a játékoldalakon a `data-v`-t is) – különben a böngésző új HTML-t régi CSS-sel kever.
- Git identitás repo-szinten: GitHub noreply cím; céges e-mail nem kerülhet vissza a historyba.
- Korábbi dizájnok: `archive/design-versions` ág (A/B + választó) és `archive-all-variants` tag (mind az öt).

## Mini-játék (Help Us – Roll Run, `game-v0.1` ág)
- `/game/` (EN) és `/nl/spel/` (NL): kézzel írt statikus oldalak (a holland NEM generált, szöveget mindkettőben javíts). Motor: `assets/game/game.js` (canvas, nincs hang, nincs külső kérés), stílus: `assets/game/game.css`. Főoldali sáv `.game-band` + lábléc-link (`game.band.*`, `footer.game`); a build a holland főoldalon `game/` → `spel/`.
- Grafika: `tools/game/gen.py` (Gemini, Keychain `cr-jack-gemini`), nyers képek a gitignore-olt `tools/game/raw/`-ban (kontaktlap: `raw/index.html`). Jóváhagyott kép → `assets/game/<név>.png` + a nevét a `game.js` `ART` listájába; ami nincs benne, azt helyettesítő rajz pótolja. Terv: `tools/game/CONCEPT.md`.
- Teszt: `/game/#fast=40` (40× gyorsítás). A rekord a `cinnery-game-record` localStorage-kulcsban van (a kosáron kívül egyedül ez).

## Nyitvatartás
- 2026-10-17 óta Krisz kérésére **nincs nyitvatartás a weboldalon** (sem a bento-kártyán, sem a Visit részben). Az `app.js` nyitva/zárva-logikája (`HOURS`, `.open-now`) bent maradt, elem híján nem csinál semmit; visszatételhez a `.open-now` elemeket és a `visit.hours`/`visit.mon`… szövegeket kell visszarakni (git-előzmény: `0283b06`).

## Rendelés ki/be (kapcsoló)
- 2026-10-12 óta **KI**: `<html lang="en" class="no-ordering">` az `index.html`, `product.html`, `cart.html` tetején. Ilyenkor csak árak látszanak: nincs kosár ikon, „Add to cart”/„Choose”/sor-gomb, lebegő kosársáv, rendelési panel és „order ahead” GYIK; a `cart.html` a menüre irányít; a fejlécben „See the menu” van. A `tools/build.mjs` ilyenkor az előrenderelt HTML-ben kiüríti az `.order-only` elemek `data-i18n` szövegét (JS nélküli lánctalpasok ne lássanak „Order now”-t); a böngészőben az `app.js` visszatölti. Visszakapcsolás után futtasd a buildet, és a szöveg visszakerül.
- **Visszakapcsolás** (Krisz ~2026-11 közepére tervezi): a három fájlból töröld a `class="no-ordering"`-t, léptesd a `?v=`-t, teszteld a kosarat és az e-mailes előrendelést, telepítsd. Kód: `ORDERING` a `shop.js`-ben, `.order-only` / `.menu-only` a `base.css`-ben. Bájtra pontos utolsó bekapcsolt állapot: `ordering-2026-10-12` tag.

1. A gyökér (`/`) mindig angolul nyílik, a `/nl/` hollandul (2026-10-31 óta saját URL + hreflang); a főoldali EN/NL gomb a két URL között vált, a termék-/kosároldalak `?lang=nl`-lel öröklik a nyelvet. Nincs mentett nyelv, böngészőnyelv figyelmen kívül; magyar nincs. localStorage csak a kosárhoz és a játék rekordjához.
2. Adatvédelem: betöltéskor nulla harmadik feles kérés (fontok, képek helyben), Google Maps csak a „Show map” kattintásra, CSP meta az `index.html`-ben, külső linkek `noopener noreferrer`. Új külső erőforrás → CSP-t is bővíteni.
3. Fizetés még nincs: a kosár mailto előrendelést nyit (cinnery.nl@gmail.com). Nincs házhozszállítás, nincs WhatsApp.
4. Halal-állítás sehol (a menüben volt bacon roll). A hero alatti kiemelés „Artisan”.
5. Kávé és üdítő: árlista-sor közvetlen kosárba gombbal, terméklap nélkül (kérésre, bár van kávéfotó). Extrák: kompakt fotókártya (`.cards-row`).
6. Dizájn: nincs matrica, animáció, gradiens; nagy lekerekített kártyák, sok fehér tér, Fredoka + Inter. Lábléc: „Site by sadrobot”.
7. Belső jegyzet és TODO nem kerülhet a README-be vagy a kódba.

## Buktatók
- Szövegváltozás mindig mindkét nyelven, azonos kulccsal; új elem `data-i18n` (HTML-es szöveg: `data-i18n-html`).
- Elfelejtett cache-bust → fehér hero-szöveg, hiányzó kép a felhasználónál.
