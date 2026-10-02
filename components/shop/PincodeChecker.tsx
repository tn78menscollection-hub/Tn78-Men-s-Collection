"use client";

import React, { useState } from "react";

export default function PincodeChecker() {
  const [pincode, setPincode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [estimatedDate, setEstimatedDate] = useState("");

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = pincode.trim();
    if (!/^[1-9][0-9]{5}$/.test(clean)) {
      setStatus("error");
      return;
    }

    setStatus("loading");
    setTimeout(() => {
      // Calculate 3-4 days ahead
      const delivery = new Date();
      delivery.setDate(delivery.getDate() + 3);
      const options: Intl.DateTimeFormatOptions = {
        weekday: "short",
        month: "short",
        day: "numeric",
      };
      setEstimatedDate(delivery.toLocaleDateString("en-IN", options));
      setStatus("success");
    }, 400);
  };

  return (
    <div className="border-t border-b border-[#232733] py-4 my-6 space-y-3">
      <div className="flex items-center justify-between text-xs tracking-wider uppercase text-[#F8FAFC] font-mono">
        <span className="flex items-center gap-1.5 font-medium">
          <svg className="w-4 h-4 text-[#E2C58A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Check Delivery Estimate
        </span>
        <span className="text-[11px] text-[#94A3B8]">Pan-India Service</span>
      </div>

      <form onSubmit={handleCheck} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            maxLength={6}
            value={pincode}
            onChange={(e) => {
              setPincode(e.target.value.replace(/\D/g, ""));
              if (status !== "idle") setStatus("idle");
            }}
            placeholder="Enter 6-digit Pincode"
            className="w-full bg-[#0A0B0E] border border-[#232733] px-3.5 py-2 text-xs font-mono text-[#F8FAFC] placeholder-[#64748B] focus:outline-hidden focus:border-[#E2C58A] transition-colors rounded-xs"
          />
        </div>
        <button
          type="submit"
          disabled={status === "loading" || pincode.length !== 6}
          className="bg-gradient-to-r from-[#E2C58A] to-[#C6A467] text-[#0A0B0E] disabled:opacity-40 disabled:cursor-not-allowed text-xs font-mono uppercase tracking-wider px-4 py-2 rounded-xs hover:brightness-110 transition-all font-black flex items-center justify-center min-w-[70px] cursor-pointer"
        >
          {status === "loading" ? "..." : "Check"}
        </button>
      </form>

      {status === "error" && (
        <p className="text-[11px] text-red-400 font-mono">
          Please enter a valid 6-digit postal code.
        </p>
      )}

      {status === "success" && (
        <div className="bg-[#13151C] p-3 rounded-xs border border-[#232733] space-y-1.5 text-xs text-[#F8FAFC]">
          <div className="flex items-center gap-1.5 font-medium text-[#E2C58A]">
            <svg className="w-4 h-4 shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Express Delivery by <strong className="text-[#F8FAFC] font-mono">{estimatedDate}</strong></span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-[#94A3B8] pl-5 font-mono">
            <span>⚡ 100% Secure Prepaid (No COD)</span>
            <span>✓ Free Delivery &ge; ₹2,000</span>
          </div>
        </div>
      )}
    </div>
  );
}
