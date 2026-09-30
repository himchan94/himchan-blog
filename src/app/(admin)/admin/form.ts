import { Prisma, type Status } from "@/generated/prisma/client";
import { validateMdx } from "@/components/mdx/validate";

// 실패 시 values를 돌려준다. React 19는 action이 끝나면 폼을 defaultValue로 초기화한다.
export type FormState = { error?: string; message?: string; values?: Record<string, string> };

// 기존 slug(home-server.status)가 점을 쓰므로 허용한다.
const SLUG_PATTERN = /^[a-z0-9][a-z0-9.-]*$/;

export const field = (formData: FormData, key: string) =>
  String(formData.get(key) ?? "").trim();

export const formError = (error: string, formData: FormData): FormState => ({
  error,
  values: Object.fromEntries(
    [...formData].filter((entry): entry is [string, string] => typeof entry[1] === "string")
  ),
});

// 표시·정렬 모두 날짜 단위라 KST 기준 오늘을 UTC 자정으로 저장한다 (기존 글과 같은 형식).
const todayInSeoul = () =>
  new Date(new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" }));

export const splitList = (value: string) =>
  value.split(",").map((item) => item.trim()).filter(Boolean);

// Post·Project 공통 필드. 실패하면 사용자에게 보여줄 에러 문자열을 반환한다.
export async function readContentFields(formData: FormData) {
  const slug = field(formData, "slug");
  const title = field(formData, "title");
  const content = field(formData, "content");
  const status: Status = field(formData, "status") === "PUBLISHED" ? "PUBLISHED" : "DRAFT";
  const date = field(formData, "publishedAt");

  if (!SLUG_PATTERN.test(slug)) return "slug는 영문 소문자·숫자·-·.만 쓸 수 있습니다.";
  if (!title) return "제목을 입력하세요.";
  const mdxError = await validateMdx(content);
  if (mdxError) return mdxError;

  return {
    slug,
    title,
    description: field(formData, "description"),
    content,
    status,
    publishedAt: date ? new Date(date) : status === "PUBLISHED" ? todayInSeoul() : null,
  };
}

export function toSaveError(error: unknown, formData: FormData): FormState {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") return formError("이미 사용 중인 slug입니다.", formData);
    if (error.code === "P2025") return formError("이미 삭제된 항목입니다.", formData);
  }
  throw error;
}
