"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartWishlist } from "@/lib/cartWishlistContext";

export default function CartPage() {
  const {
    cart,
    cartCount,
    isLoadingCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    toggleWishlist,
    isWishlisted,
  } = useCartWishlist();

  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);

  const handleQtyChange = async (itemId: string, currentQty: number, delta: number) => {
    const nextQty = currentQty + delta;
    if (nextQty <= 0) {
      handleRemove(itemId);
      return;
    }
    try {
      setUpdatingItemId(itemId);
      await updateCartQuantity(itemId, nextQty);
    } catch (err: unknown) {
      console.error("Failed to update cart quantity:", err);
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleRemove = async (itemId: string) => {
    try {
      setUpdatingItemId(itemId);
      await removeFromCart(itemId);
    } catch (err: unknown) {
      console.error("Failed to remove cart item:", err);
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleMoveToWishlist = async (itemId: string, productId: string, variantId?: string) => {
    try {
      setUpdatingItemId(itemId);
      if (!isWishlisted(productId)) {
        await toggleWishlist(productId, variantId);
      }
      await removeFromCart(itemId);
    } catch (err: unknown) {
      console.error("Failed to move to wishlist:", err);
    } finally {
      setUpdatingItemId(null);
    }
  };

  const FREE_SHIPPING_THRESHOLD = 2000;
  const subtotal = cart?.subtotal || 0;
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  return (
    <div className="bg-[#0A0B0E] min-h-screen text-[#F8FAFC] pb-28">
      {/* Breadcrumb Header */}
      <div className="border-b border-[#232733] bg-[#13151C] px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center space-x-2 text-[10px] font-heading font-black uppercase tracking-widest text-slate-400">
          <Link href="/" className="hover:text-[#E2C58A] transition-colors">
            HOME
          </Link>
          <span className="text-slate-600">/</span>
          <Link href="/shop" className="hover:text-[#E2C58A] transition-colors">
            SHOP
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-[#E2C58A]">SHOPPING BAG</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12">
        {/* Page Title & Count */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-[#232733] pb-6 mb-8 gap-2">
          <div>
            <span className="text-[10px] font-heading font-black uppercase tracking-widest text-[#E2C58A]">
              SELECTED GARMENTS
            </span>
            <h1 className="font-heading font-black text-2xl sm:text-3xl md:text-4xl uppercase tracking-wider text-white mt-1">
              SHOPPING BAG
            </h1>
          </div>
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
            {cartCount} {cartCount === 1 ? "GARMENT" : "GARMENTS"} IN BAG
          </span>
        </div>

        {/* Loading State */}
        {isLoadingCart && !cart ? (
          <div className="py-24 text-center">
            <div className="w-8 h-8 border-2 border-[#E2C58A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-xs font-heading font-bold uppercase tracking-widest text-slate-400">
              RETRIEVING SHOPPING BAG...
            </p>
          </div>
        ) : !cart || cart.items.length === 0 ? (
          /* Empty Bag State */
          <div className="py-20 md:py-28 text-center max-w-xl mx-auto space-y-6">
            <div className="w-16 h-16 border border-[#232733] rounded-full flex items-center justify-center mx-auto text-[#E2C58A] bg-[#13151C] shadow-card-dark">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <div className="space-y-2">
              <h2 className="font-heading font-black text-xl sm:text-2xl uppercase tracking-wider text-white">
                YOUR SHOPPING BAG IS CURRENTLY EMPTY
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm font-body leading-relaxed max-w-md mx-auto">
                Explore our curated collection of architectural linen overshirts, pleated trousers, and minimal streetwear.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-[#E2C58A] to-[#C6A467] text-[#0A0B0E] font-heading font-black text-xs uppercase tracking-widest rounded-full shadow-glow-gold hover:brightness-110 active:scale-95 transition-all cursor-pointer btn-shimmer"
              >
                <span>EXPLORE COLLECTION</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Cart Content Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left 8 Cols: Line Items & Free Delivery Progress */}
            <div className="lg:col-span-8 space-y-6">
              {/* Free Shipping Progress Meter */}
              <div className="p-4 sm:p-5 bg-[#13151C] border border-[#232733] rounded-sm shadow-card-dark">
                <div className="flex justify-between items-center text-xs tracking-wider uppercase text-slate-300 mb-2 font-mono">
                  {amountToFreeShipping === 0 ? (
                    <span className="text-[#E2C58A] font-bold flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-[#E2C58A]" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Complimentary Express Delivery Unlocked!
                    </span>
                  ) : (
                    <span>
                      Add <strong className="text-[#E2C58A] font-bold">₹{amountToFreeShipping.toLocaleString("en-IN")}</strong> more for Free Delivery
                    </span>
                  )}
                  <span className="text-xs text-slate-400 font-bold">{progressPercent}%</span>
                </div>
                <div className="w-full bg-[#1F232E] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#E2C58A] to-[#C6A467] h-full rounded-full transition-all duration-500 ease-out shadow-glow-gold"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              <div className="divide-y divide-[#232733] border border-[#232733] bg-[#13151C] rounded-sm shadow-card-dark px-6">
                {cart.items.map((item) => {
                  const isItemBusy = updatingItemId === item.id;

                  return (
                    <div
                      key={item.id}
                      className={`py-6 sm:py-8 flex flex-col sm:flex-row gap-5 sm:gap-6 transition-opacity ${
                        isItemBusy ? "opacity-50 pointer-events-none" : "opacity-100"
                      }`}
                    >
                      {/* Product Thumbnail */}
                      <Link
                        href={`/product/${item.product_slug}`}
                        className="relative w-24 h-32 sm:w-28 sm:h-36 shrink-0 bg-[#0A0B0E] border border-[#232733] overflow-hidden group block rounded-sm"
                      >
                        {item.image_url ? (
                          <Image
                            src={item.image_url}
                            alt={item.product_name}
                            fill
                            sizes="112px"
                            className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-[#0A0B0E] text-[10px] font-heading uppercase text-slate-500 p-2 text-center">
                            TN78 COLLECTION
                          </div>
                        )}
                      </Link>

                      {/* Item Details & Controls */}
                      <div className="flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-1">
                          <div className="flex items-start justify-between gap-4">
                            <Link
                              href={`/product/${item.product_slug}`}
                              className="font-heading font-black text-base sm:text-lg uppercase tracking-wider text-white hover:text-[#E2C58A] transition-colors line-clamp-1"
                            >
                              {item.product_name}
                            </Link>
                            <span className="font-heading font-black text-base text-[#E2C58A] tracking-wide shrink-0">
                              ₹{item.line_total.toLocaleString("en-IN")}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-heading text-slate-300 pt-1">
                            <span>
                              SIZE: <strong className="text-[#E2C58A] font-black">{item.size}</strong>
                            </span>
                            <span>&bull;</span>
                            <span>
                              COLOR: <strong className="text-[#E2C58A] font-black">{item.color}</strong>
                            </span>
                            {item.sku && (
                              <>
                                <span>&bull;</span>
                                <span className="font-mono text-[10px] text-slate-500">
                                  SKU: {item.sku}
                                </span>
                              </>
                            )}
                          </div>

                          <div className="text-[11px] font-mono text-slate-500 pt-0.5">
                            ₹{item.unit_price.toLocaleString("en-IN")} each
                          </div>
                        </div>

                        {/* Stepper and Action Controls */}
                        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                          {/* Quantity Stepper */}
                          <div className="flex items-center border border-[#232733] bg-[#0A0B0E] rounded-sm">
                            <button
                              type="button"
                              aria-label="Decrease quantity"
                              onClick={() => handleQtyChange(item.id, item.quantity, -1)}
                              disabled={isItemBusy}
                              className="w-9 h-9 flex items-center justify-center text-slate-300 hover:text-[#E2C58A] hover:bg-[#1C202B] transition-colors disabled:opacity-40 cursor-pointer"
                            >
                              &minus;
                            </button>
                            <span className="w-10 text-center font-mono font-bold text-xs text-white">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              aria-label="Increase quantity"
                              onClick={() => handleQtyChange(item.id, item.quantity, 1)}
                              disabled={isItemBusy}
                              className="w-9 h-9 flex items-center justify-center text-slate-300 hover:text-[#E2C58A] hover:bg-[#1C202B] transition-colors disabled:opacity-40 cursor-pointer"
                            >
                              &#43;
                            </button>
                          </div>

                          {/* Move to Wishlist & Remove */}
                          <div className="flex items-center space-x-4 text-[11px] font-heading font-bold uppercase tracking-wider">
                            <button
                              type="button"
                              onClick={() =>
                                handleMoveToWishlist(item.id, item.product_id, item.variant_id)
                              }
                              disabled={isItemBusy}
                              className="text-slate-400 hover:text-white transition-colors flex items-center space-x-1 cursor-pointer"
                            >
                              <span>SAVE FOR LATER</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleRemove(item.id)}
                              disabled={isItemBusy}
                              className="text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                            >
                              REMOVE
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Clear Cart & Continue Shopping */}
              <div className="flex flex-col sm:flex-row items-center justify-between pt-2 gap-4">
                <Link
                  href="/shop"
                  className="text-xs font-heading font-bold uppercase tracking-wider text-[#E2C58A] hover:text-white transition-colors flex items-center space-x-1"
                >
                  <span>&larr; CONTINUE SHOPPING</span>
                </Link>

                <button
                  type="button"
                  onClick={() => clearCart()}
                  className="text-[11px] font-heading font-bold uppercase tracking-wider text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                >
                  CLEAR SHOPPING BAG
                </button>
              </div>
            </div>

            {/* Right 4 Cols: Order Summary Sidebar */}
            <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
              <div className="bg-[#13151C] border border-[#232733] p-6 sm:p-8 space-y-6 rounded-sm shadow-card-dark">
                <div>
                  <span className="text-[10px] font-heading font-black uppercase tracking-widest text-[#E2C58A]">
                    SUMMARY
                  </span>
                  <h2 className="font-heading font-black text-xl uppercase tracking-wider text-white mt-1">
                    ORDER TOTALS
                  </h2>
                </div>

                <div className="space-y-3 text-xs font-heading border-t border-[#232733] pt-4">
                  <div className="flex justify-between text-slate-300">
                    <span>BAG SUBTOTAL</span>
                    <span className="font-bold text-white">
                      ₹{cart.subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-300">
                    <span>EXPRESS DISPATCH</span>
                    <span className="font-bold text-[#34D399] tracking-wider">
                      {cart.subtotal >= 2000 ? "COMPLIMENTARY" : "CALCULATED AT CHECKOUT"}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>ESTIMATED TAXES (GST)</span>
                    <span className="font-mono">INCLUDED (12%)</span>
                  </div>
                </div>

                <div className="border-t border-[#232733] pt-4 flex justify-between items-baseline">
                  <div>
                    <span className="font-heading font-black text-sm uppercase tracking-wider text-white block">
                      TOTAL
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      PAN-INDIA INSURED COURIER
                    </span>
                  </div>
                  <span className="font-heading font-black text-2xl text-[#E2C58A] tracking-wide">
                    ₹{cart.subtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                {/* Prepaid Store Notice Banner */}
                <div className="p-3 bg-[#0A0B0E] border border-[#232733] rounded-xs space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-[#E2C58A] font-bold flex items-center gap-1.5">
                      <span>⚡</span>
                      <span>100% PREPAID DISPATCH</span>
                    </span>
                    <span className="text-red-400 font-bold uppercase text-[9.5px] bg-red-950/40 px-1.5 py-0.5 border border-red-900/40 rounded-xs">
                      NO COD
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-body leading-tight">
                    Cash on Delivery is unavailable. Secure digital payment via UPI, GPay, PhonePe, or Cards required for dispatch.
                  </p>
                </div>

                {/* Checkout CTA */}
                <div className="space-y-2 pt-1">
                  <Link
                    href="/checkout"
                    className="w-full py-4 bg-gradient-to-r from-[#E2C58A] to-[#C6A467] text-[#0A0B0E] font-heading text-xs font-black uppercase tracking-widest transition-all rounded-full shadow-glow-gold flex items-center justify-center space-x-2 btn-shimmer"
                  >
                    <span>PROCEED TO CHECKOUT</span>
                    <span>&rarr;</span>
                  </Link>
                </div>

                {/* Assurance details */}
                <div className="border-t border-[#232733] pt-4 space-y-2.5 text-[11px] font-heading text-slate-400">
                  <div className="flex items-center space-x-2">
                    <span className="text-[#E2C58A] font-bold">&bull;</span>
                    <span>Secure 256-bit encrypted checkout</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[#E2C58A] font-bold">&bull;</span>
                    <span>Complimentary express pan-India dispatch</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[#E2C58A] font-bold">&bull;</span>
                    <span>7-day doorstep size exchange policy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
