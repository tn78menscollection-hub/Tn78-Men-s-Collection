import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getProducts, ProductDetailDto, ProductListItemDto, ProductVariantDto } from "@/lib/api";
import { NEW_ARRIVALS, BEST_SELLERS } from "@/lib/mockHomepageData";
import { ProductDetailInteractive } from "@/components/shop/ProductDetailInteractive";
import { ProductReviewsSection } from "@/components/shop/ProductReviewsSection";
import { ProductCard } from "@/components/ui/ProductCard";
import { getProductImageUrl } from "@/lib/productImages";
import { getProductColorSwatches } from "@/lib/productColors";

export const revalidate = 300;

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }> | {
    slug: string;
  };
  searchParams?: Promise<{
    color?: string;
  }> | {
    color?: string;
  };
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await getProductBySlug(slug, { next: { revalidate: 300 } });
    return {
      title: `${product.name} — TN78 Men's Collection`,
      description:
        product.description ||
        `Crafted with architectural precision and high-density material drape. TN78 luxury menswear.`,
    };
  } catch {
    const title = slug.replace(/-/g, " ").toUpperCase();
    return {
      title: `${title} — TN78 Men's Collection`,
      description: "Editorial menswear engineered for understated modern luxury.",
    };
  }
}

export default async function ProductDetailPage({
  params,
  searchParams,
}: ProductPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const initialColor = resolvedSearchParams?.color;

  let product: ProductDetailDto | null = null;
  let relatedProducts: ProductListItemDto[] = [];

  try {
    product = await getProductBySlug(slug, { next: { revalidate: 300 } });
  } catch (error: unknown) {
    console.error(`Failed to fetch product for slug ${slug}:`, error);
  }

  // Graceful fallback to mock data if backend not available or during local testing
  if (!product) {
    const allMock = [...NEW_ARRIVALS, ...BEST_SELLERS];
    const matched =
      allMock.find((m) => m.slug === slug) ||
      allMock.find((m) => m.name.toLowerCase().replace(/\s+/g, "-") === slug) ||
      allMock[0];

    if (matched) {
      product = {
        id: String(matched.id),
        name: matched.name,
        slug: matched.slug || slug,
        description:
          matched.description ||
          "Engineered with architectural precision, structural drape, and tailored comfort. Finished with tonal stitching and signature TN78 hardware.",
        category: {
          id: matched.category.toLowerCase(),
          name: matched.category,
          slug: matched.category.toLowerCase(),
          display_order: 1,
        },
        base_price: matched.price,
        is_active: true,
        created_at: new Date().toISOString(),
        variants: (() => {
          const swatches = getProductColorSwatches(matched.category);
          const fallbackSizes = ["S", "M", "L", "XL"];
          const generatedVariants: ProductVariantDto[] = [];
          swatches.forEach((sw, sIdx) => {
            fallbackSizes.forEach((sz, szIdx) => {
              generatedVariants.push({
                id: `00000000-0000-4000-8000-${sIdx.toString().padStart(6, "0")}${szIdx.toString().padStart(6, "0")}`,
                size: sz,
                color: sw.name,
                sku: `TN78-${slug.toUpperCase().slice(0, 4)}-${sw.name.toUpperCase().slice(0, 3)}-${sz}`,
                price_override: null,
                mrp_override: null,
              });
            });
          });
          return generatedVariants;
        })(),
        images: [
          { id: "img-1", url: getProductImageUrl(slug, matched.category) || "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=1000&q=80", display_order: 1, alt_text: "Front Perspective" },
          { id: "img-2", url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80", display_order: 2, alt_text: "Rear Silhouette" },
          { id: "img-3", url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80", display_order: 3, alt_text: "Fabric & Horn Button Texture" },
        ],
      };
    }
  }

  if (!product) {
    notFound();
  }

  // Fetch complementary products for "YOU MAY ALSO APPRECIATE"
  try {
    const listRes = await getProducts(
      { category: product.category.slug, page_size: 4 },
      { next: { revalidate: 300 } }
    );
    relatedProducts = listRes.items.filter((p) => p.slug !== product?.slug).slice(0, 4);
  } catch {
    relatedProducts = [];
  }

  if (relatedProducts.length === 0) {
    const allMock = [...NEW_ARRIVALS, ...BEST_SELLERS];
    relatedProducts = allMock
      .filter((m) => m.slug !== product?.slug)
      .slice(0, 4)
      .map((m) => ({
        id: String(m.id),
        name: m.name,
        slug: m.slug || "classic-cotton-shirt",
        category_name: m.category,
        category_slug: m.category.toLowerCase().replace(/\s+/g, "-"),
        base_price: m.price,
        mrp: Math.round(m.price * 1.35),
        is_active: true,
        created_at: new Date().toISOString(),
        images: m.imageUrl ? [{ id: `img-${m.id}`, url: m.imageUrl, display_order: 1, alt_text: m.name }] : [],
        sizes: m.sizes,
      }));
  }

  // Structured Data (Product Schema.org JSON-LD)
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || undefined,
    image: product.images?.map((img) => img.url) || [],
    category: product.category?.name,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.base_price,
      availability: product.is_active
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `https://tn78menswear.com/product/${product.slug}`,
    },
    ...(product.average_rating && product.review_count
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.average_rating,
            reviewCount: product.review_count,
          },
        }
      : {}),
  };

  return (
    <div className="bg-[#0A0B0E] min-h-screen text-[#F8FAFC] pb-24">
      {/* Product JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      {/* Breadcrumbs Navigation */}
      <div className="border-b border-[#232733] bg-[#13151C] px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center space-x-2 text-[10px] font-heading font-black uppercase tracking-widest text-slate-400 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-[#E2C58A] transition-colors">
            HOME
          </Link>
          <span className="text-slate-600">/</span>
          <Link href="/shop" className="hover:text-[#E2C58A] transition-colors">
            SHOP
          </Link>
          <span className="text-slate-600">/</span>
          <Link
            href={`/category/${product.category.slug}`}
            className="hover:text-[#E2C58A] transition-colors"
          >
            {product.category.name}
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-[#E2C58A] truncate max-w-[200px]">{product.name}</span>
        </div>
      </div>

      {/* Main PDP Grid with Synchronized Color & Imagery Swatches */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-14">
        <ProductDetailInteractive product={product} initialColor={initialColor} />

        {/* Client Reviews Section */}
        <ProductReviewsSection productId={product.id} productSlug={product.slug} />

        {/* Related Products Rail */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-16 border-t border-[#232733]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-[10px] font-heading font-black uppercase tracking-widest text-[#E2C58A]">
                  CURATED RECOMMENDATIONS
                </span>
                <h2 className="mt-1 font-heading font-black text-xl uppercase tracking-wider text-white">
                  YOU MAY ALSO APPRECIATE
                </h2>
              </div>
              <Link
                href="/shop"
                className="text-xs font-heading font-bold uppercase tracking-wider text-[#E2C58A] hover:text-white transition-colors"
              >
                VIEW ALL &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-3.5 md:gap-4.5">
              {relatedProducts.map((item) => (
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
          </div>
        )}
      </div>
    </div>
  );
}
