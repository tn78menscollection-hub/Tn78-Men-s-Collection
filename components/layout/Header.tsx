"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCartWishlist } from "@/lib/cartWishlistContext";
import { AnnouncementBar } from "./AnnouncementBar";

export const NAV_LINKS = [
  { name: "ALL PRODUCTS", href: "/shop" },
  { name: "SHIRTS", href: "/category/shirts" },
  { name: "PANTS", href: "/category/pants" },
  { name: "T-SHIRTS", href: "/category/t-shirts" },
  { name: "LOWERS", href: "/category/lowers" },
  { name: "SHORTS", href: "/category/shorts" },
  { name: "STYLE YOUR FIT", href: "/style-your-fit", badge: "10% OFF" },
  { name: "OFFERS", href: "/offers" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { wishlistCount } = useCartWishlist();
  const [scrolled, setScrolled] = useState(false);

  // Detect scroll for shrink effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <header
      className={`sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b transition-all duration-300 ${
        scrolled
          ? "shadow-md border-neutral-200"
          : "shadow-xs border-neutral-200/60"
      }`}
    >
      {/* Top Announcement Bar */}
      <AnnouncementBar />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div
          className={`flex items-center justify-between transition-all duration-300 ${
            scrolled ? "h-12 sm:h-14 md:h-16" : "h-14 sm:h-16 md:h-20"
          }`}
        >
          
          {/* Mobile Left Controls (< lg): Hamburger + Search Icon */}
          <div className="flex items-center space-x-0.5 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -ml-1.5 text-neutral-800 hover:text-black focus:outline-none transition-colors tap-feedback"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>

            <Link
              href="/search"
              className="p-2 text-neutral-800 hover:text-black transition-colors tap-feedback"
              aria-label="Search store"
            >
              <svg className="w-4.5 h-4.5 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
          </div>

          {/* Top-Left Brand Logo: TN78 Logo Image + Text */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center space-x-2 sm:space-x-2.5 group">
              <div
                className={`relative rounded-lg overflow-hidden border-2 border-[#E5A93B] shadow-xs group-hover:scale-105 group-hover:shadow-glow-gold transition-all duration-300 ${
                  scrolled ? "w-7 h-7 sm:w-9 sm:h-9" : "w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11"
                }`}
              >
                <Image
                  src="/tn78-logo.jpg"
                  alt="TN78 Men's Wear Logo"
                  fill
                  sizes="(max-width: 768px) 40px, 44px"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="flex flex-col text-left">
                <span
                  className={`font-heading font-black tracking-[0.18em] text-[#111827] leading-none group-hover:text-[#DC2626] transition-colors ${
                    scrolled ? "text-lg sm:text-xl" : "text-xl sm:text-2xl"
                  }`}
                >
                  TN78
                </span>
                <span
                  className={`font-heading font-extrabold tracking-[0.26em] text-[#D97706] uppercase mt-0.5 ${
                    scrolled ? "text-[7px] sm:text-[8px]" : "text-[8px] sm:text-[9.5px]"
                  }`}
                >
                  MEN&apos;S WEAR
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation (>= lg) */}
          <nav className="hidden lg:flex items-center space-x-5 xl:space-x-7">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-[11px] xl:text-xs font-heading font-bold uppercase tracking-[0.15em] transition-all duration-200 whitespace-nowrap py-1 relative flex items-center gap-1.5 group ${
                    isActive
                      ? "text-[#DC2626]"
                      : "text-neutral-700 hover:text-black"
                  }`}
                >
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="text-[9px] font-mono font-bold bg-[#DC2626] text-white px-1.5 py-0.5 rounded-full leading-none tracking-normal shadow-xs animate-pulseGlow">
                      {link.badge}
                    </span>
                  )}
                  {/* Animated gradient underline */}
                  <span
                    className={`absolute bottom-0 left-0 h-[2px] rounded-full transition-all duration-300 ${
                      isActive
                        ? "w-full bg-gradient-to-r from-[#DC2626] to-[#F59E0B]"
                        : "w-0 group-hover:w-full bg-[#DC2626]"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Action Icons (Search, Wishlist, Store Location) */}
          <div className="flex items-center space-x-1.5 sm:space-x-3">
            {/* Desktop Search */}
            <Link
              href="/search"
              className="p-1.5 text-neutral-700 hover:text-black hover:scale-110 transition-all duration-200 hidden lg:flex items-center justify-center"
              aria-label="Search collection"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="p-1.5 text-neutral-800 hover:text-black hover:scale-110 transition-all duration-200 relative flex items-center justify-center tap-feedback"
              aria-label="Wishlist"
              title="Saved Lookbook / Store Trial List"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#DC2626] text-white text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center font-heading shadow-xs animate-scaleInBounce">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Prominent Live Store CTA Button */}
            <a
              href="https://www.google.com/maps/place/TN+78+MEN'S+COLLECTION/@10.5843488,77.2493999,17z/data=!3m1!4b1!4m6!3m5!1s0x3ba9cda855f1d9ed:0xb7290e20cff0dc05!8m2!3d10.5843488!4d77.2493999!16s%2Fg%2F11yk3h9xr8!18m1!1e1"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-3 py-1.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded-md text-[9px] sm:text-[11px] font-heading font-bold uppercase tracking-wider transition-all duration-200 shadow-xs hover:shadow-glow-red tap-feedback btn-shimmer"
              aria-label="View live store on Google Maps"
              title="View live store on Google Maps"
            >
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="hidden xs:inline">LIVE STORE</span>
              <span className="xs:hidden">📍</span>
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer (< lg) — Slide-in animation */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop with blur */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Drawer Panel — slides in from left */}
          <div className="relative w-[82%] max-w-[320px] bg-white flex flex-col h-full z-10 shadow-2xl animate-slideInDrawer">
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-100">
              <div className="flex items-center space-x-2">
                <div className="relative w-8 h-8 rounded-md overflow-hidden border border-[#E5A93B]">
                  <Image
                    src="/tn78-logo.jpg"
                    alt="TN78 Logo"
                    fill
                    sizes="32px"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-heading font-black text-lg tracking-[0.16em] text-neutral-900 leading-none">
                    TN78
                  </span>
                  <span className="text-[8px] font-heading font-extrabold tracking-[0.22em] text-[#D97706] uppercase">
                    MEN&apos;S WEAR
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-black rounded-full hover:bg-neutral-100 transition-colors"
                aria-label="Close menu"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Links — staggered entrance */}
            <div className="flex-1 overflow-y-auto p-4 space-y-0.5">
              {NAV_LINKS.map((link, idx) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between font-heading text-[13px] font-bold uppercase tracking-[0.12em] py-3 border-b border-neutral-100/80 transition-all duration-300 tap-feedback opacity-0 animate-slideInLeft ${
                    pathname === link.href
                      ? "text-[#DC2626]"
                      : "text-neutral-800 hover:text-[#DC2626]"
                  }`}
                  style={{ animationDelay: `${idx * 50 + 100}ms`, animationFillMode: "forwards" }}
                >
                  <span className="flex items-center gap-2">
                    {pathname === link.href && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />
                    )}
                    {link.name}
                  </span>
                  {link.badge && (
                    <span className="text-[9px] font-mono font-bold bg-[#DC2626] text-white px-2 py-0.5 rounded-full leading-none animate-scaleIn">
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}

              <div
                className="pt-5 space-y-3 border-t border-neutral-200 mt-2 opacity-0 animate-fadeInUp"
                style={{ animationDelay: "500ms", animationFillMode: "forwards" }}
              >
                <a
                  href="https://www.google.com/maps/place/TN+78+MEN'S+COLLECTION/@10.5843488,77.2493999,17z/data=!3m1!4b1!4m6!3m5!1s0x3ba9cda855f1d9ed:0xb7290e20cff0dc05!8m2!3d10.5843488!4d77.2493999!16s%2Fg%2F11yk3h9xr8!18m1!1e1"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 text-[13px] font-heading font-bold uppercase tracking-wider text-[#DC2626] hover:text-black tap-feedback"
                >
                  <span>📍 VIEW LIVE STORE (GOOGLE MAPS)</span>
                </a>
                <Link
                  href="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-[13px] font-heading font-bold uppercase tracking-wider text-neutral-600 hover:text-black"
                >
                  ❤️ SAVED WISHLIST ({wishlistCount})
                </Link>
                <a
                  href="https://wa.me/917010418046?text=Vanakkam%20TN78%2C%20I%20would%20like%20to%20inquire%20about%20orders%20and%20collections."
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 text-[13px] font-heading font-bold uppercase tracking-wider text-[#1B663E] hover:text-emerald-900 tap-feedback"
                >
                  <span>💬 WHATSAPP: +91 70104 18046</span>
                </a>
              </div>
            </div>

            {/* Bottom Brand Note */}
            <div className="p-3.5 bg-neutral-50 border-t border-neutral-200 text-center">
              <p className="text-[11px] font-heading font-bold text-[#DC2626] uppercase tracking-wider">
                TN78 MEN&apos;S WEAR
              </p>
              <p className="text-[10px] font-heading font-semibold text-neutral-500 mt-0.5">
                FREE EXPRESS DELIVERY OVER ₹2,000 &bull; PAN-INDIA
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
