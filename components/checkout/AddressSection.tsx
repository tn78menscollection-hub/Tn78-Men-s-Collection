"use client";

import React, { useState, useEffect } from "react";
import {
  AddressDto,
  AddressCreateDto,
  getSavedAddresses,
  createSavedAddress,
  getStoredAuthToken,
  checkPincodeServiceability,
} from "@/lib/api";
import { lookupPincode } from "@/lib/pincodeData";

interface AddressSectionProps {
  selectedAddress: AddressDto | null;
  onSelectAddress: (address: AddressDto) => void;
  onSaveInlineAddress: (address: AddressCreateDto) => Promise<void>;
  onPincodeDetected?: (pincode: string, state: string) => void;
  isLoading?: boolean;
}

export default function AddressSection({
  selectedAddress,
  onSelectAddress,
  onSaveInlineAddress,
  onPincodeDetected,
  isLoading = false,
}: AddressSectionProps) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [savedAddresses, setSavedAddresses] = useState<AddressDto[]>([]);
  const [isFetchingSaved, setIsFetchingSaved] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(!selectedAddress);
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
  const [pincodeDetectedNotice, setPincodeDetectedNotice] = useState<string | null>(null);

  // Form fields
  const [formData, setFormData] = useState<AddressCreateDto>({
    full_name: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "India",
    is_default: false,
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const token = getStoredAuthToken();
    if (token) {
      setIsLoggedIn(true);
      fetchUserAddresses();
    }
  }, []);

  useEffect(() => {
    if (!selectedAddress) {
      setIsEditing(true);
    }
  }, [selectedAddress]);

  const fetchUserAddresses = async () => {
    try {
      setIsFetchingSaved(true);
      const addresses = await getSavedAddresses();
      setSavedAddresses(addresses);
      // Auto-select default if no address is currently selected
      if (!selectedAddress && addresses.length > 0) {
        const defaultAddr = addresses.find((a) => a.is_default) || addresses[0];
        onSelectAddress(defaultAddr);
        setIsEditing(false);
      }
    } catch (err) {
      console.warn("Could not load saved addresses:", err);
    } finally {
      setIsFetchingSaved(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const finalValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: finalValue,
      };

      // Auto-fill city/district and state when typing 6-digit postal code
      if (name === "postal_code") {
        const cleanPin = String(finalValue).replace(/\D/g, "");
        if (cleanPin.length === 6) {
          const match = lookupPincode(cleanPin);
          if (match) {
            if (match.city && match.city.toLowerCase() !== match.state.toLowerCase()) {
              updated.city = match.city;
            }
            if (match.state) {
              updated.state = match.state;
            }
            const displayCity = (match.city && match.city.toLowerCase() !== match.state.toLowerCase()) ? `${match.city}, ` : "";
            setPincodeDetectedNotice(`Auto-detected: ${displayCity}${match.state}`);
            onPincodeDetected?.(cleanPin, match.state);
          } else {
            setPincodeDetectedNotice(null);
          }

          // Asynchronously query server for district-level serviceability
          checkPincodeServiceability(cleanPin)
            .then((res) => {
              if (res && res.state) {
                setFormData((curr) => {
                  const next = { ...curr };
                  if (res.city && res.city.toLowerCase() !== res.state.toLowerCase()) {
                    next.city = res.city;
                  }
                  if (res.state) {
                    next.state = res.state;
                  }
                  return next;
                });
                const serverCity = (res.city && res.city.toLowerCase() !== res.state.toLowerCase()) ? `${res.city}, ` : "";
                setPincodeDetectedNotice(`Auto-detected: ${serverCity}${res.state}`);
                onPincodeDetected?.(cleanPin, res.state);
              }
            })
            .catch(() => {});
        } else {
          setPincodeDetectedNotice(null);
        }
      }

      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Basic validation
    if (
      !formData.full_name ||
      !formData.phone ||
      !formData.line1 ||
      !formData.city ||
      !formData.state ||
      !formData.postal_code
    ) {
      setFormError("Please complete all mandatory delivery address fields.");
      return;
    }

    if (!/^[1-9][0-9]{5}$/.test(formData.postal_code.trim())) {
      setFormError("Please enter a valid 6-digit Indian PIN code.");
      return;
    }

    try {
      setIsSubmitting(true);
      if (isLoggedIn && isAddingNew) {
        // Save to user address book
        const newAddr = await createSavedAddress(formData);
        setSavedAddresses((prev) => [newAddr, ...prev]);
        onSelectAddress(newAddr);
        setIsAddingNew(false);
        setIsEditing(false);
      } else {
        // Submit inline address payload for checkout
        await onSaveInlineAddress(formData);
        setIsEditing(false);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to register delivery address.";
      setFormError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#13151C] border border-[#232733] p-6 md:p-8 space-y-6 shadow-xl rounded-none md:rounded-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#232733] pb-4">
        <div>
          <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-[#E2C58A]">
            STEP 01
          </span>
          <h2 className="font-heading font-extrabold text-lg md:text-xl uppercase tracking-wider text-[#F8FAFC] mt-0.5">
            DELIVERY ADDRESS
          </h2>
        </div>
        {!isEditing && selectedAddress && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="text-[11px] font-heading font-bold uppercase tracking-wider text-[#E2C58A] hover:text-[#F8FAFC] transition-colors cursor-pointer"
          >
            CHANGE ADDRESS
          </button>
        )}
      </div>

      {/* View Mode: Selected Address Card */}
      {!isEditing && selectedAddress ? (
        <div className="p-5 border border-[#E2C58A] bg-[#191D28] relative space-y-2 rounded-xs shadow-[0_0_20px_rgba(226,197,138,0.1)]">
          <div className="flex items-center justify-between">
            <span className="font-heading font-bold text-sm text-[#F8FAFC] tracking-wide uppercase">
              {selectedAddress.full_name}
            </span>
            {selectedAddress.is_default && (
              <span className="text-[9px] font-heading font-bold uppercase tracking-widest px-2.5 py-0.5 bg-[#E2C58A]/20 text-[#E2C58A] border border-[#E2C58A]/40 rounded-xs">
                DEFAULT
              </span>
            )}
          </div>
          <p className="text-xs text-[#94A3B8] leading-relaxed font-body">
            {selectedAddress.line1}
            {selectedAddress.line2 ? `, ${selectedAddress.line2}` : ""}
            <br />
            {selectedAddress.city}, {selectedAddress.state} – {selectedAddress.postal_code}
            <br />
            {selectedAddress.country}
          </p>
          <div className="pt-2 text-[11px] font-mono text-[#64748B] flex items-center gap-2">
            <span className="text-[#E2C58A]">●</span>
            <span className="text-[#94A3B8]">CONTACT: {selectedAddress.phone}</span>
          </div>
        </div>
      ) : (
        /* Edit Mode */
        <div className="space-y-6">
          {/* Saved Addresses List (For Authenticated Users) */}
          {isLoggedIn && savedAddresses.length > 0 && !isAddingNew && (
            <div className="space-y-4">
              <span className="text-xs font-heading font-bold uppercase tracking-wider text-[#F8FAFC] block">
                SELECT A SAVED DELIVERY ADDRESS
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedAddresses.map((addr) => {
                  const isSelected = selectedAddress?.id === addr.id;
                  return (
                    <div
                      key={addr.id}
                      onClick={() => {
                        onSelectAddress(addr);
                        setIsEditing(false);
                      }}
                      className={`p-4 border cursor-pointer transition-all duration-200 rounded-xs ${
                        isSelected
                          ? "border-[#E2C58A] bg-[#191D28] shadow-[0_0_15px_rgba(226,197,138,0.15)] ring-1 ring-[#E2C58A]"
                          : "border-[#232733] bg-[#0A0B0E] hover:border-[#E2C58A]/50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-heading font-bold text-xs uppercase text-[#F8FAFC]">
                          {addr.full_name}
                        </span>
                        {addr.is_default && (
                          <span className="text-[9px] font-heading font-bold text-[#E2C58A]">
                            DEFAULT
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#94A3B8] font-body leading-normal line-clamp-2">
                        {addr.line1}, {addr.city}, {addr.state} {addr.postal_code}
                      </p>
                      <span className="text-[10px] font-mono text-[#64748B] block mt-2">
                        {addr.phone}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(true)}
                  className="text-xs font-heading font-bold uppercase tracking-wider text-[#E2C58A] hover:text-[#F8FAFC] transition-colors flex items-center space-x-1 cursor-pointer"
                >
                  <span>&#43; ADD A NEW DELIVERY ADDRESS</span>
                </button>
              </div>
            </div>
          )}

          {/* Inline Form (Guest OR Authenticated adding new address) */}
          {(!isLoggedIn || savedAddresses.length === 0 || isAddingNew) && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {isLoggedIn && isAddingNew && (
                <div className="flex items-center justify-between pb-2 border-b border-[#232733]">
                  <span className="text-xs font-heading font-bold uppercase tracking-wider text-[#F8FAFC]">
                    ENTER NEW ADDRESS
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsAddingNew(false)}
                    className="text-[11px] font-heading text-[#94A3B8] hover:text-[#F8FAFC] uppercase cursor-pointer"
                  >
                    &larr; BACK TO SAVED
                  </button>
                </div>
              )}

              {formError && (
                <div className="p-3 bg-red-950/50 border border-red-500/40 text-red-300 text-xs font-heading tracking-wide rounded-xs">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-heading font-bold uppercase tracking-widest text-[#94A3B8] mb-1.5">
                    FULL NAME *
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    placeholder="Vijay Shankar"
                    required
                    className="w-full bg-[#0A0B0E] border border-[#232733] px-3.5 py-2.5 text-xs text-[#F8FAFC] font-body placeholder:text-[#64748B] focus:border-[#E2C58A] focus:bg-[#191D28] focus:outline-hidden transition-colors rounded-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-heading font-bold uppercase tracking-widest text-[#94A3B8] mb-1.5">
                    PHONE NUMBER *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="9876543210"
                    required
                    className="w-full bg-[#0A0B0E] border border-[#232733] px-3.5 py-2.5 text-xs text-[#F8FAFC] font-body placeholder:text-[#64748B] focus:border-[#E2C58A] focus:bg-[#191D28] focus:outline-hidden transition-colors rounded-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-heading font-bold uppercase tracking-widest text-[#94A3B8] mb-1.5">
                  STREET ADDRESS (LINE 1) *
                </label>
                <input
                  type="text"
                  name="line1"
                  value={formData.line1}
                  onChange={handleInputChange}
                  placeholder="Apartment, building, street address"
                  required
                  className="w-full bg-[#0A0B0E] border border-[#232733] px-3.5 py-2.5 text-xs text-[#F8FAFC] font-body placeholder:text-[#64748B] focus:border-[#E2C58A] focus:bg-[#191D28] focus:outline-hidden transition-colors rounded-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-heading font-bold uppercase tracking-widest text-[#94A3B8] mb-1.5">
                  APARTMENT / SUITE / LANDMARK (OPTIONAL)
                </label>
                <input
                  type="text"
                  name="line2"
                  value={formData.line2 || ""}
                  onChange={handleInputChange}
                  placeholder="Floor 4, Unit B (Optional)"
                  className="w-full bg-[#0A0B0E] border border-[#232733] px-3.5 py-2.5 text-xs text-[#F8FAFC] font-body placeholder:text-[#64748B] focus:border-[#E2C58A] focus:bg-[#191D28] focus:outline-hidden transition-colors rounded-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[10px] font-heading font-bold uppercase tracking-widest text-[#94A3B8]">
                      PIN CODE *
                    </label>
                    <span className="text-[9px] font-mono text-[#E2C58A]">6 Digits</span>
                  </div>
                  <input
                    type="text"
                    name="postal_code"
                    maxLength={6}
                    value={formData.postal_code}
                    onChange={handleInputChange}
                    placeholder="641601"
                    required
                    className="w-full bg-[#0A0B0E] border border-[#232733] px-3.5 py-2.5 text-xs text-[#F8FAFC] font-mono placeholder:text-[#64748B] focus:border-[#E2C58A] focus:bg-[#191D28] focus:outline-hidden transition-colors rounded-xs"
                  />
                  {pincodeDetectedNotice && (
                    <p className="text-[10px] font-mono text-emerald-400 mt-1 flex items-center gap-1">
                      <span>✓</span> {pincodeDetectedNotice}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-heading font-bold uppercase tracking-widest text-[#94A3B8] mb-1.5">
                    CITY / DISTRICT *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Tirupur"
                    required
                    className="w-full bg-[#0A0B0E] border border-[#232733] px-3.5 py-2.5 text-xs text-[#F8FAFC] font-body placeholder:text-[#64748B] focus:border-[#E2C58A] focus:bg-[#191D28] focus:outline-hidden transition-colors rounded-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-heading font-bold uppercase tracking-widest text-[#94A3B8] mb-1.5">
                    STATE *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="Tamil Nadu"
                    required
                    className="w-full bg-[#0A0B0E] border border-[#232733] px-3.5 py-2.5 text-xs text-[#F8FAFC] font-body placeholder:text-[#64748B] focus:border-[#E2C58A] focus:bg-[#191D28] focus:outline-hidden transition-colors rounded-xs"
                  />
                </div>
              </div>

              {isLoggedIn && (
                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="checkbox"
                    id="is_default"
                    name="is_default"
                    checked={formData.is_default || false}
                    onChange={handleInputChange}
                    className="w-4 h-4 accent-[#E2C58A] bg-[#0A0B0E] rounded-xs border-[#232733]"
                  />
                  <label
                    htmlFor="is_default"
                    className="text-xs font-heading text-[#94A3B8] uppercase tracking-wide cursor-pointer"
                  >
                    SAVE AS DEFAULT SHIPPING ADDRESS
                  </label>
                </div>
              )}

              <div className="pt-2 flex items-center gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className="px-7 py-3.5 bg-gradient-to-r from-[#E2C58A] to-[#C6A467] hover:brightness-110 text-[#0A0B0E] font-heading text-xs font-black uppercase tracking-widest transition-all duration-200 rounded-full shadow-[0_0_20px_rgba(226,197,138,0.25)] disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? "SAVING ADDRESS..." : "DELIVER TO THIS ADDRESS"}
                </button>
                {selectedAddress && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setIsAddingNew(false);
                    }}
                    className="text-xs font-heading text-[#94A3B8] hover:text-[#F8FAFC] uppercase tracking-wider cursor-pointer"
                  >
                    CANCEL
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
