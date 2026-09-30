import Link from "next/link";
import { PostSummary } from "@/lib/posts";

interface PostListProps {
  posts: PostSummary[];
}

export default function PostList({ posts }: PostListProps) {
  return (
    <div className='grid gap-8'>
      {posts.map((post) => (
        <article
          key={post.slug}
          className='group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300'>
          <div className='absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600/50 to-purple-600/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
          <Link href={`/blog/${post.slug}`} className='block p-8 relative'>
            <div className='flex flex-col'>
              <time className='text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium'>
                {new Date(post.date).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <h2 className='text-xl sm:text-2xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-white transition-colors duration-300'>
                {post.title}
              </h2>
              <p className='text-gray-600 dark:text-gray-300 group-hover:text-gray-100 mb-4 line-clamp-2 transition-colors duration-300'>
                {post.description}
              </p>
              {post.category && post.category.length > 0 && (
                <div className='flex flex-wrap gap-2 mb-4'>
                  {post.category.map((cat) => (
                    <span
                      key={cat}
                      className='px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 rounded-full group-hover:bg-white/20 group-hover:text-white transition-colors duration-300'>
                      {cat}
                    </span>
                  ))}
                </div>
              )}
              <div className='mt-auto flex items-center text-blue-600 dark:text-blue-400 group-hover:text-white font-medium transition-colors duration-300'>
                <span>자세히 보기</span>
                <svg
                  className='w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform'
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
              </div>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}
