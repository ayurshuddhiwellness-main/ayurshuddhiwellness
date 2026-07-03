/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@ayurshuddhi/ui'],
  async redirects() {
    return [
      {
        source: '/blogs',
        destination: '/coming-soon',
        permanent: false,
      },
      {
        source: '/blogs/:slug',
        destination: '/coming-soon',
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig
