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
  },
  webpack: (config, { isServer }) => {
    // Resolve o problema com o módulo undici
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'undici': false, // Desativa o uso do undici no cliente
      }
    }
    
    return config;
  }
}

module.exports = nextConfig 