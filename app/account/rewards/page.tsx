"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getRewardsBalance, getStoredAuthToken, RewardsBalanceDto } from "@/lib/api";
import AccountTabs from "@/components/account/AccountTabs";

export default function AccountRewardsPage() {
  const [data, setData] = useState<RewardsBalanceDto | null>(null);
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

    const loadRewards = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getRewardsBalance();
        setData(res);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unable to load rewards balance.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadRewards();
  }, []);

  if (!isAuthed && !loading) {
    return (
      <div className="min-h-screen bg-[#0A0B0E] text-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-[#13151C] border border-[#232733] p-8 rounded-2xl shadow-xl space-y-4">
          <span className="text-[10px] font-heading font-extrabold uppercase tracking-widest text-[#E2C58A] bg-[#E2C58A]/10 border border-[#E2C58A]/30 px-3 py-1 rounded-full inline-block">
            VIP Privilege
          </span>
          <h1 className="font-heading text-xl font-bold uppercase tracking-wider text-[#F8FAFC]">
            Loyalty Rewards Access
          </h1>
          <p className="text-xs text-[#94A3B8] font-body leading-relaxed">
            Sign in to view your accumulated points balance, accrual history, and checkout redemption privileges.
          </p>
          <div className="pt-2 space-y-2">
            <Link
              href="/shop"
              className="inline-block w-full bg-gradient-to-r from-[#E2C58A] to-[#C6A467] text-[#0A0B0E] font-heading text-xs font-black uppercase tracking-widest py-3 rounded-full shadow-[0_0_15px_rgba(226,197,138,0.25)] hover:brightness-110 transition-all text-center"
            >
              Explore Collection &amp; Join
            </Link>
            <Link
              href="/"
              className="inline-block w-full bg-[#0A0B0E] border border-[#232733] hover:border-[#E2C58A] text-[#F8FAFC] font-heading text-xs font-bold uppercase tracking-widest py-3 rounded-full transition-colors text-center"
            >
              Storefront Home
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
          <span className="text-[#E2C58A]">Loyalty Rewards</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12 space-y-8">
        {/* Navigation Tabs */}
        <AccountTabs activeTab="rewards" />

        {/* Hero Card */}
        <div className="bg-gradient-to-br from-[#13151C] via-[#191D28] to-[#13151C] border border-[#E2C58A]/30 p-6 sm:p-10 rounded-2xl relative overflow-hidden shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <span className="text-[10px] font-heading font-extrabold uppercase tracking-widest text-[#E2C58A] bg-[#E2C58A]/10 border border-[#E2C58A]/30 px-3 py-1 rounded-full inline-block">
                Client Privilege Program
              </span>
              <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-wider text-[#E2C58A]">
                {loading ? "..." : `${data?.points_balance.toLocaleString("en-IN") || 0} POINTS`}
              </h1>
              <p className="text-xs sm:text-sm text-[#94A3B8] font-body">
                Equivalent Purchasing Value:{" "}
                <strong className="text-emerald-400 font-heading font-black">
                  ₹{data?.equivalent_value_inr.toLocaleString("en-IN") || "0.00"}
                </strong>{" "}
                redeemable directly at checkout.
              </p>
            </div>

            <div className="border-t md:border-t-0 md:border-l border-[#232733] pt-4 md:pt-0 md:pl-8 space-y-2.5 text-xs text-[#94A3B8]">
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E2C58A]" />
                <span>Earn 1 Point per ₹100 spent across all garments</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E2C58A]" />
                <span>1 Point = ₹1.00 instant checkout deduction</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E2C58A]" />
                <span>Points credited upon courier delivery confirmation</span>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-950/60 border border-red-500/40 text-red-300 text-xs rounded-xl">
            {error}
          </div>
        )}

        {/* Transaction History */}
        <div className="bg-[#13151C] border border-[#232733] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#232733] pb-4">
            <div>
              <h2 className="font-heading text-base sm:text-lg font-black uppercase tracking-wider text-[#F8FAFC]">
                Points Ledger &amp; History
              </h2>
              <p className="text-xs text-[#94A3B8] mt-0.5 font-body">
                Detailed record of privilege points accruals and checkout redemptions.
              </p>
            </div>
            <span className="text-[11px] font-heading font-bold text-[#E2C58A] uppercase tracking-wider">
              {data?.recent_transactions.length || 0} Entries
            </span>
          </div>

          {loading ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-8 h-8 border-2 border-[#E2C58A] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-heading font-bold uppercase tracking-widest text-[#94A3B8]">
                Loading points history...
              </p>
            </div>
          ) : !data || data.recent_transactions.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#0A0B0E] border border-[#232733] flex items-center justify-center mx-auto text-[#E2C58A] font-heading font-bold text-xs">
                ★
              </div>
              <p className="text-xs font-heading uppercase tracking-wider text-[#94A3B8]">
                No points transactions recorded yet. Completed orders will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0A0B0E] border-b border-[#232733] font-heading uppercase tracking-wider text-[10px] text-[#94A3B8]">
                  <tr>
                    <th className="p-3.5">Date</th>
                    <th className="p-3.5">Description</th>
                    <th className="p-3.5 text-right">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#232733]">
                  {data.recent_transactions.map((tx) => {
                    const isEarned = tx.points_change > 0;
                    return (
                      <tr key={tx.id} className="hover:bg-[#161922] transition-colors">
                        <td className="p-3.5 whitespace-nowrap text-[#94A3B8]">
                          {new Date(tx.created_at).toLocaleDateString("en-IN", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>
                        <td className="p-3.5 font-medium text-[#F8FAFC]">
                          {tx.reason === "order_delivered"
                            ? "Order Delivery Points Awarded"
                            : tx.reason === "checkout_redemption"
                            ? "Redeemed at Checkout"
                            : tx.reason}
                        </td>
                        <td
                          className={`p-3.5 text-right font-heading font-black whitespace-nowrap ${
                            isEarned ? "text-emerald-400" : "text-[#E2C58A]"
                          }`}
                        >
                          {isEarned ? `+${tx.points_change}` : tx.points_change}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div className="text-center pt-2">
          <Link
            href="/shop"
            className="inline-block px-8 py-3.5 bg-gradient-to-r from-[#E2C58A] to-[#C6A467] text-[#0A0B0E] text-xs font-heading font-black uppercase tracking-widest rounded-full shadow-[0_0_20px_rgba(226,197,138,0.25)] hover:brightness-110 transition-all"
          >
            Explore The Collection &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
