/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  poweredByHeader: false,

  // Dev only. Rewrites are baked in at build time, so production images are
  // built without BACKEND_INTERNAL_URL and the load balancer does the routing.
  async rewrites() {
    const backend = process.env.BACKEND_INTERNAL_URL;
    if (!backend) return [];
    return [
      { source: "/api/:path*", destination: `${backend}/api/:path*` },
      { source: "/backoffice/:path*", destination: `${backend}/backoffice/:path*` },
    ];
  },
};

module.exports = nextConfig;
