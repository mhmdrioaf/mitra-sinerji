/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: process.env.API_BASE_URL + "/api/:path*",
      },
    ];
  },
};

export default nextConfig;
