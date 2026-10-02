"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AccountTabsProps {
  activeTab?: "orders" | "rewards" | "returns";
}

export default function AccountTabs({ activeTab }: AccountTabsProps) {
  const pathname = usePathname();

  const isOrders = activeTab === "orders" || pathname.startsWith("/account/orders");
  const isRewards = activeTab === "rewards" || pathname.startsWith("/account/rewards");
  const isReturns = activeTab === "returns" || pathname.startsWith("/account/returns");

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#232733] pb-5">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <Link
          href="/account/orders"
          className={`text-[11px] font-heading font-extrabold uppercase tracking-widest px-5 py-2.5 rounded-full transition-all duration-150 ${
            isOrders
              ? "bg-[#E2C58A] text-[#0A0B0E] shadow-[0_0_15px_rgba(226,197,138,0.25)]"
              : "bg-[#13151C] border border-[#232733] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#E2C58A]/50"
          }`}
        >
          Purchased Orders
        </Link>
        <Link
          href="/account/rewards"
          className={`text-[11px] font-heading font-extrabold uppercase tracking-widest px-5 py-2.5 rounded-full transition-all duration-150 ${
            isRewards
              ? "bg-[#E2C58A] text-[#0A0B0E] shadow-[0_0_15px_rgba(226,197,138,0.25)]"
              : "bg-[#13151C] border border-[#232733] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#E2C58A]/50"
          }`}
        >
          Loyalty Rewards
        </Link>
        <Link
          href="/account/returns"
          className={`text-[11px] font-heading font-extrabold uppercase tracking-widest px-5 py-2.5 rounded-full transition-all duration-150 ${
            isReturns
              ? "bg-[#E2C58A] text-[#0A0B0E] shadow-[0_0_15px_rgba(226,197,138,0.25)]"
              : "bg-[#13151C] border border-[#232733] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#E2C58A]/50"
          }`}
        >
          Returns &amp; Exchanges
        </Link>
      </div>

      <Link
        href="/orders/track"
        className="inline-flex items-center space-x-1.5 text-[11px] font-heading font-semibold uppercase tracking-wider text-[#E2C58A] hover:text-[#F8FAFC] transition-colors"
      >
        <span>Track Live Dispatch</span>
        <span>&rarr;</span>
      </Link>
    </div>
  );
}
