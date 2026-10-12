/* Cinnery – product catalogue (single source of truth for the menu, product pages and cart)
   price: EUR. img: path relative to the site root (null = logo tile). tier: Classic | Deluxe | Signature.
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
      'Een lichte cacao-karnemelkswirl met klassieke roomkaasfrosting, bestrooid met red velvet cakekruimels.', { tier: 'Deluxe' }),
    p('biscoff', 'roll', 7.00, R + 'roll-biscoff.jpg', 'Biscoff',
      'Brioche-style dough with Biscoff butter and cookie crumbs, finished with a Biscoff cream cheese frosting.',
      'Brioche-achtig deeg met Biscoff-pasta en koekkruimels, afgewerkt met een Biscoff-roomkaasfrosting.', { tier: 'Deluxe' }),
    p('pistachio', 'roll', 7.50, R + 'roll-pistachio.jpg', 'Pistachio',
      'Brioche-style dough coated with rich pistachio cream and sprinkled with roasted pistachio pieces, covered with pistachio cream cheese frosting.',
      'Brioche-achtig deeg met rijke pistachecrème en geroosterde pistachestukjes, afgedekt met pistache-roomkaasfrosting.', { tier: 'Signature' }),
    p('blueberry-crumble', 'roll', 7.00, R + 'roll-blueberry-crumble.jpg', 'Blueberry Crumble',
      'Filled with cinnamon and blueberries, topped off with our signature cream cheese frosting and homemade blueberry compote.',
      'Gevuld met kaneel en blauwe bessen, afgewerkt met onze signature roomkaasfrosting en huisgemaakte bosbessencompote.', { tier: 'Deluxe' }),
    p('salted-caramel-pecan', 'roll', 7.50, R + 'roll-salted-caramel-pecan.jpg', 'Salted Caramel Pecan',
      'Hand-rolled dough with cinnamon sugar, drizzled with rich salted caramel and topped with crunchy roasted pecans.',
      'Handgerold deeg met kaneelsuiker, overgoten met rijke gezouten karamel en getopt met knapperige geroosterde pecannoten.', { tier: 'Signature' }),

    /* ---- savory rolls ---- */
    p('savory-weekly', 'savory', 7.00, R + 'roll-savory-week.jpg', 'Savory Roll of the Week',
      'Soft, hand-crafted dough filled with a unique flavour combination that changes every week, usually vegetarian. Check our Instagram to find out what it is this week.',
      'Zacht, ambachtelijk deeg gevuld met een unieke smaakcombinatie die elke week wisselt, meestal vegetarisch. Check onze Instagram om te zien welke het deze week is.'),

    /* ---- cookies ---- */
    p('cookie-brown-butter', 'cookie', 5.00, R + 'cookie-brown-butter-sea-salt.jpg', 'Brown Butter Chocolate Chip & Sea Salt',
      'Thick and chewy golden cookie stuffed with premium dark and milk chocolate chunks, sprinkled with sea salt.',
      'Dik en chewy goudbruin koekje vol pure en melkchocoladestukken, bestrooid met zeezout.', { tier: 'Classic' }),
    p('cookie-pistachio', 'cookie', 6.50, R + 'cookie-pistachio.jpg', 'Pistachio',
      'American-style stuffed pistachio and white chocolate cookie, filled with pistachio cream.',
      'Amerikaans gevuld pistache-witte-chocoladekoekje met een vulling van pistachecrème.', { tier: 'Signature' }),
    p('cookie-oatmeal-raisin', 'cookie', 6.00, R + 'cookie-oatmeal-raisin.jpg', 'Oatmeal Raisin & Walnut',
      'Hearty oat cookie packed with juicy raisins, toasted walnuts and a hint of warm cinnamon.',
      'Stevig haverkoekje vol sappige rozijnen, geroosterde walnoten en een vleugje warme kaneel.', { tier: 'Deluxe' }),

    /* ---- offers ---- */
    p('combo-sweet', 'combo', 9.50, R + 'combo-sweet.jpg', 'Sweet Combo',
      'A Classic or Deluxe cinnamon roll or cookie, plus a soft drink. Signature drinks and coffees are not included.',
      'Een Classic of Deluxe cinnamon roll of koekje, plus een frisdrank. Signature-drankjes en koffie zijn niet inbegrepen.',
      { options: [ { key: 'item', label: { en: 'Roll or cookie', nl: 'Roll of koekje' }, from: { cats: ['roll', 'cookie'], tiers: ['Classic', 'Deluxe'] } },
                   { key: 'drink', label: { en: 'Drink', nl: 'Drankje' }, from: { cats: ['soft'] } } ] }),
    p('combo-brunch', 'combo', 9.50, R + 'combo-brunch.jpg', 'Brunch Combo',
      'The savory roll of the week plus a soft drink. Signature drinks and coffees are not included.',
      'De hartige roll van de week plus een frisdrank. Signature-drankjes en koffie zijn niet inbegrepen.',
      { options: [ { key: 'item', label: { en: 'Savory roll', nl: 'Hartige roll' }, from: { cats: ['savory'] } },
                   { key: 'drink', label: { en: 'Drink', nl: 'Drankje' }, from: { cats: ['soft'] } } ] }),
    p('combo-duo', 'combo', 11.50, R + 'combo-duo.jpg', 'Cinnery Duo',
      'A Classic or Deluxe cinnamon roll or cookie, plus a hot choco, an iced matcha or a coffee.',
      'Een Classic of Deluxe cinnamon roll of koekje, plus een hot choco, een iced matcha of een koffie.',
      { options: [ { key: 'item', label: { en: 'Roll or cookie', nl: 'Roll of koekje' }, from: { cats: ['roll', 'cookie'], tiers: ['Classic', 'Deluxe'] } },
                   { key: 'drink', label: { en: 'Drink', nl: 'Drankje' }, from: { cats: ['hotchoco', 'matcha', 'coffee'] } } ] }),

    /* ---- extras ---- */
    p('extra-cream-cheese', 'extra', 2.00, R + 'extra-cream-cheese-icing.jpg', 'Extra Classic Cream Cheese Icing',
      'An extra portion of our classic cream cheese icing on your roll.',
      'Een extra portie van onze klassieke roomkaasglazuur op je roll.'),
    p('extra-whipped-cream', 'extra', 0.50, R + 'hotchoco-hot-choco.jpg', 'Whipped Cream on your Hot Choco',
      'Add a cloud of whipped cream to your Hot Choco.',
      'Een wolk slagroom op je Hot Choco.', { name: { en: 'Whipped Cream on your Hot Choco', nl: 'Slagroom op je Hot Choco' } }),

    /* ---- hot choco collection ---- */
    p('hot-choco', 'hotchoco', 4.50, R + 'hotchoco-hot-choco.jpg', 'Hot Choco',
      'Crafted from the finest premium Dutch cocoa for a rich, velvety chocolate experience. Add whipped cream for €0.50.',
      'Gemaakt van de beste Nederlandse cacao voor een rijke, fluweelzachte chocoladebeleving. Met slagroom voor €0,50 extra.'),
    p('chocomellow', 'hotchoco', 6.00, R + 'hotchoco-chocomellow.jpg', 'Chocomellow',
      'Our signature finest Dutch cocoa topped with a lightly torched marshmallow ring and whipped cream, drizzled with chocolate.',
      'Onze signature Nederlandse cacao met een licht gebrande marshmallowring en slagroom, afgewerkt met chocolade.'),

    /* ---- iced matcha collection ---- */
    p('matcha-blueberry-cheesecake', 'matcha', 6.00, R + 'matcha-blueberry-cheesecake.jpg', 'Iced Blueberry Cheesecake Matcha',
      'Dessert in a glass. Creamy iced matcha layered over a sweet blueberry compote, crowned with a velvety, rich cheesecake-infused cold foam.',
      'Dessert in een glas. Romige iced matcha op een zoete bosbessencompote, met een fluweelzachte cold foam met cheesecakesmaak.'),
    p('matcha-jasmine-honey', 'matcha', 6.00, R + 'matcha-jasmine-salted-honey.jpg', 'Jasmine Matcha with Salted Honey Cold Foam',
      'Ceremonial matcha kissed with fragrant jasmine and a whisper of smooth honey and sea salt cold foam, perfectly balanced with creamy milk or oat milk.',
      'Ceremoniële matcha met een vleugje geurige jasmijn en een cold foam van honing en zeezout, in balans met romige melk of havermelk.'),
    p('matcha-banana-float', 'matcha', 6.00, R + 'matcha-banana-float.jpg', 'Banana Matcha Float',
      'A creamy, vibrant and energizing treat that combines earthy matcha, sweet banana and a hint of rich vanilla.',
      'Een romige, frisse en energieke traktatie met aardse matcha, zoete banaan en een vleugje rijke vanille.'),

    /* ---- coffees ---- */
    p('espresso', 'coffee', 2.90, null, 'Espresso', 'A short, intense shot of our house espresso.', 'Een korte, intense shot van onze huisespresso.'),
    p('espresso-macchiato', 'coffee', 3.10, null, 'Espresso Macchiato', 'Espresso marked with a spoon of milk foam.', 'Espresso met een lepel melkschuim.'),
    p('americano', 'coffee', 3.50, null, 'Americano', 'Espresso lengthened with hot water.', 'Espresso aangelengd met heet water.'),
    p('cappuccino', 'coffee', 3.90, null, 'Cappuccino', 'Espresso with steamed milk and a thick layer of foam.', 'Espresso met gestoomde melk en een dikke laag schuim.'),
    p('latte-macchiato', 'coffee', 4.50, null, 'Latte Macchiato', 'Layers of steamed milk and espresso, topped with foam.', 'Laagjes gestoomde melk en espresso, met een schuimlaag.'),
    p('flat-white', 'coffee', 4.40, null, 'Flat White', 'A double shot with silky, thin steamed milk.', 'Een dubbele shot met zijdezachte gestoomde melk.'),
    p('chai-latte', 'coffee', 4.50, null, 'Chai Latte', 'Spiced chai with steamed milk.', 'Gekruide chai met gestoomde melk.'),
    p('matcha-latte', 'coffee', 4.50, null, 'Matcha Latte', 'Warm matcha with steamed milk.', 'Warme matcha met gestoomde melk.'),

    /* ---- soft drinks ---- */
    p('apple-juice', 'soft', 3.00, null, 'Apple Juice', 'Chilled apple juice.', 'Gekoelde appelsap.', { name: { en: 'Apple Juice', nl: 'Appelsap' } }),
    p('pear-juice', 'soft', 3.00, null, 'Pear Juice', 'Chilled pear juice.', 'Gekoelde perensap.', { name: { en: 'Pear Juice', nl: 'Perensap' } }),
    p('naturfrisk-ginger-ale', 'soft', 3.50, null, 'Naturfrisk Ginger Ale', 'Organic ginger ale.', 'Biologische ginger ale.'),
    p('naturfrisk-elderflower', 'soft', 3.50, null, 'Naturfrisk Elderflower', 'Organic elderflower soda.', 'Biologische vlierbloesemfrisdrank.', { name: { en: 'Naturfrisk Elderflower', nl: 'Naturfrisk Vlierbloesem' } }),
    p('lemonaid-passion-fruit', 'soft', 3.50, null, 'Lemonaid Passion Fruit', 'Organic passion fruit lemonade.', 'Biologische passievruchtlimonade.', { name: { en: 'Lemonaid Passion Fruit', nl: 'Lemonaid Passievrucht' } }),
    p('lemonaid-lime', 'soft', 3.50, null, 'Lemonaid Lime', 'Organic lime lemonade.', 'Biologische limoenlimonade.', { name: { en: 'Lemonaid Lime', nl: 'Lemonaid Limoen' } }),
    p('chari-tea-green', 'soft', 3.50, null, 'Chari Tea Green', 'Organic iced green tea.', 'Biologische ijsthee, groen.'),
    p('chaudfontaine-still', 'soft', 3.00, null, 'Chaudfontaine Still', 'Still mineral water.', 'Plat mineraalwater.', { name: { en: 'Chaudfontaine Still', nl: 'Chaudfontaine Plat' } }),
    p('chaudfontaine-sparkling', 'soft', 3.00, null, 'Chaudfontaine Sparkling', 'Sparkling mineral water.', 'Bruisend mineraalwater.', { name: { en: 'Chaudfontaine Sparkling', nl: 'Chaudfontaine Bruisend' } })
  ];
})();
