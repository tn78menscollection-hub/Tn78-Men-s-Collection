"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/ui/ProductCard";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { MockProduct } from "@/lib/mockHomepageData";

export interface ProductRailProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  products: MockProduct[];
  viewAllHref?: string;
  className?: string;
}

export function ProductRail({
  eyebrow,
  title,
  subtitle = "Designed to keep you stylish",
  products,
  viewAllHref = "/shop?sort=newest",
  className = "",
}: ProductRailProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -280 : 280;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className={`bg-[#FAF8F5] py-8 sm:py-12 md:py-16 border-b border-neutral-200 px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <AnimateOnScroll animation="fadeUp" className="flex items-end justify-between mb-4 sm:mb-6 md:mb-8">
          <div>
            {eyebrow && (
              <span className="text-[9px] sm:text-[10px] font-heading font-bold tracking-[0.2em] text-[#DC2626] uppercase block mb-0.5">
                {eyebrow}
              </span>
            )}
            <h2 className="font-heading font-black text-xl sm:text-2xl lg:text-4xl text-[#111827] tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-[11px] sm:text-xs text-neutral-500 mt-0.5 font-medium">
                {subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={viewAllHref}
              className="text-[11px] sm:text-xs font-heading font-bold uppercase tracking-wider text-[#DC2626] hover:text-red-700 transition-colors tap-feedback"
            >
              VIEW ALL &rarr;
            </Link>

            {/* Desktop scroll arrows */}
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => scroll("left")}
                className="w-8 h-8 rounded-full border border-neutral-300 hover:border-black flex items-center justify-center transition-all hover:scale-105 tap-feedback bg-white"
                aria-label="Scroll left"
              >
                <svg className="w-4 h-4 text-neutral-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                className="w-8 h-8 rounded-full border border-neutral-300 hover:border-black flex items-center justify-center transition-all hover:scale-105 tap-feedback bg-white"
                aria-label="Scroll right"
              >
                <svg className="w-4 h-4 text-neutral-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </AnimateOnScroll>

        {/* Horizontal Carousel Track */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto no-scrollbar gap-3 sm:gap-4 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth snap-x snap-mandatory"
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="w-[165px] sm:w-[220px] md:w-[240px] flex-shrink-0 snap-start"
            >
              <ProductCard
                id={product.id}
                name={product.name}
                price={product.price}
                mrp={product.mrp}
                category={product.category}
                isNew={product.isNew}
                slug={product.slug}
                imageUrl={product.imageUrl}
                sizes={product.sizes}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
