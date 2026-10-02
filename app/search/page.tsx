import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { searchProducts, ProductListItemDto } from "@/lib/api";
import { NEW_ARRIVALS } from "@/lib/mockHomepageData";
import { ProductCard } from "@/components/ui/ProductCard";
import { Pagination } from "@/components/shop/Pagination";

export const metadata: Metadata = {
  title: "Search Menswear Archive — TN78 Men's Collection",
  description:
    "Search tailored menswear, structured linen overshirts, relaxed pleated trousers, and foundational staples.",
};

interface SearchPageProps {
  searchParams: {
    q?: string;
    page?: string;
  };
}

const POPULAR_SEARCHES = [
  "Linen",
  "Overshirt",
  "Trouser",
  "Poplin",
  "Polo",
  "Co-Ord",
  "Shorts",
];

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q?.trim() || "";
  const page = parseInt(searchParams.page || "1", 10) || 1;
  const pageSize = 12;

  let products: ProductListItemDto[] = [];
  let total = 0;

  if (query) {
    try {
      const searchRes = await searchProducts(
        query,
        { page, page_size: pageSize },
        { cache: "no-store" }
      );
      products = searchRes.items;
      total = searchRes.total;
    } catch (error) {
      console.error("Failed to search products:", error);
      // Fallback matching mock items
      const queryLower = query.toLowerCase();
      const matchedMock = NEW_ARRIVALS.filter(
        (p) =>
          p.name.toLowerCase().includes(queryLower) ||
          p.category.toLowerCase().includes(queryLower)
      );
      products = matchedMock.map((m) => ({
        id: String(m.id),
        name: m.name,
        slug: m.slug || "classic-cotton-shirt",
        category_slug: m.category.toLowerCase(),
        category_name: m.category,
        base_price: m.price,
        is_active: true,
        created_at: new Date().toISOString(),
        images: [],
      }));
      total = products.length;
    }
  }

  return (
    <div className="bg-[#0A0B0E] min-h-screen text-[#F8FAFC] pb-28">
      {/* Search Header Banner & Input */}
      <div className="border-b border-[#232733] bg-[#13151C]/80 backdrop-blur-md py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-heading font-extrabold uppercase tracking-[0.2em] text-[#E2C58A]">
            TN78 COLLECTION ARCHIVE
          </span>
          <h1 className="mt-2 font-serif text-3xl sm:text-4xl md:text-5xl text-[#F8FAFC] font-normal tracking-tight">
            Search The Collection
          </h1>
          <p className="mt-2 max-w-xl mx-auto text-xs sm:text-sm font-serif italic text-[#94A3B8]">
            Inquire our menswear archive by silhouette, garment cut, weave, or palette.
          </p>

          {/* Search Input Form */}
          <form
            action="/search"
            method="GET"
            className="mt-8 relative max-w-2xl mx-auto flex flex-col sm:flex-row items-stretch gap-2.5"
          >
            <div className="relative flex-1">
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Search by silhouette, garment, fabric (e.g. Linen, Trouser, Poplin)..."
                required
                className="w-full bg-[#0A0B0E] border border-[#232733] focus:border-[#E2C58A] px-5 py-4 pl-12 text-xs font-body tracking-wide text-[#F8FAFC] placeholder-[#64748B] focus:outline-hidden transition-all rounded-full shadow-lg"
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#94A3B8]">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <button
              type="submit"
              className="px-8 py-4 bg-gradient-to-r from-[#E2C58A] via-[#F3E2B8] to-[#C6A467] hover:brightness-110 text-[#0A0B0E] font-heading font-black text-xs uppercase tracking-widest transition-all duration-200 rounded-full shadow-[0_0_20px_rgba(226,197,138,0.25)] shrink-0 cursor-pointer"
            >
              SEARCH
            </button>
          </form>

          {/* Quick Search Chips */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-[#94A3B8]">
              POPULAR INQUIRIES:
            </span>
            {POPULAR_SEARCHES.map((term) => (
              <Link
                key={term}
                href={`/search?q=${encodeURIComponent(term)}`}
                className="px-3.5 py-1 bg-[#0A0B0E] border border-[#232733] hover:border-[#E2C58A] text-[#94A3B8] hover:text-[#F8FAFC] font-heading text-[11px] uppercase tracking-wider transition-all rounded-full"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Search Results Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        {query ? (
          <div>
            {/* Query Summary */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-[#232733] gap-2">
              <div className="text-xs font-mono text-[#94A3B8]">
                FOUND <span className="text-[#E2C58A] font-bold">{total}</span> GARMENTS FOR &ldquo;
                <span className="text-[#F8FAFC] font-bold">{query}</span>&rdquo;
              </div>
              <Link
                href="/shop"
                className="text-xs font-heading font-semibold uppercase tracking-wider text-[#E2C58A] hover:text-[#F8FAFC] transition-colors"
              >
                VIEW COMPLETE COLLECTION &rarr;
              </Link>
            </div>

            {/* Results Grid or Empty State */}
            {products.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-3.5 md:gap-4.5 items-start">
                  {products.map((item) => (
                    <ProductCard
                      key={item.id}
                      id={item.id}
                      slug={item.slug}
                      name={item.name}
                      price={item.base_price}
                      mrp={item.mrp || undefined}
                      category={item.category_name}
                      imageUrl={item.images?.[0]?.url}
                      sizes={item.sizes}
                    />
                  ))}
                </div>

                <Pagination page={page} pageSize={pageSize} total={total} />
              </>
            ) : (
              <div className="py-20 px-6 text-center border border-dashed border-[#232733] bg-[#13151C] max-w-2xl mx-auto rounded-xl shadow-xl">
                <svg
                  className="w-12 h-12 mx-auto text-[#64748B] mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <h2 className="font-heading font-bold text-sm uppercase tracking-wider text-[#F8FAFC]">
                  NO MATCHES FOR &ldquo;{query}&rdquo;
                </h2>
                <p className="mt-2 text-xs text-[#94A3B8] font-body leading-relaxed max-w-sm mx-auto">
                  We couldn&apos;t find any garments matching your exact search term. Try searching broader terms or browse by category.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Link
                    href="/category/shirts"
                    className="px-5 py-2.5 border border-[#232733] hover:border-[#E2C58A] bg-[#0A0B0E] text-[#F8FAFC] text-xs font-heading font-bold uppercase tracking-wider transition-colors rounded-full"
                  >
                    EXPLORE SHIRTS
                  </Link>
                  <Link
                    href="/category/pants"
                    className="px-5 py-2.5 border border-[#232733] hover:border-[#E2C58A] bg-[#0A0B0E] text-[#F8FAFC] text-xs font-heading font-bold uppercase tracking-wider transition-colors rounded-full"
                  >
                    EXPLORE TROUSERS
                  </Link>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Empty Search Default Showcase */
          <div className="py-8">
            <div className="text-center mb-10">
              <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-[#E2C58A]">
                CURATED RECOMMENDATIONS
              </span>
              <h2 className="mt-1 font-serif text-2xl sm:text-3xl text-[#F8FAFC] font-normal">
                New Arrival Highlights
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-3.5 md:gap-4.5">
              {NEW_ARRIVALS.map((p) => (
                <ProductCard
                  key={p.id}
                  slug={p.slug}
                  name={p.name}
                  price={p.price}
                  category={p.category}
                  isNew={p.isNew}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
