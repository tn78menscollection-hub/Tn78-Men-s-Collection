import React from "react";

export default function ProductLoading() {
  return (
    <div className="bg-[#0A0B0E] min-h-screen text-[#F8FAFC] pb-24">
      {/* Breadcrumb skeleton */}
      <div className="border-b border-[#232733] bg-[#13151C] px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center space-x-2">
          <div className="h-3 w-12 bg-neutral-800 rounded-xs animate-pulse" />
          <span className="text-neutral-700">/</span>
          <div className="h-3 w-16 bg-neutral-800 rounded-xs animate-pulse" />
          <span className="text-neutral-700">/</span>
          <div className="h-3 w-28 bg-neutral-800 rounded-xs animate-pulse" />
        </div>
      </div>

      {/* Main PDP Grid skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* Left: Image gallery skeleton */}
          <div className="lg:col-span-7 space-y-4">
            <div className="aspect-4/5 w-full bg-[#13151C] border border-[#232733] rounded-xs animate-pulse" />
            <div className="grid grid-cols-4 gap-3">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="aspect-square bg-[#13151C] border border-[#232733] rounded-xs animate-pulse" />
              ))}
            </div>
          </div>

          {/* Right: Product details skeleton */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <div className="h-3 w-24 bg-neutral-800 rounded-xs animate-pulse" />
              <div className="h-8 w-3/4 bg-neutral-800 rounded-xs animate-pulse" />
              <div className="h-6 w-32 bg-neutral-800 rounded-xs animate-pulse mt-2" />
            </div>

            <div className="border-t border-[#232733] pt-6 space-y-4">
              <div className="h-4 w-28 bg-neutral-800 rounded-xs animate-pulse" />
              <div className="flex gap-2">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-neutral-800 animate-pulse" />
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="h-4 w-20 bg-neutral-800 rounded-xs animate-pulse" />
              <div className="flex gap-2">
                {["S", "M", "L", "XL"].map((s) => (
                  <div key={s} className="w-12 h-10 bg-neutral-800 rounded-xs animate-pulse" />
                ))}
              </div>
            </div>

            <div className="h-14 w-full bg-neutral-800 rounded-full animate-pulse mt-8" />
          </div>
        </div>
      </div>
    </div>
  );
}
