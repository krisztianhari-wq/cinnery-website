/* Cinnery – product catalogue (single source of truth for the menu, product pages and cart)
   price: EUR. img: path relative to the site root (null = logo tile). tier: Classic | De Luxe | Signature.
   options (combos): each option lets the customer pick one product that matches `from`. */
(function () {
  const R = 'assets/img/own/', S = 'assets/img/stock/';
  const p = (id, cat, price, img, name, en, nl, extra) => Object.assign({ id, cat, price, img, name: { en: name, nl: name }, desc: { en, nl } }, extra || {});

  window.CINNERY_PRODUCTS = [
    /* ---- cinnamon rolls ---- */
    p('classic', 'roll', 5.90, R + 'box-open.jpg', 'Classic',
      'Hand-rolled dough with cinnamon sugar, finished with a light, translucent classic glaze.',
      'Handgerold deeg met kaneelsuiker, afgewerkt met een lichte, doorschijnende klassieke glazuur.', { tier: 'Classic' }),
    p('red-velvet', 'roll', 6.90, S + '1583527976767-5399024eeb05.jpg', 'Red Velvet',
      'A light cocoa and buttermilk swirl with classic cream cheese frosting, sprinkled with red velvet cake crumbs.',
      'Een lichte cacao-karnemelkswirl met klassieke roomkaasfrosting, bestrooid met red velvet cakekruimels.', { tier: 'De Luxe' }),
    p('biscoff', 'roll', 6.90, S + '1564354151628-01f04c6c40a7.jpg', 'Biscoff',
      'Hand-rolled dough with cinnamon sugar. Glazed with creamy Biscoff cookie butter and topped with caramelized biscuit crumbs.',
      'Handgerold deeg met kaneelsuiker. Geglazuurd met romige Biscoff-pasta en bestrooid met gekarameliseerde koekkruimels.', { tier: 'De Luxe' }),
    p('cookies-cream-roll', 'roll', 6.90, S + '1509365465985-25d11c17e812.jpg', 'Cookies & Cream',
      'Hand-rolled dough with cinnamon sugar, topped with rich vanilla cream glaze and crushed Oreo cookie pieces.',
      'Handgerold deeg met kaneelsuiker, getopt met rijke vanilleroomglazuur en gebroken Oreo-koekjes.', { tier: 'De Luxe' }),
    p('pistachio', 'roll', 7.50, S + '1593872570782-6c6e7069e67e.jpg', 'Pistachio',
      'Hand-rolled dough with cinnamon sugar, coated with rich pistachio cream and sprinkled with roasted pistachio pieces.',
      'Handgerold deeg met kaneelsuiker, bedekt met rijke pistachecrème en bestrooid met geroosterde pistachestukjes.', { tier: 'Signature' }),
    p('salted-caramel-pecan', 'roll', 7.50, S + '1609126979532-0f514232d1a8.jpg', 'Salted Caramel Pecan',
      'Hand-rolled dough with cinnamon sugar, drizzled with rich salted caramel and topped with crunchy roasted pecans.',
      'Handgerold deeg met kaneelsuiker, overgoten met rijke gezouten karamel en getopt met knapperige geroosterde pecannoten.', { tier: 'Signature' }),

    /* ---- savory rolls ---- */
    p('goat-cheese-onion', 'savory', 7.50, null, 'Goat Cheese & Caramelized Onion',
      'Soft, freshly baked dough filled with rich, creamy goat cheese and sweet, slow-caramelized onions for the ultimate savory-sweet balance.',
      'Zacht, vers gebakken deeg gevuld met rijke, romige geitenkaas en zoete, langzaam gekarameliseerde ui: de perfecte balans tussen hartig en zoet.', { badge: 'veg' }),
    p('bacon-cheddar', 'savory', 7.50, null, 'Bacon & Cheddar',
      'Warm, fluffy dough packed with rich melted cheddar cheese, generously topped with crispy, golden-brown roasted bacon bits.',
      'Warm, luchtig deeg vol gesmolten cheddar, royaal getopt met knapperige, goudbruin geroosterde spekjes.'),

    /* ---- cookies ---- */
    p('cookie-chocolate-chip', 'cookie', 4.90, S + '1499636136210-6f4ee915583e.jpg', 'Classic Chocolate Chip',
      'Thick and chewy golden cookie stuffed with premium dark and milk chocolate chunks.',
      'Dik en chewy goudbruin koekje vol pure en melkchocoladestukken.', { tier: 'Classic' }),
    p('cookie-oatmeal-raisin', 'cookie', 5.90, S + '1634188023615-7e08901193b6.jpg', 'Oatmeal Raisin & Walnut',
      'Hearty oat cookie packed with juicy raisins, toasted walnuts and a hint of warm cinnamon.',
      'Stevig haverkoekje vol sappige rozijnen, geroosterde walnoten en een vleugje warme kaneel.', { tier: 'De Luxe' }),
    p('cookie-cookies-cream', 'cookie', 5.90, S + '1558961363-fa8fdf82db35.jpg', 'Cookies & Cream',
      'Rich cocoa cookie dough loaded with white chocolate chips and crunchy Oreo bits.',
      'Rijk cacaokoekjesdeeg vol witte chocoladechips en knapperige Oreo-stukjes.', { tier: 'De Luxe' }),
    p('cookie-pistachio', 'cookie', 6.50, S + '1598839950984-034f6dc7b495.jpg', 'Pistachio',
      'Soft-baked cookie infused with rich pistachio cream and topped with roasted pistachio pieces.',
      'Zacht gebakken koekje met rijke pistachecrème en geroosterde pistachestukjes.', { tier: 'Signature' }),
    p('cookie-biscoff', 'cookie', 6.50, S + '1625876981820-be17a6807189.jpg', 'Biscoff',
      'Soft cookie filled with creamy Biscoff cookie butter and topped with caramelized biscuit crumbs.',
      'Zacht koekje gevuld met romige Biscoff-pasta en getopt met gekarameliseerde koekkruimels.', { tier: 'Signature' }),

    /* ---- offers ---- */
    p('combo-sweet', 'combo', 9.90, R + 'box-closed.jpg', 'Sweet Combo',
      'A Classic or De Luxe cinnamon roll or cookie, plus a soft drink. Signature drinks are not included.',
      'Een Classic of De Luxe cinnamon roll of koekje, plus een frisdrank. Signature-drankjes zijn niet inbegrepen.',
      { options: [ { key: 'item', label: { en: 'Roll or cookie', nl: 'Roll of koekje' }, from: { cats: ['roll', 'cookie'], tiers: ['Classic', 'De Luxe'] } },
                   { key: 'drink', label: { en: 'Drink', nl: 'Drankje' }, from: { cats: ['soft'] } } ] }),
    p('combo-brunch', 'combo', 9.90, null, 'Brunch Combo',
      'A savory roll plus a soft drink. Signature drinks are not included.',
      'Een hartige roll plus een frisdrank. Signature-drankjes zijn niet inbegrepen.',
      { options: [ { key: 'item', label: { en: 'Savory roll', nl: 'Hartige roll' }, from: { cats: ['savory'] } },
                   { key: 'drink', label: { en: 'Drink', nl: 'Drankje' }, from: { cats: ['soft'] } } ] }),
    p('combo-duo', 'combo', 12.90, R + 'choco-chocomellow.jpg', 'Cinnery Duo',
      'A Classic or De Luxe cinnamon roll or cookie, plus a hot choco or iced matcha drink.',
      'Een Classic of De Luxe cinnamon roll of koekje, plus een hot choco of iced matcha.',
      { options: [ { key: 'item', label: { en: 'Roll or cookie', nl: 'Roll of koekje' }, from: { cats: ['roll', 'cookie'], tiers: ['Classic', 'De Luxe'] } },
                   { key: 'drink', label: { en: 'Drink', nl: 'Drankje' }, from: { cats: ['hotchoco', 'matcha'] } } ] }),

    /* ---- hot choco collection ---- */
    p('hot-choco', 'hotchoco', 5.90, R + 'drinks-hot-choco.webp', 'Hot Choco',
      'Crafted from the finest premium Dutch cocoa for a rich, velvety chocolate experience.',
      'Gemaakt van de beste Nederlandse cacao voor een rijke, fluweelzachte chocoladebeleving.'),
    p('chocomellow', 'hotchoco', 6.90, R + 'choco-chocomellow.jpg', 'Chocomellow',
      'Our signature finest Dutch cocoa topped with a lightly torched marshmallow ring.',
      'Onze signature Nederlandse cacao met een licht gebrande marshmallowring.'),
    p('caramellow', 'hotchoco', 6.90, R + 'choco-caramellow.jpg', 'Caramellow',
      'The ultimate comfort: premium Dutch cocoa topped with a torched marshmallow ring and drizzled with rich caramel.',
      'Ultiem comfort: Nederlandse cacao met een gebrande marshmallowring en een laagje rijke karamel.'),
    p('matcha-coco', 'hotchoco', 6.90, R + 'choco-matcha-coco.jpg', 'Matcha Coco',
      'A vibrant blend of premium matcha, creamy coconut milk and white chocolate, finished with a torched marshmallow ring.',
      'Een levendige mix van premium matcha, romige kokosmelk en witte chocolade, afgewerkt met een gebrande marshmallowring.'),

    /* ---- iced matcha collection ---- */
    p('matcha-vanilla-lavender', 'matcha', 6.90, R + 'drinks-matcha.webp', 'Vanilla & Lavender Iced Matcha',
      'Elegant and soothing. Smooth iced matcha infused with a delicate touch of sweet vanilla and calming botanical lavender.',
      'Elegant en rustgevend. Zachte iced matcha met een vleugje zoete vanille en kalmerende lavendel.'),
    p('matcha-blueberry-cheesecake', 'matcha', 6.90, R + 'matcha-blueberry.jpg', 'Blueberry Cheesecake Iced Matcha',
      'Dessert in a glass. Creamy iced matcha layered over a sweet blueberry compote, crowned with a velvety cheesecake cold foam.',
      'Dessert in een glas. Romige iced matcha op een zoete bosbessencompote, met een fluweelzachte cheesecake cold foam.'),
    p('matcha-brown-sugar', 'matcha', 6.90, R + 'matcha-brown-sugar.jpg', 'Brown Sugar & Sea Salt Cream Matcha',
      'Decadent and bold. Deep brown sugar syrup paired with iced milk and matcha, finished with a luscious sea salt cold foam.',
      'Rijk en uitgesproken. Donkere bruine-suikersiroop met ijskoude melk en matcha, afgewerkt met een zeezout cold foam.'),
    p('matcha-pineapple-coco', 'matcha', 6.90, R + 'matcha-pineapple.jpg', 'Pineapple-Coco Iced Matcha',
      'Tropical paradise, piña colada style. Bright, refreshing matcha blended with sweet pineapple and creamy coconut milk.',
      'Tropisch paradijs in piña colada-stijl. Frisse matcha met zoete ananas en romige kokosmelk.'),

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
