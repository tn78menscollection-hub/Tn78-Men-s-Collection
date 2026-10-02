"use client";

import React, { useState } from "react";
import {
  PaymentCreateResponse,
  PaymentVerifyResponse,
  verifyUpiPayment,
} from "@/lib/api";

interface PaymentModalProps {
  isOpen: boolean;
  orderData: PaymentCreateResponse | null;
  onSuccess: (verifyResponse: PaymentVerifyResponse) => void;
  onFailure: (errorMsg: string) => void;
  onClose: () => void;
}

type PaymentTab = "upi" | "card";

export default function PaymentModal({
  isOpen,
  orderData,
  onSuccess,
  onFailure,
  onClose,
}: PaymentModalProps) {
  const [activeTab, setActiveTab] = useState<PaymentTab>("upi");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [utrError, setUtrError] = useState<string | null>(null);
  const [copiedVpa, setCopiedVpa] = useState<boolean>(false);
  const [upiUtr, setUpiUtr] = useState<string>("");

  if (!isOpen || !orderData) return null;

  const VPA_ID = process.env.NEXT_PUBLIC_UPI_VPA || "";
  const upiUri = `upi://pay?pa=${VPA_ID}&pn=TN78%20Mens%20Wear&am=${orderData.amount.toFixed(2)}&cu=INR&tn=Order%20${encodeURIComponent(orderData.gateway_order_id)}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(upiUri)}&color=0a0b0e&bgcolor=ffffff&margin=6`;

  const handleCopyVpa = () => {
    navigator.clipboard.writeText(VPA_ID);
    setCopiedVpa(true);
    setTimeout(() => setCopiedVpa(false), 2000);
  };

  // Confirm and verify direct UPI payment with mandatory 12-digit UTR
  const handleConfirmUpiPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setUtrError(null);
    setModalError(null);

    const cleanUtr = upiUtr.trim().replace(/\s/g, "");
    if (!cleanUtr) {
      setUtrError("Please enter your 12-digit UPI Reference / UTR Number after completing payment in your UPI app.");
      return;
    }

    if (!/^\d{12}$/.test(cleanUtr) || cleanUtr.length < 10) {
      setUtrError("Please enter a valid 12-digit numeric UPI UTR number (found on your payment receipt screen).");
      return;
    }

    try {
      setIsProcessing(true);
      const verifyRes = await verifyUpiPayment({
        gateway_order_id: orderData.gateway_order_id,
        upi_utr: cleanUtr,
        guest_email: orderData.customer_email || undefined,
      });

      if (verifyRes.status === "captured") {
        onSuccess(verifyRes);
      } else {
        throw new Error("Payment could not be verified. Please verify the UTR number.");
      }
    } catch (err: unknown) {
      console.error("UPI verification failed:", err);
      const msg = err instanceof Error ? err.message : "Failed to verify UPI payment. Please ensure you entered the correct UTR.";
      setModalError(msg);
      onFailure(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#13151C] border border-[#232733] max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl rounded-none md:rounded-xs relative max-h-[92vh] overflow-y-auto">
        {/* Close Icon */}
        <button
          type="button"
          onClick={onClose}
          disabled={isProcessing}
          className="absolute top-5 right-5 text-[#94A3B8] hover:text-[#F8FAFC] transition-colors disabled:opacity-30 p-1 cursor-pointer"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
            <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-[#E2C58A]">
              SECURE PREPAID DISPATCH &bull; ORDER SETTLEMENT
            </span>
          </div>
          <h3 className="font-heading font-black text-xl uppercase tracking-wider text-[#F8FAFC]">
            COMPLETE ORDER SETTLEMENT
          </h3>
        </div>

        {/* Order Details Card */}
        <div className="p-4 bg-[#0A0B0E] border border-[#232733] space-y-2.5 rounded-xs">
          <div className="flex justify-between items-baseline">
            <span className="text-xs font-heading uppercase text-[#94A3B8]">
              EXACT AMOUNT PAYABLE
            </span>
            <span className="font-heading font-black text-2xl text-[#E2C58A] tracking-wide">
              ₹{orderData.amount.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="border-t border-[#232733] pt-2 space-y-1 text-[11px] font-mono text-[#94A3B8]">
            <div className="flex justify-between">
              <span>ORDER REFERENCE:</span>
              <span className="truncate max-w-[220px] text-[#F8FAFC]">{orderData.gateway_order_id}</span>
            </div>
            {orderData.customer_name && (
              <div className="flex justify-between">
                <span>CLIENT NAME:</span>
                <span className="text-[#F8FAFC] font-body">{orderData.customer_name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Payment Methods Tabs */}
        <div className="border-b border-[#232733] flex space-x-4">
          <button
            type="button"
            onClick={() => setActiveTab("upi")}
            className={`pb-2.5 text-xs font-heading font-bold uppercase tracking-wider transition-colors relative cursor-pointer ${
              activeTab === "upi"
                ? "text-[#E2C58A] border-b-2 border-[#E2C58A]"
                : "text-[#94A3B8] hover:text-[#F8FAFC]"
            }`}
          >
            UPI / QR CODE (RECOMMENDED)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("card")}
            className={`pb-2.5 text-xs font-heading font-bold uppercase tracking-wider transition-colors relative cursor-pointer ${
              activeTab === "card"
                ? "text-[#E2C58A] border-b-2 border-[#E2C58A]"
                : "text-[#94A3B8] hover:text-[#F8FAFC]"
            }`}
          >
            CARDS &amp; NETBANKING
          </button>
        </div>

        {/* Tab 1: UPI & QR Code */}
        {activeTab === "upi" && (
          <form onSubmit={handleConfirmUpiPayment} className="space-y-4 pt-1">
            {/* Step 1: QR & VPA */}
            <div className="flex flex-col sm:flex-row items-center gap-5 p-4 bg-[#0A0B0E] border border-[#232733] rounded-xs">
              <div className="w-32 h-32 bg-white p-2 border border-[#232733] flex flex-col items-center justify-center shrink-0 shadow-lg rounded-xs relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrUrl}
                  alt="Scan to Pay via UPI"
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>

              <div className="space-y-2 flex-1 text-center sm:text-left">
                <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-[#E2C58A] block">
                  STEP 1: SCAN QR OR COPY UPI ID
                </span>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <code className="text-xs font-mono font-bold text-[#F8FAFC] bg-[#191D28] px-2.5 py-1.5 border border-[#232733] rounded-xs break-all select-all">
                    {VPA_ID}
                  </code>
                  <button
                    type="button"
                    onClick={handleCopyVpa}
                    className="text-[10px] font-heading font-bold uppercase tracking-wider px-2.5 py-1.5 bg-gradient-to-r from-[#E2C58A] to-[#C6A467] text-[#0A0B0E] rounded-xs hover:brightness-110 transition-all cursor-pointer font-black shrink-0"
                  >
                    {copiedVpa ? "COPIED" : "COPY"}
                  </button>
                </div>
                <p className="text-[11px] font-body text-[#94A3B8] leading-relaxed">
                  Pay with <strong className="text-[#F8FAFC]">Google Pay, PhonePe, Paytm</strong>, or any UPI app. Pre-filled amount: <strong className="text-[#E2C58A]">₹{orderData.amount.toLocaleString("en-IN")}</strong>.
                </p>
              </div>
            </div>

            {/* Mobile Direct UPI Intent Button */}
            <a
              href={upiUri}
              className="block sm:hidden w-full py-2.5 px-3 bg-gradient-to-r from-[#E2C58A] to-[#C6A467] text-[#0A0B0E] font-heading font-black text-center text-xs uppercase tracking-wider rounded-xs hover:brightness-110 transition-all shadow-sm"
            >
              TAP TO OPEN GOOGLE PAY / PHONEPE (MOBILE)
            </a>

            {/* Step 2: Enter 12-digit UTR Number */}
            <div className="p-4 bg-[#0A0B0E] border border-[#E2C58A]/50 rounded-xs space-y-3">
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-[#E2C58A] text-[#0A0B0E] font-heading font-black text-[11px] flex items-center justify-center shrink-0">
                  2
                </span>
                <span className="font-heading font-black text-xs uppercase tracking-wider text-[#F8FAFC]">
                  ENTER 12-DIGIT TRANSACTION REF / UTR NUMBER
                </span>
              </div>
              <p className="text-[11px] text-[#94A3B8] font-body leading-relaxed">
                After completing payment in Google Pay / PhonePe, find the <strong className="text-[#F8FAFC]">12-digit UPI transaction ID / UTR</strong> in your payment details and enter it below.
              </p>

              <div>
                <input
                  type="text"
                  maxLength={16}
                  value={upiUtr}
                  onChange={(e) => {
                    setUpiUtr(e.target.value.replace(/[^0-9a-zA-Z]/g, ""));
                    setUtrError(null);
                    setModalError(null);
                  }}
                  placeholder="e.g. 426189123456 (12 Digits)"
                  className="w-full bg-[#191D28] border border-[#232733] focus:border-[#E2C58A] px-4 py-3 text-sm text-[#F8FAFC] font-mono tracking-widest placeholder:text-[#64748B] focus:outline-hidden rounded-xs"
                />
                {utrError && (
                  <p className="text-xs text-red-400 font-heading mt-1.5">{utrError}</p>
                )}
                <div className="flex items-center justify-between text-[10px] font-mono text-[#64748B] mt-1.5">
                  <span>Google Pay: &ldquo;UPI transaction ID&rdquo;</span>
                  <span>PhonePe / Paytm: &ldquo;UTR&rdquo;</span>
                </div>
              </div>
            </div>

            {/* Error Display */}
            {modalError && (
              <div className="p-3 bg-red-950/50 border border-red-500/40 text-red-300 text-xs font-heading tracking-wide rounded-xs">
                {modalError}
              </div>
            )}

            {/* Action Controls */}
            <div className="space-y-2.5 pt-1">
              <button
                type="submit"
                disabled={isProcessing || upiUtr.trim().length < 10}
                className="w-full py-4 bg-gradient-to-r from-[#E2C58A] to-[#C6A467] hover:brightness-110 text-[#0A0B0E] font-heading text-xs font-black uppercase tracking-widest transition-all duration-200 rounded-full shadow-[0_0_20px_rgba(226,197,138,0.3)] flex items-center justify-center space-x-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#0A0B0E] border-t-transparent rounded-full animate-spin" />
                    <span>VERIFYING PAYMENT UTR...</span>
                  </>
                ) : (
                  <span>SUBMIT UPI PAYMENT &amp; CONFIRM ORDER</span>
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                disabled={isProcessing}
                className="w-full py-2.5 text-[#94A3B8] hover:text-[#F8FAFC] font-heading text-xs uppercase tracking-wider transition-colors cursor-pointer text-center"
              >
                CANCEL &amp; RETURN TO CHECKOUT
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Cards & Netbanking */}
        {activeTab === "card" && (
          <div className="space-y-4 pt-2">
            <div className="p-4 bg-[#0A0B0E] border border-[#232733] rounded-xs space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-[#E2C58A] font-bold text-sm">ℹ</span>
                <span className="font-heading font-bold text-xs uppercase tracking-wider text-[#F8FAFC]">
                  DIRECT UPI SETTLEMENT PREFERRED
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] font-body leading-relaxed">
                For the fastest processing and immediate courier dispatch, please use <strong className="text-[#E2C58A]">UPI / QR Code</strong> to pay directly via Google Pay, PhonePe, or Paytm.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab("upi")}
                className="px-5 py-2.5 bg-gradient-to-r from-[#E2C58A] to-[#C6A467] text-[#0A0B0E] font-heading text-xs font-black uppercase tracking-wider rounded-full hover:brightness-110 cursor-pointer"
              >
                SWITCH TO UPI / QR CODE &rarr;
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 text-[#94A3B8] hover:text-[#F8FAFC] font-heading text-xs uppercase tracking-wider transition-colors cursor-pointer text-center"
            >
              CANCEL &amp; RETURN TO CHECKOUT
            </button>
          </div>
        )}

        {/* Footer Security Copy */}
        <div className="border-t border-[#232733] pt-3 text-[10px] font-heading text-[#94A3B8] uppercase tracking-wide text-center space-y-1">
          <p>100% PREPAID DISPATCH &bull; NO CASH ON DELIVERY</p>
          <p className="text-[#E2C58A]">Orders are confirmed upon receipt of valid 12-digit payment reference.</p>
        </div>
      </div>
    </div>
  );
}
