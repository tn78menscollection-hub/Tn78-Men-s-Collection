"use client";

import React, { useState } from "react";

interface PointsRedemptionInputProps {
  userPointsBalance: number;
  pointsRedeemed: number;
  pointsDiscountAmount: number;
  onApplyPoints: (points: number) => Promise<void>;
  onRemovePoints: () => Promise<void>;
  isLoading?: boolean;
}

export default function PointsRedemptionInput({
  userPointsBalance,
  pointsRedeemed,
  pointsDiscountAmount,
  onApplyPoints,
  onRemovePoints,
  isLoading = false,
}: PointsRedemptionInputProps) {
  const [pointsInput, setPointsInput] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const parsed = parseInt(pointsInput.trim(), 10);
    if (isNaN(parsed) || parsed <= 0) {
      setErrorMsg("Please enter a valid points amount greater than 0.");
      return;
    }
    if (parsed > userPointsBalance) {
      setErrorMsg(`You can redeem up to ${userPointsBalance} points.`);
      return;
    }

    try {
      setIsSubmitting(true);
      await onApplyPoints(parsed);
      setPointsInput("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to apply rewards points.";
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemove = async () => {
    try {
      setIsSubmitting(true);
      setErrorMsg(null);
      await onRemovePoints();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to remove points.";
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUseMax = () => {
    setPointsInput(userPointsBalance.toString());
  };

  return (
    <div className="bg-[#13151C] border border-[#232733] p-6 md:p-8 space-y-4 shadow-xl rounded-none md:rounded-xs">
      <div className="border-b border-[#232733] pb-4 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-[#E2C58A]">
            STEP 04
          </span>
          <h2 className="font-heading font-extrabold text-lg md:text-xl uppercase tracking-wider text-[#F8FAFC] mt-0.5">
            LOYALTY REWARDS
          </h2>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-heading text-[#94A3B8] uppercase tracking-wider block">
            AVAILABLE BALANCE
          </span>
          <span className="font-heading font-bold text-sm text-[#E2C58A]">
            {userPointsBalance} PTS (₹{userPointsBalance})
          </span>
        </div>
      </div>

      {pointsRedeemed > 0 ? (
        /* Applied Points State */
        <div className="p-4 bg-[#191D28] border border-[#E2C58A] flex items-center justify-between rounded-xs shadow-[0_0_15px_rgba(226,197,138,0.15)]">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-heading font-black text-xs uppercase tracking-wider px-2.5 py-0.5 bg-gradient-to-r from-[#E2C58A] to-[#C6A467] text-[#0A0B0E] rounded-xs shadow-xs">
                {pointsRedeemed} PTS APPLIED
              </span>
              <span className="text-xs font-heading font-bold text-emerald-400">
                &minus;₹{pointsDiscountAmount.toLocaleString("en-IN")} DEDUCTED
              </span>
            </div>
            <p className="text-[11px] font-body text-[#94A3B8]">
              1 point = ₹1 redemption applied directly to your order settlement.
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
      ) : userPointsBalance > 0 ? (
        /* Points Input Form */
        <form onSubmit={handleApply} className="space-y-2">
          <p className="text-xs font-body text-[#94A3B8]">
            Redeem your accrued loyalty points (1 pt = ₹1) towards this order.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="number"
                min="1"
                max={userPointsBalance}
                value={pointsInput}
                onChange={(e) => {
                  setPointsInput(e.target.value);
                  setErrorMsg(null);
                }}
                placeholder={`Enter points (up to ${userPointsBalance})`}
                disabled={isSubmitting || isLoading}
                className="w-full bg-[#0A0B0E] border border-[#232733] px-4 py-3 text-xs font-mono text-[#F8FAFC] uppercase tracking-wider focus:outline-hidden focus:border-[#E2C58A] focus:bg-[#191D28] transition-colors rounded-xs disabled:opacity-50"
              />
              <button
                type="button"
                onClick={handleUseMax}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-heading font-bold uppercase text-[#E2C58A] hover:text-[#F8FAFC] transition-colors cursor-pointer"
              >
                USE MAX
              </button>
            </div>
            <button
              type="submit"
              disabled={!pointsInput.trim() || isSubmitting || isLoading}
              className="px-6 py-3 bg-gradient-to-r from-[#E2C58A] to-[#C6A467] hover:brightness-110 text-[#0A0B0E] font-heading text-xs font-black uppercase tracking-wider rounded-xs disabled:opacity-40 transition-all shadow-[0_0_15px_rgba(226,197,138,0.25)] cursor-pointer"
            >
              {isSubmitting ? "APPLYING..." : "REDEEM"}
            </button>
          </div>

          {errorMsg && (
            <p className="text-[11px] font-heading text-red-400 mt-1">{errorMsg}</p>
          )}
        </form>
      ) : (
        /* Zero Balance State */
        <div className="p-3 bg-[#0A0B0E] border border-[#232733] text-xs text-[#94A3B8] font-body rounded-xs">
          You currently have 0 rewards points. Earn 1 point for every ₹100 spent on completed orders.
        </div>
      )}
    </div>
  );
}
