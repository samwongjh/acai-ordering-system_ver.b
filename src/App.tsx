import {useState} from 'react';
import {MotionConfig} from 'motion/react';
import {CART_PRESETS, INITIAL_CART_ITEMS} from './data/menuItems';
import {
  CartItem,
  CURRENCIES,
  CurrencyCode,
  DesignVariant,
  FulfillmentMode,
} from './types/checkout';
import {MobileCheckoutScreen} from './components/MobileCheckoutScreen';
import {DesignInspectorPanel} from './components/DesignInspectorPanel';

export default function App() {
  const [items, setItems] = useState<CartItem[]>(INITIAL_CART_ITEMS);
  const [variant, setVariant] = useState<DesignVariant>('improved');
  const [discountPercent, setDiscountPercent] = useState<number>(16);
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [fulfillment, setFulfillment] = useState<FulfillmentMode>('pickup');

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const savingsAmount = Number(((subtotal * discountPercent) / 100).toFixed(2));
  const currencySymbol = CURRENCIES[currency].symbol;

  const handleUpdateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {...item, quantity: Math.max(0, item.quantity + delta)}
          : item,
      ),
    );
  };

  const handleApplyPreset = (presetKey: 'solo' | 'duo' | 'group') => {
    const preset = CART_PRESETS[presetKey];
    setItems((prev) =>
      prev.map((item) => ({
        ...item,
        quantity: preset.quantities[item.id] ?? 0,
      })),
    );
  };

  const handleResetAll = () => {
    setItems(INITIAL_CART_ITEMS);
    setVariant('improved');
    setDiscountPercent(16);
    setCurrency('USD');
    setFulfillment('pickup');
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#FAF8F6] text-[#1A141E]">
        {/* Mobile compact switcher above native mobile checkout */}
        <div className="lg:hidden border-b border-zinc-200 bg-white px-4 py-2 flex items-center justify-between gap-2">
          <span className="font-display text-xs font-bold text-[#4A156B] whitespace-nowrap">
            Preview Mode
          </span>
          <div className="flex items-center gap-1 rounded-lg bg-zinc-100 p-0.5">
            <button
              type="button"
              onClick={() => setVariant('improved')}
              className={`min-h-[36px] rounded-md px-2.5 text-[11px] font-semibold transition-colors whitespace-nowrap ${
                variant === 'improved'
                  ? 'bg-white text-[#4A156B] shadow-xs'
                  : 'text-zinc-600'
              }`}
            >
              Improved
            </button>
            <button
              type="button"
              onClick={() => setVariant('original')}
              className={`min-h-[36px] rounded-md px-2.5 text-[11px] font-semibold transition-colors whitespace-nowrap ${
                variant === 'original'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600'
              }`}
            >
              Original
            </button>
          </div>
        </div>

        {/* Main Responsive Layout */}
        <main className="mx-auto max-w-6xl lg:px-8 lg:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-10 items-start">
            {/* Mobile App Viewport (full width on mobile, realistic 390px frame on desktop) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full lg:w-[390px] lg:shrink-0">
                <MobileCheckoutScreen
                  items={items}
                  variant={variant}
                  discountPercent={discountPercent}
                  currencySymbol={currencySymbol}
                  fulfillment={fulfillment}
                  onFulfillmentChange={setFulfillment}
                  onUpdateQuantity={handleUpdateQuantity}
                  onResetEmptyCart={() => setItems(INITIAL_CART_ITEMS)}
                />
              </div>
            </div>

            {/* Design Controls & Before/After Specification */}
            <div className="lg:col-span-7 px-4 py-6 lg:px-0 lg:py-0">
              <DesignInspectorPanel
                variant={variant}
                onVariantChange={setVariant}
                discountPercent={discountPercent}
                onDiscountChange={setDiscountPercent}
                currency={currency}
                onCurrencyChange={setCurrency}
                subtotal={subtotal}
                savingsAmount={savingsAmount}
                onApplyPreset={handleApplyPreset}
                onResetAll={handleResetAll}
              />
            </div>
          </div>
        </main>
      </div>
    </MotionConfig>
  );
}
