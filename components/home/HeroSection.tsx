"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

interface SlideData {
  tag: string;
  titlePrimary: string;
  titleSecondary: string;
  description: string;
  mainImage: string;
  secondaryImage: string;
  badgeText: string;
  priceNote: string;
  href: string;
  accentColor: string;
}

const HERO_SLIDES: SlideData[] = [
  {
    tag: "AUTUMN / WINTER 2026 DROP",
    titlePrimary: "ARCHITECTURAL",
    titleSecondary: "SILHOUETTES & DRAPES",
    description: "Engineered with dense slub linen, dropped shoulder drape, and relaxed proportions for modern presence.",
    mainImage: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=1000&q=80",
    secondaryImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=700&q=80",
    badgeText: "STRUCTURED CO-ORD SET",
    priceNote: "₹2,499 • 100% PURE LINEN",
    href: "/shop?sort=newest",
    accentColor: "#DC2626",
  },
  {
    tag: "HIGH-DEMAND RESORT CAPSULE",
    titlePrimary: "MONOCHROME",
    titleSecondary: "RESORT SHIRTS & PLEATS",
    description: "Unstructured Cuban collars and fluid tactile trousers crafted for Mediterranean sun and rooftop distinction.",
    mainImage: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80",
    secondaryImage: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=700&q=80",
    badgeText: "RESORT WEAR ARCHIVE",
    priceNote: "₹2,299 • TEXTURED COTTON",
    href: "/category/shirts",
    accentColor: "#D97706",
  },
  {
    tag: "HEAVYWEIGHT ESSENTIALS",
    titlePrimary: "OVERSIZED",
    titleSecondary: "WAFFLE KNITS & LOWERS",
    description: "320 GSM dense waffle polo knits and minimalist drawstring lowers designed for heavyweight comfort.",
    mainImage: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80",
    secondaryImage: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=700&q=80",
    badgeText: "WAFFLE POLO EDIT",
    priceNote: "₹1,999 • 320 GSM HEAVYWEIGHT",
    href: "/category/t-shirts",
    accentColor: "#16A34A",
  },
];

import {
  getMediaAssets,
  MEDIA_UPDATE_EVENT,
  DEFAULT_HERO_SLIDES,
  HeroSlideAsset,
} from "@/lib/mediaAssets";

export function HeroSection() {
  const [slides, setSlides] = useState<HeroSlideAsset[]>(DEFAULT_HERO_SLIDES);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [textVisible, setTextVisible] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const current = getMediaAssets();
    if (current.heroSlides && current.heroSlides.length > 0) {
      setSlides(current.heroSlides);
    }
    const handleMediaChange = () => {
      const updated = getMediaAssets();
      if (updated.heroSlides && updated.heroSlides.length > 0) {
        setSlides(updated.heroSlides);
      }
    };
    window.addEventListener(MEDIA_UPDATE_EVENT, handleMediaChange);
    return () => window.removeEventListener(MEDIA_UPDATE_EVENT, handleMediaChange);
  }, []);

  const goToSlide = useCallback((idx: number) => {
    if (transitioning) return;
    setTransitioning(true);
    setTextVisible(false);

    setTimeout(() => {
      setCurrentSlide(idx);
      setTimeout(() => {
        setTextVisible(true);
        setTransitioning(false);
      }, 100);
    }, 300);
  }, [transitioning]);

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % slides.length);
  }, [currentSlide, goToSlide, slides.length]);

  const prevSlide = useCallback(() => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length);
  }, [currentSlide, goToSlide, slides.length]);

  // Auto-advance slides
  useEffect(() => {
    if (isPaused) return;
    intervalRef.current = setInterval(nextSlide, 5500);
    return () => clearInterval(intervalRef.current);
  }, [isPaused, nextSlide]);

  // Touch swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
    setTouchStartX(null);
  };

  const slide = slides[currentSlide] || slides[0] || DEFAULT_HERO_SLIDES[0];

  return (
    <section
      ref={sectionRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full overflow-hidden bg-gradient-to-b from-white via-[#FAF8F5] to-[#FAF8F5] border-b border-neutral-200 select-none"
    >
      {/* Animated Mesh Background */}
      <div className="absolute inset-0 bg-mesh-gradient opacity-60 pointer-events-none" />

      {/* Floating ambient glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[700px] h-[400px] sm:h-[500px] rounded-full blur-3xl pointer-events-none transition-colors duration-1000"
        style={{
          background: `radial-gradient(circle, ${slide.accentColor}15, transparent 70%)`,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 md:py-14 lg:py-16 relative z-10">

        {/* MOBILE: Image first, then text (< lg) */}
        <div className="flex flex-col lg:hidden items-center gap-5">

          {/* Mobile Hero Image with Ken Burns */}
          <div className="relative w-full max-w-[280px] mx-auto">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-neutral-200 shadow-lg bg-white">
              {slides.map((s, idx) => (
                <Image
                  key={idx}
                  src={s.mainImage}
                  alt={s.titlePrimary}
                  fill
                  unoptimized
                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=1000&q=80";
                  }}
                  priority={idx === 0}
                  sizes="280px"
                  className={`object-cover object-top transition-all duration-700 ease-out ${
                    currentSlide === idx
                      ? "opacity-100 animate-ken-burns"
                      : "opacity-0 scale-100"
                  }`}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />

              {/* In-Frame Pill Detail */}
              <div
                className={`absolute bottom-2.5 left-2.5 right-2.5 p-2.5 glass-card-dark rounded-xl transition-all duration-500 ${
                  textVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                }`}
              >
                <span className="text-[8px] font-heading font-bold text-[#F59E0B] uppercase tracking-wider block">
                  {slide.badgeText}
                </span>
                <span className="text-[10px] font-heading font-black text-white uppercase tracking-wide block mt-0.5">
                  {slide.priceNote}
                </span>
              </div>
            </div>

            {/* Pulsing glow ring around card */}
            <div
              className="absolute -inset-1 rounded-2xl animate-pulseRing pointer-events-none"
              style={{
                border: `1.5px solid ${slide.accentColor}30`,
              }}
            />
          </div>

          {/* Mobile Text Content */}
          <div className="text-center space-y-3">
            {/* Tag */}
            <div
              className={`flex items-center justify-center gap-2 flex-wrap transition-all duration-500 ${
                textVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "100ms" }}
            >
              <span className="inline-flex items-center space-x-1.5 bg-neutral-100 border border-neutral-300 text-neutral-800 px-2.5 py-1 rounded-full text-[9px] font-heading font-bold tracking-[0.14em] uppercase">
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ backgroundColor: slide.accentColor }}
                />
                <span>{slide.tag}</span>
              </span>
            </div>

            {/* Headline — text reveal */}
            <h1
              className={`font-heading font-black text-[28px] xs:text-3xl tracking-tight uppercase leading-[0.95] text-[#111827] transition-all duration-600 ${
                textVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6 blur-sm"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              <span style={{ color: slide.accentColor }} className="block">
                {slide.titlePrimary}
              </span>
              <span className="text-[#111827] block mt-0.5">
                {slide.titleSecondary}
              </span>
            </h1>

            {/* Description */}
            <p
              className={`text-neutral-500 text-[11px] xs:text-xs font-normal max-w-xs mx-auto leading-relaxed transition-all duration-500 ${
                textVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "300ms" }}
            >
              {slide.description}
            </p>

            {/* Action Buttons */}
            <div
              className={`flex flex-col xs:flex-row items-center justify-center gap-2.5 pt-1 transition-all duration-500 ${
                textVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "400ms" }}
            >
              <Link
                href={slide.href}
                className="w-full xs:w-auto inline-flex items-center justify-center px-6 py-2.5 bg-black hover:bg-neutral-800 text-white font-heading font-bold text-[11px] tracking-[0.14em] uppercase rounded-lg shadow-md active:scale-95 transition-all duration-200 ripple-effect"
              >
                <span>EXPLORE COLLECTION</span>
                <svg className="w-3.5 h-3.5 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>

              <Link
                href="/style-your-fit"
                className="w-full xs:w-auto inline-flex items-center justify-center px-5 py-2.5 bg-white hover:bg-neutral-50 text-neutral-900 font-heading font-bold text-[11px] tracking-[0.12em] uppercase rounded-lg border border-neutral-300 hover:border-black shadow-xs transition-all duration-200 tap-feedback"
              >
                STYLE YOUR FIT
              </Link>
            </div>

            {/* Slide Progress Indicators */}
            <div className="flex items-center justify-center space-x-3 pt-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  className="py-1.5 focus:outline-none cursor-pointer"
                  aria-label={`Go to slide ${idx + 1}`}
                >
                  <div
                    className={`h-1.5 rounded-full overflow-hidden transition-all duration-300 ${
                      currentSlide === idx ? "w-10 bg-neutral-300" : "w-5 bg-neutral-200"
                    }`}
                  >
                    <div
                      className={`h-full rounded-full transition-all ${
                        currentSlide === idx
                          ? "animate-slideIndicator origin-left"
                          : "w-0"
                      }`}
                      style={{
                        backgroundColor: currentSlide === idx ? slide.accentColor : "transparent",
                      }}
                    />
                  </div>
                </button>
              ))}
            </div>

            {/* Swipe hint */}
            <p className="text-[9px] text-neutral-400 font-heading font-medium tracking-wider uppercase animate-pulse">
              ← SWIPE TO EXPLORE →
            </p>
          </div>
        </div>

        {/* DESKTOP: Side-by-side (>= lg) */}
        <div className="hidden lg:grid grid-cols-12 gap-8 items-center">

          {/* Left: Editorial Typography & Actions (7 cols) */}
          <div className="col-span-7 flex flex-col items-start text-left space-y-5">

            {/* Top Tag & Trust Pill */}
            <div
              className={`flex flex-wrap items-center gap-2 transition-all duration-500 ${
                textVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"
              }`}
            >
              <span className="inline-flex items-center space-x-1.5 bg-neutral-100 border border-neutral-300 text-neutral-800 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-[0.16em] uppercase shadow-xs">
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ backgroundColor: slide.accentColor }}
                />
                <span>{slide.tag}</span>
              </span>

              <div className="inline-flex items-center space-x-1.5 bg-white border border-neutral-200 px-3 py-1 rounded-full text-[10px] font-heading font-semibold text-neutral-600 shadow-xs">
                <span>✦ 4.9★ (2,400+ Gents Styled)</span>
              </div>
            </div>

            {/* Main Headline */}
            <div className="space-y-1">
              <h1
                className={`font-heading font-black text-5xl lg:text-6xl tracking-tight uppercase leading-[0.98] text-[#111827] transition-all duration-700 ${
                  textVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8 blur-sm"
                }`}
                style={{ transitionDelay: "150ms" }}
              >
                <span
                  className="block transition-colors duration-500"
                  style={{ color: slide.accentColor }}
                >
                  {slide.titlePrimary}
                </span>
                <span className="text-[#111827] block mt-1">{slide.titleSecondary}</span>
              </h1>
            </div>

            {/* Description */}
            <p
              className={`text-neutral-600 text-sm md:text-base font-normal max-w-xl leading-relaxed transition-all duration-500 ${
                textVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "300ms" }}
            >
              {slide.description}
            </p>

            {/* Action Buttons */}
            <div
              className={`flex flex-wrap items-center gap-3 pt-1 transition-all duration-500 ${
                textVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "400ms" }}
            >
              <Link
                href={slide.href}
                className="inline-flex items-center justify-center px-9 py-3.5 bg-black hover:bg-neutral-800 text-white font-heading font-bold text-sm tracking-[0.15em] uppercase rounded-lg shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer btn-shimmer ripple-effect"
              >
                <span>EXPLORE COLLECTION</span>
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>

              <Link
                href="/style-your-fit"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-white hover:bg-neutral-50 text-neutral-900 font-heading font-bold text-sm tracking-[0.14em] uppercase rounded-lg border border-neutral-300 hover:border-black shadow-xs transition-all duration-200"
              >
                STYLE YOUR FIT
              </Link>
            </div>

            {/* Slide Progress Indicators */}
            <div className="flex items-center space-x-3 pt-4">
              {slides.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  className="group py-2 focus:outline-none cursor-pointer"
                  aria-label={`Go to slide ${idx + 1}`}
                >
                  <div className="h-1.5 rounded-full overflow-hidden bg-neutral-200 transition-all duration-300 w-14">
                    <div
                      className={`h-full rounded-full transition-all ${
                        currentSlide === idx
                          ? "animate-slideIndicator origin-left"
                          : "w-0 group-hover:w-1/3 bg-neutral-400"
                      }`}
                      style={{
                        backgroundColor: currentSlide === idx ? s.accentColor : undefined,
                      }}
                    />
                  </div>
                </button>
              ))}

              <span className="text-[10px] font-mono text-neutral-400 pl-2">
                0{currentSlide + 1} / 0{HERO_SLIDES.length}
              </span>
            </div>
          </div>

          {/* Right: Dual Editorial Showcase Cards (5 cols) */}
          <div className="col-span-5 relative flex items-center justify-end">

            {/* Primary Large Studio Frame */}
            <div
              className={`relative w-72 md:w-80 aspect-[3/4] overflow-hidden rounded-2xl border border-neutral-200 shadow-xl bg-white group transition-all duration-700 ${
                textVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
            >
              {slides.map((s, idx) => (
                <Image
                  key={idx}
                  src={s.mainImage}
                  alt={s.titlePrimary}
                  fill
                  unoptimized
                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=1000&q=80";
                  }}
                  priority={idx === 0}
                  sizes="340px"
                  className={`object-cover object-top filter contrast-[1.05] group-hover:scale-105 transition-all duration-700 ease-out ${
                    currentSlide === idx ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70" />

              {/* Glassmorphism quick-view overlay */}
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-400 flex items-center justify-center">
                <span className="px-5 py-2 bg-white/90 text-[11px] font-heading font-black uppercase tracking-wider text-neutral-900 rounded-full shadow-md transform scale-90 group-hover:scale-100 transition-transform duration-300">
                  VIEW COLLECTION →
                </span>
              </div>

              {/* In-Frame Pill Detail */}
              <div className="absolute bottom-3 left-3 right-3 p-3 glass-card-dark rounded-xl">
                <span className="text-[9px] font-mono font-bold text-[#E2C58A] uppercase tracking-wider block">
                  {slide.badgeText}
                </span>
                <span className="text-[11px] font-heading font-black text-white uppercase tracking-wide block mt-0.5">
                  {slide.priceNote}
                </span>
              </div>
            </div>

            {/* Secondary Floating Offset Frame */}
            <div
              className={`absolute -bottom-6 -left-10 w-40 aspect-[3/4] overflow-hidden rounded-2xl border border-white/15 shadow-2xl bg-[#181B24] z-20 animate-float transition-all duration-700 ${
                textVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              {slides.map((s, idx) => (
                <Image
                  key={idx}
                  src={s.secondaryImage}
                  alt="Detail perspective"
                  fill
                  unoptimized
                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=700&q=80";
                  }}
                  sizes="160px"
                  className={`object-cover object-top filter contrast-[1.03] transition-opacity duration-700 ${
                    currentSlide === idx ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute top-2 left-2 bg-[#E2C58A] text-[#0A0B0E] font-heading font-black text-[8px] px-1.5 py-0.5 rounded-2xs uppercase">
                DETAIL
              </div>
            </div>

            {/* Pulsing glow ring */}
            <div
              className="absolute -inset-2 rounded-3xl animate-pulseRing pointer-events-none opacity-30"
              style={{ border: `2px solid ${slide.accentColor}` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
