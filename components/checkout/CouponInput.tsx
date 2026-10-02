"use client";

import React, { useState } from "react";
import { CouponSummaryDto } from "@/lib/api";

interface CouponInputProps {
  appliedCoupon?: CouponSummaryDto | null;
  discountAmount?: number;
  onApplyCoupon: (code: string) => Promise<void>;
  onRemoveCoupon: () => Promise<void>;
  isLoading?: boolean;
}

const AVAILABLE_PROMOS = [
  { code: "TN78LUX", desc: "Flat ₹500 off on ₹2,999+" },
  { code: "FREESHIP", desc: "Complimentary express delivery" },
];

export default function CouponInput({
  appliedCoupon,
  discountAmount = 0,
  onApplyCoupon,
  onRemoveCoupon,
  isLoading = false,
}: CouponInputProps) {
  const [code, setCode] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleApply = async (e: React.FormEvent, directCode?: string) => {
    if (e) e.preventDefault();
    setErrorMsg(null);
    const targetCode = (directCode || code).trim().toUpperCase();
    if (!targetCode) return;

    try {
      setIsSubmitting(true);
      await onApplyCoupon(targetCode);
      setCode("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Invalid coupon code.";
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemove = async () => {
    try {
      setIsSubmitting(true);
      setErrorMsg(null);
      await onRemoveCoupon();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to remove coupon.";
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#13151C] border border-[#232733] p-6 md:p-8 space-y-4 shadow-xl rounded-none md:rounded-xs">
      <div className="border-b border-[#232733] pb-4">
        <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-[#E2C58A]">
          STEP 03
        </span>
        <h2 className="font-heading font-extrabold text-lg md:text-xl uppercase tracking-wider text-[#F8FAFC] mt-0.5">
          PROMOTIONAL PRIVILEGE
        </h2>
      </div>

      {appliedCoupon ? (
        /* Applied Coupon State */
        <div className="p-4 bg-[#191D28] border border-[#E2C58A] flex items-center justify-between rounded-xs shadow-[0_0_15px_rgba(226,197,138,0.15)]">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-heading font-black text-xs uppercase tracking-wider px-2.5 py-0.5 bg-gradient-to-r from-[#E2C58A] to-[#C6A467] text-[#0A0B0E] rounded-xs shadow-xs">
                {appliedCoupon.code}
              </span>
              <span className="text-xs font-heading font-bold text-emerald-400">
                &minus;₹{discountAmount.toLocaleString("en-IN")} DEDUCTED
              </span>
            </div>
            <p className="text-[11px] font-body text-[#94A3B8]">
              {appliedCoupon.message}
            </p>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            disabled={isSubmitting || isLoading}
            className="text-[11px] font-heading font-bold uppercase tracking-wider text-[#94A3B8] hover:text-red-400 transition-colors disabled:opacity-40 cursor-pointer"
          >
            REMOVE
          </button>
        </div>
      ) : (
        /* Coupon Input Form */
        <div className="space-y-3">
          <form onSubmit={handleApply} className="space-y-2">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase());
                  if (errorMsg) setErrorMsg(null);
                }}
                placeholder="ENTER PROMO CODE (E.G. TN78LUX)"
                disabled={isSubmitting || isLoading}
                className="flex-1 bg-[#0A0B0E] border border-[#232733] px-4 py-3 text-xs uppercase tracking-wider font-heading text-[#F8FAFC] placeholder-[#64748B] focus:border-[#E2C58A] focus:bg-[#191D28] focus:outline-hidden transition-colors rounded-xs"
              />
              <button
                type="submit"
                disabled={!code.trim() || isSubmitting || isLoading}
                className="px-7 py-3 bg-gradient-to-r from-[#E2C58A] to-[#C6A467] hover:brightness-110 text-[#0A0B0E] font-heading text-xs font-black uppercase tracking-widest transition-all duration-200 rounded-xs disabled:opacity-40 cursor-pointer shadow-[0_0_15px_rgba(226,197,138,0.25)]"
              >
                {isSubmitting ? "APPLYING..." : "APPLY"}
              </button>
            </div>

            {errorMsg && (
              <div className="p-2.5 bg-red-950/50 border border-red-500/40 text-red-300 text-xs font-heading tracking-wide rounded-xs animate-fadeIn">
                {errorMsg}
              </div>
            )}
          </form>

          {/* Quick-click promo chips */}
          <div className="pt-2 border-t border-[#232733] space-y-1.5">
            <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-[#94A3B8] block">
              AVAILABLE OFFERS (CLICK TO APPLY):
            </span>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_PROMOS.map((promo) => (
                <button
                  key={promo.code}
                  type="button"
                  onClick={(e) => handleApply(e, promo.code)}
                  disabled={isSubmitting || isLoading}
                  className="px-2.5 py-1 bg-[#0A0B0E] hover:bg-[#191D28] border border-[#232733] hover:border-[#E2C58A]/50 text-[#F8FAFC] rounded-xs text-[10px] font-heading tracking-wider flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
                  title={promo.desc}
                >
                  <span className="font-bold text-[#E2C58A]">{promo.code}</span>
                  <span className="text-[#94A3B8] font-normal hidden sm:inline">&bull; {promo.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
