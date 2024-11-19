const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const config = {
  images: {
    unoptimized: true,
    domains: ['vercel.app', 'localhost'],
  }
};

module.exports = withNextIntl(config);
