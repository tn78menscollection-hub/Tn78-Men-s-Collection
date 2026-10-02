"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { OrderOut, getOrderByNumber, getOrderInvoicePdfUrl } from "@/lib/api";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order_number") || "";
  const paymentId = searchParams.get("payment_id") || "pay_test_settled";
  const orderId = searchParams.get("order_id") || "order_test_settled";
  const amount = searchParams.get("amount") || "N/A";
  const status = searchParams.get("status") || "captured";

  const [order, setOrder] = useState<OrderOut | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (!orderNumber) return;
    let isMounted = true;

    async function fetchOrder() {
      try {
        const data = await getOrderByNumber(orderNumber);
        if (isMounted) {
          setOrder(data);
        }
      } catch {
        // Fallback gracefully: if guest user or not authenticated,
        // we still display the confirmed transaction details from query params.
      }
    }

    fetchOrder();
    return () => {
      isMounted = false;
    };
  }, [orderNumber]);

  const copyOrderNumber = () => {
    if (!orderNumber) return;
    navigator.clipboard.writeText(orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const formatDeliveryDate = (estDate?: string | null, createdDate?: string) => {
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
    const base = createdDate ? new Date(createdDate) : new Date();
    base.setDate(base.getDate() + 3);
    return base.toLocaleDateString("en-IN", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-14 pb-24 space-y-8">
      {/* Success Badge Icon */}
      <div className="text-center space-y-4">
        <div className="w-20 h-20 border-2 border-[#E2C58A] rounded-full flex items-center justify-center mx-auto text-[#E2C58A] bg-[#13151C] shadow-[0_0_25px_rgba(226,197,138,0.25)]">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <div className="space-y-1.5">
          <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-[#E2C58A]">
            ORDER SETTLEMENT CONFIRMED &bull; DISPATCH QUEUE READY
          </span>
          <h1 className="font-heading font-black text-3xl sm:text-4xl uppercase tracking-wider text-[#F8FAFC]">
            THANK YOU FOR YOUR ORDER
          </h1>
          <p className="text-xs font-body text-[#94A3B8] max-w-lg mx-auto leading-relaxed">
            Your sartorial acquisition has been logged with TN78. Your order
            confirmation receipt and tracking updates will be dispatched via WhatsApp and SMS shortly.
          </p>
        </div>
      </div>

      {/* Prominent Order Number Card */}
      {orderNumber && (
        <div className="p-5 bg-[#13151C] border border-[#232733] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl rounded-none md:rounded-xs">
          <div className="text-center sm:text-left">
            <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-[#94A3B8]">
              OFFICIAL ORDER IDENTIFIER
            </span>
            <div className="font-heading font-black text-xl sm:text-2xl text-[#E2C58A] tracking-wider mt-0.5">
              {orderNumber}
            </div>
          </div>
          <button
            type="button"
            onClick={copyOrderNumber}
            className="px-5 py-2.5 bg-[#0A0B0E] border border-[#232733] hover:border-[#E2C58A]/50 text-[#F8FAFC] font-heading text-[11px] font-bold uppercase tracking-widest transition-all duration-150 flex items-center space-x-2 rounded-full cursor-pointer"
          >
            {copied ? (
              <>
                <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-emerald-400">COPIED</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 text-[#E2C58A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                  />
                </svg>
                <span>COPY NUMBER</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Order Item Details if available */}
      {order && order.items && order.items.length > 0 && (
        <div className="p-6 bg-[#13151C] border border-[#232733] space-y-4 shadow-xl rounded-none md:rounded-xs">
          <div className="flex justify-between items-center border-b border-[#232733] pb-3">
            <span className="text-xs font-heading font-extrabold uppercase tracking-widest text-[#F8FAFC]">
              PURCHASED GARMENTS ({order.items.reduce((s, i) => s + i.quantity, 0)})
            </span>
            <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 border border-emerald-500/40 px-2 py-0.5 rounded-xs">
              {order.status.toUpperCase()}
            </span>
          </div>

          <div className="divide-y divide-[#232733] space-y-3 pt-1">
            {order.items.map((item) => (
              <div key={item.id} className="pt-3 flex items-start justify-between gap-4">
                <div className="flex items-start space-x-3">
                  {item.image_url_snapshot ? (
                    <img
                      src={item.image_url_snapshot}
                      alt={item.product_name_snapshot}
                      className="w-16 h-20 object-cover bg-[#0A0B0E] border border-[#232733] shrink-0 rounded-xs"
                    />
                  ) : (
                    <div className="w-16 h-20 bg-[#0A0B0E] border border-[#232733] flex items-center justify-center shrink-0 text-[#64748B] text-[10px] font-heading rounded-xs">
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
                    <p className="text-[10px] font-body text-[#64748B]">
                      QTY: {item.quantity} &times; ₹{Number(item.unit_price_snapshot).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                <div className="font-heading font-bold text-xs text-[#F8FAFC] text-right">
                  ₹{Number(item.line_total).toLocaleString("en-IN")}
                </div>
              </div>
            ))}
          </div>

          {/* Financial Breakdown */}
          <div className="pt-4 border-t border-[#232733] space-y-1.5 text-xs font-body text-[#94A3B8]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-[#F8FAFC]">₹{Number(order.subtotal).toLocaleString("en-IN")}</span>
            </div>
            {order.discount_amount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Promotional Offer ({order.coupon_code_snapshot || "PROMO"})</span>
                <span>-₹{Number(order.discount_amount).toLocaleString("en-IN")}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping &amp; Handling ({order.shipping_method_snapshot || "Standard"})</span>
              <span>
                {order.shipping_cost === 0
                  ? "COMPLIMENTARY"
                  : `₹${Number(order.shipping_cost).toLocaleString("en-IN")}`}
              </span>
            </div>
            {order.is_gift_package && (
              <div className="flex justify-between text-[#E2C58A] font-medium">
                <span>✦ Signature Archival Gift Box &amp; Calligraphy Note</span>
                <span>
                  {Number(order.gift_package_fee) > 0
                    ? `₹${Number(order.gift_package_fee).toLocaleString("en-IN")}`
                    : "COMPLIMENTARY"}
                </span>
              </div>
            )}
            <div className="flex justify-between text-sm font-heading font-black text-[#F8FAFC] pt-2 border-t border-[#232733]">
              <span className="uppercase tracking-wider">Total Settled (Incl. 12% GST)</span>
              <span className="text-[#E2C58A]">₹{Number(order.total).toLocaleString("en-IN")}</span>
            </div>
          </div>

          {/* Gift Consignment Callout */}
          {order.is_gift_package && (
            <div className="p-4 bg-[#191D28] border border-[#E2C58A]/30 rounded-xs space-y-2">
              <div className="flex items-center space-x-2 text-[10px] font-heading font-bold uppercase tracking-widest text-[#E2C58A]">
                <span>✦ BESPOKE LUXURY GIFT ENCLOSED</span>
              </div>
              <div className="text-xs text-[#F8FAFC] font-heading">
                {order.gift_recipient_name && (
                  <span className="mr-3">To: <strong className="text-[#E2C58A]">{order.gift_recipient_name}</strong></span>
                )}
                {order.gift_sender_name && (
                  <span>From: <strong className="text-[#E2C58A]">{order.gift_sender_name}</strong></span>
                )}
              </div>
              {order.gift_message && (
                <p className="font-serif italic text-xs text-[#94A3B8] pt-1 border-t border-[#232733]">
                  &ldquo;{order.gift_message}&rdquo;
                </p>
              )}
              {order.gift_hide_price && (
                <div className="text-[10px] font-mono text-[#E2C58A] font-semibold">
                  ✓ Garment prices concealed on parcel dispatch slip
                </div>
              )}
            </div>
          )}

          {/* Shipping Address Snapshot */}
          <div className="pt-4 border-t border-[#232733]">
            <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-[#94A3B8] block mb-1">
              DISPATCH DESTINATION
            </span>
            <p className="text-xs font-body text-[#94A3B8] leading-relaxed">
              <strong className="text-[#F8FAFC]">{order.shipping_full_name}</strong>
              <br />
              {order.shipping_line1}
              {order.shipping_line2 && `, ${order.shipping_line2}`}
              <br />
              {order.shipping_city}, {order.shipping_state} &ndash; {order.shipping_postal_code}
              <br />
              Phone: {order.shipping_phone}
            </p>
          </div>
        </div>
      )}

      {/* Delivery & Dispatch Schedule Card */}
      <div className="p-6 bg-[#13151C] border border-[#232733] space-y-4 shadow-xl rounded-none md:rounded-xs">
        <div className="flex items-center justify-between border-b border-[#232733] pb-3">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-[#E2C58A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs font-heading font-black uppercase tracking-widest text-[#F8FAFC]">
              ESTIMATED DELIVERY &amp; DISPATCH SCHEDULE
            </span>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-xs">
            EXPRESS PRIORITY AIR
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-[#0A0B0E] border border-[#232733] rounded-xs space-y-1">
            <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-[#94A3B8] block">
              Estimated Arrival
            </span>
            <p className="font-heading font-black text-[#F8FAFC] text-sm">
              {formatDeliveryDate(order?.estimated_delivery_date, order?.created_at)}
            </p>
            <span className="text-[10px] text-slate-400 font-mono block">2–3 Business Days</span>
          </div>

          <div className="p-3 bg-[#0A0B0E] border border-[#232733] rounded-xs space-y-1">
            <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-[#94A3B8] block">
              Courier Partner
            </span>
            <p className="font-heading font-black text-[#E2C58A] text-sm">
              {order?.courier_partner || "BlueDart Express Air"}
            </p>
            <span className="text-[10px] text-slate-400 font-mono block">Transit Insurance Included</span>
          </div>

          <div className="p-3 bg-[#0A0B0E] border border-[#232733] rounded-xs space-y-1">
            <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-[#94A3B8] block">
              Payment Settlement
            </span>
            <p className="font-heading font-black text-emerald-400 text-sm flex items-center space-x-1">
              <span>✓ 100% PREPAID</span>
            </p>
            <span className="text-[10px] text-red-400 font-mono block">No COD Required</span>
          </div>
        </div>

        {order?.delivery_notes && (
          <div className="p-3 bg-[#0A0B0E] border border-[#232733] rounded-xs text-xs space-y-0.5">
            <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-[#E2C58A] block">
              Dispatch Special Instructions:
            </span>
            <p className="text-[#94A3B8] font-body">{order.delivery_notes}</p>
          </div>
        )}
      </div>

      {/* Settlement Audit */}
      <div className="p-6 bg-[#13151C] border border-[#232733] space-y-3 shadow-xl rounded-none md:rounded-xs">
        <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-[#94A3B8] block border-b border-[#232733] pb-2">
          PAYMENT SETTLEMENT AUDIT
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono text-[#94A3B8]">
          <div>
            <span className="text-[#64748B] block text-[10px]">
              {paymentId.includes("UPI-UTR-") ? "UPI TRANSACTION / UTR REF" : "PAYMENT REFERENCE"}
            </span>
            <span className="text-[#F8FAFC] font-bold truncate block">
              {paymentId.includes("UPI-UTR-") ? paymentId.replace("UPI-UTR-", "") : paymentId}
            </span>
          </div>
          <div>
            <span className="text-[#64748B] block text-[10px]">GATEWAY / PAYMENT METHOD</span>
            <span className="text-[#F8FAFC] truncate block font-heading uppercase">
              {paymentId.includes("UPI-UTR-") ? "UPI QR (Google Pay / PhonePe)" : "Direct Prepaid Settlement"}
            </span>
          </div>
          <div>
            <span className="text-[#64748B] block text-[10px]">TOTAL VALUE</span>
            <span className="font-heading font-bold text-[#E2C58A] block">
              ₹{Number(amount).toLocaleString("en-IN") || amount}
            </span>
          </div>
          <div>
            <span className="text-[#64748B] block text-[10px]">STATUS</span>
            <span className="font-heading font-black text-emerald-400 uppercase tracking-wider block">
              {status.toUpperCase()} &bull; VERIFIED
            </span>
          </div>
        </div>
      </div>

      {/* Authorized Signatory Legal Stamp */}
      <div className="p-6 bg-[#13151C] border border-[#232733] rounded-none md:rounded-xs text-left space-y-1.5 shadow-xl">
        <span className="font-heading font-bold text-xs uppercase tracking-wider text-[#F8FAFC] block">
          AUTHORIZED SIGNATORY
        </span>
        <span className="text-[11px] font-heading text-[#E2C58A] block">
          Digitally Signed &amp; Authenticated &bull; Chennai Hub
        </span>
        <div className="pt-2 text-[10px] font-body text-[#94A3B8] leading-relaxed border-t border-[#232733]/60">
          This is a computer-generated tax invoice issued pursuant to Section 31 of the CGST Act, 2017.
          <br />
          TN78 Men&apos;s Wear &bull; Architectural Menswear &bull; www.tn78menswear.com
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-center flex-wrap gap-4 pt-2">
        {orderNumber && (
          <>
            <a
              href={getOrderInvoicePdfUrl(orderNumber)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#E2C58A] to-[#C6A467] hover:brightness-110 text-[#0A0B0E] font-heading text-xs font-black uppercase tracking-widest transition-all duration-200 rounded-full shadow-[0_0_20px_rgba(226,197,138,0.3)] text-center flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4 text-[#0A0B0E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>DOWNLOAD GST INVOICE (PDF)</span>
            </a>
            <Link
              href={`/orders/track?order_number=${encodeURIComponent(orderNumber)}`}
              className="w-full sm:w-auto px-8 py-4 bg-[#13151C] hover:bg-[#191D28] border border-[#E2C58A] text-[#E2C58A] font-heading text-xs font-black uppercase tracking-widest transition-colors duration-200 rounded-full shadow-md text-center"
            >
              TRACK DISPATCH STATUS
            </Link>
          </>
        )}
        <button
          type="button"
          onClick={handlePrint}
          className="w-full sm:w-auto px-8 py-4 border border-[#232733] hover:border-[#E2C58A]/50 text-[#F8FAFC] font-heading text-xs font-bold uppercase tracking-widest transition-colors duration-200 rounded-full text-center bg-[#0A0B0E] cursor-pointer"
        >
          PRINT RECEIPT
        </button>
        <Link
          href="/shop"
          className="w-full sm:w-auto px-8 py-4 border border-[#232733] hover:border-[#E2C58A]/50 text-[#94A3B8] hover:text-[#F8FAFC] font-heading text-xs font-bold uppercase tracking-widest transition-colors duration-200 rounded-full text-center bg-[#0A0B0E]"
        >
          CONTINUE BROWSING
        </Link>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <div className="bg-[#0A0B0E] min-h-screen text-[#F8FAFC]">
      {/* Top Breadcrumb */}
      <div className="border-b border-[#232733] bg-[#0A0B0E]/90 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center space-x-2 text-[10px] font-heading font-bold uppercase tracking-widest text-[#94A3B8]">
          <Link href="/" className="hover:text-[#F8FAFC] transition-colors">
            HOME
          </Link>
          <span>/</span>
          <Link href="/checkout" className="hover:text-[#F8FAFC] transition-colors">
            CHECKOUT
          </Link>
          <span>/</span>
          <span className="text-[#E2C58A]">CONFIRMATION</span>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="py-28 text-center text-xs font-heading font-bold uppercase tracking-widest text-[#94A3B8]">
            LOADING SETTLEMENT CONFIRMATION...
          </div>
        }
      >
        <ConfirmationContent />
      </Suspense>
    </div>
  );
}
