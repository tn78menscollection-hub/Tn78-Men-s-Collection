"use client";

import React, { useEffect } from "react";
import Link from "next/link";

interface RootErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function RootError({ error, reset }: RootErrorProps) {
  useEffect(() => {
    console.error("[TN78 Application Error]:", error);
  }, [error]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-[#0A0B0E] text-[#F8FAFC] px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6 bg-[#13151C] border border-[#232733] p-8 md:p-10 rounded-2xl shadow-2xl">
        <div className="w-14 h-14 mx-auto rounded-full bg-red-950/60 border border-red-500/40 flex items-center justify-center text-red-400">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-heading font-black tracking-widest uppercase text-[#E2C58A]">
            ANOMALY DETECTED
          </span>
          <h2 className="font-heading font-black text-xl uppercase tracking-wider text-[#F8FAFC]">
            SOMETHING WENT WRONG
          </h2>
          <p className="text-xs font-body text-[#94A3B8] leading-relaxed">
            An unexpected error occurred while rendering this page. Our atelier service has logged the event.
          </p>
          {error.digest && (
            <p className="text-[10px] font-mono text-slate-500">
              Reference: {error.digest}
            </p>
          )}
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="px-6 py-3 bg-gradient-to-r from-[#E2C58A] to-[#C6A467] text-[#0A0B0E] font-heading text-xs font-black uppercase tracking-widest rounded-full hover:brightness-110 transition-all cursor-pointer shadow-sm"
          >
            TRY AGAIN
          </button>
          <Link
            href="/"
            className="px-6 py-3 bg-[#0A0B0E] border border-[#232733] text-[#F8FAFC] hover:border-[#E2C58A] font-heading text-xs uppercase tracking-widest rounded-full transition-colors inline-block"
          >
            RETURN HOME
          </Link>
        </div>
      </div>
    </div>
  );
}
