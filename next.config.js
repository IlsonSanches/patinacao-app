/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Ignorar erros de tipo durante o build
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignorar erros de lint durante o build
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig 