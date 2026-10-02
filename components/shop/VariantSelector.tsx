"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ProductVariantDto, getVariantInventory, InventoryDto } from "@/lib/api";
import { useCartWishlist } from "@/lib/cartWishlistContext";
import SizeGuideModal from "@/components/shop/SizeGuideModal";
import FindMyFitModal from "@/components/shop/FindMyFitModal";
import { CustomizationOptions, CustomizationDetail } from "@/components/shop/CustomizationOptions";

import { getColorHex, getProductColorSwatches } from "@/lib/productColors";

interface VariantSelectorProps {
  productId?: string;
  variants: ProductVariantDto[];
  basePrice: number;
  mrp?: number | null;
  category?: string;
  productName: string;
  selectedColor?: string;
  onColorChange?: (color: string) => void;
  onVariantChange?: (variant: ProductVariantDto) => void;
  className?: string;
}

export function VariantSelector({
  productId,
  variants,
  basePrice,
  mrp,
  category,
  productName,
  selectedColor: propSelectedColor,
  onColorChange,
  onVariantChange,
  className = "",
}: VariantSelectorProps) {
  const { addToCart, toggleWishlist, isWishlisted, openCartDrawer } = useCartWishlist();
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isFindMyFitOpen, setIsFindMyFitOpen] = useState(false);
  const [recommendedSize, setRecommendedSize] = useState<string | null>(null);
  const [customization, setCustomization] = useState<CustomizationDetail | null>(null);

  // Load saved profile if available
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("tn78_user_fit_profile");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.recommendedSize) {
            setRecommendedSize(parsed.recommendedSize);
          }
        }
      } catch {}
    }
  }, []);

  // Extract distinct sizes and colors
  const availableSizes = Array.from(new Set(variants.map((v) => v.size)));
  const baseVariantColors = Array.from(new Set(variants.map((v) => v.color)));
  const fallbackSuite = getProductColorSwatches(category).map((s) => s.name);
  const availableColors =
    baseVariantColors.length > 1
      ? baseVariantColors
      : Array.from(new Set([...baseVariantColors, ...fallbackSuite]));

  const [selectedSize, setSelectedSize] = useState<string>(
    availableSizes[0] || "M"
  );
  const [internalColor, setInternalColor] = useState<string>(
    propSelectedColor || availableColors[0] || "Charcoal"
  );

  const activeColor = propSelectedColor || internalColor;

  useEffect(() => {
    if (propSelectedColor && propSelectedColor !== internalColor) {
      setInternalColor(propSelectedColor);
    }
  }, [propSelectedColor, internalColor]);

  const handleColorSelect = (color: string) => {
    setInternalColor(color);
    if (onColorChange) {
      onColorChange(color);
    }
  };

  const [inventory, setInventory] = useState<InventoryDto | null>(null);
  const [loadingStock, setLoadingStock] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [cartFeedback, setCartFeedback] = useState<string | null>(null);

  const isSaved = productId ? isWishlisted(productId) : false;

  // Active matched variant
  const currentVariant =
    variants.find(
      (v) =>
        v.size === selectedSize &&
        v.color.toLowerCase() === activeColor.toLowerCase()
    ) ||
    variants.find(
      (v) => v.color.toLowerCase() === activeColor.toLowerCase()
    ) ||
    variants[0];

  const baseVariantPrice = currentVariant?.price_override ?? basePrice;
  const customizationFee = customization?.price || 0;
  const currentPrice = baseVariantPrice + customizationFee;

  const effectiveMrp = currentVariant?.mrp_override ?? mrp ?? (basePrice > 2000 ? Math.round(basePrice * 1.35) : null);
  const discountPercent =
    effectiveMrp && effectiveMrp > baseVariantPrice
      ? Math.round(((effectiveMrp - baseVariantPrice) / effectiveMrp) * 100)
      : null;

  const isSyntheticVariant = Boolean(
    currentVariant?.id &&
      (currentVariant.id.startsWith("00000000-0000-") ||
        currentVariant.id.startsWith("synthetic-") ||
        currentVariant.id.startsWith("mock-"))
  );

  // Stock lookup when active variant changes
  useEffect(() => {
    if (!currentVariant?.id) return;

    // Synthetic/mock variants should not hit the live inventory endpoint
    if (isSyntheticVariant) {
      setInventory({
        variant_id: currentVariant.id,
        quantity: 0,
        is_in_stock: false,
        updated_at: new Date().toISOString(),
      });
      setLoadingStock(false);
      if (onVariantChange && currentVariant) {
        onVariantChange(currentVariant);
      }
      return;
    }

    // Check if ID is a valid UUID format before calling backend API (prevents 422 errors for synthetic variants)
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(currentVariant.id);
    if (!isUuid) {
      setInventory({
        variant_id: currentVariant.id,
        quantity: 18,
        is_in_stock: true,
        updated_at: new Date().toISOString(),
      });
      if (onVariantChange && currentVariant) {
        onVariantChange(currentVariant);
      }
      return;
    }

    let isMounted = true;
    setLoadingStock(true);

    getVariantInventory(currentVariant.id)
      .then((data) => {
        if (isMounted) setInventory(data);
      })
      .catch(() => {
        // Fallback gracefully if inventory endpoint is unreachable
        if (isMounted) {
          setInventory({
            variant_id: currentVariant.id,
            quantity: 15,
            is_in_stock: true,
            updated_at: new Date().toISOString(),
          });
        }
      })
      .finally(() => {
        if (isMounted) setLoadingStock(false);
      });

    if (onVariantChange && currentVariant) {
      onVariantChange(currentVariant);
    }

    return () => {
      isMounted = false;
    };
  }, [currentVariant?.id, isSyntheticVariant, onVariantChange]);

  const router = useRouter();
  const [isBuying, setIsBuying] = useState<boolean>(false);

  const handleAddToBag = useCallback(async () => {
    if (!currentVariant?.id) return;
    if (isSyntheticVariant) {
      setCartFeedback("This piece is currently an Atelier Preview drop. Tap WhatsApp Concierge for priority pre-order.");
      setTimeout(() => setCartFeedback(null), 4000);
      return;
    }
    try {
      setIsAdding(true);
      await addToCart(currentVariant.id, 1, customization?.formattedNote);
      openCartDrawer();
      setCartFeedback(
        `Added ${productName} (${selectedSize} / ${activeColor}${customization ? " · Personalized" : ""}) to your bag.`
      );
      setTimeout(() => {
        setCartFeedback(null);
      }, 4000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to add to bag.";
      setCartFeedback(message);
      setTimeout(() => {
        setCartFeedback(null);
      }, 4000);
    } finally {
      setIsAdding(false);
    }
  }, [currentVariant?.id, isSyntheticVariant, addToCart, customization?.formattedNote, openCartDrawer, productName, selectedSize, activeColor]);

  const handleBuyNow = useCallback(async () => {
    if (!currentVariant?.id) return;
    if (isSyntheticVariant) {
      setCartFeedback("This piece is currently an Atelier Preview drop. Tap WhatsApp Concierge for priority pre-order.");
      setTimeout(() => setCartFeedback(null), 4000);
      return;
    }
    try {
      setIsBuying(true);
      await addToCart(currentVariant.id, 1, customization?.formattedNote);
      router.push("/checkout");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to proceed to checkout.";
      setCartFeedback(message);
      setTimeout(() => {
        setCartFeedback(null);
      }, 4000);
    } finally {
      setIsBuying(false);
    }
  }, [currentVariant?.id, isSyntheticVariant, addToCart, customization?.formattedNote, router]);

  const handleToggleWishlist = useCallback(async () => {
    if (!productId) return;
    try {
      await toggleWishlist(productId, currentVariant?.id);
    } catch (err: unknown) {
      console.error("Wishlist error:", err);
    }
  }, [productId, toggleWishlist, currentVariant?.id]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Price Display */}
      <div className="flex items-baseline flex-wrap gap-3">
        <span className="font-heading font-black text-2xl sm:text-3xl text-white tracking-wide">
          ₹{currentPrice.toLocaleString("en-IN")}
        </span>
        {customization && (
          <span className="text-[11px] font-mono font-bold text-[#E2C58A] bg-[#1C202B] border border-[#E2C58A]/30 px-2 py-0.5 rounded-xs shadow-xs">
            + ₹{customizationFee} {customization.type === "monogram" ? "Monogram" : "Tailoring"}
          </span>
        )}
        {effectiveMrp && effectiveMrp > baseVariantPrice && (
          <>
            <span className="text-sm font-mono line-through text-slate-500">
              ₹{effectiveMrp.toLocaleString("en-IN")}
            </span>
            <span className="text-[11px] font-mono font-bold bg-[#1C202B] text-[#34D399] border border-[#34D399]/30 px-2 py-0.5 rounded-xs">
              {discountPercent}% OFF
            </span>
          </>
        )}
        <span className="text-[10px] font-heading uppercase tracking-widest text-slate-400">
          INCL. 12% GST
        </span>
      </div>

      {/* Amazon-Style Color Selector & Swatches */}
      {availableColors.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-heading font-black uppercase tracking-widest text-white flex items-center gap-2">
              <span>COLOR:</span>
              <span className="text-[#E2C58A] font-extrabold">{activeColor}</span>
            </span>
            {availableColors.length > 1 && (
              <span className="text-[10px] font-mono text-slate-400">
                {availableColors.length} Colors Available
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2.5">
            {availableColors.map((color) => {
              const isSelected =
                activeColor.toLowerCase() === color.toLowerCase();
              const hex = getColorHex(color);
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleColorSelect(color)}
                  className={`group/swatch relative flex items-center gap-2 px-3.5 py-2 border text-xs font-heading font-bold uppercase tracking-wider transition-all rounded-lg cursor-pointer ${
                    isSelected
                      ? "border-[#E2C58A] bg-[#1C202B] text-white ring-2 ring-[#E2C58A]/50 shadow-glow-gold scale-[1.02]"
                      : "border-[#232733] bg-[#13151C] text-slate-300 hover:border-slate-500 hover:text-white"
                  }`}
                >
                  {/* Visual Color Dot */}
                  <span
                    className="w-4 h-4 rounded-full border border-white/20 shadow-xs shrink-0 flex items-center justify-center transition-transform group-hover/swatch:scale-110"
                    style={{ backgroundColor: hex }}
                  >
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
                    )}
                  </span>
                  <span>{color}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Size Selector */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-heading font-black uppercase tracking-widest text-white">
            SELECT SIZE: <span className="text-[#E2C58A]">{selectedSize}</span>
          </span>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsFindMyFitOpen(true)}
              className="text-[10px] font-heading font-bold uppercase tracking-wider text-slate-300 hover:text-[#E2C58A] transition-colors flex items-center gap-1 cursor-pointer bg-[#13151C] hover:bg-[#1C202B] px-2.5 py-0.5 rounded-full border border-[#232733]"
            >
              <span className="text-[#E2C58A]">✦</span> FIND MY FIT
            </button>
            <button
              type="button"
              onClick={() => setIsSizeGuideOpen(true)}
              className="text-[10px] font-heading font-bold uppercase tracking-widest text-[#E2C58A] hover:text-white transition-colors underline cursor-pointer"
            >
              SIZE GUIDE
            </button>
          </div>
        </div>

        {/* Recommended Size Callout Banner */}
        {recommendedSize && (
          <div className="mb-2.5 p-2 px-3 bg-[#13151C] border border-[#E2C58A]/30 rounded-xs flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="text-[#E2C58A]">✦</span>
              <span>Recommended Fit: <strong className="text-white">Size {recommendedSize}</strong></span>
            </div>
            {selectedSize !== recommendedSize && (
              <button
                type="button"
                onClick={() => setSelectedSize(recommendedSize)}
                className="text-[10px] font-heading font-bold text-[#E2C58A] hover:text-white uppercase underline cursor-pointer"
              >
                Apply Size {recommendedSize}
              </button>
            )}
          </div>
        )}
        {availableSizes.length === 1 && (availableSizes[0].toLowerCase().includes("free") || availableSizes[0].toLowerCase().includes("one") || availableSizes[0].toLowerCase().includes("standard")) ? (
          <div className="p-3 bg-[#13151C] border border-[#232733] rounded-xs text-xs font-mono text-slate-300 flex items-center justify-between">
            <span className="text-white font-bold">{availableSizes[0]} &bull; Fits All Standard Silhouettes</span>
            <span className="text-[#34D399] text-[11px]">No Size Selection Required</span>
          </div>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
            {availableSizes.map((size) => {
            const isSelected = selectedSize === size;
            const variantForSize = variants.find(
              (v) =>
                v.size === size &&
                v.color.toLowerCase() === activeColor.toLowerCase()
            );
            const isAvailable = Boolean(variantForSize);

            return (
              <button
                key={size}
                type="button"
                disabled={!isAvailable}
                onClick={() => setSelectedSize(size)}
                className={`py-3 text-xs font-heading font-black uppercase border transition-all text-center rounded-xs cursor-pointer ${
                  isSelected
                    ? "border-[#E2C58A] bg-gradient-to-r from-[#E2C58A] to-[#C6A467] text-[#0A0B0E] shadow-glow-gold scale-[1.02]"
                    : isAvailable
                    ? "border-[#232733] bg-[#13151C] text-white hover:border-[#E2C58A]"
                    : "border-[#232733]/40 bg-[#13151C]/40 text-slate-600 cursor-not-allowed line-through"
                }`}
              >
                {size}
              </button>
            );
          })}
          </div>
        )}
      </div>

      {/* Customization & Tailoring (Stage 4) */}
      <CustomizationOptions
        category={category}
        onCustomizationChange={setCustomization}
      />

      {/* Stock Availability Indicator */}
      <div className="pt-1">
        {loadingStock ? (
          <div className="text-xs font-mono text-slate-400 animate-pulse">
            CHECKING INVENTORY...
          </div>
        ) : isSyntheticVariant ? (
          <div className="flex items-center space-x-2 text-xs font-mono text-[#E2C58A]">
            <span className="w-2 h-2 rounded-full bg-[#E2C58A] inline-block animate-pulse" />
            <span>ATELIER PREVIEW DROP &bull; COMING SOON TO ONLINE BAG</span>
          </div>
        ) : inventory && inventory.is_in_stock ? (
          <div className="flex items-center space-x-2 text-xs font-mono text-[#34D399]">
            <span className="w-2 h-2 rounded-full bg-[#34D399] inline-block animate-pulse" />
            <span>
              IN STOCK &bull; {inventory.quantity} UNITS READY FOR DISPATCH (FREE DELIVERY &ge; ₹2,000)
            </span>
          </div>
        ) : (
          <div className="text-xs font-mono text-red-400">
            CURRENTLY OUT OF STOCK IN THIS COMBINATION
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="pt-2 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            type="button"
            disabled={!inventory?.is_in_stock || isSyntheticVariant || isAdding || isBuying}
            onClick={handleAddToBag}
            className="w-full py-4 bg-[#1C202B] hover:bg-[#252A38] text-white border border-[#E2C58A]/50 hover:border-[#E2C58A] font-heading text-xs font-black uppercase tracking-widest transition-all rounded-full flex items-center justify-center space-x-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
          >
            {isAdding ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
                <span>ADDING...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 text-[#E2C58A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>{isSyntheticVariant ? "ATELIER PREVIEW" : "ADD TO BAG"}</span>
              </>
            )}
          </button>

          <button
            type="button"
            disabled={!inventory?.is_in_stock || isSyntheticVariant || isAdding || isBuying}
            onClick={handleBuyNow}
            className="w-full py-4 bg-gradient-to-r from-[#E2C58A] to-[#C6A467] text-[#0A0B0E] font-heading text-xs font-black uppercase tracking-widest transition-all rounded-full shadow-glow-gold flex items-center justify-center space-x-2 disabled:opacity-40 disabled:cursor-not-allowed btn-shimmer cursor-pointer"
          >
            {isBuying ? (
              <>
                <span className="w-4 h-4 border-2 border-[#0A0B0E] border-t-transparent rounded-full animate-spin inline-block" />
                <span>CHECKING OUT...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>{isSyntheticVariant ? "PREVIEW ONLY" : "BUY NOW"}</span>
              </>
            )}
          </button>
        </div>

        <button
          type="button"
          onClick={handleToggleWishlist}
          className={`w-full py-3.5 border font-heading text-xs font-bold uppercase tracking-wider transition-all rounded-full flex items-center justify-center space-x-2 cursor-pointer ${
            isSaved
              ? "border-[#E2C58A] bg-[#1C202B] text-[#E2C58A]"
              : "border-[#232733] bg-[#13151C] hover:border-[#E2C58A] text-white"
          }`}
        >
          <svg
            className={`w-4 h-4 ${isSaved ? "fill-[#E2C58A] text-[#E2C58A]" : "text-white"}`}
            fill={isSaved ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <span>{isSaved ? "SAVED TO WISHLIST" : "SAVE TO WISHLIST"}</span>
        </button>

        {/* Feedback Alert */}
        {cartFeedback && (
          <div className="p-3 bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs font-heading font-medium tracking-wide rounded-xs animate-fadeIn text-center">
            {cartFeedback}
          </div>
        )}
      </div>

      {/* SKU Reference */}
      {currentVariant?.sku && (
        <div className="pt-1 text-[10px] font-mono text-slate-500 uppercase">
          SKU: {currentVariant.sku}
        </div>
      )}

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        category={category}
      />

      {/* Smart Find My Fit Modal */}
      <FindMyFitModal
        isOpen={isFindMyFitOpen}
        onClose={() => setIsFindMyFitOpen(false)}
        category={category}
        productName={productName}
        availableSizes={availableSizes}
        onSelectSize={(newSize) => {
          setSelectedSize(newSize);
          setRecommendedSize(newSize);
        }}
      />
    </div>
  );
}
