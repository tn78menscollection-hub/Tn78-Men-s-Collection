"use client";

import React, { useState } from "react";
import { useToast } from "@/components/ui/Toast";

const SPARKLE_DOTS = [
  { left: "15%", top: "25%", delay: "0s", duration: "3.2s", opacity: 0.55 },
  { left: "82%", top: "30%", delay: "0.5s", duration: "3.8s", opacity: 0.6 },
  { left: "45%", top: "65%", delay: "1.0s", duration: "4.0s", opacity: 0.45 },
  { left: "70%", top: "80%", delay: "1.5s", duration: "3.5s", opacity: 0.5 },
  { left: "25%", top: "75%", delay: "2.0s", duration: "4.2s", opacity: 0.65 },
  { left: "90%", top: "60%", delay: "2.5s", duration: "3.6s", opacity: 0.4 },
  { left: "35%", top: "20%", delay: "3.0s", duration: "4.5s", opacity: 0.5 },
  { left: "60%", top: "35%", delay: "3.5s", duration: "3.9s", opacity: 0.55 },
];

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes("@") || !trimmedEmail.includes(".")) {
      setStatus("error");
      setMessage("Please provide a valid email address.");
      showToast("Please enter a valid email address.", "error");
      return;
    }
    setStatus("success");
    setMessage("THANK YOU FOR SUBSCRIBING. YOU WILL RECEIVE EXCLUSIVE UPDATES ON NEW DROPS & OFFERS.");
    showToast("Thank you for subscribing to TN78 updates!", "success", 4000);
    setEmail("");
  };

  return (
    <section className="bg-[#0E1017] py-12 sm:py-16 md:py-24 border-b border-[#232733] px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated sparkle particles */}
      <div className="sparkle-container pointer-events-none" aria-hidden="true">
        {SPARKLE_DOTS.map((dot, i) => (
          <span
            key={i}
            className="sparkle-dot"
            style={{
              left: dot.left,
              top: dot.top,
              animationDelay: dot.delay,
              animationDuration: dot.duration,
              opacity: dot.opacity,
            }}
          />
        ))}
      </div>

      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#E2C58A]/5 rounded-full blur-3xl pointer-events-none animate-pulseGlow" />

      <div className="max-w-3xl mx-auto text-center flex flex-col items-center relative z-10">
        <span className="font-heading text-xs font-bold uppercase tracking-[0.25em] text-gradient-gold mb-2 inline-block">
          NEWSLETTER &amp; DROPS
        </span>

        <h2 className="font-heading font-black text-2xl sm:text-3xl md:text-4xl text-white tracking-tight">
          Join The TN78 <span className="text-gradient-gold">Insider Edit</span>
        </h2>

        <p className="mt-2 text-xs sm:text-sm text-slate-400 font-serif italic max-w-md leading-relaxed">
          Receive priority announcements for limited seasonal capsule drops, styling lookbooks, and promotional offer events.
        </p>

        {status === "success" ? (
          <div className="mt-6 p-5 glass-card-dark text-center animate-scaleIn rounded-xl shadow-glow-gold max-w-md w-full">
            <div className="flex items-center justify-center mb-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E2C58A] to-[#D97706] flex items-center justify-center animate-scaleInBounce">
                <svg className="w-5 h-5 text-[#0A0B0E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <p className="text-[#E2C58A] font-heading text-xs uppercase tracking-wider font-bold">
              {message}
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-8 w-full max-w-md flex flex-col sm:flex-row gap-3"
          >
            <div className="flex-1 relative group">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                placeholder="Enter your email address"
                required
                className="w-full bg-[#13151C] border border-[#232733] px-5 py-3.5 text-xs tracking-wide font-heading text-white placeholder-slate-500 focus:border-[#E2C58A] focus:outline-none transition-all duration-300 rounded-full focus:shadow-glow-gold"
              />
              {/* Glowing border on focus */}
              <div className="absolute inset-0 rounded-full border border-[#E2C58A]/0 group-focus-within:border-[#E2C58A]/30 transition-all duration-500 pointer-events-none group-focus-within:shadow-glow-gold" />
            </div>
            <button
              type="submit"
              className="px-8 py-3.5 bg-gradient-to-r from-[#E2C58A] to-[#C6A467] hover:brightness-110 text-[#0A0B0E] font-heading text-xs font-black uppercase tracking-widest rounded-full transition-all duration-300 shrink-0 shadow-glow-gold hover:scale-105 active:scale-95 btn-shimmer cursor-pointer hover:shadow-glow-gold-lg"
            >
              SUBSCRIBE
            </button>
          </form>
        )}

        {status === "error" && (
          <p className="mt-2 text-xs font-body text-rose-400 animate-fadeIn">
            {message}
          </p>
        )}

        <span className="mt-5 text-[10px] font-heading uppercase tracking-widest text-slate-500">
          WE RESPECT CLIENT DISCRETION &bull; ZERO SPAM &bull; UNSUBSCRIBE AT ANY MOMENT
        </span>
      </div>
    </section>
  );
}
