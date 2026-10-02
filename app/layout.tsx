import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { WhatsAppConcierge } from "@/components/layout/WhatsAppConcierge";
import { CartWishlistProvider } from "@/lib/cartWishlistContext";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { BackToTop } from "@/components/ui/BackToTop";
import { ToastProvider } from "@/components/ui/Toast";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  variable: "--font-serif",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tn78menswear.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "TN78 Men's Collection — Editorial Menswear",
    template: "%s | TN78 Men's Collection",
  },
  description:
    "Premium editorial menswear tailored for modern presence. Pure linen drapes, breathable cotton waffle, and everyday distinction.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/icon.svg",
    shortcut: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "TN78 Men's Collection",
    title: "TN78 Men's Collection — Editorial Menswear",
    description:
      "Premium editorial menswear tailored for modern presence. Pure linen drapes, breathable cotton waffle, and everyday distinction.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "TN78 Men's Collection — Editorial Menswear",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TN78 Men's Collection — Editorial Menswear",
    description:
      "Premium editorial menswear tailored for modern presence. Pure linen drapes, breathable cotton waffle, and everyday distinction.",
    images: ["/images/og-image.jpg"],
  },
};

import { CookieBanner } from "@/components/layout/CookieBanner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isDev = process.env.NODE_ENV === "development";

  return (
    <html lang="en">
      <head>
        {isDev && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  var isStartTimeBug = function(str) {
                    return typeof str === 'string' && (str.indexOf("startTime") !== -1 || str.indexOf("reportAllChanges") !== -1);
                  };

                  // Suppress console.error logging from DevTools VM scripts
                  var _origError = console.error;
                  console.error = function() {
                    var args = Array.prototype.slice.call(arguments);
                    for (var i = 0; i < args.length; i++) {
                      var a = args[i];
                      if (a && (isStartTimeBug(a) || (a.message && isStartTimeBug(a.message)) || (a.stack && isStartTimeBug(a.stack)))) {
                        return;
                      }
                    }
                    _origError.apply(console, arguments);
                  };

                  // Suppress window.onerror console logging
                  window.onerror = function(msg, src, lineno, colno, err) {
                    if (isStartTimeBug(msg) || (err && (isStartTimeBug(err.message) || isStartTimeBug(err.stack)))) {
                      return true;
                    }
                  };

                  // Capture phase error event
                  window.addEventListener('error', function(e) {
                    if (isStartTimeBug(e.message) || (e.error && (isStartTimeBug(e.error.message) || isStartTimeBug(e.error.stack)))) {
                      e.preventDefault();
                      e.stopImmediatePropagation();
                      return true;
                    }
                  }, true);

                  // Promise rejection handler
                  window.addEventListener('unhandledrejection', function(e) {
                    if (e.reason && (isStartTimeBug(e.reason.message) || isStartTimeBug(e.reason.stack))) {
                      e.preventDefault();
                      e.stopImmediatePropagation();
                    }
                  }, true);
                })();
              `,
            }}
          />
        )}
      </head>
      <body className={`min-h-screen flex flex-col bg-[#FAF8F5] text-[#111827] antialiased ${plusJakartaSans.variable} ${playfairDisplay.variable}`}>
        <CartWishlistProvider>
          <ToastProvider>
            <ScrollProgress />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <WhatsAppConcierge />
            <CookieBanner />
            <BackToTop />
            <MobileBottomNav />
          </ToastProvider>
        </CartWishlistProvider>
      </body>
    </html>
  );
}
