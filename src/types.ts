export type FulfillmentMode = 'pickup' | 'delivery';

export type PaymentMethod = 'paynow' | 'applepay' | 'card' | 'grabpay';

export type MenuCategoryId =
  | 'all'
  | 'signature-bowls'
  | 'diy-bowl'
  | 'thirst-trap-matcha'
  | 'thirst-trap-coffee'
  | 'smoothies-pints'
  | 'bundles';

export interface ModifierOption {
  id: string;
  name: string;
  priceDelta: number;
  calories?: string;
  isDefault?: boolean;
}

export interface ModifierGroup {
  id: string;
  title: string;
  required: boolean;
  maxSelect: number;
  options: ModifierOption[];
}

export interface MenuItem {
  id: string;
  name: string;
  category: Exclude<MenuCategoryId, 'all'>;
  description: string;
  basePrice: number;
  image: string;
  dietaryLine: string;
  calories: string;
  prepMinutes: number;
  isPopular?: boolean;
  allergens?: string[];
  modifierGroups: ModifierGroup[];
}

export interface SelectedModifier {
  groupId: string;
  groupTitle: string;
  optionId: string;
  optionName: string;
  priceDelta: number;
}

export interface CartItem {
  cartItemId: string;
  menuItemId: string;
  name: string;
  image: string;
  unitBasePrice: number;
  selectedModifiers: SelectedModifier[];
  specialInstructions: string;
  quantity: number;
  lineTotal: number;
}

export interface SavedAddress {
  id: string;
  label: string;
  street: string;
  unit: string;
  postalCode: string;
  notes?: string;
}

export interface MemberAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  points: number;
  tier: 'Belly Recruit' | 'Belly Warrior' | 'Belly Legend';
  savedAddresses: SavedAddress[];
  joinedAt: string;
}

export interface CustomerCheckoutInfo {
  isGuest: boolean;
  memberId?: string;
  name: string;
  phone: string;
  email: string;
  pickupWindow?: string;
  deliveryAddress?: {
    street: string;
    unit: string;
    postalCode: string;
    dropoffNote: string;
  };
}

export type OrderStatusStage =
  | 'confirmed'
  | 'preparing'
  | 'packing'
  | 'ready_or_enroute'
  | 'completed';

export interface OrderTimelineStep {
  stage: OrderStatusStage;
  title: string;
  subtitle: string;
  timestamp: string | null;
  completed: boolean;
  active: boolean;
}

export interface Order {
  id: string;
  queueNumber: string;
  fulfillmentMode: FulfillmentMode;
  outletName: string;
  outletAddress: string;
  items: CartItem[];
  customer: CustomerCheckoutInfo;
  paymentMethod: PaymentMethod;
  utensilsIncluded: boolean;
  promoCode: string | null;
  pointsRedeemed: number;
  pointsEarned: number;
  subtotal: number;
  promoDiscount: number;
  pointsDiscount: number;
  deliveryFee: number;
  total: number;
  status: OrderStatusStage;
  etaMinutes: number;
  estimatedTimeLabel: string;
  riderName?: string;
  riderPlate?: string;
  deliveryProgressPct?: number;
  timeline: OrderTimelineStep[];
  createdAt: string;
  updatedAt: string;
}

export interface OutletInfo {
  brand: string;
  branch: string;
  address: string;
  postalCode: string;
  hours: string;
  rating: number;
  reviewCount: string;
  pickupLeadTime: string;
  deliveryLeadTime: string;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  heroImage: string;
  activePromos: Array<{
    code: string;
    label: string;
    detail: string;
  }>;
}
