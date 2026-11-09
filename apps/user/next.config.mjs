const apiUrl = new URL(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Images uploaded to the backend (/uploads/...)
      {
        protocol: apiUrl.protocol.replace(':', ''),
        hostname: apiUrl.hostname,
        port: apiUrl.port,
        pathname: '/uploads/**',
      },
      // Legacy remote images that were not imported into the backend yet
      { protocol: 'https', hostname: '**' },
    ],
  },
};

export default nextConfig;
