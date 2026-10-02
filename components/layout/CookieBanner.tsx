"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const COOKIE_CONSENT_KEY = "tn78_cookie_consent";

export function CookieBanner() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show if user hasn't made a choice yet
    try {
      const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (!consent) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  if (!visible || pathname.startsWith("/admin")) {
    return null;
  }

  const handleAgree = () => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, "agreed");
    } catch {}
    setVisible(false);
  };

  const handleDismiss = () => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, "dismissed");
    } catch {}
    setVisible(false);
  };

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed bottom-14 lg:bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-neutral-200 p-3 sm:p-4 shadow-xl transition-all duration-300 animate-fadeIn"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        {/* Text matching Screenshot 4 */}
        <p className="text-xs sm:text-sm text-neutral-600 font-medium">
          This website uses cookies to ensure you get the best experience on our website.{" "}
          <Link
            href="/support"
            className="text-neutral-900 underline font-semibold hover:text-[#DC2626]"
          >
            Privacy Policy
          </Link>
        </p>

        {/* Buttons matching Screenshot 4 */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          <button
            type="button"
            onClick={handleDismiss}
            className="text-xs sm:text-sm font-bold text-neutral-600 hover:text-black px-3 py-1.5 rounded-md transition-colors cursor-pointer"
          >
            Not agree
          </button>
          <button
            type="button"
            onClick={handleAgree}
            className="bg-black hover:bg-neutral-800 text-white text-xs sm:text-sm font-bold px-6 py-2 rounded-md shadow-xs transition-colors cursor-pointer"
          >
            Agree
          </button>
        </div>
      </div>
    </div>
  );
}
