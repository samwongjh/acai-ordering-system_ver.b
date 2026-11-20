import { Award, ChevronRight } from 'lucide-react';
import type { MemberAccount } from '../types.ts';

interface BellyClubSubHeaderProps {
  member: MemberAccount | null;
  isClubActive: boolean;
  onOpenBellyClub: () => void;
}

export function BellyClubSubHeader({
  member,
  isClubActive,
  onOpenBellyClub,
}: BellyClubSubHeaderProps) {
  return (
    <div className="h-[36px] md:h-11 bg-[#F3EFEA]/95 backdrop-blur-md border-b border-[#1C1523]/8">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center">
        <button
          type="button"
          onClick={onOpenBellyClub}
          className="w-full h-full flex items-center justify-between gap-3 text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2378] rounded-lg"
        >
          <div className="min-w-0 flex items-center gap-2">
            <Award className="w-4 h-4 text-[#5B2378] shrink-0" />
            <div className="min-w-0 flex items-baseline gap-2 text-xs sm:text-sm">
              <span
                className={`font-display font-bold whitespace-nowrap shrink-0 ${
                  isClubActive
                    ? 'text-[#5B2378] underline underline-offset-4 decoration-2'
                    : 'text-[#1C1523] group-hover:text-[#5B2378]'
                }`}
              >
                Belly Tribe
              </span>
              <span className="text-[#665E6E] truncate">
                {member
                  ? `${member.tier} · ${member.points} Belly Points available`
                  : "Join the Tribe. It's free today!"}
              </span>
            </div>
          </div>

          <ChevronRight className="w-4 h-4 text-[#665E6E] group-hover:text-[#5B2378] shrink-0" />
        </button>
      </div>
    </div>
  );
}
