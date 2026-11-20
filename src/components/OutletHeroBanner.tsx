import { Clock, MapPin, Star, Truck, Store } from 'lucide-react';
import type { FulfillmentMode, OutletInfo } from '../types.ts';
import { FoodImage } from './FoodImage.tsx';

interface OutletHeroBannerProps {
  outlet: OutletInfo;
  fulfillmentMode: FulfillmentMode;
  onChangeFulfillment: (mode: FulfillmentMode) => void;
}

export function OutletHeroBanner({
  outlet,
  fulfillmentMode,
  onChangeFulfillment,
}: OutletHeroBannerProps) {
  return (
    <section className="bg-white border-b border-[#1C1523]/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-stretch">
          {/* Store Banner Photo */}
          <div className="lg:col-span-5 relative overflow-hidden rounded-2xl bg-[#F3EFEA] aspect-[16/9] lg:aspect-auto lg:min-h-[210px]">
            <FoodImage
              src={outlet.heroImage}
              alt={`${outlet.brand} ${outlet.branch} signature acai bowls and matcha`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-3.5 right-3.5 flex items-end justify-between text-white">
              <div>
                <p className="text-xs font-medium text-white/85">
                  QSR Express Ordering · {outlet.branch}
                </p>
                <p className="font-display text-lg font-bold leading-snug">
                  100% Pure Brazilian Açaí
                </p>
              </div>
            </div>
          </div>

          {/* Outlet Details & Fulfillment Segmented Selector */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#1C1523] text-balance">
                  {outlet.brand}
                </h1>
                <div className="flex items-center gap-1.5 text-sm font-medium text-[#1C1523] tabular-nums">
                  <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                  <span>{outlet.rating.toFixed(1)}</span>
                  <span className="text-[#665E6E] font-normal">({outlet.reviewCount})</span>
                </div>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs sm:text-sm text-[#665E6E]">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#5B2378]" />
                  {outlet.address}
                </span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#5B2378]" />
                  {outlet.hours}
                </span>
              </div>
            </div>

            {/* Qlub-Style Fulfillment Segmented Control */}
            <div className="bg-[#FAF9F7] border border-[#1C1523]/8 rounded-2xl p-3 sm:p-4">
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#EAE3DA]/70 rounded-xl">
                <button
                  type="button"
                  onClick={() => onChangeFulfillment('pickup')}
                  className={`min-h-[44px] px-3 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                    fulfillmentMode === 'pickup'
                      ? 'bg-white text-[#1C1523] shadow-sm'
                      : 'text-[#665E6E] hover:text-[#1C1523]'
                  }`}
                >
                  <Store className="w-4 h-4 text-[#5B2378]" />
                  <span>Self Pick-Up</span>
                </button>
                <button
                  type="button"
                  onClick={() => onChangeFulfillment('delivery')}
                  className={`min-h-[44px] px-3 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                    fulfillmentMode === 'delivery'
                      ? 'bg-white text-[#1C1523] shadow-sm'
                      : 'text-[#665E6E] hover:text-[#1C1523]'
                  }`}
                >
                  <Truck className="w-4 h-4 text-[#5B2378]" />
                  <span>Island Delivery</span>
                </button>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-[#665E6E]">
                {fulfillmentMode === 'pickup' ? (
                  <>
                    <span className="font-medium text-[#1C1523]">
                      Express Counter #01-01 · Ready in {outlet.pickupLeadTime}
                    </span>
                    <span className="tabular-nums">No service fee · Skip the queue</span>
                  </>
                ) : (
                  <>
                    <span className="font-medium text-[#1C1523]">
                      Island-Wide Delivery · Est. {outlet.deliveryLeadTime}
                    </span>
                    <span className="tabular-nums">
                      S${outlet.deliveryFee.toFixed(2)} fee · Free over S$
                      {outlet.freeDeliveryThreshold.toFixed(0)}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
