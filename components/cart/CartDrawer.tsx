"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartWishlist } from "@/lib/cartWishlistContext";

const FREE_SHIPPING_THRESHOLD = 2000;

export default function CartDrawer() {
  const {
    cart,
    cartCount,
    isCartDrawerOpen,
    closeCartDrawer,
    updateCartQuantity,
    removeFromCart,
    isLoadingCart,
  } = useCartWishlist();

  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isCartDrawerOpen) {
        closeCartDrawer();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCartDrawerOpen, closeCartDrawer]);

  // Prevent background body scroll when drawer is open
  useEffect(() => {
    if (isCartDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartDrawerOpen]);

  if (!isCartDrawerOpen) return null;

  const subtotal = cart?.subtotal || 0;
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      aria-labelledby="slide-over-cart-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeCartDrawer}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-0 sm:pl-10">
        <div
          ref={drawerRef}
          className="w-screen max-w-md transform bg-[#0D0F14] text-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out border-l border-[#232733]"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#232733] flex items-center justify-between bg-[#13151C]">
            <div className="flex items-center gap-2.5">
              <h2
                id="slide-over-cart-title"
                className="font-heading font-black text-sm tracking-widest uppercase text-white"
              >
                SHOPPING BAG
              </h2>
              <span className="text-[11px] bg-[#1C202B] text-[#E2C58A] font-mono font-bold px-2.5 py-0.5 rounded-full border border-[#E2C58A]/30 shadow-xs">
                {cartCount}
              </span>
            </div>
            <button
              type="button"
              onClick={closeCartDrawer}
              className="p-2 -mr-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-[#1C202B] cursor-pointer"
              aria-label="Close cart drawer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="px-6 py-3.5 bg-[#13151C]/70 border-b border-[#232733]">
            <div className="flex justify-between items-center text-[11px] tracking-wider uppercase text-slate-400 mb-1.5 font-mono">
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
                  Add <strong className="text-[#E2C58A] font-bold">₹{amountToFreeShipping.toLocaleString("en-IN")}</strong> for Free Delivery
                </span>
              )}
              <span className="text-[10px] text-slate-400 font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full bg-[#1F232E] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#E2C58A] to-[#C6A467] h-full rounded-full transition-all duration-500 ease-out shadow-glow-gold"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items Container */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-[#232733]">
            {!cart?.items || cart.items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[#13151C] border border-[#232733] flex items-center justify-center text-[#E2C58A] mb-4 shadow-card-dark">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
                <h3 className="font-heading font-black text-sm uppercase tracking-wider text-white mb-1">
                  YOUR BAG IS EMPTY
                </h3>
                <p className="text-xs text-slate-400 max-w-xs mb-6 leading-relaxed">
                  Discover our menswear silhouettes crafted from pure organic cotton and Italian linen.
                </p>
                <Link
                  href="/shop"
                  onClick={closeCartDrawer}
                  className="inline-block bg-gradient-to-r from-[#E2C58A] to-[#C6A467] text-[#0A0B0E] font-heading font-black text-xs uppercase tracking-widest px-7 py-3 rounded-full shadow-glow-gold transition-all btn-shimmer"
                >
                  EXPLORE COLLECTION
                </Link>
              </div>
            ) : (
              cart.items.map((item) => (
                <div key={item.id} className="py-4 flex gap-4 items-center">
                  {/* Thumbnail */}
                  <div className="relative w-20 h-24 bg-[#13151C] rounded-sm overflow-hidden flex-shrink-0 border border-[#232733]">
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={item.product_name}
                        fill
                        unoptimized
                        sizes="80px"
                        className="object-cover object-top"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs font-mono">
                        TN78
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <Link
                        href={`/product/${item.product_slug}`}
                        onClick={closeCartDrawer}
                        className="font-heading font-bold text-xs uppercase tracking-wider text-white hover:text-[#E2C58A] transition-colors line-clamp-1"
                      >
                        {item.product_name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-500 hover:text-red-400 transition-colors p-1 cursor-pointer"
                        aria-label="Remove item"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                      {item.size} / {item.color}
                    </p>

                    {item.customization_note && (
                      <div className="mt-1.5 px-2 py-1 bg-[#1C202B] border border-[#E2C58A]/30 rounded-xs text-[10px] font-mono text-[#E2C58A] flex items-center gap-1.5 max-w-full">
                        <span className="flex-shrink-0 text-[#E2C58A]">✦</span>
                        <span className="truncate">{item.customization_note}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-end mt-3">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-[#232733] bg-[#13151C] rounded-sm">
                        <button
                          type="button"
                          onClick={() => {
                            if (item.quantity > 1) {
                              updateCartQuantity(item.id, item.quantity - 1);
                            } else {
                              removeFromCart(item.id);
                            }
                          }}
                          className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-[#E2C58A] transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-mono font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-[#E2C58A] transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <div className="font-mono text-sm font-bold text-white">
                          ₹{item.line_total.toLocaleString("en-IN")}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          {cart && cart.items.length > 0 && (
            <div className="border-t border-[#232733] px-6 py-5 bg-[#13151C] space-y-4">
              <div className="space-y-1.5 text-xs text-slate-400">
                <div className="flex justify-between text-sm font-bold text-white">
                  <span>SUBTOTAL</span>
                  <span className="font-mono text-base text-[#E2C58A]">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-[11px] font-mono">
                  <span>GST & Duties</span>
                  <span className="text-[#34D399]">Included (12% IGST)</span>
                </div>
                <div className="flex justify-between text-[11px] font-mono">
                  <span>Shipping</span>
                  <span>{amountToFreeShipping === 0 ? "Complimentary" : "₹150 (Free above ₹2,999)"}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <Link
                  href="/checkout"
                  onClick={closeCartDrawer}
                  className="w-full block text-center bg-gradient-to-r from-[#E2C58A] to-[#C6A467] text-[#0A0B0E] text-xs uppercase tracking-widest font-heading font-black py-3.5 rounded-full transition-all shadow-glow-gold btn-shimmer cursor-pointer"
                >
                  PROCEED TO CHECKOUT
                </Link>
                <Link
                  href="/cart"
                  onClick={closeCartDrawer}
                  className="w-full block text-center border border-[#232733] text-slate-300 hover:text-white hover:border-[#E2C58A] text-xs uppercase tracking-widest font-heading font-bold py-3 rounded-full transition-colors cursor-pointer"
                >
                  VIEW FULL BAG ({cartCount})
                </Link>
              </div>

              {/* Trust Badge */}
              <div className="flex items-center justify-center gap-4 pt-2 text-[10px] tracking-wider uppercase text-slate-500 font-mono">
                <span>✦ 7-DAY RETURNS</span>
                <span>✦ 100% SECURE PREPAID</span>
                <span>✦ FAST DISPATCH</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
