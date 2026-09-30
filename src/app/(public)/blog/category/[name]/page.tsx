import { notFound } from "next/navigation";
import PostList from "@/components/PostList";
import { getPostsByCategory } from "@/lib/posts";

export default async function CategoryPage({ params }: { params: Promise<{ name: string }> }) {
  const category = decodeURIComponent((await params).name);
  const posts = await getPostsByCategory(category);

  if (posts.length === 0) {
    notFound();
  }

  return (
    <div className='max-w-4xl mx-auto'>
      <h1 className='text-4xl font-bold mb-8 text-gray-900 dark:text-white'>
        {category}
      </h1>
      <PostList posts={posts} />
    </div>
  );
}
