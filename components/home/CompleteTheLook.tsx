import React from "react";
import Link from "next/link";
import { ProductCard } from "@/components/ui/ProductCard";
import { COMPLETE_THE_LOOK } from "@/lib/mockHomepageData";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";

const LOOK_ITEMS = [
  {
    id: "ctl-1",
    name: "PURE LINEN SHIRT",
    slug: "pure-linen-shirt",
    price: 1499,
    mrp: 2499,
    imageUrl: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=700&q=80",
    category: "SHIRTS",
    role: "THE SHIRT",
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: "ctl-2",
    name: "COTTON CHINOS PANT",
    slug: "cotton-chinos-pant",
    price: 1199,
    mrp: 1799,
    imageUrl: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=700&q=80",
    category: "PANTS",
    role: "THE TROUSER",
    sizes: ["28", "30", "32", "34", "36"],
  },
  {
    id: "ctl-3",
    name: "CLASSIC COTTON SHIRT",
    slug: "classic-cotton-shirt",
    price: 899,
    mrp: 1499,
    imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=700&q=80",
    category: "SHIRTS",
    role: "THE ACCENT",
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
];

export function CompleteTheLook() {
  const { outfitTitle, outfitDescription, bundlePrice } = COMPLETE_THE_LOOK;

  return (
    <section className="bg-[#FAF8F5] py-8 sm:py-12 md:py-16 border-b border-neutral-200 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-mesh-gradient opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <AnimateOnScroll animation="fadeUp" className="text-center mb-6 sm:mb-8 md:mb-12">
          <span className="font-heading text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#DC2626]">
            STYLE CURATION
          </span>
          <h2 className="font-heading font-black text-xl sm:text-2xl md:text-3xl lg:text-4xl text-[#111827] tracking-tight mt-0.5">
            Complete The <span className="text-[#DC2626]">Look</span>
          </h2>
          <p className="text-[11px] sm:text-xs text-neutral-500 mt-0.5 max-w-xl mx-auto font-medium">
            {outfitDescription}
          </p>
          <div className="mt-2 sm:mt-3 inline-block px-3 sm:px-4 py-1 sm:py-1.5 bg-white border border-neutral-300 rounded-full text-[10px] sm:text-xs font-heading font-bold uppercase tracking-wider text-neutral-800 shadow-xs animate-scaleIn">
            ENSEMBLE: {outfitTitle}
          </div>
        </AnimateOnScroll>

        {/* MOBILE: Horizontal scroll */}
        <div className="sm:hidden mb-6">
          <div className="flex overflow-x-auto no-scrollbar gap-3 pb-2 -mx-4 px-4 snap-x snap-mandatory">
            {LOOK_ITEMS.map((item, index) => (
              <div key={item.id} className="w-[170px] flex-shrink-0 snap-start">
                <div className="flex items-center justify-between mb-1.5 px-0.5">
                  <span className="font-heading font-black text-[9px] uppercase tracking-wider text-[#DC2626]">
                    0{index + 1} • {item.role}
                  </span>
                </div>
                <ProductCard
                  id={item.id}
                  name={item.name}
                  price={item.price}
                  mrp={item.mrp}
                  imageUrl={item.imageUrl}
                  category={item.category}
                  sizes={item.sizes}
                  slug={item.slug}
                />
              </div>
            ))}
          </div>
        </div>

        {/* DESKTOP/TABLET: Grid */}
        <div className="hidden sm:grid grid-cols-3 gap-4 md:gap-5 mb-8 items-start">
          {LOOK_ITEMS.map((item, index) => (
            <AnimateOnScroll key={item.id} animation="fadeUp" delay={index * 120}>
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-2 px-1">
                  <span className="font-heading font-black text-[11px] uppercase tracking-wider text-[#DC2626] flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#DC2626] text-white text-[9px] font-black flex items-center justify-center">
                      {index + 1}
                    </span>
                    {item.role}
                  </span>
                  <span className="text-[10px] font-heading font-semibold text-neutral-400">
                    {item.category}
                  </span>
                </div>
                <ProductCard
                  id={item.id}
                  name={item.name}
                  price={item.price}
                  mrp={item.mrp}
                  imageUrl={item.imageUrl}
                  category={item.category}
                  sizes={item.sizes}
                  slug={item.slug}
                />
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        {/* Ensemble Summary Bar */}
        <AnimateOnScroll animation="fadeUp" delay={300}>
          <div className="bg-white border border-neutral-200 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-5 rounded-xl shadow-xs hover:shadow-md transition-shadow duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4 text-center sm:text-left">
              <span className="font-heading font-bold text-[11px] sm:text-xs uppercase tracking-wider text-neutral-500">
                TOTAL 3-PIECE ENSEMBLE:
              </span>
              <span className="font-heading font-black text-lg sm:text-xl text-[#DC2626]">
                ₹{bundlePrice.toLocaleString("en-IN")}
              </span>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Free Express Delivery Included
              </span>
            </div>

            <Link
              href="/style-your-fit"
              className="w-full sm:w-auto text-center px-5 py-2.5 bg-neutral-900 hover:bg-black text-white font-heading text-[11px] sm:text-xs font-bold uppercase tracking-wider rounded-md shadow-xs hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 tap-feedback btn-shimmer ripple-effect"
            >
              STYLE YOUR FIT &bull; TRY IN STORE &rarr;
            </Link>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
