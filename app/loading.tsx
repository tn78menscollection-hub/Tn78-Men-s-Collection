import React from "react";

export default function RootLoading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#0A0B0E] text-[#F8FAFC] px-4">
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-2 border-[#232733] border-t-[#E2C58A] animate-spin" />
        <span className="absolute text-[10px] font-heading font-black tracking-widest text-[#E2C58A]">
          TN78
        </span>
      </div>
      <p className="mt-5 text-[11px] font-heading font-bold uppercase tracking-[0.25em] text-[#94A3B8] animate-pulse">
        LOADING ATELIER SYSTEM...
      </p>
    </div>
  );
}
