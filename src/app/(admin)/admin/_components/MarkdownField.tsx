"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import ImageUploadButton, { uploadFile } from "./ImageUploadButton";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default function MarkdownField({
  name,
  defaultValue = "",
}: {
  name: string;
  defaultValue?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const [status, setStatus] = useState("");

  const insertAt = (position: number, text: string) =>
    setValue((prev) => prev.slice(0, position) + text + prev.slice(position));

  const uploadAll = async (files: File[], position: number) => {
    setStatus("업로드 중…");
    try {
      const urls = await Promise.all(files.map(uploadFile));
      insertAt(position, urls.map((url) => `![](${url})\n`).join(""));
      setStatus("");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "업로드 실패");
    }
  };

  // 이미지가 섞여 있을 때만 가로챈다. 나머지는 에디터 기본 동작을 따른다.
  const handleFiles = (
    event: React.ClipboardEvent<HTMLTextAreaElement> | React.DragEvent<HTMLTextAreaElement>,
    list: FileList
  ) => {
    const files = [...list].filter((file) => file.type.startsWith("image/"));
    if (files.length === 0) return;
    event.preventDefault();
    uploadAll(files, event.currentTarget.selectionStart);
  };

  return (
    <div className='space-y-2'>
      <div className='flex items-center gap-2'>
        <ImageUploadButton onUploaded={(url) => insertAt(value.length, `\n![](${url})\n`)} />
        <span className='text-caption text-ink-48'>본문에 붙여넣거나 끌어다 놓아도 됩니다.</span>
        {status && <span className='text-caption text-ink-80'>{status}</span>}
      </div>
      <MDEditor
        value={value}
        onChange={(next) => setValue(next ?? "")}
        height={560}
        textareaProps={{
          onPaste: (event) => handleFiles(event, event.clipboardData.files),
          onDrop: (event) => handleFiles(event, event.dataTransfer.files),
        }}
      />
      <input type='hidden' name={name} value={value} />
    </div>
  );
}
