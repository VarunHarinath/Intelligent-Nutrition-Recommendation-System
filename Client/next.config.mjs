/** @type {import('next').NextConfig} */
const nextConfig = {
  // <CHANGE> Enable Turbopack support
  experimental: {
    turbopack: {},
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
