"use server";

import { randomUUID } from "node:crypto";
import { requireAdmin } from "@/auth";
import { BUCKET, IMAGE_TYPES, storage } from "@/lib/storage";

// next.config의 serverActions.bodySizeLimit은 multipart 여유분을 더해 이보다 크게 둔다.
const MAX_BYTES = 10 * 1024 * 1024;

export async function uploadImage(formData: FormData): Promise<{ url: string } | { error: string }> {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File)) return { error: "파일이 없습니다." };
  const ext = IMAGE_TYPES[file.type];
  if (!ext) return { error: "png·jpg·gif·webp·avif만 올릴 수 있습니다." };
  if (file.size > MAX_BYTES) return { error: "10MB 이하만 올릴 수 있습니다." };

  const month = new Date().toISOString().slice(0, 7).replace("-", "/");
  const key = `${month}/${randomUUID()}.${ext}`;
  await storage().putObject(BUCKET, key, Buffer.from(await file.arrayBuffer()), file.size, {
    "Content-Type": file.type,
  });
  return { url: `/media/${key}` };
}
