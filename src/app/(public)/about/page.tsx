import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import MDXContent from "@/components/mdx/MDXContent";
import ProfileImage from "@/components/ProfileImage";

export default async function About() {
  const about = await prisma.page.findUnique({ where: { key: "about" } });

  if (!about) {
    notFound();
  }

  return (
    <div className='max-w-4xl mx-auto px-4 py-16'>
      <div className='relative'>
        {/* 배경 장식 */}
        <div className='absolute -top-4 -left-4 w-72 h-72 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl animate-pulse' />
        <div className='absolute -top-4 -right-4 w-72 h-72 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-3xl animate-pulse' />
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 dark:bg-pink-500/20 rounded-full blur-3xl animate-pulse' />
        <ProfileImage
          src='/images/me.png'
          alt='Profile Image'
          className='mb-8'
        />
        {/* 컨텐츠 */}
        <div className='relative'>
          <div
            className='prose prose-lg dark:prose-invert max-w-none 
            prose-headings:font-bold 
            prose-h1:text-4xl prose-h1:sm:text-5xl prose-h1:bg-gradient-to-r prose-h1:from-blue-600 prose-h1:via-purple-500 prose-h1:to-pink-500 prose-h1:bg-clip-text prose-h1:text-transparent prose-h1:mb-8
            prose-h2:text-2xl prose-h2:sm:text-3xl prose-h2:text-gray-800 prose-h2:dark:text-gray-200 prose-h2:mt-12
            prose-h3:text-xl prose-h3:sm:text-2xl prose-h3:text-blue-600 prose-h3:dark:text-blue-400
            prose-p:text-gray-600 prose-p:dark:text-gray-300 prose-p:leading-relaxed
            prose-a:text-blue-600 prose-a:dark:text-blue-400 prose-a:no-underline prose-a:font-medium hover:prose-a:text-blue-700 hover:prose-a:dark:text-blue-300
            prose-li:text-gray-600 prose-li:dark:text-gray-300
            prose-strong:text-blue-600 prose-strong:dark:text-blue-400 prose-strong:font-bold
            prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:dark:bg-blue-900/20 prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:text-gray-900 prose-blockquote:dark:text-gray-100 prose-blockquote:text-lg prose-blockquote:font-medium
            [&>*]:transition-all [&>*]:duration-300'>
            <MDXContent source={about.content} />
          </div>
        </div>
      </div>
    </div>
  );
}
