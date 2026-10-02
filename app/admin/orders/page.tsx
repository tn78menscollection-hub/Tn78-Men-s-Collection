"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { adminGetOrders, OrderOut } from "@/lib/api";

const ORDER_STATUS_TABS = [
  { label: "All Orders", value: "all" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Processing / QC", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderOut[]>([]);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async (status: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminGetOrders({
        status: status === "all" ? undefined : status,
        page: 1,
        page_size: 100,
      });
      setOrders(res.items);
      setTotal(res.total);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load orders";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(statusFilter);
  }, [statusFilter]);

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    return (
      o.order_number.toLowerCase().includes(q) ||
      o.shipping_full_name.toLowerCase().includes(q) ||
      (o.guest_email && o.guest_email.toLowerCase().includes(q)) ||
      (o.tracking_number && o.tracking_number.toLowerCase().includes(q))
    );
  });

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "text-blue-800 bg-blue-50 border-blue-200";
      case "processing":
        return "text-amber-800 bg-amber-50 border-amber-200";
      case "shipped":
        return "text-indigo-800 bg-indigo-50 border-indigo-200";
      case "delivered":
        return "text-emerald-800 bg-emerald-50 border-emerald-200";
      case "cancelled":
        return "text-rose-800 bg-rose-50 border-rose-200";
      default:
        return "text-[#78716C] bg-[#FAF8F5] border-[#EFECE6]";
    }
  };

  return (
    <div className="p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between border-b border-[#EFECE6] pb-6 gap-4">
        <div>
          <span className="text-[10px] font-heading font-extrabold uppercase tracking-widest text-[#9E6544]">
            Fulfillment Console &bull; Air Express Dispatch
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl font-black uppercase tracking-wider text-[#1A1816] mt-1">
            Order Fulfillment &amp; Dispatch
          </h1>
          <p className="text-xs text-[#78716C] font-body mt-0.5">
            Manage garment commissions, assign express courier AWB numbers, and update dispatch tracking states.
          </p>
        </div>
        <button
          onClick={() => fetchOrders(statusFilter)}
          className="border border-[#1A1816] hover:bg-[#1A1816] text-[#1A1816] hover:text-[#FAF8F5] text-xs font-heading font-bold uppercase tracking-wider px-5 py-2.5 rounded-full transition-colors self-start sm:self-auto"
        >
          ↻ Refresh Orders
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
          {error}
        </div>
      )}

      {/* Status Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {ORDER_STATUS_TABS.map((tab) => {
          const isActive = statusFilter === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-4 py-2 text-xs font-heading uppercase tracking-wider rounded-full transition-all whitespace-nowrap ${
                isActive
                  ? "bg-[#1A1816] text-[#FAF8F5] font-bold shadow-sm"
                  : "bg-white border border-[#EFECE6] text-[#78716C] hover:text-[#1A1816] hover:border-[#D5C0A5]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Search & Counter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID (TN78-...), customer name, or AWB..."
            className="w-full bg-white border border-[#EFECE6] rounded-xl px-4 py-3 text-xs text-[#1A1816] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#9E6544] focus:ring-1 focus:ring-[#9E6544]/30 shadow-sm"
          />
        </div>
        <div className="text-xs font-heading text-[#78716C] uppercase tracking-wider self-end sm:self-center">
          Displaying: <strong className="text-[#1A1816]">{filtered.length}</strong> of {total} Commissions
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-[#EFECE6] rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-body">
            <thead className="bg-[#FAF8F5] font-heading text-[10px] uppercase tracking-wider text-[#78716C] border-b border-[#EFECE6]">
              <tr>
                <th className="py-3.5 px-6">Order Reference</th>
                <th className="py-3.5 px-6">Date</th>
                <th className="py-3.5 px-6">Client Recipient</th>
                <th className="py-3.5 px-6">Carrier / AWB</th>
                <th className="py-3.5 px-6">Garments</th>
                <th className="py-3.5 px-6">Settled Total</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Fulfillment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFECE6] text-[#1A1816]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#78716C]">
                    Loading customer commissions...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#78716C]">
                    No matching orders found in this view.
                  </td>
                </tr>
              ) : (
                filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                    <td className="py-4 px-6 font-mono text-[#1A1816] font-bold">
                      {order.order_number}
                    </td>
                    <td className="py-4 px-6 text-[#78716C]">
                      {new Date(order.created_at).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-heading font-bold text-xs uppercase text-[#1A1816]">
                        {order.shipping_full_name}
                      </div>
                      <div className="text-[10px] text-[#78716C] font-mono">
                        {order.shipping_city}, {order.shipping_state}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {order.tracking_number ? (
                        <div className="space-y-0.5">
                          <span className="font-mono text-[11px] font-bold text-[#9E6544] block">
                            {order.tracking_number}
                          </span>
                          <span className="text-[10px] text-[#78716C]">
                            {order.courier_partner || "Express Air"}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-[#A8A29E] italic">
                          Awaiting Dispatch
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-[#78716C]">
                      {order.items.reduce((acc, i) => acc + i.quantity, 0)} garment(s)
                    </td>
                    <td className="py-4 px-6 font-mono font-bold text-[#1A1816]">
                      ₹{order.total.toLocaleString("en-IN")}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-3 py-0.5 text-[10px] font-heading font-bold uppercase tracking-wider rounded-full border ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        href={`/admin/orders/${encodeURIComponent(order.order_number)}`}
                        className="inline-block px-4 py-1.5 bg-[#FAF8F5] hover:bg-[#EFECE6] border border-[#EFECE6] text-[#1A1816] text-[11px] font-heading font-bold uppercase tracking-wider rounded-full transition-colors"
                      >
                        Manage &rarr;
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
