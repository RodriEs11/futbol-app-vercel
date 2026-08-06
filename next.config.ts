import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        // Supabase Storage: reemplazar por tu project ref real
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  // experimental: {
  //   typedRoutes: true,
  // },
};

export default nextConfig;
