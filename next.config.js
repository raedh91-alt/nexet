/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  i18n: {
    locales: ['ar'],
    defaultLocale: 'ar',
  },
}

module.exports = nextConfig