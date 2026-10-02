"use client";

import React from "react";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0A0B0E] text-[#F8FAFC] pb-28">
      {/* Header */}
      <section className="border-b border-[#232733] bg-[#13151C]/80 backdrop-blur-md py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-3">
          <span className="text-xs font-heading font-extrabold tracking-[0.25em] uppercase text-[#E2C58A]">
            Terms of Service
          </span>
          <h1 className="font-heading text-2xl sm:text-4xl font-black uppercase tracking-wider text-[#F8FAFC]">
            Terms &amp; Conditions
          </h1>
          <p className="text-xs text-[#94A3B8] font-mono">
            Last Updated: September 2026 &bull; TN78 Men&apos;s Wear
          </p>
        </div>
      </section>

      {/* Content Body */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-14 space-y-8 text-xs sm:text-sm text-[#94A3B8] leading-relaxed font-body">
        <div className="bg-[#13151C] border border-[#232733] rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="font-heading text-base sm:text-lg font-bold uppercase tracking-wider text-white">
            1. Commercial Terms &amp; Scope
          </h2>
          <p>
            By accessing or purchasing from TN78 Men&apos;s Wear (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;), you agree to be bound by these terms. TN78 is an artisanal luxury menswear brand committed to exceptional tailoring and dependable fulfillment across India.
          </p>
        </div>

        <div className="bg-[#13151C] border border-[#232733] rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="font-heading text-base sm:text-lg font-bold uppercase tracking-wider text-white">
            2. Orders, Pricing &amp; Prepaid Policy
          </h2>
          <p>
            All prices are quoted in Indian Rupees (INR) and are inclusive of applicable GST. We operate strictly on 100% prepaid online transactions (UPI, Debit/Credit Cards, Net Banking) to guarantee priority queueing and expeditious courier handling. Cash on Delivery (COD) is not accepted.
          </p>
          <p>
            Delivery is complimentary on orders valued at ₹2,000 or greater. For orders below ₹2,000, express shipping charges apply as indicated at checkout.
          </p>
        </div>

        <div className="bg-[#13151C] border border-[#232733] rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="font-heading text-base sm:text-lg font-bold uppercase tracking-wider text-white">
            3. Exchange &amp; Return Windows
          </h2>
          <p>
            We honor a 7-day complimentary exchange and return window starting from the verified delivery timestamp. Garments must be unworn, undamaged, unwashed, and accompanied by original tags, labels, and packaging.
          </p>
        </div>

        <div className="bg-[#13151C] border border-[#232733] rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="font-heading text-base sm:text-lg font-bold uppercase tracking-wider text-white">
            4. Customer Support
          </h2>
          <p>
            For assistance with ongoing orders or bespoke inquiries, reach our client desk at <strong className="text-white">tn78menswear@gmail.com</strong> or message our dedicated concierge at <strong className="text-[#E2C58A]">+91 70104 18046</strong>.
          </p>
        </div>

        <div className="pt-4 text-center">
          <Link
            href="/"
            className="text-xs font-heading font-bold uppercase tracking-wider text-[#E2C58A] hover:underline"
          >
            &larr; Return to Storefront
          </Link>
        </div>
      </section>
    </div>
  );
}
