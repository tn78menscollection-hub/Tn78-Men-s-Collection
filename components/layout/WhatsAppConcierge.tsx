"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const CONCIERGE_PHONE = "917010418046"; // Official TN78 WhatsApp Hotline

export function WhatsAppConcierge() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);

  // Hide in backoffice
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const toggleModal = (nextState?: boolean) => {
    const target = typeof nextState === "boolean" ? nextState : !isOpen;
    setIsOpen(target);
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("tn78:whatsapp_modal_state", { detail: { isOpen: target } })
      );
    }
  };

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(e.target as Node)) {
        toggleModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  const handleOpenWhatsApp = () => {
    const defaultMsg = encodeURIComponent(
      "Hello TN78 Men's Wear, I am reaching out from your online store and would like styling & order assistance."
    );
    const url = `https://wa.me/${CONCIERGE_PHONE}?text=${defaultMsg}`;
    window.open(url, "_blank", "noopener,noreferrer");
    toggleModal(false);
  };

  return (
    <div
      ref={widgetRef}
      data-testid="whatsapp-concierge-widget"
      className="fixed bottom-[74px] right-4 sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-8 z-40 flex flex-col items-end"
    >
      {/* Compact Short Popup Modal */}
      {isOpen && (
        <div className="mb-3 w-[300px] sm:w-[330px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden animate-fadeIn duration-200 select-none">
          {/* Top Compact Dark Header */}
          <div className="bg-black text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-heading font-bold text-sm text-white tracking-wide">
                Chat with us
              </span>
            </div>
            <button
              type="button"
              onClick={() => toggleModal(false)}
              className="text-white/70 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
              aria-label="Close chat"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* White Compact Body */}
          <div className="p-3.5 sm:p-4 bg-white space-y-2.5">
            <p className="text-neutral-500 font-medium text-xs sm:text-sm text-left">
              How can we help you today?
            </p>

            {/* Lets talk on WhatsApp Button */}
            <button
              type="button"
              onClick={handleOpenWhatsApp}
              className="w-full bg-white hover:bg-neutral-50 border border-neutral-200 hover:border-neutral-300 rounded-xl p-2.5 sm:p-3 flex items-center justify-between shadow-xs transition-all cursor-pointer group"
            >
              <div className="flex items-center space-x-2.5">
                {/* WhatsApp Logo Icon */}
                <div className="w-7 h-7 rounded-full bg-[#25D366] flex items-center justify-center text-white flex-shrink-0 shadow-xs">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.174.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.144.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824z" />
                  </svg>
                </div>
                <span className="font-heading font-bold text-neutral-900 text-xs sm:text-sm group-hover:text-black">
                  Lets talk on WhatsApp
                </span>
              </div>
              <svg className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Stylist Hotline Status */}
            <div className="flex items-center justify-between text-[10px] text-neutral-500 font-mono px-0.5">
              <span>💬 Direct Styling Hotline</span>
              <span className="text-emerald-600 font-semibold">+91 70104 18046</span>
            </div>

            {/* Footer */}
            <div className="text-center pt-1 text-[10px] text-neutral-400 font-medium border-t border-neutral-100">
              Official WhatsApp &bull; Fast Dispatch Support
            </div>
          </div>
        </div>
      )}

      {/* Floating Circular Trigger (Matching WhatsApp Icon from Screenshots) */}
      <button
        type="button"
        onClick={() => toggleModal()}
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] text-white shadow-xl hover:shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer relative"
        aria-label="Open WhatsApp chat"
        title="Chat on WhatsApp"
      >
        <svg className="w-6 h-6 sm:w-7 sm:h-7 fill-white" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>

        {/* Pulse indicator */}
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full animate-ping" />
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
      </button>
    </div>
  );
}
