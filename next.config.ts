import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: { unoptimized: true },
};

// Enable static export for Tauri/Capacitor desktop/mobile builds
// Web deployment (Render) uses SSR to support API routes
if (process.env.TAURI_BUILD === '1') {
  nextConfig.output = 'export';
}

export default nextConfig;
