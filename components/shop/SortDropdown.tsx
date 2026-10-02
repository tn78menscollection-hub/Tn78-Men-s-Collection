"use client";

import React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const SORT_OPTIONS = [
  { value: "newest", label: "NEWEST ARRIVALS" },
  { value: "price_asc", label: "PRICE: LOW TO HIGH" },
  { value: "price_desc", label: "PRICE: HIGH TO LOW" },
];

export interface SortDropdownProps {
  value?: string;
  onChange?: (sort: string) => void;
  className?: string;
}

export function SortDropdown({
  value: controlledValue,
  onChange: controlledOnChange,
  className = "",
}: SortDropdownProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = controlledValue !== undefined
    ? controlledValue
    : searchParams.get("sort") || "newest";

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (controlledOnChange) {
      controlledOnChange(e.target.value);
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", e.target.value);
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className={`flex items-center space-x-2.5 ${className}`}>
      <label
        htmlFor="sort-select"
        className="text-[10px] font-heading font-black uppercase tracking-widest text-slate-400"
      >
        SORT:
      </label>
      <div className="relative">
        <select
          id="sort-select"
          value={currentSort}
          onChange={handleSortChange}
          className="appearance-none bg-[#13151C] text-slate-200 border border-[#232733] hover:border-[#E2C58A]/50 px-3.5 py-2 pr-8 text-xs font-heading font-bold uppercase tracking-wider focus:outline-hidden focus:border-[#E2C58A] cursor-pointer rounded-sm shadow-xs transition-colors"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#13151C] text-white">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-[#E2C58A]">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
