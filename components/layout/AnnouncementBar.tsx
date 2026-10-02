"use client";

import React from "react";

const TICKER_ITEMS = [
  { text: "🚚 FREE EXPRESS DELIVERY ACROSS INDIA ON ORDERS OVER ₹2,000", highlight: true },
  { text: "✨ 100% PURE LONG-STAPLE COTTON, LINEN & PREMIUM CO-ORDS", highlight: false },
  { text: "⚡ FAST DISPATCH WITHIN 24 HOURS VIA BLUEDART AIR", highlight: true },
  { text: "💳 100% SECURE PREPAID ONLINE PAYMENTS (UPI / CARDS / NET BANKING)", highlight: false },
  { text: "💬 WHATSAPP SIZING & STYLE ASSISTANCE: +91 70104 18046", highlight: true },
];

export function AnnouncementBar() {
  return (
    <aside
      aria-label="Announcement Ticker"
      tabIndex={0}
      className="bg-[#111827] text-white py-1 sm:py-1.5 overflow-hidden select-none z-50 relative group focus:outline-none focus-visible:ring-1 focus-visible:ring-[#F59E0B]"
    >
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused] hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] items-center space-x-8">
        {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
          <div key={idx} className="flex items-center space-x-6 text-[10px] sm:text-[11px] font-heading font-bold tracking-[0.18em] uppercase">
            <span className={item.highlight ? "text-[#F59E0B]" : "text-neutral-200"}>
              {item.text}
            </span>
            <span className="text-[#DC2626] text-[10px]">●</span>
          </div>
        ))}
      </div>
    </aside>
  );
}
