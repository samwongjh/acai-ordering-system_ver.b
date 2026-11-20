interface ConsentBannerProps {
  onAccept: () => void;
  onDecline: () => void;
}

export function ConsentBanner({ onAccept, onDecline }: ConsentBannerProps) {
  return (
    <aside
      aria-label="Analytics consent notice"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#1C1523]/12 bg-white/95 backdrop-blur-md shadow-[0_-10px_30px_-10px_rgba(28,21,35,0.16)]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-xs sm:text-[13px] text-[#1C1523] leading-relaxed max-w-3xl">
          This class prototype records which version you saw and what you pressed, to test a design.
          Nothing about your visit leaves this browser unless you agree.
        </p>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onAccept}
            className="flex-1 sm:flex-none min-w-[108px] h-10 px-5 rounded-xl bg-[#1C1523] hover:bg-[#5B2378] text-white text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
          >
            Accept
          </button>
          <button
            type="button"
            onClick={onDecline}
            className="flex-1 sm:flex-none min-w-[108px] h-10 px-5 rounded-xl bg-[#1C1523] hover:bg-[#5B2378] text-white text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
          >
            Decline
          </button>
        </div>
      </div>
    </aside>
  );
}
