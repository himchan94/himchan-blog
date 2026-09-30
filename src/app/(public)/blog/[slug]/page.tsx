import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/posts";
import MDXContent from "@/components/mdx/MDXContent";
import ViewTracker from "@/components/ViewTracker";
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
    <div className='mx-auto max-w-text px-5 py-16'>
      <article>
        <header className='mb-12 text-center'>
          <h1 className='font-display text-display-md font-semibold text-ink sm:text-display-lg'>
            {post.title}
          </h1>
          <div className='mt-4 flex items-center justify-center gap-3 text-caption text-ink-48'>
            <time>
              {new Date(post.date).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span>•</span>
            <span>DEVHIMCHAN</span>
            <span>•</span>
            <span>조회 {post.views.toLocaleString("ko-KR")}</span>
          </div>
          {post.category && post.category.length > 0 && (
            <div className='mt-4 flex flex-wrap justify-center gap-2'>
              {post.category.map((cat) => (
                <Link
                  key={cat}
                  href={`/blog/category/${encodeURIComponent(cat)}`}
                  className='chip hover:border-primary hover:text-primary'>
                  {cat}
                </Link>
              ))}
            </div>
          )}
        </header>
        <div className='mx-auto max-w-reading'>
          {post.series && (
            <nav className='card mb-12'>
              <p className='mb-3 text-body font-semibold text-ink'>{post.series.title}</p>
              <ol className='space-y-1 text-caption'>
                {post.series.posts.map((item) => (
                  <li key={item.slug}>
                    {item.slug === post.slug ? (
                      <span className='font-semibold text-primary'>
                        {item.order}. {item.title}
                      </span>
                    ) : (
                      <Link href={`/blog/${item.slug}`} className='text-ink-80 hover:text-primary'>
                        {item.order}. {item.title}
                      </Link>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}
          <MDXContent source={post.content} />
        </div>
        <ViewTracker slug={post.slug} />
        <footer className='mx-auto mt-16 max-w-reading border-t border-hairline pt-8'>
          <div className='flex flex-col sm:flex-row justify-between items-center gap-4'>
            <Link
              href='/blog'
              className='group text-link inline-flex items-center text-body'>
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
          </div>
        </footer>
      </article>
    </div>
  );
}
