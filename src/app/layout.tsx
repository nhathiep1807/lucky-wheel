import type { Metadata } from "next";
import { Fredoka } from "next/font/google";

import "./globals.css";
const fredoka = Fredoka({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Spin and Win!",
  description: "Click the wheel to get a prize!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fredoka.className} antialiased`}>{children}</body>
    </html>
  );
}
