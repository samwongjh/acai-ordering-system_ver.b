import {AnimatePresence, motion} from 'motion/react';
import {CheckCircle2, ChevronRight, UserPlus} from 'lucide-react';
import {DesignVariant} from '../types/checkout';

interface TribeSavingsButtonProps {
  variant: DesignVariant;
  discountPercent: number;
  savingsAmount: number;
  discountedTotal: number;
  currencySymbol: string;
  isMemberJoined: boolean;
  onSignUpClick: () => void;
  onLeaveMembership: () => void;
}

export function TribeSavingsButton({
  variant,
  discountPercent,
  savingsAmount,
  discountedTotal,
  currencySymbol,
  isMemberJoined,
  onSignUpClick,
  onLeaveMembership,
}: TribeSavingsButtonProps) {
  const formattedSavings = `${currencySymbol}${savingsAmount.toFixed(2)}`;
  const formattedDiscountedTotal = `${currencySymbol}${discountedTotal.toFixed(2)}`;

  if (isMemberJoined) {
    return (
      <motion.div
        initial={{opacity: 0, scale: 0.98}}
        animate={{opacity: 1, scale: 1}}
        transition={{duration: 0.2, ease: [0.16, 1, 0.3, 1]}}
        className="rounded-2xl border border-[#4A156B]/20 bg-[#F7F1FA] px-4 py-3.5"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#4A156B] text-white">
              <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="font-display text-sm font-bold text-[#3D1159] truncate">
                Belly Tribe Savings Applied
              </p>
              <p className="text-xs text-[#6B4682] truncate">
                Saving{' '}
                <span className="font-mono-num font-semibold text-[#3D1159]">
                  {formattedSavings}
                </span>{' '}
                ({discountPercent}% off) on this order
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onLeaveMembership}
            className="min-h-[44px] px-2.5 text-xs font-medium text-[#5B267D] underline underline-offset-2 hover:text-[#3D1159] shrink-0 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A156B]"
          >
            Preview guest
          </button>
        </div>
      </motion.div>
    );
  }

  if (variant === 'original') {
    return (
      <button
        type="button"
        onClick={onSignUpClick}
        className="w-full min-h-[52px] rounded-2xl border border-[#C7B3D1] bg-[#F5EFF8] px-4 py-3 flex items-center justify-between gap-3 text-[#4A1C6B] transition-colors hover:bg-[#EFE5F4] active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A156B]"
      >
        <span className="flex items-center gap-3 min-w-0">
          <UserPlus className="h-5 w-5 shrink-0 stroke-[1.8]" aria-hidden="true" />
          <span className="font-display text-[15px] font-semibold tracking-tight truncate">
            Sign Up to Belly Tribe
          </span>
        </span>
        <span className="font-display text-[15px] font-semibold shrink-0 whitespace-nowrap">
          Save {discountPercent}%
        </span>
      </button>
    );
  }

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="animate-tribe-ring pointer-events-none absolute -inset-1 rounded-[20px] bg-gradient-to-r from-[#6A1F96]/30 via-[#9C42CF]/25 to-[#6A1F96]/30 blur-sm"
      />
      <motion.button
        type="button"
        onClick={onSignUpClick}
        whileHover={{y: -1.5, scale: 1.008}}
        whileTap={{scale: 0.985}}
        transition={{type: 'spring', stiffness: 420, damping: 28}}
        className="group relative w-full min-h-[68px] overflow-hidden rounded-2xl bg-gradient-to-r from-[#431163] via-[#5A1C82] to-[#4A156B] px-4 py-3.5 text-left text-white shadow-[0_14px_30px_-8px_rgba(74,21,107,0.48)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A156B]"
      >
        {/* Diagonal compositor-only sheen */}
        <span
          aria-hidden="true"
          className="animate-tribe-sheen pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent"
        />

        <div className="relative z-10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <motion.div
              animate={{scale: [1, 1.07, 1]}}
              transition={{duration: 2.4, repeat: Infinity, ease: 'easeInOut'}}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25"
            >
              <UserPlus className="h-5 w-5 text-white stroke-[2]" aria-hidden="true" />
            </motion.div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-display text-[15px] font-bold tracking-tight text-white truncate">
                  Sign Up to Belly Tribe
                </span>
                <ChevronRight
                  className="h-4 w-4 shrink-0 text-white/80 transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </div>
              <p className="text-[12px] text-purple-100/90 truncate">
                Pay{' '}
                <span className="font-mono-num font-semibold text-white">
                  {formattedDiscountedTotal}
                </span>{' '}
                instead · Instant free signup
              </p>
            </div>
          </div>

          <div className="shrink-0 rounded-xl bg-white/14 px-3 py-1.5 text-right ring-1 ring-white/20 backdrop-blur-xs">
            <div className="flex items-baseline justify-end gap-1">
              <span className="text-[11px] font-medium text-purple-100">Save</span>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={formattedSavings}
                  initial={{y: 7, opacity: 0}}
                  animate={{y: 0, opacity: 1}}
                  exit={{y: -7, opacity: 0}}
                  transition={{duration: 0.22, ease: [0.16, 1, 0.3, 1]}}
                  className="font-mono-num text-[16px] font-bold tracking-tight text-[#FDE68A]"
                >
                  {formattedSavings}
                </motion.span>
              </AnimatePresence>
            </div>
            <div className="font-mono-num text-[11px] font-semibold text-white/95">
              {discountPercent}% off order
            </div>
          </div>
        </div>
      </motion.button>
    </div>
  );
}
