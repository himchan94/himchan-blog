// DB 없이 로컬에서 공개 페이지를 보기 위한 임시 데이터. DB가 준비되면 이 폴더와 `isMock` 분기를 지운다.
import type { Post, PostSummary } from "@/lib/posts";
import type { Project, ProjectSummary } from "@/lib/projects";

export const isMock = process.env.USE_MOCK_DATA === "true";

const series = { title: "Next.js로 블로그 만들기" };

const posts: (Post & { seriesOrder?: number })[] = [
  {
    slug: "mock-nextjs-blog-2",
    title: "Next.js로 블로그 만들기 2 — Prisma 연결",
    date: "2026-09-20T00:00:00.000Z",
    description: "PostgreSQL과 Prisma로 글 저장소를 옮긴다.",
    category: ["Next.js", "Prisma"],
    content: "## Prisma 연결\n\n```ts\nconst posts = await prisma.post.findMany();\n```\n\n목업 본문입니다.",
    views: 42,
    series: null,
    seriesOrder: 2,
  },
  {
    slug: "mock-nextjs-blog-1",
    title: "Next.js로 블로그 만들기 1 — 프로젝트 구성",
    date: "2026-09-10T00:00:00.000Z",
    description: "App Router와 MDX로 블로그 뼈대를 만든다.",
    category: ["Next.js"],
    content: "## 시작하기\n\n- App Router\n- MDX\n- Tailwind CSS\n\n> 목업 본문입니다.",
    views: 128,
    series: null,
    seriesOrder: 1,
  },
  {
    slug: "mock-typescript-tips",
    title: "자주 쓰는 TypeScript 유틸리티 타입",
    date: "2026-08-28T00:00:00.000Z",
    description: "Pick, Omit, Partial을 언제 쓰는지 정리한다.",
    category: ["TypeScript"],
    content: "## Omit\n\n```ts\ntype Summary = Omit<Post, \"content\">;\n```\n\n| 타입 | 용도 |\n| --- | --- |\n| Pick | 일부만 |\n| Omit | 일부 제외 |",
    views: 7,
    series: null,
  },
  {
    slug: "mock-docker-compose",
    title: "Docker Compose로 VPS 배포하기",
    date: "2026-08-01T00:00:00.000Z",
    description: "앱과 DB를 Compose 하나로 띄운다.",
    content: "## 배포\n\n```bash\ndocker compose --profile app up -d --build\n```",
    views: 0,
    series: null,
  },
];

const seriesPosts = posts
  .filter((p) => p.seriesOrder)
  .map((p) => ({ slug: p.slug, title: p.title, order: p.seriesOrder! }))
  .sort((a, b) => a.order - b.order);

const toSummary = ({ slug, title, date, description, category }: Post): PostSummary => ({
  slug,
  title,
  date,
  description,
  category,
});

export const mockPosts = {
  getAll: (take?: number) => posts.slice(0, take).map(toSummary),
  getByCategory: (category: string) =>
    posts.filter((p) => p.category?.includes(category)).map(toSummary),
  getBySlug: (slug: string): Post | null => {
    const post = posts.find((p) => p.slug === slug);
    if (!post) return null;
    const { seriesOrder, ...rest } = post;
    return { ...rest, series: seriesOrder ? { ...series, posts: seriesPosts } : null };
  },
};

const projects: Project[] = [
  {
    slug: "mock-personal-blog",
    title: "개인 블로그",
    description: "Next.js + PostgreSQL로 만든 블로그",
    date: "2026-09-01T00:00:00.000Z",
    thumbnail: "/images/burning-computer.png",
    github: "https://github.com",
    tech: ["Next.js", "Prisma", "PostgreSQL"],
    content: "## 소개\n\n목업 프로젝트입니다.",
  },
  {
    slug: "mock-home-server",
    title: "홈 서버",
    description: "남는 노트북으로 만든 홈 서버",
    date: "2026-07-15T00:00:00.000Z",
    thumbnail: "/images/empty-content.png",
    tech: ["Docker", "Linux"],
    content: "## 구성\n\n- Ubuntu\n- Docker",
  },
];

export const mockProjects = {
  getAll: (take?: number): ProjectSummary[] => projects.slice(0, take),
  getBySlug: (slug: string) => projects.find((p) => p.slug === slug) ?? null,
};

export const mockAbout = { content: "## 안녕하세요\n\n목업 About 페이지입니다." };
