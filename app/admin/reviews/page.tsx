"use client";

import React, { useEffect, useState } from "react";
import { adminGetReviews, adminModerateReview, ReviewDto } from "@/lib/api";

const REVIEW_STATUS_TABS = [
  { label: "ALL REVIEWS", value: "all" },
  { label: "PENDING MODERATION", value: "pending" },
  { label: "APPROVED", value: "approved" },
  { label: "REJECTED", value: "rejected" },
];

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewDto[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [statusFilter, setStatusFilter] = useState<string>("pending");
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async (status: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminGetReviews({
        status: status === "all" ? undefined : status,
        page: 1,
        page_size: 100,
      });
      setReviews(res.items);
      setTotal(res.total);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load reviews.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(statusFilter);
  }, [statusFilter]);

  const handleModerate = async (reviewId: string, newStatus: "approved" | "rejected") => {
    try {
      setActionLoading(reviewId);
      const updated = await adminModerateReview(reviewId, newStatus);
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, status: updated.status } : r))
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : `Failed to ${newStatus} review.`;
      alert(message);
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = reviews.filter((r) => {
    const q = search.toLowerCase();
    return (
      (r.title && r.title.toLowerCase().includes(q)) ||
      r.review_text.toLowerCase().includes(q) ||
      (r.user_name && r.user_name.toLowerCase().includes(q)) ||
      r.product_id.toLowerCase().includes(q)
    );
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return "text-emerald-800 border-emerald-200 bg-emerald-50";
      case "pending":
        return "text-amber-800 border-amber-200 bg-amber-50";
      case "rejected":
        return "text-rose-700 border-rose-200 bg-rose-50";
      default:
        return "text-[#78716C] border-[#EFECE6] bg-[#FAF8F5]";
    }
  };

  return (
    <div className="p-6 sm:p-8 lg:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4 border-b border-[#EFECE6] pb-6">
        <div>
          <span className="text-[10px] font-heading font-extrabold uppercase tracking-widest text-[#9E6544]">
            Client Curation &bull; Social Proof
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl font-black uppercase tracking-wider text-[#1A1816] mt-1">
            Client Reviews Moderation
          </h1>
          <p className="text-xs text-[#78716C] font-body mt-0.5">
            Audit and approve customer feedback and testimonials before displaying on public product pages.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono text-[#78716C] self-start sm:self-auto">
          <span>
            Total in Queue: <strong className="text-[#1A1816] font-bold">{total}</strong>
          </span>
        </div>
      </div>

      {/* Tabs & Search Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex flex-wrap gap-2">
          {REVIEW_STATUS_TABS.map((tab) => {
            const isActive = statusFilter === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                className={`text-xs font-heading uppercase tracking-wider px-4 py-2 rounded-full transition-all border ${
                  isActive
                    ? "bg-[#1A1816] text-[#FAF8F5] border-[#1A1816] font-bold shadow-sm"
                    : "bg-white text-[#78716C] border-[#EFECE6] hover:border-[#1A1816]/30 hover:text-[#1A1816]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search reviews, authors, products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-[#EFECE6] rounded-xl px-4 py-2.5 text-xs text-[#1A1816] placeholder-[#A8A29E] focus:outline-none focus:border-[#9E6544] focus:ring-1 focus:ring-[#9E6544]/30 shadow-sm"
          />
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="py-20 text-center text-[#78716C] font-mono text-xs uppercase tracking-widest">
          Loading client testimonials...
        </div>
      ) : error ? (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
          {error}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center bg-white border border-[#EFECE6] rounded-2xl p-8">
          <p className="text-xs font-heading font-bold uppercase tracking-wider text-[#78716C]">
            No reviews found in this moderation queue
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((r) => (
            <div
              key={r.id}
              className="bg-white border border-[#EFECE6] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-start md:justify-between gap-6 hover:shadow-sm transition-all"
            >
              <div className="space-y-3 flex-1">
                {/* Header row: stars, title, status */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex text-[#9E6544] text-sm tracking-widest">
                    {"★".repeat(r.rating)}
                    <span className="text-[#D5C0A5]">{"★".repeat(5 - r.rating)}</span>
                  </div>
                  {r.title && (
                    <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-[#1A1816]">
                      {r.title}
                    </h3>
                  )}
                  <span
                    className={`text-[10px] font-heading font-bold uppercase tracking-wider px-2.5 py-0.5 border rounded-full ${getStatusBadge(
                      r.status
                    )}`}
                  >
                    {r.status}
                  </span>
                  {r.is_verified_purchase && (
                    <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-[#9E6544] bg-[#FAF8F5] border border-[#EFECE6] px-2.5 py-0.5 rounded-full">
                      ✓ Verified Purchaser
                    </span>
                  )}
                </div>

                {/* Review body */}
                <p className="text-xs font-body text-[#1A1816]/90 leading-relaxed italic bg-[#FAF8F5] p-3.5 rounded-xl border border-[#EFECE6]">
                  &ldquo;{r.review_text}&rdquo;
                </p>

                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-mono text-[#78716C]">
                  <span>
                    Client: <strong className="text-[#1A1816]">{r.user_name || r.user_id.slice(0, 8)}</strong>
                  </span>
                  <span>&bull;</span>
                  <span>Product: {r.product_id.slice(0, 8)}...</span>
                  <span>&bull;</span>
                  <span>Submitted: {new Date(r.created_at).toLocaleDateString("en-IN", { dateStyle: "medium" })}</span>
                </div>
              </div>

              {/* Moderation Actions */}
              <div className="flex items-center md:flex-col gap-2 shrink-0">
                {r.status !== "approved" && (
                  <button
                    type="button"
                    disabled={actionLoading === r.id}
                    onClick={() => handleModerate(r.id, "approved")}
                    className="w-full px-5 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-heading font-bold uppercase tracking-wider rounded-full transition-colors disabled:opacity-50"
                  >
                    {actionLoading === r.id ? "Saving..." : "✓ Approve"}
                  </button>
                )}
                {r.status !== "rejected" && (
                  <button
                    type="button"
                    disabled={actionLoading === r.id}
                    onClick={() => handleModerate(r.id, "rejected")}
                    className="w-full px-5 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-heading font-bold uppercase tracking-wider rounded-full transition-colors disabled:opacity-50"
                  >
                    {actionLoading === r.id ? "Saving..." : "✕ Reject"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
