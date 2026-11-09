const getApiUrl = () => {
  const raw = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  try {
    return new URL(raw);
  } catch {
    return new URL('http://localhost:5000');
  }
};

const apiUrl = getApiUrl();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Deployed backend uploads (both https and http)
      {
        protocol: 'https',
        hostname: 'yft-api.smartlist.uz',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'yft-api.smartlist.uz',
        pathname: '/uploads/**',
      },
      // Any smartlist.uz subdomains
      {
        protocol: 'https',
        hostname: '*.smartlist.uz',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '*.smartlist.uz',
        pathname: '/**',
      },
      // Local development
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '5000',
        pathname: '/uploads/**',
      },
      // Configured API host if custom
      ...(apiUrl.hostname !== 'yft-api.smartlist.uz' && apiUrl.hostname !== 'localhost' && apiUrl.hostname !== '127.0.0.1'
        ? [
            {
              protocol: 'https',
              hostname: apiUrl.hostname,
              ...(apiUrl.port ? { port: apiUrl.port } : {}),
              pathname: '/uploads/**',
            },
            {
              protocol: 'http',
              hostname: apiUrl.hostname,
              ...(apiUrl.port ? { port: apiUrl.port } : {}),
              pathname: '/uploads/**',
            },
          ]
        : []),
      // Wildcard for any other external images (both https and http)
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
  },
  async rewrites() {
    const rawApi = process.env.NEXT_PUBLIC_API_URL || '';
    const cleanOrigin = rawApi && !rawApi.includes('localhost') && !rawApi.includes('127.0.0.1')
      ? rawApi.replace(/^http:\/\//i, 'https://').replace(/\/+$/, '').replace(/\/api$/, '')
      : 'https://yft-api.smartlist.uz';

    return [
      {
        source: '/uploads/:path*',
        destination: `${cleanOrigin}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
