import { requireAdmin } from "@/auth";
import { prisma } from "@/lib/db";
import ContentTable from "../ContentTable";

export default async function AdminPosts() {
  await requireAdmin();
  const rows = await prisma.post.findMany({
    orderBy: [{ publishedAt: { sort: "desc", nulls: "first" } }, { createdAt: "desc" }],
  });

  return <ContentTable title='Posts' basePath='/admin/posts' rows={rows} />;
}
