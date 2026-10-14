/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  poweredByHeader: false,

  // Dev-only proxy: makes `next dev` forward /api and /backoffice to the
  // backend, imitating the ALB. Skipped when BACKEND_INTERNAL_URL is unset —
  // which it always is in production images, where the ALB does the routing.
  async rewrites() {
    const backend = process.env.BACKEND_INTERNAL_URL;
    if (!backend) return [];
    return [
      { source: "/api/:path*", destination: `${backend}/api/:path*` },
      {
        source: "/backoffice/:path*",
        destination: `${backend}/backoffice/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
