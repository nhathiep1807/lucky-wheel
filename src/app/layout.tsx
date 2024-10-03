import QueryProvider from "@/provider/query-provider";
import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import { GlobalProvider } from "./context";
import { Toaster } from 'react-hot-toast';

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
      <GlobalProvider>
        <QueryProvider>
          <body className={`${fredoka.className} antialiased`}>
            {children}
            <Toaster position="top-center"
              reverseOrder={true}
              gutter={8}
              containerClassName=""
              containerStyle={{}}
              toastOptions={{
                className: '',
                duration: 3000,
                style: {
                  background: 'rgba(255, 255, 255, 0.8)',
                  color: '#000000',
                  boxShadow: '0 2px 20px rgba(0, 0, 0, 0.1)',
                },
              }} />
          </body>
        </QueryProvider>
      </GlobalProvider>
    </html>
  );
}
