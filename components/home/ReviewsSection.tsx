"use client";

import React, { useState, useEffect, useRef } from "react";
import { REVIEWS } from "@/lib/mockHomepageData";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";

export function ReviewsSection() {
  const [currentReview, setCurrentReview] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on mobile every 4s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % REVIEWS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Scroll to active review on mobile
  useEffect(() => {
    if (scrollRef.current) {
      const card = scrollRef.current.children[currentReview] as HTMLElement;
      if (card) {
        scrollRef.current.scrollTo({
          left: card.offsetLeft - 16,
          behavior: "smooth",
        });
      }
    }
  }, [currentReview]);

  return (
    <section className="bg-[#0E1017] py-12 sm:py-16 md:py-24 border-b border-[#232733] px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/3 w-[400px] h-[300px] bg-[#E2C58A]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[200px] bg-[#DC2626]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <AnimateOnScroll animation="fadeUp" className="text-center mb-8 sm:mb-12 md:mb-16">
          <span className="font-heading text-xs font-bold uppercase tracking-[0.25em] text-gradient-gold inline-block">
            VERIFIED EXPERIENCES
          </span>
          <h2 className="font-heading font-black text-2xl sm:text-3xl md:text-4xl text-white tracking-tight mt-1">
            Client <span className="text-gradient-gold">Testimonials</span>
          </h2>
          <p className="font-serif italic text-xs sm:text-sm text-slate-400 mt-1">
            Thoughts from patrons who have experienced TN78 craftsmanship firsthand.
          </p>
        </AnimateOnScroll>

        {/* MOBILE: Auto-scrolling horizontal carousel */}
        <div className="md:hidden">
          <div
            ref={scrollRef}
            className="flex overflow-x-auto no-scrollbar gap-3 pb-2 -mx-4 px-4 snap-x snap-mandatory scroll-smooth"
          >
            {REVIEWS.map((review, idx) => (
              <div key={review.id} className="w-[85vw] max-w-[320px] flex-shrink-0 snap-center">
                <ReviewCard review={review} index={idx} />
              </div>
            ))}
          </div>

          {/* Dot indicators */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {REVIEWS.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentReview(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  currentReview === idx
                    ? "bg-[#E2C58A] w-6"
                    : "bg-[#2A2D35] hover:bg-[#3A3D45]"
                }`}
                aria-label={`Go to review ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* DESKTOP: Grid */}
        <div className="hidden md:grid grid-cols-3 gap-6 md:gap-8">
          {REVIEWS.map((review, idx) => (
            <AnimateOnScroll key={review.id} animation="fadeUp" delay={idx * 150}>
              <ReviewCard review={review} index={idx} />
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

function ReviewCard({
  review,
  index,
}: {
  review: typeof REVIEWS[0];
  index: number;
}) {
  const initials = review.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const gradients = [
    "from-[#DC2626] to-[#F59E0B]",
    "from-[#E2C58A] to-[#D97706]",
    "from-[#16A34A] to-[#3B82F6]",
  ];

  return (
    <div className="glass-card-dark p-5 sm:p-7 flex flex-col justify-between rounded-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-glow-gold h-full group">
      <div>
        {/* Stars with fill animation */}
        <div className="flex items-center space-x-1 mb-4">
          <div className="flex items-center space-x-0.5 overflow-hidden stars-fill-animate">
            {[...Array(review.rating)].map((_, i) => (
              <svg
                key={i}
                className="w-4 h-4 text-[#E2C58A] fill-current drop-shadow-xs"
                viewBox="0 0 20 20"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-[10px] font-heading font-black uppercase tracking-wider text-[#E2C58A] ml-2">
            5.0
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-200 font-serif italic leading-relaxed group-hover:text-white transition-colors">
          &ldquo;{review.quote}&rdquo;
        </p>
      </div>

      <div className="mt-5 pt-4 border-t border-[#232733] flex items-center gap-3">
        {/* Avatar with gradient */}
        <div
          className={`w-9 h-9 rounded-full bg-gradient-to-br ${gradients[index % gradients.length]} flex items-center justify-center text-[10px] font-heading font-black text-white shadow-md`}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="font-heading font-bold text-xs uppercase tracking-wider text-white">
              {review.name}
            </span>
            <span className="text-[10px] text-slate-400 font-body">
              {review.location}
            </span>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#E2C58A] mt-0.5 block">
            Verified Order &bull; {review.product}
          </span>
        </div>
      </div>
    </div>
  );
}
