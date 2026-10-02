"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getStoredAuthToken, getUserReturns, ReturnRequestDto } from "@/lib/api";
import AccountTabs from "@/components/account/AccountTabs";

export default function AccountReturnsPage() {
  const [returns, setReturns] = useState<ReturnRequestDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    const token = getStoredAuthToken();
    if (!token) {
      setIsAuthed(false);
      setLoading(false);
      return;
    }
    setIsAuthed(true);

    const loadReturns = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getUserReturns();
        setReturns(res);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to load returns history.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadReturns();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "requested":
        return "text-amber-400 bg-amber-950/70 border-amber-500/40";
      case "approved":
        return "text-blue-400 bg-blue-950/70 border-blue-500/40";
      case "refunded":
      case "replaced":
        return "text-emerald-400 bg-emerald-950/70 border-emerald-500/40";
      case "rejected":
        return "text-rose-400 bg-rose-950/70 border-rose-500/40";
      default:
        return "text-[#94A3B8] bg-[#13151C] border-[#232733]";
    }
  };

  if (!isAuthed && !loading) {
    return (
      <div className="min-h-screen bg-[#0A0B0E] text-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-[#13151C] border border-[#232733] p-8 rounded-2xl shadow-xl space-y-4">
          <span className="text-[10px] font-heading font-extrabold uppercase tracking-widest text-[#E2C58A] bg-[#E2C58A]/10 border border-[#E2C58A]/30 px-3 py-1 rounded-full inline-block">
            Exchanges &amp; Returns
          </span>
          <h1 className="font-heading text-xl font-bold uppercase tracking-wider text-[#F8FAFC]">
            Sign In or Track Order
          </h1>
          <p className="text-xs text-[#94A3B8] font-body leading-relaxed">
            Please sign in to view your return history, or use our guest order tracking tool to request a return on any recent purchase.
          </p>
          <div className="pt-2 space-y-2">
            <Link
              href="/orders/track"
              className="inline-block w-full bg-gradient-to-r from-[#E2C58A] to-[#C6A467] text-[#0A0B0E] font-heading text-xs font-black uppercase tracking-widest py-3 rounded-full shadow-[0_0_15px_rgba(226,197,138,0.25)] hover:brightness-110 transition-all text-center"
            >
              Track Guest Order &amp; Return &rarr;
            </Link>
            <Link
              href="/"
              className="inline-block w-full bg-[#0A0B0E] border border-[#232733] hover:border-[#E2C58A] text-[#F8FAFC] font-heading text-xs font-bold uppercase tracking-widest py-3 rounded-full transition-colors text-center"
            >
              Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0B0E] text-[#F8FAFC] pb-28">
      {/* Header Breadcrumbs */}
      <div className="border-b border-[#232733] px-4 sm:px-6 lg:px-8 py-3.5 bg-[#13151C]/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center space-x-2 text-[10px] font-heading font-bold uppercase tracking-widest text-[#94A3B8]">
          <Link href="/" className="hover:text-[#F8FAFC] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#94A3B8]">Client Account</span>
          <span>/</span>
          <span className="text-[#E2C58A]">Returns &amp; Exchanges</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12 space-y-8">
        {/* Navigation Tabs */}
        <AccountTabs activeTab="returns" />

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between border-b border-[#232733] pb-4 gap-4">
          <div>
            <span className="text-[10px] font-heading font-extrabold uppercase tracking-widest text-[#E2C58A]">
              7-Day Quality Guarantee
            </span>
            <h1 className="font-heading text-2xl sm:text-3xl font-black uppercase tracking-wider text-[#F8FAFC] mt-1">
              Returns &amp; Exchange History
            </h1>
            <p className="text-xs text-[#94A3B8] font-body mt-0.5">
              Track inspection status and exchange resolutions for your TN78 garments.
            </p>
          </div>
          <Link
            href="/orders/track"
            className="border border-[#232733] hover:border-[#E2C58A] bg-[#0A0B0E] text-[#F8FAFC] hover:text-[#E2C58A] text-[11px] font-heading font-bold uppercase tracking-wider px-5 py-2.5 rounded-full transition-all self-start sm:self-auto"
          >
            Initiate Return via Order Track &rarr;
          </Link>
        </div>

        {error && (
          <div className="p-4 bg-red-950/60 border border-red-500/40 text-red-300 text-xs rounded-xl">
            {error}
          </div>
        )}

        {/* Returns List */}
        <div className="bg-[#13151C] border border-[#232733] rounded-2xl shadow-xl overflow-hidden">
          {loading ? (
            <div className="p-16 text-center space-y-3">
              <div className="w-8 h-8 border-2 border-[#E2C58A] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-heading font-bold uppercase tracking-widest text-[#94A3B8]">
                Loading return records...
              </p>
            </div>
          ) : returns.length === 0 ? (
            <div className="p-16 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#0A0B0E] border border-[#232733] flex items-center justify-center mx-auto text-[#E2C58A] font-heading font-black text-sm">
                QC
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-heading font-black uppercase tracking-wider text-[#F8FAFC]">
                  No Return or Exchange Requests On File
                </h3>
                <p className="text-xs text-[#94A3B8] font-body max-w-md mx-auto leading-relaxed">
                  All garments delivered within the last 7 calendar days are eligible for size exchange or return from your order tracking screen.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/orders/track"
                  className="inline-block px-6 py-2.5 bg-gradient-to-r from-[#E2C58A] to-[#C6A467] text-[#0A0B0E] font-heading text-xs font-black uppercase tracking-wider rounded-full shadow-[0_0_15px_rgba(226,197,138,0.25)] hover:brightness-110 transition-all"
                >
                  Locate Delivered Order &rarr;
                </Link>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-[#232733]">
              {returns.map((ret) => (
                <div key={ret.id} className="p-6 sm:p-8 space-y-4 hover:bg-[#161922] transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#232733] pb-3">
                    <div className="flex items-center space-x-3">
                      <span
                        className={`inline-block px-3 py-0.5 text-[10px] font-heading font-bold uppercase tracking-wider rounded-full border ${getStatusBadge(
                          ret.status
                        )}`}
                      >
                        {ret.status}
                      </span>
                      <span className="text-xs font-mono text-[#F8FAFC] font-bold">
                        {ret.order_number}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#94A3B8] font-body">
                      Requested on {new Date(ret.requested_at).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="font-heading font-bold text-[#F8FAFC] text-sm uppercase tracking-wide">
                        {ret.product_name}
                      </p>
                      <p className="text-[#94A3B8] mt-0.5 font-mono text-[11px]">
                        Variant: {ret.variant_label} &bull; Qty: {ret.quantity}
                      </p>
                      <div className="mt-3 p-3 bg-[#0A0B0E] border border-[#232733] rounded-xl text-[#F8FAFC] italic font-body">
                        &ldquo;{ret.reason}&rdquo;
                      </div>
                    </div>

                    {ret.admin_notes ? (
                      <div className="bg-[#0A0B0E] p-4 rounded-xl border border-[#E2C58A]/30 space-y-1">
                        <span className="block text-[10px] font-heading font-bold uppercase tracking-wider text-[#E2C58A]">
                          Quality Inspection &amp; Resolution Update
                        </span>
                        <p className="text-[#F8FAFC] leading-relaxed font-body">
                          {ret.admin_notes}
                        </p>
                        {ret.resolved_at && (
                          <p className="text-[10px] text-[#94A3B8] pt-1">
                            Updated {new Date(ret.resolved_at).toLocaleDateString("en-IN")}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="bg-[#0A0B0E] p-4 rounded-xl border border-[#232733] flex items-center text-[#94A3B8] text-[11px] font-body">
                        Our Tirupur quality team is inspecting your return request. A reverse courier pickup will be scheduled upon review.
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
