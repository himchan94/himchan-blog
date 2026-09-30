import Link from "next/link";
import { requireAdmin, signOut } from "@/auth";

// 공개 페이지와 같은 이유로 빌드 시 prerender하지 않는다 (ADR-0004).
export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();

  return (
    <div className='min-h-screen bg-parchment text-ink'>
      <header className='border-b border-hairline bg-canvas'>
        <nav className='max-w-5xl mx-auto px-4 py-3 flex items-center gap-6 text-caption text-ink-80'>
          <Link href='/admin' className='font-semibold text-ink'>
            ADMIN
          </Link>
          <Link href='/admin/posts'>Posts</Link>
          <Link href='/admin/series'>Series</Link>
          <Link href='/admin/projects'>Projects</Link>
          <Link href='/admin/about'>About</Link>
          <Link href='/' className='ml-auto text-ink-48 hover:text-ink'>
            사이트 보기
          </Link>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}>
            <button className='btn-utility'>
              {session.user?.name ?? "관리자"} · 로그아웃
            </button>
          </form>
        </nav>
      </header>
      <main className='max-w-5xl mx-auto px-4 py-8'>{children}</main>
    </div>
  );
}
