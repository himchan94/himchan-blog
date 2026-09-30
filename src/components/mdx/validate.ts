import { serialize } from "next-mdx-remote/serialize";
import { allowedComponents } from "./MDXContent";

type Node = { type: string; name?: string | null; children?: Node[] };

// 허용 목록에 없는 컴포넌트는 컴파일은 통과하고 렌더 시점에 500이 되므로 저장 전에 막는다.
export async function validateMdx(source: string): Promise<string | null> {
  const names = new Set<string>();
  const collectJsxNames = () => (tree: Node) => {
    const walk = (node: Node) => {
      if (node.type.startsWith("mdxJsx") && node.name && !/^[a-z]/.test(node.name)) {
        names.add(node.name);
      }
      node.children?.forEach(walk);
    };
    walk(tree);
  };

  try {
    await serialize(source, { mdxOptions: { remarkPlugins: [collectJsxNames] } });
  } catch (error) {
    return error instanceof Error ? error.message : String(error);
  }

  const unknown = [...names].filter((name) => !(name in allowedComponents));
  return unknown.length > 0 ? `허용되지 않은 컴포넌트: ${unknown.join(", ")}` : null;
}
