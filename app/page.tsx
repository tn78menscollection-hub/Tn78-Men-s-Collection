import React from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { ProductRail } from "@/components/home/ProductRail";
import { CategorySection } from "@/components/home/CategorySection";
import { TrendingSection } from "@/components/home/TrendingSection";
import { PromoBanner } from "@/components/home/PromoBanner";
import { FeaturedCollection } from "@/components/home/FeaturedCollection";
import { CompleteTheLook } from "@/components/home/CompleteTheLook";
import { OffersSection } from "@/components/home/OffersSection";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { InstagramSection } from "@/components/home/InstagramSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";

import {
  NEW_ARRIVALS,
  BEST_SELLERS,
  MockProduct,
} from "@/lib/mockHomepageData";
import { getProducts } from "@/lib/api";

export const revalidate = 300;

export default async function HomePage() {
  let newArrivals: MockProduct[] = NEW_ARRIVALS;
  let bestSellers: MockProduct[] = BEST_SELLERS;

  try {
    const response = await getProducts({ page: 1, page_size: 10 }, { next: { revalidate: 300 } });
    if (response && response.items && response.items.length >= 4) {
      newArrivals = response.items.slice(0, 6).map((item, idx) => ({
        id: item.id,
        name: item.name,
        price: item.base_price,
        mrp: Math.round(item.base_price * 1.35),
        imageUrl: item.images && item.images.length > 0 ? item.images[0].url : NEW_ARRIVALS[idx % NEW_ARRIVALS.length]?.imageUrl,
        sizes: item.sizes && item.sizes.length > 0 ? item.sizes : undefined,
        category: item.category_name || "CO-ORD SETS",
        slug: item.slug,
        isNew: true,
      }));

      if (response.items.length >= 8) {
        bestSellers = response.items.slice(4, 8).map((item, idx) => ({
          id: item.id,
          name: item.name,
          price: item.base_price,
          mrp: Math.round(item.base_price * 1.35),
          imageUrl: item.images && item.images.length > 0 ? item.images[0].url : BEST_SELLERS[idx % BEST_SELLERS.length]?.imageUrl,
          sizes: item.sizes && item.sizes.length > 0 ? item.sizes : undefined,
          category: item.category_name || "SHIRTS",
          slug: item.slug,
          isNew: false,
        }));
      }
    }
  } catch (error) {
    // Graceful fallback to rich photoshoot mockHomepageData
    newArrivals = NEW_ARRIVALS;
    bestSellers = BEST_SELLERS;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5] text-[#111827]">
      {/* 1. Modern Hero Section */}
      <HeroSection />

      {/* 2. Shop by Category Grid (Matching Screenshot 2 & 4) */}
      <CategorySection />

      {/* 3. Product Rail: New Arrivals (Matching Screenshot 5) */}
      <ProductRail
        eyebrow="✨ TRENDING DROP"
        title="New Arrivals"
        subtitle="Curated casual, party, and resort wear designed for everyday distinction"
        products={newArrivals}
        viewAllHref="/shop?sort=newest"
      />

      {/* Editorial Scrolling Marquee Divider */}
      <aside
        aria-label="Editorial Brand Highlights"
        tabIndex={0}
        className="py-3.5 bg-black border-y border-neutral-800 overflow-hidden select-none group focus:outline-none focus-visible:ring-1 focus-visible:ring-[#F59E0B]"
      >
        <div className="flex w-max animate-marqueeSlow group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused] hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] items-center space-x-12">
          {[
            "✦ FREE EXPRESS DELIVERY ON ORDERS OVER ₹2,000",
            "✦ 100% PURE LONG-STAPLE COTTON & LINEN",
            "✦ PRIORITY DISPATCH ACROSS INDIA",
            "✦ 100% SECURE PREPAID ONLINE ORDERS",
            "✦ WHATSAPP SIZING SUPPORT: +91 70104 18046",
          ].map((text, idx) => (
            <span
              key={idx}
              className="text-xs sm:text-sm font-heading font-black tracking-[0.22em] text-[#F59E0B] uppercase"
            >
              {text}
            </span>
          ))}
          {[
            "✦ FREE EXPRESS DELIVERY ON ORDERS OVER ₹2,000",
            "✦ 100% PURE LONG-STAPLE COTTON & LINEN",
            "✦ PRIORITY DISPATCH ACROSS INDIA",
            "✦ 100% SECURE PREPAID ONLINE ORDERS",
            "✦ WHATSAPP SIZING SUPPORT: +91 70104 18046",
          ].map((text, idx) => (
            <span
              key={`repeat-${idx}`}
              className="text-xs sm:text-sm font-heading font-black tracking-[0.22em] text-[#F59E0B] uppercase"
            >
              {text}
            </span>
          ))}
        </div>
      </aside>

      {/* 4. Trending Section */}
      <TrendingSection />

      {/* 5. Typographic Promo Banner */}
      <PromoBanner />

      {/* 6. Large Editorial Featured Collection */}
      <FeaturedCollection />

      {/* 7. Product Rail: Best Sellers */}
      <ProductRail
        title="Bestselling Co-Ords"
        subtitle="Our most coveted relaxed drape silhouettes"
        products={bestSellers}
        viewAllHref="/shop"
      />

      {/* 8. Complete The Look */}
      <CompleteTheLook />

      {/* 9. Offers & Client Privileges */}
      <OffersSection />

      {/* 10. Client Testimonials & Reviews */}
      <ReviewsSection />

      {/* 11. Instagram Visual Journal */}
      <InstagramSection />

      {/* 12. Newsletter Subscription */}
      <NewsletterSection />
    </div>
  );
}
