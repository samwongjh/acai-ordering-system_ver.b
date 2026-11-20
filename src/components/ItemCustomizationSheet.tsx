import { useEffect, useState } from 'react';
import { Check, Minus, Plus, X } from 'lucide-react';
import type { CartItem, MenuItem, SelectedModifier } from '../types.ts';
import { FoodImage } from './FoodImage.tsx';

interface ItemCustomizationSheetProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (cartItem: CartItem) => void;
}

export function ItemCustomizationSheet({
  item,
  onClose,
  onAddToCart,
}: ItemCustomizationSheetProps) {
  const [selectedByGroup, setSelectedByGroup] = useState<Record<string, string[]>>({});
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!item) return;
    const defaults: Record<string, string[]> = {};
    for (const group of item.modifierGroups) {
      if (group.required) {
        const def = group.options.find((o) => o.isDefault) || group.options[0];
        if (def) defaults[group.id] = [def.id];
      } else {
        defaults[group.id] = [];
      }
    }
    setSelectedByGroup(defaults);
    setSpecialInstructions('');
    setQuantity(1);
  }, [item]);

  if (!item) return null;

  const handleToggleOption = (groupId: string, optionId: string, maxSelect: number, required: boolean) => {
    setSelectedByGroup((prev) => {
      const current = prev[groupId] || [];
      if (maxSelect === 1) {
        if (current.includes(optionId) && !required) {
          return { ...prev, [groupId]: [] };
        }
        return { ...prev, [groupId]: [optionId] };
      }
      if (current.includes(optionId)) {
        return { ...prev, [groupId]: current.filter((id) => id !== optionId) };
      }
      if (current.length >= maxSelect) {
        return { ...prev, [groupId]: [...current.slice(1), optionId] };
      }
      return { ...prev, [groupId]: [...current, optionId] };
    });
  };

  const selectedModifiers: SelectedModifier[] = [];
  let modifiersTotal = 0;
  for (const group of item.modifierGroups) {
    const chosenIds = selectedByGroup[group.id] || [];
    for (const optId of chosenIds) {
      const opt = group.options.find((o) => o.id === optId);
      if (opt) {
        selectedModifiers.push({
          groupId: group.id,
          groupTitle: group.title,
          optionId: opt.id,
          optionName: opt.name,
          priceDelta: opt.priceDelta,
        });
        modifiersTotal += opt.priceDelta;
      }
    }
  }

  const unitTotal = item.basePrice + modifiersTotal;
  const lineTotal = Number((unitTotal * quantity).toFixed(2));

  const handleConfirm = () => {
    onAddToCart({
      cartItemId: `${item.id}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      menuItemId: item.id,
      name: item.name,
      image: item.image,
      unitBasePrice: item.basePrice,
      selectedModifiers,
      specialInstructions: specialInstructions.trim(),
      quantity,
      lineTotal,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`Customize ${item.name}`}
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile grab handle */}
        <div className="sm:hidden pt-2.5 pb-1 flex justify-center bg-white">
          <div className="w-10 h-1.5 rounded-full bg-[#1C1523]/15" />
        </div>

        {/* Top Image + Close */}
        <div className="relative h-48 sm:h-52 bg-[#F3EFEA] shrink-0">
          <FoodImage src={item.image} alt={item.name} className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close customization"
            className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/95 text-[#1C1523] shadow-md flex items-center justify-center hover:bg-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modifiers */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          <div>
            <p className="text-xs font-medium text-[#665E6E]">
              {item.dietaryLine} · {item.calories} · Prep ~{item.prepMinutes} mins
            </p>
            <div className="mt-1 flex items-baseline justify-between gap-4">
              <h2 className="font-display text-xl font-bold text-[#1C1523]">{item.name}</h2>
              <span className="font-mono text-base font-semibold text-[#1C1523] tabular-nums shrink-0">
                S${item.basePrice.toFixed(2)}
              </span>
            </div>
            <p className="mt-2 text-sm text-[#665E6E] leading-relaxed">{item.description}</p>
            {item.allergens && item.allergens.length > 0 && (
              <p className="mt-2 text-xs text-[#665E6E]">
                Allergens: {item.allergens.join(', ')}
              </p>
            )}
          </div>

          {item.modifierGroups.map((group) => {
            const chosen = selectedByGroup[group.id] || [];
            return (
              <div key={group.id} className="pt-4 border-t border-[#1C1523]/8">
                <div className="flex items-baseline justify-between mb-3">
                  <h3 className="font-display text-sm font-bold text-[#1C1523]">
                    {group.title}
                  </h3>
                  <span className="text-xs font-medium text-[#665E6E]">
                    {group.required ? 'Required · Choose 1' : `Optional · Up to ${group.maxSelect}`}
                  </span>
                </div>

                <div className="space-y-2">
                  {group.options.map((option) => {
                    const isSelected = chosen.includes(option.id);
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() =>
                          handleToggleOption(group.id, option.id, group.maxSelect, group.required)
                        }
                        className={`w-full min-h-[46px] px-3.5 py-2.5 rounded-xl border text-left flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                          isSelected
                            ? 'border-[#5B2378] bg-[#5B2378]/5'
                            : 'border-[#1C1523]/10 hover:border-[#1C1523]/25 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span
                            className={`w-5 h-5 shrink-0 flex items-center justify-center border transition-colors ${
                              group.maxSelect === 1 ? 'rounded-full' : 'rounded-md'
                            } ${
                              isSelected
                                ? 'bg-[#5B2378] border-[#5B2378] text-white'
                                : 'border-[#1C1523]/25 bg-white'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5" />}
                          </span>
                          <span className="text-sm font-medium text-[#1C1523] truncate">
                            {option.name}
                          </span>
                        </div>

                        <span className="font-mono text-xs font-medium text-[#665E6E] tabular-nums shrink-0">
                          {option.priceDelta > 0 ? `+S$${option.priceDelta.toFixed(2)}` : 'Included'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          <div className="pt-4 border-t border-[#1C1523]/8">
            <label
              htmlFor="item-notes"
              className="block font-display text-sm font-bold text-[#1C1523] mb-2"
            >
              Special Kitchen Note
            </label>
            <textarea
              id="item-notes"
              rows={2}
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Drizzle on the side, no banana, extra crunchy granola..."
              className="w-full rounded-xl border border-[#1C1523]/12 px-3.5 py-2.5 text-sm text-[#1C1523] placeholder:text-[#665E6E]/60 focus:outline-none focus:border-[#5B2378] focus:ring-2 focus:ring-[#5B2378]/15"
            />
          </div>
        </div>

        {/* Sticky Bottom Quantity & Add CTA */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#1C1523]/10 flex items-center gap-3 shrink-0">
          <div className="flex items-center border border-[#1C1523]/12 rounded-xl bg-[#FAF9F7] h-12">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
              className="w-11 h-full flex items-center justify-center text-[#1C1523] hover:bg-[#EAE3DA]/60 rounded-l-xl cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-mono text-sm font-semibold tabular-nums">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(20, q + 1))}
              aria-label="Increase quantity"
              className="w-11 h-full flex items-center justify-center text-[#1C1523] hover:bg-[#EAE3DA]/60 rounded-r-xl cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 h-12 rounded-xl bg-[#1C1523] hover:bg-[#5B2378] text-white font-semibold text-sm flex items-center justify-between px-4 transition-colors active:scale-[0.99] cursor-pointer"
          >
            <span>Add to Cart</span>
            <span className="font-mono tabular-nums">S${lineTotal.toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
