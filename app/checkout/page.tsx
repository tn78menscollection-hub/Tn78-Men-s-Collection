"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AddressDto,
  AddressCreateDto,
  CheckoutSummaryDto,
  ShippingMethodDto,
  PaymentCreateResponse,
  PaymentVerifyResponse,
  createPaymentOrder,
  getCheckoutSummary,
  getShippingMethods,
  updateCheckout,
  getStoredAuthToken,
  getCurrentUser,
  loginCustomer,
  registerCustomer,
  logoutCustomer,
  UserOutDto,
} from "@/lib/api";
import AddressSection from "@/components/checkout/AddressSection";
import ShippingMethodSelector from "@/components/checkout/ShippingMethodSelector";
import CouponInput from "@/components/checkout/CouponInput";
import GiftPackagingSection, { GiftOptions } from "@/components/checkout/GiftPackagingSection";
import OrderSummary from "@/components/checkout/OrderSummary";
import PaymentModal from "@/components/checkout/PaymentModal";
import { useCartWishlist } from "@/lib/cartWishlistContext";
import { useToast } from "@/components/ui/Toast";

export default function CheckoutPage() {
  const router = useRouter();
  const { refreshCart } = useCartWishlist();
  const { showToast } = useToast();
  const [summary, setSummary] = useState<CheckoutSummaryDto | null>(null);
  const [shippingMethods, setShippingMethods] = useState<ShippingMethodDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Authentication states (Mandatory login before ordering - Max / Myntra model)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserOutDto | null>(null);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [authEmail, setAuthEmail] = useState<string>("");
  const [authPassword, setAuthPassword] = useState<string>("");
  const [regFullName, setRegFullName] = useState<string>("");
  const [regPhone, setRegPhone] = useState<string>("");
  const [regEmail, setRegEmail] = useState<string>("");
  const [regPassword, setRegPassword] = useState<string>("");
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  // Payment states (Prepaid UPI & Reference Verification)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [paymentOrder, setPaymentOrder] = useState<PaymentCreateResponse | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isCreatingPayment, setIsCreatingPayment] = useState<boolean>(false);

  // Check customer authentication
  const checkAuth = useCallback(async () => {
    const token = getStoredAuthToken();
    if (!token) {
      setIsLoggedIn(false);
      setCurrentUser(null);
      return;
    }
    try {
      const user = await getCurrentUser();
      setCurrentUser(user);
      setIsLoggedIn(true);
    } catch {
      setIsLoggedIn(false);
      setCurrentUser(null);
    }
  }, []);

  // Load initial checkout draft and rates
  const loadCheckoutState = useCallback(async () => {
    try {
      setIsLoading(true);
      setGeneralError(null);
      const draft = await getCheckoutSummary();
      setSummary(draft);

      const draftPin = draft.shipping_address?.postal_code;
      const draftState = draft.shipping_address?.state;
      const methods = await getShippingMethods(draft.subtotal, draftPin, draftState);
      setShippingMethods(methods);

      // If cart has items but no shipping method selected, default to standard
      let currentDraft = draft;
      if (!currentDraft.shipping_method && methods.length > 0 && currentDraft.items.length > 0) {
        currentDraft = await updateCheckout({
          shipping_method_code: "standard",
        });
        setSummary(currentDraft);
      }

      // Auto-apply pending coupon (e.g. ENSEMBLE10 from Outfit Builder) with expiry validation
      if (typeof window !== "undefined" && !currentDraft.applied_coupon && currentDraft.items.length > 0) {
        const rawPendingCoupon = localStorage.getItem("tn78_pending_coupon");
        if (rawPendingCoupon) {
          let couponCode: string | null = null;
          try {
            if (rawPendingCoupon.startsWith("{")) {
              const parsed = JSON.parse(rawPendingCoupon);
              if (parsed.expiresAt && Date.now() <= parsed.expiresAt) {
                couponCode = parsed.code;
              } else {
                localStorage.removeItem("tn78_pending_coupon");
              }
            } else {
              couponCode = rawPendingCoupon;
            }
          } catch {
            couponCode = rawPendingCoupon;
          }

          if (couponCode) {
            try {
              const withCoupon = await updateCheckout({ coupon_code: couponCode });
              setSummary(withCoupon);
              localStorage.removeItem("tn78_pending_coupon");
            } catch (couponErr: unknown) {
              console.warn("Could not auto-apply pending coupon:", couponErr);
            }
          }
        }
      }
    } catch (err: unknown) {
      console.error("Failed to initialize checkout:", err);
      const message = err instanceof Error ? err.message : "Failed to retrieve checkout session.";
      setGeneralError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
    loadCheckoutState();
  }, [checkAuth, loadCheckoutState]);

  // Auth Handlers
  const handleAuthLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);
    setAuthLoading(true);

    try {
      await loginCustomer({
        email: authEmail.trim(),
        password: authPassword,
      });
      await checkAuth();
      await refreshCart();
      await loadCheckoutState();
      setAuthSuccess("Authentication confirmed. Welcome to TN78.");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Invalid email or password.";
      setAuthError(message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleAuthRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    if (regPassword.length < 8) {
      setAuthError("Password must be at least 8 characters long.");
      return;
    }
    const cleanPhone = regPhone.replace(/[^0-9]/g, "");
    if (!cleanPhone || cleanPhone.length < 10) {
      setAuthError("Please provide a valid 10-digit mobile phone number.");
      return;
    }

    setAuthLoading(true);

    try {
      await registerCustomer({
        full_name: regFullName.trim(),
        email: regEmail.trim(),
        password: regPassword,
        phone: cleanPhone,
      });
      await checkAuth();
      await refreshCart();
      await loadCheckoutState();
      setAuthSuccess("Account registered successfully. Proceeding to delivery details.");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to register account. Email may already be registered.";
      setAuthError(message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSwitchAccount = () => {
    logoutCustomer();
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  // Handle address selection (from saved book)
  const handleSelectAddress = async (address: AddressDto) => {
    try {
      setIsUpdating(true);
      const updated = await updateCheckout({
        shipping_address_id: address.id,
      });
      setSummary(updated);

      // Re-fetch shipping methods tailored to this address location
      const methods = await getShippingMethods(updated.subtotal, address.postal_code, address.state);
      setShippingMethods(methods);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Could not select delivery address.";
      console.error("Failed to select address:", err);
      showToast(msg, "error");
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle inline address save (guest or new address)
  const handleSaveInlineAddress = async (addressData: AddressCreateDto) => {
    try {
      setIsUpdating(true);
      const updated = await updateCheckout({
        guest_address: addressData,
      });
      setSummary(updated);

      // Re-fetch shipping methods tailored to this address location
      const methods = await getShippingMethods(updated.subtotal, addressData.postal_code, addressData.state);
      setShippingMethods(methods);
    } catch (err: unknown) {
      console.error("Failed to save address:", err);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  // Pre-fetch and preview zone-based shipping methods dynamically when 6-digit pincode is typed
  const handlePincodeDetected = useCallback(
    async (pincode: string, state: string) => {
      try {
        if (!summary) return;
        const methods = await getShippingMethods(summary.subtotal, pincode, state);
        setShippingMethods(methods);
        const standardMethod = methods.find((m) => m.code.toLowerCase() === "standard") || methods[0];
        if (standardMethod) {
          setSummary((prev) => {
            if (!prev) return prev;
            const currentCode = prev.shipping_method?.code?.toLowerCase() || "standard";
            const matched = methods.find((m) => m.code.toLowerCase() === currentCode) || standardMethod;
            const newShippingCost = matched.cost;
            const newTotal = Math.max(
              0,
              Math.round(
                (prev.subtotal -
                  (prev.discount_amount || 0) -
                  (prev.points_discount_amount || 0) +
                  newShippingCost +
                  (prev.gift_package_fee || 0)) *
                  100
              ) / 100
            );
            return {
              ...prev,
              shipping_method: matched,
              shipping_cost: newShippingCost,
              total: newTotal,
            };
          });
        }
      } catch (err) {
        console.warn("Could not preview shipping methods for pincode:", err);
      }
    },
    [summary]
  );

  // Handle shipping method selection
  const handleSelectShippingMethod = async (code: string) => {
    try {
      setIsUpdating(true);
      const updated = await updateCheckout({
        shipping_method_code: code,
      });
      setSummary(updated);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Could not set shipping method.";
      console.error("Failed to update shipping method:", err);
      showToast(msg, "error");
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle gift packaging options
  const handleUpdateGiftOptions = async (options: GiftOptions) => {
    try {
      setIsUpdating(true);
      const updated = await updateCheckout({
        is_gift_package: options.is_gift_package,
        gift_recipient_name: options.gift_recipient_name,
        gift_sender_name: options.gift_sender_name,
        gift_message: options.gift_message,
        gift_hide_price: options.gift_hide_price,
      });
      setSummary(updated);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Could not update gift packaging options.";
      console.error("Failed to update gift packaging:", err);
      showToast(msg, "error");
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle coupon application
  const handleApplyCoupon = async (code: string) => {
    try {
      setIsUpdating(true);
      const updated = await updateCheckout({
        coupon_code: code,
      });
      setSummary(updated);
    } catch (err: unknown) {
      console.error("Failed to apply coupon:", err);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle coupon removal
  const handleRemoveCoupon = async () => {
    try {
      setIsUpdating(true);
      const updated = await updateCheckout({
        coupon_code: "",
      });
      setSummary(updated);
    } catch (err: unknown) {
      console.error("Failed to remove coupon:", err);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle loyalty points redemption
  const handleApplyPoints = async (points: number) => {
    try {
      setIsUpdating(true);
      const updated = await updateCheckout({
        points_to_redeem: points,
      });
      setSummary(updated);
    } catch (err: unknown) {
      console.error("Failed to apply rewards points:", err);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemovePoints = async () => {
    try {
      setIsUpdating(true);
      const updated = await updateCheckout({
        points_to_redeem: 0,
      });
      setSummary(updated);
    } catch (err: unknown) {
      console.error("Failed to remove rewards points:", err);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  // Initiate payment order with server-side validation & mandatory login check
  const handleContinueToPayment = async () => {
    if (!isLoggedIn) {
      setAuthError("Customer account authentication is required before placing an order.");
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 120, behavior: "smooth" });
      }
      return;
    }

    try {
      setIsCreatingPayment(true);
      setPaymentError(null);
      const order = await createPaymentOrder();
      setPaymentOrder(order);
      setIsPaymentModalOpen(true);
    } catch (err: unknown) {
      console.error("Failed to initiate payment:", err);
      const message = err instanceof Error ? err.message : "Failed to initialize payment gateway.";
      setPaymentError(message);
    } finally {
      setIsCreatingPayment(false);
    }
  };

  // Payment verified and captured
  const handlePaymentSuccess = async (verifyResponse: PaymentVerifyResponse) => {
    setIsPaymentModalOpen(false);
    try {
      await refreshCart();
    } catch (e) {
      console.error("Cart refresh failed:", e);
    }
    const orderNum = verifyResponse.order_number || "";
    router.push(
      `/checkout/confirmation?order_number=${encodeURIComponent(orderNum)}&payment_id=${verifyResponse.payment_id}&order_id=${verifyResponse.gateway_order_id}&amount=${verifyResponse.amount}&status=${verifyResponse.status}`
    );
  };

  // Payment failed or declined
  const handlePaymentFailure = (errorMsg: string) => {
    setPaymentError(errorMsg);
  };

  return (
    <div className="bg-[#0A0B0E] min-h-screen text-[#F8FAFC] pb-28">
      {/* Breadcrumb Header */}
      <div className="border-b border-[#232733] bg-[#0A0B0E]/90 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center space-x-2 text-[10px] font-heading font-bold uppercase tracking-widest text-[#94A3B8]">
          <Link href="/" className="hover:text-[#F8FAFC] transition-colors">
            HOME
          </Link>
          <span>/</span>
          <Link href="/cart" className="hover:text-[#F8FAFC] transition-colors">
            SHOPPING BAG
          </Link>
          <span>/</span>
          <span className="text-[#E2C58A]">CHECKOUT</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12">
        {/* Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-[#232733] pb-6 mb-8 gap-2">
          <div>
            <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-[#E2C58A]">
              SECURE CHECKOUT &bull; BESPOKE MENSWEAR
            </span>
            <h1 className="font-heading font-black text-2xl sm:text-3xl md:text-4xl uppercase tracking-wider text-[#F8FAFC] mt-1">
              DISPATCH &amp; SETTLEMENT
            </h1>
          </div>
          <div className="flex items-center space-x-2 text-xs font-heading text-[#94A3B8]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
            <span className="uppercase tracking-wider">256-BIT ENCRYPTED SESSION</span>
          </div>
        </div>

        {/* Global Loading Spinner */}
        {isLoading && !summary ? (
          <div className="py-24 text-center">
            <div className="w-8 h-8 border-2 border-[#E2C58A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-xs font-heading font-bold uppercase tracking-widest text-[#94A3B8]">
              INITIALIZING CHECKOUT...
            </p>
          </div>
        ) : generalError ? (
          <div className="py-16 text-center max-w-md mx-auto space-y-4">
            <p className="text-sm font-heading uppercase text-red-400">{generalError}</p>
            <button
              type="button"
              onClick={loadCheckoutState}
              className="px-7 py-3.5 bg-gradient-to-r from-[#E2C58A] to-[#C6A467] hover:brightness-110 text-[#0A0B0E] font-heading text-xs uppercase tracking-widest font-black rounded-full shadow-[0_0_20px_rgba(226,197,138,0.3)] transition-all cursor-pointer"
            >
              RETRY CHECKOUT
            </button>
          </div>
        ) : !summary || summary.items.length === 0 ? (
          /* Empty Bag Warning */
          <div className="py-20 md:py-28 text-center max-w-xl mx-auto space-y-6">
            <div className="w-16 h-16 border border-[#232733] rounded-full flex items-center justify-center mx-auto text-[#E2C58A] bg-[#13151C] shadow-lg">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div className="space-y-2">
              <h2 className="font-heading font-bold text-xl uppercase tracking-wider text-[#F8FAFC]">
                NO ITEMS IN SHOPPING BAG
              </h2>
              <p className="text-xs font-body text-[#94A3B8] leading-relaxed max-w-md mx-auto">
                Your checkout session has no reserved garments. Please explore our curated
                collection to add items to your shopping bag before proceeding.
              </p>
            </div>
            <div className="pt-4">
              <Link
                href="/shop"
                className="px-8 py-4 bg-gradient-to-r from-[#E2C58A] to-[#C6A467] hover:brightness-110 text-[#0A0B0E] font-heading text-xs font-black uppercase tracking-widest transition-all duration-200 inline-block rounded-full shadow-[0_0_20px_rgba(226,197,138,0.3)]"
              >
                DISCOVER THE COLLECTION
              </Link>
            </div>
          </div>
        ) : (
          /* Main Two-Column Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left 7-8 Columns: Steps Form */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-8">
              {/* Step 1: Customer Authentication (Mandatory - Max Website Model) */}
              {!isLoggedIn ? (
                <div className="bg-[#13151C] border-2 border-[#E2C58A]/80 p-6 md:p-8 rounded-2xl shadow-2xl space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#E2C58A]/5 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="border-b border-[#232733] pb-4">
                    <span className="text-[10px] font-heading font-extrabold uppercase tracking-widest text-[#E2C58A] bg-[#E2C58A]/10 px-2.5 py-1 rounded-full border border-[#E2C58A]/30">
                      STEP 01 &bull; MANDATORY CUSTOMER VERIFICATION
                    </span>
                    <h2 className="font-heading font-black text-xl sm:text-2xl uppercase tracking-wider text-white mt-2">
                      Sign In or Register to Place Order
                    </h2>
                    <p className="text-xs font-body text-slate-400 mt-1 leading-relaxed">
                      Just like premier luxury fashion portals, an authenticated account with verified full name, 10-digit mobile number, and email is required to reserve garments and dispatch orders.
                    </p>
                  </div>

                  {/* Auth Switch Tabs */}
                  <div className="bg-[#0A0B0E] p-1 rounded-xl border border-[#232733] flex">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthTab("login");
                        setAuthError(null);
                      }}
                      className={`flex-1 py-2 text-xs font-heading font-black uppercase tracking-wider rounded-lg transition-all ${
                        authTab === "login"
                          ? "bg-[#E2C58A] text-[#0A0B0E] shadow-sm"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Existing Customer: Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthTab("register");
                        setAuthError(null);
                      }}
                      className={`flex-1 py-2 text-xs font-heading font-black uppercase tracking-wider rounded-lg transition-all ${
                        authTab === "register"
                          ? "bg-[#E2C58A] text-[#0A0B0E] shadow-sm"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      New Customer: Register
                    </button>
                  </div>

                  {authError && (
                    <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-red-300 text-xs font-heading uppercase text-center">
                      {authError}
                    </div>
                  )}

                  {authSuccess && (
                    <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-heading uppercase text-center animate-pulse">
                      {authSuccess}
                    </div>
                  )}

                  {authTab === "login" ? (
                    <form onSubmit={handleAuthLogin} className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-heading font-extrabold uppercase tracking-widest text-[#E2C58A] mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          required
                          value={authEmail}
                          onChange={(e) => setAuthEmail(e.target.value)}
                          placeholder="client@tn78.com"
                          className="w-full bg-[#0A0B0E] border border-[#232733] focus:border-[#E2C58A] rounded-lg px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-heading font-extrabold uppercase tracking-widest text-[#E2C58A] mb-1">
                          Password
                        </label>
                        <input
                          type="password"
                          required
                          value={authPassword}
                          onChange={(e) => setAuthPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-[#0A0B0E] border border-[#232733] focus:border-[#E2C58A] rounded-lg px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-hidden"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={authLoading}
                        className="w-full py-3.5 bg-gradient-to-r from-[#E2C58A] to-[#C6A467] text-[#0A0B0E] font-heading text-xs font-black uppercase tracking-widest rounded-lg shadow-[0_0_20px_rgba(226,197,138,0.25)] hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
                      >
                        {authLoading ? "Verifying..." : "Sign In & Unlock Delivery Details →"}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleAuthRegister} className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-heading font-extrabold uppercase tracking-widest text-[#E2C58A] mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          required
                          value={regFullName}
                          onChange={(e) => setRegFullName(e.target.value)}
                          placeholder="e.g. Senthil Nathan"
                          className="w-full bg-[#0A0B0E] border border-[#232733] focus:border-[#E2C58A] rounded-lg px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-heading font-extrabold uppercase tracking-widest text-[#E2C58A] mb-1">
                          10-Digit Mobile Number (For Delivery Confirmation)
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-xs text-slate-500 font-mono">
                            +91
                          </span>
                          <input
                            type="tel"
                            required
                            maxLength={10}
                            value={regPhone}
                            onChange={(e) => setRegPhone(e.target.value.replace(/[^0-9]/g, ""))}
                            placeholder="9876543210"
                            className="w-full bg-[#0A0B0E] border border-[#232733] focus:border-[#E2C58A] rounded-lg pl-12 pr-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-hidden font-mono"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-heading font-extrabold uppercase tracking-widest text-[#E2C58A] mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          required
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="client@tn78.com"
                          className="w-full bg-[#0A0B0E] border border-[#232733] focus:border-[#E2C58A] rounded-lg px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-heading font-extrabold uppercase tracking-widest text-[#E2C58A] mb-1">
                          Password (Min 8 Characters)
                        </label>
                        <input
                          type="password"
                          required
                          minLength={8}
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-[#0A0B0E] border border-[#232733] focus:border-[#E2C58A] rounded-lg px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-hidden"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={authLoading}
                        className="w-full py-3.5 bg-gradient-to-r from-[#E2C58A] to-[#C6A467] text-[#0A0B0E] font-heading text-xs font-black uppercase tracking-widest rounded-lg shadow-[0_0_20px_rgba(226,197,138,0.25)] hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
                      >
                        {authLoading ? "Creating Profile..." : "Register & Unlock Delivery Details →"}
                      </button>
                    </form>
                  )}
                </div>
              ) : (
                /* Authenticated State Header */
                <div className="bg-[#13151C] border border-emerald-500/40 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-sm">
                      ✓
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-heading font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                          Verified Client Account
                        </span>
                        <span className="text-xs font-heading font-bold text-white">
                          {currentUser?.full_name}
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                        {currentUser?.email} {currentUser?.phone ? `• +91 ${currentUser.phone}` : ""}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleSwitchAccount}
                    className="text-[11px] font-heading font-bold uppercase tracking-wider text-[#E2C58A] hover:text-white transition-colors cursor-pointer"
                  >
                    Switch Account &rarr;
                  </button>
                </div>
              )}

              {/* Step 2: Delivery Address (Locked if not logged in) */}
              <div className={`transition-all duration-300 ${!isLoggedIn ? "opacity-40 pointer-events-none filter blur-[1px]" : ""}`}>
                <AddressSection
                  selectedAddress={summary.shipping_address || null}
                  onSelectAddress={handleSelectAddress}
                  onSaveInlineAddress={handleSaveInlineAddress}
                  onPincodeDetected={handlePincodeDetected}
                  isLoading={isUpdating}
                />
              </div>

              {/* Step 3: Shipping Method */}
              <div className={`transition-all duration-300 ${!isLoggedIn ? "opacity-40 pointer-events-none" : ""}`}>
                <ShippingMethodSelector
                  methods={shippingMethods}
                  selectedCode={summary.shipping_method?.code || null}
                  onSelectMethod={handleSelectShippingMethod}
                  subtotal={summary.subtotal}
                  isLoading={isUpdating}
                />
              </div>

              {/* Step 4: Luxury Gift Packaging & Calligraphy Note */}
              <div className={`transition-all duration-300 ${!isLoggedIn ? "opacity-40 pointer-events-none" : ""}`}>
                <GiftPackagingSection
                  initialOptions={{
                    is_gift_package: summary.is_gift_package,
                    gift_recipient_name: summary.gift_recipient_name,
                    gift_sender_name: summary.gift_sender_name,
                    gift_message: summary.gift_message,
                    gift_hide_price: summary.gift_hide_price,
                  }}
                  subtotal={summary.subtotal}
                  giftPackageFee={summary.gift_package_fee}
                  isLoading={isUpdating}
                  onUpdateGift={handleUpdateGiftOptions}
                />
              </div>

              {/* Step 5: Promotional Code */}
              <div className={`transition-all duration-300 ${!isLoggedIn ? "opacity-40 pointer-events-none" : ""}`}>
                <CouponInput
                  appliedCoupon={summary.applied_coupon}
                  discountAmount={summary.discount_amount}
                  onApplyCoupon={handleApplyCoupon}
                  onRemoveCoupon={handleRemoveCoupon}
                  isLoading={isUpdating}
                />
              </div>


            </div>

            {/* Right 4-5 Columns: Sticky Order Summary */}
            <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24 space-y-6">
              <OrderSummary
                items={summary.items}
                subtotal={summary.subtotal}
                discountAmount={summary.discount_amount}
                appliedCoupon={summary.applied_coupon}
                pointsDiscountAmount={summary.points_discount_amount}
                pointsRedeemed={summary.points_to_redeem}
                shippingMethod={summary.shipping_method}
                shippingCost={summary.shipping_cost}
                isGiftPackage={summary.is_gift_package}
                giftPackageFee={summary.gift_package_fee}
                total={summary.total}
                hasAddress={Boolean(summary.shipping_address)}
                hasShippingMethod={Boolean(summary.shipping_method)}
                isReadyForPayment={summary.is_ready_for_payment && isLoggedIn}
                isLoading={isUpdating || isCreatingPayment}
                onContinueToPayment={handleContinueToPayment}
              />

              {/* Payment Failure / Error Banner */}
              {paymentError && (
                <div className="p-4 bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-heading space-y-2 animate-fadeIn shadow-lg rounded-xl">
                  <div className="flex items-center space-x-2">
                    <span className="text-red-400 font-black text-sm">&#9888;</span>
                    <span className="font-extrabold uppercase tracking-wide text-red-200">
                      SETTLEMENT ISSUE
                    </span>
                  </div>
                  <p className="text-[#CBD5E1] font-body text-[11px] leading-relaxed">
                    {paymentError}
                  </p>
                  <button
                    type="button"
                    onClick={() => setPaymentError(null)}
                    className="text-[10px] font-heading font-bold uppercase tracking-wider text-red-400 hover:text-red-300 pt-1 block cursor-pointer"
                  >
                    DISMISS &times;
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Prepaid Settlement Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        orderData={paymentOrder}
        onSuccess={handlePaymentSuccess}
        onFailure={handlePaymentFailure}
        onClose={() => setIsPaymentModalOpen(false)}
      />
    </div>
  );
}
