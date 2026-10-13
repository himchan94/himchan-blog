const basePath = "";
const assetPrefix = "/";

const nextConfig = {
  images: {
    unoptimized: true,
    // remotePatterns: [
    //   {
    //     protocol: "https" as const,
    //     hostname: "**",
    //   },
    // ],
  },
  basePath,
  assetPrefix,
  trailingSlash: true, // 기존 정적 export URL(/blog/slug/) 호환
  output: "standalone" as const,
  experimental: {
    // 이미지 업로드(최대 10MB) + multipart 여유분
    serverActions: { bodySizeLimit: "11mb" },
  },
};

export default nextConfig;
