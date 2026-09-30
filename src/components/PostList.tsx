import Link from "next/link";
import { PostSummary } from "@/lib/posts";

interface PostListProps {
  posts: PostSummary[];
}

export default function PostList({ posts }: PostListProps) {
  return (
    <div className='divide-y divide-hairline'>
      {posts.map((post) => (
        <article key={post.slug} className='group'>
          <Link href={`/blog/${post.slug}`} className='block py-8'>
            <time className='text-caption text-ink-48'>
              {new Date(post.date).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <h2 className='mt-1 font-display text-lead-airy font-semibold text-ink group-hover:text-primary'>
              {post.title}
            </h2>
            <p className='mt-2 line-clamp-2 text-body text-ink-80'>
              {post.description}
            </p>
            {post.category && post.category.length > 0 && (
              <div className='mt-4 flex flex-wrap gap-2'>
                {post.category.map((cat) => (
                  <span key={cat} className='chip'>
                    {cat}
                  </span>
                ))}
              </div>
            )}
          </Link>
        </article>
      ))}
    </div>
  );
}
