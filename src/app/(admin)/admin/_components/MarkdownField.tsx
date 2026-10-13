"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default function MarkdownField({
  name,
  defaultValue = "",
}: {
  name: string;
  defaultValue?: string;
}) {
  const [value, setValue] = useState(defaultValue);

  return (
    <div>
      <MDEditor value={value} onChange={(next) => setValue(next ?? "")} height={560} />
      <input type='hidden' name={name} value={value} />
    </div>
  );
}
