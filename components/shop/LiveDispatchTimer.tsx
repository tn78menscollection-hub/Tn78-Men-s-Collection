"use client";

import React, { useState, useEffect } from "react";
import {
  DispatchStatusDto,
  PincodeCheckDto,
  getDispatchStatus,
  checkPincodeServiceability,
} from "@/lib/api";

export default function LiveDispatchTimer() {
  const [dispatchData, setDispatchData] = useState<DispatchStatusDto | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState<number | null>(null);
  const [pincode, setPincode] = useState<string>("");
  const [pincodeResult, setPincodeResult] = useState<PincodeCheckDto | null>(null);
  const [pincodeLoading, setPincodeLoading] = useState<boolean>(false);
  const [pincodeError, setPincodeError] = useState<string | null>(null);
  const [isEditingPincode, setIsEditingPincode] = useState<boolean>(false);

  // 1. Fetch dispatch status on mount
  useEffect(() => {
    let isMounted = true;
    getDispatchStatus()
      .then((data) => {
        if (isMounted) {
          setDispatchData(data);
          setSecondsRemaining(data.seconds_until_cut_off);
        }
      })
      .catch((err) => {
        console.warn("Failed to load live dispatch status:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Second-by-second countdown timer
  useEffect(() => {
    if (secondsRemaining === null || secondsRemaining <= 0) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev === null || prev <= 1) {
          // Re-fetch dispatch status once timer expires
          getDispatchStatus()
            .then((data) => {
              setDispatchData(data);
              setSecondsRemaining(data.seconds_until_cut_off);
            })
            .catch(() => {});
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsRemaining]);

  // 3. Load saved pincode from localStorage
  useEffect(() => {
    try {
      const savedPin = localStorage.getItem("tn78_delivery_pincode");
      if (savedPin && /^[1-9][0-9]{5}$/.test(savedPin)) {
        setPincode(savedPin);
        checkPincodeServiceability(savedPin)
          .then((res) => {
            setPincodeResult(res);
          })
          .catch(() => {
            localStorage.removeItem("tn78_delivery_pincode");
          });
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Handle pincode submit
  const handleCheckPincode = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pincode.trim();
    if (!/^[1-9][0-9]{5}$/.test(cleanPin)) {
      setPincodeError("Enter a valid 6-digit Indian PIN code");
      return;
    }

    setPincodeError(null);
    setPincodeLoading(true);

    try {
      const res = await checkPincodeServiceability(cleanPin);
      setPincodeResult(res);
      setIsEditingPincode(false);
      try {
        localStorage.setItem("tn78_delivery_pincode", cleanPin);
      } catch {}
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Delivery currently unserviceable to this PIN code.";
      setPincodeError(msg);
      setPincodeResult(null);
    } finally {
      setPincodeLoading(false);
    }
  };

  // Convert seconds remaining to HH, MM, SS
  const hours = secondsRemaining !== null ? Math.floor(secondsRemaining / 3600) : 0;
  const minutes = secondsRemaining !== null ? Math.floor((secondsRemaining % 3600) / 60) : 0;
  const seconds = secondsRemaining !== null ? secondsRemaining % 60 : 0;

  const hoursStr = String(hours).padStart(2, "0");
  const minsStr = String(minutes).padStart(2, "0");
  const secsStr = String(seconds).padStart(2, "0");

  const isSameDay = dispatchData?.is_same_day_dispatch_active ?? false;

  return (
    <div className="border border-[#232733] bg-[#13151C] rounded-sm p-4 my-5 space-y-4 shadow-card-dark">
      {/* Top Header & Live Beacon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#232733]">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            {isSameDay ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
              </>
            ) : (
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#E2C58A]"></span>
            )}
          </span>
          <span className="text-[11px] font-mono tracking-widest uppercase font-black text-white">
            {isSameDay ? "SAME-DAY DISPATCH ACTIVE" : "NEXT DISPATCH RUN QUEUED"}
          </span>
        </div>

        <span className="text-[10px] font-mono uppercase tracking-wider text-[#E2C58A] bg-[#1C202B] px-2 py-0.5 border border-[#E2C58A]/30 rounded-xs self-start sm:self-auto shadow-xs">
          Cut-Off: 4:00 PM IST
        </span>
      </div>

      {/* Countdown Timer Display */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-xs text-slate-300">
            {isSameDay ? (
              <>
                Order within the next <strong className="text-[#E2C58A] font-bold">countdown window</strong> for guaranteed dispatch today:
              </>
            ) : (
              <>
                Today's 4 PM cut-off reached. Orders placed now dispatch in:
              </>
            )}
          </p>
          <p className="text-[11px] text-[#E2C58A] font-medium mt-0.5 font-mono">
            {dispatchData?.dispatch_window_label || "Dispatches daily Mon–Sat via BlueDart Air"}
          </p>
        </div>

        {/* Digit boxes */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="bg-[#0A0B0E] text-white px-2.5 py-1 rounded-sm flex flex-col items-center min-w-[40px] border border-[#232733] shadow-xs">
            <span className="text-sm font-bold font-mono tracking-wider">{hoursStr}</span>
            <span className="text-[7.5px] text-slate-500 tracking-widest uppercase font-mono">HRS</span>
          </div>
          <span className="text-xs font-bold text-[#E2C58A]">:</span>
          <div className="bg-[#0A0B0E] text-white px-2.5 py-1 rounded-sm flex flex-col items-center min-w-[40px] border border-[#232733] shadow-xs">
            <span className="text-sm font-bold font-mono tracking-wider">{minsStr}</span>
            <span className="text-[7.5px] text-slate-500 tracking-widest uppercase font-mono">MINS</span>
          </div>
          <span className="text-xs font-bold text-[#E2C58A]">:</span>
          <div className="bg-[#0A0B0E] text-white px-2.5 py-1 rounded-sm flex flex-col items-center min-w-[40px] shadow-xs border border-[#E2C58A]/50">
            <span className="text-sm font-bold font-mono text-[#E2C58A] tracking-wider">{secsStr}</span>
            <span className="text-[7.5px] text-[#E2C58A]/70 tracking-widest uppercase font-mono">SECS</span>
          </div>
        </div>
      </div>

      {/* Delivery Estimate Banner */}
      <div className="bg-[#0A0B0E] border border-[#232733] rounded-sm p-2.5 text-xs flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-white">
          <svg className="w-4 h-4 text-[#E2C58A] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-[11.5px] text-slate-300">
            Estimated Delivery:{" "}
            <strong className="font-heading text-white font-bold">
              {pincodeResult?.estimated_delivery_date || dispatchData?.estimated_delivery_date || "2–3 Business Days"}
            </strong>
          </span>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-xs border border-emerald-500/30">
          BlueDart Express Air
        </span>
      </div>

      {/* Pincode & COD Serviceability Section */}
      <div className="pt-2 border-t border-[#232733]">
        {pincodeResult && !isEditingPincode ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs bg-[#0A0B0E] p-2.5 border border-[#232733] rounded-sm">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 font-medium text-white">
                <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>
                  Delivering to <strong className="font-mono text-[#E2C58A]">{pincodeResult.pincode}</strong> ({pincodeResult.city})
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-[10.5px] text-slate-400 pl-5">
                <span className="text-emerald-400 font-medium">✓ Priority Air ({pincodeResult.estimated_days})</span>
                <span>•</span>
                <span>⚡ 100% Prepaid (No COD)</span>
                <span>•</span>
                <span>✓ Free Delivery &ge; ₹2,000</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsEditingPincode(true)}
              className="text-[11px] font-mono uppercase text-[#E2C58A] hover:text-white underline underline-offset-2 self-start sm:self-auto shrink-0 transition-colors cursor-pointer"
            >
              Change
            </button>
          </div>
        ) : (
          <form onSubmit={handleCheckPincode} className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1 font-medium">
                <svg className="w-3.5 h-3.5 text-[#E2C58A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                VERIFY PINCODE DELIVERY:
              </span>
              {isEditingPincode && (
                <button
                  type="button"
                  onClick={() => setIsEditingPincode(false)}
                  className="text-slate-400 hover:text-white text-[10px] cursor-pointer"
                >
                  Cancel
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => {
                    setPincode(e.target.value.replace(/\D/g, ""));
                    if (pincodeError) setPincodeError(null);
                  }}
                  placeholder="Enter 6-digit Indian PIN Code"
                  className="w-full bg-[#0A0B0E] border border-[#232733] px-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-hidden focus:border-[#E2C58A] transition-colors rounded-xs"
                />
              </div>
              <button
                type="submit"
                disabled={pincodeLoading || pincode.length !== 6}
                className="bg-gradient-to-r from-[#E2C58A] to-[#C6A467] text-[#0A0B0E] font-heading font-black disabled:opacity-40 disabled:cursor-not-allowed text-xs uppercase tracking-wider px-4 py-2 rounded-xs transition-all shadow-glow-gold flex items-center justify-center min-w-[75px] cursor-pointer"
              >
                {pincodeLoading ? (
                  <span className="inline-block w-3 h-3 border-2 border-[#0A0B0E]/30 border-t-[#0A0B0E] rounded-full animate-spin"></span>
                ) : (
                  "Verify"
                )}
              </button>
            </div>

            <div className="text-[10.5px] font-mono text-slate-400 flex items-center justify-between pt-0.5">
              <span>⚡ Online Payment Only (UPI / Card)</span>
              <span className="text-red-400 font-semibold text-[9.5px]">Cash on Delivery Unavailable</span>
            </div>

            {pincodeError && (
              <p className="text-[11px] text-red-400 font-mono">
                {pincodeError}
              </p>
            )}
          </form>
        )}
      </div>

      {/* Dispatch Hub Guarantee Micro-footer */}
      <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1">
        <span>Hub: TN78 Central Hub (Madurai / Chennai)</span>
        <span>Free express delivery on orders ₹2,000+</span>
      </div>
    </div>
  );
}
