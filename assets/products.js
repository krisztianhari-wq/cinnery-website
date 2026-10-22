/* Cinnery – product catalogue (single source of truth for the menu, product pages and cart)
   price: EUR. img: path relative to the site root (null = logo tile). gallery: photos that take turns on the card.
   options (combos): each option lets the customer pick one product that matches `from` (listed ids, or the given categories, optionally limited to tiers). */
(function () {
  const R = 'assets/img/own/';
  const p = (id, cat, price, img, name, en, nl, extra) => Object.assign({ id, cat, price, img, name: { en: name, nl: name }, desc: { en, nl } }, extra || {});

  window.CINNERY_PRODUCTS = [
    /* ---- cinnamon rolls ---- */
    p('classic', 'roll', 6.00, R + 'roll-classic-naked.jpg', 'Classic Naked',
      'Soft brioche-style roll with cinnamon sugar, finished with a light, translucent classic glaze.',
      'Zachte brioche-achtige roll met kaneelsuiker, afgewerkt met een lichte, doorschijnende klassieke glazuur.'),
    p('classic-cream-cheese', 'roll', 6.00, R + 'roll-classic-cream-cheese.jpg', 'Classic Cream Cheese',
      'Soft brioche-style roll with cinnamon sugar, topped with rich and tangy cream cheese frosting.',
      'Zachte brioche-achtige roll met kaneelsuiker, getopt met rijke, licht friszure roomkaasfrosting.'),
    p('red-velvet', 'roll', 7.00, R + 'roll-red-velvet.jpg', 'Red Velvet',
      'A light cocoa and buttermilk swirl with classic cream cheese frosting, sprinkled with red velvet cake crumbs.',
      'Een lichte cacao-karnemelkswirl met klassieke roomkaasfrosting, bestrooid met red velvet cakekruimels.'),
    p('biscoff', 'roll', 7.00, R + 'roll-biscoff.jpg', 'Biscoff',
      'Brioche-style dough with Biscoff butter and cookie crumbs, finished with a Biscoff cream cheese frosting.',
      'Brioche-achtig deeg met Biscoff-pasta en koekkruimels, afgewerkt met een Biscoff-roomkaasfrosting.'),
    p('pistachio', 'roll', 7.50, R + 'roll-pistachio.jpg', 'Pistachio',
      'Brioche-style dough coated with rich pistachio cream and sprinkled with roasted pistachio pieces, covered with pistachio cream cheese frosting.',
      'Brioche-achtig deeg met rijke pistachecrème en geroosterde pistachestukjes, afgedekt met pistache-roomkaasfrosting.'),
    p('salted-caramel-pecan', 'roll', 7.50, R + 'roll-salted-caramel-pecan.jpg', 'Salted Caramel Pecan',
      'Hand-rolled dough with cinnamon sugar, drizzled with rich salted caramel and topped with crunchy roasted pecans.',
      'Handgerold deeg met kaneelsuiker, overgoten met rijke gezouten karamel en getopt met knapperige geroosterde pecannoten.'),
    p('blueberry-crumble', 'roll', 7.00, R + 'roll-blueberry-crumble.jpg', 'Blueberry Crumble',
      'Filled with cinnamon and blueberries, topped off with our signature cream cheese frosting and homemade blueberry compote.',
      'Gevuld met kaneel en blauwe bessen, afgewerkt met onze signature roomkaasfrosting en huisgemaakte bosbessencompote.'),

    /* ---- savory rolls ---- */
    p('savory-weekly', 'savory', 7.00, R + 'roll-savory-week.jpg', 'Savory Roll – Weekly Rotating Flavour',
      'Our savory roll changes every week. Ask our staff about this week\'s flavour.',
      'Onze hartige roll wisselt elke week. Vraag ons team naar de smaak van deze week.',
      { name: { en: 'Savory Roll – Weekly Rotating Flavour', nl: 'Hartige roll – wekelijks wisselende smaak' } }),

    /* ---- cookies: the flavours change, so the photos take turns ---- */
    p('cookie-classic', 'cookie', 5.00, R + 'cookie-brown-butter-sea-salt.jpg', 'Classic Cookie',
      'Thick, chewy and generously loaded. The flavour changes, ask our staff about today\'s cookie.',
      'Dik, chewy en royaal gevuld. De smaak wisselt, vraag ons team naar het koekje van vandaag.',
      { name: { en: 'Classic Cookie', nl: 'Klassiek koekje' },
        gallery: ['cookie-brown-butter-sea-salt.jpg', 'cookie-chocolate-chip.jpg', 'cookie-oatmeal-raisin.jpg'].map(x => R + x) }),
    p('cookie-stuffed', 'cookie', 5.50, R + 'cookie-pistachio.jpg', 'Stuffed Cookie',
      'A soft cookie with a creamy filling. The flavour changes, ask our staff about today\'s cookie.',
      'Een zacht koekje met een romige vulling. De smaak wisselt, vraag ons team naar het koekje van vandaag.',
      { name: { en: 'Stuffed Cookie', nl: 'Gevuld koekje' },
        gallery: ['cookie-pistachio.jpg', 'cookie-biscoff.jpg', 'cookie-cookies-cream.jpg'].map(x => R + x) }),

    /* ---- offers ---- */
    p('combo-sweet', 'combo', 8.90, R + 'combo-sweet.jpg', 'Sweet Combo',
      'A classic cinnamon roll or any cookie, plus any coffee, tea or soft drink. Specialty drinks and hot chocos are not included.',
      'Een klassieke cinnamon roll of een koekje naar keuze, plus een koffie, thee of frisdrank. Specialty drinks en hot choco zijn niet inbegrepen.',
      { options: [ { key: 'item', label: { en: 'Classic roll or cookie', nl: 'Klassieke roll of koekje' }, from: { ids: ['classic', 'classic-cream-cheese'], cats: ['cookie'] } },
                   { key: 'drink', label: { en: 'Drink', nl: 'Drankje' }, from: { cats: ['coffee', 'soft'] } } ] }),
    p('combo-brunch', 'combo', 9.90, R + 'combo-brunch.jpg', 'Brunch Combo',
      'The savory roll of the week plus any coffee, tea or soft drink. Specialty drinks and hot chocos are not included.',
      'De hartige roll van de week plus een koffie, thee of frisdrank. Specialty drinks en hot choco zijn niet inbegrepen.',
      { options: [ { key: 'item', label: { en: 'Savory roll', nl: 'Hartige roll' }, from: { cats: ['savory'] } },
                   { key: 'drink', label: { en: 'Drink', nl: 'Drankje' }, from: { cats: ['coffee', 'soft'] } } ] }),

    /* ---- extras ---- */
    p('extra-cream-cheese', 'extra', 2.00, R + 'extra-cream-cheese-icing.jpg', 'Extra Classic Cream Cheese Icing',
      'An extra portion of our classic cream cheese icing on your roll.',
      'Een extra portie van onze klassieke roomkaasglazuur op je roll.'),

    /* ---- hot choco collection (not part of the combos) ---- */
    p('hot-choco', 'hotchoco', 5.00, R + 'hotchoco-hot-choco.jpg', 'Hot Choco',
      'Crafted from the finest premium Dutch cocoa for a rich, velvety chocolate experience.',
      'Gemaakt van de beste Nederlandse cacao voor een rijke, fluweelzachte chocoladebeleving.'),
    p('chocomellow', 'hotchoco', 6.00, R + 'hotchoco-chocomellow.jpg', 'Chocomellow',
      'Our signature finest Dutch cocoa topped with a lightly torched marshmallow ring and whipped cream, drizzled with chocolate.',
      'Onze signature Nederlandse cacao met een licht gebrande marshmallowring en slagroom, afgewerkt met chocolade.'),

    /* ---- coffees & teas ---- */
    p('espresso', 'coffee', 2.90, null, 'Espresso', 'A short, intense shot of our house espresso.', 'Een korte, intense shot van onze huisespresso.'),
    p('double-espresso', 'coffee', 4.00, null, 'Double Espresso', 'Two shots of our house espresso.', 'Twee shots van onze huisespresso.'),
    p('espresso-macchiato', 'coffee', 3.10, null, 'Espresso Macchiato', 'Espresso marked with a spoon of milk foam.', 'Espresso met een lepel melkschuim.'),
    p('americano', 'coffee', 3.50, null, 'Americano', 'Espresso lengthened with hot water.', 'Espresso aangelengd met heet water.'),
    p('cappuccino', 'coffee', 3.90, null, 'Cappuccino', 'Espresso with steamed milk and a thick layer of foam.', 'Espresso met gestoomde melk en een dikke laag schuim.'),
    p('latte-macchiato', 'coffee', 4.50, null, 'Latte Macchiato', 'Layers of steamed milk and espresso, topped with foam.', 'Laagjes gestoomde melk en espresso, met een schuimlaag.'),
    p('iced-latte-macchiato', 'coffee', 4.50, null, 'Iced Latte Macchiato', 'Espresso and cold milk over ice.', 'Espresso en koude melk met ijs.'),
    p('flat-white', 'coffee', 4.50, null, 'Flat White', 'A double shot with silky, thin steamed milk.', 'Een dubbele shot met zijdezachte gestoomde melk.'),
    p('tea', 'coffee', 2.90, null, 'Tea – Various Flavours', 'Ask our staff about today\'s teas.', 'Vraag ons team naar de thee van vandaag.',
      { name: { en: 'Tea – Various Flavours', nl: 'Thee – diverse smaken' } }),

    /* ---- specialty drinks (not part of the combos) ---- */
    p('matcha-latte', 'specialty', 4.50, null, 'Matcha Latte', 'Warm matcha with steamed milk.', 'Warme matcha met gestoomde melk.'),
    p('iced-matcha-latte', 'specialty', 4.50, null, 'Iced Matcha Latte', 'Matcha with cold milk over ice.', 'Matcha met koude melk en ijs.'),
    p('chai-latte', 'specialty', 4.50, null, 'Prana Chai Latte', 'Prana chai with steamed milk.', 'Prana chai met gestoomde melk.'),
    p('seasonal-specialty', 'specialty', 6.00, null, 'Seasonal Specialty Drink', 'A seasonal special, ask our staff what it is right now.', 'Een seizoensspecial, vraag ons team wat het nu is.',
      { name: { en: 'Seasonal Specialty Drink', nl: 'Seizoensspecial' } }),

    /* ---- soft drinks ---- */
    p('apple-pear-juice', 'soft', 3.00, null, 'Apple or Pear Juice', 'Chilled apple or pear juice.', 'Gekoelde appel- of perensap.', { name: { en: 'Apple or Pear Juice', nl: 'Appel- of perensap' } }),
    p('naturfrisk-ginger-ale', 'soft', 3.50, null, 'Naturfrisk Ginger Ale', 'Organic ginger ale.', 'Biologische ginger ale.'),
    p('naturfrisk-elderflower', 'soft', 3.50, null, 'Naturfrisk Vlierbloesem', 'Organic elderflower soda.', 'Biologische vlierbloesemfrisdrank.'),
    p('chaudfontaine-still', 'soft', 3.00, null, 'Chaudfontaine Still Water', 'Still mineral water.', 'Plat mineraalwater.', { name: { en: 'Chaudfontaine Still Water', nl: 'Chaudfontaine Plat Water' } }),
    p('chaudfontaine-sparkling', 'soft', 3.00, null, 'Chaudfontaine Sparkling Water', 'Sparkling mineral water.', 'Bruisend mineraalwater.', { name: { en: 'Chaudfontaine Sparkling Water', nl: 'Chaudfontaine Bruisend Water' } }),
    p('lemonaid-passion-fruit', 'soft', 3.50, null, 'Lemonaid Passion Fruit', 'Organic passion fruit lemonade.', 'Biologische passievruchtlimonade.'),
    p('lemonaid-lime', 'soft', 3.50, null, 'Lemonaid Lime', 'Organic lime lemonade.', 'Biologische limoenlimonade.'),
    p('chari-tea-green', 'soft', 3.50, null, 'Chari Tea Green', 'Organic iced green tea.', 'Biologische ijsthee, groen.')
  ];
})();
