import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      // Intentional Mobile-First Editorial Breakpoints:
      // - xs (375px): Standard compact smartphones (iPhone SE / compact Android)
      // - sm (480px): Large mobile devices / compact phablets (intentionally lower than Tailwind's
      //   default 640px to enable dense 2-column e-commerce grids on mobile screens >= 480px)
      xs: "375px",
      sm: "480px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        brand: {
          canvas: "#FAF8F5",
          surface: "#FFFFFF",
          surfaceElevated: "#F8FAFC",
          surfaceGlass: "rgba(255, 255, 255, 0.85)",
          red: "#DC2626",
          redDark: "#B91C1C",
          redGlow: "#EF4444",
          retailGreen: "#1B663E",
          retailGreenHover: "#15803D",
          gold: "#E5A93B",
          goldHover: "#FBBF24",
          goldMuted: "#D4A853",
          amber: "#F59E0B",
          emerald: "#16A34A",
          border: "#E5E7EB",
          borderLight: "#F3F4F6",
          borderGold: "#D97706",
          textPrimary: "#111827",
          textSecondary: "#4B5563",
          textMuted: "#9CA3AF",
          espresso: "#111827",
          stone: "#6B7280",
          linen: "#F3F4F6",
          hero: "#FAF8F5",
          copper: "#DC2626",
          sandPill: "#111827",
          sandPillHover: "#374151",
          black: "#111827",
          charcoal: "#1F2937",
          ivory: "#FFFFFF",
          terracotta: "#DC2626",
          camel: "#D97706",
          sand: "#F59E0B",
          // New premium palette
          deepNavy: "#0A0F1C",
          richBlack: "#0E1017",
          warmGrey: "#2A2D35",
          blush: "#F5E6D3",
          champagne: "#F7E7CE",
          bronze: "#CD7F32",
          rosegold: "#B76E79",
        },
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Plus Jakarta Sans", "Inter", "sans-serif"],
        serif: ["var(--font-serif)", "Playfair Display", "Georgia", "serif"],
        body: ["var(--font-body)", "Plus Jakarta Sans", "Inter", "sans-serif"],
      },
      letterSpacing: {
        "ultra-wide": "0.25em",
        luxury: "0.18em",
      },
      boxShadow: {
        "glow-gold": "0 0 25px -5px rgba(226, 197, 138, 0.25)",
        "glow-gold-lg": "0 0 45px -5px rgba(226, 197, 138, 0.35)",
        "glow-red": "0 0 20px -5px rgba(220, 38, 38, 0.2)",
        "glow-red-lg": "0 0 40px -5px rgba(220, 38, 38, 0.3)",
        "card-dark": "0 10px 30px -10px rgba(0, 0, 0, 0.6)",
        "card-lift": "0 12px 28px -8px rgba(0, 0, 0, 0.15)",
        "card-premium": "0 20px 50px -12px rgba(0, 0, 0, 0.25), 0 0 20px rgba(220, 38, 38, 0.05)",
        "mobile-nav": "0 -4px 20px -2px rgba(0, 0, 0, 0.08)",
        "mobile-nav-glow": "0 -2px 30px -4px rgba(220, 38, 38, 0.1), 0 -4px 20px -2px rgba(0, 0, 0, 0.08)",
        "inner-glow": "inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.1)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInDown: {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInDrawer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.85)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        scaleInBounce: {
          "0%": { opacity: "0", transform: "scale(0.3)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
          "70%": { transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        bounceIn: {
          "0%": { opacity: "0", transform: "scale(0.3)" },
          "40%": { transform: "scale(1.08)" },
          "70%": { transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "15%": { transform: "rotate(-3deg)" },
          "30%": { transform: "rotate(3deg)" },
          "45%": { transform: "rotate(-2deg)" },
          "60%": { transform: "rotate(1deg)" },
        },
        gradientShift: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
        },
        pulseRing: {
          "0%": { transform: "scale(0.95)", opacity: "1" },
          "50%": { transform: "scale(1.1)", opacity: "0.5" },
          "100%": { transform: "scale(0.95)", opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        floatGentle: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "25%": { transform: "translateY(-4px) rotate(1deg)" },
          "75%": { transform: "translateY(-2px) rotate(-1deg)" },
        },
        heartBurst: {
          "0%": { transform: "scale(1)" },
          "25%": { transform: "scale(0.8)" },
          "50%": { transform: "scale(1.3)" },
          "75%": { transform: "scale(0.9)" },
          "100%": { transform: "scale(1)" },
        },
        tapBounce: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(0.92)" },
          "100%": { transform: "scale(1)" },
        },
        iconPop: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.15)" },
          "100%": { transform: "scale(1)" },
        },
        skeletonPulse: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
        slideIndicator: {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
        countUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        glowPulse: {
          "0%, 100%": {
            boxShadow: "0 0 5px rgba(220,38,38,0.2), 0 0 15px rgba(220,38,38,0.1)",
          },
          "50%": {
            boxShadow: "0 0 20px rgba(220,38,38,0.4), 0 0 40px rgba(220,38,38,0.2)",
          },
        },
        slideNavPill: {
          "0%": { transform: "scaleX(0.8)", opacity: "0.5" },
          "100%": { transform: "scaleX(1)", opacity: "1" },
        },
        revealBlur: {
          "0%": { filter: "blur(10px)", opacity: "0" },
          "100%": { filter: "blur(0)", opacity: "1" },
        },
        crossFade: {
          "0%": { opacity: "0" },
          "15%": { opacity: "1" },
          "85%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        rotateGradient: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.3s ease-out",
        fadeInSlow: "fadeIn 0.6s ease-out",
        fadeInUp: "fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        fadeInDown: "fadeInDown 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        slideInUp: "slideInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        slideInLeft: "slideInLeft 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        slideInRight: "slideInRight 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        slideInDrawer: "slideInDrawer 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        scaleIn: "scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        scaleInBounce: "scaleInBounce 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        bounceIn: "bounceIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        wiggle: "wiggle 0.6s ease-in-out",
        gradientShift: "gradientShift 6s ease infinite",
        marquee: "marquee 28s linear infinite",
        marqueeSlow: "marquee 42s linear infinite",
        shimmer: "shimmer 2.5s infinite",
        pulseGlow: "pulseGlow 2.5s ease-in-out infinite",
        pulseRing: "pulseRing 2s ease-in-out infinite",
        float: "float 4s ease-in-out infinite",
        floatGentle: "floatGentle 6s ease-in-out infinite",
        heartBurst: "heartBurst 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        tapBounce: "tapBounce 0.2s ease-out",
        iconPop: "iconPop 0.3s ease-out",
        skeletonPulse: "skeletonPulse 1.8s ease-in-out infinite",
        slideIndicator: "slideIndicator 5.5s linear forwards",
        countUp: "countUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        glowPulse: "glowPulse 2s ease-in-out infinite",
        slideNavPill: "slideNavPill 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        revealBlur: "revealBlur 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        crossFade: "crossFade 5.5s ease-in-out infinite",
        rotateGradient: "rotateGradient 4s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
