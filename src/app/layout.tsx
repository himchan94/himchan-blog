import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DEVHIMCHAN",
  description: "풀스택 개발자 김힘찬입니다.",
};

// 첫 페인트 전에 저장된 테마를 적용해 깜빡임을 막는다.
const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-color-mode",t)}catch(e){}})()`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='ko' suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
