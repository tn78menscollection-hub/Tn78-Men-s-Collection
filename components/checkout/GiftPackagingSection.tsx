"use client";

import React, { useState, useEffect } from "react";

export interface GiftOptions {
  is_gift_package: boolean;
  gift_recipient_name: string;
  gift_sender_name: string;
  gift_message: string;
  gift_hide_price: boolean;
}

interface GiftPackagingSectionProps {
  initialOptions: {
    is_gift_package?: boolean;
    gift_recipient_name?: string | null;
    gift_sender_name?: string | null;
    gift_message?: string | null;
    gift_hide_price?: boolean;
  };
  subtotal: number;
  giftPackageFee?: number;
  isLoading?: boolean;
  onUpdateGift: (options: GiftOptions) => Promise<void>;
}

const OCCASION_PRESETS = [
  {
    label: "Birthday Felicitations",
    sample: "Wishing you an extraordinary year ahead of distinguished style, grace, and continued success.",
  },
  {
    label: "Wedding & Celebrations",
    sample: "Heartiest felicitations on this grand occasion. May your journey together be woven with joy and prosperity.",
  },
  {
    label: "Milestone Achievement",
    sample: "Celebrating your stellar achievement. May this sartorial piece accompany you on your next triumph.",
  },
  {
    label: "With Warm Compliments",
    sample: "A token of appreciation for your exceptional grace and enduring camaraderie.",
  },
];

export default function GiftPackagingSection({
  initialOptions,
  subtotal,
  giftPackageFee = 0,
  isLoading = false,
  onUpdateGift,
}: GiftPackagingSectionProps) {
  const isComplimentary = subtotal >= 5000;
  const isEnabled = Boolean(initialOptions.is_gift_package);

  const [isGift, setIsGift] = useState<boolean>(isEnabled);
  const [recipient, setRecipient] = useState<string>(initialOptions.gift_recipient_name || "");
  const [sender, setSender] = useState<string>(initialOptions.gift_sender_name || "");
  const [message, setMessage] = useState<string>(initialOptions.gift_message || "");
  const [hidePrice, setHidePrice] = useState<boolean>(Boolean(initialOptions.gift_hide_price));
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  // Sync when initialOptions change from server
  useEffect(() => {
    setIsGift(Boolean(initialOptions.is_gift_package));
    setRecipient(initialOptions.gift_recipient_name || "");
    setSender(initialOptions.gift_sender_name || "");
    setMessage(initialOptions.gift_message || "");
    setHidePrice(Boolean(initialOptions.gift_hide_price));
    setHasUnsavedChanges(false);
  }, [
    initialOptions.is_gift_package,
    initialOptions.gift_recipient_name,
    initialOptions.gift_sender_name,
    initialOptions.gift_message,
    initialOptions.gift_hide_price,
  ]);

  const handleToggleGift = async (checked: boolean) => {
    setIsGift(checked);
    setIsSaving(true);
    try {
      await onUpdateGift({
        is_gift_package: checked,
        gift_recipient_name: checked ? recipient : "",
        gift_sender_name: checked ? sender : "",
        gift_message: checked ? message : "",
        gift_hide_price: checked ? hidePrice : false,
      });
      setHasUnsavedChanges(false);
    } catch (err) {
      console.error("Failed to update gift packaging:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleApplyGiftChanges = async () => {
    setIsSaving(true);
    try {
      await onUpdateGift({
        is_gift_package: isGift,
        gift_recipient_name: recipient.trim(),
        gift_sender_name: sender.trim(),
        gift_message: message.trim(),
        gift_hide_price: hidePrice,
      });
      setHasUnsavedChanges(false);
    } catch (err) {
      console.error("Failed to save gift details:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectPreset = (presetText: string) => {
    setMessage(presetText);
    setHasUnsavedChanges(true);
  };

  return (
    <div className="bg-[#13151C] border border-[#232733] p-6 sm:p-8 space-y-6 shadow-xl rounded-none md:rounded-xs transition-all duration-300">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#232733] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-[#E2C58A]">
              STEP 3 &bull; BESPOKE PRESENTATION
            </span>
            {isComplimentary ? (
              <span className="px-2 py-0.5 bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-[9px] font-heading font-bold uppercase tracking-wider rounded-xs">
                COMPLIMENTARY PRIVILEGE (Orders &ge; ₹5,000)
              </span>
            ) : (
              <span className="px-2 py-0.5 bg-[#0A0B0E] text-[#E2C58A] border border-[#E2C58A]/30 text-[9px] font-heading font-bold uppercase tracking-wider rounded-xs">
                +₹200 SIGNATURE ARCHIVAL BOX
              </span>
            )}
          </div>
          <h2 className="font-heading font-black text-xl uppercase tracking-wider text-[#F8FAFC] mt-1">
            LUXURY GIFT PACKAGING &amp; HANDWRITTEN NOTE
          </h2>
        </div>

        {/* Status Indicator */}
        <div className="text-[11px] font-heading text-[#94A3B8]">
          {isGift ? (
            <span className="inline-flex items-center text-emerald-400 font-bold tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
              GIFT PACKAGING ACTIVE
            </span>
          ) : (
            <span className="text-[#64748B]">OPTIONAL PRIVILEGE</span>
          )}
        </div>
      </div>

      {/* Main Activation Card */}
      <div
        className={`p-5 border transition-all duration-200 cursor-pointer rounded-xs ${
          isGift
            ? "bg-[#191D28] border-[#E2C58A] shadow-[0_0_15px_rgba(226,197,138,0.15)] ring-1 ring-[#E2C58A]"
            : "bg-[#0A0B0E] border-[#232733] hover:border-[#E2C58A]/50"
        }`}
        onClick={() => !isLoading && !isSaving && handleToggleGift(!isGift)}
      >
        <div className="flex items-start space-x-4">
          <div className="pt-0.5">
            <input
              type="checkbox"
              id="giftPackagingToggle"
              checked={isGift}
              disabled={isLoading || isSaving}
              onChange={(e) => handleToggleGift(e.target.checked)}
              onClick={(e) => e.stopPropagation()}
              className="w-4 h-4 accent-[#E2C58A] bg-[#0A0B0E] border-[#232733] cursor-pointer"
            />
          </div>
          <div className="flex-1">
            <label
              htmlFor="giftPackagingToggle"
              className="font-heading font-bold text-sm uppercase tracking-wider text-[#F8FAFC] cursor-pointer flex items-center justify-between"
            >
              <span>Enclose in TN78 Signature Archival Gift Box &amp; Calligraphy Note</span>
              <span className="text-[#E2C58A] font-mono text-xs">
                {isComplimentary ? "₹0 (FREE)" : "+₹200"}
              </span>
            </label>
            <p className="text-xs font-body text-[#94A3B8] mt-1 leading-relaxed">
              Wrapped in our heavyweight obsidian rigid box with magnetic seal, embossed copper terracotta crest, gold-dusted tissue wrapping, and a deckle-edged hand-penned card.
            </p>
          </div>
        </div>
      </div>

      {/* Expanded Customization Form */}
      {isGift && (
        <div className="space-y-6 pt-2 border-t border-[#232733] animate-fadeIn">
          {/* Recipient and Sender Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-heading font-bold uppercase tracking-wider text-[#94A3B8] mb-1.5">
                RECIPIENT&apos;S NAME (TO)
              </label>
              <input
                type="text"
                value={recipient}
                maxLength={60}
                placeholder="e.g. Raghavan Sundaram"
                onChange={(e) => {
                  setRecipient(e.target.value);
                  setHasUnsavedChanges(true);
                }}
                className="w-full px-3.5 py-2.5 bg-[#0A0B0E] border border-[#232733] focus:border-[#E2C58A] focus:bg-[#191D28] text-xs font-heading tracking-wide text-[#F8FAFC] placeholder-[#64748B] outline-none transition-colors rounded-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] font-heading font-bold uppercase tracking-wider text-[#94A3B8] mb-1.5">
                SENDER&apos;S NAME (FROM)
              </label>
              <input
                type="text"
                value={sender}
                maxLength={60}
                placeholder="e.g. Siddharth &amp; Family"
                onChange={(e) => {
                  setSender(e.target.value);
                  setHasUnsavedChanges(true);
                }}
                className="w-full px-3.5 py-2.5 bg-[#0A0B0E] border border-[#232733] focus:border-[#E2C58A] focus:bg-[#191D28] text-xs font-heading tracking-wide text-[#F8FAFC] placeholder-[#64748B] outline-none transition-colors rounded-xs"
              />
            </div>
          </div>

          {/* Occasion Quick-Chips */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-[#94A3B8]">
                SELECT OCCASION TEMPLATE (OPTIONAL)
              </span>
              <span className="text-[9px] font-heading text-[#E2C58A] uppercase tracking-wider">
                CLICK TO INSCRIBE
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {OCCASION_PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => handleSelectPreset(p.sample)}
                  className="px-2.5 py-1 bg-[#0A0B0E] hover:bg-[#191D28] border border-[#232733] hover:border-[#E2C58A]/50 text-[10px] font-heading font-semibold text-[#94A3B8] hover:text-[#E2C58A] rounded-xs transition-colors cursor-pointer"
                >
                  ✦ {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Message Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[10px] font-heading font-bold uppercase tracking-wider text-[#94A3B8]">
                HANDWRITTEN CALLIGRAPHY MESSAGE
              </label>
              <span className="text-[10px] font-mono text-[#64748B]">
                {message.length} / 250 CHARS
              </span>
            </div>
            <textarea
              rows={3}
              maxLength={250}
              value={message}
              placeholder="Inscribe your personal message here. Our master calligrapher will hand-pen this on 300 GSM cotton rag parchment..."
              onChange={(e) => {
                setMessage(e.target.value);
                setHasUnsavedChanges(true);
              }}
              className="w-full px-3.5 py-2.5 bg-[#0A0B0E] border border-[#232733] focus:border-[#E2C58A] focus:bg-[#191D28] text-xs font-serif italic text-[#F8FAFC] placeholder-[#64748B] outline-none transition-colors rounded-xs leading-relaxed"
            />
          </div>

          {/* Live Calligraphy Card Preview */}
          <div className="bg-[#191D28] border border-[#E2C58A]/30 p-5 rounded-xs relative shadow-lg">
            <div className="absolute top-3 right-3 text-[9px] font-heading font-bold uppercase tracking-widest text-[#E2C58A] flex items-center space-x-1">
              <span>✦ LIVE PARCHMENT PREVIEW</span>
            </div>
            <div className="max-w-md mx-auto py-2 text-center">
              <div className="text-[10px] font-heading font-bold uppercase tracking-widest text-[#E2C58A] mb-2">
                TN78 &bull; COMPLIMENTS
              </div>
              <p className="font-serif italic text-sm text-[#F8FAFC] leading-relaxed min-h-[3rem] px-4">
                &ldquo;{message.trim() || "Your personalized words penned here with archival ink..."}&rdquo;
              </p>
              <div className="mt-3 pt-2 border-t border-[#232733] flex items-center justify-between text-[10px] font-heading text-[#94A3B8] px-2">
                <span>FOR: <strong className="text-[#E2C58A]">{recipient.trim() || "Recipient"}</strong></span>
                <span>FROM: <strong className="text-[#E2C58A]">{sender.trim() || "Sender"}</strong></span>
              </div>
            </div>
          </div>

          {/* Conceal Pricing Checkbox */}
          <div className="p-3.5 bg-[#0A0B0E] border border-[#232733] rounded-xs flex items-start space-x-3">
            <input
              type="checkbox"
              id="hidePriceToggle"
              checked={hidePrice}
              onChange={(e) => {
                setHidePrice(e.target.checked);
                setHasUnsavedChanges(true);
              }}
              className="w-4 h-4 accent-[#E2C58A] bg-[#0A0B0E] border-[#232733] cursor-pointer mt-0.5"
            />
            <label htmlFor="hidePriceToggle" className="cursor-pointer text-xs">
              <span className="font-heading font-bold text-[#F8FAFC] uppercase tracking-wider block">
                Conceal Garment Prices on Delivery Slip
              </span>
              <span className="text-[#94A3B8] font-body text-[11px] block mt-0.5">
                The courier dispatch slip enclosed with the parcel will exclude monetary valuations so the recipient receives it purely as a distinguished gift.
              </span>
            </label>
          </div>

          {/* Save / Update Button */}
          {hasUnsavedChanges && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] font-heading text-[#E2C58A] animate-pulse">
                ✦ Unsaved gift presentation preferences
              </span>
              <button
                type="button"
                onClick={handleApplyGiftChanges}
                disabled={isLoading || isSaving}
                className="px-5 py-2.5 bg-gradient-to-r from-[#E2C58A] to-[#C6A467] hover:brightness-110 text-[#0A0B0E] font-heading text-xs font-black uppercase tracking-widest transition-all rounded-full shadow-[0_0_15px_rgba(226,197,138,0.3)] disabled:opacity-50 cursor-pointer"
              >
                {isSaving ? "INSCRIBING..." : "SAVE GIFT PREFERENCES"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
