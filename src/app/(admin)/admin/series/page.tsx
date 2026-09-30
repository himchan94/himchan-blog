import { requireAdmin } from "@/auth";
import { prisma } from "@/lib/db";
import SeriesForm from "./SeriesForm";

export default async function AdminSeries() {
  await requireAdmin();
  const rows = await prisma.series.findMany({
    orderBy: { title: "asc" },
    include: { _count: { select: { posts: true } } },
  });

  return (
    <div className='space-y-4'>
      <h1 className='text-tagline font-semibold'>Series</h1>
      <SeriesForm key='new' />
      {rows.map((row) => (
        <SeriesForm
          key={row.id}
          series={{ id: row.id, title: row.title, description: row.description, postCount: row._count.posts }}
        />
      ))}
    </div>
  );
}
