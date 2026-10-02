"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { adminGetReturns, adminModerateReturn, ReturnRequestDto } from "@/lib/api";

const RETURN_STATUS_TABS = [
  { label: "All Returns", value: "all" },
  { label: "Pending QC", value: "requested" },
  { label: "Approved / In Transit", value: "approved" },
  { label: "Resolved / Refunded", value: "refunded" },
  { label: "Rejected", value: "rejected" },
];

export default function AdminReturnsPage() {
  const [returns, setReturns] = useState<ReturnRequestDto[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [statusFilter, setStatusFilter] = useState<string>("requested");
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Moderation notes editing state
  const [selectedReturn, setSelectedReturn] = useState<ReturnRequestDto | null>(null);
  const [adminNotes, setAdminNotes] = useState<string>("");
  const [targetStatus, setTargetStatus] = useState<"approved" | "rejected" | "refunded" | null>(null);

  const fetchReturns = async (status: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminGetReturns({
        status: status === "all" ? undefined : status,
        page: 1,
        page_size: 100,
      });
      setReturns(res.items);
      setTotal(res.total);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load returns.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns(statusFilter);
  }, [statusFilter]);

  const openActionModal = (
    ret: ReturnRequestDto,
    status: "approved" | "rejected" | "refunded"
  ) => {
    setSelectedReturn(ret);
    setTargetStatus(status);
    setAdminNotes(ret.admin_notes || "");
  };

  const submitAction = async () => {
    if (!selectedReturn || !targetStatus) return;
    try {
      setActionLoading(selectedReturn.id);
      const updated = await adminModerateReturn(
        selectedReturn.id,
        targetStatus,
        adminNotes.trim() || undefined
      );
      setReturns((prev) =>
        prev.map((r) => (r.id === selectedReturn.id ? updated : r))
      );
      setSelectedReturn(null);
      setTargetStatus(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : `Failed to transition return to ${targetStatus}.`;
      alert(message);
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = returns.filter((r) => {
    const q = search.toLowerCase();
    return (
      (r.order_number && r.order_number.toLowerCase().includes(q)) ||
      (r.product_name && r.product_name.toLowerCase().includes(q)) ||
      (r.user_email && r.user_email.toLowerCase().includes(q)) ||
      r.reason.toLowerCase().includes(q)
    );
  });

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "requested":
        return "text-amber-800 bg-amber-50 border-amber-200";
      case "approved":
        return "text-blue-800 bg-blue-50 border-blue-200";
      case "refunded":
      case "replaced":
        return "text-emerald-800 bg-emerald-50 border-emerald-200";
      case "rejected":
        return "text-rose-800 bg-rose-50 border-rose-200";
      default:
        return "text-[#78716C] bg-[#FAF8F5] border-[#EFECE6]";
    }
  };

  return (
    <div className="p-6 sm:p-8 lg:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-4 border-b border-[#EFECE6] pb-6">
        <div>
          <span className="text-[10px] font-heading font-extrabold uppercase tracking-widest text-[#9E6544]">
            Quality QC &bull; Client Resolutions
          </span>
          <h1 className="font-heading text-2xl md:text-3xl font-black uppercase tracking-wider text-[#1A1816] mt-1">
            Returns &amp; Exchanges Moderation
          </h1>
          <p className="text-xs text-[#78716C] font-body mt-0.5">
            Review 7-day client garment return requests, verify fit &amp; stitching issues, and approve replacements or store credit.
          </p>
        </div>
        <div className="text-xs font-heading uppercase tracking-wider text-[#78716C]">
          Queue Total: <strong className="text-[#1A1816]">{total}</strong> Requests
        </div>
      </div>

      {/* Tabs & Search Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex flex-wrap gap-2">
          {RETURN_STATUS_TABS.map((tab) => {
            const isActive = statusFilter === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                className={`text-xs font-heading uppercase tracking-wider px-4 py-2 rounded-full border transition-all ${
                  isActive
                    ? "bg-[#1A1816] text-[#FAF8F5] font-bold border-[#1A1816] shadow-sm"
                    : "bg-white text-[#78716C] border-[#EFECE6] hover:border-[#D5C0A5] hover:text-[#1A1816]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="w-full md:w-80">
          <input
            type="text"
            placeholder="Search order #, customer, garment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-[#EFECE6] rounded-xl px-4 py-2.5 text-xs text-[#1A1816] placeholder-[#A8A29E] focus:outline-none focus:border-[#9E6544] focus:ring-1 focus:ring-[#9E6544]/30 shadow-sm"
          />
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="py-24 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#9E6544] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-heading tracking-widest uppercase text-[#78716C]">
            Loading return requests...
          </p>
        </div>
      ) : error ? (
        <div className="p-6 bg-rose-50 border border-rose-200 text-rose-700 text-xs text-center font-heading uppercase rounded-xl">
          {error}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center bg-white border border-[#EFECE6] rounded-2xl p-8 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#EFECE6] flex items-center justify-center mx-auto text-[#78716C] font-heading font-bold text-xs">
            QC
          </div>
          <p className="text-xs font-heading font-bold uppercase tracking-wider text-[#78716C]">
            No return or exchange requests found in this view
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((r) => (
            <div
              key={r.id}
              className="bg-white border border-[#EFECE6] rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 shadow-sm hover:border-[#D5C0A5] transition-colors"
            >
              <div className="space-y-4 flex-1">
                {/* Header row: Order Number, item, status */}
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href={`/admin/orders/${encodeURIComponent(r.order_number || "")}`}
                    className="font-mono font-bold text-sm text-[#1A1816] hover:underline"
                  >
                    ORDER #{r.order_number || r.order_id.slice(0, 8)}
                  </Link>
                  <span
                    className={`text-[10px] font-heading font-bold uppercase tracking-wider px-3 py-0.5 rounded-full border ${getStatusBadge(
                      r.status
                    )}`}
                  >
                    {r.status}
                  </span>
                  <span className="text-[11px] text-[#78716C] font-body">
                    Requested on {new Date(r.requested_at).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                  </span>
                </div>

                {/* Garment Details */}
                <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#EFECE6] text-xs font-body space-y-1">
                  <div className="text-[#1A1816] font-heading font-bold uppercase tracking-wide">
                    {r.product_name || "Garment"} {r.variant_label ? `— ${r.variant_label}` : ""}
                  </div>
                  <div className="text-[#78716C] text-[11px] font-mono">
                    Quantity: {r.quantity || 1} &bull; Unit Price: ₹{(r.unit_price || 0).toLocaleString("en-IN")}
                  </div>
                </div>

                {/* Reason & Resolution */}
                <div>
                  <span className="text-[10px] font-heading font-extrabold uppercase tracking-wider text-[#9E6544] block">
                    Client Reason &amp; Preference:
                  </span>
                  <p className="text-xs font-body text-[#1A1816] leading-relaxed mt-0.5 bg-[#FAF8F5]/80 p-3 rounded-lg border border-[#EFECE6] italic">
                    &ldquo;{r.reason}&rdquo;
                  </p>
                </div>

                {/* Admin Notes if present */}
                {r.admin_notes && (
                  <div className="text-[11px] text-[#78716C] bg-white p-3 rounded-lg border border-[#D5C0A5]/60 space-y-0.5">
                    <span className="text-[#9E6544] font-heading font-bold uppercase text-[10px] block">
                      Inspection &amp; QC Notes:
                    </span>
                    <p className="text-[#1A1816]">{r.admin_notes}</p>
                    {r.resolved_at && (
                      <p className="text-[10px] text-[#78716C] pt-1">
                        Resolved {new Date(r.resolved_at).toLocaleDateString("en-IN")}
                      </p>
                    )}
                  </div>
                )}

                {/* Metadata */}
                <div className="text-[11px] text-[#78716C]">
                  Purchaser Email: <strong className="text-[#1A1816] font-mono">{r.user_email || r.user_id.slice(0, 8)}</strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap lg:flex-col gap-2 shrink-0 pt-2 lg:pt-0">
                {r.status === "requested" && (
                  <>
                    <button
                      type="button"
                      disabled={actionLoading === r.id}
                      onClick={() => openActionModal(r, "approved")}
                      className="px-5 py-2.5 bg-[#D5C0A5] hover:bg-[#C4AC8F] text-[#1A1816] text-[11px] font-heading font-black uppercase tracking-wider rounded-full shadow-sm transition-colors disabled:opacity-50"
                    >
                      Approve &amp; Pickup
                    </button>
                    <button
                      type="button"
                      disabled={actionLoading === r.id}
                      onClick={() => openActionModal(r, "rejected")}
                      className="px-5 py-2.5 bg-white hover:bg-rose-50 border border-rose-300 text-rose-700 text-[11px] font-heading font-bold uppercase tracking-wider rounded-full transition-colors disabled:opacity-50"
                    >
                      Reject Request
                    </button>
                  </>
                )}

                {r.status === "approved" && (
                  <button
                    type="button"
                    disabled={actionLoading === r.id}
                    onClick={() => openActionModal(r, "refunded")}
                    className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-heading font-bold uppercase tracking-wider rounded-full shadow-sm transition-colors disabled:opacity-50"
                  >
                    Complete Resolution
                  </button>
                )}

                <Link
                  href={`/admin/orders/${encodeURIComponent(r.order_number || "")}`}
                  className="px-4 py-2 bg-[#FAF8F5] hover:bg-[#EFECE6] border border-[#EFECE6] text-[#1A1816] text-[11px] font-heading font-bold uppercase tracking-wider rounded-full transition-colors text-center"
                >
                  Order Details &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action Notes Modal */}
      {selectedReturn && targetStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-[#EFECE6] rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#EFECE6] pb-3">
              <span className="font-heading font-black text-sm uppercase tracking-wider text-[#1A1816]">
                Confirm Action: {targetStatus.toUpperCase()}
              </span>
              <button
                onClick={() => {
                  setSelectedReturn(null);
                  setTargetStatus(null);
                }}
                className="text-xs text-[#78716C] hover:text-[#1A1816] font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-[#78716C] leading-relaxed">
                Transitioning return request for <strong>{selectedReturn.product_name}</strong> (Order #{selectedReturn.order_number}) to{" "}
                <strong className="uppercase text-[#9E6544]">{targetStatus}</strong>.
              </p>

              <div>
                <label className="block text-[10px] font-heading font-bold uppercase tracking-widest text-[#78716C] mb-1.5">
                  QC &amp; Dispatch Remarks (Visible to Client)
                </label>
                <textarea
                  rows={4}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="e.g. Reverse courier pickup scheduled with BlueDart AWB #RVP9821. Replacement size L prepared for dispatch."
                  className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-xl p-3 text-xs text-[#1A1816] placeholder-[#A8A29E] focus:bg-white focus:border-[#9E6544] focus:outline-none leading-relaxed"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedReturn(null);
                  setTargetStatus(null);
                }}
                className="px-5 py-2.5 bg-white border border-[#EFECE6] text-[#78716C] hover:text-[#1A1816] text-xs font-heading font-bold uppercase tracking-wider rounded-full transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading === selectedReturn.id}
                onClick={submitAction}
                className="px-6 py-2.5 bg-[#D5C0A5] hover:bg-[#C4AC8F] text-[#1A1816] text-xs font-heading font-black uppercase tracking-wider rounded-full shadow-sm transition-colors disabled:opacity-50"
              >
                {actionLoading ? "Processing..." : "Confirm & Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
