import createNextIntlPlugin from 'next-intl/plugin';

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
};

export default withNextIntl(nextConfig);
