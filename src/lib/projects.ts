import { prisma } from "@/lib/db";
import { isMock, mockProjects } from "@/mocks";
import type { Project as ProjectRow } from "@/generated/prisma/client";

export type ProjectSummary = Omit<Project, "content">;

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

function toSummary(row: Omit<ProjectRow, "content">): ProjectSummary {
  return {
    slug: row.slug,
    title: row.title,
    description: row.description,
    date: row.publishedAt!.toISOString(),
    thumbnail: row.thumbnail || "/images/empty-content.png",
    github: row.github ?? undefined,
    demo: row.demo ?? undefined,
    tech: row.tech,
  };
}

export async function getAllProjects(take?: number): Promise<ProjectSummary[]> {
  if (isMock) return mockProjects.getAll(take);
  const rows = await prisma.project.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    omit: { content: true },
    take,
  });
  return rows.map(toSummary);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (isMock) return mockProjects.getBySlug(slug);
  const row = await prisma.project.findFirst({
    where: { slug, status: "PUBLISHED" },
  });
  return row ? { ...toSummary(row), content: row.content } : null;
}
