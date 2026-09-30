import { requireAdmin } from "@/auth";
import { prisma } from "@/lib/db";
import { isMock, mockAdmin } from "@/mocks";
import ContentTable from "../ContentTable";

export default async function AdminPosts() {
  await requireAdmin();
  const rows = isMock ? mockAdmin.posts() : await prisma.post.findMany({
    orderBy: [{ publishedAt: { sort: "desc", nulls: "first" } }, { createdAt: "desc" }],
  });

  return <ContentTable title='Posts' basePath='/admin/posts' rows={rows} />;
}
