import { useState } from 'react';
import { Check, Clock, Copy, MapPin, ShieldCheck, Store, Tag, Truck } from 'lucide-react';
import type { OutletInfo } from '../types.ts';

interface PromotionsViewProps {
  outlet: OutletInfo;
  onBrowseMenu: () => void;
}

export function PromotionsView({ outlet, onBrowseMenu }: PromotionsViewProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = (code: string) => {
    navigator.clipboard?.writeText(code).catch(() => {});
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1800);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Promotions Section */}
      <section className="bg-white rounded-2xl border border-[#1C1523]/8 p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1C1523]/8">
          <div>
            <p className="text-xs font-semibold text-[#5B2378]">Exclusive Offers</p>
            <h1 className="font-display text-2xl font-bold text-[#1C1523]">
              Promotions &amp; Kitchen Details
            </h1>
          </div>
          <button
            type="button"
            onClick={onBrowseMenu}
            className="min-h-[40px] px-4 rounded-xl bg-[#1C1523] hover:bg-[#5B2378] text-white text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
          >
            Order Now
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {outlet.activePromos.map((promo) => (
            <div
              key={promo.code}
              className="p-4 rounded-2xl bg-[#FAF9F7] border border-[#1C1523]/8 flex flex-col justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#5B2378]">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Promo Code</span>
                </div>
                <h2 className="font-display text-base font-bold text-[#1C1523]">{promo.label}</h2>
                <p className="text-xs text-[#665E6E] leading-relaxed">{promo.detail}</p>
              </div>

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#1C1523]/8">
                <span className="font-mono text-sm font-bold text-[#1C1523] tracking-wide">
                  {promo.code}
                </span>
                <button
                  type="button"
                  onClick={() => copyCode(promo.code)}
                  className="min-h-[38px] px-3 rounded-xl bg-white border border-[#1C1523]/12 hover:border-[#5B2378] text-xs font-semibold text-[#5B2378] inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  {copiedCode === promo.code ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Transferred Flagship Location, Hours & Dietary Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-white rounded-2xl border border-[#1C1523]/8 p-5 sm:p-6 space-y-4">
          <h2 className="font-display text-base font-bold text-[#1C1523]">
            {outlet.brand} · {outlet.branch}
          </h2>

          <div className="space-y-3.5 text-sm text-[#1C1523]">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#5B2378] mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold">{outlet.address}</p>
                <p className="text-xs text-[#665E6E]">{outlet.postalCode}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-[#5B2378] mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold">{outlet.hours}</p>
                <p className="text-xs text-[#665E6E]">
                  Last QSR order accepted at 9:45 PM daily
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-[#5B2378] mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold">100% Organic Brazilian Açaí Base</p>
                <p className="text-xs text-[#665E6E] leading-relaxed">
                  Our signature açaí sorbet is vegan, dairy-free, and refined-sugar-free. Oat milk is available for all Thirst Trap beverages.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-[#1C1523]/8 p-5 sm:p-6 space-y-4">
          <h2 className="font-display text-base font-bold text-[#1C1523]">
            Pick-Up &amp; Delivery Terms
          </h2>

          <div className="space-y-3.5 text-sm text-[#1C1523]">
            <div className="flex items-start gap-3">
              <Store className="w-4 h-4 text-[#5B2378] mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold">Self Pick-Up · {outlet.pickupLeadTime}</p>
                <p className="text-xs text-[#665E6E] leading-relaxed">
                  Collect directly at Express Counter #01-01 using your queue number with zero service fees.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Truck className="w-4 h-4 text-[#5B2378] mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold">Island-Wide Delivery · {outlet.deliveryLeadTime}</p>
                <p className="text-xs text-[#665E6E] leading-relaxed tabular-nums">
                  Flat S${outlet.deliveryFee.toFixed(2)} delivery fee in chilled insulated bags. Free delivery for orders S${outlet.freeDeliveryThreshold.toFixed(0)} and above.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
