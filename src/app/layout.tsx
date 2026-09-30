import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DEVHIMCHAN",
  description: "풀스택 개발자 김힘찬입니다.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='ko' className='dark' suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
