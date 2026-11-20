import type { MenuCategoryId, MenuItem, ModifierGroup, OutletInfo } from '../types.ts';

export const HERO_BANNER_IMAGE = '/src/assets/images/hero_summer_acai_banner_1795157412242.jpg';
export const BOWL_CLASSIC_IMAGE = '/src/assets/images/bowl_basic_classic_1795157413194.jpg';
export const BOWL_BISCOFF_IMAGE = '/src/assets/images/bowl_biscoff_nutty_1795157412427.jpg';
export const BOWL_PEACH_IMAGE = '/src/assets/images/bowl_peach_grape_1795157412517.jpg';
export const DRINK_MATCHA_IMAGE = '/src/assets/images/drink_strawberry_matcha_1795157412857.jpg';
export const DRINK_COFFEE_IMAGE = '/src/assets/images/drink_iced_coconut_coffee_1795157411974.jpg';

export const OUTLET_INFO: OutletInfo = {
  brand: 'BellyBelly Good',
  branch: 'Exclusive Flagship',
  address: '28 Keong Saik Road, #01-01',
  postalCode: 'Singapore 089135',
  hours: 'Daily 11:00 AM – 10:00 PM',
  rating: 4.9,
  reviewCount: '1.4k',
  pickupLeadTime: '8–12 mins',
  deliveryLeadTime: '25–35 mins',
  deliveryFee: 3.5,
  freeDeliveryThreshold: 35,
  heroImage: HERO_BANNER_IMAGE,
  activePromos: [
    {
      code: 'BELLY10',
      label: '10% Off Storewide',
      detail: 'Valid on all signature bowls and Thirst Trap drinks at BellyBelly Good.',
    },
    {
      code: 'BELLY5',
      label: 'S$5.00 Off Orders S$25+',
      detail: 'Enjoy S$5 off when your cart subtotal reaches S$25.00.',
    },
  ],
};

export const MENU_CATEGORIES: Array<{ id: MenuCategoryId; label: string }> = [
  { id: 'all', label: 'All Menu' },
  { id: 'signature-bowls', label: 'Signature Bowls' },
  { id: 'diy-bowl', label: 'DIY Bowls' },
  { id: 'thirst-trap-matcha', label: 'Thirst Trap Matcha' },
  { id: 'thirst-trap-coffee', label: 'Thirst Trap Coffee' },
  { id: 'smoothies-pints', label: 'Smoothies & Pints' },
  { id: 'bundles', label: 'Value Bundles' },
];

const BOWL_SIZE_GROUP: ModifierGroup = {
  id: 'size',
  title: 'Bowl Size',
  required: true,
  maxSelect: 1,
  options: [
    { id: 'regular', name: 'Regular (12oz)', priceDelta: 0, isDefault: true },
    { id: 'medium', name: 'Medium (16oz)', priceDelta: 3.0 },
    { id: 'large', name: 'Large Share Bowl (24oz)', priceDelta: 6.5 },
  ],
};

const BOWL_SAUCE_GROUP: ModifierGroup = {
  id: 'drizzle',
  title: 'Complimentary Drizzle Sauce',
  required: true,
  maxSelect: 1,
  options: [
    { id: 'cookie-butter', name: 'Speculoos Cookie Butter', priceDelta: 0, isDefault: true },
    { id: 'almond-butter', name: 'Roasted Almond Butter', priceDelta: 0 },
    { id: 'peanut-butter', name: 'Creamy Peanut Butter', priceDelta: 0 },
    { id: 'pure-honey', name: 'Raw Blossom Honey', priceDelta: 0 },
    { id: 'nutella', name: 'Nutella Hazelnut', priceDelta: 0.8 },
    { id: 'no-sauce', name: 'No Drizzle Sauce', priceDelta: 0 },
  ],
};

const BOWL_ADDONS_GROUP: ModifierGroup = {
  id: 'addons',
  title: 'Extra Toppings & Superfoods',
  required: false,
  maxSelect: 4,
  options: [
    { id: 'extra-granola', name: 'Extra Honey Oat Granola', priceDelta: 1.5 },
    { id: 'biscoff-crunch', name: 'Lotus Biscoff Crumb', priceDelta: 1.8 },
    { id: 'chia-pudding', name: 'Coconut Chia Pudding', priceDelta: 2.0 },
    { id: 'greek-yogurt', name: 'Thick Greek Yogurt Scoop', priceDelta: 2.2 },
    { id: 'fresh-berries', name: 'Extra Strawberries & Blueberries', priceDelta: 2.5 },
  ],
};

const DIY_BASE_GROUP: ModifierGroup = {
  id: 'sorbet-base',
  title: 'Choose Sorbet Base',
  required: true,
  maxSelect: 1,
  options: [
    { id: 'classic-acai', name: '100% Pure Organic Açaí Sorbet', priceDelta: 0, isDefault: true },
    { id: 'earl-grey-swirl', name: 'Earl Grey & Classic Açaí Swirl', priceDelta: 1.2 },
    { id: 'peach-oolong-swirl', name: 'Peach Oolong & Açaí Swirl', priceDelta: 1.2 },
  ],
};

const DRINK_MILK_GROUP: ModifierGroup = {
  id: 'milk',
  title: 'Milk Selection',
  required: true,
  maxSelect: 1,
  options: [
    { id: 'fresh-milk', name: 'Chilled Fresh Dairy Milk', priceDelta: 0, isDefault: true },
    { id: 'oatside', name: 'Oatside Barista Oat Milk', priceDelta: 1.0 },
    { id: 'coconut-milk', name: 'Tropical Coconut Milk', priceDelta: 0.8 },
  ],
};

const DRINK_ICE_SUGAR_GROUP: ModifierGroup = {
  id: 'ice-level',
  title: 'Ice & Sweetness',
  required: true,
  maxSelect: 1,
  options: [
    { id: 'regular-ice', name: 'Regular Ice · House Sweetness', priceDelta: 0, isDefault: true },
    { id: 'less-ice', name: 'Less Ice · Less Sweet', priceDelta: 0 },
    { id: 'less-ice-unsweet', name: 'Less Ice · Unsweetened', priceDelta: 0 },
  ],
};

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'basic-bitch',
    name: 'Basic Bitch (Classic)',
    category: 'signature-bowls',
    description:
      'Signature organic açaí sorbet layered with fresh banana, strawberries, blueberries, red dragonfruit, crunchy granola, chia seeds, cacao nibs, and coconut flakes.',
    basePrice: 10.5,
    image: BOWL_CLASSIC_IMAGE,
    dietaryLine: 'Vegan · Dairy-Free · Signature',
    calories: '440 kcal',
    prepMinutes: 6,
    isPopular: true,
    allergens: ['Tree Nuts (Granola)'],
    modifierGroups: [BOWL_SIZE_GROUP, BOWL_SAUCE_GROUP, BOWL_ADDONS_GROUP],
  },
  {
    id: 'bust-my-nuts',
    name: 'Bust My Nuts',
    category: 'signature-bowls',
    description:
      'Classic organic açaí sorbet topped with sliced banana, roasted peanut crunch, toasted almond crunch, Lotus Biscoff crumble, Nutella swirl, and honey oat granola.',
    basePrice: 11.9,
    image: BOWL_BISCOFF_IMAGE,
    dietaryLine: 'Nut Lover · Best Seller',
    calories: '560 kcal',
    prepMinutes: 7,
    isPopular: true,
    allergens: ['Peanuts', 'Tree Nuts', 'Dairy', 'Gluten'],
    modifierGroups: [BOWL_SIZE_GROUP, BOWL_SAUCE_GROUP, BOWL_ADDONS_GROUP],
  },
  {
    id: 'oo-shes-peachy',
    name: "Oo She's Peachy",
    category: 'signature-bowls',
    description:
      'Swirled organic açaí and fragrant Peach Oolong sorbet paired with chilled yellow peaches, pitaya cubes, strawberries, and crispy Lotus Biscoff crumbs.',
    basePrice: 12.5,
    image: BOWL_PEACH_IMAGE,
    dietaryLine: 'Seasonal Swirl · Refreshing',
    calories: '420 kcal',
    prepMinutes: 7,
    isPopular: true,
    allergens: ['Gluten', 'Tree Nuts'],
    modifierGroups: [BOWL_SIZE_GROUP, BOWL_SAUCE_GROUP, BOWL_ADDONS_GROUP],
  },
  {
    id: 'wow-graaape',
    name: 'Wow Graaape!',
    category: 'signature-bowls',
    description:
      'Pure Brazilian açaí sorbet crowned with crisp seedless ruby grapes, ripe strawberries, juicy peaches, banana, toasted granola, and superfood seeds.',
    basePrice: 11.5,
    image: BOWL_PEACH_IMAGE,
    dietaryLine: 'Vegan · Fruit-Forward',
    calories: '410 kcal',
    prepMinutes: 6,
    allergens: ['Tree Nuts'],
    modifierGroups: [BOWL_SIZE_GROUP, BOWL_SAUCE_GROUP, BOWL_ADDONS_GROUP],
  },
  {
    id: 'gossip-gearl',
    name: 'Gossip Gearl',
    category: 'signature-bowls',
    description:
      'Velvety Earl Grey infused sorbet swirled with classic organic açaí, topped with strawberries, blueberries, banana coins, cacao nibs, and oat granola.',
    basePrice: 12.5,
    image: BOWL_CLASSIC_IMAGE,
    dietaryLine: 'Earl Grey Swirl · House Special',
    calories: '435 kcal',
    prepMinutes: 7,
    allergens: ['Tree Nuts'],
    modifierGroups: [BOWL_SIZE_GROUP, BOWL_SAUCE_GROUP, BOWL_ADDONS_GROUP],
  },
  {
    id: 'diy-belly-bowl',
    name: 'DIY Belly Bowl',
    category: 'diy-bowl',
    description:
      'Craft your own BellyBelly Good bowl from scratch. Pick your sorbet base, signature drizzle, and load up with fresh fruits, nut crunches, or chia pudding.',
    basePrice: 9.5,
    image: BOWL_CLASSIC_IMAGE,
    dietaryLine: 'Customizable · Vegan Base',
    calories: '360+ kcal',
    prepMinutes: 8,
    isPopular: true,
    allergens: ['Customizable'],
    modifierGroups: [BOWL_SIZE_GROUP, DIY_BASE_GROUP, BOWL_SAUCE_GROUP, BOWL_ADDONS_GROUP],
  },
  {
    id: 'thirst-strawberry-matcha',
    name: 'Ice Strawberry Matcha',
    category: 'thirst-trap-matcha',
    description:
      'Hand-whisked ceremonial Uji matcha layered over cold milk and chunky house-macerated strawberry compote. Bright, earthy, and naturally sweet.',
    basePrice: 8.5,
    image: DRINK_MATCHA_IMAGE,
    dietaryLine: 'Thirst Trap · Ceremonial Uji',
    calories: '240 kcal',
    prepMinutes: 4,
    isPopular: true,
    allergens: ['Dairy (Oat option available)'],
    modifierGroups: [DRINK_MILK_GROUP, DRINK_ICE_SUGAR_GROUP],
  },
  {
    id: 'thirst-pistachio-matcha',
    name: 'Ice Pistachio Matcha',
    category: 'thirst-trap-matcha',
    description:
      'Roasted Sicilian pistachio cream folded into chilled milk and topped with a vibrant emerald float of cold-whisked ceremonial matcha.',
    basePrice: 9.2,
    image: DRINK_MATCHA_IMAGE,
    dietaryLine: 'Thirst Trap · Nutty & Rich',
    calories: '295 kcal',
    prepMinutes: 5,
    allergens: ['Tree Nuts', 'Dairy'],
    modifierGroups: [DRINK_MILK_GROUP, DRINK_ICE_SUGAR_GROUP],
  },
  {
    id: 'thirst-coconut-latte',
    name: 'Ice Coconut Latte',
    category: 'thirst-trap-coffee',
    description:
      'Double shot of 100% Arabica espresso poured over chilled tropical coconut milk and toasted coconut flakes. Smooth, creamy, and lightly caramelized.',
    basePrice: 7.5,
    image: DRINK_COFFEE_IMAGE,
    dietaryLine: 'Thirst Trap · 100% Arabica',
    calories: '190 kcal',
    prepMinutes: 4,
    isPopular: true,
    modifierGroups: [DRINK_ICE_SUGAR_GROUP],
  },
  {
    id: 'thirst-pistachio-macho',
    name: 'Pistachio Macho Latte',
    category: 'thirst-trap-coffee',
    description:
      'Rich double espresso balanced with house-whipped pistachio foam and silky milk for a bold, nutty afternoon pick-me-up.',
    basePrice: 8.2,
    image: DRINK_COFFEE_IMAGE,
    dietaryLine: 'Thirst Trap · Signature Espresso',
    calories: '270 kcal',
    prepMinutes: 4,
    allergens: ['Tree Nuts', 'Dairy'],
    modifierGroups: [DRINK_MILK_GROUP, DRINK_ICE_SUGAR_GROUP],
  },
  {
    id: 'acai-berry-smoothie',
    name: 'Organic Açaí Smoothie (16oz)',
    category: 'smoothies-pints',
    description:
      'Blended pure organic açaí pulp with ripe bananas, mixed forest berries, and organic chia seeds. Zero refined sugar added.',
    basePrice: 8.9,
    image: BOWL_CLASSIC_IMAGE,
    dietaryLine: 'Vegan · No Refined Sugar',
    calories: '310 kcal',
    prepMinutes: 4,
    modifierGroups: [
      {
        id: 'boost',
        title: 'Optional Smoothie Boost',
        required: false,
        maxSelect: 2,
        options: [
          { id: 'protein', name: 'Plant Pea Protein Scoop', priceDelta: 2.0 },
          { id: 'peanut-blend', name: 'Blended Peanut Butter', priceDelta: 1.5 },
        ],
      },
    ],
  },
  {
    id: 'takeaway-acai-pint',
    name: 'Takeaway Açaí Pint (16oz)',
    category: 'smoothies-pints',
    description:
      'Chilled insulated pint of our signature 100% organic Brazilian açaí sorbet. Ready to scoop at home for two to three servings.',
    basePrice: 16.9,
    image: BOWL_BISCOFF_IMAGE,
    dietaryLine: 'Vegan · Freezer Friendly',
    calories: '580 kcal / pint',
    prepMinutes: 3,
    modifierGroups: [
      {
        id: 'pint-flavour',
        title: 'Sorbet Pint Flavour',
        required: true,
        maxSelect: 1,
        options: [
          { id: 'classic', name: 'Classic Pure Açaí', priceDelta: 0, isDefault: true },
          { id: 'earl-grey', name: 'Earl Grey Açaí Swirl', priceDelta: 1.0 },
          { id: 'peach-oolong', name: 'Peach Oolong Swirl', priceDelta: 1.0 },
        ],
      },
    ],
  },
  {
    id: 'signature-duo-bundle',
    name: 'Signature Bowl + Matcha Set',
    category: 'bundles',
    description:
      'One Regular Basic Bitch (Classic) Açaí Bowl paired with one 16oz Ice Strawberry Matcha. Curated BellyBelly Good combo savings.',
    basePrice: 17.8,
    image: HERO_BANNER_IMAGE,
    dietaryLine: 'Combo · Save S$1.20',
    calories: '680 kcal',
    prepMinutes: 8,
    isPopular: true,
    allergens: ['Tree Nuts', 'Dairy'],
    modifierGroups: [BOWL_SAUCE_GROUP, DRINK_MILK_GROUP],
  },
];
