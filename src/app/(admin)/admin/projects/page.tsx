import { requireAdmin } from "@/auth";
import { prisma } from "@/lib/db";
import { isMock, mockAdmin } from "@/mocks";
import ContentTable from "../ContentTable";

export default async function AdminProjects() {
  await requireAdmin();
  const rows = isMock ? mockAdmin.projects() : await prisma.project.findMany({
    orderBy: [{ publishedAt: { sort: "desc", nulls: "first" } }, { createdAt: "desc" }],
  });

  return <ContentTable title='Projects' basePath='/admin/projects' rows={rows} />;
}
