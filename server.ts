import express from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import type {
  CartItem,
  CustomerCheckoutInfo,
  FulfillmentMode,
  MemberAccount,
  Order,
  OrderStatusStage,
  OrderTimelineStep,
  PaymentMethod,
} from './src/types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const DATA_DIR = path.resolve(__dirname, '.data');
const STORE_PATH = path.join(DATA_DIR, 'store.json');

interface StoredMember extends MemberAccount {
  passwordHash: string;
}

interface StoreData {
  members: StoredMember[];
  sessions: Record<string, string>;
  orders: Order[];
  nextQueueSeq: number;
}

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(`bellybelly_salt_${password}`).digest('hex');
}

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

function createSeedData(): StoreData {
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
          { groupId: 'size', groupTitle: 'Bowl Size', optionId: 'regular', optionName: 'Regular (12oz)', priceDelta: 0 },
          { groupId: 'drizzle', groupTitle: 'Complimentary Drizzle Sauce', optionId: 'cookie-butter', optionName: 'Speculoos Cookie Butter', priceDelta: 0 },
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
          { groupId: 'milk', groupTitle: 'Milk Selection', optionId: 'oatside', optionName: 'Oatside Barista Oat Milk', priceDelta: 1.0 },
          { groupId: 'ice-level', groupTitle: 'Ice & Sweetness', optionId: 'less-ice', optionName: 'Less Ice · Less Sweet', priceDelta: 0 },
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
        passwordHash: hashPassword('belly123'),
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
    sessions: {},
    orders: [samplePastOrder],
    nextQueueSeq: 405,
  };
}

function loadStore(): StoreData {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(STORE_PATH)) {
      const raw = fs.readFileSync(STORE_PATH, 'utf8');
      const parsed = JSON.parse(raw) as StoreData;
      if (parsed && Array.isArray(parsed.members) && Array.isArray(parsed.orders)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to load store.json, seeding fresh store:', err);
  }
  const seeded = createSeedData();
  saveStore(seeded);
  return seeded;
}

function saveStore(data: StoreData): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to persist store:', err);
  }
}

function computeBellyTier(points: number): MemberAccount['tier'] {
  if (points >= 1000) return 'Belly Legend';
  if (points >= 400) return 'Belly Warrior';
  return 'Belly Recruit';
}

function sanitizeMember(member: StoredMember): MemberAccount {
  const { passwordHash: _ignored, ...safe } = member;
  return {
    ...safe,
    tier: computeBellyTier(safe.points),
  };
}

const STAGE_ORDER: OrderStatusStage[] = [
  'confirmed',
  'preparing',
  'packing',
  'ready_or_enroute',
  'completed',
];

const store: StoreData = loadStore();
const sseClients = new Map<string, Set<express.Response>>();
const activeOrderTimers = new Map<string, NodeJS.Timeout>();

function broadcastOrderUpdate(order: Order): void {
  const listeners = sseClients.get(order.id);
  if (!listeners || listeners.size === 0) return;
  const payload = `data: ${JSON.stringify(order)}\n\n`;
  for (const res of listeners) {
    try {
      res.write(payload);
    } catch {
      listeners.delete(res);
    }
  }
}

function advanceOrderStage(orderId: string): Order | null {
  const order = store.orders.find((o) => o.id === orderId);
  if (!order) return null;

  const currentIdx = STAGE_ORDER.indexOf(order.status);
  // Note: newly placed orders start with stage='preparing' active visually while 'confirmed' is completed.
  // Let's make order.status match the currently active or just-completed stage cleanly.
  let nextStage: OrderStatusStage | null = null;
  if (order.status === 'confirmed') nextStage = 'preparing';
  else if (order.status === 'preparing') nextStage = 'packing';
  else if (order.status === 'packing') nextStage = 'ready_or_enroute';
  else if (order.status === 'ready_or_enroute') nextStage = 'completed';

  if (!nextStage) {
    const timer = activeOrderTimers.get(orderId);
    if (timer) {
      clearTimeout(timer);
      activeOrderTimers.delete(orderId);
    }
    return order;
  }

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
  broadcastOrderUpdate(order);

  if (currentIdx >= STAGE_ORDER.length - 1 || nextStage === 'completed') {
    const timer = activeOrderTimers.get(orderId);
    if (timer) {
      clearTimeout(timer);
      activeOrderTimers.delete(orderId);
    }
  }

  return order;
}

function scheduleOrderProgression(orderId: string): void {
  const existing = activeOrderTimers.get(orderId);
  if (existing) clearTimeout(existing);

  const tick = () => {
    const order = store.orders.find((o) => o.id === orderId);
    if (!order || order.status === 'completed') {
      activeOrderTimers.delete(orderId);
      return;
    }
    const updated = advanceOrderStage(orderId);
    if (updated && updated.status !== 'completed') {
      const nextDelay = updated.status === 'ready_or_enroute' ? 14_000 : 9_000;
      const timer = setTimeout(tick, nextDelay);
      activeOrderTimers.set(orderId, timer);
    } else {
      activeOrderTimers.delete(orderId);
    }
  };

  const initialTimer = setTimeout(tick, 8_000);
  activeOrderTimers.set(orderId, initialTimer);
}

// Resume timers for any unfinished orders on server boot
for (const existingOrder of store.orders) {
  if (existingOrder.status !== 'completed') {
    scheduleOrderProgression(existingOrder.id);
  }
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  const getSessionMember = (req: express.Request): StoredMember | null => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    const token = authHeader.slice(7).trim();
    const memberId = store.sessions[token];
    if (!memberId) return null;
    return store.members.find((m) => m.id === memberId) || null;
  };

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, outlet: 'BellyBelly Good' });
  });

  // --- Auth & Membership Endpoints ---
  app.get('/api/auth/me', (req, res) => {
    const member = getSessionMember(req);
    if (!member) {
      res.status(401).json({ error: 'Not signed in' });
      return;
    }
    res.json({ member: sanitizeMember(member) });
  });

  app.post('/api/auth/login', (req, res) => {
    const { identifier, password, demo } = req.body as {
      identifier?: string;
      password?: string;
      demo?: boolean;
    };

    let member: StoredMember | undefined;
    if (demo) {
      member = store.members[0];
    } else {
      const cleanId = (identifier || '').trim().toLowerCase();
      if (!cleanId || !password) {
        res.status(400).json({ error: 'Please enter your email/phone and password.' });
        return;
      }
      const normalizedDigits = cleanId.replace(/\D/g, '');
      member = store.members.find((m) => {
        const emailMatch = m.email.toLowerCase() === cleanId;
        const phoneDigits = m.phone.replace(/\D/g, '');
        const phoneMatch =
          normalizedDigits.length >= 8 &&
          (phoneDigits === normalizedDigits || phoneDigits.endsWith(normalizedDigits));
        return emailMatch || phoneMatch;
      });

      if (!member || member.passwordHash !== hashPassword(password)) {
        res.status(401).json({ error: 'Invalid Belly Tribe credentials. Try Demo Member or check password.' });
        return;
      }
    }

    if (!member) {
      res.status(404).json({ error: 'Member not found' });
      return;
    }

    const token = crypto.randomBytes(24).toString('hex');
    store.sessions[token] = member.id;
    saveStore(store);
    res.json({ token, member: sanitizeMember(member) });
  });

  app.post('/api/auth/register', (req, res) => {
    const { name, email, phone, password } = req.body as {
      name?: string;
      email?: string;
      phone?: string;
      password?: string;
    };

    const cleanName = (name || '').trim();
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPhone = (phone || '').trim();

    if (!cleanName || !cleanEmail || !cleanPhone || !password || password.length < 6) {
      res.status(400).json({ error: 'Name, email, mobile number, and password (min 6 chars) are required.' });
      return;
    }

    if (store.members.some((m) => m.email.toLowerCase() === cleanEmail)) {
      res.status(409).json({ error: 'An account with this email already exists.' });
      return;
    }

    const newMember: StoredMember = {
      id: `mem_${crypto.randomBytes(6).toString('hex')}`,
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone.startsWith('+') ? cleanPhone : `+65 ${cleanPhone}`,
      passwordHash: hashPassword(password),
      points: 150, // Welcome bonus
      tier: 'Belly Recruit',
      savedAddresses: [],
      joinedAt: new Date().toISOString(),
    };

    store.members.push(newMember);
    const token = crypto.randomBytes(24).toString('hex');
    store.sessions[token] = newMember.id;
    saveStore(store);

    res.status(201).json({ token, member: sanitizeMember(newMember) });
  });

  app.post('/api/auth/logout', (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7).trim();
      delete store.sessions[token];
      saveStore(store);
    }
    res.json({ ok: true });
  });

  // --- Orders & Real-Time Tracking Endpoints ---
  app.get('/api/orders/member/history', (req, res) => {
    const member = getSessionMember(req);
    if (!member) {
      res.status(401).json({ error: 'Member sign-in required' });
      return;
    }
    const orders = store.orders
      .filter((o) => o.customer.memberId === member.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json({ orders });
  });

  app.post('/api/orders', (req, res) => {
    const body = req.body as {
      fulfillmentMode: FulfillmentMode;
      items: CartItem[];
      customer: CustomerCheckoutInfo;
      paymentMethod: PaymentMethod;
      utensilsIncluded: boolean;
      promoCode?: string | null;
      redeemPoints?: boolean;
    };

    if (!Array.isArray(body.items) || body.items.length === 0) {
      res.status(400).json({ error: 'Your cart is empty.' });
      return;
    }
    if (!body.customer?.name?.trim() || !body.customer?.phone?.trim()) {
      res.status(400).json({ error: 'Contact name and mobile number are required.' });
      return;
    }
    if (
      body.fulfillmentMode === 'delivery' &&
      (!body.customer.deliveryAddress?.street?.trim() || !body.customer.deliveryAddress?.postalCode?.trim())
    ) {
      res.status(400).json({ error: 'Delivery street address and postal code are required.' });
      return;
    }

    const sessionMember = getSessionMember(req);
    const subtotal = Number(
      body.items.reduce((acc, item) => acc + item.lineTotal, 0).toFixed(2)
    );

    const normalizedPromo = (body.promoCode || '').trim().toUpperCase() || null;
    let promoDiscount = 0;
    if (normalizedPromo === 'BELLY10') {
      promoDiscount = Number((subtotal * 0.1).toFixed(2));
    } else if (normalizedPromo === 'BELLY5' && subtotal >= 25) {
      promoDiscount = 5.0;
    }

    let pointsRedeemed = 0;
    let pointsDiscount = 0;
    if (sessionMember && body.redeemPoints && sessionMember.points >= 100) {
      const maxRedeemableHundreds = Math.floor(sessionMember.points / 100) * 100;
      const maxAffordableDiscount = Math.max(0, subtotal - promoDiscount);
      const maxNeededPoints = Math.floor(maxAffordableDiscount) * 100;
      pointsRedeemed = Math.min(maxRedeemableHundreds, maxNeededPoints);
      pointsDiscount = Number((pointsRedeemed / 100).toFixed(2));
    }

    const activeTier = sessionMember ? computeBellyTier(sessionMember.points) : null;
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
    const pointsEarned = sessionMember ? Math.round(total * pointsMultiplier) : 0;

    if (sessionMember) {
      sessionMember.points = Math.max(0, sessionMember.points - pointsRedeemed + pointsEarned);
      sessionMember.tier = computeBellyTier(sessionMember.points);

      if (
        body.fulfillmentMode === 'delivery' &&
        body.customer.deliveryAddress?.street &&
        !sessionMember.savedAddresses.some(
          (a) => a.postalCode === body.customer.deliveryAddress?.postalCode
        )
      ) {
        sessionMember.savedAddresses.unshift({
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
        isGuest: !sessionMember,
        memberId: sessionMember?.id,
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
    scheduleOrderProgression(newOrder.id);

    res.status(201).json({
      order: newOrder,
      updatedMember: sessionMember ? sanitizeMember(sessionMember) : null,
    });
  });

  app.get('/api/orders/lookup/:query', (req, res) => {
    const q = req.params.query.trim().toUpperCase().replace(/^#/, '');
    const found = store.orders.find(
      (o) => o.id.toUpperCase() === q || o.queueNumber.toUpperCase() === q
    );
    if (!found) {
      res.status(404).json({ error: `No order found matching "${req.params.query}".` });
      return;
    }
    res.json({ order: found });
  });

  app.get('/api/orders/:id', (req, res) => {
    const order = store.orders.find((o) => o.id === req.params.id);
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }
    res.json({ order });
  });

  app.post('/api/orders/:id/advance', (req, res) => {
    const updated = advanceOrderStage(req.params.id);
    if (!updated) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }
    res.json({ order: updated });
  });

  app.get('/api/orders/:id/stream', (req, res) => {
    const order = store.orders.find((o) => o.id === req.params.id);
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    let listeners = sseClients.get(order.id);
    if (!listeners) {
      listeners = new Set();
      sseClients.set(order.id, listeners);
    }
    listeners.add(res);

    res.write(`data: ${JSON.stringify(order)}\n\n`);

    const keepAlive = setInterval(() => {
      try {
        res.write(': keepalive\n\n');
      } catch {
        clearInterval(keepAlive);
      }
    }, 15_000);

    req.on('close', () => {
      clearInterval(keepAlive);
      listeners?.delete(res);
    });
  });

  // --- Vite Dev / Production Static Serving ---
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BellyBelly Good QSR server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server failed to start:', err);
  process.exit(1);
});
