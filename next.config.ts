import createMDX from "@next/mdx";

// const isGithubActions = process.env.GITHUB_ACTIONS || false;
// const basePath = isGithubActions ? "/himchan-version2" : "";
// const assetPrefix = isGithubActions ? "/himchan-version2/" : "/";

const basePath = "";
const assetPrefix = "/";

const nextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
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
  trailingSlash: true, // 반드시 추가 (export 대응)
  output: "export" as const,
  distDir: "out",
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: ["rehype-highlight"],
  },
});

export default withMDX(nextConfig);
