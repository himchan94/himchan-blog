import Link from "next/link";
import type { Status } from "@/generated/prisma/client";

type Row = { id: string; slug: string; title: string; status: Status; publishedAt: Date | null };

export default function ContentTable({
  title,
  basePath,
  rows,
}: {
  title: string;
  basePath: string;
  rows: Row[];
}) {
  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>{title}</h1>
        <Link href={`${basePath}/new`} className='rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'>
          새로 쓰기
        </Link>
      </div>
      <table className='w-full text-left text-sm'>
        <thead className='border-b border-gray-200 dark:border-gray-700 text-gray-500'>
          <tr>
            <th className='py-2'>제목</th>
            <th>slug</th>
            <th>상태</th>
            <th>발행일</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className='border-b border-gray-100 dark:border-gray-800'>
              <td className='py-2'>
                <Link href={`${basePath}/${row.id}`} className='font-medium hover:underline'>
                  {row.title}
                </Link>
              </td>
              <td className='text-gray-500'>{row.slug}</td>
              <td>{row.status === "PUBLISHED" ? "공개" : "임시저장"}</td>
              <td className='text-gray-500'>{row.publishedAt?.toISOString().slice(0, 10) ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
