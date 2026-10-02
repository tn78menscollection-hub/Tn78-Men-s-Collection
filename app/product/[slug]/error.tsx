"use client";

import React, { useEffect } from "react";
import Link from "next/link";

interface ProductErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ProductError({ error, reset }: ProductErrorProps) {
  useEffect(() => {
    console.error("[TN78 Product Error]:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-[#0A0B0E] text-[#F8FAFC] px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6 bg-[#13151C] border border-[#232733] p-8 md:p-10 rounded-2xl shadow-2xl">
        <div className="w-14 h-14 mx-auto rounded-full bg-amber-950/60 border border-amber-500/40 flex items-center justify-center text-amber-400">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-heading font-black tracking-widest uppercase text-[#E2C58A]">
            GARMENT RETRIEVAL
          </span>
          <h2 className="font-heading font-black text-xl uppercase tracking-wider text-[#F8FAFC]">
            UNABLE TO LOAD PRODUCT
          </h2>
          <p className="text-xs font-body text-[#94A3B8] leading-relaxed">
            We encountered an issue loading this piece from the catalog. Please try reloading or browse alternative silhouettes.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="px-6 py-3 bg-gradient-to-r from-[#E2C58A] to-[#C6A467] text-[#0A0B0E] font-heading text-xs font-black uppercase tracking-widest rounded-full hover:brightness-110 transition-all cursor-pointer shadow-sm"
          >
            RETRY
          </button>
          <Link
            href="/shop"
            className="px-6 py-3 bg-[#0A0B0E] border border-[#232733] text-[#F8FAFC] hover:border-[#E2C58A] font-heading text-xs uppercase tracking-widest rounded-full transition-colors inline-block"
          >
            EXPLORE SHOP
          </Link>
        </div>
      </div>
    </div>
  );
}
