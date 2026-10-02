"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  adminGetCategories,
  adminGetProduct,
  adminUpdateProduct,
  AdminProduct,
  CategoryDto,
  getStoredAuthToken,
} from "@/lib/api";
import { getMediaAssets, updateProductImageOverride } from "@/lib/mediaAssets";
import { PRODUCT_IMAGE_MAP } from "@/lib/productImages";

interface EditProductPageProps {
  params: {
    id: string;
  };
}

interface VariantFormRow {
  size: string;
  color: string;
  sku: string;
  price_override: string;
  mrp_override: string;
  initial_stock: number;
}

export default function AdminEditProductPage({ params }: EditProductPageProps) {
  const router = useRouter();
  const productId = params.id;

  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [product, setProduct] = useState<AdminProduct | null>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [mrp, setMrp] = useState("");
  const [gstRate, setGstRate] = useState("12");
  const [hsnCode, setHsnCode] = useState("6203");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Variants & Sizing states
  const [variants, setVariants] = useState<VariantFormRow[]>([]);

  // Garment imagery states
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [cats, prod] = await Promise.all([
          adminGetCategories(),
          adminGetProduct(productId),
        ]);
        setCategories(cats);
        setProduct(prod);

        setName(prod.name);
        setSlug(prod.slug);
        setCategoryId(prod.category_id);
        setBasePrice(prod.base_price.toString());
        setMrp(prod.mrp ? prod.mrp.toString() : "");
        setGstRate(prod.gst_rate !== undefined ? prod.gst_rate.toString() : "12");
        setHsnCode(prod.hsn_code || "6203");
        setDescription(prod.description || "");
        setIsActive(prod.is_active);

        // Populate variants
        if (prod.variants && prod.variants.length > 0) {
          setVariants(
            prod.variants.map((v) => ({
              size: v.size,
              color: v.color,
              sku: v.sku,
              price_override: v.price_override ? v.price_override.toString() : "",
              mrp_override: v.mrp_override ? v.mrp_override.toString() : "",
              initial_stock: v.stock_quantity ?? 0,
            }))
          );
        } else {
          setVariants([
            { size: "Free Size", color: "Standard", sku: "", price_override: "", mrp_override: "", initial_stock: 10 },
          ]);
        }

        // Load images from custom media overrides or API
        const overrides = getMediaAssets().productOverrides;
        const initialImages = overrides[prod.slug]?.length
          ? overrides[prod.slug]
          : prod.images?.map((im) => im.url) || [];
        if (initialImages.length > 0) {
          setImages(initialImages);
        } else if (PRODUCT_IMAGE_MAP[prod.slug]) {
          setImages([PRODUCT_IMAGE_MAP[prod.slug]]);
        } else {
          setImages([]);
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to load garment details";
        setError(message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [productId]);

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingImage(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", files[0]);
      const token = getStoredAuthToken();
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: token && token !== "cookie_session" ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed. Please check image format.");
      const data = await res.json();
      if (data.files && data.files[0]?.url) {
        const uploadedUrl = data.files[0].url;
        const updated = [...images, uploadedUrl];
        setImages(updated);
        updateProductImageOverride(slug.trim() || product?.slug || productId, updated);
        setMessage("Product photo uploaded & saved!");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to upload image file";
      setError(message);
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleAddUrl = () => {
    if (!newImageUrl.trim()) return;
    const url = newImageUrl.trim();
    const updated = [...images, url];
    setImages(updated);
    updateProductImageOverride(slug.trim() || product?.slug || productId, updated);
    setNewImageUrl("");
    setMessage("Image URL added to product gallery!");
  };

  const handleRemoveImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    updateProductImageOverride(slug.trim() || product?.slug || productId, updated);
    setMessage("Image removed from gallery.");
  };

  const handleSetPrimary = (index: number) => {
    if (index === 0) return;
    const item = images[index];
    const updated = [item, ...images.filter((_, i) => i !== index)];
    setImages(updated);
    updateProductImageOverride(slug.trim() || product?.slug || productId, updated);
    setMessage("Primary display photo updated!");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setSaving(true);

    try {
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

      const updated = await adminUpdateProduct(productId, {
        name: name.trim(),
        slug: slug.trim() || undefined,
        category_id: categoryId,
        base_price: parseFloat(basePrice),
        mrp: mrp ? parseFloat(mrp) : undefined,
        gst_rate: gstRate ? parseFloat(gstRate) : 12.0,
        hsn_code: hsnCode.trim() || "6203",
        description: description.trim() || undefined,
        is_active: isActive,
        variants: cleanVariants.length > 0 ? cleanVariants : undefined,
      });

      // Save image overrides under updated slug and id
      updateProductImageOverride(slug.trim() || updated.slug, images);

      setProduct(updated);
      setMessage("Garment specifications and photography updated successfully!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update garment";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 max-w-4xl mx-auto text-center text-[#78716C] font-mono text-xs uppercase tracking-widest">
        Loading garment specifications...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-12 max-w-4xl mx-auto text-center space-y-4">
        <p className="text-sm font-heading font-bold text-[#1A1816]">Garment not found in catalog.</p>
        <Link
          href="/admin/products"
          className="text-[#9E6544] underline font-mono text-xs uppercase tracking-wider inline-block"
        >
          Return to Garments
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 lg:p-10 max-w-4xl mx-auto space-y-8">
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
              Catalog Curation &bull; SKU Specification
            </span>
            <h1 className="font-heading text-2xl sm:text-3xl font-black uppercase tracking-wider text-[#1A1816] mt-1">
              Edit Garment: {product.name}
            </h1>
          </div>
          <div className="font-mono text-xs text-[#78716C]">
            ID: <span className="text-[#1A1816] font-bold">{productId.slice(0, 8)}...</span>
          </div>
        </div>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl">
          ✓ {message}
        </div>
      )}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Core Specifications */}
        <div className="bg-white border border-[#EFECE6] rounded-2xl shadow-sm p-6 sm:p-8 space-y-6">
          <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-[#1A1816] border-b border-[#EFECE6] pb-3">
            Core Specifications &amp; Pricing
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#78716C] font-bold mb-1.5">
                Garment Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-xl px-4 py-2.5 text-xs text-[#1A1816] focus:outline-none focus:border-[#9E6544] focus:ring-1 focus:ring-[#9E6544]/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#78716C] font-bold mb-1.5">
                Slug (URL Identifier)
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-xl px-4 py-2.5 text-xs text-[#1A1816] focus:outline-none focus:border-[#9E6544] font-mono focus:ring-1 focus:ring-[#9E6544]/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#78716C] font-bold mb-1.5">
                Collection / Category
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
                Base Selling Price (₹)
              </label>
              <input
                type="number"
                required
                step="0.01"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-xl px-4 py-2.5 text-xs text-[#1A1816] focus:outline-none focus:border-[#9E6544] focus:ring-1 focus:ring-[#9E6544]/20 transition-all font-bold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#78716C] font-bold mb-1.5">
                MRP Strike-through (₹) (Optional)
              </label>
              <input
                type="number"
                step="0.01"
                value={mrp}
                onChange={(e) => setMrp(e.target.value)}
                placeholder="e.g. 5990.00"
                className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-xl px-4 py-2.5 text-xs text-[#1A1816] focus:outline-none focus:border-[#9E6544] focus:ring-1 focus:ring-[#9E6544]/20 transition-all"
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
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-xl px-4 py-2.5 text-xs text-[#1A1816] focus:outline-none focus:border-[#9E6544] focus:ring-1 focus:ring-[#9E6544]/20 transition-all"
            />
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <input
              type="checkbox"
              id="isActiveEdit"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded text-[#9E6544] focus:ring-[#9E6544] accent-[#9E6544] cursor-pointer"
            />
            <label
              htmlFor="isActiveEdit"
              className="text-xs font-heading uppercase tracking-wider text-[#1A1816] cursor-pointer font-bold"
            >
              Active on Customer Storefront (Uncheck to archive/soft-delete)
            </label>
          </div>
        </div>

        {/* Garment Imagery & Editorial Photography */}
        <div className="bg-white border border-[#EFECE6] rounded-2xl shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[#EFECE6] pb-3 gap-2">
            <div>
              <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-[#1A1816]">
                Garment Imagery &amp; Editorial Photography
              </h2>
              <p className="text-[11px] text-[#78716C] mt-0.5">
                Upload lookbook photos or attach high-res URLs. The first photo serves as the main storefront thumbnail.
              </p>
            </div>
            <Link
              href="/admin/media"
              className="text-xs font-heading text-[#9E6544] hover:text-[#7D4E33] font-bold uppercase tracking-wider bg-[#FAF8F5] border border-[#EFECE6] px-3.5 py-1.5 rounded-full transition-colors self-start sm:self-auto"
            >
              Open Visual Media Manager →
            </Link>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((imgUrl, idx) => (
              <div
                key={`${imgUrl}-${idx}`}
                className="group relative aspect-[3/4] bg-[#FAF8F5] rounded-xl overflow-hidden border border-[#EFECE6] shadow-xs"
              >
                <Image
                  src={imgUrl}
                  alt={`Product photo ${idx + 1}`}
                  fill
                  unoptimized
                  className="object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2.5 flex flex-col justify-between">
                  <div className="flex justify-between items-center">
                    {idx === 0 ? (
                      <span className="bg-[#D5C0A5] text-[#1A1816] text-[9px] font-heading font-black uppercase tracking-widest px-2 py-0.5 rounded-full shadow-sm">
                        Primary Cover
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(idx)}
                        className="bg-white/90 hover:bg-white text-[#1A1816] text-[8px] font-heading font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm transition-transform active:scale-95"
                      >
                        Make Primary
                      </button>
                    )}
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="bg-rose-600 hover:bg-rose-700 text-white p-1.5 rounded-lg shadow-sm transition-transform active:scale-95"
                      title="Remove image"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                {idx === 0 && (
                  <span className="absolute top-2 left-2 group-hover:hidden bg-[#1A1816]/80 text-[#FAF8F5] text-[9px] font-heading font-bold uppercase tracking-widest px-2 py-0.5 rounded-full backdrop-blur-xs">
                    Cover
                  </span>
                )}
              </div>
            ))}

            {images.length === 0 && (
              <div className="col-span-full py-8 text-center bg-[#FAF8F5] border border-dashed border-[#EFECE6] rounded-xl text-xs text-[#78716C]">
                No photos configured yet. Upload a lookbook image below.
              </div>
            )}
          </div>

          {/* Add Image Controls */}
          <div className="pt-2 border-t border-[#EFECE6] grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* File Upload from Mobile / PC */}
            <div className="p-4 bg-[#FAF8F5] border border-[#EFECE6] rounded-xl space-y-2">
              <span className="block text-[11px] font-mono uppercase tracking-wider text-[#78716C] font-bold">
                Upload from Device (PC / Phone)
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="product-photo-upload"
              />
              <button
                type="button"
                disabled={uploadingImage}
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-white hover:bg-slate-50 border border-[#EFECE6] text-[#1A1816] font-heading text-xs font-bold uppercase tracking-wider py-2.5 px-4 rounded-xl shadow-xs transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <svg className="w-4 h-4 text-[#9E6544]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span>{uploadingImage ? "Uploading to Store..." : "Choose Image File"}</span>
              </button>
            </div>

            {/* Direct Image URL input */}
            <div className="p-4 bg-[#FAF8F5] border border-[#EFECE6] rounded-xl space-y-2">
              <span className="block text-[11px] font-mono uppercase tracking-wider text-[#78716C] font-bold">
                Or Attach Image Web URL
              </span>
              <div className="flex space-x-2">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... or /images/..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="flex-1 bg-white border border-[#EFECE6] rounded-xl px-3 py-2 text-xs text-[#1A1816] placeholder-[#A8A29E] focus:outline-none focus:border-[#9E6544]"
                />
                <button
                  type="button"
                  onClick={handleAddUrl}
                  disabled={!newImageUrl.trim()}
                  className="bg-[#1A1816] hover:bg-black text-[#FAF8F5] font-heading text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl transition-colors disabled:opacity-40"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Existing Variants Summary */}
        <div className="bg-white border border-[#EFECE6] rounded-2xl shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[#EFECE6] pb-3 gap-2">
            <div>
              <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-[#1A1816]">
                Configured Variants &amp; Stock Levels
              </h2>
              <p className="text-[11px] text-[#78716C] mt-0.5">
                Current warehouse counts by size and shade.
              </p>
            </div>
            <Link
              href="/admin/inventory"
              className="text-xs font-heading text-[#9E6544] hover:text-[#7D4E33] font-bold uppercase tracking-wider bg-[#FAF8F5] border border-[#EFECE6] px-3.5 py-1.5 rounded-full transition-colors self-start sm:self-auto"
            >
              Adjust Quantities in Inventory →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {product.variants.map((v) => (
              <div
                key={v.id}
                className="p-4 bg-[#FAF8F5] border border-[#EFECE6] rounded-xl space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs font-heading font-bold text-[#1A1816]">
                  <span>
                    {v.size} &bull; {v.color}
                  </span>
                  <span className="text-[#9E6544]">
                    {v.stock_quantity} in stock
                  </span>
                </div>
                <div className="text-[10px] font-mono text-[#78716C]">
                  SKU: {v.sku}
                </div>
                {v.price_override && (
                  <div className="text-[10px] font-mono text-[#1A1816]">
                    Override: ₹{v.price_override}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4 pt-4 border-t border-[#EFECE6]">
          <Link
            href="/admin/products"
            className="px-6 py-2.5 text-xs font-heading font-bold uppercase tracking-wider text-[#78716C] hover:text-[#1A1816] transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="bg-[#D5C0A5] hover:bg-[#C4AC8F] text-[#1A1816] px-8 py-3 text-xs font-heading font-black uppercase tracking-widest rounded-full shadow-sm transition-all disabled:opacity-50"
          >
            {saving ? "Saving Changes..." : "Save Garment Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
