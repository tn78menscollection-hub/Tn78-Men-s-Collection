import React from "react";
import { Metadata } from "next";
import { CategoryDto, getCategories, getProducts, ProductListItemDto } from "@/lib/api";
import { CATEGORIES, NEW_ARRIVALS, BEST_SELLERS } from "@/lib/mockHomepageData";
import { ShopCatalogView } from "@/components/shop/ShopCatalogView";

interface CategoryPageProps {
  params: {
    slug: string;
  };
  searchParams: {
    min_price?: string;
    max_price?: string;
    size?: string;
    color?: string;
    sort?: string;
    page?: string;
  };
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const categoryTitle = params.slug.toUpperCase().replace(/-/g, " ");
  return {
    title: `${categoryTitle} — TN78 Men's Collection`,
    description: `Shop the ${categoryTitle} collection from TN78. Modern luxury menswear crafted for discerning presence.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = params;
  const page = parseInt(searchParams.page || "1", 10) || 1;
  const pageSize = 12;
  const minPrice = searchParams.min_price ? parseFloat(searchParams.min_price) : undefined;
  const maxPrice = searchParams.max_price ? parseFloat(searchParams.max_price) : undefined;
  const size = searchParams.size;
  const color = searchParams.color;
  const sort = searchParams.sort || "newest";

  // Check if special category (e.g. new-arrivals, trending, offers)
  const isSpecialCategory = ["new-arrivals", "trending", "offers"].includes(slug);
  const filterCategory = isSpecialCategory ? undefined : slug;

  let categories: CategoryDto[] = [];
  let products: ProductListItemDto[] = [];
  let total = 0;

  try {
    const [catRes, prodRes] = await Promise.all([
      getCategories({ cache: "no-store" }).catch(() => []),
      getProducts(
        {
          category: filterCategory,
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
    console.error("Failed to fetch category products:", error);
  }

  // Graceful fallback if backend returned 0 items
  if (products.length === 0 && !minPrice && !maxPrice && !size && !color) {
    const allMock = [...NEW_ARRIVALS, ...BEST_SELLERS];
    const filteredMock = isSpecialCategory
      ? allMock
      : allMock.filter((m) => m.category.toLowerCase() === slug.toLowerCase());

    products = (filteredMock.length > 0 ? filteredMock : allMock).map((m) => ({
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

  const categoryName = slug.toUpperCase().replace(/-/g, " ");
  const currentCategoryObj = categories.find((c) => c.slug === slug);
  const mockCatObj = CATEGORIES.find((c) => c.slug.includes(slug));
  const categoryDescription =
    mockCatObj?.description || "Structured silhouettes engineered with tailored presence.";

  return (
    <div className="bg-[#0A0B0E] min-h-screen text-[#F8FAFC] w-full max-w-full overflow-x-hidden">
      {/* Category Header Banner - Ultra-Compact & Clean */}
      <div className="relative bg-gradient-to-b from-[#13151C] to-[#0A0B0E] border-b border-[#232733] py-2.5 sm:py-3.5 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#E2C58A_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center space-x-2 text-[9px] sm:text-[10px] font-heading font-black uppercase tracking-[0.2em] text-[#E2C58A] mb-0.5">
            <a href="/shop" className="hover:text-white transition-colors">
              COLLECTION
            </a>
            <span className="text-slate-600">/</span>
            <span>{categoryName}</span>
          </div>
          <h1 className="font-heading font-black text-lg sm:text-xl md:text-2xl text-white uppercase tracking-wider leading-tight">
            {currentCategoryObj?.name || categoryName}
          </h1>
          <p className="mt-0.5 max-w-2xl text-[11px] sm:text-xs text-slate-400 leading-normal font-body">
            {categoryDescription}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4 pb-8 w-full max-w-full overflow-x-hidden">
        <ShopCatalogView
          categories={categories}
          initialProducts={products}
          initialTotal={total}
          initialCategory={isSpecialCategory ? undefined : slug}
          lockedCategory={isSpecialCategory ? undefined : slug}
          isSpecialCategory={isSpecialCategory}
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
