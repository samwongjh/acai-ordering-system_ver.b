import type {
  CartItem,
  CustomerCheckoutInfo,
  FulfillmentMode,
  MemberAccount,
  Order,
  OrderStatusStage,
  OrderTimelineStep,
  PaymentMethod,
} from '../types.ts';

interface LocalMember extends MemberAccount {
  password?: string;
}

interface LocalStoreData {
  members: LocalMember[];
  orders: Order[];
  nextQueueSeq: number;
}

const STORE_KEY = 'bellybelly_local_store_v1';
const ACTIVE_MEMBER_KEY = 'bellybelly_active_member_id_v1';

function formatSgTime(date: Date): string {
  return date.toLocaleTimeString('en-SG', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Singapore',
  });
}

function addMinutesLabel(baseDate: Date, mins: number): string {
  const target = new Date(baseDate.getTime() + mins * 60_000);
  return formatSgTime(target);
}

export function computeBellyTier(points: number): MemberAccount['tier'] {
  if (points >= 1000) return 'Belly Legend';
  if (points >= 400) return 'Belly Warrior';
  return 'Belly Recruit';
}

function createInitialTimeline(mode: FulfillmentMode, nowStr: string): OrderTimelineStep[] {
  if (mode === 'pickup') {
    return [
      {
        stage: 'confirmed',
        title: 'Order Confirmed',
        subtitle: 'Sent to BellyBelly Good kitchen',
        timestamp: nowStr,
        completed: true,
        active: false,
      },
      {
        stage: 'preparing',
        title: 'Blending Your Açaí',
        subtitle: 'Scooping fresh organic sorbet & prepping toppings',
        timestamp: null,
        completed: false,
        active: true,
      },
      {
        stage: 'packing',
        title: 'Quality & Toppings Check',
        subtitle: 'Drizzling sauces & sealing chilled cup',
        timestamp: null,
        completed: false,
        active: false,
      },
      {
        stage: 'ready_or_enroute',
        title: 'Ready at Pick-Up Counter',
        subtitle: 'Show your queue code at #01-01 express counter',
        timestamp: null,
        completed: false,
        active: false,
      },
      {
        stage: 'completed',
        title: 'Order Collected',
        subtitle: 'Enjoy your BellyBelly Good bowl',
        timestamp: null,
        completed: false,
        active: false,
      },
    ];
  }

  return [
    {
      stage: 'confirmed',
      title: 'Order Confirmed',
      subtitle: 'Accepted by BellyBelly Good Kitchen',
      timestamp: nowStr,
      completed: true,
      active: false,
    },
    {
      stage: 'preparing',
      title: 'Blending Your Açaí',
      subtitle: 'Fresh fruit slicing & sorbet scooping',
      timestamp: null,
      completed: false,
      active: true,
    },
    {
      stage: 'packing',
      title: 'Insulated Packing',
      subtitle: 'Chilled thermal bag & tamper-seal applied',
      timestamp: null,
      completed: false,
      active: false,
    },
    {
      stage: 'ready_or_enroute',
      title: 'Rider En Route',
      subtitle: 'Courier heading from 28 Keong Saik Rd toward your block',
      timestamp: null,
      completed: false,
      active: false,
    },
    {
      stage: 'completed',
      title: 'Delivered',
      subtitle: 'Dropped off safely at your address',
      timestamp: null,
      completed: false,
      active: false,
    },
  ];
}

function createSeedData(): LocalStoreData {
  const demoMemberId = 'mem_tessa_01';
  const pastOrderDate = new Date(Date.now() - 86_400_000 * 2);
  const pastTimeStr = formatSgTime(pastOrderDate);

  const samplePastOrder: Order = {
    id: 'ORD-8421',
    queueNumber: 'A-391',
    fulfillmentMode: 'pickup',
    outletName: 'BellyBelly Good',
    outletAddress: '28 Keong Saik Road, #01-01, Singapore 089135',
    items: [
      {
        cartItemId: 'seed_item_1',
        menuItemId: 'basic-bitch',
        name: 'Basic Bitch (Classic)',
        image: '/src/assets/images/bowl_basic_classic_1795157413194.jpg',
        unitBasePrice: 10.5,
        selectedModifiers: [
          {
            groupId: 'size',
            groupTitle: 'Bowl Size',
            optionId: 'regular',
            optionName: 'Regular (12oz)',
            priceDelta: 0,
          },
          {
            groupId: 'drizzle',
            groupTitle: 'Complimentary Drizzle Sauce',
            optionId: 'cookie-butter',
            optionName: 'Speculoos Cookie Butter',
            priceDelta: 0,
          },
        ],
        specialInstructions: '',
        quantity: 1,
        lineTotal: 10.5,
      },
      {
        cartItemId: 'seed_item_2',
        menuItemId: 'thirst-strawberry-matcha',
        name: 'Ice Strawberry Matcha',
        image: '/src/assets/images/drink_strawberry_matcha_1795157412857.jpg',
        unitBasePrice: 8.5,
        selectedModifiers: [
          {
            groupId: 'milk',
            groupTitle: 'Milk Selection',
            optionId: 'oatside',
            optionName: 'Oatside Barista Oat Milk',
            priceDelta: 1.0,
          },
          {
            groupId: 'ice-level',
            groupTitle: 'Ice & Sweetness',
            optionId: 'less-ice',
            optionName: 'Less Ice · Less Sweet',
            priceDelta: 0,
          },
        ],
        specialInstructions: '',
        quantity: 1,
        lineTotal: 9.5,
      },
    ],
    customer: {
      isGuest: false,
      memberId: demoMemberId,
      name: 'Tessa Tan',
      phone: '+65 9123 4567',
      email: 'tessa.tan@bellytribe.sg',
      pickupWindow: 'ASAP',
    },
    paymentMethod: 'paynow',
    utensilsIncluded: true,
    promoCode: null,
    pointsRedeemed: 0,
    pointsEarned: 200,
    subtotal: 20.0,
    promoDiscount: 0,
    pointsDiscount: 0,
    deliveryFee: 0,
    total: 20.0,
    status: 'completed',
    etaMinutes: 0,
    estimatedTimeLabel: 'Collected',
    timeline: createInitialTimeline('pickup', pastTimeStr).map((step) => ({
      ...step,
      completed: true,
      active: false,
      timestamp: pastTimeStr,
    })),
    createdAt: pastOrderDate.toISOString(),
    updatedAt: pastOrderDate.toISOString(),
  };

  return {
    members: [
      {
        id: demoMemberId,
        name: 'Tessa Tan',
        email: 'tessa.tan@bellytribe.sg',
        phone: '+65 9123 4567',
        points: 420,
        tier: 'Belly Warrior',
        savedAddresses: [
          {
            id: 'addr_1',
            label: 'Home · Everton Park',
            street: '12 Everton Park',
            unit: '#08-14',
            postalCode: '080012',
            notes: 'Leave on shoe rack by the door',
          },
          {
            id: 'addr_2',
            label: 'Office · Tanjong Pagar',
            street: '10 Anson Road, International Plaza',
            unit: 'Level 14 Lobby',
            postalCode: '079903',
            notes: 'Call upon arrival at drop-off bay',
          },
        ],
        joinedAt: new Date(Date.now() - 86_400_000 * 90).toISOString(),
      },
    ],
    orders: [samplePastOrder],
    nextQueueSeq: 405,
  };
}

let memoryStore: LocalStoreData | null = null;

function loadStore(): LocalStoreData {
  if (memoryStore) return memoryStore;
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as LocalStoreData;
      if (parsed && Array.isArray(parsed.members) && Array.isArray(parsed.orders)) {
        memoryStore = parsed;
        return parsed;
      }
    }
  } catch {
    // Fallback to fresh seed data
  }
  const seeded = createSeedData();
  saveStore(seeded);
  return seeded;
}

function saveStore(data: LocalStoreData): void {
  memoryStore = data;
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage quota errors
  }
}

function toMemberAccount(m: LocalMember): MemberAccount {
  const { password: _ignored, ...rest } = m;
  return {
    ...rest,
    tier: computeBellyTier(rest.points),
  };
}

export function getActiveLocalMember(): MemberAccount | null {
  try {
    const id = localStorage.getItem(ACTIVE_MEMBER_KEY);
    if (!id) return null;
    const store = loadStore();
    const found = store.members.find((m) => m.id === id);
    return found ? toMemberAccount(found) : null;
  } catch {
    return null;
  }
}

export function setActiveLocalMemberId(memberId: string | null): void {
  try {
    if (memberId) localStorage.setItem(ACTIVE_MEMBER_KEY, memberId);
    else localStorage.removeItem(ACTIVE_MEMBER_KEY);
  } catch {
    // Ignore
  }
}

export function loginDemoMember(): MemberAccount {
  const store = loadStore();
  const demo = store.members.find((m) => m.id === 'mem_tessa_01') || store.members[0];
  setActiveLocalMemberId(demo.id);
  return toMemberAccount(demo);
}

export function upsertMemberProfile(params: {
  id: string;
  name: string;
  email: string;
  phone: string;
}): MemberAccount {
  const store = loadStore();
  const existing = store.members.find(
    (m) => m.id === params.id || m.email.toLowerCase() === params.email.trim().toLowerCase()
  );
  if (existing) {
    setActiveLocalMemberId(existing.id);
    return toMemberAccount(existing);
  }
  const created: LocalMember = {
    id: params.id,
    name: params.name.trim() || params.email.split('@')[0],
    email: params.email.trim().toLowerCase(),
    phone: params.phone.trim() || '+65 9000 0000',
    points: 150,
    tier: 'Belly Recruit',
    savedAddresses: [],
    joinedAt: new Date().toISOString(),
  };
  store.members.push(created);
  saveStore(store);
  setActiveLocalMemberId(created.id);
  return toMemberAccount(created);
}

export function findOrCreateMemberByEmail(email: string, fallbackId: string): MemberAccount {
  const store = loadStore();
  const existing = store.members.find(
    (m) => m.email.toLowerCase() === email.trim().toLowerCase() || m.id === fallbackId
  );
  if (existing) {
    setActiveLocalMemberId(existing.id);
    return toMemberAccount(existing);
  }
  return upsertMemberProfile({
    id: fallbackId,
    name: email.split('@')[0],
    email,
    phone: '+65 9000 0000',
  });
}

export function getMemberOrderHistory(memberId: string): Order[] {
  const store = loadStore();
  return store.orders.filter((o) => o.customer.memberId === memberId);
}

export function getLocalOrder(orderId: string): Order | null {
  const store = loadStore();
  return store.orders.find((o) => o.id === orderId) || null;
}

export function lookupLocalOrder(query: string): Order | null {
  const q = query.trim().toUpperCase().replace(/^#/, '');
  if (!q) return null;
  const store = loadStore();
  return (
    store.orders.find((o) => o.id.toUpperCase() === q || o.queueNumber.toUpperCase() === q) || null
  );
}

export function createLocalOrder(body: {
  fulfillmentMode: FulfillmentMode;
  items: CartItem[];
  customer: CustomerCheckoutInfo;
  paymentMethod: PaymentMethod;
  utensilsIncluded: boolean;
  promoCode: string | null;
  redeemPoints: boolean;
  memberId?: string;
}): { order: Order; updatedMember: MemberAccount | null } {
  const store = loadStore();
  const activeMember = body.memberId
    ? store.members.find((m) => m.id === body.memberId) || null
    : null;

  const subtotal = Number(body.items.reduce((acc, item) => acc + item.lineTotal, 0).toFixed(2));
  const normalizedPromo = (body.promoCode || '').trim().toUpperCase() || null;
  let promoDiscount = 0;
  if (normalizedPromo === 'BELLY10') {
    promoDiscount = Number((subtotal * 0.1).toFixed(2));
  } else if (normalizedPromo === 'BELLY5' && subtotal >= 25) {
    promoDiscount = 5.0;
  }

  let pointsRedeemed = 0;
  let pointsDiscount = 0;
  if (activeMember && body.redeemPoints && activeMember.points >= 100) {
    const maxRedeemableHundreds = Math.floor(activeMember.points / 100) * 100;
    const maxAffordableDiscount = Math.max(0, subtotal - promoDiscount);
    const maxNeededPoints = Math.floor(maxAffordableDiscount) * 100;
    pointsRedeemed = Math.min(maxRedeemableHundreds, maxNeededPoints);
    pointsDiscount = Number((pointsRedeemed / 100).toFixed(2));
  }

  const activeTier = activeMember ? computeBellyTier(activeMember.points) : null;
  const deliveryFee =
    body.fulfillmentMode === 'delivery'
      ? activeTier === 'Belly Legend' || subtotal >= 35
        ? 0
        : 3.5
      : 0;

  const total = Number(
    Math.max(0, subtotal - promoDiscount - pointsDiscount + deliveryFee).toFixed(2)
  );
  const pointsMultiplier =
    activeTier === 'Belly Legend' ? 15 : activeTier === 'Belly Warrior' ? 12.5 : 10;
  const pointsEarned = activeMember ? Math.round(total * pointsMultiplier) : 0;

  if (activeMember) {
    activeMember.points = Math.max(0, activeMember.points - pointsRedeemed + pointsEarned);
    activeMember.tier = computeBellyTier(activeMember.points);
    if (
      body.fulfillmentMode === 'delivery' &&
      body.customer.deliveryAddress?.street &&
      !activeMember.savedAddresses.some(
        (a) => a.postalCode === body.customer.deliveryAddress?.postalCode
      )
    ) {
      activeMember.savedAddresses.unshift({
        id: `addr_${Date.now()}`,
        label: 'Recent Delivery',
        street: body.customer.deliveryAddress.street,
        unit: body.customer.deliveryAddress.unit || '',
        postalCode: body.customer.deliveryAddress.postalCode,
        notes: body.customer.deliveryAddress.dropoffNote || '',
      });
    }
  }

  const now = new Date();
  const nowStr = formatSgTime(now);
  const seq = store.nextQueueSeq++;
  const orderId = `ORD-${Math.floor(1000 + Math.random() * 8999)}`;
  const queueNumber = `A-${seq}`;
  const initialEta = body.fulfillmentMode === 'pickup' ? 10 : 28;
  const timeline = createInitialTimeline(body.fulfillmentMode, nowStr);

  const newOrder: Order = {
    id: orderId,
    queueNumber,
    fulfillmentMode: body.fulfillmentMode,
    outletName: 'BellyBelly Good',
    outletAddress: '28 Keong Saik Road, #01-01, Singapore 089135',
    items: body.items,
    customer: {
      ...body.customer,
      isGuest: !activeMember,
      memberId: activeMember?.id,
    },
    paymentMethod: body.paymentMethod,
    utensilsIncluded: body.utensilsIncluded,
    promoCode: promoDiscount > 0 ? normalizedPromo : null,
    pointsRedeemed,
    pointsEarned,
    subtotal,
    promoDiscount,
    pointsDiscount,
    deliveryFee,
    total,
    status: 'preparing',
    etaMinutes: initialEta,
    estimatedTimeLabel:
      body.fulfillmentMode === 'pickup'
        ? `Est. ready ${addMinutesLabel(now, initialEta)}`
        : `Est. arrival ${addMinutesLabel(now, initialEta)}`,
    deliveryProgressPct: body.fulfillmentMode === 'delivery' ? 18 : undefined,
    timeline,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };

  store.orders.unshift(newOrder);
  saveStore(store);

  return {
    order: newOrder,
    updatedMember: activeMember ? toMemberAccount(activeMember) : null,
  };
}

const STAGE_ORDER: OrderStatusStage[] = [
  'confirmed',
  'preparing',
  'packing',
  'ready_or_enroute',
  'completed',
];

export function advanceLocalOrderStage(orderId: string): Order | null {
  const store = loadStore();
  const order = store.orders.find((o) => o.id === orderId);
  if (!order) return null;

  let nextStage: OrderStatusStage | null = null;
  if (order.status === 'confirmed') nextStage = 'preparing';
  else if (order.status === 'preparing') nextStage = 'packing';
  else if (order.status === 'packing') nextStage = 'ready_or_enroute';
  else if (order.status === 'ready_or_enroute') nextStage = 'completed';

  if (!nextStage) return order;

  const now = new Date();
  const nowStr = formatSgTime(now);
  order.status = nextStage;
  order.updatedAt = now.toISOString();

  const nextIdx = STAGE_ORDER.indexOf(nextStage);
  order.timeline = order.timeline.map((step, idx) => {
    if (idx < nextIdx) {
      return {
        ...step,
        completed: true,
        active: false,
        timestamp: step.timestamp || nowStr,
      };
    }
    if (idx === nextIdx) {
      const isTerminal = nextStage === 'completed';
      return {
        ...step,
        completed: isTerminal,
        active: !isTerminal,
        timestamp: nowStr,
      };
    }
    return {
      ...step,
      completed: false,
      active: false,
    };
  });

  if (order.fulfillmentMode === 'pickup') {
    if (nextStage === 'preparing') {
      order.etaMinutes = 8;
      order.estimatedTimeLabel = `Est. ready ${addMinutesLabel(now, 8)}`;
    } else if (nextStage === 'packing') {
      order.etaMinutes = 3;
      order.estimatedTimeLabel = `Est. ready ${addMinutesLabel(now, 3)}`;
    } else if (nextStage === 'ready_or_enroute') {
      order.etaMinutes = 0;
      order.estimatedTimeLabel = 'Ready for Pick-Up Now';
    } else if (nextStage === 'completed') {
      order.etaMinutes = 0;
      order.estimatedTimeLabel = `Collected at ${nowStr}`;
    }
  } else {
    if (nextStage === 'preparing') {
      order.etaMinutes = 24;
      order.deliveryProgressPct = 20;
      order.estimatedTimeLabel = `Est. arrival ${addMinutesLabel(now, 24)}`;
    } else if (nextStage === 'packing') {
      order.etaMinutes = 16;
      order.deliveryProgressPct = 42;
      order.estimatedTimeLabel = `Est. arrival ${addMinutesLabel(now, 16)}`;
    } else if (nextStage === 'ready_or_enroute') {
      order.etaMinutes = 8;
      order.deliveryProgressPct = 74;
      order.riderName = order.riderName || 'Marcus Lim';
      order.riderPlate = order.riderPlate || 'E-Bike · SG-P42';
      order.estimatedTimeLabel = `Arriving around ${addMinutesLabel(now, 8)}`;
    } else if (nextStage === 'completed') {
      order.etaMinutes = 0;
      order.deliveryProgressPct = 100;
      order.estimatedTimeLabel = `Delivered at ${nowStr}`;
    }
  }

  saveStore(store);
  return { ...order };
}
