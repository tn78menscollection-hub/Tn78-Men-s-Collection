"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { OrderOut, lookupGuestOrder, getOrderInvoicePdfUrl, ApiError } from "@/lib/api";

const ORDER_STEPS = [
  {
    key: "confirmed",
    label: "Confirmed",
    subtitle: "Settlement Authenticated",
    desc: "Payment verified & garment textiles reserved at Tirupur Center.",
  },
  {
    key: "processing",
    label: "Tailoring & QC",
    subtitle: "Craftsmanship & Inspection",
    desc: "Hand-finishing, buttoning, press finishing, and archival sleeve packaging.",
  },
  {
    key: "dispatched",
    label: "Dispatched",
    subtitle: "Express Air Courier",
    desc: "Handed over to BlueDart / Delhivery Express Air with AWB tracking.",
  },
  {
    key: "delivered",
    label: "Delivered",
    subtitle: "Arrived at Destination",
    desc: "Signature acknowledged at recipient destination.",
  },
];

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialOrderNumber = searchParams.get("order_number") || "";
  const initialEmail = searchParams.get("email") || "";

  const [orderNumber, setOrderNumber] = useState<string>(initialOrderNumber);
  const [email, setEmail] = useState<string>(initialEmail);
  const [order, setOrder] = useState<OrderOut | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<boolean>(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState<boolean>(false);
  const [whatsAppSent, setWhatsAppSent] = useState<boolean>(false);

  const handleLookup = async (num: string, mail: string) => {
    if (!num.trim() || !mail.trim()) {
      setErrorMsg("Please enter both your Order Identifier and Purchaser Email Address.");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMsg(null);
      const res = await lookupGuestOrder(num, mail);
      setOrder(res);
    } catch (err: unknown) {
      console.error("Order lookup error:", err);
      setOrder(null);
      if (err instanceof ApiError && err.status === 404) {
        setErrorMsg("No order record found matching this identifier and email. Please verify your confirmation receipt.");
      } else {
        const message = err instanceof Error ? err.message : "Failed to retrieve dispatch record. Please try again.";
        setErrorMsg(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderNumber && initialEmail) {
      handleLookup(initialOrderNumber, initialEmail);
    }
  }, [initialOrderNumber, initialEmail]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLookup(orderNumber, email);
  };

  const copyOrderNumber = () => {
    if (!order) return;
    navigator.clipboard.writeText(order.order_number);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Determine active step index
  const getStepIndex = (status: string) => {
    const s = status.toLowerCase();
    if (s === "delivered") return 3;
    if (s === "dispatched" || s === "shipped") return 2;
    if (s === "processing") return 1;
    return 0; // confirmed
  };

  const activeStep = order ? getStepIndex(order.status) : 0;

  // Format estimated delivery date (from backend estimate or fallback)
  const getEstimatedDeliveryDate = (estDate?: string | null, dateStr?: string) => {
    if (estDate) {
      const d = new Date(estDate);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString("en-IN", {
          weekday: "long",
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      }
      return estDate;
    }
    const base = dateStr ? new Date(dateStr) : new Date();
    base.setDate(base.getDate() + 3);
    return base.toLocaleDateString("en-IN", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12 pb-24 space-y-10">
      {/* Editorial Header */}
      <div className="text-center space-y-3 pb-2">
        <span className="text-[10px] font-heading font-extrabold uppercase tracking-widest text-[#E2C58A] bg-[#E2C58A]/10 border border-[#E2C58A]/20 px-3 py-1 rounded-full inline-block">
          Client Services &bull; Post-Purchase Concierge
        </span>
        <h1 className="font-heading font-black text-2xl sm:text-3xl md:text-4xl uppercase tracking-wider text-[#F8FAFC]">
          Track Order &amp; Dispatch
        </h1>
        <p className="text-xs sm:text-sm font-body text-[#94A3B8] max-w-lg mx-auto leading-relaxed">
          Monitor your handcrafted TN78 garments from tailoring and QC inspection to express national air delivery.
        </p>
      </div>

      {/* Lookup Card */}
      <div className="bg-[#13151C] border border-[#232733] p-6 sm:p-8 rounded-2xl shadow-xl space-y-6">
        <div className="border-b border-[#232733] pb-4">
          <h2 className="font-heading font-black text-xs uppercase tracking-widest text-[#F8FAFC]">
            Order Lookup
          </h2>
          <p className="text-[11px] font-body text-[#94A3B8] mt-0.5">
            Enter the order identifier from your confirmation receipt along with your email.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-heading font-bold uppercase tracking-widest text-[#94A3B8] mb-1.5">
                Order Identifier *
              </label>
              <input
                type="text"
                placeholder="e.g. TN78-20260905-A1B2C3"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="w-full bg-[#0A0B0E] border border-[#232733] rounded-xl px-4 py-3 text-xs font-mono text-[#F8FAFC] placeholder-[#64748B] focus:bg-[#191D28] focus:border-[#E2C58A] focus:ring-1 focus:ring-[#E2C58A]/30 focus:outline-none uppercase transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-heading font-bold uppercase tracking-widest text-[#94A3B8] mb-1.5">
                Purchaser Email Address *
              </label>
              <input
                type="email"
                placeholder="e.g. client@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0A0B0E] border border-[#232733] rounded-xl px-4 py-3 text-xs font-mono text-[#F8FAFC] placeholder-[#64748B] focus:bg-[#191D28] focus:border-[#E2C58A] focus:ring-1 focus:ring-[#E2C58A]/30 focus:outline-none transition-all"
                required
              />
            </div>
          </div>

          {errorMsg && (
            <div className="p-4 bg-red-950/50 border border-red-500/40 text-red-300 text-xs font-body rounded-xl leading-relaxed flex items-center space-x-2">
              <span className="font-bold text-red-400">Notice:</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#E2C58A] to-[#C6A467] hover:brightness-110 text-[#0A0B0E] font-heading text-xs font-black uppercase tracking-widest rounded-full shadow-[0_0_20px_rgba(226,197,138,0.3)] transition-all duration-150 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? "Locating Order Record..." : "Inquire Dispatch Status"}
            </button>

            <span className="text-[11px] font-body text-[#94A3B8]">
              Need assistance?{" "}
              <Link href="/support" className="text-[#E2C58A] font-semibold hover:underline">
                Client Concierge
              </Link>
            </span>
          </div>
        </form>
      </div>

      {order && (
        <div className="space-y-8 animate-fadeIn">
          {/* Main Status & Stepper Card */}
          <div className="bg-[#13151C] border border-[#232733] rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-[#232733] pb-5 gap-3">
              <div>
                <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-[#94A3B8] block mb-1">
                  Commission Identifier
                </span>
                <div className="flex items-center space-x-3">
                  <h2 className="font-heading font-black text-xl sm:text-2xl text-[#F8FAFC] uppercase tracking-wider">
                    {order.order_number}
                  </h2>
                  <button
                    onClick={copyOrderNumber}
                    className="px-2.5 py-1 text-[10px] font-heading uppercase tracking-wider bg-[#0A0B0E] border border-[#232733] rounded-md text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#E2C58A]/50 transition-colors cursor-pointer"
                  >
                    {copiedId ? "✓ Copied" : "Copy"}
                  </button>
                </div>
              </div>

              <div className="flex items-center flex-wrap gap-2.5">
                <a
                  href={getOrderInvoicePdfUrl(order.order_number)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0A0B0E] hover:bg-[#191D28] border border-[#232733] hover:border-[#E2C58A]/50 text-[#E2C58A] hover:text-[#F8FAFC] text-[10px] font-heading font-bold uppercase tracking-wider rounded-full transition-all shadow-xs"
                >
                  <svg className="w-3.5 h-3.5 text-[#E2C58A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>GST Tax Invoice (PDF)</span>
                </a>
                <div className="flex items-center space-x-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="font-heading font-black text-xs uppercase tracking-widest px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-500/40 rounded-full">
                    {order.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Courier & Estimated Delivery Callout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-[#0A0B0E] rounded-xl border border-[#232733]">
              <div>
                <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-[#94A3B8] block mb-0.5">
                  Expected Delivery
                </span>
                <p className="text-xs font-heading font-bold text-[#F8FAFC]">
                  {getEstimatedDeliveryDate(order.estimated_delivery_date, order.created_at)}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-[#94A3B8] block mb-0.5">
                  National Air Courier
                </span>
                <p className="text-xs font-heading font-bold text-[#F8FAFC] flex items-center space-x-1.5">
                  <span>{order.courier_partner || "BlueDart Express Air"}</span>
                  <span className="text-[9px] px-1.5 py-0.2 bg-[#191D28] text-[#E2C58A] rounded border border-[#232733]">Insured</span>
                </p>
              </div>
              <div>
                <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-[#94A3B8] block mb-0.5">
                  Consignment AWB
                </span>
                <p className="text-xs font-mono font-bold text-[#E2C58A]">
                  {order.tracking_number || (activeStep >= 2 ? `BLR${order.order_number.replace(/[^0-9]/g, "").slice(0, 7) || "8941029"}IN` : "Assigned On Dispatch")}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-[#94A3B8] block mb-0.5">
                  Payment Mode
                </span>
                <p className="text-xs font-heading font-bold text-emerald-400 flex items-center space-x-1">
                  <span>⚡ 100% Prepaid</span>
                  <span className="text-[10px] text-red-400 font-semibold">(No COD)</span>
                </p>
              </div>
            </div>

            {/* Logistics & Delivery Notes If Available */}
            {order.delivery_notes && (
              <div className="p-3.5 bg-[#191D28]/70 border border-[#232733] rounded-xl text-xs space-y-1">
                <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-[#E2C58A] block">
                  Logistics &amp; Courier Notes:
                </span>
                <p className="text-slate-300 font-body text-xs">{order.delivery_notes}</p>
              </div>
            )}

            {/* Visual 4-Stage Stepper */}
            <div className="space-y-3 pt-2">
              <span className="text-[10px] font-heading font-extrabold uppercase tracking-widest text-[#94A3B8] block">
                Fulfillment Timeline
              </span>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {ORDER_STEPS.map((step, idx) => {
                  const isCompleted = idx <= activeStep;
                  const isCurrent = idx === activeStep;
                  return (
                    <div
                      key={step.key}
                      className={`p-4 rounded-xl border transition-all ${
                        isCurrent
                          ? "bg-[#191D28] border-[#E2C58A] shadow-[0_0_15px_rgba(226,197,138,0.15)] ring-1 ring-[#E2C58A]"
                          : isCompleted
                          ? "bg-[#0A0B0E] border-[#232733]"
                          : "bg-[#0A0B0E]/60 border-[#232733]/50 opacity-50"
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-heading font-black ${
                            isCompleted
                              ? "bg-gradient-to-r from-[#E2C58A] to-[#C6A467] text-[#0A0B0E]"
                              : "bg-[#191D28] text-[#94A3B8]"
                          }`}
                        >
                          {isCompleted ? "✓" : idx + 1}
                        </span>
                        <span className="font-heading font-black text-xs uppercase tracking-wider text-[#F8FAFC]">
                          {step.label}
                        </span>
                      </div>
                      <p className="text-[11px] font-heading font-semibold text-[#E2C58A] mb-1">
                        {step.subtitle}
                      </p>
                      <p className="text-[10px] font-body text-[#94A3B8] leading-tight">
                        {step.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* WhatsApp Alert Simulator Banner */}
            <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0">
                  ✆
                </div>
                <div>
                  <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-emerald-300">
                    Instant WhatsApp Dispatch Alerts
                  </h4>
                  <p className="text-[11px] font-body text-emerald-400">
                    Receive live courier transit notifications &amp; out-for-delivery OTPs on your phone.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowWhatsAppModal(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-heading text-[11px] font-bold uppercase tracking-wider rounded-full shadow-sm transition-colors whitespace-nowrap self-stretch sm:self-auto text-center cursor-pointer"
              >
                Preview WhatsApp Alert
              </button>
            </div>
          </div>

          {/* Garments Breakdown */}
          <div className="bg-[#13151C] border border-[#232733] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#232733] pb-4">
              <h3 className="font-heading font-black text-xs uppercase tracking-widest text-[#F8FAFC]">
                Acquired Garments ({order.items.reduce((s, i) => s + i.quantity, 0)})
              </h3>
              <span className="text-[11px] font-body text-[#94A3B8]">
                Handcrafted at Tirupur Center
              </span>
            </div>

            <div className="divide-y divide-[#232733]">
              {order.items.map((item) => (
                <div key={item.id} className="py-4 flex items-start justify-between gap-4">
                  <div className="flex items-start space-x-4">
                    {item.image_url_snapshot ? (
                      <img
                        src={item.image_url_snapshot}
                        alt={item.product_name_snapshot}
                        className="w-16 h-20 object-cover bg-[#0A0B0E] rounded-lg border border-[#232733] flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-20 bg-[#0A0B0E] rounded-lg border border-[#232733] flex items-center justify-center flex-shrink-0 text-[#64748B] text-[10px] font-heading font-bold">
                        TN78
                      </div>
                    )}
                    <div className="space-y-1">
                      <h4 className="font-heading font-bold text-xs uppercase tracking-wide text-[#F8FAFC]">
                        {item.product_name_snapshot}
                      </h4>
                      <p className="text-[11px] font-mono text-[#94A3B8]">
                        {item.variant_label_snapshot}
                      </p>
                      <p className="text-[11px] font-body text-[#64748B]">
                        Qty: {item.quantity} &times; ₹{Number(item.unit_price_snapshot).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  <div className="font-heading font-black text-sm text-[#F8FAFC] text-right">
                    ₹{Number(item.line_total).toLocaleString("en-IN")}
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Totals */}
            <div className="pt-4 border-t border-[#232733] space-y-2 text-xs font-body text-[#94A3B8]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-[#F8FAFC]">₹{Number(order.subtotal).toLocaleString("en-IN")}</span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Promotional Privilege ({order.coupon_code_snapshot || "PROMO"})</span>
                  <span className="font-mono">-₹{Number(order.discount_amount).toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Express Insured Courier</span>
                <span className="font-heading font-bold text-[#F8FAFC]">
                  {order.shipping_cost === 0
                    ? "COMPLIMENTARY"
                    : `₹${Number(order.shipping_cost).toLocaleString("en-IN")}`}
                </span>
              </div>
              <div className="flex justify-between items-baseline text-sm font-heading font-black text-[#F8FAFC] pt-3 border-t border-[#232733]">
                <div className="space-y-0.5">
                  <span className="uppercase tracking-wider block">Settled Total</span>
                  <span className="text-[10px] font-body font-normal text-[#64748B]">
                    Incl. 12% GST Transparency
                  </span>
                </div>
                <span className="text-base text-[#E2C58A] font-mono font-bold">
                  ₹{Number(order.total).toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Destination Info */}
            <div className="pt-4 border-t border-[#232733] bg-[#0A0B0E] p-4 rounded-xl">
              <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-[#94A3B8] block mb-1">
                Dispatch Destination
              </span>
              <p className="text-xs font-body text-[#F8FAFC] leading-relaxed">
                <strong className="font-heading uppercase tracking-wider text-[#E2C58A]">{order.shipping_full_name}</strong>
                <br />
                {order.shipping_line1}
                {order.shipping_line2 && `, ${order.shipping_line2}`}
                <br />
                {order.shipping_city}, {order.shipping_state} &ndash; {order.shipping_postal_code}
                <br />
                <span className="text-[#94A3B8]">Phone:</span> {order.shipping_phone}
              </p>
            </div>
          </div>

          {/* 7-Day Return / Exchange Eligibility Banner */}
          <div className="bg-[#13151C] border border-[#232733] rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-[#E2C58A]">
                7-Day Quality Guarantee
              </span>
              <h4 className="font-heading font-black text-sm uppercase tracking-wider text-[#F8FAFC]">
                Need a Size Exchange or Fit Adjustment?
              </h4>
              <p className="text-xs font-body text-[#94A3B8] max-w-md">
                Delivered garments qualify for complimentary reverse courier pickup and size replacement within 7 days.
              </p>
            </div>

            <Link
              href={`/account/orders/${order.order_number}/return`}
              className="px-6 py-3 bg-[#0A0B0E] border border-[#232733] hover:border-[#E2C58A]/50 text-[#F8FAFC] hover:text-[#E2C58A] font-heading text-xs font-bold uppercase tracking-widest rounded-full transition-all duration-150 whitespace-nowrap"
            >
              Request Return / Exchange &rarr;
            </Link>
          </div>
        </div>
      )}

      {/* WhatsApp Modal Simulation */}
      {showWhatsAppModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#13151C] border border-[#232733] rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#232733] pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-[#25D366] text-white flex items-center justify-center font-bold text-xs">
                  ✆
                </div>
                <span className="font-heading font-black text-xs uppercase tracking-wider text-[#F8FAFC]">
                  WhatsApp Courier Dispatch Alert
                </span>
              </div>
              <button
                onClick={() => setShowWhatsAppModal(false)}
                className="text-xs text-[#94A3B8] hover:text-[#F8FAFC] font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Chat Bubble Preview */}
            <div className="bg-[#0A0B0E] p-4 rounded-xl space-y-3 font-body text-xs border border-[#232733]">
              <div className="bg-[#191D28] p-3.5 rounded-lg shadow-sm space-y-2 border-l-4 border-[#25D366]">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-black text-[11px] text-[#E2C58A] uppercase tracking-wider">
                    TN78 Men&apos;s Collection
                  </span>
                  <span className="text-[10px] text-[#64748B]">Now</span>
                </div>
                <p className="text-[#F8FAFC] leading-relaxed">
                  Namaste {order?.shipping_full_name || "Esteemed Client"},
                  <br /><br />
                  Your TN78 handcrafted garment order <strong className="text-[#E2C58A]">#{order?.order_number || "TN78-2026-X"}</strong> has been dispatched via <strong>BlueDart Express Air</strong>!
                  <br /><br />
                  📦 <strong>AWB Tracking:</strong> BLR9827364IN
                  <br />
                  🚚 <strong>Expected Delivery:</strong> {getEstimatedDeliveryDate(order?.created_at)}
                  <br /><br />
                  You can track live courier transit or request size adjustments anytime at:
                  <br />
                  <span className="text-[#E2C58A] underline">https://tn78.in/orders/track</span>
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  setWhatsAppSent(true);
                  setTimeout(() => {
                    setShowWhatsAppModal(false);
                    setWhatsAppSent(false);
                  }, 1800);
                }}
                className="w-full py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-heading text-xs font-bold uppercase tracking-widest rounded-full shadow-sm transition-colors cursor-pointer"
              >
                {whatsAppSent ? "✓ Test Dispatch Alert Sent!" : "Send Test Alert To Registered Phone"}
              </button>
              <p className="text-[10px] text-center text-[#64748B]">
                Simulation grounds live Twilio/Meta Business WhatsApp API integration.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <div className="bg-[#0A0B0E] min-h-screen text-[#F8FAFC]">
      {/* Top Breadcrumb */}
      <div className="border-b border-[#232733] px-4 sm:px-6 lg:px-8 py-3.5 bg-[#0A0B0E]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center space-x-2 text-[10px] font-heading font-bold uppercase tracking-widest text-[#94A3B8]">
          <Link href="/" className="hover:text-[#F8FAFC] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#94A3B8]">Client Services</span>
          <span>/</span>
          <span className="text-[#E2C58A]">Track Order</span>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="py-28 text-center text-xs font-heading font-bold uppercase tracking-widest text-[#94A3B8]">
            Loading Order Tracking...
          </div>
        }
      >
        <TrackOrderContent />
      </Suspense>
    </div>
  );
}
