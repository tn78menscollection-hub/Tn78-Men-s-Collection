"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartWishlist } from "@/lib/cartWishlistContext";
import { getProductImageUrl } from "@/lib/productImages";
import { getProductColorSwatches } from "@/lib/productColors";

export interface ProductCardProps {
  id?: string | number;
  name: string;
  price: string | number;
  mrp?: number;
  slug?: string;
  href?: string;
  imageUrl?: string;
  category?: string;
  sizes?: string[];
  isNew?: boolean;
  className?: string;
}

export function ProductCard({
  id,
  name,
  price,
  mrp,
  slug,
  href,
  imageUrl,
  category,
  sizes,
  isNew = false,
  className = "",
}: ProductCardProps) {
  const { toggleWishlist, isWishlisted } = useCartWishlist();
  const [imgError, setImgError] = useState(false);

  const effectiveImageUrl = getProductImageUrl(slug, category, imageUrl);

  // Retrieve colorways for this product
  const colorSwatches = useMemo(() => {
    return getProductColorSwatches(
      category,
      undefined,
      effectiveImageUrl ? [{ id: "base", url: effectiveImageUrl }] : undefined
    );
  }, [category, effectiveImageUrl]);

  const [activeColorIdx, setActiveColorIdx] = useState<number>(0);
  const activeColorSwatch = colorSwatches[activeColorIdx] || colorSwatches[0];

  const currentDisplayImage =
    activeColorSwatch?.images?.[0]?.url || effectiveImageUrl;

  const numPrice =
    typeof price === "number"
      ? price
      : parseFloat(price.toString().replace(/[^0-9.]/g, "")) || 0;
  const numMrp = mrp || (numPrice > 0 ? Math.round(numPrice * 1.35) : 0);
  const discountPercent =
    numMrp > numPrice ? Math.round(((numMrp - numPrice) / numMrp) * 100) : 0;

  const colorParam = activeColorSwatch ? `?color=${encodeURIComponent(activeColorSwatch.name)}` : "";
  const targetHref = href || (slug ? `/product/${slug}${colorParam}` : "#");
  const targetId = id ? id.toString() : slug || name;
  const isSaved = isWishlisted(targetId);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(targetId);
  };

  return (
    <Link
      href={targetHref}
      className={`group flex flex-col cursor-pointer bg-[#13151C] p-2 sm:p-2.5 rounded-xl sm:rounded-2xl border border-[#232733]/90 hover:border-[#E2C58A]/60 transition-all duration-300 hover:shadow-xl hover:shadow-[#E2C58A]/10 hover:-translate-y-1 ${className}`}
    >
      {/* 4:5 Medium Studio Photo Frame */}
      <div className="relative aspect-[4/5] w-full bg-[#0E1017] overflow-hidden rounded-lg sm:rounded-xl border border-[#232733]/60">
        
        {/* Badges: NEW DROP / CATEGORY */}
        {isNew ? (
          <span className="absolute top-2 left-2 z-20 bg-gradient-to-r from-[#E2C58A] to-[#C6A467] text-[#0A0B0E] font-heading text-[8px] sm:text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full shadow-md">
            NEW DROP
          </span>
        ) : category ? (
          <span className="absolute top-2 left-2 z-20 bg-[#0A0B0E]/85 backdrop-blur-md text-[#F8FAFC] border border-white/10 font-heading text-[7px] sm:text-[8px] font-bold uppercase tracking-widest px-1.5 sm:px-2 py-0.5 rounded-full shadow-xs">
            {category}
          </span>
        ) : null}

        {/* Wishlist Toggle Heart Button */}
        <button
          type="button"
          onClick={handleWishlistClick}
          className={`absolute top-2 right-2 z-20 p-1.5 bg-[#0A0B0E]/75 hover:bg-[#0A0B0E] text-slate-300 hover:text-[#E2C58A] rounded-full backdrop-blur-md border border-white/10 transition-all duration-200 shadow-md hover:scale-110 active:scale-95 ${
            isSaved ? "text-[#E2C58A] animate-heartBurst" : ""
          }`}
          aria-label="Toggle wishlist"
        >
          <svg
            className={`w-3.5 h-3.5 transition-colors ${
              isSaved ? "fill-[#E2C58A] text-[#E2C58A]" : "text-white/80 hover:text-[#E2C58A]"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.75}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>

        {/* Product Image */}
        {currentDisplayImage && !imgError ? (
          <>
            <Image
              src={currentDisplayImage}
              alt={name}
              fill
              unoptimized
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover object-top filter contrast-[1.04] group-hover:scale-108 transition-transform duration-700 ease-out"
              onError={() => setImgError(true)}
            />
            {/* Subtle Luxury Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B0E]/80 via-transparent to-black/20 opacity-40 group-hover:opacity-60 transition-opacity pointer-events-none" />
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-3 bg-[#181B24] select-none">
            <span className="font-heading font-black text-[11px] text-[#E2C58A]/80 uppercase tracking-widest">
              TN78 COLLECTION
            </span>
            <span className="text-[9px] text-slate-400 uppercase tracking-wider mt-1 truncate max-w-[120px]">
              {name}
            </span>
          </div>
        )}

        {/* Floating Frosted Glass Size Pill On Hover (Desktop) */}
        {sizes && sizes.length > 0 && (
          <div className="hidden sm:flex absolute bottom-2 inset-x-2 bg-[#0A0B0E]/90 backdrop-blur-md py-1 px-2.5 rounded-lg items-center justify-between opacity-0 group-hover:opacity-100 translate-y-1.5 group-hover:translate-y-0 transition-all duration-300 ease-out border border-[#E2C58A]/20 shadow-xl z-20">
            <span className="text-[7px] font-heading font-black text-[#E2C58A] uppercase tracking-widest">
              SIZES
            </span>
            <div className="flex items-center space-x-1">
              {sizes.map((s) => (
                <span
                  key={s}
                  className="text-[8px] font-heading font-bold text-slate-300 hover:text-[#E2C58A] transition-colors"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Product Metadata Below Card */}
      <div className="mt-2.5 flex flex-col space-y-1 text-left px-0.5 pb-0.5">
        {/* Title (Single line with clean truncate or 2-line clamp) */}
        <h3 className="font-heading font-bold text-[11px] sm:text-xs uppercase tracking-wide text-slate-100 group-hover:text-[#E2C58A] transition-colors duration-200 line-clamp-1 leading-snug">
          {name}
        </h3>

        {/* Interactive Color Dot Swatches (Amazon/Myntra Style) */}
        {colorSwatches.length > 1 && (
          <div className="flex items-center gap-1.5 py-0.5">
            {colorSwatches.slice(0, 4).map((swatch, idx) => {
              const isSelected = idx === activeColorIdx;
              return (
                <button
                  key={swatch.name}
                  type="button"
                  title={swatch.name}
                  aria-label={`Select ${swatch.name} color`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveColorIdx(idx);
                  }}
                  onMouseEnter={() => setActiveColorIdx(idx)}
                  className={`w-3.5 h-3.5 rounded-full transition-all cursor-pointer border ${
                    isSelected
                      ? "scale-125 border-[#E2C58A] ring-1.5 ring-[#E2C58A] shadow-xs"
                      : "border-white/30 hover:scale-115 opacity-70 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: swatch.hex }}
                />
              );
            })}
            {colorSwatches.length > 4 && (
              <span className="text-[8px] font-mono text-slate-400 font-bold ml-0.5">
                +{colorSwatches.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Mobile sizes indicator */}
        {sizes && sizes.length > 0 && (
          <div className="sm:hidden text-[8px] font-mono text-slate-400 tracking-wider">
            {sizes.join("  ")}
          </div>
        )}

        {/* Clean Luxury Pricing: ₹ symbol, no .00 decimals, non-wrapping */}
        <div className="flex items-baseline gap-1.5 flex-wrap pt-0.5">
          <span className="font-heading font-black text-xs sm:text-sm text-[#F8FAFC] tracking-tight whitespace-nowrap">
            ₹{numPrice.toLocaleString("en-IN")}
          </span>
          {numMrp > numPrice && (
            <span className="text-[10px] sm:text-[11px] font-mono text-slate-400 line-through whitespace-nowrap">
              ₹{numMrp.toLocaleString("en-IN")}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="text-[8px] sm:text-[9px] font-heading font-extrabold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 rounded-full whitespace-nowrap">
              {discountPercent}% OFF
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
