import { prisma } from "@/lib/db";
import type { Post as PostRow } from "@/generated/prisma/client";

export interface PostSummary {
  slug: string;
  title: string;
  date: string;
  description: string;
  category?: string[];
}

export interface Post extends PostSummary {
  content: string;
  views: number;
  series: { title: string; posts: { slug: string; title: string; order: number }[] } | null;
}

function toSummary(row: Omit<PostRow, "content">): PostSummary {
  return {
    slug: row.slug,
    title: row.title,
    // PUBLISHED면 publishedAt이 있다 — DB CHECK 제약 Post_published_has_date.
    date: row.publishedAt!.toISOString(),
    description: row.description,
    category: row.categories.length > 0 ? row.categories : undefined,
  };
}

const newestFirst = [{ publishedAt: "desc" }, { createdAt: "desc" }] as const;

// 공개 쿼리는 PUBLISHED만 본다. 발행 시 publishedAt이 채워진다.
export async function getAllPosts(take?: number): Promise<PostSummary[]> {
  const rows = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [...newestFirst],
    omit: { content: true },
    take,
  });
  return rows.map(toSummary);
}

export async function getPostsByCategory(category: string): Promise<PostSummary[]> {
  const rows = await prisma.post.findMany({
    where: { status: "PUBLISHED", categories: { has: category } },
    orderBy: [...newestFirst],
    omit: { content: true },
  });
  return rows.map(toSummary);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const row = await prisma.post.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: {
      series: {
        select: {
          title: true,
          posts: {
            where: { status: "PUBLISHED" },
            orderBy: { seriesOrder: "asc" },
            select: { slug: true, title: true, seriesOrder: true },
          },
        },
      },
    },
  });
  if (!row) return null;

  const views = await prisma.postView.aggregate({
    where: { postId: row.id },
    _sum: { count: true },
  });

  return {
    ...toSummary(row),
    content: row.content,
    views: views._sum.count ?? 0,
    series: row.series && {
      title: row.series.title,
      posts: row.series.posts.map((p) => ({ slug: p.slug, title: p.title, order: p.seriesOrder! })),
    },
  };
}

// 한 문장으로 증가시켜 동시 요청에도 행이 하나로 유지된다. 공개 글이 아니면 아무것도 쓰지 않는다.
export async function recordPostView(slug: string): Promise<void> {
  await prisma.$executeRaw`
    INSERT INTO "PostView" ("postId", "date", "count")
    SELECT "id", (now() AT TIME ZONE 'Asia/Seoul')::date, 1
    FROM "Post" WHERE "slug" = ${slug} AND "status" = 'PUBLISHED'
    ON CONFLICT ("postId", "date") DO UPDATE SET "count" = "PostView"."count" + 1`;
}
