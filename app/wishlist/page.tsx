"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartWishlist } from "@/lib/cartWishlistContext";
import { getStoredAuthToken } from "@/lib/api";

export default function WishlistPage() {
  const {
    wishlist,
    isLoadingWishlist,
    removeFromWishlist,
  } = useCartWishlist();

  const [busyItemId, setBusyItemId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const isLoggedIn = Boolean(typeof window !== "undefined" && getStoredAuthToken());

  const handleRemove = async (itemId: string) => {
    try {
      setBusyItemId(itemId);
      await removeFromWishlist(itemId);
    } catch (err: unknown) {
      console.error("Failed to remove item from wishlist:", err);
    } finally {
      setBusyItemId(null);
    }
  };

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
          <span className="text-[#E2C58A]">SAVED WISHLIST</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12">
        {/* Page Title & Status */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-[#232733] pb-6 mb-8 gap-2">
          <div>
            <span className="text-[10px] font-heading font-black uppercase tracking-widest text-[#E2C58A]">
              PERSONAL CURATION
            </span>
            <h1 className="font-heading font-black text-2xl sm:text-3xl md:text-4xl uppercase tracking-wider text-white mt-1">
              SAVED WISHLIST
            </h1>
          </div>
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
            {wishlist.length} {wishlist.length === 1 ? "SAVED PIECE" : "SAVED PIECES"}
          </span>
        </div>


        {/* Global Feedback notification */}
        {feedback && (
          <div className="mb-6 p-4 bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-heading font-medium tracking-wide animate-fadeIn flex items-center justify-between rounded-xs">
            <span>{feedback}</span>
            <button
              onClick={() => setFeedback(null)}
              className="text-slate-400 hover:text-white text-xs font-mono cursor-pointer"
            >
              DISMISS
            </button>
          </div>
        )}

        {/* Guest Authentication Advisory if not logged in */}
        {!isLoggedIn && (
          <div className="mb-8 p-4 bg-[#13151C] border border-[#232733] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-sm shadow-card-dark">
            <div className="space-y-1">
              <span className="text-xs font-heading font-black uppercase tracking-wider text-white block">
                AUTHENTICATE YOUR ACCOUNT
              </span>
              <p className="text-[11px] font-body text-slate-400">
                Sign in to sync your bespoke wishlist across all devices and secure early access to
                seasonal capsule drops.
              </p>
            </div>
            <Link
              href="/account/orders"
              className="px-5 py-2.5 bg-[#0A0B0E] border border-[#232733] hover:border-[#E2C58A] text-[#E2C58A] text-[10px] font-heading font-bold uppercase tracking-widest transition-colors rounded-full shrink-0"
            >
              SIGN IN / REGISTER
            </Link>
          </div>
        )}

        {/* Loading State */}
        {isLoadingWishlist && wishlist.length === 0 ? (
          <div className="py-24 text-center">
            <div className="w-8 h-8 border-2 border-[#E2C58A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-xs font-heading font-bold uppercase tracking-widest text-slate-400">
              OPENING WISHLIST ARCHIVE...
            </p>
          </div>
        ) : wishlist.length === 0 ? (
          /* Empty Wishlist State */
          <div className="py-20 md:py-28 text-center max-w-xl mx-auto space-y-6">
            <div className="w-16 h-16 border border-[#232733] rounded-full flex items-center justify-center mx-auto text-[#E2C58A] bg-[#13151C] shadow-card-dark">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <div className="space-y-2">
              <h2 className="font-heading font-black text-xl sm:text-2xl uppercase tracking-wider text-white">
                YOUR WISHLIST IS EMPTY
              </h2>
              <p className="text-xs font-body text-slate-400 leading-relaxed max-w-md mx-auto">
                Save garments that embody your personal wardrobe aesthetic. Access your saved
                curations any time from this private gallery.
              </p>
            </div>
            <div className="pt-4">
              <Link
                href="/shop"
                className="inline-block px-8 py-4 bg-gradient-to-r from-[#E2C58A] to-[#C6A467] text-[#0A0B0E] font-heading text-xs font-black uppercase tracking-widest transition-all rounded-full shadow-glow-gold btn-shimmer"
              >
                DISCOVER THE COLLECTION
              </Link>
            </div>
          </div>
        ) : (
          /* Wishlist Grid */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-3.5 md:gap-4.5">
            {wishlist.map((item) => {
              const isItemBusy = busyItemId === item.id;

              return (
                <div
                  key={item.id}
                  className={`bg-[#13151C] border border-[#232733]/90 flex flex-col justify-between group relative transition-all duration-300 hover:border-[#E2C58A]/60 rounded-xl sm:rounded-2xl shadow-xl hover:shadow-[#E2C58A]/10 overflow-hidden ${
                    isItemBusy ? "opacity-50 pointer-events-none" : "opacity-100"
                  }`}
                >
                  {/* Image Container */}
                  <div className="relative aspect-[4/5] w-full bg-[#0A0B0E] overflow-hidden">
                    <Link href={`/product/${item.product_slug}`} className="block w-full h-full">
                      {item.image_url ? (
                        <Image
                          src={item.image_url}
                          alt={item.product_name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs font-heading uppercase text-slate-500 p-4 text-center">
                          TN78 COLLECTION
                        </div>
                      )}
                    </Link>

                    {/* Remove button */}
                    <button
                      type="button"
                      aria-label="Remove from wishlist"
                      onClick={() => handleRemove(item.id)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#0A0B0E]/80 backdrop-blur-sm border border-[#232733] flex items-center justify-center text-slate-400 hover:text-red-400 hover:border-red-500/50 transition-colors shadow-xs cursor-pointer"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>

                    {/* Category Tag */}
                    <div className="absolute bottom-3 left-3">
                      <span className="text-[9px] font-heading font-black uppercase tracking-widest bg-[#0A0B0E]/90 backdrop-blur-sm text-[#E2C58A] px-2.5 py-0.5 border border-[#232733] rounded-xs">
                        {item.category_name}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1">
                      <Link
                        href={`/product/${item.product_slug}`}
                        className="font-heading font-bold text-xs sm:text-sm uppercase tracking-wider text-white hover:text-[#E2C58A] transition-colors block line-clamp-1"
                      >
                        {item.product_name}
                      </Link>

                      <div className="flex items-baseline justify-between pt-0.5">
                        <span className="font-heading font-black text-xs sm:text-sm text-[#E2C58A]">
                          ₹{item.base_price.toLocaleString("en-IN")}
                        </span>
                        <span className="text-[9px] sm:text-[10px] font-mono text-emerald-400 uppercase font-bold">
                          AVAILABLE
                        </span>
                      </div>

                      {/* Saved Variant specification if present */}
                      {item.variant_id && (
                        <div className="text-[9px] font-heading uppercase text-slate-400 tracking-wider pt-0.5 truncate">
                          PRE-CONFIGURED
                        </div>
                      )}
                    </div>

                    {/* Action Buttons: WhatsApp Order & View Details */}
                    <div className="pt-1 space-y-1.5">
                      <a
                        href={`https://wa.me/917010418046?text=${encodeURIComponent(
                          `Hi TN 78 Men's Collection, I would like to order "${item.product_name}".`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 sm:py-3 bg-[#1B663E] hover:bg-[#15803D] text-white font-heading text-[10px] sm:text-[11px] font-bold uppercase tracking-wider transition-all rounded-full flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs active:scale-98"
                      >
                        <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                        </svg>
                        <span>INQUIRE / ORDER ON WHATSAPP</span>
                      </a>

                      <Link
                        href={`/product/${item.product_slug}`}
                        className="w-full py-2 bg-[#13151C] hover:bg-[#1E2330] text-slate-300 hover:text-white border border-[#232733] font-heading text-[10px] sm:text-[11px] font-bold uppercase tracking-wider rounded-full flex items-center justify-center transition-colors"
                      >
                        VIEW GARMENT DETAILS
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleRemove(item.id)}
                        className="w-full py-1 text-[9px] sm:text-[10px] font-heading uppercase tracking-wider text-slate-500 hover:text-red-400 transition-colors cursor-pointer text-center"
                      >
                        REMOVE
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
