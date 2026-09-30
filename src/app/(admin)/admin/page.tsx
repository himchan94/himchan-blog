import Link from "next/link";
import { requireAdmin } from "@/auth";
import { prisma } from "@/lib/db";

export default async function AdminHome() {
  await requireAdmin();
  const [posts, projects] = await Promise.all([
    prisma.post.count(),
    prisma.project.count(),
  ]);

  return (
    <div className='grid gap-4 sm:grid-cols-3'>
      <Link href='/admin/posts' className='card'>
        <p className='text-caption text-ink-48'>Posts</p>
        <p className='text-display-md font-semibold'>{posts}</p>
      </Link>
      <Link href='/admin/projects' className='card'>
        <p className='text-caption text-ink-48'>Projects</p>
        <p className='text-display-md font-semibold'>{projects}</p>
      </Link>
      <Link href='/admin/about' className='card'>
        <p className='text-caption text-ink-48'>About</p>
        <p className='text-display-md font-semibold'>편집</p>
      </Link>
    </div>
  );
}
