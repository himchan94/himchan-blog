import PostList from "@/components/PostList";
import { getAllPosts } from "@/lib/posts";
import Link from "next/link";

export default async function Blog() {
  const posts = await getAllPosts();
  const categories = [...new Set(posts.flatMap((post) => post.category ?? []))].sort();

  return (
    <>
      <section className='tile-parchment'>
        <div className='mx-auto max-w-text px-5 text-center'>
          <h1 className='font-display text-display-lg font-semibold text-ink'>
            Blog Posts
          </h1>
          {categories.length > 0 && (
            <div className='mt-8 flex flex-wrap justify-center gap-2'>
              {categories.map((cat) => (
                <Link
                  key={cat}
                  href={`/blog/category/${encodeURIComponent(cat)}`}
                  className='chip hover:border-primary hover:text-primary'>
                  {cat}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
      <section className='tile'>
        <div className='mx-auto max-w-text px-5'>
          {posts.length > 0 ? (
            <PostList posts={posts} />
          ) : (
            <p className='py-12 text-center text-body text-ink-48'>
              아직 작성된 포스트가 없습니다.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
