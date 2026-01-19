/**
 * Pharma ERP System
 * Copyright (c) 2026 Rebelronak (Ronak Kanani). All rights reserved.
 * Licensed under the MIT License.
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
