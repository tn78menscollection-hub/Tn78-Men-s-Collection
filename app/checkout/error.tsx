"use client";

import React, { useEffect } from "react";
import Link from "next/link";

interface CheckoutErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function CheckoutError({ error, reset }: CheckoutErrorProps) {
  useEffect(() => {
    console.error("[TN78 Checkout Error]:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-[#0A0B0E] text-[#F8FAFC] px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6 bg-[#13151C] border border-[#232733] p-8 md:p-10 rounded-2xl shadow-2xl">
        <div className="w-14 h-14 mx-auto rounded-full bg-red-950/60 border border-red-500/40 flex items-center justify-center text-red-400">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-heading font-black tracking-widest uppercase text-[#E2C58A]">
            CHECKOUT SESSION
          </span>
          <h2 className="font-heading font-black text-xl uppercase tracking-wider text-[#F8FAFC]">
            SESSION INITIALIZATION ERROR
          </h2>
          <p className="text-xs font-body text-[#94A3B8] leading-relaxed">
            We encountered an unexpected issue while loading your checkout session. Your items remain preserved in your shopping cart.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="px-6 py-3 bg-gradient-to-r from-[#E2C58A] to-[#C6A467] text-[#0A0B0E] font-heading text-xs font-black uppercase tracking-widest rounded-full hover:brightness-110 transition-all cursor-pointer shadow-sm"
          >
            RETRY CHECKOUT
          </button>
          <Link
            href="/cart"
            className="px-6 py-3 bg-[#0A0B0E] border border-[#232733] text-[#F8FAFC] hover:border-[#E2C58A] font-heading text-xs uppercase tracking-widest rounded-full transition-colors inline-block"
          >
            RETURN TO CART
          </Link>
        </div>
      </div>
    </div>
  );
}
