import { prisma } from "@/lib/db";
import type { Project as ProjectRow } from "@/generated/prisma/client";

export interface Project {
  slug: string;
  title: string;
  description: string;
  date: string;
  thumbnail: string;
  github?: string;
  demo?: string;
  tech: string[];
  content: string;
}

function toProject(row: ProjectRow): Project {
  return {
    slug: row.slug,
    title: row.title,
    description: row.description,
    date: row.publishedAt!.toISOString(),
    thumbnail: row.thumbnail || "/images/empty-content.png",
    github: row.github ?? undefined,
    demo: row.demo ?? undefined,
    tech: row.tech,
    content: row.content,
  };
}

export async function getAllProjects(): Promise<Project[]> {
  const rows = await prisma.project.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });
  return rows.map(toProject);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const row = await prisma.project.findFirst({
    where: { slug, status: "PUBLISHED" },
  });
  return row ? toProject(row) : null;
}
