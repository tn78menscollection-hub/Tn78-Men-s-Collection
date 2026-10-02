"use client";

import React, { useEffect, useState } from "react";
import {
  checkReviewEligibility,
  getProductReviews,
  getStoredAuthToken,
  ReviewDto,
  ReviewEligibilityDto,
  submitReview,
} from "@/lib/api";

interface ProductReviewsSectionProps {
  productId: string;
  productSlug: string;
}

export function ProductReviewsSection({
  productId,
  productSlug,
}: ProductReviewsSectionProps) {
  const [reviews, setReviews] = useState<ReviewDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [eligibility, setEligibility] = useState<ReviewEligibilityDto | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form state
  const [rating, setRating] = useState<number>(5);
  const [title, setTitle] = useState<string>("");
  const [reviewText, setReviewText] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchReviewsData = async () => {
    try {
      setLoading(true);
      const res = await getProductReviews(productSlug);
      setReviews(res || []);

      const token = getStoredAuthToken();
      if (token && productId) {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(productId);
        if (isUuid) {
          try {
            const elig = await checkReviewEligibility(productId);
            setEligibility(elig);
          } catch {
            setEligibility(null);
          }
        }
      }
    } catch {
      // Graceful fallback: non-persisted mockup or unreviewed products
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviewsData();
  }, [productId, productSlug]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim() || reviewText.trim().length < 5) {
      setErrorMsg("Review text must contain at least 5 characters.");
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg(null);
      await submitReview({
        product_id: productId,
        rating,
        title: title.trim() || undefined,
        review_text: reviewText.trim(),
      });
      setSuccessMsg("Thank you. Your perspective has been submitted for moderation and will appear shortly.");
      setIsFormOpen(false);
      setReviewText("");
      setTitle("");
      setEligibility({ is_eligible: false, product_id: productId, message: "Review already submitted." });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to submit review.";
      setErrorMsg(message);
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  return (
    <div className="mt-16 pt-12 border-t border-[#232733] space-y-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#232733] pb-6">
        <div>
          <span className="text-[10px] font-heading font-black uppercase tracking-widest text-[#E2C58A]">
            AUTHENTIC PATRON PERSPECTIVES
          </span>
          <h2 className="mt-1 font-heading font-black text-xl uppercase tracking-wider text-white">
            CLIENT PERSPECTIVES &amp; REVIEWS
          </h2>
          {averageRating ? (
            <div className="flex items-center space-x-2 mt-1 text-xs">
              <span className="text-[#E2C58A] font-heading font-bold">★ {averageRating} / 5.0</span>
              <span className="text-slate-600">&bull;</span>
              <span className="text-slate-400">{reviews.length} Verified Review{reviews.length !== 1 ? "s" : ""}</span>
            </div>
          ) : (
            <p className="text-xs text-slate-400 mt-1">
              Be among the first patrons to review this garment following delivery.
            </p>
          )}
        </div>

        {/* Action / Eligibility prompt */}
        {eligibility?.is_eligible ? (
          <button
            type="button"
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="px-6 py-2.5 bg-gradient-to-r from-[#E2C58A] to-[#C6A467] text-[#0A0B0E] font-heading text-xs font-black uppercase tracking-widest rounded-full transition-all shadow-glow-gold self-start sm:self-auto cursor-pointer btn-shimmer"
          >
            {isFormOpen ? "CANCEL REVIEW" : "WRITE A PERSPECTIVE"}
          </button>
        ) : eligibility && !eligibility.is_eligible ? (
          <span className="text-[11px] font-mono text-slate-500 self-start sm:self-auto">
            {eligibility.message || "Verified purchasers may submit a review after delivery."}
          </span>
        ) : null}
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-heading font-medium tracking-wide rounded-xs">
          {successMsg}
        </div>
      )}

      {/* Review Submission Form */}
      {isFormOpen && (
        <form onSubmit={handleSubmitReview} className="p-6 bg-[#13151C] border border-[#232733] rounded-sm space-y-4 shadow-card-dark">
          <h3 className="font-heading font-black text-sm uppercase tracking-wider text-white">
            SHARE YOUR SARTORIAL EXPERIENCE
          </h3>

          {errorMsg && (
            <div className="p-3 bg-red-950/40 border border-red-500/40 text-red-300 text-xs">
              {errorMsg}
            </div>
          )}

          {/* Rating Selection */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-heading font-bold uppercase tracking-widest text-slate-400">
              RATING *
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`px-3 py-1 text-xs font-bold font-mono border rounded-xs transition-colors cursor-pointer ${
                    rating >= star
                      ? "bg-[#1C202B] text-[#E2C58A] border-[#E2C58A]"
                      : "bg-[#0A0B0E] text-slate-500 border-[#232733]"
                  }`}
                >
                  ★ {star}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-heading font-bold uppercase tracking-widest text-slate-400 mb-1">
              HEADLINE / TITLE (OPTIONAL)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Exceptional drape and architectural cut"
              className="w-full bg-[#0A0B0E] border border-[#232733] px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-[#E2C58A] focus:outline-hidden rounded-xs"
            />
          </div>

          <div>
            <label className="block text-[10px] font-heading font-bold uppercase tracking-widest text-slate-400 mb-1">
              YOUR PERSPECTIVE *
            </label>
            <textarea
              rows={4}
              required
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Describe the textile quality, fit accuracy, and silhouette presence..."
              className="w-full bg-[#0A0B0E] border border-[#232733] px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-[#E2C58A] focus:outline-hidden rounded-xs leading-relaxed font-body"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="px-7 py-3 bg-gradient-to-r from-[#E2C58A] to-[#C6A467] text-[#0A0B0E] font-heading text-xs font-black uppercase tracking-widest rounded-full transition-all shadow-glow-gold disabled:opacity-50 btn-shimmer cursor-pointer"
          >
            {submitting ? "TRANSMITTING..." : "SUBMIT REVIEW"}
          </button>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-12 text-center text-xs font-heading uppercase tracking-widest text-slate-400 animate-pulse">
            RETRIEVING CLIENT PERSPECTIVES...
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-8 text-center bg-[#13151C] border border-[#232733] rounded-sm space-y-2 shadow-card-dark">
            <p className="text-xs font-heading font-black uppercase tracking-wider text-white">
              NO PERSPECTIVES REGISTERED YET
            </p>
            <p className="text-xs text-slate-400 font-body max-w-md mx-auto">
              Every garment in our collection is crafted for longevity. Verified purchasers are invited to submit their feedback following receipt of their piece.
            </p>
          </div>
        ) : (
          reviews.map((rev) => (
            <div key={rev.id} className="p-6 bg-[#13151C] border border-[#232733] rounded-sm space-y-3 shadow-card-dark">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#232733] pb-3">
                <div className="flex items-center space-x-3">
                  <div className="flex text-[#E2C58A] text-xs font-mono font-bold">
                    {"★".repeat(rev.rating)}
                    {"☆".repeat(5 - rev.rating)}
                  </div>
                  {rev.is_verified_purchase && (
                    <span className="text-[9px] font-heading font-bold uppercase tracking-widest px-2 py-0.5 bg-[#1C202B] text-emerald-400 border border-emerald-500/30 rounded-xs">
                      VERIFIED PURCHASER
                    </span>
                  )}
                </div>
                <div className="text-[11px] font-mono text-slate-400">
                  <span>{rev.user_name || "Client"}</span> &bull;{" "}
                  <span>{new Date(rev.created_at).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</span>
                </div>
              </div>

              {rev.title && (
                <h4 className="font-heading font-bold text-xs uppercase tracking-wide text-white">
                  {rev.title}
                </h4>
              )}

              <p className="text-xs font-body text-slate-300 leading-relaxed">
                {rev.review_text}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
