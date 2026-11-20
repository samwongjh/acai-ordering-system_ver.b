import { ShoppingCart, User } from 'lucide-react';
import type { MemberAccount } from '../types.ts';

export type AppView = 'menu' | 'promotions' | 'track' | 'club';

interface TopHeaderProps {
  activeView: AppView;
  onChangeView: (view: AppView) => void;
  onOpenAuthModal: () => void;
  onOpenMobileCart: () => void;
  member: MemberAccount | null;
  cartCount: number;
  hasActiveOrder: boolean;
}

export function TopHeader({
  activeView,
  onChangeView,
  onOpenAuthModal,
  onOpenMobileCart,
  member,
  cartCount,
  hasActiveOrder,
}: TopHeaderProps) {
  return (
    <header className="h-[48px] md:h-16 bg-white/95 backdrop-blur-md border-b border-[#1C1523]/8">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6">
        {/* Zone 1: Single text element wordmark */}
        <button
          type="button"
          onClick={() => onChangeView('menu')}
          className="font-display text-lg md:text-xl font-bold tracking-tight text-[#1C1523] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2378] rounded-md px-1 -ml-1"
        >
          BellyBelly Good
        </button>

        {/* Zone 2: Clean single-line navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#665E6E]" aria-label="Main navigation">
          <button
            type="button"
            onClick={() => onChangeView('menu')}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
              activeView === 'menu'
                ? 'text-[#1C1523] border-[#5B2378] font-semibold'
                : 'border-transparent hover:text-[#1C1523]'
            }`}
          >
            Menu
          </button>
          <button
            type="button"
            onClick={() => onChangeView('track')}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 flex items-center gap-1.5 ${
              activeView === 'track'
                ? 'text-[#1C1523] border-[#5B2378] font-semibold'
                : 'border-transparent hover:text-[#1C1523]'
            }`}
          >
            <span>Track Order</span>
            {hasActiveOrder && (
              <span className="text-[11px] font-semibold text-[#5B2378]">(Live)</span>
            )}
          </button>
          <button
            type="button"
            onClick={() => onChangeView('promotions')}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
              activeView === 'promotions'
                ? 'text-[#1C1523] border-[#5B2378] font-semibold'
                : 'border-transparent hover:text-[#1C1523]'
            }`}
          >
            Promotions
          </button>
        </nav>

        {/* Zone 3: Cart & Member Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Desktop & Tablet Cart button */}
          <button
            type="button"
            onClick={onOpenMobileCart}
            aria-label={`Open Cart${cartCount > 0 ? ` (${cartCount} items)` : ''}`}
            className="hidden md:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#1C1523]/12 hover:border-[#5B2378]/40 bg-white hover:bg-[#FAF9F7] text-xs font-semibold text-[#1C1523] transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[40px]"
          >
            <ShoppingCart className="w-4 h-4 text-[#5B2378]" />
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="font-mono tabular-nums text-[#5B2378]">({cartCount})</span>
            )}
          </button>

          {member ? (
            <button
              type="button"
              onClick={() => onChangeView('club')}
              className="hidden md:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#F3EFEA] hover:bg-[#EAE3DA] text-xs font-semibold text-[#1C1523] transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[40px]"
            >
              <User className="w-3.5 h-3.5 text-[#5B2378]" />
              <span>{member.name.split(' ')[0]}</span>
              <span className="text-[#665E6E] font-normal">·</span>
              <span className="font-mono tabular-nums text-[#5B2378]">{member.points} pts</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1C1523] hover:bg-[#2E2339] text-xs font-semibold text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[40px]"
            >
              <User className="w-3.5 h-3.5" />
              <span>Member Sign In</span>
            </button>
          )}

          {/* Mobile compact action: Cart / Account */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              type="button"
              onClick={member ? () => onChangeView('club') : onOpenAuthModal}
              aria-label={member ? 'Belly Tribe Account' : 'Sign in'}
              className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl text-[#1C1523] hover:bg-[#F3EFEA] transition-colors cursor-pointer"
            >
              <User className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={onOpenMobileCart}
              aria-label="Open Cart"
              className="relative min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl text-[#1C1523] hover:bg-[#F3EFEA] transition-colors cursor-pointer"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#5B2378] text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
