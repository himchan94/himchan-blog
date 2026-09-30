import type { MDXComponents } from "mdx/types";
import Image from "next/image";

export const mdxComponents: MDXComponents = {
  // 제목 태그들
  h1: ({ children }) => (
    <h1 className='mb-8 text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500'>
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className='mt-12 mb-6 text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className='mt-8 mb-4 text-xl font-semibold tracking-tight text-gray-900 dark:text-white'>
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className='text-lg font-bold mt-6 mb-2 text-gray-900 dark:text-white'>
      {children}
    </h4>
  ),
  h5: ({ children }) => (
    <h5 className='text-base font-bold mt-4 mb-2 text-gray-900 dark:text-white'>
      {children}
    </h5>
  ),
  h6: ({ children }) => (
    <h6 className='text-sm font-bold mt-4 mb-2 text-gray-900 dark:text-white'>
      {children}
    </h6>
  ),

  // 텍스트 관련 태그들
  p: ({ children }) => (
    <p className='mb-4 leading-7 text-gray-800 dark:text-gray-100'>
      {children}
    </p>
  ),
  a: ({ children, href }) => (
    <a
      href={href}
      className='text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline underline-offset-2 transition-colors'
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}>
      {children}
    </a>
  ),
  strong: ({ children }) => (
    <strong className='font-bold text-gray-900 dark:text-white'>
      {children}
    </strong>
  ),
  em: ({ children }) => (
    <em className='italic text-gray-900 dark:text-white'>{children}</em>
  ),
  del: ({ children }) => (
    <del className='line-through text-gray-700 dark:text-gray-300'>
      {children}
    </del>
  ),

  // 리스트 관련 태그들
  ul: ({ children }) => (
    <ul className='mb-4 ml-6 list-disc text-gray-800 dark:text-gray-100'>
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className='my-6 ml-6 list-decimal space-y-2 text-gray-800 dark:text-gray-100'>
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className='mb-2 leading-7 text-gray-800 dark:text-gray-100'>
      {children}
    </li>
  ),

  // 코드 관련 태그들
  code: ({ children }) => {
    const content = children?.toString() || "";

    // 프로그래밍 언어 chip (JavaScript, TypeScript, Java)
    if (["JavaScript", "TypeScript", "Java"].includes(content)) {
      return (
        <code className='inline-flex items-center px-3 py-1.5 m-1 text-sm font-semibold rounded-full bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800 hover:bg-yellow-100 dark:hover:bg-yellow-900/50 transition-all'>
          {children}
        </code>
      );
    }

    // 프론트엔드 기술 chip
    if (
      [
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
      ].includes(content)
    ) {
      return (
        <code className='inline-flex items-center px-3 py-1.5 m-1 text-sm font-semibold rounded-full bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-200 border border-sky-200 dark:border-sky-800 hover:bg-sky-100 dark:hover:bg-sky-900/50 transition-all'>
          {children}
        </code>
      );
    }

    // 백엔드 기술 chip
    if (["Spring Boot", "MySQL"].includes(content)) {
      return (
        <code className='inline-flex items-center px-3 py-1.5 m-1 text-sm font-semibold rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-all'>
          {children}
        </code>
      );
    }

    // 직급 관련 chip
    if (content.includes("개발자")) {
      return (
        <code className='inline-flex items-center px-3 py-1.5 m-1 text-sm font-semibold rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-200 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-all'>
          {children}
        </code>
      );
    }

    // 회사명 관련 chip
    if (
      content.includes("(주)") ||
      ["한화정밀기계", "퓨처플랜", "콜리몰리", "메이튼", "탱고픽"].includes(
        content
      )
    ) {
      return (
        <code className='inline-flex items-center px-3 py-1.5 m-1 text-sm font-semibold rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all'>
          {children}
        </code>
      );
    }

    // 기본 chip 스타일
    return (
      <code className='rounded bg-gray-100 dark:bg-gray-800 px-2 py-1 font-mono text-sm text-gray-900 dark:text-gray-100'>
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className='my-4 p-4 overflow-x-auto rounded-lg bg-gray-100 dark:bg-gray-800'>
      {children}
    </pre>
  ),

  // 기타 태그들
  blockquote: ({ children }) => (
    <blockquote className='pl-6 my-6 border-l-4 border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20 py-4 rounded-r-lg'>
      <div className='text-gray-800 dark:text-gray-100 font-medium italic'>
        {children}
      </div>
    </blockquote>
  ),
  hr: () => <hr className='my-8 border-gray-200 dark:border-gray-800' />,
  table: ({ children }) => (
    <div className='my-6 w-full overflow-x-auto'>
      <table className='w-full border-collapse text-sm'>{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className='border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800 px-4 py-2 text-left font-bold text-gray-900 dark:text-white'>
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className='border border-gray-200 dark:border-gray-800 px-4 py-2 text-gray-700 dark:text-gray-300'>
      {children}
    </td>
  ),
  img: ({ src, alt }) => (
    <Image
      src={src || ""}
      alt={alt || ""}
      width={400}
      height={400}
      className='!h-[400px]'
      unoptimized={true}
    />
  ),
};
