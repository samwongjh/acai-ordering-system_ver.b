import { Plus } from 'lucide-react';
import type { MenuCategoryId, MenuItem } from '../types.ts';
import { MENU_CATEGORIES } from '../data/menuData.ts';
import { FoodImage } from './FoodImage.tsx';

interface MenuGridProps {
  items: MenuItem[];
  activeCategory: MenuCategoryId;
  searchQuery: string;
  itemCountByMenuId: Record<string, number>;
  onSelectItem: (item: MenuItem) => void;
  onQuickAddItem: (item: MenuItem) => void;
}

export function MenuGrid({
  items,
  activeCategory,
  searchQuery,
  itemCountByMenuId,
  onSelectItem,
  onQuickAddItem,
}: MenuGridProps) {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredItems = items.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesQuery =
      !normalizedQuery ||
      item.name.toLowerCase().includes(normalizedQuery) ||
      item.description.toLowerCase().includes(normalizedQuery) ||
      item.dietaryLine.toLowerCase().includes(normalizedQuery);
    return matchesCategory && matchesQuery;
  });

  if (filteredItems.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#1C1523]/8 p-10 text-center">
        <p className="font-display text-lg font-semibold text-[#1C1523]">
          No menu items match "{searchQuery}"
        </p>
        <p className="mt-1 text-sm text-[#665E6E]">
          Try searching for "Biscoff", "Matcha", "Peach", or switch to All Menu.
        </p>
      </div>
    );
  }

  // Group by category when viewing 'all' and no active search filter
  const categoriesToRender =
    activeCategory === 'all' && !normalizedQuery
      ? MENU_CATEGORIES.filter((c) => c.id !== 'all')
      : [
          {
            id: activeCategory,
            label:
              MENU_CATEGORIES.find((c) => c.id === activeCategory)?.label || 'Search Results',
          },
        ];

  return (
    <div className="space-y-8">
      {categoriesToRender.map((category) => {
        const groupItems =
          activeCategory === 'all' && !normalizedQuery
            ? filteredItems.filter((i) => i.category === category.id)
            : filteredItems;

        if (groupItems.length === 0) return null;

        return (
          <section key={category.id} aria-labelledby={`cat-heading-${category.id}`}>
            <div className="flex items-baseline justify-between mb-3.5 pb-2 border-b border-[#1C1523]/8">
              <h2
                id={`cat-heading-${category.id}`}
                className="font-display text-lg sm:text-xl font-bold text-[#1C1523]"
              >
                {category.label}
              </h2>
              <span className="text-xs text-[#665E6E] tabular-nums">
                {groupItems.length} {groupItems.length === 1 ? 'item' : 'items'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {groupItems.map((item) => {
                const countInCart = itemCountByMenuId[item.id] || 0;
                return (
                  <article
                    key={item.id}
                    className="group bg-white rounded-2xl border border-[#1C1523]/8 hover:border-[#5B2378]/30 hover:shadow-sm transition-all p-4 flex items-stretch justify-between gap-3.5"
                  >
                    <div
                      onClick={() => onSelectItem(item)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onSelectItem(item);
                        }
                      }}
                      className="flex-1 min-w-0 flex flex-col justify-between cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2378] rounded-lg"
                    >
                      <div>
                        <p className="text-[11px] font-medium text-[#665E6E] truncate">
                          {item.dietaryLine} · {item.calories}
                        </p>
                        <h3 className="mt-0.5 font-display text-base font-bold text-[#1C1523] group-hover:text-[#5B2378] transition-colors truncate">
                          {item.name}
                        </h3>
                        <p className="mt-1 text-xs sm:text-sm text-[#665E6E] line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      <div className="mt-3 flex items-center gap-3">
                        <span className="font-mono text-sm font-semibold text-[#1C1523] tabular-nums">
                          S${item.basePrice.toFixed(2)}
                        </span>
                        {item.isPopular && (
                          <span className="text-xs font-medium text-[#5B2378]">
                            · Popular
                          </span>
                        )}
                        {countInCart > 0 && (
                          <span className="text-xs font-semibold text-[#5B2378] tabular-nums">
                            · {countInCart} in cart
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right-aligned Qlub-style Square Photo + Quick Add Button */}
                    <div className="relative shrink-0 w-24 h-24 sm:w-28 sm:h-28">
                      <button
                        type="button"
                        onClick={() => onSelectItem(item)}
                        aria-label={`Customize ${item.name}`}
                        className="w-full h-full rounded-xl overflow-hidden bg-[#F3EFEA] block cursor-pointer"
                      >
                        <FoodImage
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-200"
                        />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickAddItem(item);
                        }}
                        aria-label={`Quick add ${item.name}`}
                        className="absolute -bottom-1.5 -right-1.5 w-10 h-10 rounded-xl bg-[#1C1523] hover:bg-[#5B2378] text-white shadow-md flex items-center justify-center transition-colors active:scale-95 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
