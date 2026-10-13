"use client";

import { useRef, useState } from "react";
import { uploadImage } from "../_lib/upload";

export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.set("file", file);
  const result = await uploadImage(formData);
  if ("error" in result) throw new Error(result.error);
  return result.url;
}

export default function ImageUploadButton({ onUploaded }: { onUploaded: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState("");

  return (
    <span className='inline-flex items-center gap-2'>
      <button type='button' onClick={() => inputRef.current?.click()} className='btn-pearl'>
        이미지 업로드
      </button>
      <input
        ref={inputRef}
        type='file'
        accept='image/png,image/jpeg,image/gif,image/webp,image/avif'
        hidden
        onChange={async (event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (!file) return;
          setStatus("업로드 중…");
          try {
            onUploaded(await uploadFile(file));
            setStatus("");
          } catch (error) {
            setStatus(error instanceof Error ? error.message : "업로드 실패");
          }
        }}
      />
      {status && <span className='text-caption text-ink-80'>{status}</span>}
    </span>
  );
}
