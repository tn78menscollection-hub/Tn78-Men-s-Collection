"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  adminDeleteProduct,
  adminGetProducts,
  adminUpdateProduct,
  AdminProduct,
} from "@/lib/api";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await adminGetProducts();
      setProducts(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load products";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleToggleActive = async (product: AdminProduct) => {
    try {
      setActionLoading(product.id);
      setMessage(null);
      setError(null);

      if (product.is_active) {
        const updated = await adminDeleteProduct(product.id);
        setProducts((prev) => prev.map((p) => (p.id === product.id ? updated : p)));
        setMessage(`Garment "${product.name}" archived (soft-deleted).`);
      } else {
        const updated = await adminUpdateProduct(product.id, { is_active: true });
        setProducts((prev) => prev.map((p) => (p.id === product.id ? updated : p)));
        setMessage(`Garment "${product.name}" restored to active catalog.`);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update garment status";
      setError(message);
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase()) ||
      (p.category_name && p.category_name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between border-b border-[#EFECE6] pb-6 gap-4">
        <div>
          <span className="text-[10px] font-heading font-extrabold uppercase tracking-widest text-[#9E6544]">
            Catalog &bull; Menswear Garments
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl font-black uppercase tracking-wider text-[#1A1816] mt-1">
            Garment Catalog Management
          </h1>
          <p className="text-xs text-[#78716C] font-body mt-0.5">
            Configure luxury menswear collections, prices, MRP strike-throughs, 12% GST, and variant stock levels.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-[#D5C0A5] hover:bg-[#C4AC8F] text-[#1A1816] text-xs font-heading font-black uppercase tracking-wider px-6 py-2.5 rounded-full shadow-sm transition-all shrink-0 self-start sm:self-auto"
        >
          + Add New Garment
        </Link>
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

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by garment name, category, or slug..."
            className="w-full bg-white border border-[#EFECE6] rounded-xl px-4 py-2.5 text-xs text-[#1A1816] placeholder-[#A8A29E] focus:outline-none focus:border-[#9E6544] focus:ring-1 focus:ring-[#9E6544]/30 shadow-sm"
          />
        </div>
        <div className="text-xs font-heading text-[#78716C] uppercase tracking-wider self-end sm:self-center">
          Total Garments: <strong className="text-[#1A1816]">{filtered.length}</strong>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-[#EFECE6] rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-body">
            <thead className="bg-[#FAF8F5] font-heading text-[10px] uppercase tracking-wider text-[#78716C] border-b border-[#EFECE6]">
              <tr>
                <th className="py-3.5 px-6">Garment</th>
                <th className="py-3.5 px-6">Collection</th>
                <th className="py-3.5 px-6">Base / MRP</th>
                <th className="py-3.5 px-6">Variants &amp; Stock</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFECE6] text-[#1A1816]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#78716C]">
                    Loading garment catalog...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#78716C]">
                    No garments matching search criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const firstImg = p.images && p.images[0] ? p.images[0].url : null;
                  const totalStock = p.variants.reduce((acc, v) => acc + v.stock_quantity, 0);

                  return (
                    <tr key={p.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-14 bg-[#FAF8F5] border border-[#EFECE6] rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                            {firstImg ? (
                              <img
                                src={firstImg}
                                alt={p.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-[9px] text-[#A8A29E] font-heading font-bold">TN78</span>
                            )}
                          </div>
                          <div>
                            <div className="font-heading font-bold text-xs uppercase tracking-wider text-[#1A1816]">
                              {p.name}
                            </div>
                            <div className="font-mono text-[10px] text-[#78716C] mt-0.5">
                              /{p.slug}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-block px-2.5 py-1 text-[10px] font-heading font-bold uppercase tracking-wider bg-[#FAF8F5] border border-[#EFECE6] text-[#78716C] rounded-full">
                          {p.category_name || "Uncategorized"}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-heading font-bold text-xs">
                        <div className="text-[#1A1816]">₹{p.base_price.toLocaleString("en-IN")}</div>
                        {p.mrp && p.mrp > p.base_price && (
                          <div className="text-[10px] text-[#A8A29E] line-through font-normal">
                            MRP ₹{p.mrp.toLocaleString("en-IN")}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-xs">{p.variants.length} variant(s)</div>
                        <div className="text-[10px] text-[#78716C]">
                          Total Stock: {totalStock} unit(s)
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {p.is_active ? (
                          <span className="inline-block px-3 py-0.5 text-[10px] font-heading font-bold uppercase tracking-wider text-emerald-800 border border-emerald-200 bg-emerald-50 rounded-full">
                            Active
                          </span>
                        ) : (
                          <span className="inline-block px-3 py-0.5 text-[10px] font-heading font-bold uppercase tracking-wider text-stone-600 border border-stone-200 bg-stone-100 rounded-full">
                            Archived
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="px-3 py-1 bg-[#FAF8F5] hover:bg-[#EFECE6] border border-[#EFECE6] text-[#1A1816] text-[11px] font-heading font-bold uppercase tracking-wider rounded-full inline-block transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleToggleActive(p)}
                          disabled={actionLoading === p.id}
                          className={`px-3 py-1 text-[11px] font-heading font-bold uppercase tracking-wider rounded-full inline-block transition-colors border ${
                            p.is_active
                              ? "border-rose-200 text-rose-700 hover:bg-rose-50"
                              : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                          } disabled:opacity-50`}
                        >
                          {actionLoading === p.id
                            ? "..."
                            : p.is_active
                            ? "Archive"
                            : "Restore"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
