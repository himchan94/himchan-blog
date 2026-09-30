import { prisma } from "@/lib/db";
import type { Post as PostRow } from "@/generated/prisma/client";

export interface Post {
  slug: string;
  title: string;
  date: string;
  description: string;
  category?: string[];
  content: string;
}

function toPost(row: PostRow): Post {
  return {
    slug: row.slug,
    title: row.title,
    date: row.publishedAt!.toISOString(),
    description: row.description,
    category: row.categories.length > 0 ? row.categories : undefined,
    content: row.content,
  };
}

// 공개 쿼리는 PUBLISHED만 본다. 발행 시 publishedAt이 채워진다.
export async function getAllPosts(): Promise<Post[]> {
  const rows = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });
  return rows.map(toPost);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const row = await prisma.post.findFirst({
    where: { slug, status: "PUBLISHED" },
  });
  return row ? toPost(row) : null;
}
