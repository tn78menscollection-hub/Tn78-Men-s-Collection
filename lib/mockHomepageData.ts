// PHASE 3 MOCK DATA — Phase 4+ will replace this with API-backed data.

export interface MockProduct {
  id: string | number;
  name: string;
  slug?: string;
  price: number;
  mrp?: number;
  imageUrl?: string;
  sizes?: string[];
  category: string;
  isNew?: boolean;
  role?: string;
  description?: string;
}

export interface MockCategory {
  id: string;
  name: string;
  slug: string;
  count: number;
  description: string;
  placeholder: string;
}

export interface MockOffer {
  id: string;
  title: string;
  code: string;
  discount: string;
  description: string;
}

export interface MockReview {
  id: string;
  name: string;
  location: string;
  rating: number;
  quote: string;
  product: string;
}

export interface MockSocialPost {
  id: string;
  label: string;
}

export const HERO_CONTENT = {
  eyebrow: "AUTUMN / WINTER 2026 EDITORIAL",
  headline: "THE ARCHITECTURAL SILHOUETTE",
  copy: "Precision tailoring meets understated modern luxury. Designed and tailored in India with handpicked breathable fabrics, structural drape, and quiet presence.",
  primaryCta: {
    text: "EXPLORE COLLECTION",
    href: "/shop",
  },
  secondaryCta: {
    text: "DISCOVER THE EDIT",
    href: "/shop",
  },
  placeholderLabel: "CAMPAIGN VISUAL // FW26",
};

export const CATEGORIES: MockCategory[] = [
  {
    id: "shirts",
    name: "SHIRTS",
    slug: "/category/shirts",
    count: 8,
    description: "Cotton, Linen, Baggy, Party, Stone & Double Pocket",
    placeholder: "SHIRTS EDIT",
  },
  {
    id: "pants",
    name: "PANTS",
    slug: "/category/pants",
    count: 9,
    description: "Jeans, Chinos, Lycra, Cargo, Mom Fit & Baggy",
    placeholder: "PANTS EDIT",
  },
  {
    id: "t-shirts",
    name: "T-SHIRTS",
    slug: "/category/t-shirts",
    count: 11,
    description: "Popcorn, 5th Sleeve, Hoodies, Jerseys, Zipper & Lycra",
    placeholder: "T-SHIRTS EDIT",
  },
  {
    id: "lowers",
    name: "LOWERS",
    slug: "/category/lowers",
    count: 6,
    description: "Lycra, Popcorn, Cargo, NS Parachute & 3-Stripe Baggy",
    placeholder: "LOWERS EDIT",
  },
  {
    id: "shorts",
    name: "SHORTS",
    slug: "/category/shorts",
    count: 9,
    description: "Denim, NS, Popcorn, Net Mesh, 3/4 & 4-Way Lycra",
    placeholder: "SHORTS EDIT",
  },
];

export const NEW_ARRIVALS: MockProduct[] = [
  {
    id: "na-1",
    name: "CLASSIC COTTON SHIRT",
    slug: "classic-cotton-shirt",
    price: 899,
    mrp: 1499,
    imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=700&q=80",
    sizes: ["S", "M", "L", "XL", "XXL"],
    category: "SHIRTS",
    isNew: true,
  },
  {
    id: "na-2",
    name: "PURE LINEN SHIRT",
    slug: "pure-linen-shirt",
    price: 1499,
    mrp: 2499,
    imageUrl: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=700&q=80",
    sizes: ["S", "M", "L", "XL", "XXL"],
    category: "SHIRTS",
    isNew: true,
  },
  {
    id: "na-3",
    name: "OVERSIZED BAGGY SHIRT",
    slug: "oversized-baggy-shirt",
    price: 1199,
    mrp: 1899,
    imageUrl: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=700&q=80",
    sizes: ["M", "L", "XL", "XXL"],
    category: "SHIRTS",
    isNew: true,
  },
  {
    id: "na-4",
    name: "COTTON CHINOS PANT",
    slug: "cotton-chinos-pant",
    price: 1199,
    mrp: 1799,
    imageUrl: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=700&q=80",
    sizes: ["28", "30", "32", "34", "36"],
    category: "PANTS",
    isNew: true,
  },
  {
    id: "na-5",
    name: "FOUR-WAY LYCRA FORMAL PANT",
    slug: "four-way-lycra-formal-pant",
    price: 1099,
    mrp: 1699,
    imageUrl: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=700&q=80",
    sizes: ["28", "30", "32", "34", "36"],
    category: "PANTS",
    isNew: true,
  },
  {
    id: "na-6",
    name: "MULTI-POCKET CARGO PANT",
    slug: "multi-pocket-cargo-pant",
    price: 1399,
    mrp: 2199,
    imageUrl: "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=700&q=80",
    sizes: ["28", "30", "32", "34", "36"],
    category: "PANTS",
    isNew: true,
  },
];

export const BEST_SELLERS: MockProduct[] = [
  {
    id: "bs-1",
    name: "LUXE PARTY WEAR SHIRT",
    slug: "luxe-party-wear-shirt",
    price: 1499,
    mrp: 2299,
    imageUrl: "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=700&q=80",
    sizes: ["S", "M", "L", "XL", "XXL"],
    category: "SHIRTS",
    isNew: false,
  },
  {
    id: "bs-2",
    name: "CLASSIC DENIM JEANS",
    slug: "classic-denim-jeans",
    price: 1299,
    mrp: 1999,
    imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=700&q=80",
    sizes: ["28", "30", "32", "34", "36"],
    category: "PANTS",
    isNew: false,
  },
  {
    id: "bs-3",
    name: "POPCORN TEXTURED T-SHIRT",
    slug: "popcorn-textured-tee",
    price: 699,
    mrp: 1199,
    imageUrl: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=700&q=80",
    sizes: ["S", "M", "L", "XL", "XXL"],
    category: "T-SHIRTS",
    isNew: false,
  },
  {
    id: "bs-4",
    name: "MULTI-POCKET CARGO LOWER",
    slug: "multi-pocket-cargo-lower",
    price: 899,
    mrp: 1499,
    imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=700&q=80",
    sizes: ["M", "L", "XL", "XXL"],
    category: "LOWERS",
    isNew: false,
  },
];

export const TRENDING = {
  featured: {
    id: "trend-feat",
    name: "DOUBLE POCKET CARGO SHIRT",
    slug: "double-pocket-cargo-shirt",
    price: 1299,
    category: "SHIRTS",
    isNew: true,
    description:
      "Tactical twin flap cargo chest pockets with reinforced bar-tack stitching and rugged horn buttons. Engineered for structural volume.",
  },
  secondary: [
    {
      id: "trend-1",
      name: "SKATER BAGGY PANT",
      slug: "skater-baggy-pant",
      price: 1299,
      category: "PANTS",
      isNew: true,
    },
    {
      id: "trend-2",
      name: "5TH SLEEVE DROP SHOULDER TEE",
      slug: "fifth-sleeve-drop-shoulder-tee",
      price: 749,
      category: "T-SHIRTS",
      isNew: false,
    },
    {
      id: "trend-3",
      name: "STREETWEAR BAGGY LOWER",
      slug: "streetwear-baggy-lower",
      price: 799,
      category: "LOWERS",
      isNew: true,
    },
    {
      id: "trend-4",
      name: "DISTRESSED DENIM SHORTS",
      slug: "distressed-denim-shorts",
      price: 799,
      category: "SHORTS",
      isNew: false,
    },
  ],
};

export const PROMO_BANNER = {
  badge: "LIMITED EDITORIAL ARCHIVE",
  headline: "UP TO 40% OFF",
  subheadline: "SEASONAL CURATION // ESSENTIAL MENSWEAR",
  details: "Select garments from our foundational archive now available at special consideration.",
  codeText: "APPLY CODE AT CHECKOUT",
  promoCode: "TN78VIP",
  cta: {
    text: "SHOP THE PRIVATE SALE",
    href: "/shop",
  },
};

export const FEATURED_COLLECTION = {
  eyebrow: "LIMITED CAPSULE",
  title: "THE NEW MEN'S EDIT",
  subtitle: "A study in contemporary drape and architectural ease.",
  description:
    "Rooted in intentional proportion, our FW26 capsule explores tonal charcoal, pure ivory accents, and understated silhouettes engineered for all-day comfort and commanding aesthetic presence.",
  cta: {
    text: "EXPLORE THE EDIT",
    href: "/shop",
  },
  placeholderLabel: "THE NEW MEN'S EDITORIAL // LOOKBOOK",
};

export const COMPLETE_THE_LOOK = {
  outfitTitle: "THE URBAN DUALITY ENSEMBLE",
  outfitDescription:
    "A balanced composition combining breathable structured linen, razor-sharp cotton chinos, and our signature classic cotton layer.",
  bundlePrice: 3597,
  items: [
    {
      id: "ctl-1",
      name: "PURE LINEN SHIRT",
      slug: "pure-linen-shirt",
      price: 1499,
      category: "SHIRTS",
      role: "THE SHIRT",
    },
    {
      id: "ctl-2",
      name: "COTTON CHINOS PANT",
      slug: "cotton-chinos-pant",
      price: 1199,
      category: "PANTS",
      role: "THE PANT",
    },
    {
      id: "ctl-3",
      name: "CLASSIC COTTON SHIRT",
      slug: "classic-cotton-shirt",
      price: 899,
      category: "SHIRTS",
      role: "THE LAYER",
    },
  ],
};

export const OFFERS: MockOffer[] = [
  {
    id: "off-1",
    title: "FREE DELIVERY OVER ₹999",
    code: "AUTOMATIC",
    discount: "FREE SHIPPING",
    description:
      "Complimentary express courier dispatch pan-India on all orders above ₹999.",
  },
  {
    id: "off-2",
    title: "SEASONAL WARDROBE EDIT",
    code: "TN78FESTIVE",
    discount: "₹500 FLAT OFF",
    description:
      "Flat ₹500 discount on complete ensembles, premium linen shirts, and cargo pants above ₹2,499.",
  },
  {
    id: "off-3",
    title: "MULTI-PIECE ENSEMBLE",
    code: "TN78STYLE",
    discount: "15% OFF",
    description:
      "Unlock 15% instant savings when building your style look with two or more complementary garments.",
  },
];

export const REVIEWS: MockReview[] = [
  {
    id: "rev-1",
    name: "Vikram Sengupta",
    location: "Chennai",
    rating: 5,
    quote:
      "The drape and breathability of the Pure Linen Shirt is impeccable. Standout craftsmanship at an honest price.",
    product: "Pure Linen Shirt",
  },
  {
    id: "rev-2",
    name: "Aditya Verma",
    location: "Bengaluru",
    rating: 5,
    quote:
      "Finding chinos with the right stretch and taper has always been difficult. TN78 completely mastered the cut.",
    product: "Cotton Chinos Pant",
  },
  {
    id: "rev-3",
    name: "Karan Malhotra",
    location: "Coimbatore",
    rating: 5,
    quote:
      "The 6-pocket cargo pant quality and heavy stitching are top notch. This is now my go-to men's wear store.",
    product: "Multi-Pocket Cargo Pant",
  },
];

export const SOCIAL_SECTION = {
  handle: "@tn_78_mens_collection",
  url: "https://www.instagram.com/tn_78_mens_collection",
  posts: [
    { id: "ig-1", label: "LOOK 01 // OVERSIZED POPLIN" },
    { id: "ig-2", label: "LOOK 02 // RELAXED TROUSER" },
    { id: "ig-3", label: "LOOK 03 // MONOCHROME CO-ORD" },
    { id: "ig-4", label: "LOOK 04 // RAW-EDGE BOX TEE" },
    { id: "ig-5", label: "LOOK 05 // TEXTURED POLO" },
    { id: "ig-6", label: "LOOK 06 // ARCHITECTURAL DRAPE" },
  ],
};
