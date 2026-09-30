import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeHighlight from "rehype-highlight";
import TypingEffect from "@/features/typing-effect/TypingEffect";
import TemperatureMonitor from "@/features/serverStatus/TemperatureMonitor";
import { mdxComponents } from "./components";

// 본문에서 쓸 수 있는 JSX 컴포넌트는 이 목록뿐이다 (ADR-0003).
export const allowedComponents = { TypingEffect, TemperatureMonitor };

const components = { ...mdxComponents, ...allowedComponents };

export default function MDXContent({ source }: { source: string }) {
  return (
    <MDXRemote
      source={source}
      components={components}
      options={{ mdxOptions: { rehypePlugins: [rehypeHighlight] } }}
    />
  );
}
