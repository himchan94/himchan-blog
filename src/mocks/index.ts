// DB 없이 로컬에서 보기 위한 임시 데이터. DB가 준비되면 이 폴더와 `isMock` 분기를 지운다.
import type {
  Post as PostRow,
  Project as ProjectRow,
  Series as SeriesRow,
} from "@/generated/prisma/client";
import type { Post, PostSummary } from "@/lib/posts";
import type { Project, ProjectSummary } from "@/lib/projects";

// 목업 모드는 관리자 인증도 건너뛰므로 운영 빌드에서는 env가 켜져 있어도 무시한다.
export const isMock =
  process.env.NODE_ENV !== "production" && process.env.USE_MOCK_DATA === "true";

type Store = {
  posts: PostRow[];
  projects: ProjectRow[];
  series: SeriesRow[];
  views: Record<string, number>;
  about: string;
};

const day = (date: string) => new Date(`${date}T00:00:00.000Z`);

function seed(): Store {
  const at = day("2026-07-01");
  const base = { createdAt: at, updatedAt: at };
  return {
    series: [{ id: "mock-series-1", title: "Next.js로 블로그 만들기", description: "", ...base }],
    posts: [
      {
        id: "mock-post-1",
        slug: "mock-nextjs-blog-1",
        title: "Next.js로 블로그 만들기 1 — 프로젝트 구성",
        description: "App Router와 MDX로 블로그 뼈대를 만든다.",
        content: "## 시작하기\n\n- App Router\n- MDX\n- Tailwind CSS\n\n> 목업 본문입니다.",
        categories: ["Next.js"],
        status: "PUBLISHED",
        publishedAt: day("2026-09-10"),
        seriesId: "mock-series-1",
        seriesOrder: 1,
        ...base,
      },
      {
        id: "mock-post-2",
        slug: "mock-nextjs-blog-2",
        title: "Next.js로 블로그 만들기 2 — Prisma 연결",
        description: "PostgreSQL과 Prisma로 글 저장소를 옮긴다.",
        content: "## Prisma 연결\n\n```ts\nconst posts = await prisma.post.findMany();\n```\n\n목업 본문입니다.",
        categories: ["Next.js", "Prisma"],
        status: "PUBLISHED",
        publishedAt: day("2026-09-20"),
        seriesId: "mock-series-1",
        seriesOrder: 2,
        ...base,
      },
      {
        id: "mock-post-3",
        slug: "mock-typescript-tips",
        title: "자주 쓰는 TypeScript 유틸리티 타입",
        description: "Pick, Omit, Partial을 언제 쓰는지 정리한다.",
        content: "## Omit\n\n```ts\ntype Summary = Omit<Post, \"content\">;\n```\n\n| 타입 | 용도 |\n| --- | --- |\n| Pick | 일부만 |\n| Omit | 일부 제외 |",
        categories: ["TypeScript"],
        status: "PUBLISHED",
        publishedAt: day("2026-08-28"),
        seriesId: null,
        seriesOrder: null,
        ...base,
      },
      {
        id: "mock-post-4",
        slug: "mock-docker-compose",
        title: "Docker Compose로 VPS 배포하기",
        description: "앱과 DB를 Compose 하나로 띄운다.",
        content: "## 배포\n\n```bash\ndocker compose --profile app up -d --build\n```",
        categories: [],
        status: "PUBLISHED",
        publishedAt: day("2026-08-01"),
        seriesId: null,
        seriesOrder: null,
        ...base,
      },
      {
        id: "mock-post-5",
        slug: "mock-draft",
        title: "작성 중인 글",
        description: "공개 페이지에는 보이지 않는 초안.",
        content: "초안입니다.",
        categories: [],
        status: "DRAFT",
        publishedAt: null,
        seriesId: null,
        seriesOrder: null,
        ...base,
      },
    ],
    views: { "mock-post-1": 128, "mock-post-2": 42, "mock-post-3": 7 },
    projects: [
      {
        id: "mock-project-1",
        slug: "mock-personal-blog",
        title: "개인 블로그",
        description: "Next.js + PostgreSQL로 만든 블로그",
        content: "## 소개\n\n목업 프로젝트입니다.",
        thumbnail: "/images/burning-computer.png",
        github: "https://github.com",
        demo: null,
        tech: ["Next.js", "Prisma", "PostgreSQL"],
        status: "PUBLISHED",
        publishedAt: day("2026-09-01"),
        ...base,
      },
      {
        id: "mock-project-2",
        slug: "mock-home-server",
        title: "홈 서버",
        description: "남는 노트북으로 만든 홈 서버",
        content: "## 구성\n\n- Ubuntu\n- Docker",
        thumbnail: null,
        github: null,
        demo: null,
        tech: ["Docker", "Linux"],
        status: "PUBLISHED",
        publishedAt: day("2026-07-15"),
        ...base,
      },
    ],
    about: "## 안녕하세요\n\n목업 About 페이지입니다.",
  };
}

// 페이지와 Server Action이 같은 데이터를 보도록, HMR에도 유지되도록 전역에 둔다.
const globalForMock = globalThis as unknown as { mockStore?: Store };
const store = (globalForMock.mockStore ??= seed());

const time = (date: Date | null) => date?.getTime() ?? Infinity;
const newestFirst = <T extends { publishedAt: Date | null; createdAt: Date }>(a: T, b: T) =>
  time(b.publishedAt) - time(a.publishedAt) || b.createdAt.getTime() - a.createdAt.getTime();
const published = <T extends { status: string; publishedAt: Date | null; createdAt: Date }>(rows: T[]) =>
  rows.filter((row) => row.status === "PUBLISHED").sort(newestFirst);

// ---- 공개 페이지 (src/lib의 반환 형태) ----

const toPostSummary = (row: PostRow): PostSummary => ({
  slug: row.slug,
  title: row.title,
  date: row.publishedAt!.toISOString(),
  description: row.description,
  category: row.categories.length > 0 ? row.categories : undefined,
});

export const mockPosts = {
  getAll: (take?: number) => published(store.posts).slice(0, take).map(toPostSummary),
  getByCategory: (category: string) =>
    published(store.posts).filter((p) => p.categories.includes(category)).map(toPostSummary),
  getBySlug: (slug: string): Post | null => {
    const row = published(store.posts).find((p) => p.slug === slug);
    if (!row) return null;
    const series = store.series.find((s) => s.id === row.seriesId);
    return {
      ...toPostSummary(row),
      content: row.content,
      views: store.views[row.id] ?? 0,
      series: series
        ? {
            title: series.title,
            posts: published(store.posts)
              .filter((p) => p.seriesId === series.id)
              .map((p) => ({ slug: p.slug, title: p.title, order: p.seriesOrder! }))
              .sort((a, b) => a.order - b.order),
          }
        : null,
    };
  },
};

const toProject = (row: ProjectRow): Project => ({
  slug: row.slug,
  title: row.title,
  description: row.description,
  date: row.publishedAt!.toISOString(),
  thumbnail: row.thumbnail || "/images/empty-content.png",
  github: row.github ?? undefined,
  demo: row.demo ?? undefined,
  tech: row.tech,
  content: row.content,
});

export const mockProjects = {
  getAll: (take?: number): ProjectSummary[] => published(store.projects).slice(0, take).map(toProject),
  getBySlug: (slug: string) => {
    const row = published(store.projects).find((p) => p.slug === slug);
    return row ? toProject(row) : null;
  },
};

export const mockAbout = () => ({ content: store.about });

// ---- 관리자 (Prisma 행 형태) ----

type PostInput = Omit<PostRow, "id" | "createdAt" | "updatedAt">;
type ProjectInput = Omit<ProjectRow, "id" | "createdAt" | "updatedAt">;

const adminOrder = <T extends { publishedAt: Date | null; createdAt: Date }>(rows: T[]) =>
  [...rows].sort(newestFirst);

// 실패하면 에러 메시지를 반환한다 — DB 제약(slug 유니크, 발행 후 slug 고정)을 흉내 낸다.
function save<T extends { id: string; slug: string; status: string; createdAt: Date; updatedAt: Date }>(
  rows: T[],
  prefix: string,
  id: string | null,
  data: Omit<T, "id" | "createdAt" | "updatedAt">
): string | null {
  const existing = rows.find((row) => row.id === id);
  if (id && !existing) return "이미 삭제된 항목입니다.";
  if (existing?.status === "PUBLISHED") data.slug = existing.slug;
  if (rows.some((row) => row.slug === data.slug && row.id !== id)) return "이미 사용 중인 slug입니다.";

  const now = new Date();
  if (existing) Object.assign(existing, data, { updatedAt: now });
  else rows.push({ ...data, id: `${prefix}-${now.getTime()}`, createdAt: now, updatedAt: now } as T);
  return null;
}

const remove = <T extends { id: string }>(rows: T[], id: string) => {
  const index = rows.findIndex((row) => row.id === id);
  if (index >= 0) rows.splice(index, 1);
};

export const mockAdmin = {
  counts: () => [store.posts.length, store.projects.length] as const,

  posts: () => adminOrder(store.posts),
  post: (id: string) => store.posts.find((p) => p.id === id) ?? null,
  savePost: (id: string | null, data: PostInput) => {
    const taken = data.seriesId
      ? store.posts.find((p) => p.seriesId === data.seriesId && p.seriesOrder === data.seriesOrder && p.id !== id)
      : undefined;
    if (taken) return `이 시리즈의 ${data.seriesOrder}번은 "${taken.title}"가 쓰고 있습니다.`;
    return save(store.posts, "mock-post", id, data);
  },
  deletePost: (id: string) => remove(store.posts, id),

  projects: () => adminOrder(store.projects),
  project: (id: string) => store.projects.find((p) => p.id === id) ?? null,
  saveProject: (id: string | null, data: ProjectInput) => save(store.projects, "mock-project", id, data),
  deleteProject: (id: string) => remove(store.projects, id),

  seriesOptions: () =>
    [...store.series].sort((a, b) => a.title.localeCompare(b.title)).map(({ id, title }) => ({ id, title })),
  series: () =>
    [...store.series]
      .sort((a, b) => a.title.localeCompare(b.title))
      .map((s) => ({ ...s, _count: { posts: store.posts.filter((p) => p.seriesId === s.id).length } })),
  saveSeries: (id: string | null, data: { title: string; description: string }) => {
    if (store.series.some((s) => s.title === data.title && s.id !== id)) return "같은 제목의 시리즈가 있습니다.";
    const now = new Date();
    const existing = store.series.find((s) => s.id === id);
    if (existing) Object.assign(existing, data, { updatedAt: now });
    else store.series.push({ ...data, id: `mock-series-${now.getTime()}`, createdAt: now, updatedAt: now });
    return null;
  },
  // 실제 DB는 FK(Restrict)가 글이 연결된 시리즈 삭제를 막는다.
  deleteSeries: (id: string) => {
    if (!store.posts.some((p) => p.seriesId === id)) remove(store.series, id);
  },

  saveAbout: (content: string) => {
    store.about = content;
  },
};
