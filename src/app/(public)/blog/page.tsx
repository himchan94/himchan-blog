import PostList from "@/components/PostList";
import { getAllPosts } from "@/lib/posts";
import Link from "next/link";

export default async function Blog() {
  const posts = await getAllPosts();
  const categories = [...new Set(posts.flatMap((post) => post.category ?? []))].sort();

  return (
    <div className='max-w-4xl mx-auto'>
      <h1 className='text-4xl font-bold mb-8 text-gray-900 dark:text-white'>
        Blog Posts
      </h1>
      {categories.length > 0 && (
        <div className='mb-8 flex flex-wrap gap-2'>
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/blog/category/${encodeURIComponent(cat)}`}
              className='px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800'>
              {cat}
            </Link>
          ))}
        </div>
      )}
      {posts.length > 0 ? (
        <PostList posts={posts} />
      ) : (
        <p className='text-gray-600 dark:text-gray-400 text-center py-12'>
          아직 작성된 포스트가 없습니다.
        </p>
      )}
    </div>
  );
}
