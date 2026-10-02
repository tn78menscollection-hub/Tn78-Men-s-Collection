"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { loginCustomer, registerCustomer, getStoredAuthToken, getCurrentUser } from "@/lib/api";
import { useCartWishlist } from "@/lib/cartWishlistContext";

function AccountLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshCart } = useCartWishlist();

  const redirectUrl = searchParams.get("redirect") || "/account/orders";
  const [tab, setTab] = useState<"login" | "register">("login");

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form state
  const [regFullName, setRegFullName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetStatus, setResetStatus] = useState<string | null>(null);

  // If user is already authenticated, redirect them
  useEffect(() => {
    const token = getStoredAuthToken();
    if (token) {
      getCurrentUser()
        .then(() => {
          router.replace(redirectUrl);
        })
        .catch(() => {
          // Token expired or invalid, stay on login
        });
    }
  }, [router, redirectUrl]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      await loginCustomer({
        email: loginEmail.trim(),
        password: loginPassword,
      });

      await refreshCart();
      setSuccessMessage("Authentication verified. Redirecting to your account portal...");
      setTimeout(() => {
        router.push(redirectUrl);
      }, 700);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Invalid email or password credentials.";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Basic validation
    if (regPassword.length < 8) {
      setErrorMessage("Password must contain at least 8 characters.");
      return;
    }

    const cleanPhone = regPhone.replace(/[^0-9]/g, "");
    if (cleanPhone && cleanPhone.length < 10) {
      setErrorMessage("Please provide a valid 10-digit mobile phone number.");
      return;
    }

    setIsLoading(true);

    try {
      await registerCustomer({
        full_name: regFullName.trim(),
        email: regEmail.trim(),
        password: regPassword,
        phone: cleanPhone || undefined,
      });

      await refreshCart();
      setSuccessMessage("Client account created successfully. Welcome to TN78.");
      setTimeout(() => {
        router.push(redirectUrl);
      }, 800);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create account. Email may already be in use.";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
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
          <span className="text-[#E2C58A]">CLIENT LOGIN</span>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-12 sm:pt-16">
        {/* Brand Crest */}
        <div className="text-center space-y-2 mb-8">
          <div className="w-14 h-14 rounded-full bg-[#13151C] border border-[#232733] flex items-center justify-center mx-auto text-[#E2C58A] font-heading font-black text-lg shadow-[0_0_20px_rgba(226,197,138,0.15)]">
            TN78
          </div>
          <h1 className="font-heading font-black text-2xl uppercase tracking-wider text-white">
            Client Account
          </h1>
          <p className="text-xs font-body text-slate-400">
            Sign in or create your profile to track commissions, manage delivery addresses, and enjoy seamless checkout.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="bg-[#13151C] p-1 rounded-xl border border-[#232733] flex mb-6">
          <button
            type="button"
            onClick={() => {
              setTab("login");
              setErrorMessage(null);
            }}
            className={`flex-1 py-2.5 text-xs font-heading font-black uppercase tracking-wider rounded-lg transition-all ${
              tab === "login"
                ? "bg-[#E2C58A] text-[#0A0B0E] shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("register");
              setErrorMessage(null);
            }}
            className={`flex-1 py-2.5 text-xs font-heading font-black uppercase tracking-wider rounded-lg transition-all ${
              tab === "register"
                ? "bg-[#E2C58A] text-[#0A0B0E] shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Status Alerts */}
        {errorMessage && (
          <div className="mb-6 p-3.5 bg-red-950/60 border border-red-500/40 rounded-xl text-red-300 text-xs font-heading uppercase tracking-wide text-center">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="mb-6 p-3.5 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-heading uppercase tracking-wide text-center animate-pulse">
            {successMessage}
          </div>
        )}

        {/* Main Card */}
        <div className="bg-[#13151C] border border-[#232733] rounded-2xl p-6 sm:p-8 shadow-2xl">
          {tab === "login" ? (
            /* Login Form */
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[10px] font-heading font-extrabold uppercase tracking-widest text-[#E2C58A] mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="client@tn78.com"
                  className="w-full bg-[#0A0B0E] border border-[#232733] focus:border-[#E2C58A] rounded-lg px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-hidden transition-colors"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-[10px] font-heading font-extrabold uppercase tracking-widest text-[#E2C58A]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setResetEmail(loginEmail);
                      setIsForgotPasswordOpen(true);
                    }}
                    className="text-[10px] font-heading font-bold text-[#E2C58A] hover:text-white transition-colors uppercase tracking-wider cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#0A0B0E] border border-[#232733] focus:border-[#E2C58A] rounded-lg px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-hidden transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3.5 bg-gradient-to-r from-[#E2C58A] to-[#C6A467] text-[#0A0B0E] font-heading text-xs font-black uppercase tracking-widest rounded-lg shadow-[0_0_20px_rgba(226,197,138,0.25)] hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? "Verifying Credentials..." : "Sign In & Continue →"}
              </button>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-[10px] font-heading font-extrabold uppercase tracking-widest text-[#E2C58A] mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  placeholder="e.g. Senthil Nathan"
                  className="w-full bg-[#0A0B0E] border border-[#232733] focus:border-[#E2C58A] rounded-lg px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-hidden transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-heading font-extrabold uppercase tracking-widest text-[#E2C58A] mb-1.5">
                  Mobile Number (10 Digits)
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
                    className="w-full bg-[#0A0B0E] border border-[#232733] focus:border-[#E2C58A] rounded-lg pl-12 pr-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-hidden transition-colors font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-heading font-extrabold uppercase tracking-widest text-[#E2C58A] mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="client@tn78.com"
                  className="w-full bg-[#0A0B0E] border border-[#232733] focus:border-[#E2C58A] rounded-lg px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-hidden transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-heading font-extrabold uppercase tracking-widest text-[#E2C58A] mb-1.5">
                  Set Password (Min 8 Characters)
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#0A0B0E] border border-[#232733] focus:border-[#E2C58A] rounded-lg px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-hidden transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3.5 bg-gradient-to-r from-[#E2C58A] to-[#C6A467] text-[#0A0B0E] font-heading text-xs font-black uppercase tracking-widest rounded-lg shadow-[0_0_20px_rgba(226,197,138,0.25)] hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? "Creating Profile..." : "Create Account & Continue →"}
              </button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-[#232733] text-center">
            <p className="text-[11px] text-slate-400 font-body">
              By continuing, you agree to TN78 Men&apos;s Collection Terms of Service and Delivery Policy.
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Recovery Modal */}
      {isForgotPasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#13151C] border border-[#232733] max-w-md w-full p-6 sm:p-7 space-y-4 rounded-xl shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#232733] pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-[#E2C58A] font-bold text-sm">✦</span>
                <h3 className="font-heading font-black text-sm uppercase tracking-wider text-white">
                  Client Password Assistance
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsForgotPasswordOpen(false);
                  setResetStatus(null);
                }}
                className="p-1 text-slate-400 hover:text-white rounded-md transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-xs text-slate-300 font-body leading-relaxed">
              To protect client order history and private styling records, account recovery is verified directly through our private Atelier Concierge desk.
            </p>

            <div>
              <label className="block text-[10px] font-heading font-bold uppercase tracking-widest text-[#E2C58A] mb-1">
                Registered Email or Phone
              </label>
              <input
                type="text"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="your.email@example.com or 10-digit mobile"
                className="w-full bg-[#0A0B0E] border border-[#232733] focus:border-[#E2C58A] rounded-lg px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-hidden"
              />
            </div>

            {resetStatus && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-lg text-emerald-300 text-xs font-mono">
                {resetStatus}
              </div>
            )}

            <div className="pt-2 space-y-2">
              <a
                href={`https://wa.me/917010418046?text=${encodeURIComponent(
                  `Hello TN78 Atelier Concierge, I need assistance recovering my client account password for: ${resetEmail || "[not specified]"}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setResetStatus("Opening WhatsApp Atelier Concierge for instant verification.")}
                className="w-full py-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-heading text-xs font-black uppercase tracking-wider rounded-lg flex items-center justify-center space-x-2 transition-all shadow-md cursor-pointer"
              >
                <span>Connect via WhatsApp Concierge</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.174.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.144.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824z" />
                </svg>
              </a>

              <button
                type="button"
                onClick={() => {
                  setIsForgotPasswordOpen(false);
                  setResetStatus(null);
                }}
                className="w-full py-2 text-slate-400 hover:text-white text-xs font-heading uppercase tracking-wider cursor-pointer"
              >
                Return to Sign In
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AccountLoginPage() {
  return (
    <React.Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-xs font-mono text-[#E2C58A]">AUTHENTICATING...</div>}>
      <AccountLoginForm />
    </React.Suspense>
  );
}
