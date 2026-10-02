"use client";

import React from "react";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0A0B0E] text-[#F8FAFC] pb-28">
      {/* Header */}
      <section className="border-b border-[#232733] bg-[#13151C]/80 backdrop-blur-md py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-3">
          <span className="text-xs font-heading font-extrabold tracking-[0.25em] uppercase text-[#E2C58A]">
            Legal &amp; Compliance
          </span>
          <h1 className="font-heading text-2xl sm:text-4xl font-black uppercase tracking-wider text-[#F8FAFC]">
            Privacy Policy
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
            1. Information We Collect
          </h2>
          <p>
            When you visit TN78 or place an order, we collect essential details necessary to fulfill your purchases, including your full name, shipping destination, contact phone number, email address, and payment confirmation tokens.
          </p>
          <p>
            We do not store complete payment card credentials on our servers. All monetary transactions are processed through RBI-authorized, encrypted payment gateways.
          </p>
        </div>

        <div className="bg-[#13151C] border border-[#232733] rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="font-heading text-base sm:text-lg font-bold uppercase tracking-wider text-white">
            2. Purpose &amp; Usage of Personal Data
          </h2>
          <p>
            Your information is strictly utilized to:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-300">
            <li>Process, package, and dispatch luxury menswear orders via our premier air logistics partners.</li>
            <li>Send real-time SMS, WhatsApp, and email tracking advisories regarding your shipment status.</li>
            <li>Facilitate swift 7-day complimentary exchanges and returns where requested.</li>
            <li>Protect our platform and clients against fraudulent transactions.</li>
          </ul>
        </div>

        <div className="bg-[#13151C] border border-[#232733] rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="font-heading text-base sm:text-lg font-bold uppercase tracking-wider text-white">
            3. Data Confidentiality &amp; Security
          </h2>
          <p>
            We employ industry-standard 256-bit SSL encryption across all digital interfaces. We do not sell, rent, or trade customer information with outside advertising brokers. Data is shared exclusively with verified delivery logistics and payment settlement providers to fulfill your order.
          </p>
        </div>

        <div className="bg-[#13151C] border border-[#232733] rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="font-heading text-base sm:text-lg font-bold uppercase tracking-wider text-white">
            4. Client Inquiries &amp; Privacy Rights
          </h2>
          <p>
            You may request access to, correction of, or deletion of your account profile at any time by contacting our client desk at <strong className="text-white">tn78menswear@gmail.com</strong> or via WhatsApp concierge at <strong className="text-[#E2C58A]">+91 70104 18046</strong>.
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
