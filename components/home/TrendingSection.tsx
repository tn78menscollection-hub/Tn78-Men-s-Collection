import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ProductCard } from "@/components/ui/ProductCard";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";

const TRENDING_ITEMS = [
  {
    id: "trend-1",
    name: "PURE LINEN SHIRT",
    slug: "pure-linen-shirt",
    price: 1499,
    mrp: 2499,
    imageUrl: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=700&q=80",
    category: "SHIRTS",
    sizes: ["S", "M", "L", "XL", "XXL"],
    isNew: true,
  },
  {
    id: "trend-2",
    name: "COTTON CHINOS PANT",
    slug: "cotton-chinos-pant",
    price: 1199,
    mrp: 1799,
    imageUrl: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=700&q=80",
    category: "PANTS",
    sizes: ["28", "30", "32", "34", "36"],
    isNew: true,
  },
  {
    id: "trend-3",
    name: "FOUR-WAY LYCRA FORMAL PANT",
    slug: "four-way-lycra-formal-pant",
    price: 1099,
    mrp: 1699,
    imageUrl: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=700&q=80",
    category: "PANTS",
    sizes: ["28", "30", "32", "34", "36"],
    isNew: false,
  },
];

export function TrendingSection() {
  return (
    <section className="bg-[#FAF8F5] py-8 sm:py-12 md:py-16 border-b border-neutral-200 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Mesh gradient */}
      <div className="absolute inset-0 bg-mesh-gradient opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <AnimateOnScroll animation="fadeUp" className="flex items-end justify-between mb-4 sm:mb-6 md:mb-8">
          <div>
            <span className="font-heading text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#DC2626]">
              HIGH-DEMAND SILHOUETTES
            </span>
            <h2 className="font-heading font-black text-xl sm:text-2xl md:text-3xl lg:text-4xl text-[#111827] tracking-tight mt-0.5">
              Trending <span className="text-[#DC2626]">Collections</span>
            </h2>
            <p className="text-[11px] sm:text-xs text-neutral-500 mt-0.5 font-medium">
              Pieces commanding attention through premium proportion and material resonance.
            </p>
          </div>

          <Link
            href="/shop"
            className="font-heading text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#DC2626] hover:text-red-700 transition-colors tap-feedback flex items-center gap-1 group"
          >
            VIEW ALL
            <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </AnimateOnScroll>

        {/* MOBILE: Horizontal scroll for trending cards */}
        <div className="sm:hidden">
          <div className="flex overflow-x-auto no-scrollbar gap-3 pb-2 -mx-4 px-4 snap-x snap-mandatory">
            {TRENDING_ITEMS.map((item) => (
              <div key={item.id} className="w-[165px] flex-shrink-0 snap-start">
                <ProductCard
                  id={item.id}
                  name={item.name}
                  price={item.price}
                  mrp={item.mrp}
                  imageUrl={item.imageUrl}
                  category={item.category}
                  sizes={item.sizes}
                  slug={item.slug}
                  isNew={item.isNew}
                />
              </div>
            ))}
          </div>
        </div>

        {/* DESKTOP/TABLET: Grid layout */}
        <div className="hidden sm:grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
          {/* Seasonal Spotlight Card (Left / 5 cols on lg) */}
          <AnimateOnScroll animation="slideLeft" className="lg:col-span-5">
            <div className="bg-white border border-neutral-200/90 p-4 sm:p-5 flex flex-col rounded-xl shadow-xs hover:border-neutral-400 transition-all duration-300 card-3d">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-heading font-black uppercase tracking-[0.16em] bg-[#DC2626] text-white px-2.5 py-1 rounded-xs shadow-xs animate-scaleIn">
                    SEASONAL SPOTLIGHT
                  </span>
                  <span className="text-[11px] font-heading font-bold text-neutral-500 uppercase tracking-wider">
                    SHIRTS
                  </span>
                </div>

                <div className="relative aspect-[16/11] w-full bg-neutral-100 overflow-hidden border border-neutral-200 mb-3 rounded-lg group">
                  <Image
                    src="https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=800&q=80"
                    alt="Spotlight Oversized Baggy Shirt"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  {/* Quick view overlay */}
                  <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                    <span className="px-4 py-1.5 bg-white/90 text-[10px] font-heading font-black uppercase tracking-wider text-neutral-900 rounded-full shadow-md">
                      VIEW PIECE →
                    </span>
                  </div>
                </div>

                <h3 className="font-heading font-black text-base sm:text-lg text-[#111827] leading-snug">
                  The Signature Oversized Baggy Shirt
                </h3>
                <p className="mt-1 text-[11px] sm:text-xs text-neutral-600 leading-relaxed">
                  Trendsetting dropped-shoulder baggy silhouette in heavy drape fabric. Available for live store trials in Udumalpet.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-200 flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <div className="text-base sm:text-lg font-heading font-black text-[#DC2626]">
                    ₹1,199
                  </div>
                  <div className="text-[11px] text-neutral-400 line-through">
                    ₹1,899
                  </div>
                  <span className="text-[9px] font-heading font-bold text-[#1B663E] bg-emerald-50 px-1.5 py-0.5 rounded-xs flex items-center gap-0.5">
                    <svg className="w-2 h-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                    37% OFF
                  </span>
                </div>
                <Link
                  href="/product/oversized-baggy-shirt"
                  className="px-4 py-2 bg-neutral-900 hover:bg-black text-white font-heading text-[11px] font-bold uppercase tracking-wider rounded-md shadow-xs hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 tap-feedback btn-shimmer"
                >
                  VIEW PIECE
                </Link>
              </div>
            </div>
          </AnimateOnScroll>

          {/* 3-Card Grid (Right / 7 cols on lg) */}
          <div className="lg:col-span-7 grid grid-cols-3 gap-3 md:gap-4 items-start">
            {TRENDING_ITEMS.map((item, idx) => (
              <AnimateOnScroll key={item.id} animation="fadeUp" delay={idx * 100}>
                <ProductCard
                  id={item.id}
                  name={item.name}
                  price={item.price}
                  mrp={item.mrp}
                  imageUrl={item.imageUrl}
                  category={item.category}
                  sizes={item.sizes}
                  slug={item.slug}
                  isNew={item.isNew}
                />
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
