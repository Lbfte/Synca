import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/HabitFlow',
  assetPrefix: '/HabitFlow',
  images: {
    unoptimized: true,
  },
  // Garante que /share/view vire /share/view/index.html para o GitHub Pages entender
  trailingSlash: true, 
};

export default nextConfig;
