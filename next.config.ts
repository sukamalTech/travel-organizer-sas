import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development", // Disable in dev to avoid caching headaches
  workboxOptions: {
    disableDevLogs: true,
  },
});

const nextConfig: NextConfig = {
  cacheComponents: true,
  turbopack: {}, // Silence the Turbopack / Webpack mismatch error
};

export default withPWA(nextConfig);
