"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getMyOrders, getStoredAuthToken, OrderOut } from "@/lib/api";
import AccountTabs from "@/components/account/AccountTabs";

export default function AccountOrdersPage() {
  const [orders, setOrders] = useState<OrderOut[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthed, setIsAuthed] = useState<boolean>(false);
  const [guestOrderNum, setGuestOrderNum] = useState("");
  const [guestEmail, setGuestEmail] = useState("");

  useEffect(() => {
    const token = getStoredAuthToken();
    if (!token) {
      setIsAuthed(false);
      setLoading(false);
      return;
    }
    setIsAuthed(true);

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getMyOrders();
        setOrders(res);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to load orders archive.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "text-blue-400 bg-blue-950/70 border-blue-500/40";
      case "processing":
        return "text-amber-400 bg-amber-950/70 border-amber-500/40";
      case "shipped":
      case "dispatched":
        return "text-indigo-400 bg-indigo-950/70 border-indigo-500/40";
      case "delivered":
        return "text-emerald-400 bg-emerald-950/70 border-emerald-500/40";
      case "cancelled":
        return "text-rose-400 bg-rose-950/70 border-rose-500/40";
      default:
        return "text-[#94A3B8] bg-[#13151C] border-[#232733]";
    }
  };

  return (
    <div className="bg-[#0A0B0E] min-h-screen text-[#F8FAFC] pb-28">
      {/* Breadcrumb Header */}
      <div className="border-b border-[#232733] px-4 sm:px-6 lg:px-8 py-3.5 bg-[#13151C]/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center space-x-2 text-[10px] font-heading font-bold uppercase tracking-widest text-[#94A3B8]">
          <Link href="/" className="hover:text-[#F8FAFC] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#94A3B8]">Client Account</span>
          <span>/</span>
          <span className="text-[#E2C58A]">Order Archive</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12 space-y-8">
        {/* Navigation Tabs */}
        <AccountTabs activeTab="orders" />

        {/* Header */}
        <div className="border-b border-[#232733] pb-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <span className="text-[10px] font-heading font-extrabold uppercase tracking-widest text-[#E2C58A]">
              Bespoke Commissions &bull; Purchase Record
            </span>
            <h1 className="font-heading font-black text-2xl sm:text-3xl uppercase tracking-wider text-[#F8FAFC] mt-1">
              Order Archive
            </h1>
          </div>
          <span className="text-xs font-body text-[#94A3B8]">
            {orders.length} Registered {orders.length === 1 ? "Commission" : "Commissions"}
          </span>
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-[#E2C58A] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-heading font-bold uppercase tracking-widest text-[#94A3B8]">
              Retrieving Orders...
            </p>
          </div>
        ) : !isAuthed ? (
          <div className="bg-[#13151C] border border-[#232733] rounded-2xl p-8 sm:p-12 space-y-8 shadow-2xl max-w-2xl mx-auto">
            <div className="text-center space-y-3">
              <span className="text-[10px] font-heading font-extrabold uppercase tracking-widest text-[#E2C58A] bg-[#E2C58A]/10 border border-[#E2C58A]/30 px-3.5 py-1 rounded-full inline-block">
                Client Verification &bull; Order Tracking
              </span>
              <h2 className="font-heading font-black text-xl sm:text-2xl uppercase tracking-wider text-[#F8FAFC]">
                Access Your Order Archive
              </h2>
              <p className="text-xs font-body text-[#94A3B8] max-w-md mx-auto leading-relaxed">
                Sign in to your bespoke client account to view complete order archives, or track any recent guest purchase using your Order Number and Email.
              </p>
            </div>

            {/* Quick Guest Lookup Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (guestOrderNum.trim()) {
                  window.location.href = `/orders/track?order_number=${encodeURIComponent(
                    guestOrderNum.trim()
                  )}&email=${encodeURIComponent(guestEmail.trim())}`;
                }
              }}
              className="space-y-4 bg-[#0A0B0E] p-6 rounded-xl border border-[#232733]"
            >
              <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-[#94A3B8] block">
                Quick Guest Order Lookup
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Order Number (e.g. TN78-2026-XXXX)"
                  value={guestOrderNum}
                  onChange={(e) => setGuestOrderNum(e.target.value)}
                  className="w-full bg-[#13151C] border border-[#232733] focus:border-[#E2C58A] rounded-lg px-3.5 py-2.5 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none transition-colors"
                  required
                />
                <input
                  type="email"
                  placeholder="Customer Email Address"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  className="w-full bg-[#13151C] border border-[#232733] focus:border-[#E2C58A] rounded-lg px-3.5 py-2.5 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none transition-colors"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-[#E2C58A] to-[#C6A467] text-[#0A0B0E] font-heading text-xs font-black uppercase tracking-widest rounded-lg shadow-[0_0_15px_rgba(226,197,138,0.25)] hover:brightness-110 transition-all"
              >
                Track Guest Order &rarr;
              </button>
            </form>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 text-center">
              <Link
                href="/shop"
                className="px-6 py-2.5 bg-[#0A0B0E] border border-[#232733] hover:border-[#E2C58A] text-[#F8FAFC] font-heading text-xs font-bold uppercase tracking-widest rounded-full transition-colors"
              >
                Explore The Collection &rarr;
              </Link>
            </div>
          </div>
        ) : error ? (
          <div className="p-6 bg-red-950/60 border border-red-500/40 text-red-300 text-xs text-center font-heading uppercase rounded-xl">
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center bg-[#13151C] border border-[#232733] rounded-2xl p-8 space-y-5 shadow-xl">
            <div className="w-12 h-12 rounded-full bg-[#0A0B0E] border border-[#232733] flex items-center justify-center mx-auto text-[#E2C58A] font-heading font-black text-sm">
              TN
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-heading font-black uppercase tracking-wider text-[#F8FAFC]">
                No Commissions Recorded Yet
              </h3>
              <p className="text-xs font-body text-[#94A3B8] max-w-sm mx-auto">
                Explore our current collection of tailored overshirts, linen trousers, and artisanal menswear.
              </p>
            </div>
            <Link
              href="/shop"
              className="inline-block px-8 py-3.5 bg-gradient-to-r from-[#E2C58A] to-[#C6A467] text-[#0A0B0E] font-heading text-xs uppercase tracking-widest font-black rounded-full shadow-[0_0_20px_rgba(226,197,138,0.25)] hover:brightness-110 transition-all"
            >
              Explore The Collection
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-[#13151C] border border-[#232733] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#232733] pb-4 gap-3">
                  <div>
                    <span className="font-heading font-extrabold text-sm uppercase tracking-wider text-[#F8FAFC]">
                      Order #{order.order_number}
                    </span>
                    <span className="text-[11px] font-mono text-[#94A3B8] block mt-0.5">
                      Placed on {new Date(order.created_at).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span
                      className={`text-[10px] font-heading font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${getStatusBadge(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                    <span className="font-heading font-black text-base text-[#E2C58A]">
                      ₹{order.total.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Delivery & Logistics Snippet */}
                <div className="p-3 bg-[#0A0B0E] border border-[#232733] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                    <div>
                      <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-[#94A3B8] block">
                        {order.status.toLowerCase() === "delivered" ? "Delivered" : "Estimated Arrival"}
                      </span>
                      <span className="font-heading font-bold text-white text-xs">
                        {order.estimated_delivery_date
                          ? new Date(order.estimated_delivery_date).toLocaleDateString("en-IN", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })
                          : "2–3 Business Days from Order"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-[11px] font-mono text-slate-400">
                    {order.tracking_number ? (
                      <span className="px-2 py-0.5 bg-[#191D28] border border-[#232733] rounded text-[#E2C58A]">
                        AWB: {order.tracking_number}
                      </span>
                    ) : (
                      <span className="text-slate-500">
                        {order.courier_partner || "BlueDart Express Air"}
                      </span>
                    )}
                    <span className="text-emerald-400 font-semibold">⚡ Prepaid (No COD)</span>
                  </div>
                </div>

                {/* Items */}
                <div className="divide-y divide-[#232733]">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="py-3.5 flex items-center justify-between text-xs font-heading"
                    >
                      <div className="flex items-center space-x-3">
                        {item.image_url_snapshot && (
                          <img
                            src={item.image_url_snapshot}
                            alt={item.product_name_snapshot}
                            className="w-12 h-14 object-cover bg-[#0A0B0E] rounded border border-[#232733] flex-shrink-0"
                          />
                        )}
                        <div>
                          <span className="text-[#F8FAFC] font-bold uppercase tracking-wider block">
                            {item.product_name_snapshot}
                          </span>
                          <span className="text-[11px] text-[#94A3B8] font-mono">
                            {item.variant_label_snapshot ? `${item.variant_label_snapshot} • ` : ""}Qty: {item.quantity} • ₹{item.unit_price_snapshot.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                      <span className="font-bold text-[#E2C58A]">
                        ₹{item.line_total.toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-[#232733] flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="text-[11px] text-[#94A3B8] font-body text-center sm:text-left">
                    All TN78 orders are eligible for complimentary 7-day size adjustments upon delivery.
                  </span>

                  <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
                    <Link
                      href={`/orders/track?order_number=${order.order_number}&email=${order.guest_email || ""}`}
                      className="px-4 py-2 bg-[#0A0B0E] hover:bg-[#161922] border border-[#232733] hover:border-[#E2C58A] text-[#F8FAFC] text-[11px] font-heading font-bold uppercase tracking-wider rounded-full transition-colors"
                    >
                      Track Dispatch &rarr;
                    </Link>

                    {order.status.toLowerCase() === "delivered" && (
                      <Link
                        href={`/account/orders/${order.order_number}/return`}
                        className="px-4 py-2 bg-gradient-to-r from-[#E2C58A] to-[#C6A467] text-[#0A0B0E] text-[11px] font-heading font-black uppercase tracking-wider rounded-full shadow-[0_0_15px_rgba(226,197,138,0.25)] hover:brightness-110 transition-colors"
                      >
                        Request Return / Exchange
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
