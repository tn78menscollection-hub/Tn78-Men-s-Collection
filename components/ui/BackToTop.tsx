"use client";

import React, { useState, useEffect } from "react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    let rafId: number;
    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setVisible(scrollTop > 350);
      setProgress(scrollPercent);
      rafId = requestAnimationFrame(update);
    };

    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Listen to WhatsApp popup open/close state to prevent any collision
  useEffect(() => {
    const handleChatToggle = (e: Event) => {
      const customEvent = e as CustomEvent<{ isOpen: boolean }>;
      setIsChatOpen(Boolean(customEvent.detail?.isOpen));
    };
    window.addEventListener("tn78:whatsapp_modal_state", handleChatToggle);
    return () => window.removeEventListener("tn78:whatsapp_modal_state", handleChatToggle);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isHidden = !visible || isChatOpen;

  // SVG circle progress
  const radius = 17;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (progress / 100) * circumference;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      title="Back to top"
      className={`fixed z-30 w-11 h-11 rounded-full bg-white text-neutral-800 border border-neutral-200/90 shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-center group cursor-pointer active:scale-90 ${
        isHidden
          ? "opacity-0 pointer-events-none translate-y-3 scale-75"
          : "opacity-100 pointer-events-auto translate-y-0 scale-100"
      } bottom-[134px] right-[18px] sm:bottom-[88px] sm:right-[22px] lg:bottom-[102px] lg:right-[38px]`}
    >
      {/* Progress ring */}
      <svg
        className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
        viewBox="0 0 44 44"
      >
        <circle
          cx="22"
          cy="22"
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="2"
        />
        <circle
          cx="22"
          cy="22"
          r={radius}
          fill="none"
          stroke="#DC2626"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className="transition-all duration-150"
        />
      </svg>

      {/* Arrow icon */}
      <svg
        className="w-4 h-4 text-neutral-700 group-hover:text-[#DC2626] transition-colors relative z-10 group-hover:-translate-y-0.5 transition-transform"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          d="M5 15l7-7 7 7"
        />
      </svg>
    </button>
  );
}
