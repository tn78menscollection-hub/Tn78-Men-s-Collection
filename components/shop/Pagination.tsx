"use client";

import React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange?: (newPage: number) => void;
  className?: string;
}

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  className = "",
}: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const totalPages = Math.ceil(total / pageSize) || 1;

  if (totalPages <= 1) {
    return null;
  }

  const navigateToPage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === page) return;
    if (onPageChange) {
      onPageChange(newPage);
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  // Generate page numbers to show
  const pageNumbers: (number | string)[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= page - 1 && i <= page + 1)
    ) {
      pageNumbers.push(i);
    } else if (
      (i === page - 2 && page - 2 > 1) ||
      (i === page + 2 && page + 2 < totalPages)
    ) {
      pageNumbers.push("...");
    }
  }

  // Remove consecutive ellipses
  const deduplicatedPages = pageNumbers.filter(
    (item, index) => item !== "..." || pageNumbers[index - 1] !== "..."
  );

  return (
    <nav
      aria-label="Pagination"
      className={`flex items-center justify-center space-x-2 my-12 ${className}`}
    >
      {/* Previous Page Button */}
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => navigateToPage(page - 1)}
        className="px-4 py-2 bg-[#13151C] border border-[#232733] text-xs font-heading font-black uppercase tracking-wider text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#E2C58A] hover:text-[#E2C58A] transition-all rounded-full shadow-xs cursor-pointer"
        aria-label="Previous page"
      >
        &larr; PREV
      </button>

      {/* Page Numbers */}
      <div className="flex items-center space-x-1.5">
        {deduplicatedPages.map((p, idx) => {
          if (p === "...") {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="px-2 py-1 text-xs text-slate-500 font-mono"
              >
                ...
              </span>
            );
          }

          const isCurrent = p === page;
          return (
            <button
              key={`page-${p}`}
              type="button"
              onClick={() => navigateToPage(Number(p))}
              className={`w-9 h-9 flex items-center justify-center text-xs font-heading font-black transition-all rounded-full cursor-pointer ${
                isCurrent
                  ? "bg-gradient-to-r from-[#E2C58A] to-[#C6A467] text-[#0A0B0E] shadow-glow-gold scale-105"
                  : "bg-[#13151C] border border-[#232733] text-slate-300 hover:border-[#E2C58A] hover:text-white"
              }`}
            >
              {p}
            </button>
          );
        })}
      </div>

      {/* Next Page Button */}
      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => navigateToPage(page + 1)}
        className="px-4 py-2 bg-[#13151C] border border-[#232733] text-xs font-heading font-black uppercase tracking-wider text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#E2C58A] hover:text-[#E2C58A] transition-all rounded-full shadow-xs cursor-pointer"
        aria-label="Next page"
      >
        NEXT &rarr;
      </button>
    </nav>
  );
}
