"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { CategoryDto, ProductListItemDto, getProducts } from "@/lib/api";
import { NEW_ARRIVALS, BEST_SELLERS } from "@/lib/mockHomepageData";
import { ProductCard } from "@/components/ui/ProductCard";
import { FilterBar } from "@/components/shop/FilterBar";
import { SortDropdown } from "@/components/shop/SortDropdown";
import { Pagination } from "@/components/shop/Pagination";

export interface ShopCatalogViewProps {
  categories: CategoryDto[];
  initialProducts: ProductListItemDto[];
  initialTotal: number;
  initialCategory?: string;
  initialSize?: string;
  initialColor?: string;
  initialMinPrice?: number;
  initialMaxPrice?: number;
  initialSort?: string;
  initialPage?: number;
  lockedCategory?: string;
  isSpecialCategory?: boolean;
}

const CATEGORY_VARIETIES: Record<string, { id: string; label: string; keywords: string[] }[]> = {
  shirts: [
    { id: "all", label: "All Shirts", keywords: [] },
    { id: "cotton", label: "Pure Cotton", keywords: ["cotton", "combed"] },
    { id: "linen", label: "Linen Shirt", keywords: ["linen", "lenin"] },
    { id: "baggy", label: "Baggy Shirt", keywords: ["baggy"] },
    { id: "party", label: "Party Wear", keywords: ["party"] },
    { id: "stone", label: "Stone Work", keywords: ["stone"] },
    { id: "formal", label: "Executive Formal", keywords: ["formal", "business"] },
    { id: "casual", label: "Casual Shirt", keywords: ["casual", "everyday"] },
    { id: "double-pocket", label: "Double Pocket", keywords: ["double", "pocket"] },
  ],
  pants: [
    { id: "all", label: "All Pants", keywords: [] },
    { id: "jeans", label: "Denim Jeans", keywords: ["denim", "jeans"] },
    { id: "cotton-pant", label: "Cotton Chinos", keywords: ["chinos", "cotton"] },
    { id: "lycra-pant", label: "Lycra Stretch", keywords: ["lycra"] },
    { id: "cargo-pant", label: "Cargo Pant", keywords: ["cargo", "corga", "multi-pocket"] },
    { id: "mom-fit", label: "Mom Fit", keywords: ["mom"] },
    { id: "baggy-pant", label: "Baggy Pant", keywords: ["baggy"] },
    { id: "cotton-jeans", label: "Cotton Jeans", keywords: ["cotton-stretch", "stretch-denim"] },
    { id: "polo-fit", label: "Polo Fit", keywords: ["polo"] },
    { id: "cargo-jeans", label: "Cargo Jeans", keywords: ["cargo-denim", "crogo"] },
  ],
  "t-shirts": [
    { id: "all", label: "All T-Shirts", keywords: [] },
    { id: "round-full", label: "Round Full Sleeve", keywords: ["full-sleeve", "round-neck-full"] },
    { id: "round-half", label: "Round Half Sleeve", keywords: ["half-sleeve", "round-neck-half"] },
    { id: "popcorn", label: "Popcorn Knit", keywords: ["popcorn"] },
    { id: "5-sleeve", label: "5-Sleeve Drop", keywords: ["5-sleeve", "5sleave", "oversized"] },
    { id: "hoodies", label: "Hoodies", keywords: ["hoodie"] },
    { id: "football", label: "Football Jersey", keywords: ["football"] },
    { id: "cricket", label: "Cricket Jersey", keywords: ["cricket"] },
    { id: "collar", label: "Collar Polo", keywords: ["collar", "polo"] },
    { id: "zipper-full", label: "Zipper Full Sleeve", keywords: ["zipper", "full"] },
    { id: "zipper-half", label: "Zipper Half Sleeve", keywords: ["zipper", "half"] },
    { id: "lycra-tshirt", label: "Lycra Active", keywords: ["lycra"] },
  ],
  lowers: [
    { id: "all", label: "All Lowers", keywords: [] },
    { id: "lycra-lower", label: "Lycra Track", keywords: ["lycra"] },
    { id: "popcorn-lower", label: "Popcorn Knit", keywords: ["popcorn"] },
    { id: "cargo-lower", label: "Cargo Utility", keywords: ["cargo", "corga"] },
    { id: "ns-lower", label: "NS Parachute", keywords: ["ns"] },
    { id: "baggy-lower", label: "Baggy Lower", keywords: ["baggy"] },
    { id: "stripes-lower", label: "3-Line Stripes", keywords: ["stripes", "3line", "3-line"] },
  ],
  shorts: [
    { id: "all", label: "All Shorts", keywords: [] },
    { id: "jeans-shorts", label: "Denim Shorts", keywords: ["denim", "jeans"] },
    { id: "ns-shorts", label: "NS Quick-Dry", keywords: ["ns"] },
    { id: "popcorn-shorts", label: "Popcorn Knit", keywords: ["popcorn"] },
    { id: "net-shorts", label: "Net Mesh", keywords: ["net", "mesh"] },
    { id: "cotton-shorts", label: "Cotton Casual", keywords: ["cotton"] },
    { id: "three-fourth", label: "3/4 Length", keywords: ["three-fourth", "3/4"] },
    { id: "cargo-shorts", label: "Cotton Cargo", keywords: ["cargo", "corga"] },
    { id: "2-way", label: "2-Way Lycra", keywords: ["2-way", "two-way"] },
    { id: "4-way", label: "4-Way Lycra", keywords: ["4-way", "four-way"] },
  ],
  all: [
    { id: "all", label: "All Varieties", keywords: [] },
    { id: "cotton", label: "Pure Cotton", keywords: ["cotton"] },
    { id: "linen", label: "Linen", keywords: ["linen", "lenin"] },
    { id: "lycra", label: "4-Way Lycra", keywords: ["lycra"] },
    { id: "popcorn", label: "Popcorn Knit", keywords: ["popcorn"] },
    { id: "cargo", label: "Cargo & Utility", keywords: ["cargo", "corga"] },
    { id: "baggy", label: "Baggy Fit", keywords: ["baggy"] },
    { id: "denim", label: "Denim & Jeans", keywords: ["denim", "jean"] },
    { id: "jerseys", label: "Sport Jerseys", keywords: ["jersey", "football", "cricket"] },
    { id: "hoodies", label: "Hoodies", keywords: ["hoodie"] },
    { id: "zipper", label: "Zipper Polos", keywords: ["zipper"] },
  ],
};

export function ShopCatalogView({
  categories = [],
  initialProducts = [],
  initialTotal = 0,
  initialCategory,
  initialSize,
  initialColor,
  initialMinPrice,
  initialMaxPrice,
  initialSort = "newest",
  initialPage = 1,
  lockedCategory,
  isSpecialCategory = false,
}: ShopCatalogViewProps) {
  const [category, setCategory] = useState<string | undefined>(lockedCategory || initialCategory);
  const [size, setSize] = useState<string | undefined>(initialSize);
  const [color, setColor] = useState<string | undefined>(initialColor);
  const [minPrice, setMinPrice] = useState<number | undefined>(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(initialMaxPrice);
  const [sort, setSort] = useState<string>(initialSort);
  const [page, setPage] = useState<number>(initialPage);

  const [products, setProducts] = useState<ProductListItemDto[]>(initialProducts);
  const [total, setTotal] = useState<number>(initialTotal);
  const [isFiltering, setIsFiltering] = useState<boolean>(false);
  const [selectedTag, setSelectedTag] = useState<string>("all");

  const pageSize = 48;

  // Active category key for tailored variety chips
  const activeCategoryKey = (lockedCategory || category || "all").toLowerCase();
  const currentVarieties = CATEGORY_VARIETIES[activeCategoryKey] || CATEGORY_VARIETIES["all"];

  // Reset variety tag if category changes
  useEffect(() => {
    setSelectedTag("all");
  }, [activeCategoryKey]);

  // Sync browser URL silently
  const syncUrl = useCallback(
    (
      cat?: string,
      sz?: string,
      clr?: string,
      minP?: number,
      maxP?: number,
      srt?: string,
      pg?: number
    ) => {
      if (typeof window === "undefined") return;
      const params = new URLSearchParams();
      if (!lockedCategory && cat) params.set("category", cat);
      if (sz) params.set("size", sz);
      if (clr) params.set("color", clr);
      if (minP !== undefined) params.set("min_price", String(minP));
      if (maxP !== undefined) params.set("max_price", String(maxP));
      if (srt && srt !== "newest") params.set("sort", srt);
      if (pg && pg > 1) params.set("page", String(pg));

      const queryStr = params.toString();
      const newUrl = `${window.location.pathname}${queryStr ? `?${queryStr}` : ""}`;
      window.history.replaceState(null, "", newUrl);
    },
    [lockedCategory]
  );

  const fallbackFiltering = useCallback((
    targetCat?: string,
    targetSz?: string,
    targetClr?: string,
    targetMinP?: number,
    targetMaxP?: number
  ) => {
    const allMock = [...NEW_ARRIVALS, ...BEST_SELLERS];
    let filtered = allMock;

    if (targetCat) {
      filtered = filtered.filter((m) => m.category.toLowerCase() === targetCat.toLowerCase());
    }
    if (targetMinP !== undefined) {
      filtered = filtered.filter((m) => m.price >= targetMinP);
    }
    if (targetMaxP !== undefined) {
      filtered = filtered.filter((m) => m.price <= targetMaxP);
    }

    const converted: ProductListItemDto[] = filtered.map((m) => ({
      id: String(m.id),
      name: m.name,
      slug: m.slug || "classic-cotton-shirt",
      category_slug: m.category.toLowerCase(),
      category_name: m.category,
      base_price: m.price,
      mrp: m.mrp,
      is_active: true,
      created_at: new Date().toISOString(),
      images: [],
      sizes: m.sizes,
    }));

    setProducts(converted);
    setTotal(converted.length);
  }, []);

  // Fetch products client-side
  const fetchProducts = useCallback(
    async (
      targetCat?: string,
      targetSz?: string,
      targetClr?: string,
      targetMinP?: number,
      targetMaxP?: number,
      targetSrt?: string,
      targetPg: number = 1
    ) => {
      setIsFiltering(true);
      syncUrl(targetCat, targetSz, targetClr, targetMinP, targetMaxP, targetSrt, targetPg);

      try {
        const effectiveCat = isSpecialCategory ? undefined : targetCat;
        const res = await getProducts({
          category: effectiveCat,
          min_price: targetMinP,
          max_price: targetMaxP,
          size: targetSz,
          color: targetClr,
          sort: targetSrt || "newest",
          page: targetPg,
          page_size: pageSize,
        });

        if (res && Array.isArray(res.items)) {
          setProducts(res.items);
          setTotal(res.total);
        } else {
          fallbackFiltering(targetCat, targetSz, targetClr, targetMinP, targetMaxP);
        }
      } catch (err) {
        console.warn("Client product fetch failed, using fallback:", err);
        fallbackFiltering(targetCat, targetSz, targetClr, targetMinP, targetMaxP);
      } finally {
        setIsFiltering(false);
      }
    },
    [isSpecialCategory, syncUrl, fallbackFiltering]
  );

  // Handlers
  const handleCategorySelect = (newCatSlug?: string) => {
    if (lockedCategory) return;
    setCategory(newCatSlug);
    setPage(1);
    fetchProducts(newCatSlug, size, color, minPrice, maxPrice, sort, 1);
  };

  const handleSizeSelect = (newSize?: string) => {
    setSize(newSize);
    setPage(1);
    fetchProducts(category, newSize, color, minPrice, maxPrice, sort, 1);
  };

  const handleColorSelect = (newColor?: string) => {
    setColor(newColor);
    setPage(1);
    fetchProducts(category, size, newColor, minPrice, maxPrice, sort, 1);
  };

  const handlePriceRangeSelect = (newMin?: number, newMax?: number) => {
    setMinPrice(newMin);
    setMaxPrice(newMax);
    setPage(1);
    fetchProducts(category, size, color, newMin, newMax, sort, 1);
  };

  const handleClearAll = () => {
    const resetCat = lockedCategory || undefined;
    setCategory(resetCat);
    setSize(undefined);
    setColor(undefined);
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setSelectedTag("all");
    setPage(1);
    fetchProducts(lockedCategory ? category : undefined, undefined, undefined, undefined, undefined, "newest", 1);
  };

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    setPage(1);
    fetchProducts(category, size, color, minPrice, maxPrice, newSort, 1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchProducts(category, size, color, minPrice, maxPrice, sort, newPage);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 200, behavior: "smooth" });
    }
  };

  // Instant client-side memoized sorting & variety filtering
  const displayedProducts = useMemo(() => {
    let list = products;

    // Apply variety tag filter
    if (selectedTag !== "all") {
      const activeObj = currentVarieties.find((v) => v.id === selectedTag);
      const keywords = activeObj?.keywords || [selectedTag.toLowerCase()];
      if (keywords.length > 0) {
        list = products.filter((p) => {
          const combined = `${p.name} ${p.slug} ${p.category_name || ""}`.toLowerCase();
          return keywords.some((kw) => combined.includes(kw));
        });
      }
    }

    // Apply client-side instant sorting
    const sorted = [...list];
    if (sort === "price_asc" || sort === "price-asc") {
      sorted.sort((a, b) => a.base_price - b.base_price);
    } else if (sort === "price_desc" || sort === "price-desc") {
      sorted.sort((a, b) => b.base_price - a.base_price);
    } else {
      sorted.sort((a, b) => new Date(b.created_at || "").getTime() - new Date(a.created_at || "").getTime());
    }
    return sorted;
  }, [products, selectedTag, sort, currentVarieties]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 w-full max-w-full overflow-hidden">
      {/* Filter Sidebar */}
      <FilterBar
        categories={categories}
        currentCategory={lockedCategory}
        selectedCategory={category}
        selectedSize={size}
        selectedColor={color}
        selectedMinPrice={minPrice}
        selectedMaxPrice={maxPrice}
        onSelectCategory={handleCategorySelect}
        onSelectSize={handleSizeSelect}
        onSelectColor={handleColorSelect}
        onSelectPriceRange={handlePriceRangeSelect}
        onClearAll={handleClearAll}
      />

      {/* Main Content Area: min-w-0 prevents flex horizontal blow-out */}
      <div className="flex-1 min-w-0 w-full overflow-hidden">
        {/* Top Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3.5 border-b border-neutral-200 gap-2.5">
          <div className="text-xs font-mono text-neutral-500 flex items-center space-x-2">
            <span>
              SHOWING <strong className="text-neutral-900 font-bold">{displayedProducts.length}</strong> OF{" "}
              <strong className="text-neutral-900 font-bold">{total}</strong> GARMENTS
            </span>
            {isFiltering && (
              <span className="inline-flex items-center space-x-1.5 text-[11px] text-[#DC2626] font-heading font-bold uppercase tracking-wider animate-pulse ml-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />
                <span>UPDATING LOOKS...</span>
              </span>
            )}
          </div>
          <SortDropdown value={sort} onChange={handleSortChange} />
        </div>

        {/* Quick Variety & Fit Filter Chips: Clean white and black active */}
        <div className="w-full mb-4 select-none flex flex-wrap items-center gap-1.5 sm:gap-2">
          {currentVarieties.map((tag) => {
            const isSelected = selectedTag === tag.id;
            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => setSelectedTag(tag.id)}
                className={`px-3 sm:px-3.5 py-1.5 rounded-full text-[10px] sm:text-[11px] font-heading font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-black text-white shadow-xs"
                    : "bg-white text-neutral-800 border border-neutral-300 hover:border-black"
                }`}
              >
                {tag.label}
              </button>
            );
          })}
        </div>

        {/* Product Cards Grid: 2 columns on mobile, 3-5 columns on desktop */}
        <div
          className={`transition-opacity duration-200 w-full ${
            isFiltering ? "opacity-40 pointer-events-none" : "opacity-100"
          }`}
        >
          {displayedProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-3.5 md:gap-4.5 w-full items-start">
                {displayedProducts.map((item) => (
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

              {/* Pagination */}
              <Pagination
                page={page}
                pageSize={pageSize}
                total={total}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            <div className="py-20 px-6 text-center border border-neutral-200 bg-white rounded-2xl shadow-xs">
              <svg
                className="w-12 h-12 mx-auto text-neutral-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <h3 className="font-heading font-black text-sm uppercase tracking-wider text-white">
                NO GARMENTS FOUND
              </h3>
              <p className="mt-2 text-xs text-slate-400 max-w-sm mx-auto font-body">
                No products match your selected filter criteria. Try resetting size, color, or price parameters.
              </p>
              <button
                type="button"
                onClick={handleClearAll}
                className="mt-6 inline-block px-8 py-3 bg-gradient-to-r from-[#E2C58A] to-[#C6A467] text-[#0A0B0E] font-heading text-xs font-black uppercase tracking-widest rounded-full transition-all shadow-glow-gold cursor-pointer"
              >
                RESET ALL FILTERS
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
