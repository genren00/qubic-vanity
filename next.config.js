const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const config = {
  basePath: process.env.VERCEL_ENV === 'production' ? '/qubic-vanity' : '',
  images: {
    unoptimized: true,
    domains: ['vercel.app', 'localhost'],
  }
};

module.exports = withNextIntl(config);
