import React from "react";
import Image from "next/image";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";

const INSTA_POSTS = [
  { id: "ig-1", img: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=500&q=80", label: "LOOK 01 // TEXTURED LINEN" },
  { id: "ig-2", img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=500&q=80", label: "LOOK 02 // RELAXED TROUSER" },
  { id: "ig-3", img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=500&q=80", label: "LOOK 03 // MOCHA WAFFLE" },
  { id: "ig-4", img: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=500&q=80", label: "LOOK 04 // BLUSH CO-ORD" },
  { id: "ig-5", img: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=500&q=80", label: "LOOK 05 // TAILORED CUT" },
  { id: "ig-6", img: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=500&q=80", label: "LOOK 06 // TAILORED DRAPE" },
];

const INSTAGRAM_PROFILE_URL = "https://www.instagram.com/tn_78_mens_collection";

export function InstagramSection() {
  return (
    <section className="bg-[#0A0B0E] py-12 sm:py-16 md:py-24 border-b border-[#232733] px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient effects */}
      <div className="absolute top-1/4 right-0 w-[300px] h-[300px] bg-[#E2C58A]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[250px] h-[250px] bg-[#DC2626]/3 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
        <AnimateOnScroll animation="fadeUp" className="mb-8 sm:mb-10">
          <span className="font-heading text-xs font-bold uppercase tracking-[0.25em] text-gradient-gold inline-block">
            COMMUNITY &amp; JOURNAL
          </span>
          <h2 className="font-heading font-black text-2xl sm:text-3xl md:text-4xl text-white tracking-tight mt-1">
            Follow <span className="text-gradient-gold">@tn_78_mens_collection</span>
          </h2>
          <p className="font-serif italic text-xs sm:text-sm text-slate-400 mt-1">
            Glimpses into our seasonal drops, daily menswear curations, and signature styling.
          </p>
        </AnimateOnScroll>

        {/* MOBILE: Horizontal carousel */}
        <div className="sm:hidden w-full mb-6">
          <div className="flex overflow-x-auto no-scrollbar gap-3 pb-2 -mx-4 px-4 snap-x snap-mandatory">
            {INSTA_POSTS.map((post, idx) => (
              <div key={post.id} className="w-[200px] flex-shrink-0 snap-start">
                <InstaCard post={post} index={idx} />
              </div>
            ))}
          </div>
        </div>

        {/* DESKTOP: 6 Photo Grid with staggered animation */}
        <div className="hidden sm:grid grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 w-full mb-10">
          {INSTA_POSTS.map((post, idx) => (
            <AnimateOnScroll key={post.id} animation="scaleIn" delay={idx * 80}>
              <InstaCard post={post} index={idx} />
            </AnimateOnScroll>
          ))}
        </div>

        <AnimateOnScroll animation="fadeUp" delay={400}>
          <a
            href={INSTAGRAM_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3.5 border border-[#E2C58A]/50 text-[#E2C58A] hover:bg-[#E2C58A] hover:text-[#0A0B0E] font-heading text-xs font-black uppercase tracking-widest rounded-full transition-all duration-300 hover:shadow-glow-gold-lg hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2 btn-shimmer"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.13-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689-.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.79-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            <span>FOLLOW ON INSTAGRAM</span>
            <span>&rarr;</span>
          </a>
        </AnimateOnScroll>
      </div>
    </section>
  );
}

function InstaCard({ post, index }: { post: typeof INSTA_POSTS[0]; index: number }) {
  return (
    <a
      href={INSTAGRAM_PROFILE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative aspect-square bg-[#13151C] border border-[#232733] hover:border-[#E2C58A]/60 transition-all duration-300 overflow-hidden rounded-lg shadow-card-dark block"
    >
      <Image
        src={post.img}
        alt={post.label}
        fill
        sizes="(max-width: 640px) 200px, (max-width: 1024px) 33vw, 16vw"
        className="object-cover object-top filter contrast-[1.04] group-hover:scale-110 transition-transform duration-700 ease-out"
      />

      {/* Hover overlay with blur-to-sharp reveal */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-400 flex flex-col items-center justify-center p-3 text-center backdrop-blur-sm">
        <svg className="w-6 h-6 text-[#E2C58A] mb-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.13-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z" />
        </svg>
        <span className="text-[10px] font-heading font-black text-[#E2C58A] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0" style={{ transitionDelay: "50ms" }}>
          {post.label}
        </span>
      </div>
    </a>
  );
}
