import { Readable } from "node:stream";
import { BUCKET, MEDIA_KEY_PATTERN, storage } from "@/lib/storage";

export async function GET(_request: Request, { params }: { params: Promise<{ key: string[] }> }) {
  const key = (await params).key.join("/");
  if (!MEDIA_KEY_PATTERN.test(key)) return new Response(null, { status: 404 });

  try {
    const client = storage();
    const stat = await client.statObject(BUCKET, key);
    const body = await client.getObject(BUCKET, key);
    return new Response(Readable.toWeb(body) as ReadableStream, {
      headers: {
        "Content-Type": stat.metaData["content-type"] ?? "application/octet-stream",
        "Content-Length": String(stat.size),
        // 키에 UUID가 들어가 같은 URL의 내용이 바뀌지 않는다.
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    const code = (error as { code?: string }).code;
    if (code === "NotFound" || code === "NoSuchKey") return new Response(null, { status: 404 });
    throw error;
  }
}
