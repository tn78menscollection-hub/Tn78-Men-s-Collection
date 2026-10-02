"use client";

import React from "react";

export const PLACEHOLDER_CATEGORIES = [
  "ALL",
  "SHIRTS",
  "PANTS",
  "T-SHIRTS",
  "LOWERS",
  "SHORTS",
  "CO-ORDS",
] as const;

export interface CategoryTabsProps {
  categories?: readonly string[];
  activeCategory?: string;
  onSelectCategory?: (category: string) => void;
  className?: string;
}

export function CategoryTabs({
  categories = PLACEHOLDER_CATEGORIES,
  activeCategory = "ALL",
  onSelectCategory,
  className = "",
}: CategoryTabsProps) {
  return (
    <div
      className={`flex items-center justify-start md:justify-center overflow-x-auto scrollbar-none py-2 gap-6 md:gap-8 border-b border-[#EAE4DC] ${className}`}
    >
      {categories.map((category) => {
        const isActive = activeCategory === category;
        return (
          <button
            key={category}
            onClick={() => onSelectCategory?.(category)}
            className={`pb-3 font-heading text-xs md:text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-colors duration-200 border-b-2 -mb-[1px] ${
              isActive
                ? "border-[#9E6544] text-[#9E6544]"
                : "border-transparent text-[#78716A] hover:text-[#1A1816]"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
