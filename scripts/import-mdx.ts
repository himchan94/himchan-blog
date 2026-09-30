// 1회용: src/content의 MDX 파일을 DB로 옮긴다. slug로 upsert하므로 다시 실행해도 된다.
import "dotenv/config";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { prisma } from "@/lib/db";

const contentDir = path.join(process.cwd(), "src/content");

// 렌더 시 import는 무시되고 컴포넌트는 허용 목록으로 주입되므로 DB 본문에 남기지 않는다.
const stripImports = (content: string) =>
  content.replace(/^import\s.+from\s+["'].+["'];?\s*$/gm, "").trim();

const orNull = (value?: string) => value || null;

function readDir(dir: string) {
  return fs
    .readdirSync(path.join(contentDir, dir))
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => {
      const { data, content } = matter(
        fs.readFileSync(path.join(contentDir, dir, fileName), "utf8")
      );
      return { slug: fileName.replace(/\.mdx$/, ""), data, content: stripImports(content) };
    });
}

async function main() {
  for (const { slug, data, content } of readDir("posts")) {
    const post = {
      title: data.title,
      description: data.description,
      content,
      categories: data.category
        ? data.category.split(",").map((cat: string) => cat.trim())
        : [],
      status: "PUBLISHED" as const,
      publishedAt: new Date(data.date),
    };
    await prisma.post.upsert({ where: { slug }, create: { slug, ...post }, update: post });
  }

  for (const { slug, data, content } of readDir("projects")) {
    const project = {
      title: data.title,
      description: data.description,
      content,
      thumbnail: orNull(data.thumbnail),
      github: orNull(data.github),
      demo: orNull(data.demo),
      tech: data.tech ?? [],
      status: "PUBLISHED" as const,
      publishedAt: new Date(data.date),
    };
    await prisma.project.upsert({ where: { slug }, create: { slug, ...project }, update: project });
  }

  const about = matter(fs.readFileSync(path.join(contentDir, "about.mdx"), "utf8")).content.trim();
  await prisma.page.upsert({
    where: { key: "about" },
    create: { key: "about", content: about },
    update: { content: about },
  });

  console.log({
    posts: await prisma.post.count(),
    projects: await prisma.project.count(),
    pages: await prisma.page.count(),
  });
}

main().finally(() => prisma.$disconnect());
