"use client";

import React, { useState, useEffect } from "react";

export interface CustomizationDetail {
  type: "monogram" | "hem";
  price: number;
  formattedNote: string;
}

interface CustomizationOptionsProps {
  category?: string;
  onCustomizationChange: (customization: CustomizationDetail | null) => void;
}

export const MONOGRAM_THREADS = [
  { id: "gold", name: "Champagne Gold", hex: "#D5C0A5" },
  { id: "copper", name: "Terracotta Copper", hex: "#9E6544" },
  { id: "charcoal", name: "Slate Charcoal", hex: "#2C2A29" },
  { id: "tonal", name: "Tonal Matching", hex: "#78716A" },
];

export const MONOGRAM_PLACEMENTS = [
  "Left Sleeve Cuff",
  "Chest Pocket Crest",
  "Lower Front Placket",
];

export const HEM_INSEAMS = [
  { id: "30", label: "High-Break Cropped (30″ Inseam)", adjustment: "-2″" },
  { id: "31", label: "Subtle Break (31″ Inseam)", adjustment: "-1″" },
  { id: "32", label: "Standard Finished (32″ Inseam)", adjustment: "Default" },
  { id: "34", label: "Tall Extension (34″ Inseam)", adjustment: "+2″" },
];

export const HEM_FINISHES = [
  "Clean Invisible Blind Hem",
  "Classic 1.5″ Turned Sartorial Cuff",
];

export function CustomizationOptions({
  category = "shirts",
  onCustomizationChange,
}: CustomizationOptionsProps) {
  const isBottom =
    category.toLowerCase().includes("pant") ||
    category.toLowerCase().includes("trouser") ||
    category.toLowerCase().includes("short") ||
    category.toLowerCase().includes("lower");

  const [isEnabled, setIsEnabled] = useState(false);

  // Top / Monogram States
  const [initials, setInitials] = useState("TN");
  const [selectedThread, setSelectedThread] = useState(MONOGRAM_THREADS[0]);
  const [selectedPlacement, setSelectedPlacement] = useState(MONOGRAM_PLACEMENTS[0]);
  const [fontStyle, setFontStyle] = useState<"serif" | "sans">("serif");

  // Bottom / Hem States
  const [selectedInseam, setSelectedInseam] = useState(HEM_INSEAMS[0]);
  const [selectedFinish, setSelectedFinish] = useState(HEM_FINISHES[0]);
  const [specialInstructions, setSpecialInstructions] = useState("");

  // Notify parent component whenever options change
  useEffect(() => {
    if (!isEnabled) {
      onCustomizationChange(null);
      return;
    }

    if (isBottom) {
      const parts = [
        `Inseam: ${selectedInseam.label}`,
        `Finish: ${selectedFinish}`,
      ];
      if (specialInstructions.trim()) {
        parts.push(`Note: ${specialInstructions.trim()}`);
      }
      onCustomizationChange({
        type: "hem",
        price: 150,
        formattedNote: `[Bespoke Hem Tailoring] ${parts.join(" · ")}`,
      });
    } else {
      const cleanInitials = initials.trim().toUpperCase() || "TN";
      const parts = [
        `Initials: ${cleanInitials}`,
        `Thread: ${selectedThread.name}`,
        `Placement: ${selectedPlacement}`,
        `Font: ${fontStyle === "serif" ? "Classic Serif" : "Minimalist Block"}`,
      ];
      onCustomizationChange({
        type: "monogram",
        price: 250,
        formattedNote: `[Bespoke Monogram] ${parts.join(" · ")}`,
      });
    }
  }, [
    isEnabled,
    isBottom,
    initials,
    selectedThread,
    selectedPlacement,
    fontStyle,
    selectedInseam,
    selectedFinish,
    specialInstructions,
    onCustomizationChange,
  ]);

  return (
    <div className="border border-[#232733] bg-[#13151C] p-4 rounded-sm space-y-3 transition-all shadow-card-dark">
      {/* Toggle Header */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={(e) => setIsEnabled(e.target.checked)}
            className="w-4 h-4 rounded-2xs border-[#232733] text-[#E2C58A] focus:ring-[#E2C58A] cursor-pointer accent-[#E2C58A]"
          />
          <div className="space-y-0.5">
            <span className="font-heading font-black text-xs uppercase tracking-wider text-white flex items-center gap-1.5">
              <span className="text-[#E2C58A]">✦</span>
              {isBottom
                ? "Add Custom Hem & Inseam Tailoring (+₹150)"
                : "Add Bespoke Handcrafted Monogram (+₹250)"}
            </span>
            <span className="text-[10px] font-mono text-slate-400 block">
              {isBottom
                ? "Precision hand-tailored break & finished cuff"
                : "Personalized embroidery by our master tailors"}
            </span>
          </div>
        </label>
        <span className="text-[11px] font-mono font-bold text-[#E2C58A] bg-[#1C202B] px-2.5 py-0.5 rounded-full border border-[#E2C58A]/30">
          {isBottom ? "+₹150" : "+₹250"}
        </span>
      </div>

      {/* Expanded Customization Form */}
      {isEnabled && (
        <div className="pt-3 border-t border-[#232733] space-y-4 animate-fadeIn">
          
          {/* ================= TOP / MONOGRAMGING FORM ================= */}
          {!isBottom ? (
            <div className="space-y-3.5">
              
              {/* Initials & Font Input */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-heading font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Initials (Max 3 Letters):
                  </label>
                  <input
                    type="text"
                    maxLength={3}
                    value={initials}
                    onChange={(e) => setInitials(e.target.value.toUpperCase())}
                    placeholder="e.g. R.I."
                    className="w-full text-sm font-mono tracking-widest uppercase p-2 bg-[#0A0B0E] border border-[#232733] rounded-xs text-white focus:border-[#E2C58A] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-heading font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Embroidery Font:
                  </label>
                  <div className="grid grid-cols-2 gap-1 bg-[#0A0B0E] p-1 border border-[#232733] rounded-xs">
                    <button
                      type="button"
                      onClick={() => setFontStyle("serif")}
                      className={`py-1 text-xs font-serif cursor-pointer ${fontStyle === "serif" ? "bg-gradient-to-r from-[#E2C58A] to-[#C6A467] text-[#0A0B0E] font-bold rounded-2xs shadow-xs" : "text-slate-400 hover:text-white"}`}
                    >
                      Classic Serif
                    </button>
                    <button
                      type="button"
                      onClick={() => setFontStyle("sans")}
                      className={`py-1 text-xs font-heading font-bold cursor-pointer ${fontStyle === "sans" ? "bg-gradient-to-r from-[#E2C58A] to-[#C6A467] text-[#0A0B0E] font-black rounded-2xs shadow-xs" : "text-slate-400 hover:text-white"}`}
                    >
                      Minimal
                    </button>
                  </div>
                </div>
              </div>

              {/* Thread Color Swatches */}
              <div>
                <label className="text-[10px] font-heading font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Embroidery Thread Color: <span className="text-[#E2C58A]">{selectedThread.name}</span>
                </label>
                <div className="flex items-center gap-2">
                  {MONOGRAM_THREADS.map((thread) => {
                    const isSelected = selectedThread.id === thread.id;
                    return (
                      <button
                        key={thread.id}
                        type="button"
                        onClick={() => setSelectedThread(thread)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xs border text-[10px] font-mono transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#1C202B] border-[#E2C58A] ring-1 ring-[#E2C58A] font-bold text-white shadow-glow-gold"
                            : "bg-[#0A0B0E] border-[#232733] text-slate-400 hover:border-[#E2C58A]/50 hover:text-white"
                        }`}
                      >
                        <span
                          className="w-3 h-3 rounded-full border border-white/20 inline-block"
                          style={{ backgroundColor: thread.hex }}
                        />
                        <span>{thread.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Placement Selector */}
              <div>
                <label className="text-[10px] font-heading font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Embroidery Placement:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {MONOGRAM_PLACEMENTS.map((placement) => {
                    const isSelected = selectedPlacement === placement;
                    return (
                      <button
                        key={placement}
                        type="button"
                        onClick={() => setSelectedPlacement(placement)}
                        className={`p-1.5 text-[10px] font-mono border rounded-xs transition-all text-center cursor-pointer ${
                          isSelected
                            ? "bg-gradient-to-r from-[#E2C58A] to-[#C6A467] text-[#0A0B0E] font-bold border-[#E2C58A]"
                            : "bg-[#0A0B0E] text-slate-300 border-[#232733] hover:border-[#E2C58A]/50"
                        }`}
                      >
                        {placement}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Monogram Live Preview Swatch */}
              <div className="p-3 bg-[#0A0B0E] border border-[#232733] rounded-xs flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-mono text-slate-500 block">
                    LIVE EMBROIDERY PREVIEW
                  </span>
                  <span className="text-[10px] font-mono text-slate-300 mt-0.5 block">
                    {selectedPlacement} &bull; {selectedThread.name}
                  </span>
                </div>
                <div
                  className={`px-4 py-2 bg-[#13151C] border border-[#232733] rounded-xs text-xl tracking-[0.2em] font-bold shadow-2xs ${
                    fontStyle === "serif" ? "font-serif italic" : "font-heading font-black"
                  }`}
                  style={{ color: selectedThread.hex }}
                >
                  {initials.trim().toUpperCase() || "TN"}
                </div>
              </div>
            </div>
          ) : (
            /* ================= BOTTOM / HEMMING FORM ================= */
            <div className="space-y-3.5">
              {/* Inseam Length Selector */}
              <div>
                <label className="text-[10px] font-heading font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Select Inseam Length:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {HEM_INSEAMS.map((inseam) => {
                    const isSelected = selectedInseam.id === inseam.id;
                    return (
                      <button
                        key={inseam.id}
                        type="button"
                        onClick={() => setSelectedInseam(inseam)}
                        className={`p-2 text-left border rounded-xs transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#1C202B] border-[#E2C58A] ring-1 ring-[#E2C58A] font-semibold text-white shadow-glow-gold"
                            : "bg-[#0A0B0E] border-[#232733] text-slate-400 hover:border-[#E2C58A]/50"
                        }`}
                      >
                        <div className="text-[11px] font-mono text-white font-bold">
                          {inseam.label}
                        </div>
                        <span className="text-[9px] font-mono text-[#E2C58A]">
                          {inseam.adjustment} adjustment
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Cuff Finish Style */}
              <div>
                <label className="text-[10px] font-heading font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Cuff & Hem Finish:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {HEM_FINISHES.map((finish) => {
                    const isSelected = selectedFinish === finish;
                    return (
                      <button
                        key={finish}
                        type="button"
                        onClick={() => setSelectedFinish(finish)}
                        className={`p-2 text-[10px] font-mono border rounded-xs transition-all text-center cursor-pointer ${
                          isSelected
                            ? "bg-gradient-to-r from-[#E2C58A] to-[#C6A467] text-[#0A0B0E] font-bold border-[#E2C58A]"
                            : "bg-[#0A0B0E] text-slate-300 border-[#232733] hover:border-[#E2C58A]/50"
                        }`}
                      >
                        {finish}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Optional tailoring instructions */}
              <div>
                <label className="text-[10px] font-heading font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Specific Tailoring Notes (Optional):
                </label>
                <input
                  type="text"
                  maxLength={100}
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g. Leave 1 inch internal hem allowance for future let-out"
                  className="w-full text-xs font-body p-2 bg-[#0A0B0E] border border-[#232733] rounded-xs text-white focus:border-[#E2C58A] focus:outline-hidden"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CustomizationOptions;
