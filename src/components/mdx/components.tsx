import type { MDXComponents } from "mdx/types";
import Image from "next/image";

export const mdxComponents: MDXComponents = {
  // 제목 태그들
  h1: ({ children }) => (
    <h1 className='mb-8 font-display text-display-lg font-semibold text-ink'>
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className='mt-16 mb-6 font-display text-display-md font-semibold text-ink'>
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className='mt-10 mb-4 font-display text-lead-airy font-semibold text-ink'>
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className='mt-8 mb-2 font-display text-tagline font-semibold text-ink'>
      {children}
    </h4>
  ),
  h5: ({ children }) => (
    <h5 className='mt-6 mb-2 text-body font-semibold text-ink'>{children}</h5>
  ),
  h6: ({ children }) => (
    <h6 className='mt-6 mb-2 text-caption font-semibold text-ink'>{children}</h6>
  ),

  // 텍스트 관련 태그들
  p: ({ children }) => <p className='mb-5 text-body text-ink'>{children}</p>,
  a: ({ children, href }) => (
    <a
      href={href}
      className='text-primary underline decoration-1 underline-offset-2'
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}>
      {children}
    </a>
  ),
  strong: ({ children }) => (
    <strong className='font-semibold text-ink'>{children}</strong>
  ),
  em: ({ children }) => <em className='italic'>{children}</em>,
  del: ({ children }) => (
    <del className='text-ink-48 line-through'>{children}</del>
  ),

  // 리스트 관련 태그들
  ul: ({ children }) => (
    <ul className='mb-5 ml-6 list-disc text-body text-ink'>{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className='mb-5 ml-6 list-decimal text-body text-ink'>{children}</ol>
  ),
  li: ({ children }) => <li className='mb-2'>{children}</li>,

  // 코드 관련 태그들
  code: ({ children, className }) => {
    // rehype-highlight가 붙인 블록 코드는 pre 스타일에 맡긴다.
    if (className?.includes("hljs")) {
      return <code className={className}>{children}</code>;
    }

    const content = children?.toString() || "";

    // 본문에서 `기술명`·회사명 등을 칩으로 보여준다.
    const isChip =
      [
        "JavaScript",
        "TypeScript",
        "Java",
        "React",
        "Next.js",
        "Tailwind CSS",
        "Styled-Components",
        "React-Hook-Form",
        "Jotai",
        "Redux",
        "React-Native",
        "ECharts",
        "Context API",
        "Spring Boot",
        "MySQL",
        "한화정밀기계",
        "퓨처플랜",
        "콜리몰리",
        "메이튼",
        "탱고픽",
      ].includes(content) ||
      content.includes("개발자") ||
      content.includes("(주)");

    if (isChip) {
      return <code className='chip m-1 font-semibold'>{children}</code>;
    }

    return (
      <code className='rounded-xs bg-parchment px-1.5 py-0.5 font-mono text-[0.9em] text-ink'>
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className='my-6 overflow-x-auto rounded-lg bg-tile p-5 text-caption text-on-dark [&>code]:bg-transparent [&>code]:p-0 [&>code]:text-[1em] [&>code]:text-on-dark'>
      {children}
    </pre>
  ),

  // 기타 태그들
  blockquote: ({ children }) => (
    <blockquote className='my-6 border-l-2 border-hairline pl-6 text-ink-80'>
      {children}
    </blockquote>
  ),
  hr: () => <hr className='my-12 border-hairline' />,
  table: ({ children }) => (
    <div className='my-6 w-full overflow-x-auto'>
      <table className='w-full border-collapse text-caption'>{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className='border-b border-hairline bg-parchment px-4 py-2 text-left font-semibold text-ink'>
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className='border-b border-hairline px-4 py-2 text-ink-80'>{children}</td>
  ),
  img: ({ src, alt }) => (
    <Image
      src={src || ""}
      alt={alt || ""}
      width={400}
      height={400}
      className='!h-[400px] rounded-lg'
      unoptimized={true}
    />
  ),
};
