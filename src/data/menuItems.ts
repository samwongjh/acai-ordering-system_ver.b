import {CartItem} from '../types/checkout';

export const INITIAL_CART_ITEMS: CartItem[] = [
  {
    id: 'miso-salmon-bowl',
    name: 'Miso Salmon Grain Bowl',
    subtitle: 'Charred broccolini · sesame farro',
    price: 18.5,
    quantity: 1,
    image: '/src/assets/images/dish_miso_grain_bowl_1795161190979.jpg',
  },
  {
    id: 'harissa-flatbread',
    name: 'Harissa Chicken Flatbread',
    subtitle: 'Pickled onion · whipped herb yogurt',
    price: 15.0,
    quantity: 1,
    image: '/src/assets/images/dish_harissa_flatbread_1795161190418.jpg',
  },
  {
    id: 'yuzu-iced-tea',
    name: 'Sparkling Yuzu Honey Tea',
    subtitle: 'Fresh rosemary · chilled citrus',
    price: 6.5,
    quantity: 1,
    image: '/src/assets/images/dish_yuzu_iced_tea_1795161190018.jpg',
  },
];

export const CART_PRESETS: Record<
  'solo' | 'duo' | 'group',
  {label: string; quantities: Record<string, number>}
> = {
  solo: {
    label: 'Solo Order',
    quantities: {
      'miso-salmon-bowl': 1,
      'harissa-flatbread': 0,
      'yuzu-iced-tea': 1,
    },
  },
  duo: {
    label: 'Duo Order',
    quantities: {
      'miso-salmon-bowl': 1,
      'harissa-flatbread': 1,
      'yuzu-iced-tea': 1,
    },
  },
  group: {
    label: 'Team Spread',
    quantities: {
      'miso-salmon-bowl': 3,
      'harissa-flatbread': 2,
      'yuzu-iced-tea': 3,
    },
  },
};
