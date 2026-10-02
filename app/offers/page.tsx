"use client";

import React, { useState } from "react";
import Link from "next/link";

interface Coupon {
  code: string;
  discount: string;
  description: string;
  minOrder: string;
  validUntil: string;
  tag: string;
}

const COUPONS: Coupon[] = [
  {
    code: "TN78LUX",
    discount: "₹500 FLAT OFF",
    description: "Applicable on all Linen Shirts, Co-ord Sets, and Pleated Trousers.",
    minOrder: "Min. cart value ₹2,999",
    validUntil: "Valid this season",
    tag: "SIGNATURE OFFER",
  },
  {
    code: "TN78STYLE",
    discount: "15% ENSEMBLE DISCOUNT",
    description: "Multi-item discount applied when purchasing two or more garments together.",
    minOrder: "Min. 2 items in cart",
    validUntil: "Seasonal drop",
    tag: "STYLE EDIT",
  },
  {
    code: "AUTOMATIC",
    discount: "COMPLIMENTARY AIR SHIPPING",
    description: "Priority express courier dispatch pan-India with tamper-evident packaging.",
    minOrder: "Auto-applies above ₹2,000",
    validUntil: "Always active on ₹2,000+",
    tag: "FREE DELIVERY",
  },
  {
    code: "FESTIVE1000",
    discount: "₹1,000 SHOPPING CREDIT",
    description: "Exclusive bundle saving on complete ensemble wardrobe orders.",
    minOrder: "Min. cart value ₹4,999",
    validUntil: "Limited allocation",
    tag: "WARDROBE SPECIAL",
  },
];

export default function OffersPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#0A0B0E] text-[#F8FAFC] pb-28">
      {/* Editorial Header - Compact */}
      <section className="border-b border-[#232733] bg-[#13151C]/80 backdrop-blur-md py-6 sm:py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-2">
          <span className="text-xs font-mono tracking-[0.25em] uppercase text-[#E2C58A] font-semibold">
            Curated Promotions & Seasonal Offers
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl uppercase tracking-wider text-[#F8FAFC]">
            Offers &amp; Vouchers
          </h1>
          <p className="max-w-xl mx-auto text-xs sm:text-sm text-[#94A3B8] leading-relaxed font-body">
            Exclusively extended to our patrons. Copy your chosen voucher code and apply it during checkout to redeem distinguished savings on modern menswear.
          </p>
        </div>
      </section>

      {/* Coupons Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {COUPONS.map((c) => {
            const isCopied = copiedCode === c.code;
            return (
              <div
                key={c.code}
                className="relative bg-[#13151C] border border-[#232733] hover:border-[#E2C58A]/50 p-6 sm:p-8 rounded-xl shadow-xl hover:shadow-[0_0_25px_rgba(226,197,138,0.1)] transition-all flex flex-col justify-between"
              >
                {/* Coupon Tag & Validity */}
                <div className="flex items-center justify-between border-b border-[#232733] pb-3 mb-4">
                  <span className="text-[10px] font-mono tracking-widest uppercase bg-[#E2C58A]/10 text-[#E2C58A] border border-[#E2C58A]/30 px-2.5 py-1 rounded font-semibold">
                    {c.tag}
                  </span>
                  <span className="text-[11px] font-mono text-[#94A3B8]">
                    {c.validUntil}
                  </span>
                </div>

                {/* Offer Details */}
                <div className="space-y-2 mb-6">
                  <h3 className="font-serif text-2xl font-bold tracking-wide text-[#E2C58A]">
                    {c.discount}
                  </h3>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    {c.description}
                  </p>
                  <p className="text-[11px] font-mono text-emerald-400 pt-1">
                    ✦ {c.minOrder}
                  </p>
                </div>

                {/* Voucher Code & Action */}
                <div className="flex items-center justify-between bg-[#0A0B0E] border border-dashed border-[#232733] p-3 rounded-lg">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider font-mono text-[#94A3B8] block">
                      Voucher Code
                    </span>
                    <span className="font-mono text-base font-bold tracking-widest text-[#F8FAFC]">
                      {c.code}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyCode(c.code)}
                    className={`px-4 py-2 text-xs font-mono uppercase tracking-wider rounded font-bold transition-all cursor-pointer ${
                      isCopied
                        ? "bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                        : "bg-[#E2C58A] text-[#0A0B0E] hover:brightness-110 shadow-[0_0_15px_rgba(226,197,138,0.25)]"
                    }`}
                  >
                    {isCopied ? "Copied!" : "Copy Code"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Banner */}
        <div className="mt-14 bg-gradient-to-r from-[#13151C] via-[#191D28] to-[#13151C] border border-[#232733] text-[#F8FAFC] p-8 sm:p-12 text-center rounded-xl space-y-4 shadow-2xl">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#E2C58A]">
            Limited Availability
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl uppercase tracking-wider text-[#F8FAFC]">
            Explore The Current Season Release
          </h2>
          <p className="text-xs text-[#94A3B8] max-w-md mx-auto leading-relaxed">
            Discover lightweight linen silhouettes, boxy overshirts, and relaxed pleated trousers.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-block bg-gradient-to-r from-[#E2C58A] via-[#F3E2B8] to-[#C6A467] text-[#0A0B0E] text-xs font-heading font-black uppercase tracking-widest px-8 py-3.5 rounded-full hover:brightness-110 shadow-[0_0_20px_rgba(226,197,138,0.3)] transition-all"
            >
              Shop The Catalog
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
