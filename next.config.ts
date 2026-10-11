import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  experimental: {
    // Uploaded images arrive as multipart bodies on Server Actions.
    // Default is 1MB, which rejects anything useful.
    serverActions: {
      bodySizeLimit: "8mb",
    },
    // proxy.ts matches /dashboard/:path*, which includes every upload action.
    // Without raising this the request body is truncated *silently* — the
    // upload appears to succeed and produces a corrupt file.
    proxyClientMaxBodySize: "12mb",
  },
};

export default nextConfig;