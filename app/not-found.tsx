import React from "react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Page Not Found | TN78 Men's Collection",
  description: "The requested editorial menswear page could not be located.",
};

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-[#0A0B0E] text-[#F8FAFC] px-4 py-16">
      <div className="max-w-lg w-full text-center space-y-6 bg-[#13151C] border border-[#232733] p-8 md:p-12 rounded-2xl shadow-2xl">
        <span className="text-6xl md:text-8xl font-heading font-black tracking-tight text-[#E2C58A] select-none block">
          404
        </span>

        <div className="space-y-2">
          <span className="text-[10px] font-heading font-black tracking-widest uppercase text-slate-400">
            PIECE OR PAGE NOT FOUND
          </span>
          <h1 className="font-heading font-black text-2xl sm:text-3xl uppercase tracking-wider text-[#F8FAFC]">
            OUT OF RANGE
          </h1>
          <p className="text-xs font-body text-[#94A3B8] leading-relaxed max-w-sm mx-auto">
            The destination you requested does not exist or may have been transitioned to an archival release.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-7 py-3.5 bg-gradient-to-r from-[#E2C58A] to-[#C6A467] text-[#0A0B0E] font-heading text-xs font-black uppercase tracking-widest rounded-full hover:brightness-110 transition-all inline-block shadow-[0_0_20px_rgba(226,197,138,0.2)]"
          >
            DISCOVER THE ATELIER
          </Link>
          <Link
            href="/shop"
            className="px-7 py-3.5 bg-[#0A0B0E] border border-[#232733] text-[#F8FAFC] hover:border-[#E2C58A] font-heading text-xs uppercase tracking-widest rounded-full transition-colors inline-block"
          >
            VIEW ALL COLLECTIONS
          </Link>
        </div>
      </div>
    </div>
  );
}
