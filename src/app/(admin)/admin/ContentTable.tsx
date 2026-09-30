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
        <h1 className='text-tagline font-semibold'>{title}</h1>
        <Link href={`${basePath}/new`} className='btn-utility'>
          새로 쓰기
        </Link>
      </div>
      <div className='card overflow-x-auto p-0'>
        <table className='w-full text-left text-caption'>
          <thead className='border-b border-hairline text-ink-48'>
            <tr>
              <th className='px-4 py-3 font-semibold'>제목</th>
              <th className='px-4 py-3 font-semibold'>slug</th>
              <th className='px-4 py-3 font-semibold'>상태</th>
              <th className='px-4 py-3 font-semibold'>발행일</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className='border-b border-divider last:border-b-0'>
                <td className='px-4 py-3'>
                  <Link href={`${basePath}/${row.id}`} className='font-semibold text-link'>
                    {row.title}
                  </Link>
                </td>
                <td className='px-4 py-3 text-ink-48'>{row.slug}</td>
                <td className='px-4 py-3'>
                  <span className='chip'>{row.status === "PUBLISHED" ? "공개" : "임시저장"}</span>
                </td>
                <td className='px-4 py-3 text-ink-48'>{row.publishedAt?.toISOString().slice(0, 10) ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
