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
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100'>
      <header className='border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'>
        <nav className='max-w-5xl mx-auto px-4 py-3 flex items-center gap-6'>
          <Link href='/admin' className='font-black'>
            ADMIN
          </Link>
          <Link href='/admin/posts'>Posts</Link>
          <Link href='/admin/series'>Series</Link>
          <Link href='/admin/projects'>Projects</Link>
          <Link href='/admin/about'>About</Link>
          <Link href='/' className='ml-auto text-sm text-gray-500'>
            사이트 보기
          </Link>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}>
            <button className='text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white'>
              {session.user?.name ?? "관리자"} · 로그아웃
            </button>
          </form>
        </nav>
      </header>
      <main className='max-w-5xl mx-auto px-4 py-8'>{children}</main>
    </div>
  );
}
