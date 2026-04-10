import type { Metadata } from "next";
import { JetBrains_Mono, Noto_Sans_TC } from "next/font/google";
import "./globals.css";

const notoSansTc = Noto_Sans_TC({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "employa｜職涯探索",
  description: "用滑卡探索興趣，生成你的職涯計畫與每日小問題。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-Hant"
      className={`${notoSansTc.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[radial-gradient(1000px_circle_at_15%_0%,rgba(56,189,248,0.22),transparent_55%),radial-gradient(900px_circle_at_85%_10%,rgba(244,114,182,0.18),transparent_50%),linear-gradient(to_bottom,#ffffff,#f8fafc_55%,#ffffff)] text-zinc-950">
        {children}
      </body>
    </html>
  );
}
