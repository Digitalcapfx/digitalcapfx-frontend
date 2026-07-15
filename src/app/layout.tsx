import type { Metadata } from "next";
import { Inter } from "next/font/google";
import QueryProvider from "@/components/providers/QueryProvider";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "DigitalCapFx",
  description: "Next-Generation Hybrid Fiat-Crypto Neo-Banking Platform. Compliant onboarding and identity verification for WAEMU and CEMAC regions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <head>
        <link href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,600,700,900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <QueryProvider>
          {children}
          <Toaster theme="dark" position="top-center" richColors closeButton />
        </QueryProvider>
      </body>
    </html>
  );
}

