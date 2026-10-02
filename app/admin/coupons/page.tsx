"use client";

import React, { useEffect, useState } from "react";
import {
  adminCreateCoupon,
  adminDeleteCoupon,
  AdminCouponDto,
  adminGetCoupons,
  adminUpdateCoupon,
} from "@/lib/api";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<AdminCouponDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const [newCode, setNewCode] = useState("");
  const [newType, setNewType] = useState<"percentage" | "fixed">("percentage");
  const [newValue, setNewValue] = useState<number>(10);
  const [newMinOrder, setNewMinOrder] = useState<number | undefined>(1999);
  const [newMaxUses, setNewMaxUses] = useState<number | undefined>(100);
  const [newValidUntil, setNewValidUntil] = useState<string>("");

  const loadCoupons = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminGetCoupons();
      setCoupons(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load coupons list";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleToggleActive = async (c: AdminCouponDto) => {
    try {
      const updated = await adminUpdateCoupon(c.id, { is_active: !c.is_active });
      setCoupons((prev) => prev.map((item) => (item.id === c.id ? updated : item)));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update coupon status";
      alert(message);
    }
  };

  const handleDelete = async (c: AdminCouponDto) => {
    if (!confirm(`Are you sure you want to permanently delete coupon "${c.code}"?`)) return;
    try {
      await adminDeleteCoupon(c.id);
      setCoupons((prev) => prev.filter((item) => item.id !== c.id));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to delete coupon";
      alert(message);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;

    try {
      setCreateLoading(true);
      setCreateError(null);
      const created = await adminCreateCoupon({
        code: newCode.trim().toUpperCase(),
        discount_type: newType,
        discount_value: Number(newValue),
        min_order_value: newMinOrder ? Number(newMinOrder) : undefined,
        max_uses: newMaxUses ? Number(newMaxUses) : undefined,
        valid_until: newValidUntil ? new Date(newValidUntil).toISOString() : undefined,
        is_active: true,
      });
      setCoupons((prev) => [created, ...prev]);
      setShowCreateModal(false);
      // Reset form
      setNewCode("");
      setNewValue(10);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create coupon";
      setCreateError(message);
    } finally {
      setCreateLoading(false);
    }
  };

  const activeCount = coupons.filter((c) => c.is_active).length;
  const totalRedemptions = coupons.reduce((sum, c) => sum + (c.times_used || 0), 0);

  return (
    <div className="p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between border-b border-[#EFECE6] pb-6 gap-4">
        <div>
          <span className="text-[10px] font-heading font-extrabold uppercase tracking-widest text-[#9E6544]">
            Promotions &bull; Client Privilege Incentives
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl font-black uppercase tracking-wider text-[#1A1816] mt-1">
            Coupons &amp; Promotional Codes
          </h1>
          <p className="text-xs text-[#78716C] font-body mt-0.5">
            Configure percentage discounts, minimum subtotal thresholds, and usage caps across the storefront.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="bg-[#D5C0A5] hover:bg-[#C4AC8F] text-[#1A1816] text-xs font-heading font-black uppercase tracking-wider px-6 py-2.5 rounded-full shadow-sm transition-all self-start sm:self-auto"
        >
          + Create New Coupon
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
          {error}
        </div>
      )}

      {/* KPI Row (Medium-Sized) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
        <div className="bg-white border border-[#EFECE6] rounded-xl p-4 sm:p-5 shadow-xs space-y-1">
          <p className="text-[10px] font-heading font-extrabold uppercase tracking-widest text-[#78716C]">
            Total Registered Codes
          </p>
          <p className="font-heading text-2xl font-black text-[#1A1816]">
            {loading ? "..." : coupons.length}
          </p>
        </div>
        <div className="bg-white border border-[#EFECE6] rounded-xl p-4 sm:p-5 shadow-xs space-y-1">
          <p className="text-[10px] font-heading font-extrabold uppercase tracking-widest text-[#78716C]">
            Active Privileges
          </p>
          <p className="font-heading text-2xl font-black text-emerald-800">
            {loading ? "..." : activeCount}
          </p>
        </div>
        <div className="bg-white border border-[#EFECE6] rounded-xl p-4 sm:p-5 shadow-xs space-y-1">
          <p className="text-[10px] font-heading font-extrabold uppercase tracking-widest text-[#78716C]">
            Total Redemptions
          </p>
          <p className="font-heading text-2xl font-black text-[#9E6544]">
            {loading ? "..." : totalRedemptions}
          </p>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-white border border-[#EFECE6] rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#EFECE6] flex items-center justify-between">
          <h2 className="font-heading text-base font-black uppercase tracking-wider text-[#1A1816]">
            Active &amp; Archived Promotional Codes
          </h2>
          <span className="text-xs text-[#78716C]">
            {coupons.length} Vouchers Listed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-body">
            <thead className="bg-[#FAF8F5] font-heading text-[10px] uppercase tracking-wider text-[#78716C] border-b border-[#EFECE6]">
              <tr>
                <th className="py-3.5 px-6">Voucher Code</th>
                <th className="py-3.5 px-6">Discount Benefit</th>
                <th className="py-3.5 px-6">Order Threshold</th>
                <th className="py-3.5 px-6">Redemptions</th>
                <th className="py-3.5 px-6">Expiry Date</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFECE6] text-[#1A1816]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#78716C]">
                    Loading promotional vouchers...
                  </td>
                </tr>
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#78716C]">
                    No promotional coupons registered yet. Click &ldquo;+ Create New Coupon&rdquo; to add one.
                  </td>
                </tr>
              ) : (
                coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-[#1A1816] text-sm tracking-wider">
                      <span className="bg-[#FAF8F5] border border-[#EFECE6] px-2.5 py-1 rounded-md text-[#9E6544]">
                        {c.code}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-heading font-bold text-xs">
                      {c.discount_type === "percentage"
                        ? `${c.discount_value}% OFF`
                        : `₹${Number(c.discount_value).toLocaleString("en-IN")} FLAT OFF`}
                    </td>
                    <td className="py-4 px-6 text-[#78716C]">
                      {c.min_order_value ? `Min ₹${Number(c.min_order_value).toLocaleString("en-IN")}` : "No minimum"}
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-mono text-xs font-bold text-[#1A1816]">
                        {c.times_used}
                      </span>
                      <span className="text-[#78716C]"> / {c.max_uses ? `${c.max_uses} max` : "Unlimited"}</span>
                    </td>
                    <td className="py-4 px-6 text-[#78716C]">
                      {c.valid_until
                        ? new Date(c.valid_until).toLocaleDateString("en-IN", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Never expires"}
                    </td>
                    <td className="py-4 px-6">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(c)}
                        className={`px-3 py-1 text-[10px] font-heading font-bold uppercase tracking-wider rounded-full border transition-all ${
                          c.is_active
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : "bg-stone-100 text-stone-600 border-stone-200"
                        }`}
                      >
                        {c.is_active ? "● Active" : "○ Inactive"}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => handleDelete(c)}
                        className="text-xs text-rose-600 hover:text-rose-800 font-bold transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Coupon Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-[#EFECE6] rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#EFECE6] pb-4">
              <div>
                <span className="text-[10px] font-heading font-extrabold uppercase tracking-widest text-[#9E6544]">
                  New Privilege
                </span>
                <h3 className="font-heading font-black text-lg uppercase tracking-wider text-[#1A1816]">
                  Create Promotional Code
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-xs text-[#78716C] hover:text-[#1A1816] font-bold"
              >
                ✕
              </button>
            </div>

            {createError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                {createError}
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-heading font-bold uppercase tracking-widest text-[#78716C] mb-1.5">
                  Promotional Voucher Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DIWALI20"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                  className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-xl px-4 py-2.5 text-xs font-mono uppercase text-[#1A1816] focus:bg-white focus:border-[#9E6544] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-heading font-bold uppercase tracking-widest text-[#78716C] mb-1.5">
                    Discount Type *
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as "percentage" | "fixed")}
                    className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-xl px-4 py-2.5 text-xs text-[#1A1816] focus:bg-white focus:border-[#9E6544] focus:outline-none"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed INR (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-heading font-bold uppercase tracking-widest text-[#78716C] mb-1.5">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newValue}
                    onChange={(e) => setNewValue(Number(e.target.value))}
                    placeholder={newType === "percentage" ? "15" : "500"}
                    className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-xl px-4 py-2.5 text-xs text-[#1A1816] focus:bg-white focus:border-[#9E6544] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-heading font-bold uppercase tracking-widest text-[#78716C] mb-1.5">
                    Minimum Subtotal (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={newMinOrder || ""}
                    onChange={(e) => setNewMinOrder(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="1999"
                    className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-xl px-4 py-2.5 text-xs text-[#1A1816] focus:bg-white focus:border-[#9E6544] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-heading font-bold uppercase tracking-widest text-[#78716C] mb-1.5">
                    Max Total Redemptions
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={newMaxUses || ""}
                    onChange={(e) => setNewMaxUses(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="100"
                    className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-xl px-4 py-2.5 text-xs text-[#1A1816] focus:bg-white focus:border-[#9E6544] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-heading font-bold uppercase tracking-widest text-[#78716C] mb-1.5">
                  Expiration Date (Optional)
                </label>
                <input
                  type="date"
                  value={newValidUntil}
                  onChange={(e) => setNewValidUntil(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-xl px-4 py-2.5 text-xs text-[#1A1816] focus:bg-white focus:border-[#9E6544] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#EFECE6]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-5 py-2.5 bg-white border border-[#EFECE6] text-[#78716C] hover:text-[#1A1816] text-xs font-heading font-bold uppercase tracking-wider rounded-full transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="px-6 py-2.5 bg-[#D5C0A5] hover:bg-[#C4AC8F] text-[#1A1816] text-xs font-heading font-black uppercase tracking-wider rounded-full shadow-sm transition-colors disabled:opacity-50"
                >
                  {createLoading ? "Creating..." : "Issue Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
