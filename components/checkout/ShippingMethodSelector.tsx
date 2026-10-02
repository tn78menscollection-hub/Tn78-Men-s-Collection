"use client";

import React from "react";
import { ShippingMethodDto } from "@/lib/api";

interface ShippingMethodSelectorProps {
  methods: ShippingMethodDto[];
  selectedCode: string | null;
  onSelectMethod: (code: string) => void;
  subtotal: number;
  isLoading?: boolean;
}

export default function ShippingMethodSelector({
  methods,
  selectedCode,
  onSelectMethod,
  subtotal,
  isLoading = false,
}: ShippingMethodSelectorProps) {
  const FREE_SHIPPING_THRESHOLD = 2000;
  const isFreeThresholdMet = subtotal >= FREE_SHIPPING_THRESHOLD;

  return (
    <div className="bg-[#13151C] border border-[#232733] p-6 md:p-8 space-y-6 shadow-xl rounded-none md:rounded-xs">
      {/* Header */}
      <div className="border-b border-[#232733] pb-4">
        <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-[#E2C58A]">
          STEP 02
        </span>
        <h2 className="font-heading font-extrabold text-lg md:text-xl uppercase tracking-wider text-[#F8FAFC] mt-0.5">
          SHIPPING METHOD
        </h2>
      </div>

      {/* Free shipping banner */}
      {isFreeThresholdMet ? (
        <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/40 flex items-center space-x-3 text-emerald-300 rounded-xs">
          <svg className="w-5 h-5 flex-shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-xs font-heading uppercase tracking-wide font-medium">
            YOUR ORDER QUALIFIES FOR COMPLIMENTARY EXPRESS DELIVERY (ORDERS &ge; ₹2,000)
          </span>
        </div>
      ) : (
        <div className="p-3.5 bg-[#0A0B0E] border border-[#232733] text-[#94A3B8] text-xs font-heading tracking-wide rounded-xs flex items-center justify-between">
          <span>
            ADD <strong className="text-[#F8FAFC]">₹{(FREE_SHIPPING_THRESHOLD - subtotal).toLocaleString("en-IN")}</strong> MORE TO UNLOCK COMPLIMENTARY DELIVERY.
          </span>
          <span className="text-[10px] uppercase font-mono text-[#E2C58A]">PAN-INDIA</span>
        </div>
      )}

      {/* Radio method list */}
      <div className="space-y-3">
        {methods.map((method) => {
          const isSelected = selectedCode?.toLowerCase() === method.code.toLowerCase();

          return (
            <label
              key={method.code}
              className={`flex items-start justify-between p-4 sm:p-5 border cursor-pointer transition-all duration-200 rounded-xs ${
                isSelected
                  ? "border-[#E2C58A] bg-[#191D28] shadow-[0_0_15px_rgba(226,197,138,0.15)] ring-1 ring-[#E2C58A]"
                  : "border-[#232733] bg-[#0A0B0E] hover:border-[#E2C58A]/50"
              }`}
            >
              <div className="flex items-start space-x-3 sm:space-x-4">
                <input
                  type="radio"
                  name="shipping_method"
                  value={method.code}
                  checked={isSelected}
                  onChange={() => onSelectMethod(method.code)}
                  disabled={isLoading}
                  className="mt-1 w-4 h-4 accent-[#E2C58A] bg-[#0A0B0E] border-[#232733]"
                />
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-heading font-bold text-xs sm:text-sm uppercase tracking-wider text-[#F8FAFC]">
                      {method.name}
                    </span>
                    {method.is_free && (
                      <span className="text-[9px] font-heading font-black uppercase tracking-widest px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-500/40 rounded-xs">
                        FREE
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] font-body text-[#94A3B8] leading-normal">
                    {method.description}
                  </p>
                  <div className="text-[10px] font-mono text-[#E2C58A] uppercase tracking-wide pt-0.5">
                    ESTIMATED TRANSIT: {method.estimated_days}
                  </div>
                </div>
              </div>

              <div className="text-right flex-shrink-0 pl-4">
                {method.is_free ? (
                  <span className="font-heading font-black text-xs sm:text-sm text-emerald-400 uppercase tracking-wide">
                    COMPLIMENTARY
                  </span>
                ) : (
                  <span className="font-heading font-bold text-xs sm:text-sm text-[#F8FAFC]">
                    ₹{method.cost.toLocaleString("en-IN")}
                  </span>
                )}
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
