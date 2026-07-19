/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { hostname: "images.unsplash.com" },
      { hostname: "picsum.photos" },
    ],
  },
};

export default nextConfig;
