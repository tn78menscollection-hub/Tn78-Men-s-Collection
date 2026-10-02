"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCartWishlist } from "@/lib/cartWishlistContext";

export function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { wishlistCount, cartCount, openCartDrawer } = useCartWishlist();
  const [tappedId, setTappedId] = useState<string | null>(null);
  const [optimisticPath, setOptimisticPath] = useState<string | null>(null);
  const [prevWishlistCount, setPrevWishlistCount] = useState(wishlistCount);
  const [prevCartCount, setPrevCartCount] = useState(cartCount);
  const [badgeBounce, setBadgeBounce] = useState(false);
  const [cartBadgeBounce, setCartBadgeBounce] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  if (pathname.startsWith("/admin")) {
    return null;
  }

  // Clear optimistic path on route change
  useEffect(() => {
    setOptimisticPath(null);
  }, [pathname]);

  // Proactively prefetch all bottom nav routes on mount for instant navigation
  useEffect(() => {
    const prefetchRoutes = ["/", "/search", "/wishlist", "/cart", "/account/orders"];
    prefetchRoutes.forEach((route) => {
      try {
        router.prefetch(route);
      } catch {}
    });
  }, [router]);

  // Detect wishlist count changes for badge bounce
  useEffect(() => {
    if (wishlistCount !== prevWishlistCount) {
      setBadgeBounce(true);
      setPrevWishlistCount(wishlistCount);
      const timer = setTimeout(() => setBadgeBounce(false), 500);
      return () => clearTimeout(timer);
    }
  }, [wishlistCount, prevWishlistCount]);

  // Detect cart count changes for badge bounce
  useEffect(() => {
    if (cartCount !== prevCartCount) {
      setCartBadgeBounce(true);
      setPrevCartCount(cartCount);
      const timer = setTimeout(() => setCartBadgeBounce(false), 500);
      return () => clearTimeout(timer);
    }
  }, [cartCount, prevCartCount]);

  const handleTap = (label: string, href: string) => {
    setTappedId(label);
    setOptimisticPath(href);
    setTimeout(() => setTappedId(null), 300);
  };

  const items = [
    {
      label: "HOME",
      href: "/",
      icon: (
        <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      label: "SEARCH",
      href: "/search",
      icon: (
        <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
    {
      label: "WISHLIST",
      href: "/wishlist",
      icon: (
        <div className="relative">
          <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          {wishlistCount > 0 && (
            <span
              className={`absolute -top-1.5 -right-2 bg-[#DC2626] text-white text-[7px] font-black rounded-full w-4 h-4 flex items-center justify-center font-heading shadow-xs transition-transform ${
                badgeBounce ? "animate-scaleInBounce" : ""
              }`}
            >
              {wishlistCount}
            </span>
          )}
        </div>
      ),
    },
    {
      label: "BAG",
      href: "/cart",
      isCart: true,
      icon: (
        <div className="relative">
          <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          {cartCount > 0 && (
            <span
              className={`absolute -top-1.5 -right-2 bg-[#DC2626] text-white text-[7px] font-black rounded-full w-4 h-4 flex items-center justify-center font-heading shadow-xs transition-transform ${
                cartBadgeBounce ? "animate-scaleInBounce" : ""
              }`}
            >
              {cartCount}
            </span>
          )}
        </div>
      ),
    },
    {
      label: "ACCOUNT",
      href: "/account/orders",
      icon: (
        <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ];

  const currentPath = optimisticPath || pathname;
  const activeIndex = items.findIndex(
    (item) => currentPath === item.href || (item.href !== "/" && currentPath.startsWith(item.href.split("#")[0]))
  );

  return (
    <nav
      ref={navRef}
      aria-label="Mobile Navigation"
      className="fixed bottom-0 inset-x-0 z-40 lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      {/* Animated gradient top border */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-[#DC2626]/30 to-transparent" />

      <div className="bg-white/95 backdrop-blur-xl shadow-mobile-nav-glow">
        <div className="grid grid-cols-5 h-[58px] relative">
          {/* Sliding active pill indicator */}
          {activeIndex >= 0 && (
            <div
              className="absolute top-0 h-[2.5px] bg-[#DC2626] rounded-full transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
              style={{
                width: `${100 / 5}%`,
                left: `${(activeIndex * 100) / 5}%`,
              }}
            />
          )}

          {items.map((item) => {
            const isActive = currentPath === item.href || (item.href !== "/" && currentPath.startsWith(item.href.split("#")[0]));
            const isTapped = tappedId === item.label;
            return (
              <Link
                key={item.label}
                href={item.href}
                aria-label={item.label}
                prefetch={true}
                onTouchStart={() => {
                  try {
                    router.prefetch(item.href);
                  } catch {}
                }}
                onMouseEnter={() => {
                  try {
                    router.prefetch(item.href);
                  } catch {}
                }}
                onClick={() => {
                  handleTap(item.label, item.href);
                }}
                className={`flex flex-col items-center justify-center space-y-0.5 transition-all duration-150 relative cursor-pointer tap-feedback ${
                  isActive
                    ? "text-[#DC2626]"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                {/* Icon with bounce on tap */}
                <span
                  className={`transition-all duration-200 ${
                    isActive ? "scale-110 -translate-y-0.5" : ""
                  } ${isTapped ? "animate-iconPop" : ""}`}
                >
                  {item.icon}
                </span>
                <span
                  className={`font-heading text-[8px] font-bold uppercase tracking-wider leading-none transition-all duration-200 ${
                    isActive ? "text-[#DC2626] font-extrabold" : ""
                  }`}
                >
                  {item.label}
                </span>

                {/* Active glow dot */}
                {isActive && (
                  <span className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-[#DC2626] animate-pulseGlow" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
