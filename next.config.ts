import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  // Enable static export only for Tauri/Capacitor desktop/mobile builds
  // Web deployment (Render) needs SSR to support API routes
  output: process.env.TAURI_BUILD === '1' ? 'export' : undefined,
};

export default nextConfig;
