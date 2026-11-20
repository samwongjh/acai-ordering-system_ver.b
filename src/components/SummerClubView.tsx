import { useEffect, useState, type ComponentType } from 'react';
import {
  Award,
  Check,
  Clock,
  LogOut,
  MapPin,
  RotateCcw,
  UserCheck,
} from 'lucide-react';
import type { MemberAccount, Order } from '../types.ts';
import { LegendMascot, RecruitMascot, WarriorMascot } from './BellyMascots.tsx';

interface SummerClubViewProps {
  member: MemberAccount | null;
  authToken: string | null;
  onOpenSignUp: () => void;
  onOpenSignIn: () => void;
  onLogout: () => void;
  onTrackOrder: (order: Order) => void;
  onReorder: (order: Order) => void;
}

interface BellyTierDefinition {
  name: MemberAccount['tier'];
  pointsRange: string;
  earnRate: string;
  summary: string;
  perks: string[];
  mascot: ComponentType<{ className?: string }>;
}

const BELLY_TIERS: BellyTierDefinition[] = [
  {
    name: 'Belly Recruit',
    pointsRange: '0 – 399 pts',
    earnRate: '10 pts per S$1',
    summary: 'Your entry pass into Belly Tribe rewards from day one.',
    mascot: RecruitMascot,
    perks: [
      '150 welcome Belly Points upon registration',
      'Earn 10 Belly Points per S$1.00 spent',
      'Redeem 100 pts = S$1.00 off directly at checkout',
      'Complimentary extra drizzle or superfood topping during your birthday month',
    ],
  },
  {
    name: 'Belly Warrior',
    pointsRange: '400 – 999 pts',
    earnRate: '12.5 pts per S$1',
    summary: 'Accelerated points earning and priority express counter pick-up.',
    mascot: WarriorMascot,
    perks: [
      'All Belly Recruit perks included',
      '1.25× Belly Points multiplier (12.5 pts per S$1.00 spent)',
      '1 complimentary Regular-to-Medium bowl size upgrade every month',
      'Priority preparation queue at Flagship Counter #01-01',
    ],
  },
  {
    name: 'Belly Legend',
    pointsRange: '1,000+ pts',
    earnRate: '15 pts per S$1',
    summary: 'Top-tier BellyBelly Good privileges with free island-wide delivery.',
    mascot: LegendMascot,
    perks: [
      'All Belly Warrior perks included',
      '1.5× Belly Points multiplier (15 pts per S$1.00 spent)',
      'Free island-wide delivery on every order with zero minimum spend',
      '1 complimentary Signature Açaí Bowl every birthday month & early seasonal drops',
    ],
  },
];

function BellyTierShowcase({ currentTier }: { currentTier?: MemberAccount['tier'] }) {
  return (
    <section aria-labelledby="belly-tiers-heading" className="space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <p className="text-xs font-semibold text-[#5B2378]">3-Tier Rewards Programme</p>
          <h2 id="belly-tiers-heading" className="font-display text-xl font-bold text-[#1C1523]">
            From Belly Recruit to Belly Legend
          </h2>
        </div>
        <span className="text-xs text-[#665E6E]">100 Belly Points = S$1.00 checkout credit</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {BELLY_TIERS.map((tier) => {
          const Mascot = tier.mascot;
          const isCurrent = currentTier === tier.name;
          return (
            <article
              key={tier.name}
              className={`rounded-2xl border p-5 flex flex-col justify-between gap-4 transition-colors ${
                isCurrent
                  ? 'bg-[#5B2378]/5 border-[#5B2378]'
                  : 'bg-white border-[#1C1523]/8'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="w-12 h-12 rounded-2xl bg-[#F3EFEA] flex items-center justify-center shrink-0">
                    <Mascot className="w-9 h-9" />
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-xs font-semibold text-[#1C1523] tabular-nums">
                      {tier.pointsRange}
                    </p>
                    <p className="text-[11px] text-[#5B2378] font-medium">{tier.earnRate}</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-baseline gap-2">
                    <h3 className="font-display text-base font-bold text-[#1C1523]">
                      {tier.name}
                    </h3>
                    {isCurrent && (
                      <span className="text-xs font-semibold text-[#5B2378]">· Current Tier</span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-[#665E6E] leading-relaxed">{tier.summary}</p>
                </div>

                <ul className="space-y-2 pt-2 border-t border-[#1C1523]/8">
                  {tier.perks.map((perk) => (
                    <li
                      key={perk}
                      className="flex items-start gap-2 text-xs text-[#1C1523] leading-relaxed"
                    >
                      <Check className="w-3.5 h-3.5 text-[#5B2378] mt-0.5 shrink-0" />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function SummerClubView({
  member,
  authToken,
  onOpenSignUp,
  onOpenSignIn,
  onLogout,
  onTrackOrder,
  onReorder,
}: SummerClubViewProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (!member || !authToken) {
      setOrders([]);
      return;
    }
    let cancelled = false;
    setLoadingOrders(true);
    fetch('/api/orders/member/history', {
      headers: { Authorization: `Bearer ${authToken}` },
    })
      .then((res) => (res.ok ? res.json() : { orders: [] }))
      .then((data) => {
        if (!cancelled) setOrders(data.orders || []);
      })
      .catch(() => {
        if (!cancelled) setOrders([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingOrders(false);
      });

    return () => {
      cancelled = true;
    };
  }, [member, authToken]);

  if (!member) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
        {/* Hero Invitation Banner with Sign-up Now CTA (no inline registration column) */}
        <section className="bg-white rounded-2xl border border-[#1C1523]/10 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs font-semibold text-[#5B2378]">Belly Tribe Membership</p>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#1C1523] text-balance">
              Earn Belly Points on every bowl
            </h1>
            <p className="text-sm text-[#665E6E] leading-relaxed">
              Join free as a Belly Recruit with 150 bonus points, progress through Belly Warrior and Belly Legend perks, and redeem points directly at checkout.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onOpenSignUp}
              className="min-h-[46px] px-6 py-2.5 rounded-xl bg-[#5B2378] hover:bg-[#491B61] text-white text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer"
            >
              Sign-up Now
            </button>
            <button
              type="button"
              onClick={onOpenSignIn}
              className="min-h-[46px] px-4 py-2.5 rounded-xl border border-[#1C1523]/12 hover:border-[#1C1523]/30 text-sm font-semibold text-[#1C1523] transition-colors whitespace-nowrap cursor-pointer"
            >
              Member Sign In
            </button>
          </div>
        </section>

        {/* Full-Width 3-Tier Rewards Programme */}
        <BellyTierShowcase />
      </div>
    );
  }

  const nextTierTarget = member.points >= 1000 ? 1000 : member.points >= 400 ? 1000 : 400;
  const nextTierName =
    member.points >= 1000 ? null : member.points >= 400 ? 'Belly Legend' : 'Belly Warrior';
  const progressPct = Math.min(100, Math.round((member.points / nextTierTarget) * 100));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Member Loyalty Card */}
      <div className="bg-[#1C1523] text-white rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-white/75">
            <UserCheck className="w-4 h-4 text-[#F59E0B]" />
            <span>{member.tier}</span>
            <span aria-hidden="true">·</span>
            <span>{member.phone}</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold">{member.name}</h1>
          <p className="text-xs text-white/70">{member.email}</p>

          <div className="pt-2 max-w-xs">
            <div className="flex justify-between text-[11px] text-white/75 mb-1 tabular-nums">
              <span>{member.points} pts earned</span>
              <span>
                {nextTierName
                  ? `${nextTierTarget - member.points} pts to ${nextTierName}`
                  : 'Belly Legend Unlocked'}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-white/15 overflow-hidden">
              <div
                className="h-full bg-[#F59E0B] rounded-full transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3">
          <div className="sm:text-right">
            <p className="text-xs text-white/75 flex items-center sm:justify-end gap-1">
              <Award className="w-3.5 h-3.5 text-[#F59E0B]" />
              Available Balance
            </p>
            <p className="font-mono text-3xl font-bold tabular-nums">
              {member.points} <span className="text-sm font-normal text-white/75">pts</span>
            </p>
            <p className="text-[11px] text-white/70 tabular-nums">
              Worth S${Math.floor(member.points / 100).toFixed(2)} at checkout
            </p>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="min-h-[40px] px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white inline-flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Expanded Belly Club Tier Perks */}
      <BellyTierShowcase currentTier={member.tier} />

      {/* Saved Addresses */}
      <div className="bg-white rounded-2xl border border-[#1C1523]/8 p-5">
        <h2 className="font-display text-base font-bold text-[#1C1523] mb-3 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#5B2378]" />
          <span>Saved Delivery Addresses</span>
        </h2>
        {member.savedAddresses.length === 0 ? (
          <p className="text-xs text-[#665E6E]">
            Your next delivery address will automatically save here for faster checkout.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {member.savedAddresses.map((addr) => (
              <div
                key={addr.id}
                className="p-3.5 rounded-xl bg-[#FAF9F7] border border-[#1C1523]/8 text-xs space-y-1"
              >
                <p className="font-bold text-[#1C1523]">{addr.label}</p>
                <p className="text-[#665E6E]">
                  {addr.street} {addr.unit}
                </p>
                <p className="font-mono text-[#665E6E]">Singapore {addr.postalCode}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order History */}
      <div className="bg-white rounded-2xl border border-[#1C1523]/8 p-5">
        <h2 className="font-display text-base font-bold text-[#1C1523] mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#5B2378]" />
          <span>Order History</span>
        </h2>

        {loadingOrders ? (
          <p className="text-xs text-[#665E6E] py-4">Loading your past orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-xs text-[#665E6E] py-4">
            No orders placed yet. Your BellyBelly Good orders will appear here.
          </p>
        ) : (
          <div className="divide-y divide-[#1C1523]/8">
            {orders.map((order) => (
              <div
                key={order.id}
                className="py-3.5 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono font-bold text-[#1C1523]">
                      #{order.queueNumber}
                    </span>
                    <span className="text-[#665E6E]">·</span>
                    <span className="text-[#665E6E]">{order.id}</span>
                    <span className="text-[#665E6E]">·</span>
                    <span className="font-medium text-[#5B2378]">
                      {order.estimatedTimeLabel}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-[#1C1523]">
                    {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                  </p>
                  <p className="text-xs text-[#665E6E] tabular-nums">
                    Total S${order.total.toFixed(2)} · Earned +{order.pointsEarned} pts
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => onTrackOrder(order)}
                    className="min-h-[38px] px-3.5 rounded-xl border border-[#1C1523]/12 hover:border-[#1C1523]/30 text-xs font-semibold text-[#1C1523] cursor-pointer"
                  >
                    View Tracker
                  </button>
                  <button
                    type="button"
                    onClick={() => onReorder(order)}
                    className="min-h-[38px] px-3.5 rounded-xl bg-[#1C1523] hover:bg-[#5B2378] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reorder</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
