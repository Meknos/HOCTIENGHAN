/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Cho phép upload ảnh trang sách (base64) qua server action.
    serverActions: { bodySizeLimit: "12mb" },
  },
};

export default nextConfig;
