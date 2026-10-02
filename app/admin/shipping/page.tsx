"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  adminGetShippingRates,
  adminUpdateShippingRates,
  ShippingRatesConfigDto,
} from "@/lib/api";

export default function AdminShippingRatesPage() {
  const [rates, setRates] = useState<ShippingRatesConfigDto>({
    local_tn_rate: 60,
    south_zone_rate: 90,
    pan_india_rate: 150,
    express_rate: 350,
    free_shipping_threshold: 999,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Live simulator states
  const [testPin, setTestPin] = useState("625001");
  const [testSubtotal, setTestSubtotal] = useState("800");

  useEffect(() => {
    adminGetShippingRates()
      .then((data) => setRates(data))
      .catch((err) => setError(err.message || "Failed to load shipping rates."))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const updated = await adminUpdateShippingRates(rates);
      setRates(updated);
      setMessage("Delivery charges and zone thresholds updated successfully!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update shipping rates.";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  // Predict simulated zone based on testPin
  const getSimulatedRate = () => {
    const pin = testPin.trim();
    const sub = parseFloat(testSubtotal) || 0;
    if (sub >= rates.free_shipping_threshold) {
      return { zone: "Eligible for Free Delivery", cost: 0, isFree: true };
    }
    if (pin.length >= 2) {
      const prefix = pin.substring(0, 2);
      if (["60", "61", "62", "63", "64"].includes(prefix)) {
        return { zone: "Tamil Nadu (Local Hub)", cost: rates.local_tn_rate, isFree: false };
      }
      if (["67", "68", "69", "56", "57", "58", "59", "50", "51", "52", "53"].includes(prefix)) {
        return { zone: "South Zone (KL, KA, TS, AP)", cost: rates.south_zone_rate, isFree: false };
      }
    }
    return { zone: "Pan-India Express Zone", cost: rates.pan_india_rate, isFree: false };
  };

  const sim = getSimulatedRate();

  if (loading) {
    return (
      <div className="p-12 max-w-4xl mx-auto text-center font-mono text-xs uppercase tracking-widest text-[#78716C]">
        Loading shipping configuration...
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 lg:p-10 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-[#EFECE6] pb-6">
        <Link
          href="/admin"
          className="text-[#9E6544] hover:underline font-mono text-[11px] uppercase tracking-wider mb-2 inline-block font-semibold"
        >
          &larr; Back to Admin Hub
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
          <div>
            <span className="text-[10px] font-heading font-extrabold uppercase tracking-widest text-[#9E6544]">
              Logistics &bull; Regional Rate Matrix
            </span>
            <h1 className="font-heading text-2xl sm:text-3xl font-black uppercase tracking-wider text-[#1A1816] mt-1">
              Delivery Charges &amp; Prediction
            </h1>
          </div>
          <div className="font-mono text-xs text-[#78716C]">
            Hub: <span className="text-[#1A1816] font-bold">Madurai / Chennai (TN78)</span>
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

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-8">
        <div className="bg-white border border-[#EFECE6] rounded-2xl shadow-sm p-6 sm:p-8 space-y-6">
          <div className="border-b border-[#EFECE6] pb-3">
            <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-[#1A1816]">
              1. Location-Based Delivery Charges (₹)
            </h2>
            <p className="text-[11px] text-[#78716C] mt-0.5">
              These rates automatically apply to customer orders based on their destination PIN code and State.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#78716C] font-bold mb-1.5">
                Tamil Nadu &amp; Puducherry
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-[#78716C] font-mono">₹</span>
                <input
                  type="number"
                  required
                  min="0"
                  step="1"
                  value={rates.local_tn_rate}
                  onChange={(e) => setRates({ ...rates, local_tn_rate: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-xl pl-8 pr-4 py-2.5 text-xs font-bold text-[#1A1816] focus:outline-none focus:border-[#9E6544]"
                />
              </div>
              <p className="text-[10px] text-[#78716C] mt-1 font-mono">PIN codes 60–64</p>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#78716C] font-bold mb-1.5">
                South Zone (KL, KA, TS, AP)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-[#78716C] font-mono">₹</span>
                <input
                  type="number"
                  required
                  min="0"
                  step="1"
                  value={rates.south_zone_rate}
                  onChange={(e) => setRates({ ...rates, south_zone_rate: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-xl pl-8 pr-4 py-2.5 text-xs font-bold text-[#1A1816] focus:outline-none focus:border-[#9E6544]"
                />
              </div>
              <p className="text-[10px] text-[#78716C] mt-1 font-mono">PIN codes 50–59, 67–69</p>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#78716C] font-bold mb-1.5">
                Pan-India Express Zone
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-[#78716C] font-mono">₹</span>
                <input
                  type="number"
                  required
                  min="0"
                  step="1"
                  value={rates.pan_india_rate}
                  onChange={(e) => setRates({ ...rates, pan_india_rate: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-xl pl-8 pr-4 py-2.5 text-xs font-bold text-[#1A1816] focus:outline-none focus:border-[#9E6544]"
                />
              </div>
              <p className="text-[10px] text-[#78716C] mt-1 font-mono">All other Indian regions</p>
            </div>
          </div>
        </div>

        {/* Section 2: Express & Free Shipping Threshold */}
        <div className="bg-white border border-[#EFECE6] rounded-2xl shadow-sm p-6 sm:p-8 space-y-6">
          <div className="border-b border-[#EFECE6] pb-3">
            <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-[#1A1816]">
              2. Priority Air &amp; Complimentary Threshold
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#78716C] font-bold mb-1.5">
                Express Priority Air Dispatch Fee (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-[#78716C] font-mono">₹</span>
                <input
                  type="number"
                  required
                  min="0"
                  step="1"
                  value={rates.express_rate}
                  onChange={(e) => setRates({ ...rates, express_rate: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-xl pl-8 pr-4 py-2.5 text-xs font-bold text-[#1A1816] focus:outline-none focus:border-[#9E6544]"
                />
              </div>
              <p className="text-[10px] text-[#78716C] mt-1 font-mono">Expedited 1–2 business day delivery</p>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#78716C] font-bold mb-1.5">
                Free Delivery Threshold (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-[#78716C] font-mono">₹</span>
                <input
                  type="number"
                  required
                  min="0"
                  step="1"
                  value={rates.free_shipping_threshold}
                  onChange={(e) => setRates({ ...rates, free_shipping_threshold: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-xl pl-8 pr-4 py-2.5 text-xs font-bold text-[#1A1816] focus:outline-none focus:border-[#9E6544]"
                />
              </div>
              <p className="text-[10px] text-[#78716C] mt-1 font-mono">Orders at or above this amount receive free standard shipping</p>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-[#9E6544] hover:bg-[#7D4E33] text-white font-heading text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-full transition-all disabled:opacity-50 cursor-pointer shadow-sm"
            >
              {saving ? "Saving Changes..." : "Save Delivery Settings"}
            </button>
          </div>
        </div>
      </form>

      {/* Interactive Rate Simulator */}
      <div className="bg-[#FAF8F5] border border-[#EFECE6] rounded-2xl p-6 sm:p-8 space-y-4">
        <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-[#1A1816] flex items-center gap-2">
          <span>⚡</span> Live Pincode Rate Simulator
        </h3>
        <p className="text-[11px] text-[#78716C]">
          Test what a customer will automatically be charged based on their location and cart total.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-[#78716C] font-bold mb-1">
              Test PIN Code
            </label>
            <input
              type="text"
              maxLength={6}
              value={testPin}
              onChange={(e) => setTestPin(e.target.value)}
              placeholder="e.g. 625001"
              className="w-full bg-white border border-[#EFECE6] rounded-lg px-3 py-2 text-xs font-mono text-[#1A1816] focus:outline-none focus:border-[#9E6544]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-[#78716C] font-bold mb-1">
              Test Cart Subtotal (₹)
            </label>
            <input
              type="number"
              value={testSubtotal}
              onChange={(e) => setTestSubtotal(e.target.value)}
              placeholder="e.g. 800"
              className="w-full bg-white border border-[#EFECE6] rounded-lg px-3 py-2 text-xs font-mono text-[#1A1816] focus:outline-none focus:border-[#9E6544]"
            />
          </div>
        </div>

        <div className="p-4 bg-white border border-[#EFECE6] rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#78716C] block">
              Predicted Zone
            </span>
            <span className="text-xs font-bold text-[#1A1816] font-heading uppercase">
              {sim.zone}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#78716C] block">
              Predicted Delivery Fee
            </span>
            <span className="text-sm font-bold text-[#9E6544] font-mono">
              {sim.isFree ? "FREE (Complimentary)" : `₹${sim.cost}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
