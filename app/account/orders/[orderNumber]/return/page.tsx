"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getOrderByNumber, OrderOut, submitReturnRequest } from "@/lib/api";

interface ReturnOrderPageProps {
  params: {
    orderNumber: string;
  };
}

const RETURN_REASONS = [
  { id: "size_small", label: "Size Too Small — Request larger size exchange" },
  { id: "size_large", label: "Size Too Large — Request smaller size exchange" },
  { id: "fit_drape", label: "Fit / Drape preference (chest, shoulder, or sleeve length)" },
  { id: "color_fabric", label: "Fabric texture or shade variation" },
  { id: "craftsmanship", label: "Craftsmanship or seam stitching query" },
  { id: "other", label: "Other client preference" },
];

const RESOLUTION_OPTIONS = [
  {
    id: "exchange",
    title: "Size Exchange",
    desc: "Complimentary reverse pickup and priority dispatch of adjusted size.",
  },
  {
    id: "store_credit",
    title: "Store Credit",
    desc: "Instant credit to your rewards wallet with an additional 5% courtesy bonus.",
  },
  {
    id: "refund",
    title: "Original Payment Refund",
    desc: "Direct reversal to your bank / UPI / card upon QC clearance.",
  },
];

export default function OrderReturnRequestPage({ params }: ReturnOrderPageProps) {
  const { orderNumber } = params;
  const router = useRouter();

  const [order, setOrder] = useState<OrderOut | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [reasonCategory, setReasonCategory] = useState<string>(RETURN_REASONS[0].label);
  const [resolutionType, setResolutionType] = useState<string>("exchange");
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setErrorMsg(null);
        const res = await getOrderByNumber(orderNumber);
        setOrder(res);
        if (res.items && res.items.length > 0) {
          setSelectedItemId(res.items[0].id);
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to load order details.";
        setErrorMsg(message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderNumber]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemId) {
      setErrorMsg("Please select a garment item to return or exchange.");
      return;
    }

    const fullReason = `[${resolutionType.toUpperCase()}] ${reasonCategory}${
      notes.trim() ? ` — Notes: ${notes.trim()}` : ""
    }`;

    try {
      setSubmitting(true);
      setErrorMsg(null);
      await submitReturnRequest({
        order_item_id: selectedItemId,
        reason: fullReason,
      });
      setSuccessMsg("Your return request has been submitted to the team. Redirecting to Returns archive...");
      setTimeout(() => {
        router.push("/account/returns");
      }, 2000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to submit return request.";
      setErrorMsg(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0B0E] text-[#F8FAFC] flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#E2C58A] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-heading text-xs uppercase tracking-widest text-[#94A3B8]">
            Retrieving Commission Record...
          </p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#0A0B0E] text-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-[#13151C] border border-[#232733] p-8 rounded-2xl shadow-xl space-y-4">
          <h1 className="font-heading text-xl font-bold uppercase tracking-wider text-[#F8FAFC]">
            Order Not Located
          </h1>
          <p className="text-xs text-[#94A3B8] font-body">{errorMsg || "Could not find order reference."}</p>
          <div className="pt-2">
            <Link
              href="/orders/track"
              className="inline-block px-6 py-2.5 bg-gradient-to-r from-[#E2C58A] to-[#C6A467] text-[#0A0B0E] font-heading text-xs font-black uppercase tracking-wider rounded-full shadow-[0_0_15px_rgba(226,197,138,0.25)] hover:brightness-110 transition-colors"
            >
              Return to Track Order
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Check if delivered
  const isDelivered = order.status.toLowerCase() === "delivered";

  // Check 7-day window
  const orderTime = new Date(order.updated_at || order.created_at).getTime();
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  const isWithinWindow = Date.now() - orderTime <= sevenDaysMs;

  return (
    <div className="min-h-screen bg-[#0A0B0E] text-[#F8FAFC] pb-28">
      {/* Breadcrumb */}
      <div className="border-b border-[#232733] px-4 sm:px-6 lg:px-8 py-3.5 bg-[#13151C]/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center space-x-2 text-[10px] font-heading font-bold uppercase tracking-widest text-[#94A3B8]">
          <Link href="/" className="hover:text-[#F8FAFC] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/account/orders" className="hover:text-[#F8FAFC] transition-colors">
            Orders
          </Link>
          <span>/</span>
          <Link href="/account/returns" className="hover:text-[#F8FAFC] transition-colors">
            Returns
          </Link>
          <span>/</span>
          <span className="text-[#E2C58A]">{order.order_number}</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12 space-y-8">
        {/* Page Header */}
        <div className="border-b border-[#232733] pb-5">
          <span className="text-[10px] font-heading font-extrabold uppercase tracking-widest text-[#E2C58A] bg-[#E2C58A]/10 border border-[#E2C58A]/30 px-3 py-0.5 rounded-full inline-block mb-2">
            7-Day Return &amp; Exchange Policy
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl font-black uppercase tracking-wider text-[#F8FAFC]">
            Request Return or Size Exchange
          </h1>
          <p className="text-xs text-[#94A3B8] font-body mt-1">
            Order Reference: <strong className="font-mono text-[#E2C58A]">{order.order_number}</strong>
          </p>
        </div>

        {/* Eligibility Alerts */}
        {!isDelivered ? (
          <div className="bg-amber-950/70 border border-amber-500/40 rounded-2xl p-6 sm:p-8 space-y-3">
            <h2 className="font-heading text-xs font-bold uppercase tracking-wider text-amber-300">
              Return Ineligible: Parcel In Transit
            </h2>
            <p className="text-xs text-amber-200/90 font-body leading-relaxed">
              Returns and size exchanges can be registered once your parcel reaches <strong>Delivered</strong> status.
              Your order is currently marked as <strong className="uppercase">{order.status}</strong>.
            </p>
            <div className="pt-2">
              <Link
                href={`/orders/track?order_number=${order.order_number}&email=${order.guest_email || ""}`}
                className="inline-block px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-heading text-xs font-bold uppercase tracking-wider rounded-full shadow-sm transition-colors"
              >
                Track Live Shipment &rarr;
              </Link>
            </div>
          </div>
        ) : !isWithinWindow ? (
          <div className="bg-[#13151C] border border-[#232733] rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl text-center">
            <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-[#F8FAFC]">
              7-Day Return Window Concluded
            </h2>
            <p className="text-xs text-[#94A3B8] font-body leading-relaxed max-w-md mx-auto">
              Our bespoke return privilege is active for 7 calendar days following delivery. This order was delivered on{" "}
              {new Date(orderTime).toLocaleDateString("en-IN")}. If you require special tailoring advice, our concierge is at your service.
            </p>
            <div className="pt-2 flex justify-center space-x-3">
              <Link
                href="/support"
                className="px-5 py-2.5 bg-[#0A0B0E] border border-[#232733] hover:border-[#E2C58A] text-[#F8FAFC] hover:text-[#E2C58A] font-heading text-xs font-bold uppercase tracking-wider rounded-full transition-colors"
              >
                Contact Concierge
              </Link>
              <Link
                href="/shop"
                className="px-5 py-2.5 bg-gradient-to-r from-[#E2C58A] to-[#C6A467] text-[#0A0B0E] font-heading text-xs font-black uppercase tracking-wider rounded-full shadow-[0_0_15px_rgba(226,197,138,0.25)] hover:brightness-110 transition-colors"
              >
                Explore The Collection
              </Link>
            </div>
          </div>
        ) : (
          /* Return Request Form */
          <form onSubmit={handleSubmit} className="bg-[#13151C] border border-[#232733] rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
            {errorMsg && (
              <div className="p-4 bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-body rounded-xl">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-body rounded-xl">
                {successMsg}
              </div>
            )}

            {/* Step 1: Select Garment */}
            <div className="space-y-3">
              <label className="block text-[11px] font-heading font-extrabold uppercase tracking-wider text-[#F8FAFC]">
                1. Select Garment Item
              </label>
              <div className="space-y-2">
                {order.items.map((item) => (
                  <label
                    key={item.id}
                    className={`flex items-start p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedItemId === item.id
                        ? "border-[#E2C58A] bg-[#191D28] ring-1 ring-[#E2C58A]"
                        : "border-[#232733] hover:border-[#E2C58A]/50 bg-[#0A0B0E]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="order_item"
                      value={item.id}
                      checked={selectedItemId === item.id}
                      onChange={() => setSelectedItemId(item.id)}
                      className="mt-1 mr-3 text-[#E2C58A] accent-[#E2C58A] focus:ring-[#E2C58A]"
                    />
                    <div className="flex-1 text-xs">
                      <div className="flex justify-between items-baseline">
                        <span className="font-heading font-bold text-[#F8FAFC] uppercase tracking-wide">
                          {item.product_name_snapshot}
                        </span>
                        <span className="font-mono text-[#E2C58A] font-bold">
                          ₹{item.unit_price_snapshot.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <p className="text-[#94A3B8] text-[11px] mt-0.5 font-mono">
                        {item.variant_label_snapshot ? `${item.variant_label_snapshot} • ` : ""}Qty: {item.quantity}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Step 2: Reason Category */}
            <div className="space-y-2">
              <label className="block text-[11px] font-heading font-extrabold uppercase tracking-wider text-[#F8FAFC]">
                2. Reason For Request
              </label>
              <select
                value={reasonCategory}
                onChange={(e) => setReasonCategory(e.target.value)}
                className="w-full bg-[#0A0B0E] border border-[#232733] rounded-xl px-4 py-3 text-xs text-[#F8FAFC] focus:border-[#E2C58A] focus:outline-none"
              >
                {RETURN_REASONS.map((r) => (
                  <option key={r.id} value={r.label} className="bg-[#0A0B0E] text-[#F8FAFC]">
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Step 3: Preferred Resolution */}
            <div className="space-y-2">
              <label className="block text-[11px] font-heading font-extrabold uppercase tracking-wider text-[#F8FAFC]">
                3. Preferred Resolution
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {RESOLUTION_OPTIONS.map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => setResolutionType(opt.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      resolutionType === opt.id
                        ? "border-[#E2C58A] bg-[#191D28] ring-1 ring-[#E2C58A]"
                        : "border-[#232733] hover:border-[#E2C58A]/50 bg-[#0A0B0E]"
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <input
                        type="radio"
                        checked={resolutionType === opt.id}
                        onChange={() => setResolutionType(opt.id)}
                        className="text-[#E2C58A] accent-[#E2C58A] focus:ring-[#E2C58A]"
                      />
                      <span className="font-heading font-bold text-xs uppercase tracking-wider text-[#F8FAFC]">
                        {opt.title}
                      </span>
                    </div>
                    <p className="text-[10px] font-body text-[#94A3B8] leading-tight pl-5">
                      {opt.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 4: Additional Notes */}
            <div className="space-y-2">
              <label className="block text-[11px] font-heading font-extrabold uppercase tracking-wider text-[#F8FAFC]">
                4. Tailoring &amp; Fit Details (Optional)
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Mention desired size adjustment (e.g. need Size L instead of M, sleeve length +1 inch)..."
                className="w-full bg-[#0A0B0E] border border-[#232733] rounded-xl p-3.5 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:border-[#E2C58A] focus:outline-none font-body leading-relaxed"
              />
            </div>

            {/* Packaging Reminder */}
            <div className="p-4 bg-[#0A0B0E] rounded-xl border border-[#232733] flex items-start space-x-3">
              <span className="text-[#E2C58A] font-bold text-sm">ℹ</span>
              <p className="text-[11px] text-[#94A3B8] font-body leading-relaxed">
                Garments must be unworn and unwashed with original TN78 tags intact in original packaging. Reverse courier pickup is scheduled within 24 hours of approval.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-[#E2C58A] via-[#F3E2B8] to-[#C6A467] hover:brightness-110 text-[#0A0B0E] font-heading text-xs font-black uppercase tracking-widest py-3.5 rounded-full shadow-[0_0_20px_rgba(226,197,138,0.25)] transition-all duration-200 disabled:opacity-50 cursor-pointer"
            >
              {submitting ? "Registering Request..." : "Submit Return / Exchange Request"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
