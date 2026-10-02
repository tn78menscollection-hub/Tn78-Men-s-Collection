/**
 * TN78 Architectural Menswear — Color Swatch & Palette Engine.
 * Supports Amazon/Myntra-style multi-color switching with synchronized imagery.
 * Works with any single-color or multi-color product configured by the admin.
 */

export interface ColorSwatchItem {
  name: string;
  hex: string;
  thumbnail: string;
  images: Array<{
    id: string;
    url: string;
    alt_text?: string;
  }>;
}

// Master color hex lookup for clean, authentic swatches
export const COLOR_HEX_MAP: Record<string, string> = {
  black: "#121316",
  "midnight black": "#121316",
  "jet black": "#101114",
  charcoal: "#272932",
  "charcoal black": "#181A20",
  "charcoal grey": "#2D3748",
  navy: "#1B2845",
  "navy blue": "#1A2538",
  "deep navy": "#151F33",
  "royal navy": "#1E3A8A",
  olive: "#3D4A3E",
  "olive green": "#3A4D39",
  "olive sage": "#455344",
  "sage olive": "#455243",
  white: "#F5F5F0",
  "crisp white": "#F8F8F4",
  "pure white": "#FAF9F6",
  ivory: "#F1EFE7",
  beige: "#D8C7A5",
  khaki: "#C2A676",
  "khaki beige": "#CBB994",
  "desert khaki": "#C4A97B",
  "desert sand": "#C2A676",
  grey: "#4B5563",
  "heather grey": "#636B78",
  "slate grey": "#464E5B",
  burgundy: "#581C27",
  "crimson wine": "#6B1D2F",
  wine: "#5B1E28",
  brown: "#4A3528",
  "mocha brown": "#4A3528",
};

export function getColorHex(colorName?: string): string {
  if (!colorName) return "#272932";
  const clean = colorName.toLowerCase().trim();
  return COLOR_HEX_MAP[clean] || "#334155";
}

// Curated high-res editorial image suites per garment category and colorway
export const CATEGORY_COLOR_GALLERIES: Record<string, ColorSwatchItem[]> = {
  shirts: [
    {
      name: "Midnight Black",
      hex: "#121316",
      thumbnail:
        "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=400&q=80",
      images: [
        {
          id: "sh-blk-1",
          url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80",
          alt_text: "Midnight Black Shirt - Front View",
        },
        {
          id: "sh-blk-2",
          url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80",
          alt_text: "Midnight Black Shirt - Profile Drape",
        },
        {
          id: "sh-blk-3",
          url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80",
          alt_text: "Midnight Black Shirt - Fabric & Horn Button Detail",
        },
      ],
    },
    {
      name: "Navy Blue",
      hex: "#1B2845",
      thumbnail:
        "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=400&q=80",
      images: [
        {
          id: "sh-nvy-1",
          url: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80",
          alt_text: "Navy Blue Shirt - Front View",
        },
        {
          id: "sh-nvy-2",
          url: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1000&q=80",
          alt_text: "Navy Blue Shirt - Silhouette Detail",
        },
        {
          id: "sh-nvy-3",
          url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80",
          alt_text: "Navy Blue Shirt - Texture & Stitching",
        },
      ],
    },
    {
      name: "Olive Green",
      hex: "#3A4D39",
      thumbnail:
        "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=400&q=80",
      images: [
        {
          id: "sh-olv-1",
          url: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=1000&q=80",
          alt_text: "Olive Green Shirt - Front Perspective",
        },
        {
          id: "sh-olv-2",
          url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80",
          alt_text: "Olive Green Shirt - Weave & Collar",
        },
        {
          id: "sh-olv-3",
          url: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1000&q=80",
          alt_text: "Olive Green Shirt - Back View",
        },
      ],
    },
    {
      name: "Crisp White",
      hex: "#F8F8F4",
      thumbnail:
        "https://images.unsplash.com/photo-1620012253295-c15c429fbb41?auto=format&fit=crop&w=400&q=80",
      images: [
        {
          id: "sh-wht-1",
          url: "https://images.unsplash.com/photo-1620012253295-c15c429fbb41?auto=format&fit=crop&w=1000&q=80",
          alt_text: "Crisp White Shirt - Front Studio View",
        },
        {
          id: "sh-wht-2",
          url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80",
          alt_text: "Crisp White Shirt - Tailored Silhouette",
        },
        {
          id: "sh-wht-3",
          url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80",
          alt_text: "Crisp White Shirt - Texture Detail",
        },
      ],
    },
    {
      name: "Desert Sand",
      hex: "#C2A676",
      thumbnail:
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=400&q=80",
      images: [
        {
          id: "sh-snd-1",
          url: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=1000&q=80",
          alt_text: "Desert Sand Shirt - Editorial Look",
        },
        {
          id: "sh-snd-2",
          url: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80",
          alt_text: "Desert Sand Shirt - Drape & Linen Fold",
        },
      ],
    },
  ],

  pants: [
    {
      name: "Charcoal Black",
      hex: "#181A20",
      thumbnail:
        "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=400&q=80",
      images: [
        {
          id: "pt-blk-1",
          url: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=80",
          alt_text: "Charcoal Black Trouser - Front Perspective",
        },
        {
          id: "pt-blk-2",
          url: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=1000&q=80",
          alt_text: "Charcoal Black Trouser - Hem & Pleat Detail",
        },
      ],
    },
    {
      name: "Deep Navy",
      hex: "#151F33",
      thumbnail:
        "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=400&q=80",
      images: [
        {
          id: "pt-nvy-1",
          url: "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=1000&q=80",
          alt_text: "Deep Navy Trouser - Architectural Pleats",
        },
        {
          id: "pt-nvy-2",
          url: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=80",
          alt_text: "Deep Navy Trouser - Side Profile",
        },
      ],
    },
    {
      name: "Khaki Beige",
      hex: "#CBB994",
      thumbnail:
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=400&q=80",
      images: [
        {
          id: "pt-khi-1",
          url: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=1000&q=80",
          alt_text: "Khaki Beige Chino - Tailored Fit",
        },
        {
          id: "pt-khi-2",
          url: "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=1000&q=80",
          alt_text: "Khaki Beige Chino - Fabric Texture",
        },
      ],
    },
    {
      name: "Slate Grey",
      hex: "#464E5B",
      thumbnail:
        "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=400&q=80",
      images: [
        {
          id: "pt-gry-1",
          url: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=1000&q=80",
          alt_text: "Slate Grey Trouser - Clean Ankle Cut",
        },
        {
          id: "pt-gry-2",
          url: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=80",
          alt_text: "Slate Grey Trouser - Pocket Detailing",
        },
      ],
    },
  ],

  "t-shirts": [
    {
      name: "Jet Black",
      hex: "#101114",
      thumbnail:
        "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=400&q=80",
      images: [
        {
          id: "ts-blk-1",
          url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80",
          alt_text: "Jet Black Tee - Front Drape",
        },
        {
          id: "ts-blk-2",
          url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80",
          alt_text: "Jet Black Tee - Heavyweight Cotton Rib",
        },
      ],
    },
    {
      name: "Pure White",
      hex: "#FAF9F6",
      thumbnail:
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80",
      images: [
        {
          id: "ts-wht-1",
          url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80",
          alt_text: "Pure White Tee - Front View",
        },
        {
          id: "ts-wht-2",
          url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80",
          alt_text: "Pure White Tee - Dropped Shoulder Cut",
        },
      ],
    },
    {
      name: "Heather Grey",
      hex: "#636B78",
      thumbnail:
        "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=400&q=80",
      images: [
        {
          id: "ts-gry-1",
          url: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1000&q=80",
          alt_text: "Heather Grey Tee - Oversized Silhouette",
        },
      ],
    },
    {
      name: "Sage Olive",
      hex: "#455243",
      thumbnail:
        "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=400&q=80",
      images: [
        {
          id: "ts-olv-1",
          url: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=1000&q=80",
          alt_text: "Sage Olive Tee - Front Perspective",
        },
      ],
    },
  ],

  lowers: [
    {
      name: "Obsidian Black",
      hex: "#131418",
      thumbnail:
        "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=400&q=80",
      images: [
        {
          id: "lw-blk-1",
          url: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=1000&q=80",
          alt_text: "Obsidian Black Lower - Front View",
        },
        {
          id: "lw-blk-2",
          url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80",
          alt_text: "Obsidian Black Lower - Ankle Cuff",
        },
      ],
    },
    {
      name: "Deep Navy",
      hex: "#1C2638",
      thumbnail:
        "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80",
      images: [
        {
          id: "lw-nvy-1",
          url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80",
          alt_text: "Deep Navy Track Lower - Front Drape",
        },
      ],
    },
    {
      name: "Charcoal Heather",
      hex: "#383E4C",
      thumbnail:
        "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=400&q=80",
      images: [
        {
          id: "lw-gry-1",
          url: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1000&q=80",
          alt_text: "Charcoal Heather Lower - Side Profile",
        },
      ],
    },
  ],

  shorts: [
    {
      name: "Jet Black",
      hex: "#121316",
      thumbnail:
        "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=400&q=80",
      images: [
        {
          id: "sh-blk-1",
          url: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=1000&q=80",
          alt_text: "Jet Black Short - Front View",
        },
      ],
    },
    {
      name: "Cobalt Navy",
      hex: "#1E2C48",
      thumbnail:
        "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=80",
      images: [
        {
          id: "sh-nvy-1",
          url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=80",
          alt_text: "Cobalt Navy Short - Athletic Fit",
        },
      ],
    },
    {
      name: "Desert Khaki",
      hex: "#C1AA85",
      thumbnail:
        "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=400&q=80",
      images: [
        {
          id: "sh-khi-1",
          url: "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=1000&q=80",
          alt_text: "Desert Khaki Bermuda Short",
        },
      ],
    },
  ],
};

/**
 * Returns available color swatches for any product based on:
 * 1. Product's backend variants (if admin configured custom colors).
 * 2. Fallback category colorway suite (for shirts, pants, etc. in preview/catalog).
 */
export function getProductColorSwatches(
  categorySlug?: string,
  variantColors?: string[],
  baseImages?: Array<{ id: string; url: string; alt_text?: string | null }>
): ColorSwatchItem[] {
  const cleanCat = (categorySlug || "shirts").toLowerCase().trim();
  const categorySuite = CATEGORY_COLOR_GALLERIES[cleanCat] || CATEGORY_COLOR_GALLERIES.shirts;

  // Case 1: Backend product has multiple explicit variant colors
  if (variantColors && variantColors.length > 1) {
    const distinctColors = Array.from(new Set(variantColors));
    const mapped = distinctColors.map((color) => {
      const matched = categorySuite.find(
        (c) =>
          c.name.toLowerCase() === color.toLowerCase() ||
          c.name.toLowerCase().includes(color.toLowerCase()) ||
          color.toLowerCase().includes(c.name.toLowerCase())
      );
      if (matched) return matched;
      return {
        name: color,
        hex: getColorHex(color),
        thumbnail: baseImages?.[0]?.url || categorySuite[0].thumbnail,
        images: baseImages && baseImages.length > 0 ? (baseImages as any) : categorySuite[0].images,
      };
    });

    if (mapped.length > 1) {
      return mapped;
    }
  }

  // Case 2: Single or default color specified - feature that primary color and blend with category suite so customers can always explore and switch colors inside the product page
  if (variantColors && variantColors.length === 1) {
    const singleColor = variantColors[0];
    const existingInSuite = categorySuite.find(
      (c) => c.name.toLowerCase() === singleColor.toLowerCase()
    );

    if (existingInSuite) {
      const others = categorySuite.filter(
        (c) => c.name.toLowerCase() !== singleColor.toLowerCase()
      );
      return [existingInSuite, ...others];
    } else {
      const customPrimary: ColorSwatchItem = {
        name: singleColor,
        hex: getColorHex(singleColor),
        thumbnail: baseImages?.[0]?.url || categorySuite[0].thumbnail,
        images:
          baseImages && baseImages.length > 0
            ? (baseImages as any)
            : categorySuite[0].images,
      };
      return [customPrimary, ...categorySuite];
    }
  }

  // Case 3: Catalog preset suite (gives full Amazon-style multi-color view for all shirts/pants/etc.)
  return categorySuite;
}
