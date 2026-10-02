"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartWishlist } from "@/lib/cartWishlistContext";
import { getProductBySlug } from "@/lib/api";

export interface OutfitPiece {
  id: string;
  name: string;
  slug: string;
  role: string;
  category: string;
  basePrice: number;
  mrp?: number;
  imageUrl: string;
  fabric: string;
  colorName: string;
  colorHex: string;
  variants: { id: string; size: string; price: number }[];
}

export interface OutfitPreset {
  id: string;
  name: string;
  tagline: string;
  topSlug: string;
  bottomSlug: string;
}

// Built-in curated catalog mapping to live DB products & variants
export const CURATED_TOPS: OutfitPiece[] = [
  {
    id: "top-pure-linen",
    name: "PURE LINEN SHIRT",
    slug: "pure-linen-shirt",
    role: "THE SHIRT / UPPER",
    category: "SHIRTS",
    basePrice: 1499,
    mrp: 2499,
    imageUrl: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=700&q=80",
    fabric: "100% French Slub Flax Linen",
    colorName: "Midnight Black",
    colorHex: "#1A1816",
    variants: [
      { id: "var-top-linen-s", size: "S", price: 1499 },
      { id: "var-top-linen-m", size: "M", price: 1499 },
      { id: "var-top-linen-l", size: "L", price: 1499 },
      { id: "var-top-linen-xl", size: "XL", price: 1499 },
    ],
  },
  {
    id: "top-classic-cotton",
    name: "CLASSIC COTTON SHIRT",
    slug: "classic-cotton-shirt",
    role: "THE CLASSIC SHIRT",
    category: "SHIRTS",
    basePrice: 899,
    mrp: 1499,
    imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=700&q=80",
    fabric: "Combed Long-Staple Cotton",
    colorName: "Navy Blue",
    colorHex: "#1B2A4A",
    variants: [
      { id: "var-top-cotton-s", size: "S", price: 899 },
      { id: "var-top-cotton-m", size: "M", price: 899 },
      { id: "var-top-cotton-l", size: "L", price: 899 },
      { id: "var-top-cotton-xl", size: "XL", price: 899 },
    ],
  },
  {
    id: "top-oversized-baggy",
    name: "OVERSIZED BAGGY SHIRT",
    slug: "oversized-baggy-shirt",
    role: "THE STREETWEAR SHIRT",
    category: "SHIRTS",
    basePrice: 1199,
    mrp: 1899,
    imageUrl: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=700&q=80",
    fabric: "Heavyweight Structured Twill",
    colorName: "Olive Green",
    colorHex: "#3B4D3C",
    variants: [
      { id: "var-top-baggy-m", size: "M", price: 1199 },
      { id: "var-top-baggy-l", size: "L", price: 1199 },
      { id: "var-top-baggy-xl", size: "XL", price: 1199 },
      { id: "var-top-baggy-xxl", size: "XXL", price: 1199 },
    ],
  },
  {
    id: "top-luxe-party",
    name: "LUXE PARTY WEAR SHIRT",
    slug: "luxe-party-wear-shirt",
    role: "THE EVENING SHIRT",
    category: "SHIRTS",
    basePrice: 1499,
    mrp: 2299,
    imageUrl: "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=700&q=80",
    fabric: "High Sheen Satin-Cotton Blend",
    colorName: "Charcoal Slate",
    colorHex: "#2E2D30",
    variants: [
      { id: "var-top-party-s", size: "S", price: 1499 },
      { id: "var-top-party-m", size: "M", price: 1499 },
      { id: "var-top-party-l", size: "L", price: 1499 },
      { id: "var-top-party-xl", size: "XL", price: 1499 },
    ],
  },
  {
    id: "top-executive-formal",
    name: "EXECUTIVE FORMAL SHIRT",
    slug: "executive-formal-shirt",
    role: "THE FORMAL SHIRT",
    category: "SHIRTS",
    basePrice: 1099,
    mrp: 1699,
    imageUrl: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=700&q=80",
    fabric: "Wrinkle-Resistant Fine Cotton",
    colorName: "Crisp White",
    colorHex: "#F8FAFC",
    variants: [
      { id: "var-top-exec-s", size: "S", price: 1099 },
      { id: "var-top-exec-m", size: "M", price: 1099 },
      { id: "var-top-exec-l", size: "L", price: 1099 },
      { id: "var-top-exec-xl", size: "XL", price: 1099 },
    ],
  },
];

export const CURATED_BOTTOMS: OutfitPiece[] = [
  {
    id: "bot-cotton-chinos",
    name: "COTTON CHINOS PANT",
    slug: "cotton-chinos-pant",
    role: "THE CHINO PANT",
    category: "PANTS",
    basePrice: 1199,
    mrp: 1799,
    imageUrl: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=700&q=80",
    fabric: "100% Stretch Cotton Twill",
    colorName: "Khaki Beige",
    colorHex: "#8C857B",
    variants: [
      { id: "var-bot-chino-28", size: "28", price: 1199 },
      { id: "var-bot-chino-30", size: "30", price: 1199 },
      { id: "var-bot-chino-32", size: "32", price: 1199 },
      { id: "var-bot-chino-34", size: "34", price: 1199 },
      { id: "var-bot-chino-36", size: "36", price: 1199 },
    ],
  },
  {
    id: "bot-classic-denim",
    name: "CLASSIC DENIM JEANS",
    slug: "classic-denim-jeans",
    role: "THE DENIM PANT",
    category: "PANTS",
    basePrice: 1299,
    mrp: 1999,
    imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=700&q=80",
    fabric: "Heavyweight Indigo Denim",
    colorName: "Deep Navy",
    colorHex: "#1F2937",
    variants: [
      { id: "var-bot-denim-28", size: "28", price: 1299 },
      { id: "var-bot-denim-30", size: "30", price: 1299 },
      { id: "var-bot-denim-32", size: "32", price: 1299 },
      { id: "var-bot-denim-34", size: "34", price: 1299 },
      { id: "var-bot-denim-36", size: "36", price: 1299 },
    ],
  },
  {
    id: "bot-lycra-formal",
    name: "FOUR-WAY LYCRA FORMAL PANT",
    slug: "four-way-lycra-formal-pant",
    role: "THE FORMAL PANT",
    category: "PANTS",
    basePrice: 1099,
    mrp: 1699,
    imageUrl: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=700&q=80",
    fabric: "4-Way Ultra Flex Lycra",
    colorName: "Charcoal Black",
    colorHex: "#2C2A29",
    variants: [
      { id: "var-bot-lycra-28", size: "28", price: 1099 },
      { id: "var-bot-lycra-30", size: "30", price: 1099 },
      { id: "var-bot-lycra-32", size: "32", price: 1099 },
      { id: "var-bot-lycra-34", size: "34", price: 1099 },
      { id: "var-bot-lycra-36", size: "36", price: 1099 },
    ],
  },
  {
    id: "bot-multi-cargo",
    name: "MULTI-POCKET CARGO PANT",
    slug: "multi-pocket-cargo-pant",
    role: "THE UTILITY PANT",
    category: "PANTS",
    basePrice: 1399,
    mrp: 2199,
    imageUrl: "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=700&q=80",
    fabric: "Ripstop Tactical Cotton",
    colorName: "Slate Grey",
    colorHex: "#4B5563",
    variants: [
      { id: "var-bot-cargo-28", size: "28", price: 1399 },
      { id: "var-bot-cargo-30", size: "30", price: 1399 },
      { id: "var-bot-cargo-32", size: "32", price: 1399 },
      { id: "var-bot-cargo-34", size: "34", price: 1399 },
      { id: "var-bot-cargo-36", size: "36", price: 1399 },
    ],
  },
  {
    id: "bot-skater-baggy",
    name: "SKATER BAGGY PANT",
    slug: "skater-baggy-pant",
    role: "THE BAGGY PANT",
    category: "PANTS",
    basePrice: 1299,
    mrp: 1999,
    imageUrl: "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&w=700&q=80",
    fabric: "Wide-Leg Relaxed Twill",
    colorName: "Obsidian Black",
    colorHex: "#111827",
    variants: [
      { id: "var-bot-skater-28", size: "28", price: 1299 },
      { id: "var-bot-skater-30", size: "30", price: 1299 },
      { id: "var-bot-skater-32", size: "32", price: 1299 },
      { id: "var-bot-skater-34", size: "34", price: 1299 },
      { id: "var-bot-skater-36", size: "36", price: 1299 },
    ],
  },
];

export const OUTFIT_PRESETS: OutfitPreset[] = [
  {
    id: "preset-1",
    name: "The Linen Minimalist",
    tagline: "Pure European flax linen shirt paired with tailored cotton stretch chinos.",
    topSlug: "pure-linen-shirt",
    bottomSlug: "cotton-chinos-pant",
  },
  {
    id: "preset-2",
    name: "The Streetwear Relaxed",
    tagline: "Dropped-shoulder oversized baggy shirt with 6-pocket tactical cargo trousers.",
    topSlug: "oversized-baggy-shirt",
    bottomSlug: "multi-pocket-cargo-pant",
  },
  {
    id: "preset-3",
    name: "The Executive Tailored",
    tagline: "Wrinkle-resistant formal shirt with 4-way ultra flexible lycra trousers.",
    topSlug: "executive-formal-shirt",
    bottomSlug: "four-way-lycra-formal-pant",
  },
  {
    id: "preset-4",
    name: "The Classic Denim Set",
    tagline: "100% breathable combed long-staple cotton shirt paired with classic straight-cut denim.",
    topSlug: "classic-cotton-shirt",
    bottomSlug: "classic-denim-jeans",
  },
];

export function OutfitBuilder() {
  const { addToCart, openCartDrawer } = useCartWishlist();

  // Selection states
  const [selectedTopIndex, setSelectedTopIndex] = useState<number>(0);
  const [selectedBottomIndex, setSelectedBottomIndex] = useState<number>(0);
  const [selectedTopSize, setSelectedTopSize] = useState<string>("M");
  const [selectedBottomSize, setSelectedBottomSize] = useState<string>("32");
  const [viewMode, setViewMode] = useState<"split" | "stacked">("split");

  // Interaction feedback states
  const [isAddingEnsemble, setIsAddingEnsemble] = useState<boolean>(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const activeTop = CURATED_TOPS[selectedTopIndex];
  const activeBottom = CURATED_BOTTOMS[selectedBottomIndex];

  // Price calculations with 10% Bundle Discount
  const subtotal = useMemo(() => {
    return activeTop.basePrice + activeBottom.basePrice;
  }, [activeTop, activeBottom]);

  const discountAmount = useMemo(() => {
    return Math.round(subtotal * 0.10);
  }, [subtotal]);

  const finalEnsemblePrice = useMemo(() => {
    return subtotal - discountAmount;
  }, [subtotal, discountAmount]);

  // Handle Preset Quick Click
  const handleSelectPreset = (preset: OutfitPreset) => {
    const topIdx = CURATED_TOPS.findIndex((t) => t.slug === preset.topSlug);
    const bottomIdx = CURATED_BOTTOMS.findIndex((b) => b.slug === preset.bottomSlug);
    if (topIdx !== -1) setSelectedTopIndex(topIdx);
    if (bottomIdx !== -1) setSelectedBottomIndex(bottomIdx);
    setActionSuccessMessage(`Loaded "${preset.name}" preset`);
    setTimeout(() => setActionSuccessMessage(null), 3000);
  };

  // Add Entire Ensemble to Bag (Top + Bottom) and trigger discount
  const handleAddEnsembleToBag = async () => {
    setIsAddingEnsemble(true);
    setErrorMessage(null);
    setActionSuccessMessage(null);

    try {
      // 1. Resolve live variant for Top
      let resolvedTopVariantId: string | null = null;
      try {
        const liveTop = await getProductBySlug(activeTop.slug);
        const match = liveTop?.variants?.find((v) => v.size === selectedTopSize) || liveTop?.variants?.[0];
        if (match) resolvedTopVariantId = match.id;
      } catch (err) {
        console.warn("Could not fetch live top product, using fallback:", err);
      }

      // 2. Resolve live variant for Bottom
      let resolvedBottomVariantId: string | null = null;
      try {
        const liveBottom = await getProductBySlug(activeBottom.slug);
        const match = liveBottom?.variants?.find((v) => v.size === selectedBottomSize) || liveBottom?.variants?.[0];
        if (match) resolvedBottomVariantId = match.id;
      } catch (err) {
        console.warn("Could not fetch live bottom product, using fallback:", err);
      }

      if (!resolvedTopVariantId && activeTop.variants[0]) {
        resolvedTopVariantId = activeTop.variants[0].id;
      }
      if (!resolvedBottomVariantId && activeBottom.variants[0]) {
        resolvedBottomVariantId = activeBottom.variants[0].id;
      }

      if (!resolvedTopVariantId || !resolvedBottomVariantId) {
        throw new Error("Unable to resolve garment sizing variant.");
      }

      // Add Top to cart
      await addToCart(resolvedTopVariantId, 1);

      // Add Bottom to cart
      await addToCart(resolvedBottomVariantId, 1);

      // Persist bundle discount coupon with 24-hour expiry timestamp for automatic checkout privilege
      if (typeof window !== "undefined") {
        try {
          const couponPayload = {
            code: "ENSEMBLE10",
            expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours expiry
          };
          localStorage.setItem("tn78_pending_coupon", JSON.stringify(couponPayload));
        } catch {
          // Ignore localStorage errors
        }
      }

      setActionSuccessMessage("Ensemble added! 10% Bundle Privilege Voucher (ENSEMBLE10) prepared.");
      openCartDrawer();
    } catch (err: unknown) {
      console.error("Failed to add ensemble:", err);
      const message = err instanceof Error ? err.message : "Failed to add ensemble to cart. Please try again.";
      setErrorMessage(message);
    } finally {
      setIsAddingEnsemble(false);
    }
  };

  return (
    <div className="w-full">
      {/* Curation Presets Bar */}
      <div className="mb-8 pb-4 border-b border-[#232733]">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
          <span className="text-[11px] font-heading font-extrabold uppercase tracking-[0.2em] text-[#E2C58A] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E2C58A] inline-block animate-pulse" />
            CURATED STYLE PRESETS
          </span>
          <span className="text-[11px] font-mono text-[#94A3B8]">
            Select a style story or build your custom silhouette
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {OUTFIT_PRESETS.map((preset) => {
            const isSelected =
              activeTop.slug === preset.topSlug &&
              activeBottom.slug === preset.bottomSlug;

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`px-4 py-2 text-xs font-heading font-semibold uppercase tracking-wider rounded-full transition-all whitespace-nowrap border text-left cursor-pointer ${
                  isSelected
                    ? "bg-[#E2C58A] text-[#0A0B0E] font-bold border-[#E2C58A] shadow-[0_0_15px_rgba(226,197,138,0.25)] scale-[1.02]"
                    : "bg-[#13151C] text-[#94A3B8] border-[#232733] hover:border-[#E2C58A]/60 hover:text-[#F8FAFC] hover:bg-[#191D28]"
                }`}
              >
                {preset.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Split Layout: Studio Canvas & Configuration Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* ==================================================================== */}
        {/* LEFT COLUMN: INTERACTIVE CANVAS VISUALIZER (lg:col-span-7)           */}
        {/* ==================================================================== */}
        <div className="lg:col-span-7 lg:sticky lg:top-24 space-y-4">
          
          {/* Canvas View Controls Bar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#13151C] border border-[#232733] rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-[#94A3B8]">
                STUDIO CANVAS
              </span>
              <span className="text-[10px] font-mono text-[#E2C58A] bg-[#E2C58A]/10 border border-[#E2C58A]/30 px-2 py-0.5 rounded-full">
                LIVE PAIRING
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setViewMode("split")}
                className={`px-3 py-1 text-[10px] font-heading font-bold tracking-wider uppercase rounded transition-colors cursor-pointer ${
                  viewMode === "split"
                    ? "bg-[#E2C58A] text-[#0A0B0E] font-black"
                    : "text-[#94A3B8] hover:text-[#F8FAFC] bg-[#0A0B0E]/60 border border-[#232733]"
                }`}
              >
                SIDE BY SIDE
              </button>
              <button
                type="button"
                onClick={() => setViewMode("stacked")}
                className={`px-3 py-1 text-[10px] font-heading font-bold tracking-wider uppercase rounded transition-colors cursor-pointer ${
                  viewMode === "stacked"
                    ? "bg-[#E2C58A] text-[#0A0B0E] font-black"
                    : "text-[#94A3B8] hover:text-[#F8FAFC] bg-[#0A0B0E]/60 border border-[#232733]"
                }`}
              >
                STACKED FIT
              </button>
            </div>
          </div>

          {/* Canvas Showcase Box */}
          <div className="bg-[#13151C] border border-[#232733] p-4 sm:p-6 rounded-xl relative overflow-hidden shadow-2xl">
            
            {/* Split View */}
            {viewMode === "split" ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-6">
                
                {/* Upper Piece Frame */}
                <div className="group relative flex flex-col">
                  <div className="relative aspect-[3/4] w-full bg-[#0A0B0E] overflow-hidden rounded-lg border border-[#232733]">
                    <Image
                      src={activeTop.imageUrl}
                      alt={activeTop.name}
                      fill
                      sizes="(max-width: 1024px) 50vw, 30vw"
                      className="object-cover object-top filter contrast-[1.02] transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-2.5 left-2.5 bg-[#0A0B0E]/85 backdrop-blur-md border border-[#232733] text-[#E2C58A] px-2 py-0.5 rounded font-heading font-bold text-[8px] sm:text-[9px] uppercase tracking-widest">
                      PIECE 01 &bull; UPPER
                    </div>
                    <div className="absolute bottom-2.5 right-2.5 bg-[#13151C]/90 backdrop-blur-md text-[#F8FAFC] px-2 py-0.5 rounded-full font-mono text-[9px] font-bold border border-[#232733]">
                      SIZE: {selectedTopSize}
                    </div>
                  </div>

                  <div className="mt-3">
                    <h4 className="font-heading font-bold text-xs uppercase text-[#F8FAFC] tracking-wide truncate">
                      {activeTop.name}
                    </h4>
                    <p className="text-[11px] font-mono text-[#E2C58A] mt-0.5">
                      ₹{activeTop.basePrice.toLocaleString("en-IN")}{" "}
                      <span className="text-[#94A3B8]">&bull; {activeTop.colorName}</span>
                    </p>
                  </div>
                </div>

                {/* Lower Piece Frame */}
                <div className="group relative flex flex-col">
                  <div className="relative aspect-[3/4] w-full bg-[#0A0B0E] overflow-hidden rounded-lg border border-[#232733]">
                    <Image
                      src={activeBottom.imageUrl}
                      alt={activeBottom.name}
                      fill
                      sizes="(max-width: 1024px) 50vw, 30vw"
                      className="object-cover object-top filter contrast-[1.02] transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-2.5 left-2.5 bg-[#0A0B0E]/85 backdrop-blur-md border border-[#232733] text-[#E2C58A] px-2 py-0.5 rounded font-heading font-bold text-[8px] sm:text-[9px] uppercase tracking-widest">
                      PIECE 02 &bull; LOWER
                    </div>
                    <div className="absolute bottom-2.5 right-2.5 bg-[#13151C]/90 backdrop-blur-md text-[#F8FAFC] px-2 py-0.5 rounded-full font-mono text-[9px] font-bold border border-[#232733]">
                      SIZE: {selectedBottomSize}
                    </div>
                  </div>

                  <div className="mt-3">
                    <h4 className="font-heading font-bold text-xs uppercase text-[#F8FAFC] tracking-wide truncate">
                      {activeBottom.name}
                    </h4>
                    <p className="text-[11px] font-mono text-[#E2C58A] mt-0.5">
                      ₹{activeBottom.basePrice.toLocaleString("en-IN")}{" "}
                      <span className="text-[#94A3B8]">&bull; {activeBottom.colorName}</span>
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* Stacked View: Mimics full human silhouette layering */
              <div className="flex flex-col gap-2 max-w-sm mx-auto">
                <div className="relative aspect-[4/3] w-full bg-[#0A0B0E] overflow-hidden rounded-t-lg border border-[#232733]">
                  <Image
                    src={activeTop.imageUrl}
                    alt={activeTop.name}
                    fill
                    sizes="400px"
                    className="object-cover object-top"
                  />
                  <span className="absolute top-2 left-2 bg-[#0A0B0E]/85 border border-[#232733] text-[#E2C58A] text-[8px] font-heading font-bold px-2 py-0.5 uppercase tracking-widest">
                    UPPER &bull; {activeTop.name} ({selectedTopSize})
                  </span>
                </div>
                <div className="relative aspect-[4/3] w-full bg-[#0A0B0E] overflow-hidden rounded-b-lg border border-[#232733]">
                  <Image
                    src={activeBottom.imageUrl}
                    alt={activeBottom.name}
                    fill
                    sizes="400px"
                    className="object-cover object-top"
                  />
                  <span className="absolute top-2 left-2 bg-[#0A0B0E]/85 border border-[#232733] text-[#E2C58A] text-[8px] font-heading font-bold px-2 py-0.5 uppercase tracking-widest">
                    LOWER &bull; {activeBottom.name} ({selectedBottomSize})
                  </span>
                </div>
              </div>
            )}

            {/* Silhouette Fabric Harmony Banner */}
            <div className="mt-5 p-3.5 bg-[#0A0B0E] border border-[#232733] rounded-lg flex items-center justify-between flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[#E2C58A] font-serif font-semibold">✦ Harmony Profile:</span>
                <span className="font-heading font-semibold text-[#F8FAFC] tracking-wide">
                  {activeTop.fabric} &times; {activeBottom.fabric}
                </span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#94A3B8]">
                <span
                  className="w-3 h-3 rounded-full border border-[#232733] ring-1 ring-[#E2C58A]/40"
                  style={{ backgroundColor: activeTop.colorHex }}
                  title={activeTop.colorName}
                />
                <span>+</span>
                <span
                  className="w-3 h-3 rounded-full border border-[#232733] ring-1 ring-[#E2C58A]/40"
                  style={{ backgroundColor: activeBottom.colorHex }}
                  title={activeBottom.colorName}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* RIGHT COLUMN: SELECTION STUDIO & PRICING (lg:col-span-5)              */}
        {/* ==================================================================== */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* STEP 1: SELECT UPPER PIECE */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-heading font-black text-xs uppercase tracking-[0.2em] text-[#F8FAFC]">
                01. CHOOSE UPPER GARMENT
              </span>
              <span className="text-[11px] font-mono text-[#E2C58A]">
                {selectedTopIndex + 1} of {CURATED_TOPS.length} Styles
              </span>
            </div>

            {/* Tops Options Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
              {CURATED_TOPS.map((top, idx) => {
                const isSelected = selectedTopIndex === idx;
                return (
                  <div
                    key={top.id}
                    onClick={() => setSelectedTopIndex(idx)}
                    className={`p-2.5 border rounded-lg cursor-pointer transition-all flex items-center gap-3.5 ${
                      isSelected
                        ? "bg-[#191D28] border-[#E2C58A] shadow-[0_0_15px_rgba(226,197,138,0.15)] ring-1 ring-[#E2C58A]"
                        : "bg-[#13151C] border-[#232733] hover:border-[#E2C58A]/50 hover:bg-[#161922]"
                    }`}
                  >
                    <div className="relative w-14 h-16 bg-[#0A0B0E] flex-shrink-0 rounded overflow-hidden border border-[#232733]">
                      <Image
                        src={top.imageUrl}
                        alt={top.name}
                        fill
                        sizes="60px"
                        className="object-cover object-top"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h5 className="font-heading font-bold text-xs uppercase text-[#F8FAFC] truncate">
                          {top.name}
                        </h5>
                        <span className="font-mono text-xs font-bold text-[#E2C58A] flex-shrink-0">
                          ₹{top.basePrice.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#94A3B8] truncate font-serif italic mt-0.5">
                        {top.fabric}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] font-mono text-[#E2C58A] uppercase tracking-wider">
                          {top.colorName}
                        </span>
                        {isSelected && (
                          <span className="text-[9px] font-heading font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-1.5 py-0.2 rounded">
                            SELECTED
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Active Top Size Selector */}
            <div className="pt-2 bg-[#13151C] p-3 border border-[#232733] rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-[#F8FAFC]">
                  SELECT UPPER SIZE ({activeTop.name}):
                </span>
                <span className="text-[11px] font-mono text-[#94A3B8]">
                  Active: <strong className="text-[#E2C58A]">{selectedTopSize}</strong>
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {activeTop.variants.map((v) => {
                  const isActive = selectedTopSize === v.size;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedTopSize(v.size)}
                      className={`py-1.5 text-xs font-mono font-bold uppercase rounded transition-all border cursor-pointer ${
                        isActive
                          ? "bg-[#E2C58A] text-[#0A0B0E] border-[#E2C58A] shadow-[0_0_10px_rgba(226,197,138,0.3)]"
                          : "bg-[#0A0B0E] text-[#94A3B8] border-[#232733] hover:border-[#E2C58A] hover:text-[#F8FAFC]"
                      }`}
                    >
                      {v.size}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* STEP 2: SELECT LOWER PIECE */}
          <div className="space-y-3 pt-4 border-t border-[#232733]">
            <div className="flex items-center justify-between">
              <span className="font-heading font-black text-xs uppercase tracking-[0.2em] text-[#F8FAFC]">
                02. CHOOSE LOWER GARMENT
              </span>
              <span className="text-[11px] font-mono text-[#E2C58A]">
                {selectedBottomIndex + 1} of {CURATED_BOTTOMS.length} Styles
              </span>
            </div>

            {/* Bottoms Options Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
              {CURATED_BOTTOMS.map((bottom, idx) => {
                const isSelected = selectedBottomIndex === idx;
                return (
                  <div
                    key={bottom.id}
                    onClick={() => setSelectedBottomIndex(idx)}
                    className={`p-2.5 border rounded-lg cursor-pointer transition-all flex items-center gap-3.5 ${
                      isSelected
                        ? "bg-[#191D28] border-[#E2C58A] shadow-[0_0_15px_rgba(226,197,138,0.15)] ring-1 ring-[#E2C58A]"
                        : "bg-[#13151C] border-[#232733] hover:border-[#E2C58A]/50 hover:bg-[#161922]"
                    }`}
                  >
                    <div className="relative w-14 h-16 bg-[#0A0B0E] flex-shrink-0 rounded overflow-hidden border border-[#232733]">
                      <Image
                        src={bottom.imageUrl}
                        alt={bottom.name}
                        fill
                        sizes="60px"
                        className="object-cover object-top"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h5 className="font-heading font-bold text-xs uppercase text-[#F8FAFC] truncate">
                          {bottom.name}
                        </h5>
                        <span className="font-mono text-xs font-bold text-[#E2C58A] flex-shrink-0">
                          ₹{bottom.basePrice.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#94A3B8] truncate font-serif italic mt-0.5">
                        {bottom.fabric}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] font-mono text-[#E2C58A] uppercase tracking-wider">
                          {bottom.colorName}
                        </span>
                        {isSelected && (
                          <span className="text-[9px] font-heading font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-1.5 py-0.2 rounded">
                            SELECTED
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Active Bottom Size Selector */}
            <div className="pt-2 bg-[#13151C] p-3 border border-[#232733] rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-[#F8FAFC]">
                  SELECT LOWER SIZE ({activeBottom.name}):
                </span>
                <span className="text-[11px] font-mono text-[#94A3B8]">
                  Active: <strong className="text-[#E2C58A]">{selectedBottomSize}</strong>
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {activeBottom.variants.map((v) => {
                  const isActive = selectedBottomSize === v.size;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedBottomSize(v.size)}
                      className={`py-1.5 text-xs font-mono font-bold uppercase rounded transition-all border cursor-pointer ${
                        isActive
                          ? "bg-[#E2C58A] text-[#0A0B0E] border-[#E2C58A] shadow-[0_0_10px_rgba(226,197,138,0.3)]"
                          : "bg-[#0A0B0E] text-[#94A3B8] border-[#232733] hover:border-[#E2C58A] hover:text-[#F8FAFC]"
                      }`}
                    >
                      {v.size}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ==================================================================== */}
          {/* STEP 3: ENSEMBLE SUMMARY & PRIVILEGE SAVINGS CARD                    */}
          {/* ==================================================================== */}
          <div className="bg-[#13151C] border border-[#E2C58A]/30 p-5 sm:p-6 rounded-xl space-y-4 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between pb-3 border-b border-[#232733]">
              <div className="space-y-0.5">
                <span className="font-heading font-black text-xs uppercase tracking-[0.2em] text-[#E2C58A]">
                  ENSEMBLE BUNDLE PRIVILEGE
                </span>
                <h4 className="font-serif text-base text-[#F8FAFC] font-medium">
                  2-Piece Tailored Ensemble
                </h4>
              </div>
              <span className="px-2.5 py-1 bg-[#E2C58A] text-[#0A0B0E] font-heading font-black text-[10px] uppercase tracking-wider rounded-full shadow-[0_0_10px_rgba(226,197,138,0.3)]">
                10% OFF AUTO-APPLIED
              </span>
            </div>

            {/* Line items review */}
            <div className="space-y-2 text-xs font-body">
              <div className="flex justify-between items-center text-[#94A3B8]">
                <span className="truncate pr-2">
                  01. {activeTop.name} ({selectedTopSize})
                </span>
                <span className="font-mono text-[#F8FAFC] font-medium">
                  ₹{activeTop.basePrice.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between items-center text-[#94A3B8]">
                <span className="truncate pr-2">
                  02. {activeBottom.name} ({selectedBottomSize})
                </span>
                <span className="font-mono text-[#F8FAFC] font-medium">
                  ₹{activeBottom.basePrice.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-[#232733] text-[#94A3B8]">
                <span>Standard Combined Retail</span>
                <span className="font-mono line-through text-[#64748B]">
                  ₹{subtotal.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between items-center text-[#E2C58A] font-medium">
                <span className="flex items-center gap-1.5">
                  <span>✦ Ensemble Privilege (Code: ENSEMBLE10)</span>
                </span>
                <span className="font-mono font-bold">
                  -₹{discountAmount.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Net Total Investment */}
            <div className="pt-3 border-t border-[#232733] flex items-baseline justify-between">
              <div>
                <span className="text-[11px] font-heading font-bold uppercase tracking-widest text-[#F8FAFC] block">
                  NET ENSEMBLE INVESTMENT
                </span>
                <span className="text-[10px] text-[#94A3B8]">
                  Inclusive of all GST taxes & complimentary shipping
                </span>
              </div>
              <div className="text-right">
                <span className="font-serif text-2xl font-bold text-[#E2C58A] tracking-tight">
                  ₹{finalEnsemblePrice.toLocaleString("en-IN")}
                </span>
                <span className="text-[11px] font-mono text-emerald-400 block font-semibold">
                  You save ₹{discountAmount.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 bg-red-950/70 border border-red-500/50 text-red-300 text-xs rounded-lg">
                {errorMessage}
              </div>
            )}

            {/* Success Feedback */}
            {actionSuccessMessage && (
              <div className="p-3 bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-xs rounded-lg flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{actionSuccessMessage}</span>
              </div>
            )}

            {/* Add Ensemble to Bag CTA Button */}
            <button
              type="button"
              onClick={handleAddEnsembleToBag}
              disabled={isAddingEnsemble}
              className="w-full py-4 px-6 bg-gradient-to-r from-[#E2C58A] via-[#F3E2B8] to-[#C6A467] hover:brightness-110 text-[#0A0B0E] font-heading text-xs font-black uppercase tracking-[0.2em] rounded-full transition-all duration-200 shadow-[0_0_20px_rgba(226,197,138,0.25)] hover:shadow-[0_0_25px_rgba(226,197,138,0.4)] disabled:opacity-50 flex items-center justify-center gap-2 group cursor-pointer"
            >
              {isAddingEnsemble ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-[#0A0B0E]" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>CURATING YOUR ENSEMBLE...</span>
                </>
              ) : (
                <>
                  <span>ADD ENSEMBLE TO BAG &bull; ₹{finalEnsemblePrice.toLocaleString("en-IN")}</span>
                  <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </>
              )}
            </button>

            {/* Signature Perks & Guarantees */}
            <div className="pt-2 grid grid-cols-2 gap-2 text-[10px] font-mono text-[#94A3B8]">
              <div className="flex items-center gap-1.5">
                <span className="text-[#E2C58A]">✦</span> Free Express BlueDart
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[#E2C58A]">✦</span> 7-Day Easy Doorstep Exchange
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[#E2C58A]">✦</span> Rigid Presentation Box
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[#E2C58A]">✦</span> 10% Bundle Voucher applied
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OutfitBuilder;
