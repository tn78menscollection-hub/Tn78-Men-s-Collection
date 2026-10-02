"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CartItemDto, CouponSummaryDto, ShippingMethodDto } from "@/lib/api";

export interface OrderSummaryProps {
  items: CartItemDto[];
  subtotal: number;
  discountAmount?: number;
  appliedCoupon?: CouponSummaryDto | null;
  pointsDiscountAmount?: number;
  pointsRedeemed?: number;
  shippingMethod?: ShippingMethodDto | null;
  shippingCost?: number;
  isGiftPackage?: boolean;
  giftPackageFee?: number;
  total: number;
  hasAddress: boolean;
  hasShippingMethod: boolean;
  isReadyForPayment?: boolean;
  isLoading?: boolean;
  onContinueToPayment?: () => void;
}

export default function OrderSummary({
  items,
  subtotal,
  discountAmount = 0,
  appliedCoupon,
  pointsDiscountAmount = 0,
  pointsRedeemed = 0,
  shippingMethod,
  shippingCost = 0,
  isGiftPackage = false,
  giftPackageFee = 0,
  total,
  hasAddress,
  hasShippingMethod,
  isReadyForPayment = false,
  isLoading = false,
  onContinueToPayment,
}: OrderSummaryProps) {
  const canProceed = hasAddress && hasShippingMethod && items.length > 0 && !isLoading;
  const totalSavings = discountAmount + pointsDiscountAmount;
  // Compute approximate 12% GST portion included in the order
  const estimatedGst = Math.round((total * 12) / 112);

  return (
    <div className="bg-[#13151C] border border-[#232733] p-6 sm:p-8 space-y-6 shadow-xl rounded-none md:rounded-xs">
      {/* Title */}
      <div>
        <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-[#E2C58A]">
          ORDER SUMMARY
        </span>
        <h2 className="font-heading font-extrabold text-xl uppercase tracking-wider text-[#F8FAFC] mt-1">
          ORDER BREAKDOWN
        </h2>
      </div>

      {/* Compact Line Items List */}
      <div className="border-t border-b border-[#232733] divide-y divide-[#232733] max-h-80 overflow-y-auto pr-1">
        {items.map((item) => (
          <div key={item.id} className="py-3.5 flex items-center space-x-4">
            {/* Thumbnail */}
            <div className="relative w-14 h-18 sm:w-16 sm:h-20 shrink-0 bg-[#0A0B0E] border border-[#232733] overflow-hidden rounded-xs">
              {item.image_url ? (
                <Image
                  src={item.image_url}
                  alt={item.product_name}
                  fill
                  unoptimized
                  sizes="64px"
                  className="object-cover object-top"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[9px] font-heading text-[#64748B] p-1 text-center">
                  TN78
                </div>
              )}
            </div>

            {/* Meta */}
            <div className="flex-1 min-w-0">
              <Link
                href={`/product/${item.product_slug}`}
                className="font-heading font-bold text-xs uppercase tracking-wider text-[#F8FAFC] hover:text-[#E2C58A] transition-colors truncate block"
              >
                {item.product_name}
              </Link>
              <div className="text-[10px] font-heading text-[#94A3B8] mt-0.5 space-x-2">
                <span>SIZE: <strong className="text-[#E2C58A]">{item.size}</strong></span>
                <span>&bull;</span>
                <span>QTY: {item.quantity}</span>
              </div>
              {item.customization_note && (
                <div className="mt-1 px-1.5 py-0.5 bg-[#191D28] border border-[#E2C58A]/30 rounded-xs text-[9px] font-mono text-[#E2C58A] truncate">
                  ✦ {item.customization_note}
                </div>
              )}
              <div className="text-[10px] font-mono text-[#64748B] mt-0.5">
                ₹{item.unit_price.toLocaleString("en-IN")} each
              </div>
            </div>

            {/* Line Total */}
            <div className="text-right shrink-0">
              <span className="font-heading font-bold text-xs sm:text-sm text-[#F8FAFC]">
                ₹{item.line_total.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Cost Calculations */}
      <div className="space-y-3 text-xs font-heading">
        <div className="flex justify-between text-[#94A3B8]">
          <span>BAG SUBTOTAL</span>
          <span className="font-bold text-[#F8FAFC]">
            ₹{subtotal.toLocaleString("en-IN")}
          </span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-emerald-400">
            <span className="flex items-center space-x-1">
              <span>COUPON DISCOUNT</span>
              {appliedCoupon && (
                <span className="text-[10px] px-1.5 py-0.2 bg-emerald-950 border border-emerald-500/40 text-emerald-300 rounded-xs">
                  {appliedCoupon.code}
                </span>
              )}
            </span>
            <span className="font-bold">
              &minus;₹{discountAmount.toLocaleString("en-IN")}
            </span>
          </div>
        )}

        {pointsDiscountAmount > 0 && (
          <div className="flex justify-between text-[#E2C58A]">
            <span className="flex items-center space-x-1">
              <span>LOYALTY REWARDS</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-[#0A0B0E] border border-[#E2C58A]/40 text-[#E2C58A] rounded-xs">
                {pointsRedeemed} PTS
              </span>
            </span>
            <span className="font-bold">
              &minus;₹{pointsDiscountAmount.toLocaleString("en-IN")}
            </span>
          </div>
        )}

        <div className="flex justify-between text-[#94A3B8]">
          <span>EXPRESS DISPATCH</span>
          {shippingMethod ? (
            shippingCost === 0 ? (
              <span className="font-bold text-emerald-400 tracking-wider">
                COMPLIMENTARY
              </span>
            ) : (
              <span className="font-bold text-[#F8FAFC]">
                ₹{shippingCost.toLocaleString("en-IN")}
              </span>
            )
          ) : (
            <span className="text-[#64748B]">CALCULATED IN STEP 2</span>
          )}
        </div>

        {isGiftPackage && (
          <div className="flex justify-between text-[#E2C58A] items-center">
            <span className="flex items-center space-x-1.5 font-bold">
              <span>✦ LUXURY GIFT PACKAGING</span>
            </span>
            <span className="font-bold">
              {giftPackageFee > 0 ? (
                `+₹${giftPackageFee.toLocaleString("en-IN")}`
              ) : (
                <span className="text-emerald-400 tracking-wider">COMPLIMENTARY</span>
              )}
            </span>
          </div>
        )}

        <div className="flex justify-between text-[#94A3B8] pt-1 text-[11px] border-t border-[#232733]">
          <span>TAXES (GST COMPLIANT)</span>
          <span className="font-mono text-[#64748B]">Incl. 12% GST (~₹{estimatedGst.toLocaleString("en-IN")})</span>
        </div>
      </div>

      {/* Savings Callout Banner */}
      {totalSavings > 0 && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xs flex items-center justify-between text-xs font-heading text-emerald-300">
          <span className="font-bold uppercase tracking-wider">TOTAL SAVINGS</span>
          <span className="font-mono font-black">₹{totalSavings.toLocaleString("en-IN")}</span>
        </div>
      )}

      {/* Grand Total */}
      <div className="border-t border-[#232733] pt-4 flex justify-between items-baseline">
        <div>
          <span className="font-heading font-bold text-sm uppercase tracking-wider text-[#F8FAFC] block">
            ESTIMATED TOTAL
          </span>
          <span className="text-[10px] text-[#64748B] font-mono">
            ALL-INCLUSIVE BESPOKE SETTLEMENT
          </span>
        </div>
        <span className="font-heading font-black text-2xl text-[#E2C58A] tracking-wide">
          ₹{total.toLocaleString("en-IN")}
        </span>
      </div>

      {/* Continue to Payment CTA */}
      <div className="space-y-2.5 pt-2">
        <button
          type="button"
          onClick={onContinueToPayment}
          disabled={!canProceed}
          className="w-full py-4 bg-gradient-to-r from-[#E2C58A] to-[#C6A467] hover:brightness-110 text-[#0A0B0E] font-heading text-xs font-black uppercase tracking-widest transition-all duration-200 rounded-full shadow-[0_0_20px_rgba(226,197,138,0.3)] flex items-center justify-center space-x-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <span>CONTINUE TO PAYMENT</span>
          <span>&rarr;</span>
        </button>

        {!canProceed && (
          <p className="text-[10px] font-heading text-[#64748B] text-center uppercase tracking-wide">
            {!hasAddress
              ? "Please provide delivery address to proceed"
              : !hasShippingMethod
              ? "Please select a shipping method to proceed"
              : "Items required in bag to proceed"}
          </p>
        )}
      </div>

      {/* Prepaid Only Notice Banner */}
      <div className="p-3 bg-[#0A0B0E] border border-[#232733] rounded-xs space-y-1">
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="text-[#E2C58A] font-bold flex items-center gap-1.5">
            <span>⚡</span>
            <span>PREPAID DISPATCH ONLY</span>
          </span>
          <span className="text-red-400 font-bold uppercase text-[9.5px] bg-red-950/40 px-1.5 py-0.5 border border-red-900/40 rounded-xs">
            NO COD
          </span>
        </div>
        <p className="text-[10px] text-[#94A3B8] font-body leading-tight">
          Prepaid online payment via UPI / Card required. Orders dispatch within 24 hours with transit insurance.
        </p>
      </div>

      {/* Assurance Icons / Badges */}
      <div className="border-t border-[#232733] pt-4 space-y-2 text-[11px] font-heading text-[#94A3B8]">
        <div className="flex items-center space-x-2">
          <span className="text-[#E2C58A] font-bold">&bull;</span>
          <span>⚡ 100% Prepaid Online Dispatch &bull; No Cash on Delivery (COD)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-[#E2C58A] font-bold">&bull;</span>
          <span>256-bit encrypted SSL checkout &amp; UPI gateway</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-[#E2C58A] font-bold">&bull;</span>
          <span>Pan-India insured express air courier from South Hub</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-[#E2C58A] font-bold">&bull;</span>
          <span>7-day doorstep luxury exchange window</span>
        </div>
      </div>
    </div>
  );
}
