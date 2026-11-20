import {useState} from 'react';
import {Info, RotateCcw} from 'lucide-react';
import {CART_PRESETS} from '../data/menuItems';
import {
  CURRENCIES,
  CurrencyCode,
  DesignVariant,
} from '../types/checkout';

interface DesignInspectorPanelProps {
  variant: DesignVariant;
  onVariantChange: (v: DesignVariant) => void;
  discountPercent: number;
  onDiscountChange: (pct: number) => void;
  currency: CurrencyCode;
  onCurrencyChange: (code: CurrencyCode) => void;
  subtotal: number;
  savingsAmount: number;
  onApplyPreset: (preset: 'solo' | 'duo' | 'group') => void;
  onResetAll: () => void;
}

const DISCOUNT_OPTIONS = [12, 16, 20, 25];

export function DesignInspectorPanel({
  variant,
  onVariantChange,
  discountPercent,
  onDiscountChange,
  currency,
  onCurrencyChange,
  subtotal,
  savingsAmount,
  onApplyPreset,
  onResetAll,
}: DesignInspectorPanelProps) {
  const [screenshotFailed, setScreenshotFailed] = useState(false);
  const symbol = CURRENCIES[currency].symbol;

  return (
    <div className="space-y-6">
      {/* Commit Availability Notice */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-700">
        <div className="flex items-start gap-3">
          <Info
            className="h-4 w-4 text-[#4A156B] shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <div className="space-y-1">
            <p className="font-display text-xs font-semibold text-zinc-900">
              Built from uploaded design reference
            </p>
            <p className="text-xs leading-relaxed text-zinc-600">
              GitHub commit{' '}
              <code className="font-mono-num text-[11px] bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-800">
                97157fd
              </code>{' '}
              could not be fetched because no repository URL or local git history
              was attached to this workspace. This interactive mobile checkout
              implements your improved Belly Tribe savings CTA using your
              screenshot.
            </p>
          </div>
        </div>
      </div>

      {/* Main Comparison & Interactive Controls */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-100 pb-5">
          <div className="space-y-1">
            <h1 className="font-display text-2xl font-bold tracking-tight text-[#1A141E] text-balance">
              Belly Tribe Savings Hierarchy
            </h1>
            <p className="text-xs text-zinc-500">
              Absolute savings + percentage · Compositor-only animation ·
              Primary CTA prominence
            </p>
          </div>
          <button
            type="button"
            onClick={onResetAll}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-zinc-200 px-3 text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors whitespace-nowrap shrink-0"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Reset order
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="space-y-2">
          <span className="block text-xs font-semibold text-zinc-700">
            Checkout CTA Mode
          </span>
          <div className="grid grid-cols-2 gap-1.5 rounded-xl bg-zinc-100 p-1">
            <button
              type="button"
              onClick={() => onVariantChange('improved')}
              className={`min-h-[44px] rounded-lg px-3 text-xs font-semibold transition-all whitespace-nowrap ${
                variant === 'improved'
                  ? 'bg-white text-[#4A156B] shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Improved (Animated + {symbol} Value)
            </button>
            <button
              type="button"
              onClick={() => onVariantChange('original')}
              className={`min-h-[44px] rounded-lg px-3 text-xs font-semibold transition-all whitespace-nowrap ${
                variant === 'original'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Original Baseline
            </button>
          </div>
        </div>

        {/* Live Order & Savings Simulator */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <span className="block text-xs font-semibold text-zinc-700">
              Order Size Preset
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(CART_PRESETS) as Array<'solo' | 'duo' | 'group'>).map(
                (key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => onApplyPreset(key)}
                    className="min-h-[40px] rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-xs font-medium text-zinc-700 hover:border-[#4A156B]/40 hover:bg-[#F7F1FA] hover:text-[#4A156B] transition-colors whitespace-nowrap"
                  >
                    {CART_PRESETS[key].label}
                  </button>
                ),
              )}
            </div>
          </div>

          <div className="space-y-2">
            <span className="block text-xs font-semibold text-zinc-700">
              Member Discount &amp; Currency
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {DISCOUNT_OPTIONS.map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => onDiscountChange(pct)}
                  className={`min-h-[40px] rounded-lg px-2.5 font-mono-num text-xs font-semibold transition-colors ${
                    discountPercent === pct
                      ? 'bg-[#4A156B] text-white'
                      : 'border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
                  }`}
                >
                  {pct}%
                </button>
              ))}
              <div className="h-5 w-px bg-zinc-200 mx-0.5" aria-hidden="true" />
              {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => onCurrencyChange(code)}
                  className={`min-h-[40px] rounded-lg px-2.5 font-mono-num text-xs font-semibold transition-colors ${
                    currency === code
                      ? 'bg-zinc-900 text-white'
                      : 'border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
                  }`}
                >
                  {CURRENCIES[code].symbol}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Math Readout */}
        <div className="grid grid-cols-3 gap-3 rounded-xl bg-[#FAF8F6] p-4 border border-zinc-200/70">
          <div>
            <p className="text-[11px] text-zinc-500">Order Subtotal</p>
            <p className="font-mono-num text-lg font-bold text-zinc-900 mt-0.5">
              {symbol}
              {subtotal.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-zinc-500">Absolute Savings</p>
            <p className="font-mono-num text-lg font-bold text-[#4A156B] mt-0.5">
              {symbol}
              {savingsAmount.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-zinc-500">Discount Rate</p>
            <p className="font-mono-num text-lg font-bold text-zinc-900 mt-0.5">
              {discountPercent}% off
            </p>
          </div>
        </div>

        {/* Original Screenshot vs Improved Summary */}
        <div className="space-y-3 border-t border-zinc-100 pt-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-sm font-bold text-zinc-900">
              Original Screenshot Reference
            </h2>
            <span className="text-xs text-zinc-500">
              Before visual hierarchy upgrade
            </span>
          </div>

          {!screenshotFailed && (
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
              <img
                src="/assets/aistudio/Screenshot_2026-11-20_at_3.50.11_PM_dd9d07d1.png"
                alt="Original Sign Up to Belly Tribe button showing Save 16% without absolute savings"
                referrerPolicy="no-referrer"
                onError={() => setScreenshotFailed(true)}
                className="w-full max-w-[380px] mx-auto rounded-lg"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-zinc-600 pt-1">
            <div className="space-y-1">
              <p className="font-display font-semibold text-zinc-900">
                01. Absolute + % Value
              </p>
              <p className="leading-relaxed">
                Displays exact currency saved ({symbol}
                {savingsAmount.toFixed(2)}) above {discountPercent}% off so value
                is concrete.
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-display font-semibold text-zinc-900">
                02. Inverted Prominence
              </p>
              <p className="leading-relaxed">
                Deep plum primary gradient outranks the muted secondary Proceed to
                Pay outline button.
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-display font-semibold text-zinc-900">
                03. Motion Restraint
              </p>
              <p className="leading-relaxed">
                Diagonal sheen, gentle ring breath, and animated dollar readout
                honor reduced motion.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
