// Carregar variáveis de ambiente do arquivo .env
import dotenv from 'dotenv'
dotenv.config();

const nextConfig = {
  reactStrictMode: true,
  env: {
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  },
  images: {
    domains: ['files.stripe.com'],
  },
};

export default nextConfig;
