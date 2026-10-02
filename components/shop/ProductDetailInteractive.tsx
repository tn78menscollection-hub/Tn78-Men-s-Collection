"use client";

import React, { useState, useMemo } from "react";
import { ProductDetailDto, ProductVariantDto } from "@/lib/api";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { VariantSelector } from "@/components/shop/VariantSelector";
import LiveDispatchTimer from "@/components/shop/LiveDispatchTimer";
import {
  getProductColorSwatches,
  ColorSwatchItem,
} from "@/lib/productColors";

interface ProductDetailInteractiveProps {
  product: ProductDetailDto;
  initialColor?: string;
}

export function ProductDetailInteractive({
  product,
  initialColor,
}: ProductDetailInteractiveProps) {
  // Extract variant colors from backend product
  const rawVariantColors = useMemo(
    () => product.variants?.map((v) => v.color) || [],
    [product.variants]
  );

  // Compute color swatches and image suites
  const colorSwatches: ColorSwatchItem[] = useMemo(
    () =>
      getProductColorSwatches(
        product.category?.slug,
        rawVariantColors,
        product.images
      ),
    [product.category?.slug, rawVariantColors, product.images]
  );

  // Default color selection
  const defaultColor = useMemo(() => {
    if (initialColor) {
      const match = colorSwatches.find(
        (s) => s.name.toLowerCase() === initialColor.toLowerCase()
      );
      if (match) return match.name;
    }
    return colorSwatches[0]?.name || rawVariantColors[0] || "Midnight Black";
  }, [initialColor, colorSwatches, rawVariantColors]);

  const [selectedColor, setSelectedColor] = useState<string>(defaultColor);

  // Active swatch based on selection
  const activeSwatch = useMemo(
    () =>
      colorSwatches.find(
        (s) => s.name.toLowerCase() === selectedColor.toLowerCase()
      ) || colorSwatches[0],
    [colorSwatches, selectedColor]
  );

  // Active gallery images
  const activeImages = useMemo(() => {
    if (activeSwatch?.images && activeSwatch.images.length > 0) {
      return activeSwatch.images;
    }
    return product.images;
  }, [activeSwatch, product.images]);

  // Ensure all colors in the swatches have corresponding variants in the selector
  const enrichedVariants: ProductVariantDto[] = useMemo(() => {
    const existing = product.variants || [];
    const sizes = Array.from(new Set(existing.map((v) => v.size)));
    const finalSizes = sizes.length > 0 ? sizes : ["S", "M", "L", "XL", "XXL"];

    const allVariants: ProductVariantDto[] = [...existing];

    colorSwatches.forEach((swatch) => {
      finalSizes.forEach((size) => {
        const hasVariant = allVariants.some(
          (v) =>
            v.size === size &&
            v.color.toLowerCase() === swatch.name.toLowerCase()
        );
        if (!hasVariant) {
          allVariants.push({
            id: `synth-${product.id}-${swatch.name.replace(/\s+/g, "").toLowerCase()}-${size}`,
            size,
            color: swatch.name,
            sku: `TN78-${product.slug.toUpperCase().slice(0, 4)}-${swatch.name.toUpperCase().slice(0, 3)}-${size}`,
            price_override: null,
            mrp_override: null,
          });
        }
      });
    });

    return allVariants;
  }, [product.variants, product.id, product.slug, colorSwatches]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
      {/* Left Column: Synchronized Product Imagery Gallery (7 cols on lg) */}
      <div className="lg:col-span-7">
        <ProductGallery
          images={activeImages}
          productName={`${product.name} - ${selectedColor}`}
        />

        {/* Amazon-Style Quick Color Preview Strip under Gallery */}
        {colorSwatches.length > 1 && (
          <div className="mt-6 p-4 rounded-2xl bg-[#13151C] border border-[#232733] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="text-[10px] font-heading font-black text-[#E2C58A] uppercase tracking-widest">
                AVAILABLE IN {colorSwatches.length} LUXURY SHADES:
              </span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              {colorSwatches.map((swatch) => {
                const isSelected =
                  swatch.name.toLowerCase() === selectedColor.toLowerCase();
                return (
                  <button
                    key={swatch.name}
                    type="button"
                    onClick={() => setSelectedColor(swatch.name)}
                    className={`relative flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-heading font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      isSelected
                        ? "border-[#E2C58A] bg-[#1C202B] text-white ring-2 ring-[#E2C58A]/50 shadow-glow-gold scale-105"
                        : "border-[#232733] bg-[#0E1017] text-slate-400 hover:text-white hover:border-slate-500"
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-white/20 shrink-0"
                      style={{ backgroundColor: swatch.hex }}
                    />
                    <span>{swatch.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Right Column: Product Details & Variant Selection (5 cols on lg) */}
      <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
        <div>
          {/* Category & Collection Tag */}
          <div className="flex items-center space-x-3 mb-2.5">
            <span className="text-[10px] font-heading font-black uppercase tracking-widest text-[#E2C58A] border border-[#E2C58A]/30 px-2.5 py-0.5 bg-[#1C202B] rounded-xs shadow-xs">
              {product.category?.name || "COLLECTION"}
            </span>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              TN78 LUXURY EDITION &bull; 100% PREPAID DISPATCH
            </span>
          </div>

          {/* Title */}
          <h1 className="font-heading font-black text-2xl sm:text-3xl md:text-4xl uppercase tracking-wider text-white">
            {product.name}
          </h1>

          {/* Rating Summary */}
          <div className="flex items-center space-x-2 mt-2.5 mb-1 text-xs">
            <span className="text-[#E2C58A] font-heading font-bold text-xs">
              {product.average_rating
                ? `★ ${product.average_rating.toFixed(1)}`
                : "★ NEW ARRIVAL"}
            </span>
            <span className="text-slate-600">&bull;</span>
            <span className="text-slate-400 text-[11px]">
              {product.review_count && product.review_count > 0
                ? `${product.review_count} Client Review${product.review_count > 1 ? "s" : ""}`
                : "Handcrafted in South Hub"}
            </span>
          </div>
        </div>

        {/* Synchronized Variant Selector (Sizes, Colors, Inventory, Add to Bag) */}
        <VariantSelector
          productId={product.id}
          variants={enrichedVariants}
          basePrice={product.base_price}
          mrp={product.mrp}
          category={product.category?.name}
          productName={product.name}
          selectedColor={selectedColor}
          onColorChange={setSelectedColor}
        />

        {/* Live Cut-Off Dispatch Timer & Pincode Checker */}
        <LiveDispatchTimer />

        {/* Quality Assurance Badges */}
        <div className="pt-6 border-t border-[#232733] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-heading">
          <div className="flex items-start space-x-3">
            <svg
              className="w-4 h-4 text-[#E2C58A] shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <div>
              <span className="font-black text-white block uppercase tracking-wider text-[11px]">
                COMPLIMENTARY DELIVERY
              </span>
              <span className="text-[10px] text-slate-400 font-body">
                Express 24-48 hr pan-India dispatch
              </span>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <svg
              className="w-4 h-4 text-[#E2C58A] shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <div>
              <span className="font-black text-white block uppercase tracking-wider text-[11px]">
                7-DAY EASY EXCHANGES
              </span>
              <span className="text-[10px] text-slate-400 font-body">
                Hassle-free size adjustment
              </span>
            </div>
          </div>
        </div>

        {/* Expandable Editorial Accordions */}
        <div className="pt-6 border-t border-[#232733] space-y-4">
          <details className="group border-b border-[#232733] pb-4" open>
            <summary className="flex items-center justify-between cursor-pointer list-none font-heading text-xs font-black uppercase tracking-wider text-white group-hover:text-[#E2C58A] transition-colors">
              <span>GARMENT ARCHITECTURE &amp; DESCRIPTION</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform duration-200">
                &darr;
              </span>
            </summary>
            <div className="mt-3 text-xs font-body text-slate-400 leading-relaxed space-y-2">
              <p>{product.description}</p>
              <p className="text-slate-500 text-[11px]">
                Patterned in our South Hub design studio with engineered drape lines and reinforced stress points for prolonged wear resilience.
              </p>
            </div>
          </details>

          <details className="group border-b border-[#232733] pb-4">
            <summary className="flex items-center justify-between cursor-pointer list-none font-heading text-xs font-black uppercase tracking-wider text-white group-hover:text-[#E2C58A] transition-colors">
              <span>FABRIC RESIDENCY &amp; CARE</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform duration-200">
                &darr;
              </span>
            </summary>
            <div className="mt-3 text-xs font-body text-slate-400 leading-relaxed space-y-2">
              <p>Dense handpicked European-grade flax / high-density long-staple cotton weave.</p>
              <p className="text-slate-500 text-[11px]">
                Care instructions: Cold gentle wash inside-out or eco dry clean. Do not tumble dry. Press with damp pressing cloth at moderate heat.
              </p>
            </div>
          </details>

          <details className="group border-b border-[#232733] pb-4">
            <summary className="flex items-center justify-between cursor-pointer list-none font-heading text-xs font-black uppercase tracking-wider text-white group-hover:text-[#E2C58A] transition-colors">
              <span>DISPATCH &amp; PACKAGING</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform duration-200">
                &darr;
              </span>
            </summary>
            <div className="mt-3 text-xs font-body text-slate-400 leading-relaxed space-y-2">
              <p>Every TN78 piece is packed in custom archival matte sleeves with embossed linen paper wrapping.</p>
              <p className="text-slate-500 text-[11px]">
                Includes certified inspection badge signed by the master cutter.
              </p>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}
