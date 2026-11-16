// import type { NextConfig } from "next";
// import withPWAInit from "@ducanh2912/next-pwa";

// const withPWA = withPWAInit({
//   dest: "public",
//   cacheOnFrontEndNav: true,
//   aggressiveFrontEndNavCaching: true,
//   reloadOnOnline: true,
//   disable: process.env.NODE_ENV === "development", // Disable in dev to avoid caching headaches
//   workboxOptions: {
//     disableDevLogs: true,
//   },
// });

// const nextConfig: NextConfig = {
//   cacheComponents: true,
//   turbopack: {}, // Silence the Turbopack / Webpack mismatch error
// };

// export default withPWA(nextConfig);

// next.config.ts
import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: false, // Set to false so an unstable connection doesn't mid-reload while viewing contacts
  disable: process.env.NODE_ENV === "development",
  fallbacks: {
    document: "/~offline", // Fallback page when navigating to an uncached route offline
  },
  workboxOptions: {
    disableDevLogs: true,
    runtimeCaching: [
      {
        // Cache visited protected contact & travel pages for offline access
        urlPattern: ({ request, url }) =>
          request.mode === "navigate" &&
          (url.pathname === "/" ||
            url.pathname.includes("/contacts") ||
            url.pathname.includes("/plans")),
        handler: "NetworkFirst",
        options: {
          cacheName: "protected-travel-pages",
          networkTimeoutSeconds: 3, // Fall back to cached shell after 3s on poor signal
          expiration: {
            maxEntries: 30,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
          },
        },
      },
    ],
  },
});

const nextConfig: NextConfig = {
  cacheComponents: true,
  turbopack: {}, // Keep Webpack build compatibility for next-pwa
};

export default withPWA(nextConfig);
