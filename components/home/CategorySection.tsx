"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";

import {
  getMediaAssets,
  MEDIA_UPDATE_EVENT,
  DEFAULT_CATEGORY_CARDS,
  CategoryCardAsset,
} from "@/lib/mediaAssets";

const FILTER_TABS = [
  { id: "all", label: "All Categories", icon: "●" },
  { id: "topwear", label: "Top Wear", icon: "👕" },
  { id: "bottomwear", label: "Bottom Wear", icon: "👖" },
];

export function CategorySection() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [categories, setCategories] = useState<CategoryCardAsset[]>(DEFAULT_CATEGORY_CARDS);

  React.useEffect(() => {
    // Initial client hydration
    const current = getMediaAssets();
    if (current.categoryCards && current.categoryCards.length > 0) {
      setCategories(current.categoryCards);
    }

    // Live update listener when admin edits images
    const handleMediaChange = () => {
      const updated = getMediaAssets();
      if (updated.categoryCards && updated.categoryCards.length > 0) {
        setCategories(updated.categoryCards);
      }
    };

    window.addEventListener(MEDIA_UPDATE_EVENT, handleMediaChange);
    return () => window.removeEventListener(MEDIA_UPDATE_EVENT, handleMediaChange);
  }, []);

  const filteredCategories =
    activeTab === "all"
      ? categories
      : categories.filter((cat) => cat.type === activeTab);

  return (
    <section className="bg-[#FAF8F5] py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 border-b border-neutral-200 relative overflow-hidden">
      {/* Subtle mesh gradient background */}
      <div className="absolute inset-0 bg-mesh-gradient opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <AnimateOnScroll animation="fadeUp" className="flex items-end justify-between mb-4 sm:mb-6">
          <div>
            <h2 className="font-heading font-black text-xl sm:text-2xl md:text-3xl lg:text-4xl text-[#111827] tracking-tight">
              Shop by <span className="text-[#DC2626]">Category</span>
            </h2>
            <p className="text-[11px] sm:text-xs text-neutral-500 mt-0.5 sm:mt-1 font-medium">
              13 categories · New styles added daily
            </p>
          </div>

          <Link
            href="/shop"
            className="text-[11px] sm:text-xs font-bold text-[#DC2626] hover:text-red-700 flex items-center gap-1 uppercase tracking-wider transition-colors tap-feedback group"
          >
            ALL
            <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </AnimateOnScroll>

        {/* Filter Pills — horizontal scroll on mobile with animated active indicator */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-3 mb-4 sm:mb-6">
          {FILTER_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold whitespace-nowrap transition-all duration-300 cursor-pointer tap-feedback relative overflow-hidden ${
                  isActive
                    ? "bg-black text-white shadow-md scale-105"
                    : "bg-white text-neutral-800 border border-neutral-300 hover:border-black hover:shadow-sm"
                }`}
              >
                {/* Active pill shimmer */}
                {isActive && (
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                )}
                <span className={isActive ? "text-[#DC2626] text-xs" : "text-sm"}>
                  {tab.icon}
                </span>
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Category Cards Grid — 2 columns mobile, 5 columns desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3.5 md:gap-4">
          {filteredCategories.map((cat, idx) => (
            <AnimateOnScroll
              key={cat.id}
              animation="fadeUp"
              delay={idx * 60}
            >
              <Link
                href={cat.slug}
                className="group relative aspect-[4/5] rounded-xl sm:rounded-2xl overflow-hidden bg-neutral-100 shadow-xs card-3d block"
              >
                {/* Image with hover scale and fallback */}
                <Image
                  src={cat.imageUrl}
                  alt={cat.name}
                  fill
                  unoptimized
                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=700&q=80";
                  }}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-cover object-top group-hover:scale-110 transition-transform duration-700 ease-out"
                />

                {/* Animated gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent group-hover:from-black/90 group-hover:via-black/40 transition-all duration-500" />

                {/* Sweeping gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#DC2626]/0 via-[#DC2626]/10 to-[#DC2626]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Product count badge */}
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-heading font-bold text-neutral-700 shadow-xs opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-1 group-hover:translate-y-0">
                  {cat.count} items
                </div>

                {/* Bottom Text */}
                <div className="absolute bottom-2.5 sm:bottom-3.5 left-2.5 sm:left-4 right-2.5 text-left">
                  <h3 className="font-heading font-black text-[13px] sm:text-sm md:text-base text-white drop-shadow-sm leading-tight group-hover:text-[#F59E0B] transition-colors duration-300">
                    {cat.name}
                  </h3>
                  <span className="text-[9px] sm:text-[10px] font-bold text-white/80 tracking-wider uppercase mt-0.5 flex items-center gap-1 group-hover:gap-2 transition-all duration-300">
                    SHOP
                    <svg className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
