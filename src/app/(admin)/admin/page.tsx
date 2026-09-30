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
      <Link href='/admin/posts' className='rounded-lg bg-white dark:bg-gray-800 p-6 shadow-sm'>
        <p className='text-sm text-gray-500'>Posts</p>
        <p className='text-3xl font-bold'>{posts}</p>
      </Link>
      <Link href='/admin/projects' className='rounded-lg bg-white dark:bg-gray-800 p-6 shadow-sm'>
        <p className='text-sm text-gray-500'>Projects</p>
        <p className='text-3xl font-bold'>{projects}</p>
      </Link>
      <Link href='/admin/about' className='rounded-lg bg-white dark:bg-gray-800 p-6 shadow-sm'>
        <p className='text-sm text-gray-500'>About</p>
        <p className='text-3xl font-bold'>편집</p>
      </Link>
    </div>
  );
}
