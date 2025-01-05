/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Temporariamente ignorar erros de tipo durante o build
    ignoreBuildErrors: true,
  },
  eslint: {
    // Temporariamente ignorar erros de lint durante o build
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['seu-dominio.com'], // Adicione os domínios das suas imagens
  }
}

module.exports = nextConfig 