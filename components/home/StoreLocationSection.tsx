"use client";

import React from "react";

const GOOGLE_MAPS_URL =
  "https://www.google.com/maps/place/TN+78+MEN'S+COLLECTION/@10.5843488,77.2493999,17z/data=!3m1!4b1!4m6!3m5!1s0x3ba9cda855f1d9ed:0xb7290e20cff0dc05!8m2!3d10.5843488!4d77.2493999!16s%2Fg%2F11yk3h9xr8!18m1!1e1";

const INSTAGRAM_URL = "https://www.instagram.com/tn_78_mens_collection";
const WHATSAPP_URL = "https://wa.me/917010418046?text=Vanakkam%20TN78%2C%20I%20would%20like%20to%20inquire%20about%20store%20timings%20and%20collections.";
const YOUTUBE_URL = "https://www.youtube.com/@vipvicky78";

// High-definition embed centered precisely on TN 78 Men's Collection in Udumalpet
const MAP_EMBED_SRC =
  "https://maps.google.com/maps?q=10.5843488,77.2493999+(TN+78+MEN'S+COLLECTION)&t=&z=17&ie=UTF8&iwloc=B&output=embed";

export function StoreLocationSection() {
  return (
    <section
      id="store-location"
      className="bg-[#050608] py-10 sm:py-14 md:py-20 border-b border-[#232733] text-[#F8FAFC]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 space-y-2">
          <span className="text-[10px] sm:text-xs font-heading font-black tracking-[0.22em] uppercase text-[#E2C58A]">
            PHYSICAL FLAGSHIP & STORE
          </span>
          <h2 className="font-heading font-black text-xl sm:text-3xl md:text-4xl text-white tracking-tight">
            Visit TN 78 Men&apos;s Collection
          </h2>
          <p className="text-[11px] sm:text-sm text-slate-400 font-medium">
            Experience our tailored linens, premium casuals, and bespoke fits in person at our flagship store in Udumalpet.
          </p>
        </div>

        {/* 2-Column Grid: Store Info Card + Interactive Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 items-start">
          {/* Left Column: Details & Action Buttons (5 cols) */}
          <div className="lg:col-span-5 bg-[#0D0F15] border border-[#232733] rounded-xl sm:rounded-2xl p-4 sm:p-6 flex flex-col justify-between shadow-2xl space-y-4 sm:space-y-6">
            <div className="space-y-6">
              {/* Badge & Rating */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-heading font-extrabold uppercase tracking-widest text-[#E2C58A] bg-[#E2C58A]/10 border border-[#E2C58A]/30 px-3 py-1 rounded-full">
                  Verified Store Location
                </span>
                <span className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Open &bull; Closes 10:30 PM
                </span>
              </div>

              {/* Title & Category */}
              <div>
                <h3 className="font-heading font-black text-xl sm:text-2xl text-white tracking-wide">
                  TN 78 MEN&apos;S COLLECTION
                </h3>
                <p className="text-xs font-mono text-slate-400 mt-0.5">
                  Exclusive Men&apos;s Clothing, Shirts, T-Shirts, Jeans &amp; Co-Ords
                </p>
              </div>

              {/* Address Block */}
              <div className="space-y-4 text-xs font-body border-t border-b border-[#232733] py-5">
                {/* Physical Address */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#191D28] text-[#E2C58A] flex items-center justify-center shrink-0 border border-[#232733] mt-0.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-heading font-bold uppercase text-slate-300 text-[10px] tracking-wider block">
                      Address &amp; Landmark
                    </span>
                    <p className="text-slate-300 leading-relaxed mt-0.5">
                      Geetha eye hospital, Kalpana Rd, nearby Saravana Bhavan hotel, Udumalpet, Udumalaipettai Municipality, Tamil Nadu 642126
                    </p>
                    <p className="text-[11px] font-mono text-slate-500 mt-1">
                      Plus Code: <span className="text-[#E2C58A]">H6MX+PQ</span> Udumalaipettai
                    </p>
                  </div>
                </div>

                {/* Contact Numbers */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#191D28] text-[#E2C58A] flex items-center justify-center shrink-0 border border-[#232733] mt-0.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-heading font-bold uppercase text-slate-300 text-[10px] tracking-wider block">
                      Call &amp; WhatsApp Stock Inquiries
                    </span>
                    <p className="text-slate-300 font-mono font-bold mt-0.5">
                      +91 70104 18046 &bull; +91 85258 57233
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Open Mon &ndash; Sun: 10:00 AM &ndash; 10:30 PM IST
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-3 pt-2">
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-5 bg-gradient-to-r from-[#E2C58A] to-[#C6A467] hover:brightness-110 text-[#0A0B0E] font-heading text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(226,197,138,0.25)] flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                <span>OPEN IN GOOGLE MAPS (GET DIRECTIONS) &rarr;</span>
              </a>

              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 bg-[#13151C] hover:bg-[#191D28] text-emerald-400 border border-emerald-500/40 rounded-xl text-center text-[11px] font-heading font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                >
                  <span>WHATSAPP ORDER</span>
                </a>

                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 bg-[#13151C] hover:bg-[#191D28] text-[#E2C58A] border border-[#E2C58A]/40 rounded-xl text-center text-[11px] font-heading font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                >
                  <span>INSTAGRAM PAGE</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Google Maps Embed (7 cols) */}
          <div className="lg:col-span-7 bg-[#0D0F15] border border-[#232733] rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col min-h-[300px] sm:min-h-[380px] lg:min-h-[500px] relative group">
            {/* Top Toolbar overlay on map */}
            <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
              <div className="bg-[#0A0B0E]/90 backdrop-blur-md border border-[#232733] px-3.5 py-1.5 rounded-lg shadow-lg pointer-events-auto">
                <span className="text-[11px] font-heading font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 inline-block animate-ping" />
                  TN 78 MEN&apos;S COLLECTION &bull; UDUMALPET
                </span>
              </div>

              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#E2C58A] text-[#0A0B0E] hover:bg-white text-[10px] font-heading font-black uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-lg pointer-events-auto transition-colors flex items-center gap-1"
              >
                <span>View Full Map</span>
                <span>&nearr;</span>
              </a>
            </div>

            {/* Interactive iframe map */}
            <iframe
              title="TN 78 MEN'S COLLECTION Location Map"
              src={MAP_EMBED_SRC}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "440px", filter: "invert(90%) hue-rotate(180deg)" }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full flex-1 rounded-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default StoreLocationSection;
