"use client";

import React, { useState } from "react";
import Link from "next/link";

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: "What is your standard delivery timeline across India?",
    a: "Orders are processed and dispatched within 24 to 48 business hours from our warehouse. Metro deliveries generally arrive within 2 to 4 business days, while non-metro regions take 3 to 6 business days. You will receive real-time SMS & email tracking once handed to our air courier partner.",
  },
  {
    q: "How does the 7-day exchange and return policy work?",
    a: "We offer complimentary doorstep exchange and returns within 7 calendar days of delivery. Items must be unworn, unwashed, with original brand tags and packaging intact. You can initiate an exchange directly from your Account Orders dashboard or by messaging our WhatsApp concierge.",
  },
  {
    q: "Is delivery free on orders?",
    a: "Delivery is completely free on all orders above ₹2,000 across India, as well as during special promotional periods. For orders below ₹2,000, standard express delivery is calculated at checkout.",
  },
  {
    q: "Is Cash on Delivery (COD) available?",
    a: "To ensure swift priority dispatch and zero doorstep handling delays, TN78 operates exclusively on 100% secure prepaid online payments (UPI, Cards, Net Banking). Cash on Delivery (COD) is not available.",
  },
  {
    q: "How should I select my size?",
    a: "Our silhouettes feature an intentional relaxed luxury drape with structured shoulder drops. If you prefer a tailored, traditional fit, we recommend ordering one size down from your usual measurement. You can also consult our Size Guide on every product page.",
  },
  {
    q: "How do I care for pure linen and waffle garments?",
    a: "Machine wash on gentle cycle using cold water with mild liquid detergent. Do not bleach or tumble dry. Dry flat in shade to preserve color saturation. Lightly steam or iron on linen setting while slightly damp for the signature crisp drape.",
  },
];

export default function SupportPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-[#0A0B0E] text-[#F8FAFC] pb-28">
      {/* Concierge Hero */}
      <section className="border-b border-[#232733] bg-[#13151C]/80 backdrop-blur-md py-14 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <span className="text-xs font-heading font-extrabold tracking-[0.25em] uppercase text-[#E2C58A]">
            TN78 Client Concierge
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl uppercase tracking-wider text-[#F8FAFC]">
            Dedicated Assistance & Care
          </h1>
          <p className="max-w-xl mx-auto text-xs sm:text-sm text-[#94A3B8] leading-relaxed font-body">
            Whether you need sizing advice, styling guidance, order tracking, or exchange support, our client team is here to assist your wardrobe journey.
          </p>
        </div>
      </section>

      {/* Direct Contact Channels */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* WhatsApp Concierge */}
          <div className="bg-[#13151C] border border-[#232733] hover:border-[#E2C58A]/50 p-6 rounded-xl space-y-4 shadow-xl transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                </svg>
              </div>
              <h3 className="font-serif text-lg font-bold text-[#F8FAFC]">WhatsApp Concierge</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Connect directly with our styling and order care specialist for rapid response.
              </p>
            </div>
            <a
              href="https://wa.me/917010418046?text=Vanakkam%20TN78%2C%20I%20would%20like%20assistance%20with%20my%20order."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full text-center bg-emerald-500 hover:bg-emerald-400 text-[#0A0B0E] text-xs font-mono font-bold uppercase tracking-wider py-3 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all"
            >
              Chat on WhatsApp
            </a>
          </div>

          {/* Track Dispatch */}
          <div className="bg-[#13151C] border border-[#232733] hover:border-[#E2C58A]/50 p-6 rounded-xl space-y-4 shadow-xl transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#E2C58A]/10 border border-[#E2C58A]/30 flex items-center justify-center text-[#E2C58A]">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="font-serif text-lg font-bold text-[#F8FAFC]">Track Shipment</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Monitor the live status and courier milestones of your incoming package.
              </p>
            </div>
            <Link
              href="/orders/track"
              className="inline-block w-full text-center border border-[#232733] hover:border-[#E2C58A] bg-[#0A0B0E] text-[#F8FAFC] hover:text-[#E2C58A] text-xs font-mono font-bold uppercase tracking-wider py-3 rounded-full transition-all"
            >
              Track Live Order
            </Link>
          </div>

          {/* Exchange & Returns */}
          <div className="bg-[#13151C] border border-[#232733] hover:border-[#E2C58A]/50 p-6 rounded-xl space-y-4 shadow-xl transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#E2C58A]/10 border border-[#E2C58A]/30 flex items-center justify-center text-[#E2C58A]">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="font-serif text-lg font-bold text-[#F8FAFC]">7-Day Exchanges</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Need a different size or shade? Initiate a complimentary replacement pickup.
              </p>
            </div>
            <Link
              href="/account/orders"
              className="inline-block w-full text-center border border-[#232733] hover:border-[#E2C58A] bg-[#0A0B0E] text-[#F8FAFC] hover:text-[#E2C58A] text-xs font-mono font-bold uppercase tracking-wider py-3 rounded-full transition-all"
            >
              Manage Orders
            </Link>
          </div>
        </div>



        {/* FAQs Accordion */}
        <div className="mt-16 space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-heading font-extrabold uppercase tracking-widest text-[#E2C58A]">
              Common Inquiries
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl uppercase tracking-wider text-[#F8FAFC]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="bg-[#13151C] border border-[#232733] rounded-xl divide-y divide-[#232733] mt-8 shadow-xl">
            {FAQS.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={idx} className="p-5 sm:p-6 transition-colors">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left gap-4 cursor-pointer"
                  >
                    <span className="font-serif text-base sm:text-lg font-medium text-[#F8FAFC]">
                      {faq.q}
                    </span>
                    <span className="font-mono text-xl text-[#E2C58A] shrink-0">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="mt-3 text-xs sm:text-sm text-[#94A3B8] leading-relaxed font-body pr-4 animate-fadeIn">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
