import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { OutfitBuilder } from "@/components/shop/OutfitBuilder";

export const metadata: Metadata = {
  title: "Style Your Fit • Interactive Outfit Builder — TN78 Men's Wear",
  description:
    "Curate your complete menswear ensemble with TN78's interactive Outfit Builder. Pair tailored overshirts, linen tops, and architectural trousers with an exclusive 10% bundle discount.",
  openGraph: {
    title: "Style Your Fit — TN78 Ensemble Builder",
    description: "Pair upper and lower silhouettes with complimentary styling and 10% bundle privilege.",
  },
};

export default function StyleYourFitPage() {
  return (
    <div className="min-h-screen bg-[#0A0B0E] text-[#F8FAFC]">
      {/* Editorial Hero Header */}
      <section className="bg-[#13151C] border-b border-[#232733] pt-12 pb-10 sm:pt-16 sm:pb-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#0A0B0E] border border-[#232733] rounded-full text-xs font-heading font-extrabold uppercase tracking-[0.2em] text-[#E2C58A] mb-4">
            <span className="w-2 h-2 rounded-full bg-[#E2C58A] shadow-[0_0_8px_rgba(226,197,138,0.7)]" />
            TN78 CURATION &bull; 10% BUNDLE PRIVILEGE
          </div>

          <h1 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-[#F8FAFC] tracking-wide uppercase max-w-3xl mx-auto">
            Style Your Fit: The Architectural Ensemble
          </h1>

          <p className="font-body text-sm sm:text-base text-[#94A3B8] mt-3 max-w-2xl mx-auto">
            Select your upper silhouette and pairing trouser to create a complete two-piece luxury look. Enjoy an automatic 10% bundle discount applied to your bag with complimentary express dispatch.
          </p>

          {/* Quick value highlights */}
          <div className="flex items-center justify-center flex-wrap gap-4 sm:gap-8 mt-6 pt-4 border-t border-[#232733] text-[11px] sm:text-xs font-mono text-[#94A3B8] uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <span className="text-[#E2C58A]">✦</span> Balanced Proportions
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-[#E2C58A]">✦</span> Harmonious Fabrics
            </span>
            <span className="flex items-center gap-1.5 text-[#E2C58A] font-semibold">
              <span>✦</span> Flat 10% Off (Code: ENSEMBLE10)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-[#E2C58A]">✦</span> Free BlueDart Express
            </span>
          </div>
        </div>
      </section>

      {/* Main Interactive Studio Canvas */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <OutfitBuilder />
      </main>

      {/* Styling Notes Editorial Section */}
      <section className="bg-[#13151C] border-t border-[#232733] py-14 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-heading font-bold uppercase tracking-[0.2em] text-[#E2C58A]">
              DESIGN PHILOSOPHY
            </span>
            <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#F8FAFC] mt-1 uppercase tracking-wide">
              Principles of Menswear Layering
            </h3>
            <p className="font-body text-xs sm:text-sm text-[#94A3B8] mt-1">
              Guidelines curated by our master tailoring team in Tamil Nadu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Principle 1 */}
            <div className="bg-[#0A0B0E] p-6 border border-[#232733] rounded-xs space-y-2.5">
              <span className="font-mono text-xs text-[#E2C58A] font-bold block">
                PRINCIPLE 01
              </span>
              <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-[#F8FAFC]">
                The Proportional Rule
              </h4>
              <p className="text-xs text-[#94A3B8] leading-relaxed font-body">
                Pair relaxed, structured overshirts with tapered pleated trousers. The contrast between loose upper structure and tapered ankle cut creates clean geometric definition without bulk.
              </p>
            </div>

            {/* Principle 2 */}
            <div className="bg-[#0A0B0E] p-6 border border-[#232733] rounded-xs space-y-2.5">
              <span className="font-mono text-xs text-[#E2C58A] font-bold block">
                PRINCIPLE 02
              </span>
              <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-[#F8FAFC]">
                Tactile Fabric Contrast
              </h4>
              <p className="text-xs text-[#94A3B8] leading-relaxed font-body">
                Balance organic French slub linen with smooth double-faced twill or tropical wool. The juxtaposition of natural woven slub and sharp pressed crease elevates the ensemble into quiet luxury.
              </p>
            </div>

            {/* Principle 3 */}
            <div className="bg-[#0A0B0E] p-6 border border-[#232733] rounded-xs space-y-2.5">
              <span className="font-mono text-xs text-[#E2C58A] font-bold block">
                PRINCIPLE 03
              </span>
              <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-[#F8FAFC]">
                Monochrome Subtlety
              </h4>
              <p className="text-xs text-[#94A3B8] leading-relaxed font-body">
                Keep the color scheme within 2 analogous tonal families (such as Obsidian Black + Deep Charcoal, or French Linen + Earthen Taupe) for seamless visual flow and timeless presence.
              </p>
            </div>
          </div>

          {/* Concierge Assistance Banner */}
          <div className="mt-10 p-6 bg-[#0A0B0E] border border-[#232733] rounded-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-lg">
            <div className="space-y-1">
              <span className="font-heading font-bold text-xs uppercase tracking-wider text-[#F8FAFC]">
                NEED BESPOKE SIZING OR STYLING ADVICE?
              </span>
              <p className="text-xs text-[#94A3B8] font-body">
                Our resident master stylists are available via WhatsApp Concierge for personalized sizing consultations.
              </p>
            </div>
            <Link
              href="/support"
              className="px-6 py-2.5 bg-gradient-to-r from-[#E2C58A] to-[#C6A467] hover:brightness-110 text-[#0A0B0E] font-heading text-xs font-black uppercase tracking-wider rounded-full transition-all flex-shrink-0 shadow-[0_0_15px_rgba(226,197,138,0.25)]"
            >
              TALK TO CONCIERGE &rarr;
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
