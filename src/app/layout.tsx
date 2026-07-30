import type { Metadata } from "next";
import { Inter } from "next/font/google";
import QueryProvider from "@/components/providers/QueryProvider";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const siteUrl = "https://www.digitalcapfx.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "DigitalCap FX | Next-Gen Hybrid Fiat-Crypto Neo-Bank",
    template: "%s | DigitalCap FX",
  },
  description:
    "DigitalCap FX is a next-generation hybrid fiat-crypto neo-banking platform providing instant FX conversions, multi-currency wallets, virtual cards, and seamless cross-border settlement for WAEMU and CEMAC regions.",
  keywords: [
    "DigitalCap FX",
    "DigitalCapFX",
    "Digital FX",
    "Hybrid Neo Bank",
    "Fiat Crypto Wallet",
    "WAEMU FX",
    "CEMAC FX",
    "USDC Wallet",
    "XOF to USD",
    "XAF to EUR",
    "Cross-border Settlement",
    "African FinTech",
  ],
  authors: [{ name: "DigitalCap FX", url: siteUrl }],
  creator: "DigitalCap FX",
  publisher: "DigitalCap FX",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "DigitalCap FX | Next-Gen Hybrid Fiat-Crypto Neo-Bank",
    description:
      "Instant FX conversions, multi-currency wallets, virtual cards, and seamless cross-border settlement for WAEMU & CEMAC.",
    url: siteUrl,
    siteName: "DigitalCap FX",
    images: [
      {
        url: "/DFXLogo.svg",
        width: 1200,
        height: 630,
        alt: "DigitalCap FX Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DigitalCap FX | Next-Gen Hybrid Fiat-Crypto Neo-Bank",
    description:
      "Instant FX conversions, multi-currency wallets, virtual cards, and seamless cross-border settlement for WAEMU & CEMAC.",
    images: ["/DFXLogo.svg"],
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "DigitalCap FX",
        url: siteUrl,
        logo: `${siteUrl}/DFXLogo.svg`,
        sameAs: [],
        description:
          "Next-Generation Hybrid Fiat-Crypto Neo-Banking Platform operating across WAEMU and CEMAC regions.",
      },
      {
        "@type": "FinancialProduct",
        "@id": `${siteUrl}/#product`,
        name: "DigitalCap FX Neo-Banking Platform",
        provider: {
          "@id": `${siteUrl}/#organization`,
        },
        description:
          "Multi-currency fiat accounts (XOF, XAF, EUR, USD), USDC smart contract wallets, virtual debit cards, and instant cross-border settlement.",
        feesAndCommissionsSpecification: "Transparent real-time exchange rates with zero hidden transaction markup.",
      },
    ],
  };

  return (
    <html lang="en" className={`${inter.variable}`}>
      <head>
        <link href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,5" rel="stylesheet" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.svg" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
