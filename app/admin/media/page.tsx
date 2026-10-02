"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  getMediaAssets,
  updateCategoryCard,
  updateHeroSlide,
  resetMediaAssetsToDefaults,
  CategoryCardAsset,
  HeroSlideAsset,
} from "@/lib/mediaAssets";
import { adminGetProducts, AdminProduct, getStoredAuthToken } from "@/lib/api";

export default function AdminMediaManagerPage() {
  const [activeTab, setActiveTab] = useState<"categories" | "hero" | "products">("categories");

  // Media state
  const [categoryCards, setCategoryCards] = useState<CategoryCardAsset[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlideAsset[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [productSearch, setProductSearch] = useState<string>("");

  // Feedback notifications
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Edit Category Modal state
  const [editingCategory, setEditingCategory] = useState<CategoryCardAsset | null>(null);
  const [catImageUrl, setCatImageUrl] = useState<string>("");
  const [catName, setCatName] = useState<string>("");
  const [catUploading, setCatUploading] = useState<boolean>(false);
  const catFileInputRef = useRef<HTMLInputElement>(null);

  // Edit Hero Slide Modal state
  const [editingSlideIdx, setEditingSlideIdx] = useState<number | null>(null);
  const [slideData, setSlideData] = useState<HeroSlideAsset | null>(null);
  const [slideUploading, setSlideUploading] = useState<boolean>(false);
  const slideFileInputRef = useRef<HTMLInputElement>(null);
  const slideSecFileInputRef = useRef<HTMLInputElement>(null);

  // Load initial media data
  const loadMedia = () => {
    const assets = getMediaAssets();
    setCategoryCards(assets.categoryCards);
    setHeroSlides(assets.heroSlides);
  };

  useEffect(() => {
    loadMedia();
    adminGetProducts()
      .then((data) => {
        setProducts(data);
        if (data.length > 0) setSelectedProductId(data[0].id);
      })
      .catch((err) => console.error("Could not fetch products list:", err));
  }, []);

  const showNotification = (msg: string, isError = false) => {
    if (isError) {
      setErrorMessage(msg);
      setTimeout(() => setErrorMessage(null), 4000);
    } else {
      setSuccessMessage(msg);
      setTimeout(() => setSuccessMessage(null), 4000);
    }
  };

  // --------------------------------------------------------------------------
  // Category Image Upload / URL Handlers
  // --------------------------------------------------------------------------
  const openCategoryModal = (cat: CategoryCardAsset) => {
    setEditingCategory(cat);
    setCatImageUrl(cat.imageUrl);
    setCatName(cat.name);
  };

  const handleCategoryFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setCatUploading(true);
    try {
      const formData = new FormData();
      formData.append("files", files[0]);

      const token = getStoredAuthToken();
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: token && token !== "cookie_session" ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const json = await res.json();
      if (json.files && json.files[0]?.url) {
        setCatImageUrl(json.files[0].url);
        showNotification("Photo uploaded successfully from device!");
      }
    } catch {
      showNotification("Failed to upload image from device.", true);
    } finally {
      setCatUploading(false);
      if (catFileInputRef.current) catFileInputRef.current.value = "";
    }
  };

  const handleSaveCategory = () => {
    if (!editingCategory || !catImageUrl.trim()) return;
    updateCategoryCard(editingCategory.id, {
      imageUrl: catImageUrl.trim(),
      name: catName.trim() || editingCategory.name,
    });
    loadMedia();
    setEditingCategory(null);
    showNotification(`Category "${editingCategory.name}" image updated!`);
  };

  // --------------------------------------------------------------------------
  // Hero Slide Upload / Edit Handlers
  // --------------------------------------------------------------------------
  const openHeroModal = (idx: number) => {
    setEditingSlideIdx(idx);
    setSlideData({ ...heroSlides[idx] });
  };

  const handleSlideFileUpload = async (files: FileList | null, isSecondary = false) => {
    if (!files || files.length === 0 || !slideData) return;
    setSlideUploading(true);
    try {
      const formData = new FormData();
      formData.append("files", files[0]);

      const token = getStoredAuthToken();
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: token && token !== "cookie_session" ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const json = await res.json();
      if (json.files && json.files[0]?.url) {
        if (isSecondary) {
          setSlideData({ ...slideData, secondaryImage: json.files[0].url });
        } else {
          setSlideData({ ...slideData, mainImage: json.files[0].url });
        }
        showNotification("Slide visual uploaded successfully!");
      }
    } catch {
      showNotification("Failed to upload slide image.", true);
    } finally {
      setSlideUploading(false);
      if (slideFileInputRef.current) slideFileInputRef.current.value = "";
      if (slideSecFileInputRef.current) slideSecFileInputRef.current.value = "";
    }
  };

  const handleSaveHeroSlide = () => {
    if (editingSlideIdx === null || !slideData) return;
    updateHeroSlide(editingSlideIdx, slideData);
    loadMedia();
    setEditingSlideIdx(null);
    showNotification(`Hero slide updated successfully!`);
  };

  const handleResetDefaults = () => {
    if (confirm("Reset all category images and hero slides to default editorial assets?")) {
      resetMediaAssetsToDefaults();
      loadMedia();
      showNotification("Visual media restored to original default curation.");
    }
  };

  // Selected product in Tab 3
  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];

  return (
    <div className="p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between border-b border-[#EFECE6] pb-6 gap-4">
        <div>
          <span className="text-[10px] font-heading font-extrabold uppercase tracking-widest text-[#9E6544]">
            Storefront &bull; Visual Content Manager
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl font-black uppercase tracking-wider text-[#1A1816] mt-1">
            Visual Media &amp; Image Manager
          </h1>
          <p className="text-xs text-[#78716C] font-body mt-0.5">
            Add new images, update photos, or change campaign banners across Category cards, Hero slides, and Garments.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="text-[11px] font-heading text-slate-500 hover:text-slate-800 bg-[#FAF8F5] border border-[#EFECE6] px-3.5 py-2 rounded-full font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Reset to Defaults
          </button>
          <Link
            href="/"
            target="_blank"
            className="bg-[#D5C0A5] hover:bg-[#C4AC8F] text-[#1A1816] text-xs font-heading font-black uppercase tracking-wider px-5 py-2 rounded-full shadow-xs transition-all shrink-0"
          >
            View Live Storefront ↗
          </Link>
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center justify-between">
          <span>✓ {successMessage}</span>
          <button onClick={() => setSuccessMessage(null)} className="text-emerald-600 font-bold ml-4">✕</button>
        </div>
      )}
      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center justify-between">
          <span>⚠ {errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} className="text-rose-600 font-bold ml-4">✕</button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#EFECE6] pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("categories")}
          className={`px-4 py-2 text-xs font-heading font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
            activeTab === "categories"
              ? "bg-[#1A1816] text-white shadow-xs"
              : "text-[#78716C] hover:bg-[#FAF8F5] hover:text-[#1A1816]"
          }`}
        >
          📁 Homepage Category Cards ({categoryCards.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("hero")}
          className={`px-4 py-2 text-xs font-heading font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
            activeTab === "hero"
              ? "bg-[#1A1816] text-white shadow-xs"
              : "text-[#78716C] hover:bg-[#FAF8F5] hover:text-[#1A1816]"
          }`}
        >
          ✨ Hero Banners &amp; Drops ({heroSlides.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("products")}
          className={`px-4 py-2 text-xs font-heading font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
            activeTab === "products"
              ? "bg-[#1A1816] text-white shadow-xs"
              : "text-[#78716C] hover:bg-[#FAF8F5] hover:text-[#1A1816]"
          }`}
        >
          👕 Product Garment Photos
        </button>
      </div>

      {/* ==================================================================== */}
      {/* TAB 1: CATEGORY CARDS                                                */}
      {/* ==================================================================== */}
      {activeTab === "categories" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-[#1A1816]">
                Homepage Category Visuals
              </h2>
              <p className="text-[11px] text-[#78716C] mt-0.5">
                Click &quot;Change Image&quot; on any card below to upload a photo from your device or paste a new image link.
              </p>
            </div>
            <span className="text-[11px] font-mono text-[#9E6544] font-bold">
              10 Active Category Cards
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {categoryCards.map((cat) => (
              <div
                key={cat.id}
                className="bg-white border border-[#EFECE6] rounded-2xl overflow-hidden shadow-xs flex flex-col group hover:shadow-md transition-shadow"
              >
                {/* Visual Thumbnail */}
                <div className="relative aspect-[4/5] w-full bg-[#181B24] overflow-hidden">
                  <Image
                    src={cat.imageUrl}
                    alt={cat.name}
                    fill
                    unoptimized
                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80";
                    }}
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2 right-2 bg-black/75 backdrop-blur-md text-white font-mono text-[9px] px-2 py-0.5 rounded-full font-bold">
                    {cat.count} items
                  </span>
                </div>

                {/* Card Info & Change Button */}
                <div className="p-3 flex flex-col flex-1 justify-between bg-white space-y-2">
                  <div>
                    <h3 className="font-heading font-bold text-xs uppercase text-[#1A1816] truncate">
                      {cat.name}
                    </h3>
                    <span className="text-[9px] font-mono uppercase text-[#78716C] block">
                      {cat.type}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => openCategoryModal(cat)}
                    className="w-full py-1.5 px-2 bg-[#FAF8F5] hover:bg-[#EFECE6] text-[#1A1816] border border-[#EFECE6] rounded-lg text-[10px] font-heading font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>📷</span> Change Image
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: HERO SLIDES & BANNERS                                         */}
      {/* ==================================================================== */}
      {activeTab === "hero" && (
        <div className="space-y-6">
          <div>
            <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-[#1A1816]">
              Homepage Editorial Hero Slides
            </h2>
            <p className="text-[11px] text-[#78716C] mt-0.5">
              Customize the rotating campaign banners, model visuals, pricing notes, and badge descriptions.
            </p>
          </div>

          <div className="space-y-6">
            {heroSlides.map((slide, idx) => (
              <div
                key={slide.id || idx}
                className="bg-white border border-[#EFECE6] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col lg:flex-row gap-6 items-start justify-between"
              >
                {/* Images Preview Frame */}
                <div className="flex items-center gap-3 shrink-0">
                  {/* Primary Main Image */}
                  <div className="relative w-28 sm:w-36 aspect-[3/4] bg-[#181B24] rounded-xl overflow-hidden border border-[#EFECE6] shadow-sm">
                    <Image
                      src={slide.mainImage}
                      alt={slide.titlePrimary}
                      fill
                      unoptimized
                      className="object-cover object-top"
                    />
                    <span className="absolute bottom-1 left-1 right-1 bg-black/75 backdrop-blur-xs text-white text-[8px] font-mono font-bold text-center py-0.5 rounded-sm">
                      Main Photo
                    </span>
                  </div>

                  {/* Secondary Detail Image */}
                  <div className="relative w-20 sm:w-24 aspect-[3/4] bg-[#181B24] rounded-xl overflow-hidden border border-[#EFECE6] shadow-sm">
                    <Image
                      src={slide.secondaryImage}
                      alt="Detail"
                      fill
                      unoptimized
                      className="object-cover object-top"
                    />
                    <span className="absolute bottom-1 left-1 right-1 bg-black/75 backdrop-blur-xs text-white text-[8px] font-mono font-bold text-center py-0.5 rounded-sm">
                      Detail Photo
                    </span>
                  </div>
                </div>

                {/* Slide Details */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[9px] font-heading font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-red-100 text-red-800">
                      Slide #{idx + 1}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-[#9E6544] uppercase tracking-wider">
                      {slide.tag}
                    </span>
                  </div>

                  <h3 className="font-heading font-black text-lg text-[#1A1816] uppercase tracking-wide">
                    {slide.titlePrimary} {slide.titleSecondary}
                  </h3>

                  <p className="text-xs text-[#78716C] line-clamp-2">
                    {slide.description}
                  </p>

                  <div className="flex items-center gap-3 pt-2 text-xs">
                    <span className="font-bold text-[#1A1816] bg-[#FAF8F5] border border-[#EFECE6] px-2.5 py-1 rounded-md text-[11px]">
                      🏷 {slide.badgeText}
                    </span>
                    <span className="font-bold text-[#9E6544] bg-[#FAF8F5] border border-[#EFECE6] px-2.5 py-1 rounded-md text-[11px]">
                      💰 {slide.priceNote}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  type="button"
                  onClick={() => openHeroModal(idx)}
                  className="px-5 py-2.5 bg-[#1A1816] hover:bg-[#33302C] text-white text-xs font-heading font-bold uppercase tracking-wider rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer self-stretch sm:self-auto text-center"
                >
                  ✏ Edit Slide Images &amp; Content
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 3: PRODUCT GARMENT PHOTOS                                        */}
      {/* ==================================================================== */}
      {activeTab === "products" && (
        <div className="bg-white border border-[#EFECE6] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[#EFECE6] pb-4 gap-4">
            <div>
              <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-[#1A1816]">
                Product Photography &amp; Gallery Editor
              </h2>
              <p className="text-[11px] text-[#78716C] mt-0.5">
                Select any garment from the catalog to manage its images, add new photos, or reorder perspectives.
              </p>
            </div>

            {/* Product Selector */}
            <div className="w-full sm:w-72">
              <label className="block text-[9px] font-mono uppercase text-[#78716C] font-bold mb-1">
                Select Garment to Edit:
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-xl px-3 py-2 text-xs font-heading font-bold text-[#1A1816] focus:outline-none focus:border-[#9E6544] cursor-pointer"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.category_name})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Product Details & Quick Jump to Full Editor */}
          {selectedProduct ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-[#FAF8F5] p-4 rounded-xl border border-[#EFECE6]">
                <div>
                  <h3 className="font-heading font-black text-sm uppercase text-[#1A1816]">
                    {selectedProduct.name}
                  </h3>
                  <span className="text-[10px] font-mono text-[#78716C]">
                    SKU: {selectedProduct.slug} &bull; Base Price: ₹{selectedProduct.base_price} &bull; Category: {selectedProduct.category_name}
                  </span>
                </div>
                <Link
                  href={`/admin/products/${selectedProduct.id}/edit`}
                  className="px-4 py-2 bg-[#9E6544] hover:bg-[#7D4E33] text-white text-[11px] font-heading font-bold uppercase tracking-wider rounded-lg transition-colors shrink-0"
                >
                  Full Garment Editor →
                </Link>
              </div>

              {/* Gallery Photos */}
              <div>
                <h4 className="text-xs font-heading font-bold uppercase tracking-wider text-[#1A1816] mb-3">
                  Current Gallery Images ({selectedProduct.images?.length || 0})
                </h4>

                {selectedProduct.images && selectedProduct.images.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                    {selectedProduct.images.map((img, i) => (
                      <div
                        key={img.id || i}
                        className="bg-[#FAF8F5] border border-[#EFECE6] rounded-xl overflow-hidden relative group aspect-[3/4]"
                      >
                        <Image
                          src={img.url}
                          alt={img.alt_text || selectedProduct.name}
                          fill
                          unoptimized
                          className="object-cover object-top"
                        />
                        <div className="absolute top-2 left-2 bg-black/75 backdrop-blur-xs text-white font-mono text-[9px] px-1.5 py-0.5 rounded-sm font-bold">
                          #{i + 1} {i === 0 ? "(Primary)" : ""}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-[#FAF8F5] rounded-xl border border-[#EFECE6] text-xs text-[#78716C]">
                    No images uploaded yet. Use the Garment Editor to add multi-angle photos.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-[#78716C]">
              Select a garment above to preview and manage images.
            </div>
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL: EDIT CATEGORY IMAGE                                           */}
      {/* ==================================================================== */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#EFECE6] space-y-5 animate-scaleInBounce">
            <div className="flex items-center justify-between border-b border-[#EFECE6] pb-3">
              <div>
                <h3 className="font-heading font-black text-sm uppercase text-[#1A1816]">
                  Update Category Image
                </h3>
                <span className="text-[10px] font-mono text-[#78716C]">
                  {editingCategory.name}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="text-slate-400 hover:text-black font-bold text-base"
              >
                ✕
              </button>
            </div>

            {/* Live Preview */}
            <div className="relative aspect-[4/5] w-36 mx-auto rounded-xl overflow-hidden border border-[#EFECE6] bg-[#181B24] shadow-md">
              {catImageUrl ? (
                <Image
                  src={catImageUrl}
                  alt="Preview"
                  fill
                  unoptimized
                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80";
                  }}
                  className="object-cover object-top"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-[10px] text-slate-400">
                  No image selected
                </div>
              )}
            </div>

            {/* Upload from Device button */}
            <div className="space-y-2">
              <label className="block text-[10px] font-mono uppercase text-[#78716C] font-bold">
                Option 1: Upload from Phone / PC
              </label>
              <input
                type="file"
                ref={catFileInputRef}
                accept="image/*"
                onChange={(e) => handleCategoryFileUpload(e.target.files)}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => catFileInputRef.current?.click()}
                disabled={catUploading}
                className="w-full py-2.5 px-4 bg-[#9E6544] hover:bg-[#7D4E33] text-white text-xs font-heading font-bold uppercase tracking-wider rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>📁</span>
                {catUploading ? "Uploading Image..." : "Choose Image File from Device"}
              </button>
            </div>

            {/* Or Paste Image URL */}
            <div className="space-y-1">
              <label className="block text-[10px] font-mono uppercase text-[#78716C] font-bold">
                Option 2: Or Paste Image Web Link (URL)
              </label>
              <input
                type="url"
                value={catImageUrl}
                onChange={(e) => setCatImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-xl px-3 py-2 text-xs text-[#1A1816] font-mono focus:outline-none focus:border-[#9E6544]"
              />
            </div>

            {/* Optional Category Name edit */}
            <div className="space-y-1">
              <label className="block text-[10px] font-mono uppercase text-[#78716C] font-bold">
                Category Display Name
              </label>
              <input
                type="text"
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-xl px-3 py-2 text-xs text-[#1A1816] font-heading font-bold focus:outline-none focus:border-[#9E6544]"
              />
            </div>

            {/* Save / Cancel */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="px-4 py-2 text-xs font-heading font-bold uppercase text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCategory}
                disabled={!catImageUrl.trim()}
                className="px-5 py-2 bg-[#1A1816] hover:bg-[#33302C] text-white text-xs font-heading font-bold uppercase tracking-wider rounded-xl shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
              >
                Save &amp; Update Live
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL: EDIT HERO SLIDE                                               */}
      {/* ==================================================================== */}
      {editingSlideIdx !== null && slideData && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#EFECE6] space-y-5 my-8 animate-scaleInBounce">
            <div className="flex items-center justify-between border-b border-[#EFECE6] pb-3">
              <div>
                <h3 className="font-heading font-black text-sm uppercase text-[#1A1816]">
                  Edit Hero Slide #{editingSlideIdx + 1}
                </h3>
                <span className="text-[10px] font-mono text-[#78716C]">
                  {slideData.tag}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setEditingSlideIdx(null)}
                className="text-slate-400 hover:text-black font-bold text-base"
              >
                ✕
              </button>
            </div>

            {/* Dual Image Preview */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono uppercase text-[#78716C] font-bold mb-1">
                  Main Model Image
                </label>
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-[#EFECE6] bg-[#181B24]">
                  <Image
                    src={slideData.mainImage}
                    alt="Main"
                    fill
                    unoptimized
                    className="object-cover object-top"
                  />
                </div>
                <input
                  type="file"
                  ref={slideFileInputRef}
                  accept="image/*"
                  onChange={(e) => handleSlideFileUpload(e.target.files, false)}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => slideFileInputRef.current?.click()}
                  disabled={slideUploading}
                  className="w-full mt-2 py-1.5 px-2 bg-[#FAF8F5] hover:bg-[#EFECE6] border border-[#EFECE6] rounded-lg text-[10px] font-heading font-bold uppercase transition-colors"
                >
                  {slideUploading ? "Uploading..." : "Upload Main"}
                </button>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-[#78716C] font-bold mb-1">
                  Detail / Texture Image
                </label>
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-[#EFECE6] bg-[#181B24]">
                  <Image
                    src={slideData.secondaryImage}
                    alt="Secondary"
                    fill
                    unoptimized
                    className="object-cover object-top"
                  />
                </div>
                <input
                  type="file"
                  ref={slideSecFileInputRef}
                  accept="image/*"
                  onChange={(e) => handleSlideFileUpload(e.target.files, true)}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => slideSecFileInputRef.current?.click()}
                  disabled={slideUploading}
                  className="w-full mt-2 py-1.5 px-2 bg-[#FAF8F5] hover:bg-[#EFECE6] border border-[#EFECE6] rounded-lg text-[10px] font-heading font-bold uppercase transition-colors"
                >
                  {slideUploading ? "Uploading..." : "Upload Detail"}
                </button>
              </div>
            </div>

            {/* Editable Content Fields */}
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-mono uppercase text-[#78716C] font-bold mb-1">
                  Card Badge Title (e.g. STRUCTURED CO-ORD SET)
                </label>
                <input
                  type="text"
                  value={slideData.badgeText}
                  onChange={(e) => setSlideData({ ...slideData, badgeText: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-xl px-3 py-1.5 text-xs text-[#1A1816] font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-[#78716C] font-bold mb-1">
                  Price / Fabric Tag (e.g. ₹2,499 • 100% PURE LINEN)
                </label>
                <input
                  type="text"
                  value={slideData.priceNote}
                  onChange={(e) => setSlideData({ ...slideData, priceNote: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-xl px-3 py-1.5 text-xs text-[#1A1816]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-[#78716C] font-bold mb-1">
                  Campaign Drop Eyebrow
                </label>
                <input
                  type="text"
                  value={slideData.tag}
                  onChange={(e) => setSlideData({ ...slideData, tag: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-xl px-3 py-1.5 text-xs text-[#1A1816]"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#EFECE6]">
              <button
                type="button"
                onClick={() => setEditingSlideIdx(null)}
                className="px-4 py-2 text-xs font-heading font-bold uppercase text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveHeroSlide}
                className="px-5 py-2 bg-[#1A1816] hover:bg-[#33302C] text-white text-xs font-heading font-bold uppercase tracking-wider rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Update Banner Live
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
