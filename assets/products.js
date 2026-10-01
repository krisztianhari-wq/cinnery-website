/* Cinnery – product catalogue (single source of truth for the menu, product pages and cart)
   price: EUR. img: path relative to the site root (null = logo tile). tier: Classic | De Luxe | Signature.
   options (combos): each option lets the customer pick one product that matches `from`. */
(function () {
  const R = 'assets/img/own/', S = 'assets/img/stock/';
  const p = (id, cat, price, img, name, en, nl, extra) => Object.assign({ id, cat, price, img, name: { en: name, nl: name }, desc: { en, nl } }, extra || {});

  window.CINNERY_PRODUCTS = [
    /* ---- cinnamon rolls ---- */
    p('classic', 'roll', 5.90, R + 'roll-classic-naked.jpg', 'Classic Naked',
      'Hand-rolled dough with cinnamon sugar, finished with a light, translucent classic glaze.',
      'Handgerold deeg met kaneelsuiker, afgewerkt met een lichte, doorschijnende klassieke glazuur.', { tier: 'Classic' }),
    p('classic-cream-cheese', 'roll', 5.90, R + 'roll-classic-cream-cheese.jpg', 'Classic Cream Cheese',
      'Soft, hand-rolled dough with cinnamon sugar, topped with rich and tangy cream cheese frosting.',
      'Zacht, handgerold deeg met kaneelsuiker, getopt met rijke, licht friszure roomkaasfrosting.', { tier: 'Classic' }),
    p('red-velvet', 'roll', 6.90, R + 'roll-red-velvet.jpg', 'Red Velvet',
      'A light cocoa and buttermilk swirl with classic cream cheese frosting, sprinkled with red velvet cake crumbs.',
      'Een lichte cacao-karnemelkswirl met klassieke roomkaasfrosting, bestrooid met red velvet cakekruimels.', { tier: 'De Luxe' }),
    p('biscoff', 'roll', 6.90, R + 'roll-biscoff.jpg', 'Biscoff',
      'Hand-rolled dough with cinnamon sugar. Glazed with creamy Biscoff cookie butter and topped with caramelized biscuit crumbs.',
      'Handgerold deeg met kaneelsuiker. Geglazuurd met romige Biscoff-pasta en bestrooid met gekarameliseerde koekkruimels.', { tier: 'De Luxe' }),
    p('cookies-cream-roll', 'roll', 6.90, R + 'roll-cookies-cream.jpg', 'Cookies & Cream',
      'Hand-rolled dough with cinnamon sugar, topped with rich vanilla cream glaze and crushed cookie pieces.',
      'Handgerold deeg met kaneelsuiker, getopt met rijke vanilleroomglazuur en gebroken koekjesstukjes.', { tier: 'De Luxe' }),
    p('pistachio', 'roll', 7.50, R + 'roll-pistachio.jpg', 'Pistachio',
      'Hand-rolled dough with cinnamon sugar, coated with rich pistachio cream and sprinkled with roasted pistachio pieces.',
      'Handgerold deeg met kaneelsuiker, bedekt met rijke pistachecrème en bestrooid met geroosterde pistachestukjes.', { tier: 'Signature' }),
    p('salted-caramel-pecan', 'roll', 7.50, S + '1609126979532-0f514232d1a8.jpg', 'Salted Caramel Pecan',
      'Hand-rolled dough with cinnamon sugar, drizzled with rich salted caramel and topped with crunchy roasted pecans.',
      'Handgerold deeg met kaneelsuiker, overgoten met rijke gezouten karamel en getopt met knapperige geroosterde pecannoten.', { tier: 'Signature' }),

    /* ---- savory rolls ---- */
    p('savory-weekly', 'savory', 7.50, R + 'roll-savory-goat-cheese.jpg', 'Savory Roll of the Week',
      'Soft, hand-crafted dough filled with a unique flavour combination that changes every week, usually vegetarian. Check our Instagram to find out what it is this week.',
      'Zacht, ambachtelijk deeg gevuld met een unieke smaakcombinatie die elke week wisselt, meestal vegetarisch. Check onze Instagram om te zien welke het deze week is.'),

    /* ---- cookies ---- */
    p('cookie-chocolate-chip', 'cookie', 4.90, R + 'cookie-chocolate-chip.jpg', 'Classic Chocolate Chip',
      'Thick and chewy golden cookie stuffed with premium dark and milk chocolate chunks.',
      'Dik en chewy goudbruin koekje vol pure en melkchocoladestukken.', { tier: 'Classic' }),
    p('cookie-oatmeal-raisin', 'cookie', 5.90, R + 'cookie-oatmeal-raisin.jpg', 'Oatmeal Raisin & Walnut',
      'Hearty oat cookie packed with juicy raisins, toasted walnuts and a hint of warm cinnamon.',
      'Stevig haverkoekje vol sappige rozijnen, geroosterde walnoten en een vleugje warme kaneel.', { tier: 'De Luxe' }),
    p('cookie-cookies-cream', 'cookie', 5.90, R + 'cookie-cookies-cream.jpg', 'Cookies & Cream',
      'Rich cocoa cookie dough loaded with white chocolate chips and crunchy cookie bits.',
      'Rijk cacaokoekjesdeeg vol witte chocoladechips en knapperige koekjesstukjes.', { tier: 'De Luxe' }),
    p('cookie-pistachio', 'cookie', 6.50, R + 'cookie-pistachio.jpg', 'Pistachio',
      'Soft-baked cookie infused with rich pistachio cream and topped with roasted pistachio pieces.',
      'Zacht gebakken koekje met rijke pistachecrème en geroosterde pistachestukjes.', { tier: 'Signature' }),
    p('cookie-biscoff', 'cookie', 6.50, R + 'cookie-biscoff.jpg', 'Biscoff',
      'Soft cookie filled with creamy Biscoff cookie butter and topped with caramelized biscuit crumbs.',
      'Zacht koekje gevuld met romige Biscoff-pasta en getopt met gekarameliseerde koekkruimels.', { tier: 'Signature' }),

    /* ---- offers ---- */
    p('combo-sweet', 'combo', 9.90, R + 'combo-box.jpg', 'Sweet Combo',
      'A Classic or De Luxe cinnamon roll or cookie, plus a soft drink. Signature drinks are not included.',
      'Een Classic of De Luxe cinnamon roll of koekje, plus een frisdrank. Signature-drankjes zijn niet inbegrepen.',
      { options: [ { key: 'item', label: { en: 'Roll or cookie', nl: 'Roll of koekje' }, from: { cats: ['roll', 'cookie'], tiers: ['Classic', 'De Luxe'] } },
                   { key: 'drink', label: { en: 'Drink', nl: 'Drankje' }, from: { cats: ['soft'] } } ] }),
    p('combo-brunch', 'combo', 9.90, R + 'roll-savory-goat-cheese-2.jpg', 'Brunch Combo',
      'The savory roll of the week plus a soft drink. Signature drinks are not included.',
      'De hartige roll van de week plus een frisdrank. Signature-drankjes zijn niet inbegrepen.',
      { options: [ { key: 'item', label: { en: 'Savory roll', nl: 'Hartige roll' }, from: { cats: ['savory'] } },
                   { key: 'drink', label: { en: 'Drink', nl: 'Drankje' }, from: { cats: ['soft'] } } ] }),
    p('combo-duo', 'combo', 12.90, R + 'matcha-collection.jpg', 'Cinnery Duo',
      'A Classic or De Luxe cinnamon roll or cookie, plus a hot choco or iced matcha drink.',
      'Een Classic of De Luxe cinnamon roll of koekje, plus een hot choco of iced matcha.',
      { options: [ { key: 'item', label: { en: 'Roll or cookie', nl: 'Roll of koekje' }, from: { cats: ['roll', 'cookie'], tiers: ['Classic', 'De Luxe'] } },
                   { key: 'drink', label: { en: 'Drink', nl: 'Drankje' }, from: { cats: ['hotchoco', 'matcha'] } } ] }),

    /* ---- extras ---- */
    p('extra-cream-cheese', 'extra', 2.00, null, 'Extra Classic Cream Cheese Icing',
      'An extra portion of our classic cream cheese icing on your roll.',
      'Een extra portie van onze klassieke roomkaasglazuur op je roll.'),

    /* ---- hot choco collection ---- */
    p('hot-choco', 'hotchoco', 5.90, R + 'hotchoco-collection-square.jpg', 'Hot Choco',
      'Crafted from the finest premium Dutch cocoa for a rich, velvety chocolate experience.',
      'Gemaakt van de beste Nederlandse cacao voor een rijke, fluweelzachte chocoladebeleving.'),
    p('chocomellow', 'hotchoco', 6.90, R + 'hotchoco-chocomellow.jpg', 'Chocomellow',
      'Our signature finest Dutch cocoa topped with a lightly torched marshmallow ring.',
      'Onze signature Nederlandse cacao met een licht gebrande marshmallowring.'),
    p('caramellow', 'hotchoco', 6.90, R + 'hotchoco-caramellow.jpg', 'Caramellow',
      'The ultimate comfort: premium Dutch cocoa topped with a torched marshmallow ring and drizzled with rich caramel.',
      'Ultiem comfort: Nederlandse cacao met een gebrande marshmallowring en een laagje rijke karamel.'),
    p('matcha-coco', 'hotchoco', 6.90, R + 'hotchoco-matcha-coco.jpg', 'Matcha Coco',
      'A vibrant blend of premium matcha, creamy coconut milk and white chocolate, finished with a torched marshmallow ring.',
      'Een levendige mix van premium matcha, romige kokosmelk en witte chocolade, afgewerkt met een gebrande marshmallowring.'),

    /* ---- iced matcha collection ---- */
    p('matcha-blueberry-cheesecake', 'matcha', 6.90, R + 'matcha-blueberry-cheesecake.jpg', 'Iced Blueberry Cheesecake Matcha',
      'Dessert in a glass. Creamy iced matcha layered over a sweet blueberry compote, crowned with a velvety, rich cheesecake-infused cold foam.',
      'Dessert in een glas. Romige iced matcha op een zoete bosbessencompote, met een fluweelzachte cold foam met cheesecakesmaak.'),
    p('matcha-velvet-jasmine', 'matcha', 6.90, R + 'matcha-velvet-jasmine.jpg', 'Velvet Jasmine Matcha',
      'Ceremonial matcha kissed with fragrant jasmine and a whisper of smooth vanilla, perfectly balanced with creamy milk or oat milk.',
      'Ceremoniële matcha met een vleugje geurige jasmijn en zachte vanille, in balans met romige melk of havermelk.'),
    p('matcha-brown-sugar', 'matcha', 6.90, R + 'matcha-brown-sugar-sea-salt.jpg', 'Brown Sugar & Sea Salt Cream Matcha',
      'Decadent and bold. Deep brown sugar syrup paired with iced milk and matcha, finished with a luscious sea salt cold foam.',
      'Rijk en uitgesproken. Donkere bruine-suikersiroop met ijskoude melk en matcha, afgewerkt met een zeezout cold foam.'),
    p('matcha-banana-float', 'matcha', 6.90, R + 'matcha-banana-float.jpg', 'Banana Matcha Float',
      'A creamy, vibrant and energizing treat that combines earthy matcha, sweet banana and a hint of rich vanilla.',
      'Een romige, frisse en energieke traktatie met aardse matcha, zoete banaan en een vleugje rijke vanille.'),

    /* ---- coffees ---- */
    p('espresso', 'coffee', 3.50, null, 'Espresso', 'A short, intense shot of our house espresso.', 'Een korte, intense shot van onze huisespresso.'),
    p('americano', 'coffee', 3.50, null, 'Americano', 'Espresso lengthened with hot water.', 'Espresso aangelengd met heet water.'),
    p('cortado', 'coffee', 3.90, null, 'Cortado', 'Espresso cut with a little warm milk.', 'Espresso met een scheutje warme melk.'),
    p('cappuccino', 'coffee', 3.90, null, 'Cappuccino', 'Espresso with steamed milk and a thick layer of foam.', 'Espresso met gestoomde melk en een dikke laag schuim.'),
    p('flat-white', 'coffee', 4.40, null, 'Flat White', 'A double shot with silky, thin steamed milk.', 'Een dubbele shot met zijdezachte gestoomde melk.'),
    p('latte', 'coffee', 4.50, null, 'Latte', 'Espresso with plenty of steamed milk and a light foam.', 'Espresso met veel gestoomde melk en een licht schuimlaagje.'),

    /* ---- soft drinks ---- */
    p('apple-juice', 'soft', 3.50, null, 'Apple Juice', 'Chilled apple juice.', 'Gekoelde appelsap.'),
    p('orange-juice', 'soft', 3.50, null, 'Orange Juice', 'Chilled orange juice.', 'Gekoelde sinaasappelsap.'),
    p('coca-cola', 'soft', 3.50, null, 'Coca-Cola', 'Ice-cold Coca-Cola.', 'IJskoude Coca-Cola.'),
    p('coca-cola-zero', 'soft', 3.50, null, 'Coca-Cola Zero', 'Ice-cold Coca-Cola Zero.', 'IJskoude Coca-Cola Zero.'),
    p('chari-tea-black', 'soft', 3.50, null, 'Chari Tea Black', 'Organic iced black tea.', 'Biologische ijsthee, zwart.'),
    p('chari-tea-green', 'soft', 3.50, null, 'Chari Tea Green', 'Organic iced green tea.', 'Biologische ijsthee, groen.'),
    p('water', 'soft', 2.50, null, 'Water', 'Still water.', 'Plat water.'),
    p('sparkling-water', 'soft', 2.50, null, 'Sparkling Water', 'Sparkling water.', 'Bruisend water.')
  ];
})();
