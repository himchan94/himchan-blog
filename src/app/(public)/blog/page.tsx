import PostList from "@/components/PostList";
import { getAllPosts } from "@/lib/posts";

export default async function Blog() {
  const posts = await getAllPosts();

  return (
    <div className='max-w-4xl mx-auto'>
      <h1 className='text-4xl font-bold mb-8 text-gray-900 dark:text-white'>
        Blog Posts
      </h1>
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
