import { useEffect, useState, type FormEvent } from 'react';
import {
  Bike,
  CheckCircle2,
  Clock,
  FastForward,
  MapPin,
  Receipt,
  Search,
  Store,
} from 'lucide-react';
import type { Order } from '../types.ts';
import { FoodImage } from './FoodImage.tsx';

interface OrderTrackerViewProps {
  activeOrder: Order | null;
  onUpdateOrder: (order: Order) => void;
  onBackToMenu: () => void;
}

export function OrderTrackerView({
  activeOrder,
  onUpdateOrder,
  onBackToMenu,
}: OrderTrackerViewProps) {
  const [lookupInput, setLookupInput] = useState('');
  const [lookupError, setLookupError] = useState('');
  const [advancing, setAdvancing] = useState(false);
  const [streamConnected, setStreamConnected] = useState(false);

  // Connect real-time SSE stream whenever activeOrder changes
  useEffect(() => {
    if (!activeOrder?.id || activeOrder.status === 'completed') {
      setStreamConnected(false);
      return;
    }

    const source = new EventSource(`/api/orders/${encodeURIComponent(activeOrder.id)}/stream`);
    source.onopen = () => setStreamConnected(true);
    source.onmessage = (event) => {
      try {
        const updated = JSON.parse(event.data) as Order;
        onUpdateOrder(updated);
      } catch {
        // Ignore malformed frame
      }
    };
    source.onerror = () => {
      setStreamConnected(false);
    };

    return () => {
      source.close();
      setStreamConnected(false);
    };
  }, [activeOrder?.id, activeOrder?.status, onUpdateOrder]);

  const handleLookup = async (e: FormEvent) => {
    e.preventDefault();
    setLookupError('');
    const q = lookupInput.trim();
    if (!q) return;
    try {
      const res = await fetch(`/api/orders/lookup/${encodeURIComponent(q)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Order not found');
      onUpdateOrder(data.order);
      setLookupInput('');
    } catch (err) {
      setLookupError(err instanceof Error ? err.message : 'Unable to find order');
    }
  };

  const handleSimulateAdvance = async () => {
    if (!activeOrder) return;
    setAdvancing(true);
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(activeOrder.id)}/advance`, {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        onUpdateOrder(data.order);
      }
    } finally {
      setAdvancing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Lookup Bar */}
      <div className="bg-white rounded-2xl border border-[#1C1523]/8 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-lg font-bold text-[#1C1523]">
            Live Order Tracker
          </h1>
          <p className="text-xs text-[#665E6E]">
            Track your kitchen progress or courier in real time (try sample ORD-8421 or A-391)
          </p>
        </div>

        <form onSubmit={handleLookup} className="flex items-center gap-2 sm:w-72">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#665E6E] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={lookupInput}
              onChange={(e) => setLookupInput(e.target.value)}
              placeholder="Order ID or Queue #"
              className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#1C1523]/12 text-xs text-[#1C1523] focus:outline-none focus:border-[#5B2378]"
            />
          </div>
          <button
            type="submit"
            className="h-10 px-3.5 rounded-xl bg-[#1C1523] text-white text-xs font-semibold hover:bg-[#5B2378] transition-colors cursor-pointer"
          >
            Track
          </button>
        </form>
      </div>

      {lookupError && (
        <p className="text-xs font-medium text-rose-600 px-1">{lookupError}</p>
      )}

      {!activeOrder ? (
        <div className="bg-white rounded-2xl border border-[#1C1523]/8 p-10 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#F3EFEA] text-[#5B2378] mx-auto flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-[#1C1523]">
              No active order selected
            </h2>
            <p className="mt-1 text-sm text-[#665E6E] max-w-md mx-auto">
              Place an açaí order for pick-up or delivery to watch real-time kitchen updates, or search an existing queue code above.
            </p>
          </div>
          <button
            type="button"
            onClick={onBackToMenu}
            className="h-11 px-5 rounded-xl bg-[#1C1523] text-white text-sm font-semibold hover:bg-[#5B2378] transition-colors cursor-pointer"
          >
            Browse BellyBelly Good Menu
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Live Status & Timeline */}
          <div className="lg:col-span-7 space-y-5">
            <div className="bg-white rounded-2xl border border-[#1C1523]/8 p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-[#1C1523]/8">
                <div>
                  <div className="flex items-center gap-2 text-xs font-medium text-[#665E6E]">
                    <span className="font-mono font-semibold text-[#1C1523]">
                      {activeOrder.id}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>
                      {activeOrder.fulfillmentMode === 'pickup' ? 'Self Pick-Up' : 'Island Delivery'}
                    </span>
                    {streamConnected && activeOrder.status !== 'completed' && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          Live Updates
                        </span>
                      </>
                    )}
                  </div>
                  <h2 className="mt-1 font-display text-2xl font-bold text-[#1C1523]">
                    {activeOrder.estimatedTimeLabel}
                  </h2>
                </div>

                <div className="text-right">
                  <p className="text-[11px] text-[#665E6E]">Queue Number</p>
                  <p className="font-mono text-2xl font-bold text-[#5B2378] tabular-nums">
                    #{activeOrder.queueNumber}
                  </p>
                </div>
              </div>

              {/* Delivery Route Visual OR Pick-up Express Counter Card */}
              {activeOrder.fulfillmentMode === 'delivery' ? (
                <div className="my-5 rounded-2xl bg-[#FAF9F7] border border-[#1C1523]/8 p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#1C1523] flex items-center gap-1.5">
                      <Bike className="w-4 h-4 text-[#5B2378]" />
                      {activeOrder.riderName
                        ? `${activeOrder.riderName} (${activeOrder.riderPlate})`
                        : 'Assigning Express Courier'}
                    </span>
                    <span className="font-mono font-semibold text-[#5B2378] tabular-nums">
                      {activeOrder.etaMinutes > 0 ? `${activeOrder.etaMinutes} min ETA` : 'Arrived'}
                    </span>
                  </div>

                  {/* Route Progress Bar */}
                  <div className="relative pt-2 pb-1">
                    <div className="h-2 rounded-full bg-[#EAE3DA] overflow-hidden">
                      <div
                        className="h-full bg-[#5B2378] transition-all duration-700 rounded-full"
                        style={{ width: `${activeOrder.deliveryProgressPct || 15}%` }}
                      />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-[#665E6E]">
                      <span>28 Keong Saik Rd</span>
                      <span>
                        {activeOrder.customer.deliveryAddress?.street}{' '}
                        {activeOrder.customer.deliveryAddress?.postalCode}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="my-5 rounded-2xl bg-[#FAF9F7] border border-[#1C1523]/8 p-4 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-[#1C1523] flex items-center gap-1.5">
                      <Store className="w-4 h-4 text-[#5B2378]" />
                      BellyBelly Good Express Counter (#01-01)
                    </p>
                    <p className="text-xs text-[#665E6E]">
                      Present queue code <span className="font-mono font-semibold text-[#1C1523]">#{activeOrder.queueNumber}</span> when your status switches to Ready.
                    </p>
                  </div>
                  <div className="w-14 h-14 rounded-xl bg-white border border-[#1C1523]/10 flex items-center justify-center shrink-0">
                    {/* Crisp geometric QR representation */}
                    <svg viewBox="0 0 36 36" className="w-10 h-10 text-[#1C1523]" aria-label="Pickup verification code">
                      <rect x="2" y="2" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" />
                      <rect x="5" y="5" width="4" height="4" fill="currentColor" />
                      <rect x="24" y="2" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" />
                      <rect x="27" y="5" width="4" height="4" fill="currentColor" />
                      <rect x="2" y="24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" />
                      <rect x="5" y="27" width="4" height="4" fill="currentColor" />
                      <path d="M16 4h4v4h-4zM16 12h4v8h-4zM4 16h8v4H4zM24 16h10v4H24zM16 24h6v10h-6zM26 26h8v8h-8z" fill="currentColor" />
                    </svg>
                  </div>
                </div>
              )}

              {/* Timeline Steps */}
              <ol className="space-y-4">
                {activeOrder.timeline.map((step, index) => {
                  const isDone = step.completed;
                  const isActive = step.active;
                  return (
                    <li key={step.stage} className="flex items-start gap-3.5">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                            isDone
                              ? 'bg-[#5B2378] text-white'
                              : isActive
                              ? 'bg-[#1C1523] text-white ring-4 ring-[#5B2378]/15'
                              : 'bg-[#F3EFEA] text-[#665E6E]'
                          }`}
                        >
                          {isDone ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
                        </div>
                        {index < activeOrder.timeline.length - 1 && (
                          <div
                            className={`w-0.5 h-6 mt-1 ${
                              isDone ? 'bg-[#5B2378]' : 'bg-[#1C1523]/10'
                            }`}
                          />
                        )}
                      </div>

                      <div className="flex-1 min-w-0 pt-0.5">
                        <div className="flex items-baseline justify-between gap-2">
                          <p
                            className={`text-sm font-semibold ${
                              isDone || isActive ? 'text-[#1C1523]' : 'text-[#665E6E]'
                            }`}
                          >
                            {step.title}
                          </p>
                          {step.timestamp && (
                            <span className="font-mono text-[11px] text-[#665E6E] tabular-nums shrink-0">
                              {step.timestamp}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#665E6E] mt-0.5">{step.subtitle}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>

              {/* Interactive stage simulation button for instant testing */}
              {activeOrder.status !== 'completed' && (
                <div className="mt-6 pt-4 border-t border-[#1C1523]/8 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-[#665E6E]">
                    Stages auto-advance live every ~9s via server stream
                  </span>
                  <button
                    type="button"
                    disabled={advancing}
                    onClick={handleSimulateAdvance}
                    className="min-h-[40px] px-3.5 py-2 rounded-xl bg-[#F3EFEA] hover:bg-[#EAE3DA] text-xs font-semibold text-[#1C1523] inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                  >
                    <FastForward className="w-3.5 h-3.5 text-[#5B2378]" />
                    <span>{advancing ? 'Updating...' : 'Advance Next Stage'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right: Digital Receipt */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-[#1C1523]/8 p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1C1523]/8">
              <h3 className="font-display text-base font-bold text-[#1C1523] flex items-center gap-2">
                <Receipt className="w-4 h-4 text-[#5B2378]" />
                <span>Order Receipt</span>
              </h3>
              <span className="text-xs text-[#665E6E] uppercase font-mono">
                {activeOrder.paymentMethod}
              </span>
            </div>

            <div className="space-y-3">
              {activeOrder.items.map((item) => (
                <div key={item.cartItemId} className="flex items-start gap-3">
                  <FoodImage
                    src={item.image}
                    alt={item.name}
                    className="w-11 h-11 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2 text-xs font-semibold text-[#1C1523]">
                      <span className="truncate">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="font-mono tabular-nums shrink-0">
                        S${item.lineTotal.toFixed(2)}
                      </span>
                    </div>
                    {item.selectedModifiers.length > 0 && (
                      <p className="text-[11px] text-[#665E6E] truncate">
                        {item.selectedModifiers.map((m) => m.optionName).join(' · ')}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#1C1523]/8 space-y-1.5 text-xs">
              <div className="flex justify-between text-[#665E6E]">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums">S${activeOrder.subtotal.toFixed(2)}</span>
              </div>
              {activeOrder.promoDiscount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Promo ({activeOrder.promoCode})</span>
                  <span className="font-mono tabular-nums">
                    -S${activeOrder.promoDiscount.toFixed(2)}
                  </span>
                </div>
              )}
              {activeOrder.pointsDiscount > 0 && (
                <div className="flex justify-between text-[#5B2378]">
                  <span>Belly Points ({activeOrder.pointsRedeemed} pts)</span>
                  <span className="font-mono tabular-nums">
                    -S${activeOrder.pointsDiscount.toFixed(2)}
                  </span>
                </div>
              )}
              {activeOrder.deliveryFee > 0 && (
                <div className="flex justify-between text-[#665E6E]">
                  <span>Delivery Fee</span>
                  <span className="font-mono tabular-nums">
                    S${activeOrder.deliveryFee.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-[#1C1523] pt-2 border-t border-[#1C1523]/8">
                <span>Total Paid</span>
                <span className="font-mono tabular-nums">S${activeOrder.total.toFixed(2)}</span>
              </div>
              {activeOrder.pointsEarned > 0 && (
                <p className="text-xs font-medium text-[#5B2378] pt-1">
                  +{activeOrder.pointsEarned} Belly Points credited to your account
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-[#1C1523]/8 text-xs text-[#665E6E] space-y-1">
              <p className="font-semibold text-[#1C1523] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#5B2378]" />
                {activeOrder.outletName}
              </p>
              <p>
                Customer: {activeOrder.customer.name} · {activeOrder.customer.phone}
              </p>
            </div>

            <button
              type="button"
              onClick={onBackToMenu}
              className="w-full h-11 rounded-xl border border-[#1C1523]/12 hover:border-[#1C1523]/30 text-xs font-semibold text-[#1C1523] transition-colors cursor-pointer"
            >
              Order More Açaí
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
