import React from "react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Garment Not Found | TN78 Men's Collection",
  description: "The requested menswear garment could not be found in our current capsule collection.",
};

export default function ProductNotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-[#0A0B0E] text-[#F8FAFC] px-4 py-16">
      <div className="max-w-lg w-full text-center space-y-6 bg-[#13151C] border border-[#232733] p-8 md:p-12 rounded-2xl shadow-2xl">
        <div className="w-16 h-16 border border-[#232733] rounded-full flex items-center justify-center mx-auto text-[#E2C58A] bg-[#0A0B0E]">
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-heading font-black tracking-widest uppercase text-[#E2C58A]">
            CATALOG STATUS
          </span>
          <h1 className="font-heading font-black text-2xl sm:text-3xl uppercase tracking-wider text-[#F8FAFC]">
            GARMENT NOT FOUND
          </h1>
          <p className="text-xs font-body text-[#94A3B8] leading-relaxed max-w-sm mx-auto">
            This piece may have concluded its limited capsule run or the reference URL has been updated. Explore our current catalog drops.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/shop"
            className="px-7 py-3.5 bg-gradient-to-r from-[#E2C58A] to-[#C6A467] text-[#0A0B0E] font-heading text-xs font-black uppercase tracking-widest rounded-full hover:brightness-110 transition-all inline-block shadow-[0_0_20px_rgba(226,197,138,0.2)]"
          >
            BROWSE CURRENT SHOP
          </Link>
          <Link
            href="/"
            className="px-7 py-3.5 bg-[#0A0B0E] border border-[#232733] text-[#F8FAFC] hover:border-[#E2C58A] font-heading text-xs uppercase tracking-widest rounded-full transition-colors inline-block"
          >
            RETURN TO ATELIER
          </Link>
        </div>
      </div>
    </div>
  );
}
