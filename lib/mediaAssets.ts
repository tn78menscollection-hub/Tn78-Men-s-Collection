/**
 * TN78 Centralized Visual Media & Assets Store.
 * Allows store admins to update, upload, and customize homepage hero slides,
 * category cards, and product imagery live without writing code.
 */

export interface HeroSlideAsset {
  id: string;
  tag: string;
  titlePrimary: string;
  titleSecondary: string;
  description: string;
  mainImage: string;
  secondaryImage: string;
  badgeText: string;
  priceNote: string;
  href: string;
  accentColor: string;
}

export interface CategoryCardAsset {
  id: string;
  name: string;
  slug: string;
  type: "topwear" | "bottomwear" | "all";
  imageUrl: string;
  count: number;
}

export interface MediaAssetsStore {
  heroSlides: HeroSlideAsset[];
  categoryCards: CategoryCardAsset[];
  productOverrides: Record<string, string[]>;
}

export const DEFAULT_HERO_SLIDES: HeroSlideAsset[] = [
  {
    id: "hero-1",
    tag: "AUTUMN / WINTER 2026 DROP",
    titlePrimary: "ARCHITECTURAL",
    titleSecondary: "SILHOUETTES & DRAPES",
    description:
      "Engineered with dense slub linen, dropped shoulder drape, and relaxed proportions for modern presence.",
    mainImage:
      "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=1000&q=80",
    secondaryImage:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=700&q=80",
    badgeText: "STRUCTURED CO-ORD SET",
    priceNote: "₹2,499 • 100% PURE LINEN",
    href: "/shop?sort=newest",
    accentColor: "#DC2626",
  },
  {
    id: "hero-2",
    tag: "HIGH-DEMAND RESORT CAPSULE",
    titlePrimary: "MONOCHROME",
    titleSecondary: "RESORT SHIRTS & PLEATS",
    description:
      "Unstructured Cuban collars and fluid tactile trousers crafted for Mediterranean sun and rooftop distinction.",
    mainImage:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80",
    secondaryImage:
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=700&q=80",
    badgeText: "RESORT WEAR ARCHIVE",
    priceNote: "₹2,299 • TEXTURED COTTON",
    href: "/category/shirts",
    accentColor: "#D97706",
  },
  {
    id: "hero-3",
    tag: "HEAVYWEIGHT ESSENTIALS",
    titlePrimary: "OVERSIZED",
    titleSecondary: "WAFFLE KNITS & LOWERS",
    description:
      "320 GSM dense waffle polo knits and minimalist drawstring lowers designed for heavyweight comfort.",
    mainImage:
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80",
    secondaryImage:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=700&q=80",
    badgeText: "WAFFLE POLO EDIT",
    priceNote: "₹1,999 • 320 GSM HEAVYWEIGHT",
    href: "/category/t-shirts",
    accentColor: "#16A34A",
  },
];

export const DEFAULT_CATEGORY_CARDS: CategoryCardAsset[] = [
  {
    id: "t-shirts",
    name: "T-Shirts",
    slug: "/category/t-shirts",
    type: "topwear",
    imageUrl:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=700&q=80",
    count: 12,
  },
  {
    id: "hoodies",
    name: "Hoodies",
    slug: "/category/shirts",
    type: "topwear",
    imageUrl:
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=700&q=80",
    count: 8,
  },
  {
    id: "lycra-shirts",
    name: "Lycra Shirts",
    slug: "/category/shirts",
    type: "topwear",
    imageUrl:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=700&q=80",
    count: 15,
  },
  {
    id: "printed-shirts",
    name: "Printed Shirts",
    slug: "/category/shirts",
    type: "topwear",
    imageUrl:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=700&q=80",
    count: 20,
  },
  {
    id: "checked-shirts",
    name: "Checked Shirts",
    slug: "/category/shirts",
    type: "topwear",
    imageUrl:
      "https://images.unsplash.com/photo-1589310243389-96a5483213a8?auto=format&fit=crop&w=700&q=80",
    count: 10,
  },
  {
    id: "cargo-pants",
    name: "Cargo Pants",
    slug: "/category/pants",
    type: "bottomwear",
    imageUrl:
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=700&q=80",
    count: 14,
  },
  {
    id: "trousers",
    name: "Tailored Trousers",
    slug: "/category/pants",
    type: "bottomwear",
    imageUrl:
      "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=700&q=80",
    count: 18,
  },
  {
    id: "lowers",
    name: "Lowers & Joggers",
    slug: "/category/lowers",
    type: "bottomwear",
    imageUrl:
      "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=700&q=80",
    count: 9,
  },
  {
    id: "shorts",
    name: "Casual Shorts",
    slug: "/category/shorts",
    type: "bottomwear",
    imageUrl:
      "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=700&q=80",
    count: 7,
  },
  {
    id: "oversized-tees",
    name: "Oversized Tees",
    slug: "/category/t-shirts",
    type: "topwear",
    imageUrl:
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=700&q=80",
    count: 11,
  },
];

const STORAGE_KEY = "tn78_custom_media_assets_v1";
export const MEDIA_UPDATE_EVENT = "tn78_media_assets_changed";

export function getMediaAssets(): MediaAssetsStore {
  if (typeof window === "undefined") {
    return {
      heroSlides: DEFAULT_HERO_SLIDES,
      categoryCards: DEFAULT_CATEGORY_CARDS,
      productOverrides: {},
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        heroSlides: DEFAULT_HERO_SLIDES,
        categoryCards: DEFAULT_CATEGORY_CARDS,
        productOverrides: {},
      };
    }
    const parsed = JSON.parse(raw);
    return {
      heroSlides: parsed.heroSlides?.length ? parsed.heroSlides : DEFAULT_HERO_SLIDES,
      categoryCards: parsed.categoryCards?.length ? parsed.categoryCards : DEFAULT_CATEGORY_CARDS,
      productOverrides: parsed.productOverrides || {},
    };
  } catch {
    return {
      heroSlides: DEFAULT_HERO_SLIDES,
      categoryCards: DEFAULT_CATEGORY_CARDS,
      productOverrides: {},
    };
  }
}

export function saveMediaAssets(store: MediaAssetsStore): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    window.dispatchEvent(new Event(MEDIA_UPDATE_EVENT));
  } catch (err) {
    console.error("Failed to save media assets:", err);
  }
}

export function updateHeroSlide(slideIndex: number, updates: Partial<HeroSlideAsset>): void {
  const current = getMediaAssets();
  const nextSlides = [...current.heroSlides];
  if (nextSlides[slideIndex]) {
    nextSlides[slideIndex] = { ...nextSlides[slideIndex], ...updates };
    saveMediaAssets({ ...current, heroSlides: nextSlides });
  }
}

export function updateCategoryCard(cardId: string, updates: Partial<CategoryCardAsset>): void {
  const current = getMediaAssets();
  const nextCards = current.categoryCards.map((c) =>
    c.id === cardId ? { ...c, ...updates } : c
  );
  saveMediaAssets({ ...current, categoryCards: nextCards });
}

export function updateProductImageOverride(slugOrId: string, imageUrls: string[]): void {
  const current = getMediaAssets();
  const nextOverrides = {
    ...current.productOverrides,
    [slugOrId]: imageUrls,
  };
  saveMediaAssets({ ...current, productOverrides: nextOverrides });
}

export function resetMediaAssetsToDefaults(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event(MEDIA_UPDATE_EVENT));
  } catch {}
}
