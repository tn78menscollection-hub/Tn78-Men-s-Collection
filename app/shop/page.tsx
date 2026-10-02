import React from "react";
import { Metadata } from "next";
import { CategoryDto, getCategories, getProducts, ProductListItemDto } from "@/lib/api";
import { NEW_ARRIVALS, BEST_SELLERS } from "@/lib/mockHomepageData";
import { ShopCatalogView } from "@/components/shop/ShopCatalogView";

export const metadata: Metadata = {
  title: "Shop All Menswear — TN78 Men's Collection",
  description:
    "Explore the complete TN78 menswear archive. Modern tailored silhouettes, overshirts, trousers, and refined luxury essentials.",
};

interface ShopPageProps {
  searchParams: {
    category?: string;
    min_price?: string;
    max_price?: string;
    size?: string;
    color?: string;
    sort?: string;
    page?: string;
  };
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const page = parseInt(searchParams.page || "1", 10) || 1;
  const pageSize = 48;
  const category = searchParams.category;
  const minPrice = searchParams.min_price ? parseFloat(searchParams.min_price) : undefined;
  const maxPrice = searchParams.max_price ? parseFloat(searchParams.max_price) : undefined;
  const size = searchParams.size;
  const color = searchParams.color;
  const sort = searchParams.sort || "newest";

  // Fetch categories and products concurrently with graceful fallbacks
  let categories: CategoryDto[] = [];
  let products: ProductListItemDto[] = [];
  let total = 0;

  try {
    const [catRes, prodRes] = await Promise.all([
      getCategories({ cache: "no-store" }).catch(() => []),
      getProducts(
        {
          category,
          min_price: minPrice,
          max_price: maxPrice,
          size,
          color,
          sort,
          page,
          page_size: pageSize,
        },
        { cache: "no-store" }
      ).catch(() => null),
    ]);

    categories = catRes || [];
    if (prodRes) {
      products = prodRes.items;
      total = prodRes.total;
    }
  } catch (error) {
    console.error("Failed to load catalog data:", error);
  }

  // Fallback to mock data if backend returned 0 items and no filters were applied
  if (products.length === 0 && !category && !minPrice && !maxPrice && !size && !color) {
    const allMock = [...NEW_ARRIVALS, ...BEST_SELLERS];
    products = allMock.map((m) => ({
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

  return (
    <div className="bg-[#0A0B0E] min-h-screen text-[#F8FAFC] w-full max-w-full overflow-x-hidden">
      {/* Header Banner - Ultra-Compact & Clean */}
      <div className="border-b border-[#232733] bg-gradient-to-r from-[#0E1017] via-[#14161E] to-[#0E1017] py-2.5 sm:py-3.5 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#E2C58A]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <span className="text-[9px] sm:text-[10px] font-heading font-bold uppercase tracking-[0.25em] text-[#E2C58A]">
            COLLECTION ARCHIVE
          </span>
          <h1 className="mt-0.5 font-heading font-black text-lg sm:text-xl md:text-2xl text-white tracking-tight">
            All Menswear
          </h1>
          <p className="mt-0.5 max-w-2xl text-[11px] sm:text-xs font-serif italic text-slate-400 leading-normal">
            Contemporary silhouettes crafted with architectural proportion, dense fabric drape, and exacting precision.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4 pb-8 w-full max-w-full overflow-x-hidden">
        <ShopCatalogView
          categories={categories}
          initialProducts={products}
          initialTotal={total}
          initialCategory={category}
          initialSize={size}
          initialColor={color}
          initialMinPrice={minPrice}
          initialMaxPrice={maxPrice}
          initialSort={sort}
          initialPage={page}
        />
      </div>
    </div>
  );
}
