# Cinnery mini-játék – koncepció (2026-11-26)

Állapot: **v0.1 végleges grafikával a `game-v0.1` ágon (2026-11-26), élesítés Krisz jóváhagyására vár.** Gemini-költés eddig kb. 11 $ (84 kép). Ág: `game-v0.1`. Belső jegyzet a `tools/` alatt, ezért nem települ.
Minta: CR Jack babgyűjtő (`crackerjack-website`, `jatek-v0.1` ág). Onnan csak a felépítést vesszük át, márkás elemet nem.

## Döntések (Krisz, interjú)
| Téma | Döntés |
|---|---|
| Játékmenet | Automatikus futás, **csak ugrás** (koppintás / szóköz / ↑), hosszan nyomva nagyobbat ugrik. Mobilon egy ujjal játszható. |
| Pálya | 2026-11-26 óta (a lányok szerint túl hosszú volt) **kb. 50 mp, 2 szakasz: Amsterdam → Groningen**; Den Haag kimaradt (a képei a `raw/`-ban megvannak), a végén a groningeni Cinnery pékség. |
| Alapanyagok | **Alap** (1 pont): liszt, cukor, vaj, tojás, élesztő, fahéj. **Különleges** (5 pont, a menü ízei): krémsajt, Biscoff-keksz, pisztácia, áfonya, kakaó (red velvet), karamell + pekándió (a menü 6 ízes csigája szerint; Cookies & Cream csiga nincs a menüben). |
| Akadályok | Bicikli (parkoló/guruló), galamb és sirály (repül), csatorna/tócsa és eső, villamos, kiálló kockakő, tulipánláda (emelvénynek is). |
| Ütközés | **Nincs halál:** ütközéskor elhullat néhány alapanyagot, a kör mindig végigmegy. |
| Főszereplő | **Fiatal női pék** (nem portré): plum kötény, rózsaszín kendő, fahéjcsiga-kitűző, kedves rajzfilmstílus. Egy figura. |
| Sütés | **Gép-sor** a pékségben: beborítja az alapanyagokat → dagaszt → tekercsel → süt → mázaz → kijön a csiga. |
| Eredmény | **„X csigát sütöttél”** + íz: a legtöbbet gyűjtött különleges alapanyag dönti el (nincs különleges → Classic Naked). Saját fotó + link a menübe, saját rekord (localStorage), megosztás (Web Share / link másolása). |
| Jutalom | Csak élmény. **Nincs kupon, ranglista, bejelentkezés, szerver, adatkezelés.** |
| Lassú mód | Kapcsoló; a `prefers-reduced-motion` mellett nincs rázkódás és parallaxis. |
| Hang | **Nincs.** |
| Nyelv, URL | `/game/` (EN) és `/nl/spel/` (NL), hreflang, a meglévő `i18n.js` kulcsaival. |
| Belépési pontok | Láblécben link + **kiemelt sáv a főoldalon**. |
| Grafika | Gemini API (meglévő Keychain-kulcs `cr-jack-gemini`), **≤ 20 $**. Lapos színek, vastag kontúr, Cinnery-paletta (plum, rózsaszín, krém). Claude generál szkripttel, Krisz kontaktlapon választ. Szöveg és logó sehol a képeken (a cégtáblára a valódi logó kerül kódból). |
| Élesítés | Előbb ág + helyi teszt; élesítés (cinnery.nl + rolls.sadrobot.eu) csak Krisz jóváhagyásával. |

## Íz-hozzárendelés
| Különleges alapanyag | Csiga (`products.js` id) |
|---|---|
| krémsajt | `classic-cream-cheese` |
| kakaó | `red-velvet` |
| Biscoff-keksz | `biscoff` |
| pisztácia | `pistachio` |
| karamell + pekándió | `salted-caramel-pecan` |
| áfonya | `blueberry-crumble` |
| – | `classic` |

Csigák száma: minden 6 alapanyagból álló teljes „adag” (mind a 6 alapból 1) = 1 csiga; a maradék különleges alapanyag dönti el az ízt.

## Grafika (kb. 45 kép, képenként 2 változat)
- **Pék:** futás (4 kocka), ugrás fel / le, ütközés, beborítás (2) – 8 kép.
- **Alapanyagok:** 6 alap + 6 különleges ikon – 12 kép.
- **Akadályok, emelvények:** bicikli, galamb, sirály, tócsa, csatorna-szakadék, villamos, kockakő, tulipánláda – 8 kép.
- **Hátterek:** városonként egy távoli (égbolt + sziluett) és egy közeli (utcakép) réteg: Amsterdam (gracht-házak, híd), Den Haag (Binnenhof, Hofvijver), Groningen (Martinitoren, Grote Markt) – 6 kép, vízszintesen ismételhető.
- **Pékség:** homlokzat üres cégtáblával + belső tér a gép-sorral (4 fázis) – 6 kép.
- **Effekt, megosztókép:** csillanás, eső, kész csiga tálon, OG-kép EN/NL – ~4 kép.

## Technika
- Vanilla JS + Canvas, nincs keretrendszer, nincs külső kérés; minden fájl helyben (`assets/game/`).
- CSP: nincs inline script/stílus; a beállítások `data-*`-ból jönnek.
- Valós idejű léptetés (delta time), DPR-korlát, szünet a fül elhagyásakor.
- SEO/AI: az oldal leírása, a szabályok és a menülinkek JS nélkül is a HTML-ben (előrenderelés a `tools/build.mjs`-sel); cím, meta, canonical, OG, JSON-LD (`VideoGame`), sitemap + llms.txt bővítése.
- Ellenőrzés: 320/390/700/882/1024/1150 px, álló és fekvő helyzet, érintés + billentyűzet, konzolhiba nélkül.

## Lépések
1. **Grafika-promptok + generáló szkript** (`tools/game/gen.py`), első kör: pék + alapanyagok → kontaktlap Krisznek.
2. **Motor helyettesítő grafikával** (párhuzamosan): futás, ugrás, ütközés, gyűjtés, 3 szakasz, gép-sor, eredmény.
3. **Oldalak:** `/game/`, `/nl/spel/`, főoldali sáv, lábléc, build-bővítés, cache-bust.
4. **Grafika beillesztése:** vágás, átlátszóság, talpvonal, sprite-lapok.
5. Helyi teszt → Krisz jóváhagyása → telepítés (`/deploy-sadrobot`).

## Kiválasztott képek (2026-11-26)
Pék: `baker-sheet-a` modell (Krisz). A többit két alágens-ellenőrzés javasolta, Krisz felülbírálhatja: a lista a `tools/game/cut.py` `PICK` szótárában van, csere után `python3 tools/game/cut.py`.
