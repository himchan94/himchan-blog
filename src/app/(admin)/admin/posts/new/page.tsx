import { requireAdmin } from "@/auth";
import { prisma } from "@/lib/db";
import PostForm from "../PostForm";

export default async function NewPost() {
  await requireAdmin();
  const seriesOptions = await prisma.series.findMany({
    orderBy: { title: "asc" },
    select: { id: true, title: true },
  });

  return (
    <div className='space-y-4'>
      <h1 className='text-tagline font-semibold'>새 글</h1>
      <PostForm seriesOptions={seriesOptions} />
    </div>
  );
}
