import { notFound } from "next/navigation";
import { requireAdmin } from "@/auth";
import { prisma } from "@/lib/db";
import PostForm from "../PostForm";

export default async function EditPost({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const [post, seriesOptions] = await Promise.all([
    prisma.post.findUnique({ where: { id } }),
    prisma.series.findMany({ orderBy: { title: "asc" }, select: { id: true, title: true } }),
  ]);

  if (!post) {
    notFound();
  }

  return (
    <div className='space-y-4'>
      <h1 className='text-tagline font-semibold'>글 수정</h1>
      <PostForm post={post} seriesOptions={seriesOptions} />
    </div>
  );
}
