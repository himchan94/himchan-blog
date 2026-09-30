import { notFound } from "next/navigation";
import { requireAdmin } from "@/auth";
import { prisma } from "@/lib/db";
import PostForm from "../PostForm";

export default async function EditPost({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });

  if (!post) {
    notFound();
  }

  return (
    <div className='space-y-4'>
      <h1 className='text-2xl font-bold'>글 수정</h1>
      <PostForm post={post} />
    </div>
  );
}
