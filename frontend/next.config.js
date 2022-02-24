/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = {
      crypto: false,
      fs: false,
      assert: false,
      process: false,
      util: false,
      path: false,
      stream: false,
      os: false,
    }

    return config
  },
}

module.exports = nextConfig
