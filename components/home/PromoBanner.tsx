import React from "react";
import Link from "next/link";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";

export function PromoBanner() {
  return (
    <section className="bg-[#FAF8F5] py-6 sm:py-10 md:py-14 border-b border-neutral-200 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <AnimateOnScroll animation="fadeUp">
          <div className="relative text-white border border-neutral-800 p-5 sm:p-8 lg:p-12 rounded-xl sm:rounded-2xl overflow-hidden shadow-xl">
            {/* Animated mesh gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-black to-neutral-900" />
            <div className="absolute inset-0 bg-mesh-gradient opacity-20" />

            {/* Animated Ambient Glow */}
            <div className="absolute top-0 right-0 w-60 sm:w-80 h-60 sm:h-80 bg-[#DC2626]/10 rounded-full blur-3xl pointer-events-none animate-pulseGlow" />
            <div className="absolute bottom-0 left-0 w-40 sm:w-60 h-40 sm:h-60 bg-[#F59E0B]/8 rounded-full blur-3xl pointer-events-none animate-float" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#E2C58A]/5 rounded-full blur-3xl pointer-events-none animate-pulseRing" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
              <div className="flex flex-col space-y-2 max-w-2xl">
                <span className="font-heading text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#F59E0B] animate-fadeInUp" style={{ animationDelay: "100ms" }}>
                  PAN-INDIA EXPRESS LOGISTICS
                </span>

                <h2 className="font-heading font-black text-xl sm:text-2xl lg:text-4xl text-white tracking-tight leading-tight">
                  Experience Modern Indian <span className="text-gradient-gold">Streetwear</span>
                </h2>

                <p className="text-[11px] sm:text-sm text-neutral-300 font-normal leading-relaxed">
                  Enjoy complimentary priority express delivery across India on all purchases over{" "}
                  <strong className="text-black not-italic font-mono font-bold bg-[#F59E0B] px-1.5 py-0.5 rounded-xs animate-pulseGlow inline-block">
                    ₹2,000
                  </strong>
                  . Fast 24-hour dispatch, 100% secure prepaid online checkout, and doorstep size exchanges.
                </p>
              </div>

              <div className="flex items-center shrink-0">
                <Link
                  href="/shop"
                  className="w-full sm:w-auto text-center px-6 sm:px-8 py-3 bg-white hover:bg-neutral-100 text-black font-heading text-[11px] sm:text-xs font-bold uppercase tracking-wider rounded-lg shadow-md hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer btn-shimmer tap-feedback"
                >
                  EXPLORE EDIT &rarr;
                </Link>
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
