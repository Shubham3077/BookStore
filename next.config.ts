import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: 'ixowojfd8wpbpwhj.public.blob.vercel-storage.com', pathname: "/**" },
    ],
  },
}

export default nextConfig
