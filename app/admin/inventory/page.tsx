"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  adminGetInventory,
  adminUpdateInventory,
  AdminInventoryItem,
} from "@/lib/api";

export default function AdminInventoryPage() {
  const [inventory, setInventory] = useState<AdminInventoryItem[]>([]);
  const [editValues, setEditValues] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "low" | "out">("all");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const data = await adminGetInventory();
      setInventory(data);

      // Seed editable values
      const initial: Record<string, number> = {};
      data.forEach((item) => {
        initial[item.variant_id] = item.quantity;
      });
      setEditValues(initial);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load inventory records";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleUpdate = async (variantId: string) => {
    const qty = editValues[variantId];
    if (qty === undefined || qty < 0) return;

    try {
      setSavingId(variantId);
      setMessage(null);
      setError(null);
      const updated = await adminUpdateInventory(variantId, qty);

      setInventory((prev) =>
        prev.map((i) => (i.variant_id === variantId ? updated : i))
      );
      setMessage(`Stock for "${updated.product_name} (${updated.size}/${updated.color})" updated to ${updated.quantity} units.`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update stock quantity";
      setError(message);
    } finally {
      setSavingId(null);
    }
  };

  const filtered = inventory.filter((item) => {
    const matchesSearch =
      item.product_name.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase()) ||
      item.size.toLowerCase().includes(search.toLowerCase()) ||
      item.color.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === "out") return item.quantity === 0;
    if (statusFilter === "low") return item.quantity > 0 && item.quantity <= 5;
    return true;
  });

  return (
    <div className="p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between border-b border-[#EFECE6] pb-6 gap-4">
        <div>
          <span className="text-[10px] font-heading font-extrabold uppercase tracking-widest text-[#9E6544]">
            Logistics &bull; Stock Control
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl font-black uppercase tracking-wider text-[#1A1816] mt-1">
            Warehouse Inventory &amp; Stock
          </h1>
          <p className="text-xs text-[#78716C] font-body mt-0.5">
            Real-time physical stock counts across all garment variants. Adjustments immediately reflect on customer storefront.
          </p>
        </div>
        <button
          onClick={fetchInventory}
          className="bg-white border border-[#EFECE6] hover:border-[#1A1816] text-[#1A1816] text-xs font-mono font-bold uppercase tracking-wider px-5 py-2.5 rounded-full shadow-sm transition-all self-start sm:self-auto"
        >
          ↻ Refresh Stock
        </button>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl">
          ✓ {message}
        </div>
      )}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
          {error}
        </div>
      )}

      {/* Filter and Status tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="w-full max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by garment name, SKU, or size/color..."
            className="w-full bg-white border border-[#EFECE6] rounded-xl px-4 py-2.5 text-xs text-[#1A1816] placeholder-[#A8A29E] focus:outline-none focus:border-[#9E6544] focus:ring-1 focus:ring-[#9E6544]/30 shadow-sm"
          />
        </div>

        <div className="flex items-center space-x-2">
          {(["all", "low", "out"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-4 py-2 text-xs font-heading uppercase tracking-wider transition-all rounded-full ${
                statusFilter === filter
                  ? "bg-[#1A1816] text-[#FAF8F5] font-bold shadow-sm"
                  : "bg-white text-[#78716C] border border-[#EFECE6] hover:border-[#1A1816]/30 hover:text-[#1A1816]"
              }`}
            >
              {filter === "all"
                ? "All Variants"
                : filter === "low"
                ? "Low Stock (≤5)"
                : "Out of Stock (0)"}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white border border-[#EFECE6] rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-body">
            <thead className="bg-[#FAF8F5] font-heading text-[10px] uppercase tracking-wider text-[#78716C] border-b border-[#EFECE6]">
              <tr>
                <th className="py-3.5 px-6">Garment Silhouette</th>
                <th className="py-3.5 px-6">SKU</th>
                <th className="py-3.5 px-6">Size &amp; Color</th>
                <th className="py-3.5 px-6">Warehouse Status</th>
                <th className="py-3.5 px-6">Stock Adjustment</th>
                <th className="py-3.5 px-6 text-right">Commit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFECE6] text-[#1A1816]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#78716C]">
                    Loading warehouse inventory records...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#78716C]">
                    No matching inventory items found.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const currentQty = editValues[item.variant_id] ?? item.quantity;
                  const isDirty = currentQty !== item.quantity;

                  return (
                    <tr key={item.variant_id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                      <td className="py-4 px-6">
                        <Link
                          href={`/product/${item.product_slug}`}
                          target="_blank"
                          className="font-heading font-bold text-xs uppercase tracking-wider text-[#1A1816] hover:text-[#9E6544] transition-colors inline-flex items-center gap-1"
                        >
                          <span>{item.product_name}</span>
                          <span className="text-[10px] text-[#A8A29E]">↗</span>
                        </Link>
                      </td>
                      <td className="py-4 px-6 font-mono text-[11px] text-[#78716C]">
                        {item.sku}
                      </td>
                      <td className="py-4 px-6 font-heading text-xs">
                        <span className="font-bold text-[#1A1816]">{item.size}</span>
                        <span className="text-[#A8A29E] mx-1.5">&bull;</span>
                        <span className="text-[#78716C]">{item.color}</span>
                      </td>
                      <td className="py-4 px-6">
                        {item.quantity === 0 ? (
                          <span className="inline-block px-3 py-0.5 text-[10px] font-heading font-bold uppercase tracking-widest text-rose-700 border border-rose-200 bg-rose-50 rounded-full">
                            Out of Stock (0)
                          </span>
                        ) : item.quantity <= 5 ? (
                          <span className="inline-block px-3 py-0.5 text-[10px] font-heading font-bold uppercase tracking-widest text-amber-800 border border-amber-200 bg-amber-50 rounded-full">
                            Low Stock ({item.quantity})
                          </span>
                        ) : (
                          <span className="inline-block px-3 py-0.5 text-[10px] font-heading font-bold uppercase tracking-widest text-emerald-800 border border-emerald-200 bg-emerald-50 rounded-full">
                            In Stock ({item.quantity})
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            min="0"
                            value={currentQty}
                            onChange={(e) => {
                              const val = Math.max(0, parseInt(e.target.value, 10) || 0);
                              setEditValues((prev) => ({
                                ...prev,
                                [item.variant_id]: val,
                              }));
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleUpdate(item.variant_id);
                            }}
                            className={`w-24 bg-[#FAF8F5] border px-3 py-1.5 text-xs text-[#1A1816] rounded-lg focus:outline-none focus:border-[#9E6544] ${
                              isDirty
                                ? "border-[#9E6544] font-bold text-[#9E6544] bg-[#FAF8F5]"
                                : "border-[#EFECE6]"
                            }`}
                          />
                          {isDirty && (
                            <span className="text-[10px] text-[#9E6544] font-mono font-bold">
                              • modified
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleUpdate(item.variant_id)}
                          disabled={savingId === item.variant_id || !isDirty}
                          className={`px-4 py-1.5 text-[11px] font-heading font-bold uppercase tracking-wider rounded-full transition-all ${
                            isDirty
                              ? "bg-[#D5C0A5] hover:bg-[#C4AC8F] text-[#1A1816] shadow-sm cursor-pointer"
                              : "bg-[#FAF8F5] border border-[#EFECE6] text-[#A8A29E] cursor-not-allowed opacity-60"
                          } disabled:opacity-50`}
                        >
                          {savingId === item.variant_id ? "Saving..." : "Update Stock"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
