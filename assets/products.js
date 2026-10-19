/* Cinnery – product catalogue (single source of truth for the menu, product pages and cart)
   price: EUR. img: path relative to the site root (null = logo tile). tier: Classic (only the two classic rolls; the Sweet Combo uses it). gallery: photos that take turns on the card.
   options (combos): each option lets the customer pick one product that matches `from`. */
(function () {
  const R = 'assets/img/own/';
  const p = (id, cat, price, img, name, en, nl, extra) => Object.assign({ id, cat, price, img, name: { en: name, nl: name }, desc: { en, nl } }, extra || {});

  window.CINNERY_PRODUCTS = [
    /* ---- cinnamon rolls ---- */
    p('classic', 'roll', 6.00, R + 'roll-classic-naked.jpg', 'Classic Naked',
      'Soft brioche-style roll with cinnamon sugar, finished with a light, translucent classic glaze.',
      'Zachte brioche-achtige roll met kaneelsuiker, afgewerkt met een lichte, doorschijnende klassieke glazuur.', { tier: 'Classic' }),
    p('classic-cream-cheese', 'roll', 6.00, R + 'roll-classic-cream-cheese.jpg', 'Classic Cream Cheese',
      'Soft brioche-style roll with cinnamon sugar, topped with rich and tangy cream cheese frosting.',
      'Zachte brioche-achtige roll met kaneelsuiker, getopt met rijke, licht friszure roomkaasfrosting.', { tier: 'Classic' }),
    p('red-velvet', 'roll', 7.00, R + 'roll-red-velvet.jpg', 'Red Velvet',
      'A light cocoa and buttermilk swirl with classic cream cheese frosting, sprinkled with red velvet cake crumbs.',
      'Een lichte cacao-karnemelkswirl met klassieke roomkaasfrosting, bestrooid met red velvet cakekruimels.'),
    p('biscoff', 'roll', 7.00, R + 'roll-biscoff.jpg', 'Biscoff',
      'Brioche-style dough with Biscoff butter and cookie crumbs, finished with a Biscoff cream cheese frosting.',
      'Brioche-achtig deeg met Biscoff-pasta en koekkruimels, afgewerkt met een Biscoff-roomkaasfrosting.'),
    p('pistachio', 'roll', 7.00, R + 'roll-pistachio.jpg', 'Pistachio',
      'Brioche-style dough coated with rich pistachio cream and sprinkled with roasted pistachio pieces, covered with pistachio cream cheese frosting.',
      'Brioche-achtig deeg met rijke pistachecrème en geroosterde pistachestukjes, afgedekt met pistache-roomkaasfrosting.'),
    p('salted-caramel-pecan', 'roll', 7.00, R + 'roll-salted-caramel-pecan.jpg', 'Salted Caramel Pecan',
      'Hand-rolled dough with cinnamon sugar, drizzled with rich salted caramel and topped with crunchy roasted pecans.',
      'Handgerold deeg met kaneelsuiker, overgoten met rijke gezouten karamel en getopt met knapperige geroosterde pecannoten.'),
    p('cookies-cream-roll', 'roll', 7.00, R + 'roll-cookies-cream.jpg', 'Cookies & Cream',
      'Hand-rolled dough with cinnamon sugar, topped with rich vanilla cream glaze and crushed cookie pieces.',
      'Handgerold deeg met kaneelsuiker, getopt met rijke vanilleroomglazuur en gebroken koekjesstukjes.'),
    p('cranberry', 'roll', 7.00, null, 'Cranberries',
      'Soft cinnamon roll with tangy cranberries swirled through the dough.',
      'Zachte cinnamon roll met friszure cranberries door het deeg gedraaid.'),
    p('blueberry-crumble', 'roll', 7.00, R + 'roll-blueberry-crumble.jpg', 'Blueberry Crumble',
      'Filled with cinnamon and blueberries, topped off with our signature cream cheese frosting and homemade blueberry compote.',
      'Gevuld met kaneel en blauwe bessen, afgewerkt met onze signature roomkaasfrosting en huisgemaakte bosbessencompote.'),

    /* ---- savory rolls ---- */
    p('savory-weekly', 'savory', 7.00, R + 'roll-savory-week.jpg', 'Weekly Rotating Flavour',
      'Our savory roll changes every week. Ask our staff about this week\'s flavour.',
      'Onze hartige roll wisselt elke week. Vraag ons team naar de smaak van deze week.',
      { name: { en: 'Weekly Rotating Flavour', nl: 'Wekelijks wisselende smaak' } }),

    /* ---- cookies: one rotating cookie; the photos take turns ---- */
    p('cookie-of-the-day', 'cookie', 5.00, R + 'cookie-brown-butter-sea-salt.jpg', 'Cookie of the Day',
      'A rotating flavour, baked fresh every day. Ask our staff about today\'s cookie.',
      'Elke dag een andere smaak, vers gebakken. Vraag ons team naar het koekje van vandaag.',
      { name: { en: 'Cookie of the Day', nl: 'Koekje van de dag' },
        gallery: ['cookie-brown-butter-sea-salt.jpg', 'cookie-pistachio.jpg', 'cookie-oatmeal-raisin.jpg', 'cookie-biscoff.jpg', 'cookie-cookies-cream.jpg', 'cookie-chocolate-chip.jpg'].map(x => R + x) }),

    /* ---- offers ---- */
    p('combo-sweet', 'combo', 8.90, R + 'combo-sweet.jpg', 'Sweet Combo',
      'A classic cinnamon roll plus any coffee or soft drink. Specialty drinks are not included.',
      'Een klassieke cinnamon roll plus een koffie of frisdrank naar keuze. Specialty drinks zijn niet inbegrepen.',
      { options: [ { key: 'item', label: { en: 'Classic roll', nl: 'Klassieke roll' }, from: { cats: ['roll'], tiers: ['Classic'] } },
                   { key: 'drink', label: { en: 'Drink', nl: 'Drankje' }, from: { cats: ['coffee', 'soft'] } } ] }),
    p('combo-brunch', 'combo', 9.90, R + 'combo-brunch.jpg', 'Brunch Combo',
      'The savory roll of the week plus any coffee or soft drink. Specialty drinks are not included.',
      'De hartige roll van de week plus een koffie of frisdrank naar keuze. Specialty drinks zijn niet inbegrepen.',
      { options: [ { key: 'item', label: { en: 'Savory roll', nl: 'Hartige roll' }, from: { cats: ['savory'] } },
                   { key: 'drink', label: { en: 'Drink', nl: 'Drankje' }, from: { cats: ['coffee', 'soft'] } } ] }),

    /* ---- coffees & teas ---- */
    p('espresso', 'coffee', 2.90, null, 'Espresso', 'A short, intense shot of our house espresso.', 'Een korte, intense shot van onze huisespresso.'),
    p('espresso-macchiato', 'coffee', 3.10, null, 'Espresso Macchiato', 'Espresso marked with a spoon of milk foam.', 'Espresso met een lepel melkschuim.'),
    p('americano', 'coffee', 3.50, null, 'Americano', 'Espresso lengthened with hot water.', 'Espresso aangelengd met heet water.'),
    p('cappuccino', 'coffee', 3.90, null, 'Cappuccino', 'Espresso with steamed milk and a thick layer of foam.', 'Espresso met gestoomde melk en een dikke laag schuim.'),
    p('flat-white', 'coffee', 4.40, null, 'Flat White', 'A double shot with silky, thin steamed milk.', 'Een dubbele shot met zijdezachte gestoomde melk.'),
    p('latte-macchiato', 'coffee', 4.50, null, 'Latte Macchiato', 'Layers of steamed milk and espresso, topped with foam.', 'Laagjes gestoomde melk en espresso, met een schuimlaag.'),
    p('iced-latte-macchiato', 'coffee', 4.50, null, 'Iced Latte Macchiato', 'Espresso and cold milk over ice.', 'Espresso en koude melk met ijs.'),
    p('tea', 'coffee', 2.90, null, 'Tea – Earl Grey, Jasmine, Mint, Red Fruit', 'Earl Grey, jasmine, mint or red fruit tea.', 'Earl Grey, jasmijn, munt of rode vruchten.',
      { name: { en: 'Tea – Earl Grey, Jasmine, Mint, Red Fruit', nl: 'Thee – Earl Grey, jasmijn, munt, rode vruchten' } }),

    /* ---- specialty drinks (not part of the combos) ---- */
    p('chai-latte', 'specialty', 4.50, null, 'Chai Latte', 'Spiced chai with steamed milk.', 'Gekruide chai met gestoomde melk.'),
    p('matcha-latte', 'specialty', 4.50, null, 'Matcha Latte', 'Warm matcha with steamed milk.', 'Warme matcha met gestoomde melk.'),
    p('iced-matcha-latte', 'specialty', 4.50, null, 'Iced Matcha Latte', 'Matcha with cold milk over ice.', 'Matcha met koude melk en ijs.'),
    p('pumpkin-spice-matcha-latte', 'specialty', 4.50, null, 'Pumpkin Spice Matcha Latte', 'Matcha latte with warm pumpkin spice.', 'Matcha latte met warme pumpkin spice.'),

    /* ---- soft drinks ---- */
    p('apple-juice', 'soft', 3.00, null, 'Apple Juice', 'Chilled apple juice.', 'Gekoelde appelsap.', { name: { en: 'Apple Juice', nl: 'Appelsap' } }),
    p('pear-juice', 'soft', 3.00, null, 'Pear Juice', 'Chilled pear juice.', 'Gekoelde perensap.', { name: { en: 'Pear Juice', nl: 'Perensap' } }),
    p('naturfrisk-ginger-ale', 'soft', 3.50, null, 'Naturfrisk Ginger Ale', 'Organic ginger ale.', 'Biologische ginger ale.'),
    p('naturfrisk-elderflower', 'soft', 3.50, null, 'Naturfrisk Vlierbloesem', 'Organic elderflower soda.', 'Biologische vlierbloesemfrisdrank.'),
    p('lemonaid-passion-fruit', 'soft', 3.50, null, 'Lemonaid Passion Fruit', 'Organic passion fruit lemonade.', 'Biologische passievruchtlimonade.'),
    p('lemonaid-lime', 'soft', 3.50, null, 'Lemonaid Lime', 'Organic lime lemonade.', 'Biologische limoenlimonade.'),
    p('chari-tea-green', 'soft', 3.50, null, 'Chari Tea Green', 'Organic iced green tea.', 'Biologische ijsthee, groen.'),
    p('chaudfontaine-still', 'soft', 3.00, null, 'Chaudfontaine Still Water', 'Still mineral water.', 'Plat mineraalwater.', { name: { en: 'Chaudfontaine Still Water', nl: 'Chaudfontaine Plat Water' } }),
    p('chaudfontaine-sparkling', 'soft', 3.00, null, 'Chaudfontaine Sparkling Water', 'Sparkling mineral water.', 'Bruisend mineraalwater.', { name: { en: 'Chaudfontaine Sparkling Water', nl: 'Chaudfontaine Bruisend Water' } })
  ];
})();
