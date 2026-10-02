"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { loginUser } from "@/lib/api";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    try {
      await loginUser(email.trim(), password);
      // Ensure target destination is safe
      const target =
        redirectUrl.startsWith("/admin") && redirectUrl !== "/admin/login"
          ? redirectUrl
          : "/admin";
      router.push(target);
      router.refresh();
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Authentication failed. Please verify email and password.";
      setLoginError(message);
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-6 text-[#1A1816]">
      <div className="max-w-md w-full bg-white border border-[#EFECE6] p-8 sm:p-10 rounded-2xl shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-heading font-extrabold uppercase tracking-widest text-[#9E6544] bg-[#9E6544]/10 border border-[#9E6544]/20 px-3 py-1 rounded-full inline-block">
            TN78 Executive Portal &bull; Staff Access
          </span>
          <h1 className="font-heading text-2xl font-black uppercase tracking-wider text-[#1A1816]">
            Administrative Sign In
          </h1>
          <p className="text-xs text-[#78716C] font-body leading-relaxed max-w-xs mx-auto">
            Administrative authentication required to access fulfillment operations.
          </p>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          {loginError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
              {loginError}
            </div>
          )}
          <div>
            <label className="block text-[10px] font-heading font-bold uppercase tracking-widest text-[#78716C] mb-1.5">
              Staff Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@tn78.in"
              className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-xl px-4 py-3 text-xs text-[#1A1816] placeholder-[#A8A29E] focus:bg-white focus:border-[#9E6544] focus:outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-[10px] font-heading font-bold uppercase tracking-widest text-[#78716C] mb-1.5">
              Security Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-xl px-4 py-3 text-xs text-[#1A1816] placeholder-[#A8A29E] focus:bg-white focus:border-[#9E6544] focus:outline-none transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loginLoading}
            className="w-full bg-[#D5C0A5] hover:bg-[#C4AC8F] text-[#1A1816] font-heading text-xs font-black uppercase tracking-widest py-3.5 rounded-full shadow-sm transition-all duration-150 disabled:opacity-50 cursor-pointer"
          >
            {loginLoading ? "Authenticating..." : "Sign In to Backoffice"}
          </button>
        </form>

        <div className="pt-4 border-t border-[#EFECE6] flex items-center justify-between text-xs">
          <Link
            href="/"
            className="text-[#9E6544] hover:underline font-heading text-[11px] font-bold tracking-wider uppercase ml-auto"
          >
            &larr; Return to Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#9E6544] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
