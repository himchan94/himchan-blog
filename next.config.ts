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
};

export default nextConfig;
