"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { adminGetOrder, adminUpdateOrderStatus, OrderOut, getOrderInvoicePdfUrl, getOrderDispatchSlipPdfUrl } from "@/lib/api";

interface OrderDetailPageProps {
  params: {
    orderNumber: string;
  };
}

const AVAILABLE_STATUSES = [
  { value: "confirmed", label: "Confirmed (Payment Verified)" },
  { value: "processing", label: "Processing (In QC & Packaging)" },
  { value: "shipped", label: "Shipped (Dispatched with Express Courier)" },
  { value: "delivered", label: "Delivered (Fulfilled & Award Points)" },
  { value: "cancelled", label: "Cancelled" },
];

const POPULAR_CARRIERS = [
  "BlueDart Express Air",
  "Delhivery Express",
  "DTDC Priority Air",
  "India Speed Post",
  "TN78 White-Glove Courier",
];

export default function AdminOrderDetailPage({ params }: OrderDetailPageProps) {
  const router = useRouter();
  const orderNumber = decodeURIComponent(params.orderNumber);

  const [order, setOrder] = useState<OrderOut | null>(null);
  const [targetStatus, setTargetStatus] = useState<string>("");
  const [courierPartner, setCourierPartner] = useState<string>("BlueDart Express Air");
  const [trackingNumber, setTrackingNumber] = useState<string>("");
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState<string>("");
  const [deliveryNotes, setDeliveryNotes] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminGetOrder(orderNumber);
      setOrder(data);
      setTargetStatus(data.status);
      if (data.courier_partner) setCourierPartner(data.courier_partner);
      if (data.tracking_number) setTrackingNumber(data.tracking_number);
      if (data.estimated_delivery_date) setEstimatedDeliveryDate(data.estimated_delivery_date.slice(0, 10));
      if (data.delivery_notes) setDeliveryNotes(data.delivery_notes);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load order details";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderNumber]);

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetStatus) return;

    try {
      setUpdating(true);
      setMessage(null);
      setError(null);
      const updated = await adminUpdateOrderStatus(orderNumber, {
        status: targetStatus,
        courier_partner: courierPartner.trim() || undefined,
        tracking_number: trackingNumber.trim() || undefined,
        estimated_delivery_date: estimatedDeliveryDate ? new Date(estimatedDeliveryDate).toISOString() : undefined,
        delivery_notes: deliveryNotes.trim() || undefined,
      });
      setOrder(updated);
      setTargetStatus(updated.status);
      if (updated.courier_partner) setCourierPartner(updated.courier_partner);
      if (updated.tracking_number) setTrackingNumber(updated.tracking_number);
      if (updated.estimated_delivery_date) setEstimatedDeliveryDate(updated.estimated_delivery_date.slice(0, 10));
      if (updated.delivery_notes) setDeliveryNotes(updated.delivery_notes);
      setMessage(
        `Order ${orderNumber} status successfully updated to "${updated.status.toUpperCase()}". ${
          updated.tracking_number ? `Tracking code "${updated.tracking_number}" attached.` : ""
        }`
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update order status";
      setError(message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 max-w-5xl mx-auto text-center space-y-3">
        <div className="w-8 h-8 border-2 border-[#9E6544] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-heading uppercase tracking-widest text-[#78716C]">
          Loading order details...
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-12 max-w-md mx-auto text-center space-y-4 bg-white border border-[#EFECE6] rounded-2xl shadow-sm mt-12">
        <h2 className="font-heading text-lg font-black uppercase tracking-wider text-[#1A1816]">
          Order Not Found
        </h2>
        <p className="text-xs text-[#78716C]">Order {orderNumber} could not be retrieved from the orders database.</p>
        <Link
          href="/admin/orders"
          className="inline-block px-6 py-2.5 bg-[#D5C0A5] hover:bg-[#C4AC8F] text-[#1A1816] text-xs font-heading font-bold uppercase tracking-wider rounded-full transition-colors"
        >
          &larr; Return to Orders Archive
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 lg:p-10 max-w-5xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between border-b border-[#EFECE6] pb-6 gap-4">
        <div>
          <Link
            href="/admin/orders"
            className="text-[#9E6544] hover:underline font-heading text-[10px] font-bold uppercase tracking-wider mb-2 inline-block"
          >
            &larr; Back to Orders Archive
          </Link>
          <div className="flex items-center space-x-3">
            <h1 className="font-heading text-2xl sm:text-3xl font-black uppercase tracking-wider text-[#1A1816]">
              Order {order.order_number}
            </h1>
            <span className="px-3 py-1 text-xs font-heading font-bold uppercase tracking-wider rounded-full border border-[#D5C0A5] bg-[#FAF8F5] text-[#9E6544]">
              {order.status}
            </span>
          </div>
          <p className="text-xs text-[#78716C] font-body mt-1">
            Placed on{" "}
            {new Date(order.created_at).toLocaleDateString("en-IN", {
              weekday: "short",
              month: "long",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2 self-start sm:self-auto">
          <a
            href={getOrderInvoicePdfUrl(order.order_number)}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-[#FAF6F0] border border-[#D5C0A5] hover:bg-[#F2ECE4] text-[#9E6544] hover:text-[#1A1816] text-[11px] font-heading font-bold uppercase tracking-wider rounded-full transition-colors shadow-xs flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>GST Invoice (PDF)</span>
          </a>
          <a
            href={getOrderDispatchSlipPdfUrl(order.order_number)}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-[#1A1816] hover:bg-[#33302C] text-[#FAF8F5] text-[11px] font-heading font-bold uppercase tracking-wider rounded-full transition-colors shadow-xs flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5 text-[#D5C0A5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Dispatch Slip (PDF)</span>
          </a>
          <Link
            href={`/orders/track?order_number=${order.order_number}&email=${order.guest_email || ""}`}
            target="_blank"
            className="px-4 py-2 bg-white border border-[#EFECE6] hover:bg-[#FAF8F5] text-[#1A1816] text-[11px] font-heading font-bold uppercase tracking-wider rounded-full transition-colors shadow-sm"
          >
            Customer View &rarr;
          </Link>
        </div>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-body">
          ✓ {message}
        </div>
      )}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-body">
          {error}
        </div>
      )}

      {/* Fulfillment Control Card */}
      <div className="bg-white border border-[#EFECE6] rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
        <div className="border-b border-[#EFECE6] pb-4">
          <span className="text-[10px] font-heading font-extrabold uppercase tracking-widest text-[#9E6544]">
            Dispatch &amp; Courier Console
          </span>
          <h2 className="font-heading text-lg font-black uppercase tracking-wider text-[#1A1816] mt-0.5">
            Update Fulfillment &amp; Consignment Status
          </h2>
          <p className="text-xs text-[#78716C] mt-0.5">
            Transitions trigger automatic email notifications and credit customer loyalty points upon delivery.
          </p>
        </div>

        <form onSubmit={handleUpdateStatus} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-[10px] font-heading font-bold uppercase tracking-widest text-[#78716C] mb-1.5">
              Fulfillment Status *
            </label>
            <select
              value={targetStatus}
              onChange={(e) => setTargetStatus(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-xl px-4 py-3 text-xs text-[#1A1816] focus:bg-white focus:border-[#9E6544] focus:outline-none"
            >
              {AVAILABLE_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-heading font-bold uppercase tracking-widest text-[#78716C] mb-1.5">
              Courier Partner
            </label>
            <input
              type="text"
              list="carriers_list"
              value={courierPartner}
              onChange={(e) => setCourierPartner(e.target.value)}
              placeholder="e.g. BlueDart Express Air"
              className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-xl px-4 py-3 text-xs text-[#1A1816] focus:bg-white focus:border-[#9E6544] focus:outline-none"
            />
            <datalist id="carriers_list">
              {POPULAR_CARRIERS.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="block text-[10px] font-heading font-bold uppercase tracking-widest text-[#78716C] mb-1.5">
              Consignment AWB Tracking #
            </label>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="e.g. BLR9827364IN"
              className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-xl px-4 py-3 text-xs font-mono uppercase text-[#1A1816] focus:bg-white focus:border-[#9E6544] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-heading font-bold uppercase tracking-widest text-[#78716C] mb-1.5">
              Estimated Delivery Date
            </label>
            <input
              type="date"
              value={estimatedDeliveryDate}
              onChange={(e) => setEstimatedDeliveryDate(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-xl px-4 py-3 text-xs font-mono text-[#1A1816] focus:bg-white focus:border-[#9E6544] focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-[10px] font-heading font-bold uppercase tracking-widest text-[#78716C] mb-1.5">
              Logistics &amp; Delivery Notes
            </label>
            <textarea
              rows={2}
              value={deliveryNotes}
              onChange={(e) => setDeliveryNotes(e.target.value)}
              placeholder="Special delivery instructions, courier dispatch batch notes, or customer notes..."
              className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-xl px-4 py-2.5 text-xs text-[#1A1816] focus:bg-white focus:border-[#9E6544] focus:outline-none"
            />
          </div>

          <div className="md:col-span-3 pt-2">
            <button
              type="submit"
              disabled={updating}
              className="w-full sm:w-auto px-8 py-3 bg-[#D5C0A5] hover:bg-[#C4AC8F] text-[#1A1816] font-heading text-xs font-black uppercase tracking-widest rounded-full shadow-sm transition-all duration-150 disabled:opacity-50 cursor-pointer"
            >
              {updating ? "Updating Dispatch Record..." : "Save Fulfillment Details & Update Status"}
            </button>
          </div>
        </form>
      </div>

      {/* Grid: Recipient + Destination + Logistics + Settlement */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Recipient Information */}
        <div className="bg-white border border-[#EFECE6] rounded-2xl p-6 shadow-sm space-y-3">
          <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-[#9E6544] border-b border-[#EFECE6] pb-2">
            Client Recipient
          </h3>
          <div className="text-xs space-y-1.5 font-body">
            <p className="font-heading font-bold text-sm uppercase text-[#1A1816]">{order.shipping_full_name}</p>
            <p className="text-[#78716C] font-mono">{order.guest_email || "Customer"}</p>
            <p className="text-[#78716C]">Phone: {order.shipping_phone}</p>
          </div>
        </div>

        {/* Dispatch Destination */}
        <div className="bg-white border border-[#EFECE6] rounded-2xl p-6 shadow-sm space-y-3">
          <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-[#9E6544] border-b border-[#EFECE6] pb-2">
            Dispatch Destination
          </h3>
          <div className="text-xs space-y-1 font-body text-[#78716C]">
            <p className="font-medium text-[#1A1816]">{order.shipping_line1}</p>
            {order.shipping_line2 && <p>{order.shipping_line2}</p>}
            <p>
              {order.shipping_city}, {order.shipping_state} &ndash; {order.shipping_postal_code}
            </p>
            <p className="font-semibold text-[#1A1816]">{order.shipping_country}</p>
          </div>
        </div>

        {/* Logistics & Delivery */}
        <div className="bg-white border border-[#EFECE6] rounded-2xl p-6 shadow-sm space-y-3">
          <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-[#9E6544] border-b border-[#EFECE6] pb-2">
            Logistics &amp; Delivery
          </h3>
          <div className="text-xs space-y-1 font-body text-[#78716C]">
            <p>
              Carrier: <strong className="text-[#1A1816]">{order.courier_partner || "BlueDart Express Air"}</strong>
            </p>
            <p>
              AWB: <strong className="font-mono text-[#9E6544]">{order.tracking_number || "Not assigned"}</strong>
            </p>
            <p>
              Est. Delivery:{" "}
              <strong className="text-[#1A1816]">
                {order.estimated_delivery_date
                  ? new Date(order.estimated_delivery_date).toLocaleDateString("en-IN", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })
                  : "Not set"}
              </strong>
            </p>
            <div className="pt-1 text-[11px] font-mono text-emerald-600 font-semibold flex items-center gap-1">
              <span>✓ Prepaid</span>
              <span className="text-stone-400 font-normal">(No COD)</span>
            </div>
            {order.delivery_notes && (
              <p className="text-[11px] text-stone-500 italic pt-1 border-t border-[#EFECE6] line-clamp-2">
                &ldquo;{order.delivery_notes}&rdquo;
              </p>
            )}
          </div>
        </div>

        {/* Settlement Breakdown */}
        <div className="bg-white border border-[#EFECE6] rounded-2xl p-6 shadow-sm space-y-3">
          <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-[#9E6544] border-b border-[#EFECE6] pb-2">
            Financial Settlement
          </h3>
          <div className="text-xs space-y-1.5 font-body text-[#78716C]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-mono text-[#1A1816]">₹{Number(order.subtotal).toLocaleString("en-IN")}</span>
            </div>
            {order.discount_amount > 0 && (
              <div className="flex justify-between text-[#9E6544]">
                <span>Coupon Discount</span>
                <span className="font-mono">-₹{Number(order.discount_amount).toLocaleString("en-IN")}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-mono text-[#1A1816]">₹{Number(order.shipping_cost).toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between items-baseline font-heading font-black text-sm text-[#1A1816] pt-2 border-t border-[#EFECE6]">
              <span className="uppercase tracking-wider">Total</span>
              <span className="font-mono text-base text-[#9E6544]">₹{Number(order.total).toLocaleString("en-IN")}</span>
            </div>

            {/* Payment & UTR Verification */}
            {order.payments && order.payments.length > 0 && (
              <div className="pt-3 border-t border-[#EFECE6] space-y-2">
                <span className="text-[10px] font-heading font-extrabold uppercase tracking-widest text-[#9E6544] block">
                  Payment Verification Audit
                </span>
                {order.payments.map((p) => {
                  const isUpi = p.gateway_payment_id?.startsWith("UPI-UTR-");
                  const utr = isUpi ? p.gateway_payment_id?.replace("UPI-UTR-", "") : p.gateway_payment_id;
                  return (
                    <div key={p.id} className="bg-[#FAF8F5] p-2.5 rounded-xl border border-[#E8E4DC] text-xs space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-heading font-bold uppercase text-[10px] text-[#1A1816]">
                          {isUpi ? "UPI QR (Google Pay / PhonePe)" : p.gateway.toUpperCase()}
                        </span>
                        <span className="text-[10px] font-heading font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {p.status}
                        </span>
                      </div>
                      {utr && (
                        <div className="mt-1 font-mono text-[11px] text-[#1A1816] bg-white p-2 rounded-lg border border-[#E0DCD4]">
                          <span className="text-stone-400 text-[9px] uppercase tracking-wider block font-sans">Customer UTR / Ref Number:</span>
                          <span className="font-bold text-[#9E6544] tracking-widest select-all text-xs">{utr}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Garments Table */}
      <div className="bg-white border border-[#EFECE6] rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
        <h3 className="font-heading font-black text-xs uppercase tracking-widest text-[#1A1816] border-b border-[#EFECE6] pb-3">
          Commission Garments ({order.items.reduce((s, i) => s + i.quantity, 0)})
        </h3>

        <div className="divide-y divide-[#EFECE6]">
          {order.items.map((item) => (
            <div key={item.id} className="py-4 flex items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                {item.image_url_snapshot ? (
                  <img
                    src={item.image_url_snapshot}
                    alt={item.product_name_snapshot}
                    className="w-14 h-16 object-cover bg-[#FAF8F5] rounded border border-[#EFECE6] flex-shrink-0"
                  />
                ) : (
                  <div className="w-14 h-16 bg-[#FAF8F5] rounded border border-[#EFECE6] flex items-center justify-center flex-shrink-0 text-[#78716C] text-[10px] font-heading font-bold">
                    TN78
                  </div>
                )}
                <div>
                  <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-[#1A1816]">
                    {item.product_name_snapshot}
                  </h4>
                  <p className="text-[11px] font-mono text-[#78716C] mt-0.5">
                    Variant: {item.variant_label_snapshot}
                  </p>
                  <p className="text-[11px] font-body text-[#78716C]">
                    Qty: {item.quantity} &times; ₹{Number(item.unit_price_snapshot).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              <div className="font-heading font-black text-sm text-[#1A1816]">
                ₹{Number(item.line_total).toLocaleString("en-IN")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
