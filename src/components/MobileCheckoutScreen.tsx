import {useState} from 'react';
import {AnimatePresence, motion} from 'motion/react';
import {
  ArrowLeft,
  Check,
  Clock,
  MapPin,
  Minus,
  Plus,
  ShoppingBag,
  UtensilsCrossed,
  X,
} from 'lucide-react';
import {
  CartItem,
  DesignVariant,
  FulfillmentMode,
} from '../types/checkout';
import {TribeSavingsButton} from './TribeSavingsButton';

interface MobileCheckoutScreenProps {
  items: CartItem[];
  variant: DesignVariant;
  discountPercent: number;
  currencySymbol: string;
  fulfillment: FulfillmentMode;
  onFulfillmentChange: (mode: FulfillmentMode) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onResetEmptyCart: () => void;
}

export function MobileCheckoutScreen({
  items,
  variant,
  discountPercent,
  currencySymbol,
  fulfillment,
  onFulfillmentChange,
  onUpdateQuantity,
  onResetEmptyCart,
}: MobileCheckoutScreenProps) {
  const [isSignUpSheetOpen, setIsSignUpSheetOpen] = useState(false);
  const [isMemberJoined, setIsMemberJoined] = useState(false);
  const [memberName, setMemberName] = useState('Maya Lin');
  const [memberPhone, setMemberPhone] = useState('+1 (415) 890-3412');
  const [orderPlacedType, setOrderPlacedType] = useState<
    null | 'guest' | 'member'
  >(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const activeItems = items.filter((item) => item.quantity > 0);
  const totalCount = activeItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = activeItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const deliveryFee =
    activeItems.length === 0 ? 0 : fulfillment === 'delivery' ? 3.5 : 0;
  const serviceFee = activeItems.length === 0 ? 0 : Number((subtotal * 0.05).toFixed(2));
  const preDiscountTotal = subtotal + deliveryFee + serviceFee;

  const savingsAmount = Number(((subtotal * discountPercent) / 100).toFixed(2));
  const discountedTotal = Math.max(0, preDiscountTotal - savingsAmount);
  const payableTotal = isMemberJoined ? discountedTotal : preDiscountTotal;

  const fmt = (val: number) => `${currencySymbol}${val.toFixed(2)}`;

  const handleConfirmSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsMemberJoined(true);
    setIsSignUpSheetOpen(false);
  };

  const handleProceedToPay = () => {
    if (activeItems.length === 0) return;
    setOrderPlacedType(isMemberJoined ? 'member' : 'guest');
  };

  return (
    <div className="relative flex flex-col bg-[#FDFBFD] text-[#1A141E] h-full min-h-[760px] lg:min-h-[780px] lg:h-[780px] w-full overflow-hidden lg:rounded-[38px] lg:border-[7px] lg:border-[#1E1924] lg:shadow-[0_28px_70px_-18px_rgba(30,25,36,0.28)]">
      {/* Subtle mobile status bar simulation on desktop frame */}
      <div className="hidden lg:flex items-center justify-between px-6 pt-3 pb-1 text-[11px] font-semibold text-zinc-700 bg-white shrink-0">
        <span className="font-mono-num">9:41</span>
        <div className="h-4 w-24 rounded-full bg-[#1E1924]" aria-hidden="true" />
        <span className="font-mono-num">5G · 94%</span>
      </div>

      {/* Compact Sticky App Header (<= 54px) */}
      <header className="sticky top-0 z-20 flex h-[52px] shrink-0 items-center justify-between border-b border-zinc-200/80 bg-white/95 px-4 backdrop-blur-md">
        <button
          type="button"
          onClick={() => {
            if (orderPlacedType) {
              setOrderPlacedType(null);
            } else {
              onResetEmptyCart();
            }
          }}
          aria-label={orderPlacedType ? 'Back to checkout' : 'Reset order'}
          className="flex min-h-[44px] min-w-[44px] -ml-2 items-center justify-center rounded-full text-zinc-700 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-[#4A156B]"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div className="text-center min-w-0">
          <h2 className="font-display text-[15px] font-bold tracking-tight text-[#1A141E] truncate">
            Belly Tribe Checkout
          </h2>
        </div>

        <div className="flex min-h-[44px] min-w-[44px] items-center justify-end text-xs font-medium text-zinc-500 font-mono-num">
          {totalCount} {totalCount === 1 ? 'item' : 'items'}
        </div>
      </header>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-6 space-y-5">
        {orderPlacedType ? (
          <motion.div
            initial={{opacity: 0, y: 12}}
            animate={{opacity: 1, y: 0}}
            className="flex flex-col items-center justify-center py-10 text-center space-y-4"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#4A156B] text-white shadow-lg shadow-[#4A156B]/20">
              <Check className="h-8 w-8 stroke-[2.5]" />
            </div>
            <div className="space-y-1">
              <h3 className="font-display text-xl font-bold text-[#1A141E]">
                Order #BT-4082 Confirmed
              </h3>
              <p className="text-sm text-zinc-600 max-w-[280px] mx-auto">
                {orderPlacedType === 'member'
                  ? `Welcome to Belly Tribe, ${memberName}. You saved ${fmt(savingsAmount)} (${discountPercent}%) on this order.`
                  : `Preparing your kitchen order for ${fulfillment}.`}
              </p>
            </div>
            <div className="w-full rounded-2xl border border-zinc-200 bg-white p-4 text-left space-y-2 text-sm">
              <div className="flex justify-between text-zinc-600">
                <span>Fulfillment</span>
                <span className="font-medium text-zinc-900 capitalize">
                  {fulfillment} · {fulfillment === 'pickup' ? '15 min' : '25–30 min'}
                </span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Amount Paid</span>
                <span className="font-mono-num font-bold text-zinc-900">
                  {fmt(payableTotal)}
                </span>
              </div>
              {orderPlacedType === 'member' && (
                <div className="flex justify-between text-[#4A156B]">
                  <span>Belly Tribe Savings</span>
                  <span className="font-mono-num font-bold">
                    -{fmt(savingsAmount)} ({discountPercent}%)
                  </span>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => setOrderPlacedType(null)}
              className="min-h-[44px] px-6 rounded-xl bg-zinc-900 text-white text-sm font-semibold hover:bg-zinc-800 transition-colors"
            >
              Return to Checkout View
            </button>
          </motion.div>
        ) : (
          <>
            {/* Pickup / Delivery Segmented Control */}
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-3 space-y-3">
              <div className="grid grid-cols-2 gap-1.5 rounded-xl bg-zinc-100 p-1">
                <button
                  type="button"
                  onClick={() => onFulfillmentChange('pickup')}
                  className={`min-h-[44px] rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    fulfillment === 'pickup'
                      ? 'bg-white text-[#1A141E] shadow-xs'
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  Pickup · Free
                </button>
                <button
                  type="button"
                  onClick={() => onFulfillmentChange('delivery')}
                  className={`min-h-[44px] rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    fulfillment === 'delivery'
                      ? 'bg-white text-[#1A141E] shadow-xs'
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  Delivery · {fmt(3.5)}
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-zinc-600 px-1">
                <span className="flex items-center gap-1.5 truncate">
                  <MapPin className="h-3.5 w-3.5 text-[#4A156B] shrink-0" aria-hidden="true" />
                  <span className="truncate">
                    {fulfillment === 'pickup'
                      ? 'Belly Tribe Kitchen · Valencia St'
                      : 'Deliver to 742 Market St, Apt 4B'}
                  </span>
                </span>
                <span className="flex items-center gap-1 font-medium text-zinc-800 shrink-0 whitespace-nowrap">
                  <Clock className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />
                  {fulfillment === 'pickup' ? '15 min' : '25 min'}
                </span>
              </div>
            </div>

            {/* Order Items */}
            <section aria-label="Order items" className="space-y-2.5">
              <div className="flex items-center justify-between px-0.5">
                <h3 className="font-display text-sm font-bold text-[#1A141E]">
                  Your Order
                </h3>
                <span className="text-xs text-zinc-500">
                  Kitchen prepared fresh
                </span>
              </div>

              {activeItems.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-6 text-center space-y-3">
                  <ShoppingBag className="h-7 w-7 mx-auto text-zinc-400" />
                  <p className="text-sm text-zinc-600">Your bag is empty.</p>
                  <button
                    type="button"
                    onClick={onResetEmptyCart}
                    className="min-h-[44px] px-4 rounded-xl bg-[#4A156B] text-white text-xs font-semibold"
                  >
                    Restore Sample Order
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-zinc-100 rounded-2xl border border-zinc-200/80 bg-white">
                  {activeItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3"
                    >
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-zinc-100">
                        {failedImages[item.id] ? (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#F4EFF8] to-[#EAE0F0] text-[#4A156B]">
                            <UtensilsCrossed className="h-5 w-5" />
                          </div>
                        ) : (
                          <img
                            src={item.image}
                            alt={item.name}
                            referrerPolicy="no-referrer"
                            onError={() =>
                              setFailedImages((prev) => ({
                                ...prev,
                                [item.id]: true,
                              }))
                            }
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="font-display text-[13.5px] font-semibold text-[#1A141E] truncate">
                          {item.name}
                        </p>
                        <p className="text-[11.5px] text-zinc-500 truncate">
                          {item.subtitle}
                        </p>
                        <p className="mt-0.5 font-mono-num text-[13px] font-semibold text-[#1A141E]">
                          {fmt(item.price * item.quantity)}
                        </p>
                      </div>

                      {/* 44px-friendly Quantity Stepper */}
                      <div className="flex items-center rounded-xl border border-zinc-200 bg-zinc-50">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          aria-label={`Decrease ${item.name} quantity`}
                          className="flex h-10 w-9 items-center justify-center text-zinc-600 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-[#4A156B]"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="font-mono-num w-5 text-center text-xs font-semibold text-zinc-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          aria-label={`Increase ${item.name} quantity`}
                          className="flex h-10 w-9 items-center justify-center text-zinc-600 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-[#4A156B]"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Bill Breakdown */}
            <section
              aria-label="Order summary"
              className="rounded-2xl border border-zinc-200/80 bg-white p-4 space-y-2 text-[13px]"
            >
              <div className="flex justify-between text-zinc-600">
                <span>Subtotal</span>
                <span className="font-mono-num font-medium text-zinc-900">
                  {fmt(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Kitchen & packaging</span>
                <span className="font-mono-num font-medium text-zinc-900">
                  {fmt(serviceFee)}
                </span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Delivery fee</span>
                <span className="font-mono-num font-medium text-zinc-900">
                  {deliveryFee === 0 ? 'Free' : fmt(deliveryFee)}
                </span>
              </div>

              {isMemberJoined && activeItems.length > 0 && (
                <div className="flex justify-between text-[#4A156B] font-semibold">
                  <span>Belly Tribe Member ({discountPercent}% off)</span>
                  <span className="font-mono-num">-{fmt(savingsAmount)}</span>
                </div>
              )}

              <div className="border-t border-zinc-100 pt-2.5 mt-1 flex items-baseline justify-between">
                <span className="font-display text-sm font-bold text-[#1A141E]">
                  {isMemberJoined ? 'Member Total' : 'Total'}
                </span>
                <div className="text-right">
                  {isMemberJoined && activeItems.length > 0 && (
                    <span className="font-mono-num mr-2 text-xs text-zinc-400 line-through">
                      {fmt(preDiscountTotal)}
                    </span>
                  )}
                  <span className="font-mono-num text-base font-bold text-[#1A141E]">
                    {fmt(payableTotal)}
                  </span>
                </div>
              </div>
            </section>
          </>
        )}
      </div>

      {/* Bottom Checkout Action Dock */}
      {!orderPlacedType && activeItems.length > 0 && (
        <div className="shrink-0 border-t border-zinc-200/80 bg-white/95 px-4 pt-3 pb-4 backdrop-blur-md space-y-2.5">
          {variant === 'improved' || isMemberJoined ? (
            <>
              {/* 1. Primary Hero Option: Sign Up to Belly Tribe */}
              <TribeSavingsButton
                variant={variant}
                discountPercent={discountPercent}
                savingsAmount={savingsAmount}
                discountedTotal={discountedTotal}
                currencySymbol={currencySymbol}
                isMemberJoined={isMemberJoined}
                onSignUpClick={() => setIsSignUpSheetOpen(true)}
                onLeaveMembership={() => setIsMemberJoined(false)}
              />

              {/* 2. Subdued Secondary Option (or Primary Pay if Member Joined) */}
              <button
                type="button"
                onClick={handleProceedToPay}
                className={
                  isMemberJoined
                    ? 'w-full min-h-[52px] rounded-2xl bg-[#4A156B] px-4 py-3 font-display text-sm font-bold text-white shadow-md shadow-[#4A156B]/20 transition-all hover:bg-[#3B1056] active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A156B]'
                    : 'w-full min-h-[46px] rounded-xl border border-zinc-200 bg-white px-4 py-2.5 font-display text-[13.5px] font-medium text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900 active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400'
                }
              >
                {isMemberJoined
                  ? `Proceed to Pay · ${fmt(payableTotal)}`
                  : `Proceed to Pay without discount · ${fmt(preDiscountTotal)}`}
              </button>
            </>
          ) : (
            /* Original Baseline Order: Ghost Lavender Option + Dominant Dark Proceed to Pay */
            <>
              <TribeSavingsButton
                variant="original"
                discountPercent={discountPercent}
                savingsAmount={savingsAmount}
                discountedTotal={discountedTotal}
                currencySymbol={currencySymbol}
                isMemberJoined={false}
                onSignUpClick={() => setIsSignUpSheetOpen(true)}
                onLeaveMembership={() => setIsMemberJoined(false)}
              />
              <button
                type="button"
                onClick={handleProceedToPay}
                className="w-full min-h-[54px] rounded-2xl bg-[#1A141E] px-4 py-3.5 font-display text-[15px] font-bold text-white shadow-lg shadow-zinc-900/15 transition-colors hover:bg-zinc-800 active:scale-[0.99]"
              >
                Proceed to Pay · {fmt(preDiscountTotal)}
              </button>
            </>
          )}
        </div>
      )}

      {/* Instant Belly Tribe Sign-Up Bottom Sheet */}
      <AnimatePresence>
        {isSignUpSheetOpen && (
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            className="absolute inset-0 z-30 flex items-end bg-black/45 backdrop-blur-[2px]"
            onClick={() => setIsSignUpSheetOpen(false)}
          >
            <motion.div
              initial={{y: '100%'}}
              animate={{y: 0}}
              exit={{y: '100%'}}
              transition={{type: 'spring', stiffness: 360, damping: 34}}
              onClick={(e) => e.stopPropagation()}
              className="w-full rounded-t-3xl bg-white p-5 pb-6 shadow-2xl space-y-4"
            >
              <div className="mx-auto h-1.5 w-10 rounded-full bg-zinc-300" />

              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg font-bold text-[#1A141E]">
                    Join Belly Tribe Free
                  </h3>
                  <p className="text-xs text-zinc-600 mt-0.5">
                    Save{' '}
                    <span className="font-mono-num font-bold text-[#4A156B]">
                      {fmt(savingsAmount)} ({discountPercent}%)
                    </span>{' '}
                    immediately on today&apos;s order.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSignUpSheetOpen(false)}
                  aria-label="Close sign up sheet"
                  className="flex min-h-[44px] min-w-[44px] -mt-2 -mr-2 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleConfirmSignUp} className="space-y-3">
                <div>
                  <label
                    htmlFor="tribe-name"
                    className="block text-xs font-medium text-zinc-700 mb-1"
                  >
                    Full name
                  </label>
                  <input
                    id="tribe-name"
                    type="text"
                    required
                    value={memberName}
                    onChange={(e) => setMemberName(e.target.value)}
                    className="w-full min-h-[44px] rounded-xl border border-zinc-200 px-3 text-sm text-zinc-900 focus:border-[#4A156B] focus:outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="tribe-phone"
                    className="block text-xs font-medium text-zinc-700 mb-1"
                  >
                    Mobile number
                  </label>
                  <input
                    id="tribe-phone"
                    type="tel"
                    required
                    value={memberPhone}
                    onChange={(e) => setMemberPhone(e.target.value)}
                    className="w-full min-h-[44px] rounded-xl border border-zinc-200 px-3 text-sm text-zinc-900 font-mono-num focus:border-[#4A156B] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full min-h-[52px] rounded-2xl bg-[#4A156B] px-4 py-3 font-display text-sm font-bold text-white shadow-lg shadow-[#4A156B]/25 hover:bg-[#3B1056] active:scale-[0.99] transition-all"
                >
                  Join &amp; Apply {fmt(savingsAmount)} ({discountPercent}%) Savings
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
