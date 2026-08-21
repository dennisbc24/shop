/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.amazonaws.com" },
      { protocol: "https", hostname: "caja-for-many-products-dennis.s3.sa-east-1.amazonaws.com" },
      { protocol: "https", hostname: "inventario.cocinamejor.store" },
      { protocol: "https", hostname: "via.placeholder.com" },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/inventario/:path*",
        destination: "https://inventario.cocinamejor.store/api/v1/:path*",
      },
    ];
  },
};

export default nextConfig;
