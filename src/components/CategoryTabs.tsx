import { Search, X } from 'lucide-react';
import type { MenuCategoryId } from '../types.ts';

interface CategoryTabsProps {
  categories: Array<{ id: MenuCategoryId; label: string }>;
  activeCategory: MenuCategoryId;
  onSelectCategory: (category: MenuCategoryId) => void;
  searchQuery: string;
  onChangeSearch: (query: string) => void;
}

export function CategoryTabs({
  categories,
  activeCategory,
  onSelectCategory,
  searchQuery,
  onChangeSearch,
}: CategoryTabsProps) {
  return (
    <div className="sticky top-[84px] md:top-[108px] z-20 bg-[#FAF9F7]/95 backdrop-blur-md border-b border-[#1C1523]/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div
          className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5"
          role="tablist"
          aria-label="Menu categories"
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onSelectCategory(cat.id)}
                className={`min-h-[40px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#1C1523] text-white'
                    : 'bg-white text-[#665E6E] border border-[#1C1523]/8 hover:text-[#1C1523] hover:border-[#1C1523]/20'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Inline search input */}
        <div className="relative sm:w-56 shrink-0">
          <Search className="w-4 h-4 text-[#665E6E] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onChangeSearch(e.target.value)}
            placeholder="Search bowls or drinks..."
            aria-label="Search menu"
            className="w-full h-10 pl-9 pr-8 rounded-xl bg-white border border-[#1C1523]/10 text-sm text-[#1C1523] placeholder:text-[#665E6E]/70 focus:outline-none focus:border-[#5B2378] focus:ring-2 focus:ring-[#5B2378]/15"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onChangeSearch('')}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#665E6E] hover:text-[#1C1523] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
