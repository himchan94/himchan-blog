import { Client } from "minio";

export const BUCKET = process.env.S3_BUCKET || "blog";

// 빌드 중에는 env가 없으므로 요청 시점에 만든다.
let client: Client | undefined;
export function storage() {
  if (!client) {
    const url = new URL(process.env.S3_URL || "http://localhost:9000");
    client = new Client({
      endPoint: url.hostname,
      port: Number(url.port) || (url.protocol === "https:" ? 443 : 80),
      useSSL: url.protocol === "https:",
      accessKey: process.env.S3_ACCESS_KEY ?? "",
      secretKey: process.env.S3_SECRET_KEY ?? "",
    });
  }
  return client;
}

// SVG는 같은 origin에서 스크립트를 실행할 수 있어 받지 않는다.
export const IMAGE_TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/gif": "gif",
  "image/webp": "webp",
  "image/avif": "avif",
};

export const MEDIA_KEY_PATTERN = /^\d{4}\/\d{2}\/[0-9a-f-]{36}\.(png|jpg|gif|webp|avif)$/;
