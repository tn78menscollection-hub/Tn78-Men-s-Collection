"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  clearStoredAuthToken,
  getCurrentUser,
  getStoredAuthToken,
  loginUser,
  UserProfile,
} from "@/lib/api";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Inline login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const checkAuth = async () => {
    if (pathname === "/admin/login") {
      setLoading(false);
      return;
    }
    setLoading(true);
    setAuthError(null);
    const token = getStoredAuthToken();
    if (!token) {
      setLoading(false);
      setAuthError("Please sign in with administrator credentials to access the TN78 backoffice.");
      return;
    }

    try {
      const profile = await getCurrentUser();
      if (!profile.is_admin && profile.role !== "super_admin") {
        setAuthError(
          `Signed in as ${profile.email}, but administrative privileges are required for this management portal.`
        );
        setUser(profile);
      } else {
        setUser(profile);
        setAuthError(null);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to verify administrative credentials.";
      setAuthError(message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);
    try {
      await loginUser(email, password);
      await checkAuth();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Authentication failed. Please verify email and password.";
      setLoginError(message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    clearStoredAuthToken();
    setUser(null);
    setAuthError("You have been signed out.");
  };

  // Dedicated login page bypass
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // 1. Loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-6 text-[#1A1816]">
        <div className="w-10 h-10 border-2 border-[#9E6544] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-heading text-xs tracking-widest uppercase text-[#78716C]">
          Verifying Administrative Credentials...
        </p>
      </div>
    );
  }

  // 2. Unauthorized screen / Inline Admin Login
  if (authError || !user || (!user.is_admin && user.role !== "super_admin")) {
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
              {authError || "Administrative authentication required to access fulfillment operations."}
            </p>
          </div>

          {user && !user.is_admin && (
            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs text-center font-mono rounded-xl">
              Current account ({user.email}) lacks administrative permissions.
            </div>
          )}

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
              className="w-full bg-[#D5C0A5] hover:bg-[#C4AC8F] text-[#1A1816] font-heading text-xs font-black uppercase tracking-widest py-3.5 rounded-full shadow-sm transition-all duration-150 disabled:opacity-50"
            >
              {loginLoading ? "Authenticating..." : "Sign In to Backoffice"}
            </button>
          </form>

          <div className="pt-4 border-t border-[#EFECE6] flex items-center justify-between text-xs">
            {user && (
              <button
                type="button"
                onClick={handleLogout}
                className="text-[#78716C] hover:text-[#1A1816] transition-colors text-[11px]"
              >
                Sign Out
              </button>
            )}
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

  // 3. Authenticated Admin Shell
  const navItems = [
    { label: "Overview", href: "/admin" },
    { label: "Orders & Dispatch", href: "/admin/orders" },
    { label: "Returns & Exchanges", href: "/admin/returns" },
    { label: "Coupons & Promos", href: "/admin/coupons" },
    { label: "Products & Catalog", href: "/admin/products" },
    { label: "Visual Media & Banners", href: "/admin/media" },
    { label: "Inventory & Stock", href: "/admin/inventory" },
    { label: "Client Reviews", href: "/admin/reviews" },
    { label: "Notifications Log", href: "/admin/notifications" },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A1816] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-[#EFECE6] flex flex-col shrink-0">
        {/* Brand Header */}
        <div className="p-6 border-b border-[#EFECE6]">
          <div className="flex items-center space-x-2.5">
            <span className="font-heading font-black text-xl tracking-wider text-[#1A1816]">
              TN78
            </span>
            <span className="text-[9px] font-heading font-extrabold uppercase tracking-widest text-[#9E6544] bg-[#9E6544]/10 border border-[#9E6544]/20 px-2 py-0.5 rounded-full">
              Console Admin
            </span>
          </div>
          <p className="text-[11px] text-[#78716C] font-body mt-1">
            Operations &amp; Fulfillment Engine
          </p>
        </div>

        {/* Navigation links */}
        <nav className="p-4 space-y-1 flex-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-2.5 text-xs font-heading font-bold uppercase tracking-wider rounded-xl transition-all duration-150 ${
                  isActive
                    ? "bg-[#1A1816] text-[#FAF8F5] shadow-sm"
                    : "text-[#78716C] hover:bg-[#FAF8F5] hover:text-[#1A1816]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Footer / Return to Storefront */}
        <div className="p-4 border-t border-[#EFECE6] space-y-3 bg-[#FAF8F5]/60">
          <div className="text-[11px] space-y-0.5">
            <p className="text-[#1A1816] font-heading font-bold uppercase tracking-wider truncate">
              {user.full_name || "Admin Staff"}
            </p>
            <p className="text-[#78716C] truncate text-[10px] font-mono">{user.email}</p>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#EFECE6]">
            <Link
              href="/"
              className="text-[#9E6544] hover:underline font-heading text-[10px] font-bold uppercase tracking-wider"
            >
              &larr; Storefront
            </Link>
            <button
              onClick={handleLogout}
              className="text-[#78716C] hover:text-rose-600 font-heading text-[10px] font-bold uppercase tracking-wider transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto bg-[#FAF8F5]">
        {children}
      </main>

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-[#EFECE6] max-w-sm w-full p-6 rounded-2xl shadow-xl space-y-4">
            <div className="flex items-center space-x-2.5">
              <span className="w-8 h-8 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center text-sm font-bold">
                !
              </span>
              <h3 className="font-heading font-black text-sm uppercase tracking-wide text-[#1A1816]">
                Confirm Sign Out
              </h3>
            </div>
            <p className="text-xs text-[#78716C] leading-relaxed">
              Are you sure you want to end your active administrative session? Any unsaved edits will be lost.
            </p>
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 border border-[#EFECE6] text-[#78716C] hover:text-[#1A1816] rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmLogout}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
