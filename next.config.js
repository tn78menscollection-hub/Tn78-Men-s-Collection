/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allowed development origins for ngrok tunnels (development only)
  ...(process.env.NODE_ENV !== "production"
    ? {
        allowedDevOrigins: [
          "*.ngrok-free.dev",
          "*.ngrok-free.app",
          "*.ngrok.io",
          "*.devtunnels.ms",
          "*.app.github.dev",
          "*.github.dev",
          "*.loca.lt",
          "*.pinggy.link",
          "pumice-clatter-bottling.ngrok-free.dev",
          "localhost",
          "127.0.0.1",
        ],
      }
    : {}),
  images: {
    unoptimized: process.env.NODE_ENV !== "production",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "**.cdninstagram.com",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
  async rewrites() {
    const backendUrl = (process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8001").replace(/\/+$/, "");
    return [
      {
        source: "/api/v1/:path*",
        destination: `${backendUrl}/api/v1/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
