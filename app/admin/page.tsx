"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  adminGetInventory,
  adminGetOrders,
  adminGetProducts,
  adminGetReturns,
  AdminInventoryItem,
  AdminProduct,
  OrderOut,
  ReturnRequestDto,
} from "@/lib/api";

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<OrderOut[]>([]);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [inventory, setInventory] = useState<AdminInventoryItem[]>([]);
  const [returns, setReturns] = useState<ReturnRequestDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const [ordersRes, productsRes, invRes, returnsRes] = await Promise.all([
          adminGetOrders({ page: 1, page_size: 10 }),
          adminGetProducts(),
          adminGetInventory(),
          adminGetReturns({ status: "requested", page: 1, page_size: 20 }),
        ]);
        setOrders(ordersRes.items);
        setTotalOrders(ordersRes.total);
        setProducts(productsRes);
        setInventory(invRes);
        setReturns(returnsRes.items);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to load dashboard metrics";
        setError(message);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const pendingOrders = orders.filter(
    (o) => o.status === "confirmed" || o.status === "processing"
  ).length;
  const lowStockItems = inventory.filter((i) => i.quantity <= 5).length;
  const activeProducts = products.filter((p) => p.is_active).length;
  const grossRevenue = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);

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
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between border-b border-[#EFECE6] pb-6 gap-4">
        <div>
          <span className="text-[10px] font-heading font-extrabold uppercase tracking-widest text-[#9E6544]">
            TN78 Executive Console
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl font-black uppercase tracking-wider text-[#1A1816] mt-1">
            Backoffice Overview
          </h1>
          <p className="text-xs text-[#78716C] font-body mt-0.5">
            Store operations, garment inventory, and live courier fulfillment controls.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/products/new"
            className="bg-[#D5C0A5] hover:bg-[#C4AC8F] text-[#1A1816] text-xs font-heading font-black uppercase tracking-wider px-5 py-2.5 rounded-full shadow-sm transition-all"
          >
            + New Garment
          </Link>
          <Link
            href="/admin/inventory"
            className="bg-white border border-[#EFECE6] hover:bg-[#FAF8F5] text-[#1A1816] text-xs font-heading font-bold uppercase tracking-wider px-4 py-2.5 rounded-full transition-colors"
          >
            Adjust Stock
          </Link>
          <Link
            href="/admin/coupons"
            className="bg-white border border-[#EFECE6] hover:bg-[#FAF8F5] text-[#1A1816] text-xs font-heading font-bold uppercase tracking-wider px-4 py-2.5 rounded-full transition-colors"
          >
            Promotions
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
          {error}
        </div>
      )}

      {/* Metrics Row (Medium-Sized KPI Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="bg-white border border-[#EFECE6] rounded-xl p-4 sm:p-5 shadow-xs space-y-1.5">
          <p className="text-[10px] font-heading font-extrabold uppercase tracking-widest text-[#78716C]">
            Total Volume
          </p>
          <p className="font-heading text-2xl font-black text-[#1A1816]">
            {loading ? "..." : totalOrders}
          </p>
          <div className="flex items-center justify-between pt-1.5 border-t border-[#EFECE6] text-[10px] sm:text-[11px]">
            <span className="text-[#78716C]">Recent Gross</span>
            <span className="font-mono font-bold text-[#9E6544]">
              ₹{grossRevenue.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        <div className="bg-white border border-[#EFECE6] rounded-xl p-4 sm:p-5 shadow-xs space-y-1.5">
          <p className="text-[10px] font-heading font-extrabold uppercase tracking-widest text-[#78716C]">
            Orders in Fulfillment
          </p>
          <p className="font-heading text-2xl font-black text-[#9E6544]">
            {loading ? "..." : pendingOrders}
          </p>
          <div className="flex items-center justify-between pt-1.5 border-t border-[#EFECE6] text-[10px] sm:text-[11px]">
            <span className="text-[#78716C]">In Progress</span>
            <Link href="/admin/orders?status=processing" className="text-[#1A1816] font-bold hover:underline">
              Fulfill &rarr;
            </Link>
          </div>
        </div>

        <div className="bg-white border border-[#EFECE6] rounded-xl p-4 sm:p-5 shadow-xs space-y-1.5">
          <p className="text-[10px] font-heading font-extrabold uppercase tracking-widest text-[#78716C]">
            Returns Awaiting QC
          </p>
          <p
            className={`font-heading text-2xl font-black ${
              returns.length > 0 ? "text-amber-700" : "text-[#1A1816]"
            }`}
          >
            {loading ? "..." : returns.length}
          </p>
          <div className="flex items-center justify-between pt-1.5 border-t border-[#EFECE6] text-[10px] sm:text-[11px]">
            <span className="text-[#78716C]">Pending Review</span>
            <Link href="/admin/returns" className="text-[#1A1816] font-bold hover:underline">
              Review Queue &rarr;
            </Link>
          </div>
        </div>

        <div className="bg-white border border-[#EFECE6] rounded-xl p-4 sm:p-5 shadow-xs space-y-1.5">
          <p className="text-[10px] font-heading font-extrabold uppercase tracking-widest text-[#78716C]">
            Low Stock Warnings
          </p>
          <p
            className={`font-heading text-2xl font-black ${
              lowStockItems > 0 ? "text-rose-700" : "text-[#1A1816]"
            }`}
          >
            {loading ? "..." : lowStockItems}
          </p>
          <div className="flex items-center justify-between pt-1.5 border-t border-[#EFECE6] text-[10px] sm:text-[11px]">
            <span className="text-[#78716C]">Items &le; 5 units</span>
            <Link href="/admin/inventory" className="text-[#1A1816] font-bold hover:underline">
              Restock &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white border border-[#EFECE6] rounded-2xl shadow-sm overflow-hidden space-y-0">
        <div className="p-6 border-b border-[#EFECE6] flex items-center justify-between">
          <div>
            <h2 className="font-heading text-base font-black uppercase tracking-wider text-[#1A1816]">
              Recent Commissions &amp; Orders
            </h2>
            <p className="text-xs text-[#78716C] font-body mt-0.5">
              Live purchases pending or currently dispatched with national air couriers.
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-heading font-bold text-[#9E6544] hover:underline uppercase tracking-wider"
          >
            View All Orders &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-body">
            <thead className="bg-[#FAF8F5] font-heading text-[10px] uppercase tracking-wider text-[#78716C] border-b border-[#EFECE6]">
              <tr>
                <th className="py-3.5 px-6">Order Reference</th>
                <th className="py-3.5 px-6">Date</th>
                <th className="py-3.5 px-6">Recipient</th>
                <th className="py-3.5 px-6">Garments</th>
                <th className="py-3.5 px-6">Settled Total</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Fulfillment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFECE6] text-[#1A1816]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#78716C]">
                    Loading recent orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#78716C]">
                    No orders recorded yet.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                    <td className="py-4 px-6 font-mono text-[#1A1816] font-bold">
                      {o.order_number}
                    </td>
                    <td className="py-4 px-6 text-[#78716C]">
                      {new Date(o.created_at).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-heading font-bold text-xs uppercase">{o.shipping_full_name}</div>
                      <div className="text-[10px] text-[#78716C] font-mono">{o.guest_email || "Client"}</div>
                    </td>
                    <td className="py-4 px-6 text-[#78716C]">
                      {o.items.reduce((s, i) => s + i.quantity, 0)} garment(s)
                    </td>
                    <td className="py-4 px-6 font-mono font-bold text-[#1A1816]">
                      ₹{o.total.toLocaleString("en-IN")}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-3 py-0.5 text-[10px] font-heading font-bold uppercase tracking-wider rounded-full border ${getStatusBadge(
                          o.status
                        )}`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        href={`/admin/orders/${encodeURIComponent(o.order_number)}`}
                        className="inline-block px-4 py-1.5 bg-[#FAF8F5] hover:bg-[#EFECE6] border border-[#EFECE6] text-[#1A1816] text-[11px] font-heading font-bold uppercase tracking-wider rounded-full transition-colors"
                      >
                        Inspect &rarr;
                      </Link>

        <Link
          href="/admin/shipping"
          className="p-6 bg-white border border-[#EFECE6] rounded-2xl hover:border-[#9E6544] transition-all shadow-xs group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#EFECE6] flex items-center justify-center text-lg mb-4 group-hover:scale-110 transition-transform">
            🚚
          </div>
          <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-[#1A1816] mb-1">
            Delivery &amp; Shipping Rates
          </h2>
          <p className="text-xs text-[#78716C] leading-relaxed">
            Configure regional delivery rates, location prediction (TN, South, Pan-India), and free delivery thresholds.
          </p>
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
