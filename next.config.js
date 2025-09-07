const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static exports for GitHub Pages
  output: 'export',
  
  // Set base path to your repository name
  basePath: '/qubic-vanity',
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  
  // Ensure worker files are copied
  async rewrites() {
    return [
      {
        source: '/worker.js',
        destination: '/worker.js',
      },
    ]
  },
  
  // Handle static assets
  assetPrefix: process.env.NODE_ENV === 'production' ? '/qubic-vanity' : '',
};

module.exports = withNextIntl(nextConfig);
