import React from "react";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Collections — TN78 Men's Collection",
  description:
    "Explore curated seasonal capsule collections by TN78. Modern linen, architectural silhouettes, and breathable textures.",
};

const COLLECTIONS = [
  {
    title: "The Pure Linen Capsule",
    season: "FW26 // EDITORIAL",
    description:
      "Crafted from premium 100% natural flax linen. Relaxed drop-shoulder silhouettes designed to drape with effortless distinction in warm climates.",
    href: "/category/shirts",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
    cta: "Explore Linen Shirts",
  },
  {
    title: "Architectural Pleated Trousers",
    season: "VOLUME 02 // TAILORED",
    description:
      "Engineered double pleats with high-rise drape and refined tapered cuffs. Bridging formal bespoke presence with modern comfort.",
    href: "/category/pants",
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80",
    cta: "Explore Trousers",
  },
  {
    title: "Monochrome Co-Ord Sets",
    season: "ENSEMBLE // SIGNATURE",
    description:
      "Effortless two-piece harmonies combining textured overshirts with matching bottoms. Designed for seamless day-to-evening dressing.",
    href: "/category/co-ord-sets",
    image: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=800&q=80",
    cta: "Explore Co-Ords",
  },
  {
    title: "Everyday Luxury Lowers",
    season: "CASUAL // RELAXED",
    description:
      "Structured waffle cotton and relaxed drawstring bottoms designed for understated loungewear and off-duty elegance.",
    href: "/category/lowers",
    image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=800&q=80",
    cta: "Explore Lowers",
  },
];

export default function CollectionsPage() {
  return (
    <div className="min-h-screen bg-[#0A0B0E] text-[#F8FAFC] pb-28">
      {/* Header - Compact */}
      <section className="border-b border-[#232733] bg-[#13151C]/80 backdrop-blur-md py-6 sm:py-8 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-2">
          <span className="text-xs font-heading font-extrabold tracking-[0.25em] uppercase text-[#E2C58A]">
            TN78 Curated Editions
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl uppercase tracking-wider text-[#F8FAFC]">
            Seasonal Collections
          </h1>
          <p className="max-w-xl mx-auto text-xs sm:text-sm text-[#94A3B8] leading-relaxed font-body">
            Distinctive aesthetics organized into thoughtful wardrobe chapters. Every collection represents our devotion to tactile fabrics and architectural drape.
          </p>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {COLLECTIONS.map((c) => (
            <div
              key={c.title}
              className="bg-[#13151C] border border-[#232733] hover:border-[#E2C58A]/50 rounded-xl overflow-hidden group hover:shadow-[0_0_30px_rgba(226,197,138,0.1)] transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-4/3 bg-[#0A0B0E] overflow-hidden">
                <Image
                  src={c.image}
                  alt={c.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-90 contrast-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#13151C] via-transparent to-transparent opacity-80" />
                <div className="absolute top-4 left-4 z-10">
                  <span className="text-[10px] font-heading font-extrabold tracking-widest uppercase bg-[#0A0B0E]/85 backdrop-blur-md text-[#E2C58A] px-3 py-1 border border-[#232733] rounded">
                    {c.season}
                  </span>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h2 className="font-serif text-2xl uppercase tracking-wider text-[#F8FAFC] group-hover:text-[#E2C58A] transition-colors">
                    {c.title}
                  </h2>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    {c.description}
                  </p>
                </div>
                <div className="pt-4">
                  <Link
                    href={c.href}
                    className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#E2C58A] font-bold border-b border-[#E2C58A]/50 pb-1 hover:border-[#E2C58A] hover:text-[#F8FAFC] transition-colors"
                  >
                    <span>{c.cta}</span>
                    <span>&rarr;</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
