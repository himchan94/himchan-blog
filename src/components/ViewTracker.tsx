"use client";

import { useEffect } from "react";

// JS를 실행하는 방문만 센다(크롤러 제외). 같은 탭에서 새로고침은 한 번으로 본다.
export default function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    const key = `viewed:${slug}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {}
    fetch(`/api/views/${encodeURIComponent(slug)}/`, { method: "POST" });
  }, [slug]);

  return null;
}
