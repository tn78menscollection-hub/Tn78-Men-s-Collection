"use client";

import React, { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { CategoryDto } from "@/lib/api";

export interface FilterBarProps {
  categories?: CategoryDto[];
  currentCategory?: string;
  selectedCategory?: string;
  selectedSize?: string;
  selectedColor?: string;
  selectedMinPrice?: number;
  selectedMaxPrice?: number;
  onSelectCategory?: (categorySlug?: string) => void;
  onSelectSize?: (size?: string) => void;
  onSelectColor?: (color?: string) => void;
  onSelectPriceRange?: (min?: number, max?: number) => void;
  onClearAll?: () => void;
  className?: string;
}

const SIZES = ["S", "M", "L", "XL", "XXL", "28", "30", "32", "34", "36"];
const COLORS = ["Black", "Charcoal", "Navy Blue", "Olive Green", "Beige"];
const PRICE_RANGES = [
  { label: "All Prices", min: undefined, max: undefined },
  { label: "Under ₹699", min: undefined, max: 699 },
  { label: "₹699 – ₹1,199", min: 699, max: 1199 },
  { label: "Above ₹1,199", min: 1199, max: undefined },
];

export function FilterBar({
  categories = [],
  currentCategory,
  selectedCategory,
  selectedSize: controlledSize,
  selectedColor: controlledColor,
  selectedMinPrice: controlledMinPrice,
  selectedMaxPrice: controlledMaxPrice,
  onSelectCategory,
  onSelectSize,
  onSelectColor,
  onSelectPriceRange,
  onClearAll,
  className = "",
}: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isControlled = Boolean(
    onSelectCategory || onSelectSize || onSelectColor || onSelectPriceRange || onClearAll
  );

  const selectedSize = isControlled
    ? controlledSize || ""
    : searchParams.get("size") || "";
  const selectedColor = isControlled
    ? controlledColor || ""
    : searchParams.get("color") || "";
  const selectedMinPrice = isControlled
    ? controlledMinPrice !== undefined ? String(controlledMinPrice) : null
    : searchParams.get("min_price");
  const selectedMaxPrice = isControlled
    ? controlledMaxPrice !== undefined ? String(controlledMaxPrice) : null
    : searchParams.get("max_price");
  const activeCategory = isControlled
    ? selectedCategory !== undefined ? selectedCategory : (currentCategory || "")
    : currentCategory || searchParams.get("category") || "";

  const activeFilterCount = [
    selectedSize,
    selectedColor,
    selectedMinPrice || selectedMaxPrice,
  ].filter(Boolean).length;

  const updateParam = (key: string, value: string | undefined) => {
    if (isControlled) {
      if (key === "category" && onSelectCategory) {
        onSelectCategory(value);
      } else if (key === "size" && onSelectSize) {
        onSelectSize(value);
      } else if (key === "color" && onSelectColor) {
        onSelectColor(value);
      }
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const updatePriceRange = (min?: number, max?: number) => {
    if (isControlled && onSelectPriceRange) {
      onSelectPriceRange(min, max);
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    if (min !== undefined) {
      params.set("min_price", min.toString());
    } else {
      params.delete("min_price");
    }
    if (max !== undefined) {
      params.set("max_price", max.toString());
    } else {
      params.delete("max_price");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearAllFilters = () => {
    if (isControlled && onClearAll) {
      onClearAll();
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    params.delete("size");
    params.delete("color");
    params.delete("min_price");
    params.delete("max_price");
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const isCurrentPrice = (min?: number, max?: number) => {
    const pMin = selectedMinPrice ? Number(selectedMinPrice) : undefined;
    const pMax = selectedMaxPrice ? Number(selectedMaxPrice) : undefined;
    return pMin === min && pMax === max;
  };

  const filterContent = (
    <div className="space-y-8">
      {/* Category Section */}
      {!currentCategory && categories.length > 0 && (
        <div>
          <h3 className="font-heading text-xs font-black uppercase tracking-[0.2em] text-[#E2C58A] mb-3">
            CATEGORY
          </h3>
          <ul className="space-y-2">
            <li>
              <button
                type="button"
                onClick={() => updateParam("category", undefined)}
                className={`text-xs uppercase tracking-wider font-heading transition-colors cursor-pointer ${
                  !activeCategory
                    ? "text-[#E2C58A] font-black"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                All Garments
              </button>
            </li>
            {categories.map((cat) => {
              const isActive = activeCategory === cat.slug;
              return (
                <li key={cat.id}>
                  <button
                    type="button"
                    onClick={() => updateParam("category", cat.slug)}
                    className={`text-xs uppercase tracking-wider font-heading transition-colors cursor-pointer ${
                      isActive
                        ? "text-[#E2C58A] font-black"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {cat.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Size Filter */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-heading text-xs font-black uppercase tracking-[0.2em] text-[#E2C58A]">
            SIZE
          </h3>
          {selectedSize && (
            <button
              type="button"
              onClick={() => updateParam("size", undefined)}
              className="text-[10px] uppercase font-mono text-[#E2C58A] hover:underline cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
        <div className="grid grid-cols-4 gap-2">
          {SIZES.map((size) => {
            const isSelected = selectedSize.toUpperCase() === size;
            return (
              <button
                key={size}
                type="button"
                onClick={() => updateParam("size", isSelected ? undefined : size)}
                className={`py-2 text-xs font-mono font-bold border transition-all text-center rounded-xs cursor-pointer ${
                  isSelected
                    ? "border-[#E2C58A] bg-[#E2C58A] text-[#0A0B0E] font-black shadow-sm"
                    : "border-[#232733] bg-[#0A0B0E] text-slate-300 hover:border-[#E2C58A]/50"
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Color Filter */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-heading text-xs font-black uppercase tracking-[0.2em] text-[#E2C58A]">
            COLOR
          </h3>
          {selectedColor && (
            <button
              type="button"
              onClick={() => updateParam("color", undefined)}
              className="text-[10px] uppercase font-mono text-[#E2C58A] hover:underline cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((color) => {
            const isSelected = selectedColor.toLowerCase() === color.toLowerCase();
            return (
              <button
                key={color}
                type="button"
                onClick={() => updateParam("color", isSelected ? undefined : color)}
                className={`px-3 py-1.5 text-xs font-heading uppercase tracking-wider border transition-all rounded-xs cursor-pointer ${
                  isSelected
                    ? "border-[#E2C58A] bg-[#E2C58A]/20 text-[#E2C58A] ring-1 ring-[#E2C58A] font-bold"
                    : "border-[#232733] bg-[#0A0B0E] text-slate-300 hover:border-[#E2C58A]/50"
                }`}
              >
                {color}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-heading text-xs font-black uppercase tracking-[0.2em] text-[#E2C58A]">
            PRICE
          </h3>
          {(selectedMinPrice || selectedMaxPrice) && (
            <button
              type="button"
              onClick={() => updatePriceRange(undefined, undefined)}
              className="text-[10px] uppercase font-mono text-[#E2C58A] hover:underline cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
        <div className="space-y-2">
          {PRICE_RANGES.map((range) => {
            const isSelected = isCurrentPrice(range.min, range.max);
            return (
              <button
                key={range.label}
                type="button"
                onClick={() => updatePriceRange(range.min, range.max)}
                className={`w-full text-left py-1 text-xs uppercase tracking-wider font-heading transition-colors cursor-pointer ${
                  isSelected
                    ? "text-[#E2C58A] font-black"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {range.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Clear All Filters Button */}
      {activeFilterCount > 0 && (
        <div className="pt-4 border-t border-[#232733]">
          <button
            type="button"
            onClick={clearAllFilters}
            className="w-full py-2.5 bg-[#1A1D27] border border-[#3F3523] hover:border-[#E2C58A] text-[#E2C58A] hover:bg-[#E2C58A] hover:text-[#0A0B0E] transition-all font-heading text-xs font-bold uppercase tracking-wider rounded-full cursor-pointer"
          >
            CLEAR ALL FILTERS ({activeFilterCount})
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Trigger Button (< lg) */}
      <div className="lg:hidden mb-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-[#13151C] border border-[#232733] text-white font-heading text-xs font-bold uppercase tracking-wider hover:border-[#E2C58A] transition-colors rounded-xs shadow-md cursor-pointer"
        >
          <svg
            className="w-4 h-4 text-[#E2C58A]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          <span>FILTERS</span>
          {activeFilterCount > 0 && (
            <span className="bg-[#E2C58A] text-[#0A0B0E] rounded-full px-1.5 py-0.2 text-[10px] font-black">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Drawer Slide-over (< lg) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-[#0E1017] border-l border-[#232733] p-6 overflow-y-auto z-10 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#232733]">
                <h2 className="font-heading font-black text-sm uppercase tracking-wider text-white">
                  REFINE GARMENTS
                </h2>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="text-slate-400 hover:text-white p-1 cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {filterContent}
            </div>

            <div className="mt-8 pt-4 border-t border-[#232733]">
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="w-full py-3.5 bg-gradient-to-r from-[#E2C58A] to-[#C6A467] text-[#0A0B0E] font-heading text-xs font-black uppercase tracking-wider rounded-full shadow-glow-gold transition-all cursor-pointer btn-shimmer"
              >
                APPLY &amp; VIEW PRODUCTS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar (>= lg) */}
      <aside className={`hidden lg:block w-64 shrink-0 ${className}`}>
        <div className="sticky top-28 bg-[#13151C] border border-[#232733] p-6 rounded-sm shadow-card-dark">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#232733]">
            <h2 className="font-heading font-black text-xs uppercase tracking-widest text-white">
              REFINE COLLECTION
            </h2>
            {activeFilterCount > 0 && (
              <span className="text-[10px] font-mono text-[#E2C58A] font-bold">
                {activeFilterCount} ACTIVE
              </span>
            )}
          </div>
          {filterContent}
        </div>
      </aside>
    </>
  );
}
