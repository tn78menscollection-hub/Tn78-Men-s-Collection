"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ProductImageDto } from "@/lib/api";

export interface GalleryImageItem {
  id?: string;
  url: string;
  display_order?: number;
  alt_text?: string | null;
}

interface ProductGalleryProps {
  images?: GalleryImageItem[];
  productName: string;
  className?: string;
}

const DEFAULT_EDITORIAL_IMAGES = [
  { id: "def-1", url: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=1000&q=80", alt_text: "Front Perspective" },
  { id: "def-2", url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80", alt_text: "Profile Perspective" },
  { id: "def-3", url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80", alt_text: "Fabric & Horn Fastener Detail" },
  { id: "def-4", url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80", alt_text: "Silhouette Overview" },
];

export function ProductGallery({
  images = [],
  productName,
  className = "",
}: ProductGalleryProps) {
  const validImages = images.filter((img) => img?.url && !img.url.startsWith("/images/products/"));
  const displayImages = validImages.length > 0 ? validImages : DEFAULT_EDITORIAL_IMAGES;

  const [activeIndex, setActiveIndex] = useState(0);

  // Reset to first perspective when image suite changes (e.g. color switch)
  const firstImageUrl = displayImages[0]?.url;
  React.useEffect(() => {
    setActiveIndex(0);
  }, [firstImageUrl]);

  const activeImage = displayImages[activeIndex] || displayImages[0];

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Main Large Image Stage */}
      <div className="relative aspect-[3/4] w-full bg-[#13151C] overflow-hidden border border-[#232733]/90 shadow-2xl rounded-2xl group/stage">
        {/* View Index Badge */}
        <span className="absolute top-4 left-4 z-20 font-mono text-[10px] tracking-widest text-[#E2C58A] bg-[#0A0B0E]/85 backdrop-blur-md px-3 py-1 border border-[#232733] uppercase font-bold shadow-xs rounded-full">
          0{activeIndex + 1} / 0{displayImages.length}
        </span>

        {activeImage?.url ? (
          <Image
            src={activeImage.url}
            alt={activeImage.alt_text || productName}
            fill
            priority
            unoptimized
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover object-top transition-transform duration-700 hover:scale-105"
          />
        ) : null}
      </div>

      {/* Thumbnail Bar */}
      {displayImages.length > 1 && (
        <div className="mt-4 grid grid-cols-4 sm:grid-cols-5 gap-3">
          {displayImages.map((img, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={img.id || idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`relative aspect-[3/4] bg-[#13151C] overflow-hidden border transition-all rounded-xl cursor-pointer ${
                  isActive
                    ? "border-[#E2C58A] ring-2 ring-[#E2C58A]/40 shadow-glow-gold opacity-100"
                    : "border-[#232733] opacity-60 hover:opacity-100 hover:border-slate-500"
                }`}
                aria-label={`Switch to perspective ${idx + 1}`}
              >
                {img.url ? (
                  <Image
                    src={img.url}
                    alt={img.alt_text || `Perspective ${idx + 1}`}
                    fill
                    unoptimized
                    sizes="100px"
                    className="object-cover object-top"
                  />
                ) : null}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
