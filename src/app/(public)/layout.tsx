import Layout from "@/components/Layout";

// 빌드(docker build)가 DB 없이 돌아야 하므로 공개 페이지는 요청 시 렌더링한다 (ADR-0004).
export const dynamic = "force-dynamic";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout>{children}</Layout>;
}
