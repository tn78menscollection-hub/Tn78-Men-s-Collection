"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  adminCreateProduct,
  adminGetCategories,
  CategoryDto,
  getStoredAuthToken,
} from "@/lib/api";

interface VariantFormRow {
  size: string;
  color: string;
  sku: string;
  price_override: string;
  mrp_override: string;
  initial_stock: number;
}

interface ImageFormRow {
  url: string;
  alt_text: string;
  display_order: number;
  fileName?: string;
}

export default function AdminNewProductPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [mrp, setMrp] = useState("");
  const [gstRate, setGstRate] = useState("12");
  const [hsnCode, setHsnCode] = useState("6203");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [variants, setVariants] = useState<VariantFormRow[]>([
    { size: "M", color: "Black", sku: "", price_override: "", mrp_override: "", initial_stock: 10 },
    { size: "L", color: "Black", sku: "", price_override: "", mrp_override: "", initial_stock: 10 },
  ]);

  const [images, setImages] = useState<ImageFormRow[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminGetCategories()
      .then((cats) => {
        setCategories(cats);
        if (cats.length > 0) setCategoryId(cats[0].id);
      })
      .catch(() => setError("Failed to load catalog categories"));
  }, []);

  const handleAddVariant = (customSize: string = "M", customColor: string = "Black") => {
    setVariants((prev) => [
      ...prev,
      { size: customSize, color: customColor, sku: "", price_override: "", mrp_override: "", initial_stock: 10 },
    ]);
  };

  const handleApplyPresetSizes = (presetSizes: string[]) => {
    const currentColor = variants[0]?.color || "Black";
    const newVariants: VariantFormRow[] = presetSizes.map((sz) => ({
      size: sz,
      color: currentColor,
      sku: "",
      price_override: "",
      mrp_override: "",
      initial_stock: 10,
    }));
    setVariants(newVariants);
  };

  const handleApplyFreeSize = () => {
    const currentColor = variants[0]?.color || "Standard";
    setVariants([
      {
        size: "Free Size",
        color: currentColor,
        sku: "",
        price_override: "",
        mrp_override: "",
        initial_stock: 25,
      },
    ]);
  };

  const handleAddMultiColorPreset = () => {
    const presetColors = ["Midnight Black", "Navy Blue", "Olive Green", "Crisp White"];
    const currentSizes = Array.from(new Set(variants.map((v) => v.size))).filter(Boolean);
    const sizesToUse = currentSizes.length > 0 ? currentSizes : ["S", "M", "L", "XL"];
    const newVariants: VariantFormRow[] = [];
    presetColors.forEach((color) => {
      sizesToUse.forEach((size) => {
        newVariants.push({
          size,
          color,
          sku: "",
          price_override: "",
          mrp_override: "",
          initial_stock: 15,
        });
      });
    });
    setVariants(newVariants);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  // Device file upload handler
  const handleFileUpload = async (fileList: FileList | File[]) => {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      for (let i = 0; i < fileList.length; i++) {
        formData.append("files", fileList[i]);
      }

      const token = getStoredAuthToken();
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: token && token !== "cookie_session" ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || "Failed to upload image(s) from device.");
      }

      const data = await res.json();
      if (data.files && Array.isArray(data.files)) {
        const newItems: ImageFormRow[] = data.files.map(
          (f: { url: string; altText?: string; filename?: string }, idx: number) => ({
            url: f.url,
            alt_text: f.altText || `${name || "Garment"} visual`,
            display_order: images.length + idx,
            fileName: f.filename,
          })
        );
        setImages((prev) => [...prev, ...newItems]);
      }
    } catch (err: unknown) {
      console.error("Device image upload failed:", err);
      const message = err instanceof Error ? err.message : "Failed to upload images.";
      setUploadError(message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleAddImageUrl = () => {
    setImages((prev) => [
      ...prev,
      { url: "", alt_text: "", display_order: prev.length },
    ]);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index).map((img, i) => ({ ...img, display_order: i })));
  };

  const handleSetPrimary = (index: number) => {
    if (index === 0) return;
    setImages((prev) => {
      const selected = prev[index];
      const rest = prev.filter((_, i) => i !== index);
      return [selected, ...rest].map((item, i) => ({ ...item, display_order: i }));
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!categoryId) {
        throw new Error("Please select a category.");
      }
      if (variants.length === 0) {
        throw new Error("At least one product variant is required.");
      }

      // Auto-generate SKUs if blank
      const cleanVariants = variants.map((v, i) => {
        const autoSku = v.sku.trim()
          ? v.sku.trim()
          : `TN78-${name.substring(0, 3).toUpperCase()}-${v.size}-${v.color.substring(0, 3).toUpperCase()}-${i + 1}`;
        return {
          size: v.size.trim(),
          color: v.color.trim(),
          sku: autoSku,
          price_override: v.price_override ? parseFloat(v.price_override) : undefined,
          mrp_override: v.mrp_override ? parseFloat(v.mrp_override) : undefined,
          initial_stock: Number(v.initial_stock) || 0,
        };
      });

      const cleanImages = images
        .filter((img) => img.url.trim().length > 0)
        .map((img, i) => ({
          url: img.url.trim(),
          alt_text: img.alt_text.trim() || undefined,
          display_order: Number(img.display_order) || i,
        }));

      await adminCreateProduct({
        name: name.trim(),
        slug: slug.trim() || undefined,
        category_id: categoryId,
        base_price: parseFloat(basePrice),
        mrp: mrp ? parseFloat(mrp) : undefined,
        gst_rate: gstRate ? parseFloat(gstRate) : 12.0,
        hsn_code: hsnCode.trim() || "6203",
        description: description.trim() || undefined,
        is_active: isActive,
        variants: cleanVariants,
        images: cleanImages,
      });

      router.push("/admin/products");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create garment";
      setError(message);
      setLoading(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 lg:p-10 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-[#EFECE6] pb-6">
        <Link
          href="/admin/products"
          className="text-[#9E6544] hover:underline font-mono text-[11px] uppercase tracking-wider mb-2 inline-block font-semibold"
        >
          ← Back to Garment Catalog
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
          <div>
            <span className="text-[10px] font-heading font-extrabold uppercase tracking-widest text-[#9E6544]">
              Garment Curation &bull; Store Inventory
            </span>
            <h1 className="font-heading text-2xl sm:text-3xl font-black uppercase tracking-wider text-[#1A1816] mt-1">
              Add New Garment
            </h1>
          </div>
          <p className="text-xs text-[#78716C] font-body">
            Configure luxury specs, pricing, MRP strike-through, and variants.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Core Garment Specifications */}
        <div className="bg-white border border-[#EFECE6] rounded-2xl shadow-sm p-6 sm:p-8 space-y-6">
          <div className="border-b border-[#EFECE6] pb-3 flex items-center justify-between">
            <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-[#1A1816]">
              1. Core Silhouette &amp; Identification
            </h2>
            <span className="text-[10px] font-mono text-[#78716C] uppercase tracking-widest">
              Required Fields *
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#78716C] font-bold mb-1.5">
                Garment Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. The Architectural Poplin Shirt"
                className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-xl px-4 py-2.5 text-xs text-[#1A1816] placeholder-[#A8A29E] focus:outline-none focus:border-[#9E6544] focus:ring-1 focus:ring-[#9E6544]/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#78716C] font-bold mb-1.5">
                URL Identifier / Slug (Optional)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="auto-generated-from-name"
                className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-xl px-4 py-2.5 text-xs text-[#1A1816] placeholder-[#A8A29E] focus:outline-none focus:border-[#9E6544] font-mono focus:ring-1 focus:ring-[#9E6544]/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#78716C] font-bold mb-1.5">
                Collection / Category *
              </label>
              <select
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-xl px-4 py-2.5 text-xs text-[#1A1816] focus:outline-none focus:border-[#9E6544] focus:ring-1 focus:ring-[#9E6544]/20 transition-all"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#78716C] font-bold mb-1.5">
                Base Selling Price (₹) *
              </label>
              <input
                type="number"
                required
                step="0.01"
                min="1"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                placeholder="4200.00"
                className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-xl px-4 py-2.5 text-xs text-[#1A1816] placeholder-[#A8A29E] focus:outline-none focus:border-[#9E6544] focus:ring-1 focus:ring-[#9E6544]/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#78716C] font-bold mb-1.5">
                Max Retail Price / MRP Strike-through (₹) (Optional)
              </label>
              <input
                type="number"
                step="0.01"
                min="1"
                value={mrp}
                onChange={(e) => setMrp(e.target.value)}
                placeholder="e.g. 5990.00 (Shown with strike-through)"
                className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-xl px-4 py-2.5 text-xs text-[#1A1816] placeholder-[#A8A29E] focus:outline-none focus:border-[#9E6544] focus:ring-1 focus:ring-[#9E6544]/20 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#78716C] font-bold mb-1.5">
                  GST Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={gstRate}
                  onChange={(e) => setGstRate(e.target.value)}
                  placeholder="12.0"
                  className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-xl px-4 py-2.5 text-xs text-[#1A1816] focus:outline-none focus:border-[#9E6544] focus:ring-1 focus:ring-[#9E6544]/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#78716C] font-bold mb-1.5">
                  HSN Code
                </label>
                <input
                  type="text"
                  value={hsnCode}
                  onChange={(e) => setHsnCode(e.target.value)}
                  placeholder="6203"
                  className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-xl px-4 py-2.5 text-xs text-[#1A1816] focus:outline-none focus:border-[#9E6544] font-mono focus:ring-1 focus:ring-[#9E6544]/20 transition-all"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#78716C] font-bold mb-1.5">
              Editorial Craftsmanship Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Architectural silhouette tailored in structured cotton poplin with concealed placket and French seams..."
              className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-xl px-4 py-2.5 text-xs text-[#1A1816] placeholder-[#A8A29E] focus:outline-none focus:border-[#9E6544] focus:ring-1 focus:ring-[#9E6544]/20 transition-all"
            />
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded text-[#9E6544] focus:ring-[#9E6544] accent-[#9E6544] cursor-pointer"
            />
            <label
              htmlFor="isActive"
              className="text-xs font-heading uppercase tracking-wider text-[#1A1816] cursor-pointer font-bold"
            >
              Immediately publish to customer storefront (Active)
            </label>
          </div>
        </div>

        {/* Section 2: Product Variants & Initial Stock */}
        <div className="bg-white border border-[#EFECE6] rounded-2xl shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-[#EFECE6] pb-3">
            <div>
              <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-[#1A1816]">
                2. Sizing, Colors &amp; Inventory Stock
              </h2>
              <p className="text-[11px] text-[#78716C] mt-0.5">
                Add size-color combinations with independent SKUs and initial warehouse quantities.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleApplyPresetSizes(["S", "M", "L", "XL", "XXL"])}
                className="text-[11px] font-heading text-[#9E6544] hover:text-[#7D4E33] bg-[#FAF8F5] border border-[#EFECE6] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full transition-colors cursor-pointer"
                title="Set standard clothing sizes S, M, L, XL, XXL"
              >
                + S–XXL Standard
              </button>
              <button
                type="button"
                onClick={() => handleApplyPresetSizes(["28", "30", "32", "34", "36", "38"])}
                className="text-[11px] font-heading text-[#9E6544] hover:text-[#7D4E33] bg-[#FAF8F5] border border-[#EFECE6] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full transition-colors cursor-pointer"
                title="Set trouser/waist sizes 28 to 38"
              >
                + Trousers (28–38)
              </button>
              <button
                type="button"
                onClick={handleApplyFreeSize}
                className="text-[11px] font-heading text-purple-800 hover:text-purple-900 bg-purple-50 border border-purple-300 font-bold uppercase tracking-wider px-3 py-1.5 rounded-full transition-colors cursor-pointer"
                title="For accessories, perfumes, bags, or items without size requirements"
              >
                + Free Size (No Sizes)
              </button>
              <button
                type="button"
                onClick={handleAddMultiColorPreset}
                className="text-[11px] font-heading text-emerald-800 hover:text-emerald-900 bg-emerald-50 border border-emerald-300 font-bold uppercase tracking-wider px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 cursor-pointer"
                title="Populate sizes for Black, Navy, Olive, and White"
              >
                <span>🎨</span> + Multi-Color
              </button>
              <button
                type="button"
                onClick={() => handleAddVariant("M", "Black")}
                className="text-xs font-heading text-white bg-[#9E6544] hover:bg-[#7D4E33] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full transition-colors cursor-pointer shadow-xs"
              >
                + Add Variant Row
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {variants.map((v, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-4 bg-[#FAF8F5] border border-[#EFECE6] rounded-xl items-end"
              >
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-[#78716C] font-bold mb-1">
                    Size
                  </label>
                  <input
                    type="text"
                    required
                    value={v.size}
                    onChange={(e) => {
                      const val = e.target.value;
                      setVariants((prev) =>
                        prev.map((row, i) => (i === idx ? { ...row, size: val } : row))
                      );
                    }}
                    placeholder="S, M, L, 32"
                    className="w-full bg-white border border-[#EFECE6] rounded-lg px-3 py-1.5 text-xs text-[#1A1816] focus:outline-none focus:border-[#9E6544]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-[#78716C] font-bold mb-1">
                    Color
                  </label>
                  <input
                    type="text"
                    required
                    value={v.color}
                    onChange={(e) => {
                      const val = e.target.value;
                      setVariants((prev) =>
                        prev.map((row, i) => (i === idx ? { ...row, color: val } : row))
                      );
                    }}
                    placeholder="Midnight Black"
                    className="w-full bg-white border border-[#EFECE6] rounded-lg px-3 py-1.5 text-xs text-[#1A1816] focus:outline-none focus:border-[#9E6544]"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-[#78716C] font-bold mb-1">
                    SKU (Optional)
                  </label>
                  <input
                    type="text"
                    value={v.sku}
                    onChange={(e) => {
                      const val = e.target.value;
                      setVariants((prev) =>
                        prev.map((row, i) => (i === idx ? { ...row, sku: val } : row))
                      );
                    }}
                    placeholder="Auto-generated"
                    className="w-full bg-white border border-[#EFECE6] rounded-lg px-3 py-1.5 text-xs text-[#1A1816] font-mono focus:outline-none focus:border-[#9E6544]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-[#78716C] font-bold mb-1">
                    Initial Units
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={v.initial_stock}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10) || 0;
                      setVariants((prev) =>
                        prev.map((row, i) => (i === idx ? { ...row, initial_stock: val } : row))
                      );
                    }}
                    className="w-full bg-white border border-[#EFECE6] rounded-lg px-3 py-1.5 text-xs text-[#1A1816] font-bold focus:outline-none focus:border-[#9E6544]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-[#78716C] font-bold mb-1">
                    Price Over (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={v.price_override}
                    onChange={(e) => {
                      const val = e.target.value;
                      setVariants((prev) =>
                        prev.map((row, i) => (i === idx ? { ...row, price_override: val } : row))
                      );
                    }}
                    placeholder="Base price"
                    className="w-full bg-white border border-[#EFECE6] rounded-lg px-3 py-1.5 text-xs text-[#1A1816] focus:outline-none focus:border-[#9E6544]"
                  />
                </div>

                <div className="sm:col-span-1 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => handleRemoveVariant(idx)}
                    disabled={variants.length <= 1}
                    className="text-rose-600 hover:text-rose-800 text-[10px] font-mono font-bold uppercase tracking-wider disabled:opacity-30 p-1.5"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Product Imagery */}
        <div className="bg-white border border-[#EFECE6] rounded-2xl shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[#EFECE6] pb-4 gap-3">
            <div>
              <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-[#1A1816]">
                3. Garment Imagery &amp; Photography
              </h2>
              <p className="text-[11px] text-[#78716C] mt-0.5">
                Upload photos directly from your device (PC/Mobile) or optionally provide external URLs. First image is the primary studio card visual.
              </p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                accept="image/png,image/jpeg,image/webp,image/avif,image/gif"
                multiple
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="text-xs font-heading text-white bg-[#9E6544] hover:bg-[#7D4E33] font-bold uppercase tracking-wider px-4 py-2 rounded-full shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                {uploading ? "Uploading..." : "+ Upload from Device"}
              </button>
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="text-xs font-heading text-[#9E6544] hover:text-[#7D4E33] font-bold uppercase tracking-wider bg-[#FAF8F5] border border-[#EFECE6] px-3.5 py-2 rounded-full transition-colors"
              >
                + Add URL
              </button>
            </div>
          </div>

          {/* Drag and Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 ${
              dragActive
                ? "border-[#9E6544] bg-[#9E6544]/5 scale-[1.005]"
                : "border-[#EFECE6] hover:border-[#9E6544]/50 bg-[#FAF8F5]/60 hover:bg-[#FAF8F5]"
            }`}
          >
            {uploading ? (
              <div className="flex flex-col items-center justify-center py-4 space-y-3">
                <div className="w-8 h-8 border-2 border-[#9E6544] border-t-transparent rounded-full animate-spin" />
                <p className="font-heading text-xs font-bold uppercase tracking-wider text-[#1A1816]">
                  Uploading photos from your device...
                </p>
                <p className="text-[11px] text-[#78716C] font-mono">Saving files to local server media storage</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-white border border-[#EFECE6] flex items-center justify-center text-[#9E6544] shadow-xs">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-heading font-bold text-[#1A1816]">
                    <span className="text-[#9E6544] underline underline-offset-2">Click to upload from device</span> or drag &amp; drop photos here
                  </p>
                  <p className="text-[11px] text-[#78716C] mt-1 font-mono">
                    Supports JPG, PNG, WEBP, AVIF (Multiple files supported &bull; URL is completely optional)
                  </p>
                </div>
              </div>
            )}
          </div>

          {uploadError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center justify-between">
              <span>⚠️ {uploadError}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setUploadError(null);
                }}
                className="text-rose-500 hover:text-rose-700 font-bold ml-2 p-1"
              >
                ✕
              </button>
            </div>
          )}

          {/* Image Rows List */}
          {images.length === 0 ? (
            <div className="text-center py-3 text-[11px] font-mono text-[#A8A29E] bg-[#FAF8F5] rounded-xl border border-dashed border-[#EFECE6]">
              No images added yet. Click &ldquo;+ Upload from Device&rdquo; or drag photos above. Adding images is optional.
            </div>
          ) : (
            <div className="space-y-3">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className={`grid grid-cols-1 sm:grid-cols-12 gap-3 p-4 bg-[#FAF8F5] border rounded-xl items-center transition-all ${
                    idx === 0 ? "border-[#9E6544]/50 shadow-xs" : "border-[#EFECE6]"
                  }`}
                >
                  {/* Preview Thumbnail & Primary Indicator */}
                  <div className="sm:col-span-2 flex items-center space-x-3">
                    <div className="relative w-14 h-16 bg-white border border-[#EFECE6] rounded-lg overflow-hidden flex items-center justify-center shrink-0 shadow-xs">
                      {img.url ? (
                        <img
                          src={img.url}
                          alt={img.alt_text || "Preview"}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <span className="text-[10px] text-[#A8A29E] font-mono font-bold">#{idx + 1}</span>
                      )}
                      {idx === 0 && (
                        <span className="absolute bottom-0 inset-x-0 bg-[#9E6544] text-[8px] font-mono text-white text-center font-bold py-0.5 uppercase tracking-wider">
                          Primary
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-mono font-bold text-[#1A1816]">
                        {idx === 0 ? "★ Primary" : `#${idx + 1}`}
                      </span>
                      {idx > 0 && (
                        <button
                          type="button"
                          onClick={() => handleSetPrimary(idx)}
                          className="text-[10px] font-heading uppercase tracking-wider text-[#9E6544] hover:underline text-left font-bold"
                        >
                          Set Primary
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Image URL / Local Path (Optional) */}
                  <div className="sm:col-span-5">
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-[#78716C] font-bold mb-1">
                      Image URL / Path <span className="text-[#A8A29E] font-normal lowercase">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={img.url}
                      onChange={(e) => {
                        const val = e.target.value;
                        setImages((prev) =>
                          prev.map((row, i) => (i === idx ? { ...row, url: val } : row))
                        );
                      }}
                      placeholder="/images/products/... or https://..."
                      className="w-full bg-white border border-[#EFECE6] rounded-lg px-3 py-2 text-xs font-mono text-[#1A1816] focus:outline-none focus:border-[#9E6544]"
                    />
                  </div>

                  {/* Alt Text (Optional) */}
                  <div className="sm:col-span-4">
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-[#78716C] font-bold mb-1">
                      Alt Text (Accessibility)
                    </label>
                    <input
                      type="text"
                      value={img.alt_text}
                      onChange={(e) => {
                        const val = e.target.value;
                        setImages((prev) =>
                          prev.map((row, i) => (i === idx ? { ...row, alt_text: val } : row))
                        );
                      }}
                      placeholder="Front angle model view"
                      className="w-full bg-white border border-[#EFECE6] rounded-lg px-3 py-2 text-xs text-[#1A1816] focus:outline-none focus:border-[#9E6544]"
                    />
                  </div>

                  {/* Delete */}
                  <div className="sm:col-span-1 flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      title="Delete image"
                      className="text-rose-600 hover:text-rose-800 text-[10px] font-mono font-bold uppercase tracking-wider p-2 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4 pt-4 border-t border-[#EFECE6]">
          <Link
            href="/admin/products"
            className="px-6 py-2.5 text-xs font-heading font-bold uppercase tracking-wider text-[#78716C] hover:text-[#1A1816] transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#D5C0A5] hover:bg-[#C4AC8F] text-[#1A1816] px-8 py-3 text-xs font-heading font-black uppercase tracking-widest rounded-full shadow-sm transition-all disabled:opacity-50"
          >
            {loading ? "Publishing Garment..." : "Create & Publish Garment"}
          </button>
        </div>
      </form>
    </div>
  );
}
