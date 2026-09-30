import { recordPostView } from "@/lib/posts";

export async function POST(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await recordPostView(slug);
  return new Response(null, { status: 204 });
}
