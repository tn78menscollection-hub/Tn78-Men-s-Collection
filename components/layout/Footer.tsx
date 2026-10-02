"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-[#050608] border-t border-[#232733] text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-28 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Column 1: Brand Blurb with Uploaded Logo */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#E5A93B] shadow-xs">
                <img src="/tn78-logo.jpg" alt="TN78 Logo" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-black text-2xl tracking-[0.2em] text-white leading-none">
                  TN78
                </span>
                <span className="text-[9px] font-heading font-extrabold tracking-[0.22em] text-[#F59E0B] uppercase mt-0.5">
                  MEN&apos;S WEAR
                </span>
              </div>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed font-normal">
              Distinctive streetwear and casual menswear curated for modern presence. High-grade fabrics, relaxed silhouettes, and everyday distinction.
            </p>
            <div className="pt-1">
              <span className="inline-block text-[9px] font-heading font-black uppercase tracking-widest text-[#F59E0B] border border-neutral-700 px-3 py-1 bg-neutral-900 rounded-xs">
                AUTHENTIC MENSWEAR
              </span>
            </div>
          </div>

          {/* Column 2: Shop Links */}
          <div className="flex flex-col space-y-3.5">
            <h4 className="font-heading text-xs font-black uppercase tracking-[0.22em] text-[#E2C58A]">
              COLLECTIONS
            </h4>
            <ul className="space-y-2.5 text-xs font-body text-slate-400">
              <li>
                <Link href="/shop?sort=newest" className="hover:text-white transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/category/co-ord-sets" className="hover:text-white transition-colors">
                  Co-Ord Sets
                </Link>
              </li>
              <li>
                <Link href="/category/shirts" className="hover:text-white transition-colors">
                  Linen Shirts & Overshirts
                </Link>
              </li>
              <li>
                <Link href="/category/pants" className="hover:text-white transition-colors">
                  Pleated & Tailored Trousers
                </Link>
              </li>
              <li>
                <Link href="/category/lowers" className="hover:text-white transition-colors">
                  Drawstring Lowers
                </Link>
              </li>
              <li>
                <Link href="/offers" className="text-[#E2C58A] font-bold hover:underline">
                  Special Privilege Offers
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Client Concierge */}
          <div className="flex flex-col space-y-3.5">
            <h4 className="font-heading text-xs font-black uppercase tracking-[0.22em] text-[#E2C58A]">
              CLIENT CONCIERGE
            </h4>
            <ul className="space-y-2.5 text-xs font-body text-slate-400">
              <li>
                <Link href="/support" className="hover:text-white transition-colors">
                  Delivery &amp; Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-white transition-colors">
                  Saved Wishlist
                </Link>
              </li>
              <li>
                <Link href="/style-your-fit" className="hover:text-white transition-colors">
                  Style Your Fit &amp; Ensembles
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-white transition-colors">
                  Size Guide &amp; Fabric Care
                </Link>
              </li>
              <li>
                <a
                  href="https://wa.me/917010418046?text=Vanakkam%20TN78%2C%20I%20would%20like%20to%20inquire%20about%20orders%20and%20stock%20availability."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors text-emerald-400"
                >
                  WhatsApp Concierge Hotline
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Social */}
          <div className="flex flex-col space-y-3.5">
            <h4 className="font-heading text-xs font-black uppercase tracking-[0.22em] text-[#E2C58A]">
              STORE LOCATION &amp; PRESENCE
            </h4>
            <div className="text-xs text-slate-400 font-body leading-relaxed space-y-1.5">
              <p className="text-white font-medium">TN 78 MEN&apos;S COLLECTION</p>
              <p>Geetha eye hospital, Kalpana Rd, nearby Saravana Bhavan hotel, Udumalpet, Tamil Nadu 642126</p>
              <p className="text-[#E2C58A] font-mono text-[11px]">Phone: +91 70104 18046 / +91 85258 57233</p>
            </div>
            
            <div className="pt-2 flex flex-col space-y-2">
              <a
                href="https://www.google.com/maps/place/TN+78+MEN'S+COLLECTION/@10.5843488,77.2493999,17z/data=!3m1!4b1!4m6!3m5!1s0x3ba9cda855f1d9ed:0xb7290e20cff0dc05!8m2!3d10.5843488!4d77.2493999!16s%2Fg%2F11yk3h9xr8!18m1!1e1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-xs font-heading font-bold uppercase tracking-wider text-[#E2C58A] hover:underline"
              >
                <svg className="w-4 h-4 text-[#E2C58A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>GET GOOGLE MAPS DIRECTIONS &rarr;</span>
              </a>

              <a
                href="https://www.instagram.com/tn_78_mens_collection"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-xs font-heading font-bold uppercase tracking-wider text-slate-300 hover:text-[#E2C58A] transition-colors"
              >
                <svg className="w-4 h-4 text-[#E2C58A]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.13-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689-.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.79-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                <span>INSTAGRAM &bull; @tn_78_mens_collection</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-14 pt-8 border-t border-[#232733] flex flex-col sm:flex-row items-center justify-between text-[11px] font-body text-slate-500">
          <p>&copy; {new Date().getFullYear()} TN78 MEN&apos;S COLLECTION. ALL RIGHTS RESERVED.</p>
          <div className="flex space-x-6 mt-3 sm:mt-0 font-heading uppercase text-[10px] tracking-wider">
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">
              PRIVACY POLICY
            </Link>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">
              TERMS OF SERVICE
            </Link>
            <Link href="/admin" className="hover:text-[#E2C58A] text-slate-400 transition-colors">
              STAFF PORTAL
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
