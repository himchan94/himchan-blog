import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/posts";
import MDXContent from "@/components/mdx/MDXContent";
import Link from "next/link";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;

  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className='max-w-4xl mx-auto px-4 py-16'>
      <article>
        <header className='mb-16 text-center'>
          <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent'>
            {post.title}
          </h1>
          <div className='flex items-center justify-center space-x-4 text-gray-500 dark:text-gray-400'>
            <time className='font-medium'>
              {new Date(post.date).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span>•</span>
            <span className='font-medium'>DEVHIMCHAN</span>
          </div>
          {post.category && post.category.length > 0 && (
            <div className='mt-4 flex flex-wrap justify-center gap-2'>
              {post.category.map((cat) => (
                <span
                  key={cat}
                  className='px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full'>
                  {cat}
                </span>
              ))}
            </div>
          )}
        </header>
        <div className='prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-img:rounded-xl prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-800'>
          <MDXContent source={post.content} />
        </div>
        <footer className='mt-16 pt-8 border-t border-gray-200 dark:border-gray-700'>
          <div className='flex flex-col sm:flex-row justify-between items-center gap-4'>
            <Link
              href='/blog'
              className='group inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors'>
              <svg
                className='w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 19l-7-7 7-7'
                />
              </svg>
              목록으로 돌아가기
            </Link>
            {/* <a
              href={`https://github.com/devhimchan/blog/edit/main/src/content/posts/${params.slug}.mdx`}
              target='_blank'
              rel='noopener noreferrer'
              className='group inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors'>
              <svg
                className='w-5 h-5 mr-2'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                />
              </svg>
              GitHub에서 수정하기
              <svg
                className='w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 5l7 7-7 7'
                />
              </svg>
            </a> */}
          </div>
        </footer>
      </article>
    </div>
  );
}
