"use client";

import React, { useState } from "react";
import { OFFERS } from "@/lib/mockHomepageData";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { useToast } from "@/components/ui/Toast";

export function OffersSection() {
  return (
    <section className="bg-[#FAF8F5] py-8 sm:py-12 md:py-16 border-b border-neutral-200 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <AnimateOnScroll animation="fadeUp" className="text-center mb-6 sm:mb-8 md:mb-12">
          <span className="font-heading text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#DC2626]">
            PROMOTIONAL BENEFITS
          </span>
          <h2 className="font-heading font-black text-xl sm:text-2xl md:text-3xl lg:text-4xl text-[#111827] tracking-tight mt-0.5">
            Exclusive Offers &amp; <span className="text-gradient-fire">Savings</span>
          </h2>
          <p className="text-[11px] sm:text-xs text-neutral-500 mt-0.5 font-medium">
            Special promotions, complimentary delivery, and ensemble vouchers.
          </p>
        </AnimateOnScroll>

        {/* MOBILE: Horizontal scroll */}
        <div className="sm:hidden">
          <div className="flex overflow-x-auto no-scrollbar gap-3 pb-2 -mx-4 px-4 snap-x snap-mandatory">
            {OFFERS.map((offer, idx) => (
              <div key={offer.id} className="w-[280px] flex-shrink-0 snap-start">
                <OfferCard offer={offer} delay={idx * 100} />
              </div>
            ))}
          </div>
        </div>

        {/* DESKTOP: Grid */}
        <div className="hidden sm:grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {OFFERS.map((offer, idx) => (
            <AnimateOnScroll key={offer.id} animation="fadeUp" delay={idx * 100}>
              <OfferCard offer={offer} delay={0} />
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

function OfferCard({ offer, delay }: { offer: typeof OFFERS[0]; delay: number }) {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(offer.code);
      setCopied(true);
      setConfettiActive(true);
      showToast(`Coupon "${offer.code}" copied to clipboard!`, "success");
      setTimeout(() => setCopied(false), 2000);
      setTimeout(() => setConfettiActive(false), 800);
    } catch {
      showToast("Could not copy code", "error");
    }
  };

  return (
    <div className="animated-border-gradient rounded-xl h-full">
      <div className="bg-white p-5 sm:p-6 flex flex-col justify-between relative group transition-all duration-300 shadow-xs hover:shadow-lg rounded-xl h-full">
        {/* Confetti burst on copy */}
        {confettiActive && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl z-30">
            {[...Array(12)].map((_, i) => (
              <span
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${Math.random() * 6 + 3}px`,
                  height: `${Math.random() * 6 + 3}px`,
                  backgroundColor: ["#DC2626", "#F59E0B", "#16A34A", "#E2C58A", "#3B82F6"][i % 5],
                  left: `${40 + Math.random() * 20}%`,
                  bottom: "40%",
                  animation: `confettiFall ${0.6 + Math.random() * 0.4}s ease-out forwards`,
                  animationDelay: `${i * 30}ms`,
                  transform: `translateX(${(Math.random() - 0.5) * 80}px)`,
                }}
              />
            ))}
          </div>
        )}

        <div>
          <span
            className="text-2xl sm:text-3xl font-heading font-black text-[#DC2626] tracking-tight block"
            style={{ animationDelay: `${delay}ms` }}
          >
            {offer.discount}
          </span>

          <h3 className="font-heading font-bold text-[13px] sm:text-sm uppercase tracking-wide text-neutral-900 mt-2 sm:mt-3 group-hover:text-[#DC2626] transition-colors">
            {offer.title}
          </h3>

          <p className="text-[11px] sm:text-xs text-neutral-500 font-normal mt-1.5 leading-relaxed">
            {offer.description}
          </p>
        </div>

        <div className="mt-4 sm:mt-5 pt-3 border-t border-neutral-100 flex items-center justify-between">
          <span className="text-[9px] sm:text-[10px] font-heading font-bold uppercase tracking-widest text-neutral-400">
            COUPON CODE
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className={`flex items-center gap-1.5 border px-2.5 py-1 font-mono text-[11px] sm:text-xs uppercase font-bold tracking-wider rounded-md transition-all duration-300 cursor-pointer tap-feedback ${
              copied
                ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                : "bg-neutral-100 border-neutral-300 text-neutral-900 hover:border-[#DC2626] hover:bg-red-50 hover:text-[#DC2626]"
            }`}
          >
            {copied ? (
              <>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                COPIED!
              </>
            ) : (
              <>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                {offer.code}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
