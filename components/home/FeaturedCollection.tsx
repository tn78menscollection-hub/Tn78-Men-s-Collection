import React from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";

export function FeaturedCollection() {
  return (
    <section className="bg-[#FAF8F5] py-10 sm:py-14 md:py-20 border-b border-neutral-200 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient mesh */}
      <div className="absolute inset-0 bg-mesh-gradient opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">

          {/* Editorial Visual Showcase (Left / 6 cols on lg) */}
          <AnimateOnScroll animation="slideLeft" className="lg:col-span-6">
            <div className="relative aspect-[4/5] w-full bg-neutral-100 overflow-hidden border border-neutral-200 shadow-xl group rounded-2xl">
              <Image
                src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80"
                alt="TN78 Editorial Lookbook"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-500" />

              {/* Quick-view overlay */}
              <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-400 flex items-center justify-center">
                <span className="px-5 py-2 bg-white/90 text-[11px] font-heading font-black uppercase tracking-wider text-neutral-900 rounded-full shadow-md transform scale-90 group-hover:scale-100 transition-transform duration-300">
                  VIEW LOOKBOOK →
                </span>
              </div>

              <div className="absolute top-4 left-4 bg-black px-3 py-1 font-heading text-[10px] font-black uppercase tracking-[0.2em] text-white rounded-xs shadow-xs">
                ATELIER EDITORIAL
              </div>

              {/* Pulsing border */}
              <div className="absolute -inset-1 rounded-2xl border-2 border-neutral-300/20 animate-pulseRing pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </AnimateOnScroll>

          {/* Editorial Narrative & CTA (Right / 6 cols on lg) */}
          <div className="lg:col-span-6 flex flex-col items-start space-y-4">
            <AnimateOnScroll animation="fadeUp">
              <span className="text-[#DC2626] font-heading text-xs font-bold uppercase tracking-[0.2em]">
                LIMITED CAPSULE
              </span>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fadeUp" delay={100}>
              <h2 className="text-[#111827] font-heading font-black text-2xl sm:text-3xl lg:text-5xl tracking-tight leading-[1.08]">
                The Pure Linen & <span className="text-[#DC2626]">Co-Ord Edit</span>
              </h2>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fadeUp" delay={200}>
              <p className="text-sm text-neutral-600 font-medium">
                A study in contemporary drape, European-grade flax, and architectural ease.
              </p>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fadeUp" delay={250}>
              <p className="text-xs sm:text-sm text-neutral-500 font-normal leading-relaxed">
                Rooted in intentional proportion, our capsule explores pure linen drapes, breathable cotton waffle, and modern relaxed silhouettes engineered for all-day comfort and commanding aesthetic presence.
              </p>
            </AnimateOnScroll>

            {/* Editorial highlights list */}
            <AnimateOnScroll animation="fadeUp" delay={300} className="w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4 border-t border-neutral-200 w-full">
                {[
                  "100% Breathable Linen & Cotton",
                  "Tailored Comfort Relaxed Cut",
                  "Signature Pearl Fasteners",
                  "Pre-Washed Zero Shrinkage",
                ].map((item, idx) => (
                  <div key={item} className="flex items-start space-x-2.5 group/item">
                    <span className="w-2 h-2 rounded-full bg-[#DC2626] mt-1 shrink-0 group-hover/item:scale-125 transition-transform" />
                    <span className="text-xs font-heading font-bold text-neutral-800 uppercase tracking-wider group-hover/item:text-[#DC2626] transition-colors">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fadeUp" delay={400} className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center px-8 py-3.5 bg-black hover:bg-neutral-800 text-white font-heading text-xs font-bold uppercase tracking-wider rounded-lg shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all btn-shimmer ripple-effect"
              >
                <span>SHOP THE COLLECTION</span>
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </AnimateOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}
