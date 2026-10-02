"use client";

import React, { useState, useEffect } from "react";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: string;
}

export default function SizeGuideModal({ isOpen, onClose, category = "tops" }: SizeGuideModalProps) {
  const [unit, setUnit] = useState<"in" | "cm">("in");
  const isBottom =
    category.toLowerCase().includes("pant") ||
    category.toLowerCase().includes("trouser") ||
    category.toLowerCase().includes("short") ||
    category.toLowerCase().includes("lower");

  const [activeTab, setActiveTab] = useState<"tops" | "bottoms">(isBottom ? "bottoms" : "tops");

  useEffect(() => {
    setActiveTab(isBottom ? "bottoms" : "tops");
  }, [isBottom]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const topsData = [
    { size: "S", chestIn: "38 - 40", chestCm: "96 - 101", shoulderIn: "17.5", shoulderCm: "44.5", lengthIn: "27.5", lengthCm: "70" },
    { size: "M", chestIn: "41 - 43", chestCm: "104 - 109", shoulderIn: "18.5", shoulderCm: "47", lengthIn: "28.5", lengthCm: "72.5" },
    { size: "L", chestIn: "44 - 46", chestCm: "111 - 117", shoulderIn: "19.5", shoulderCm: "49.5", lengthIn: "29.5", lengthCm: "75" },
    { size: "XL", chestIn: "47 - 49", chestCm: "119 - 124", shoulderIn: "20.5", shoulderCm: "52", lengthIn: "30.5", lengthCm: "77.5" },
    { size: "XXL", chestIn: "50 - 52", chestCm: "127 - 132", shoulderIn: "21.5", shoulderCm: "54.5", lengthIn: "31.5", lengthCm: "80" },
  ];

  const bottomsData = [
    { size: "S (30)", waistIn: "30 - 31", waistCm: "76 - 79", hipIn: "39", hipCm: "99", lengthIn: "39.5", lengthCm: "100" },
    { size: "M (32)", waistIn: "32 - 33", waistCm: "81 - 84", hipIn: "41", hipCm: "104", lengthIn: "40.5", lengthCm: "103" },
    { size: "L (34)", waistIn: "34 - 35", waistCm: "86 - 89", hipIn: "43", hipCm: "109", lengthIn: "41.5", lengthCm: "105.5" },
    { size: "XL (36)", waistIn: "36 - 37", waistCm: "91 - 94", hipIn: "45", hipCm: "114", lengthIn: "42", lengthCm: "107" },
    { size: "XXL (38)", waistIn: "38 - 40", waistCm: "96 - 101", hipIn: "47", hipCm: "119", lengthIn: "42.5", lengthCm: "108" },
  ];

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="size-guide-modal-title"
    >
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4 sm:p-6 text-center">
        <div className="relative transform overflow-hidden rounded-sm bg-[#13151C] text-left align-middle shadow-2xl transition-all w-full max-w-2xl border border-[#232733]">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#232733] bg-[#0A0B0E]">
            <div>
              <span className="text-[10px] tracking-widest uppercase font-mono text-[#E2C58A]">
                PERFECT FIT STANDARD
              </span>
              <h2
                id="size-guide-modal-title"
                className="font-heading font-black text-lg uppercase tracking-wider text-white"
              >
                SIZE &amp; FIT GUIDE
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-[#1C202B] transition-colors cursor-pointer"
              aria-label="Close size guide"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Controls: Type Tabs & Units Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#232733] pb-4">
              {/* Category selector */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("tops")}
                  className={`px-4 py-1.5 text-xs uppercase tracking-wider font-mono font-bold rounded-full transition-all cursor-pointer ${
                    activeTab === "tops"
                      ? "bg-gradient-to-r from-[#E2C58A] to-[#C6A467] text-[#0A0B0E] shadow-glow-gold"
                      : "bg-[#0A0B0E] border border-[#232733] text-slate-400 hover:text-white"
                  }`}
                >
                  Tops &amp; Overshirts
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("bottoms")}
                  className={`px-4 py-1.5 text-xs uppercase tracking-wider font-mono font-bold rounded-full transition-all cursor-pointer ${
                    activeTab === "bottoms"
                      ? "bg-gradient-to-r from-[#E2C58A] to-[#C6A467] text-[#0A0B0E] shadow-glow-gold"
                      : "bg-[#0A0B0E] border border-[#232733] text-slate-400 hover:text-white"
                  }`}
                >
                  Trousers &amp; Lowers
                </button>
              </div>

              {/* Unit Toggle */}
              <div className="flex items-center gap-1 bg-[#0A0B0E] border border-[#232733] p-1 rounded-full w-fit">
                <button
                  type="button"
                  onClick={() => setUnit("in")}
                  className={`px-3 py-1 text-xs font-mono font-bold rounded-full transition-all cursor-pointer ${
                    unit === "in"
                      ? "bg-[#1C202B] text-[#E2C58A] shadow-xs"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Inches (in)
                </button>
                <button
                  type="button"
                  onClick={() => setUnit("cm")}
                  className={`px-3 py-1 text-xs font-mono font-bold rounded-full transition-all cursor-pointer ${
                    unit === "cm"
                      ? "bg-[#1C202B] text-[#E2C58A] shadow-xs"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Centimeters (cm)
                </button>
              </div>
            </div>

            {/* Measurement Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#232733] font-mono text-[11px] text-slate-400 uppercase tracking-wider">
                    <th className="py-2.5 px-3 font-black text-white">Size</th>
                    <th className="py-2.5 px-3">{activeTab === "tops" ? "Chest" : "Waist"}</th>
                    <th className="py-2.5 px-3">{activeTab === "tops" ? "Shoulder" : "Hips"}</th>
                    <th className="py-2.5 px-3">Length</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#232733] font-mono">
                  {activeTab === "tops"
                    ? topsData.map((row) => (
                        <tr key={row.size} className="hover:bg-[#1C202B]/50 transition-colors">
                          <td className="py-3 px-3 font-bold text-[#E2C58A]">{row.size}</td>
                          <td className="py-3 px-3 text-slate-300">{unit === "in" ? `${row.chestIn}"` : `${row.chestCm} cm`}</td>
                          <td className="py-3 px-3 text-slate-300">{unit === "in" ? `${row.shoulderIn}"` : `${row.shoulderCm} cm`}</td>
                          <td className="py-3 px-3 text-slate-300">{unit === "in" ? `${row.lengthIn}"` : `${row.lengthCm} cm`}</td>
                        </tr>
                      ))
                    : bottomsData.map((row) => (
                        <tr key={row.size} className="hover:bg-[#1C202B]/50 transition-colors">
                          <td className="py-3 px-3 font-bold text-[#E2C58A]">{row.size}</td>
                          <td className="py-3 px-3 text-slate-300">{unit === "in" ? `${row.waistIn}"` : `${row.waistCm} cm`}</td>
                          <td className="py-3 px-3 text-slate-300">{unit === "in" ? `${row.hipIn}"` : `${row.hipCm} cm`}</td>
                          <td className="py-3 px-3 text-slate-300">{unit === "in" ? `${row.lengthIn}"` : `${row.lengthCm} cm`}</td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>

            {/* Editorial Fit Notes */}
            <div className="bg-[#0A0B0E] p-4 rounded-sm border border-[#232733] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E2C58A] font-mono">
                <span>✦ Signature Cut &amp; Silhouette</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                TN78 garments feature an intentional relaxed drape with subtle dropped shoulder construction.
                If you prefer a closer, tailored fit, we recommend ordering one size smaller than your usual measurement.
              </p>
              <p className="text-[11px] text-slate-500 font-mono">
                Model reference: 6&apos;1&quot; (185cm) tall, 38&quot; chest, wearing size L for an editorial drape.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-[#232733] bg-[#0A0B0E] flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gradient-to-r from-[#E2C58A] to-[#C6A467] text-[#0A0B0E] font-heading font-black text-xs uppercase tracking-widest px-7 py-2.5 rounded-full transition-all shadow-glow-gold btn-shimmer cursor-pointer"
            >
              GOT IT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
