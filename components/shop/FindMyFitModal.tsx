"use client";

import React, { useState, useEffect, useMemo } from "react";

interface FindMyFitModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: string;
  productName?: string;
  availableSizes?: string[];
  onSelectSize: (size: string) => void;
}

export type HeightUnit = "cm" | "ft";
export type WeightUnit = "kg" | "lbs";
export type FitPreference = "slim" | "regular" | "oversized";
export type BuildType = "slender" | "athletic" | "broad";

export default function FindMyFitModal({
  isOpen,
  onClose,
  category = "tops",
  productName = "this garment",
  availableSizes = ["S", "M", "L", "XL"],
  onSelectSize,
}: FindMyFitModalProps) {
  // Stepper state: 1 = Anatomy, 2 = Fit Preference, 3 = Result
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Unit selections
  const [heightUnit, setHeightUnit] = useState<HeightUnit>("cm");
  const [weightUnit, setWeightUnit] = useState<WeightUnit>("kg");

  // Step 1: Measurements
  const [heightCm, setHeightCm] = useState<number>(176);
  const [weightKg, setWeightKg] = useState<number>(72);

  // Step 2: Preferences
  const [fitPreference, setFitPreference] = useState<FitPreference>("regular");
  const [buildType, setBuildType] = useState<BuildType>("athletic");

  const isBottom =
    category.toLowerCase().includes("pant") ||
    category.toLowerCase().includes("trouser") ||
    category.toLowerCase().includes("short") ||
    category.toLowerCase().includes("lower");

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Load saved profile if available
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("tn78_user_fit_profile");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.heightCm) setHeightCm(parsed.heightCm);
          if (parsed.weightKg) setWeightKg(parsed.weightKg);
          if (parsed.fitPreference) setFitPreference(parsed.fitPreference);
          if (parsed.buildType) setBuildType(parsed.buildType);
        }
      } catch {
        // Ignore localStorage parse errors
      }
    }
  }, []);

  // Compute recommended size algorithm
  const recommendation = useMemo(() => {
    // Body Mass Index proxy
    const hMeters = heightCm / 100;
    const bmi = weightKg / (hMeters * hMeters);

    let baseSize = "M";
    let estimatedChest = "40″ - 41″";
    let estimatedWaist = "32″ - 33″";
    let confidence = 95;

    if (heightCm < 170 && weightKg < 64) {
      baseSize = "S";
      estimatedChest = "38″ - 39″";
      estimatedWaist = "30″ - 31″";
      confidence = 94;
    } else if (heightCm <= 178 && weightKg <= 75) {
      baseSize = "M";
      estimatedChest = "40″ - 42″";
      estimatedWaist = "32″ - 33″";
      confidence = 96;
    } else if (heightCm <= 186 && weightKg <= 86) {
      baseSize = "L";
      estimatedChest = "43″ - 45″";
      estimatedWaist = "34″ - 35″";
      confidence = 95;
    } else {
      baseSize = "XL";
      estimatedChest = "46″ - 48″";
      estimatedWaist = "36″ - 38″";
      confidence = 93;
    }

    // Adjust according to Fit Preference
    if (fitPreference === "oversized") {
      if (baseSize === "S") baseSize = "M";
      else if (baseSize === "M") baseSize = "L";
      else if (baseSize === "L") baseSize = "XL";
      confidence = Math.min(98, confidence + 2);
    } else if (fitPreference === "slim" && bmi < 24) {
      if (baseSize === "XL") baseSize = "L";
      else if (baseSize === "L") baseSize = "M";
      confidence = Math.min(97, confidence + 1);
    }

    // Adjust for broad build
    if (buildType === "broad" && baseSize === "M" && weightKg > 73) {
      baseSize = "L";
    }

    // Fallback if calculated size is not in garment variants
    const validSizes = availableSizes.length > 0 ? availableSizes : ["S", "M", "L", "XL"];
    const finalSize = validSizes.includes(baseSize) ? baseSize : validSizes[0];

    const fitNotes =
      fitPreference === "oversized"
        ? `We recommend Size ${finalSize} to give you our signature drop-shoulder, architectural silhouette with relaxed ease across the chest and torso.`
        : fitPreference === "slim"
        ? `Size ${finalSize} will provide a razor-sharp tailored contour, sitting close to your natural lines without restricting armhole movement.`
        : `Size ${finalSize} strikes the quintessential TN78 balance: tailored clean shoulders with effortless room for natural drape and breathability.`;

    return {
      size: finalSize,
      confidence,
      estimatedChest,
      estimatedWaist,
      fitNotes,
    };
  }, [heightCm, weightKg, fitPreference, buildType, availableSizes]);

  if (!isOpen) return null;

  const handleApplyRecommendation = () => {
    // Save profile to local storage for future recommendations
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(
          "tn78_user_fit_profile",
          JSON.stringify({
            heightCm,
            weightKg,
            fitPreference,
            buildType,
            recommendedSize: recommendation.size,
          })
        );
      } catch {
        // Ignore storage errors
      }
    }

    onSelectSize(recommendation.size);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="find-my-fit-title"
    >
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />

        <div className="relative inline-block w-full max-w-lg p-6 sm:p-8 my-8 overflow-hidden text-left align-middle bg-[#13151C] border border-[#232733] shadow-2xl rounded-sm z-10 transition-all text-white">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#232733]">
            <div>
              <span className="text-[10px] font-heading font-black uppercase tracking-[0.2em] text-[#E2C58A] block">
                SMART MEASUREMENT LAB
              </span>
              <h3
                id="find-my-fit-title"
                className="font-heading font-black text-lg sm:text-xl text-white mt-0.5"
              >
                FIND MY FIT &bull; SMART RECOMMENDER
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-[#1C202B] cursor-pointer"
              aria-label="Close size recommender"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Stepper Dots Bar */}
          <div className="py-3 flex items-center justify-between border-b border-[#232733] text-xs font-mono text-slate-400">
            <span className={step === 1 ? "text-[#E2C58A] font-bold" : ""}>
              01. Body Metrics
            </span>
            <span>&bull;</span>
            <span className={step === 2 ? "text-[#E2C58A] font-bold" : ""}>
              02. Silhouette Drape
            </span>
            <span>&bull;</span>
            <span className={step === 3 ? "text-[#E2C58A] font-bold" : ""}>
              03. Fit Result
            </span>
          </div>

          {/* ================================================================= */}
          {/* STEP 1: BODY ANATOMY (HEIGHT & WEIGHT)                            */}
          {/* ================================================================= */}
          {step === 1 && (
            <div className="py-6 space-y-6">
              <p className="text-xs text-slate-400 font-serif italic">
                Input your height and weight. Our proprietary sizing model calibrates your proportions against hand-tailored TN78 master blocks.
              </p>

              {/* Height Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-heading font-black uppercase tracking-wider text-white">
                    Height: <span className="font-mono text-[#E2C58A]">{heightCm} cm</span>
                    {heightUnit === "ft" && (
                      <span className="text-[10px] text-slate-400 ml-1.5 font-mono">
                        ({Math.floor(heightCm / 30.48)}&prime; {Math.round((heightCm % 30.48) / 2.54)}&Prime;)
                      </span>
                    )}
                  </label>
                  <div className="inline-flex rounded-xs border border-[#232733] p-0.5 bg-[#0A0B0E] text-[10px] font-mono">
                    <button
                      type="button"
                      onClick={() => setHeightUnit("cm")}
                      className={`px-2 py-0.5 rounded-2xs cursor-pointer ${heightUnit === "cm" ? "bg-[#1C202B] text-[#E2C58A] font-bold" : "text-slate-400"}`}
                    >
                      CM
                    </button>
                    <button
                      type="button"
                      onClick={() => setHeightUnit("ft")}
                      className={`px-2 py-0.5 rounded-2xs cursor-pointer ${heightUnit === "ft" ? "bg-[#1C202B] text-[#E2C58A] font-bold" : "text-slate-400"}`}
                    >
                      FT/IN
                    </button>
                  </div>
                </div>
                <input
                  type="range"
                  min={150}
                  max={205}
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#232733] rounded-lg appearance-none cursor-pointer accent-[#E2C58A]"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>150 cm (4&prime;11&Prime;)</span>
                  <span>175 cm (5&prime;9&Prime;)</span>
                  <span>205 cm (6&prime;9&Prime;)</span>
                </div>
              </div>

              {/* Weight Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-heading font-black uppercase tracking-wider text-white">
                    Weight: <span className="font-mono text-[#E2C58A]">{weightKg} kg</span>
                    {weightUnit === "lbs" && (
                      <span className="text-[10px] text-slate-400 ml-1.5 font-mono">
                        ({Math.round(weightKg * 2.20462)} lbs)
                      </span>
                    )}
                  </label>
                  <div className="inline-flex rounded-xs border border-[#232733] p-0.5 bg-[#0A0B0E] text-[10px] font-mono">
                    <button
                      type="button"
                      onClick={() => setWeightUnit("kg")}
                      className={`px-2 py-0.5 rounded-2xs cursor-pointer ${weightUnit === "kg" ? "bg-[#1C202B] text-[#E2C58A] font-bold" : "text-slate-400"}`}
                    >
                      KG
                    </button>
                    <button
                      type="button"
                      onClick={() => setWeightUnit("lbs")}
                      className={`px-2 py-0.5 rounded-2xs cursor-pointer ${weightUnit === "lbs" ? "bg-[#1C202B] text-[#E2C58A] font-bold" : "text-slate-400"}`}
                    >
                      LBS
                    </button>
                  </div>
                </div>
                <input
                  type="range"
                  min={45}
                  max={130}
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#232733] rounded-lg appearance-none cursor-pointer accent-[#E2C58A]"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>45 kg</span>
                  <span>75 kg</span>
                  <span>130 kg</span>
                </div>
              </div>

              {/* Next Button */}
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full py-3.5 bg-gradient-to-r from-[#E2C58A] to-[#C6A467] text-[#0A0B0E] font-heading text-xs font-black uppercase tracking-[0.2em] rounded-full transition-all shadow-glow-gold flex items-center justify-center gap-2 cursor-pointer btn-shimmer"
              >
                <span>CONTINUE TO SILHOUETTE PREFERENCES</span>
                <span>&rarr;</span>
              </button>
            </div>
          )}

          {/* ================================================================= */}
          {/* STEP 2: FIT PREFERENCES & BUILD                                   */}
          {/* ================================================================= */}
          {step === 2 && (
            <div className="py-6 space-y-6">
              
              {/* Silhouette Preference */}
              <div className="space-y-2.5">
                <label className="text-xs font-heading font-black uppercase tracking-wider text-white block">
                  How do you prefer your garments to drape?
                </label>
                <div className="grid grid-cols-1 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setFitPreference("slim")}
                    className={`p-3 text-left border rounded-sm transition-all cursor-pointer ${
                      fitPreference === "slim"
                        ? "bg-[#1C202B] border-[#E2C58A] ring-1 ring-[#E2C58A]/50 shadow-glow-gold"
                        : "bg-[#0A0B0E] border-[#232733] hover:border-[#E2C58A]/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-heading font-black text-xs uppercase text-white">
                        Tailored Slim Silhouette
                      </span>
                      {fitPreference === "slim" && (
                        <span className="w-2 h-2 rounded-full bg-[#E2C58A]" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 font-body mt-0.5">
                      Closer to the torso and shoulders, creating a sharp defined line.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFitPreference("regular")}
                    className={`p-3 text-left border rounded-sm transition-all cursor-pointer ${
                      fitPreference === "regular"
                        ? "bg-[#1C202B] border-[#E2C58A] ring-1 ring-[#E2C58A]/50 shadow-glow-gold"
                        : "bg-[#0A0B0E] border-[#232733] hover:border-[#E2C58A]/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-heading font-black text-xs uppercase text-white flex items-center gap-1.5">
                        <span>Classic Relaxed Fit</span>
                        <span className="text-[9px] font-mono bg-[#1C202B] text-[#E2C58A] border border-[#E2C58A]/30 px-1.5 py-0.2 rounded-2xs">
                          RECOMMENDED
                        </span>
                      </span>
                      {fitPreference === "regular" && (
                        <span className="w-2 h-2 rounded-full bg-[#E2C58A]" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 font-body mt-0.5">
                      The signature TN78 architectural cut with ease through the chest, waist, and sleeves.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFitPreference("oversized")}
                    className={`p-3 text-left border rounded-sm transition-all cursor-pointer ${
                      fitPreference === "oversized"
                        ? "bg-[#1C202B] border-[#E2C58A] ring-1 ring-[#E2C58A]/50 shadow-glow-gold"
                        : "bg-[#0A0B0E] border-[#232733] hover:border-[#E2C58A]/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-heading font-black text-xs uppercase text-white">
                        Modern Boxy / Oversized
                      </span>
                      {fitPreference === "oversized" && (
                        <span className="w-2 h-2 rounded-full bg-[#E2C58A]" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 font-body mt-0.5">
                      Relaxed drop-shoulder proportions with generous volume for statement streetwear luxury.
                    </p>
                  </button>
                </div>
              </div>

              {/* Build Type */}
              <div className="space-y-2">
                <label className="text-xs font-heading font-black uppercase tracking-wider text-white block">
                  Body Structure / Frame:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["slender", "athletic", "broad"] as BuildType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setBuildType(type)}
                      className={`py-2 text-xs font-mono font-bold uppercase border rounded-xs transition-all cursor-pointer ${
                        buildType === type
                          ? "bg-gradient-to-r from-[#E2C58A] to-[#C6A467] text-[#0A0B0E] border-[#E2C58A] shadow-glow-gold"
                          : "bg-[#0A0B0E] text-slate-300 border-[#232733] hover:border-[#E2C58A]/50"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-3 border border-[#232733] bg-[#0A0B0E] text-slate-300 font-heading text-xs font-bold uppercase tracking-wider rounded-full hover:border-[#E2C58A] hover:text-white transition-colors cursor-pointer"
                >
                  &larr; BACK
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="w-2/3 py-3 bg-gradient-to-r from-[#E2C58A] to-[#C6A467] text-[#0A0B0E] font-heading text-xs font-black uppercase tracking-[0.16em] rounded-full transition-all shadow-glow-gold flex items-center justify-center gap-2 cursor-pointer btn-shimmer"
                >
                  <span>CALIBRATE FIT</span>
                  <span>&rarr;</span>
                </button>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* STEP 3: PREDICTIVE RECOMMENDATION RESULT                          */}
          {/* ================================================================= */}
          {step === 3 && (
            <div className="py-6 space-y-6">
              
              {/* Recommendation Hero Box */}
              <div className="p-6 bg-[#0A0B0E] border border-[#E2C58A]/60 rounded-sm text-center space-y-3 shadow-card-dark relative overflow-hidden">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{recommendation.confidence}% FIT MATCH CONFIDENCE</span>
                </div>

                <div>
                  <span className="text-[10px] font-heading font-black uppercase tracking-widest text-[#E2C58A] block">
                    RECOMMENDED SIZE
                  </span>
                  <span className="font-heading text-5xl font-black text-white tracking-tight mt-1 inline-block">
                    SIZE {recommendation.size}
                  </span>
                </div>

                <p className="text-xs text-slate-300 font-body leading-relaxed max-w-sm mx-auto">
                  {recommendation.fitNotes}
                </p>

                {/* Estimated Body Metrics Match */}
                <div className="pt-3 border-t border-[#232733] grid grid-cols-2 gap-4 text-xs font-mono">
                  <div className="text-center">
                    <span className="text-[10px] text-slate-500 uppercase block">
                      {isBottom ? "WAIST FIT" : "CHEST FIT"}
                    </span>
                    <span className="font-bold text-white">
                      {isBottom ? recommendation.estimatedWaist : recommendation.estimatedChest}
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] text-slate-500 uppercase block">
                      SILHOUETTE
                    </span>
                    <span className="font-bold text-[#E2C58A] uppercase">
                      {fitPreference}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={handleApplyRecommendation}
                  className="w-full py-4 bg-gradient-to-r from-[#E2C58A] to-[#C6A467] text-[#0A0B0E] font-heading text-xs font-black uppercase tracking-[0.2em] rounded-full transition-all shadow-glow-gold flex items-center justify-center gap-2 cursor-pointer btn-shimmer"
                >
                  <span>APPLY SIZE {recommendation.size} &bull; CONTINUE SHOPPING</span>
                  <span>&rarr;</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full py-2.5 text-xs font-mono text-slate-400 hover:text-[#E2C58A] transition-colors text-center cursor-pointer"
                >
                  Adjust My Height / Weight Measurements
                </button>
              </div>

              {/* Guarantee Note */}
              <div className="p-3 bg-[#0A0B0E] border border-[#232733] rounded-xs text-[10px] font-mono text-slate-400 flex items-center justify-center gap-4">
                <span>✦ 7-Day Free Size Exchange</span>
                <span>✦ Master Tailored Cut</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
