"use client";

import React, { useState, useEffect } from "react";
import { checkPincodeServiceability, PincodeCheckDto } from "@/lib/api";

interface DeliveryEstimatorProps {
  className?: string;
  showCodNotice?: boolean;
}

export default function DeliveryEstimator({
  className = "",
  showCodNotice = true,
}: DeliveryEstimatorProps) {
  const [pincode, setPincode] = useState<string>("");
  const [result, setResult] = useState<PincodeCheckDto | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    try {
      const savedPin = localStorage.getItem("tn78_delivery_pincode");
      if (savedPin && /^[1-9][0-9]{5}$/.test(savedPin)) {
        setPincode(savedPin);
        checkPincodeServiceability(savedPin)
          .then((res) => setResult(res))
          .catch(() => localStorage.removeItem("tn78_delivery_pincode"));
      }
    } catch {}
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pincode.trim();
    if (!/^[1-9][0-9]{5}$/.test(cleanPin)) {
      setError("Please enter a valid 6-digit Indian PIN code");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const data = await checkPincodeServiceability(cleanPin);
      setResult(data);
      setIsEditing(false);
      try {
        localStorage.setItem("tn78_delivery_pincode", cleanPin);
      } catch {}
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Delivery currently unserviceable to this PIN code.";
      setError(message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`p-4 bg-[#13151C] border border-[#232733] rounded-xs space-y-3 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#232733]">
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4 text-[#E2C58A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-xs font-heading font-black uppercase tracking-wider text-[#F8FAFC]">
            CHECK DELIVERY &amp; DISPATCH
          </span>
        </div>
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#E2C58A] bg-[#1C202B] px-2 py-0.5 border border-[#E2C58A]/30 rounded-xs">
          PAN-INDIA AIR
        </span>
      </div>

      {/* Result Display or Input Form */}
      {result && !isEditing ? (
        <div className="space-y-2.5">
          <div className="flex items-start justify-between bg-[#0A0B0E] p-3 border border-[#232733] rounded-xs">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-xs font-heading font-bold text-white">
                  Delivering to <span className="text-[#E2C58A] font-mono">{result.pincode}</span> ({result.city})
                </span>
              </div>
              <div className="text-[11px] text-[#94A3B8] font-body pl-4 space-y-0.5">
                <p>
                  Estimated Delivery: <strong className="text-white font-heading">{result.estimated_delivery_date}</strong>
                </p>
                <p className="text-[10.5px] text-emerald-400 font-mono">
                  ✓ BlueDart Express Air ({result.estimated_days})
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="text-[10px] font-mono uppercase text-[#E2C58A] hover:text-white underline underline-offset-2 transition-colors cursor-pointer"
            >
              Change
            </button>
          </div>

          {/* COD Notice Banner */}
          {showCodNotice && (
            <div className="p-2.5 bg-[#0A0B0E] border border-amber-900/30 rounded-xs flex items-center justify-between text-[11px] font-mono">
              <span className="text-amber-300 font-medium">⚡ 100% PREPAID DISPATCH ONLY</span>
              <span className="text-red-400 text-[10px] uppercase font-bold bg-red-950/50 px-1.5 py-0.5 border border-red-900/40 rounded-xs">
                NO COD
              </span>
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2.5">
          <p className="text-[11px] text-[#94A3B8] font-body">
            Enter your 6-digit delivery postal PIN to view real-time arrival estimates and transit speeds:
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              maxLength={6}
              value={pincode}
              onChange={(e) => {
                setPincode(e.target.value.replace(/\D/g, ""));
                if (error) setError(null);
              }}
              placeholder="e.g. 600001 or 560038"
              className="flex-1 bg-[#0A0B0E] border border-[#232733] px-3 py-2 text-xs font-mono text-white placeholder-[#475569] focus:outline-hidden focus:border-[#E2C58A] transition-colors rounded-xs"
            />
            <button
              type="submit"
              disabled={loading || pincode.length !== 6}
              className="bg-gradient-to-r from-[#E2C58A] to-[#C6A467] text-[#0A0B0E] font-heading font-black disabled:opacity-40 disabled:cursor-not-allowed text-xs uppercase tracking-wider px-4 py-2 rounded-xs transition-all flex items-center justify-center min-w-[80px] cursor-pointer hover:brightness-110"
            >
              {loading ? (
                <div className="w-3.5 h-3.5 border-2 border-[#0A0B0E] border-t-transparent rounded-full animate-spin" />
              ) : (
                "CHECK"
              )}
            </button>
          </div>

          {error && <p className="text-[11px] text-red-400 font-mono">{error}</p>}

          {/* COD Notice Banner */}
          {showCodNotice && (
            <div className="p-2 bg-[#0A0B0E] border border-[#232733] rounded-xs flex items-center justify-between text-[10.5px] font-mono">
              <span className="text-[#94A3B8]">Online Payment Only (UPI / Card)</span>
              <span className="text-red-400 font-semibold uppercase text-[9.5px]">Cash on Delivery Unavailable</span>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
