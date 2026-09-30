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
    <>
      <section className='tile-parchment'>
        <div className='mx-auto max-w-text px-5 text-center'>
          <h1 className='font-display text-display-lg font-semibold text-ink'>
            {category}
          </h1>
        </div>
      </section>
      <section className='tile'>
        <div className='mx-auto max-w-text px-5'>
          <PostList posts={posts} />
        </div>
      </section>
    </>
  );
}
