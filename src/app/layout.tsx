import type { Metadata } from "next";
import { Inter } from "next/font/google";
import QueryProvider from "@/components/providers/QueryProvider";
import MaintenanceGuard from "@/components/providers/MaintenanceGuard";
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
    default: "DigitalCap FX | Global Hybrid Fiat-Crypto Neo-Bank & FX Settlement Platform",
    template: "%s | DigitalCap FX",
  },
  description:
    "DigitalCap FX is a next-generation hybrid fiat-crypto neo-banking platform providing multi-currency accounts (USD, GBP, EUR, XOF, XAF), stablecoin vaults (USDT, USDC), instant FX currency exchange, virtual debit cards, phone-number P2P transfers, and mobile money cross-border settlement for WAEMU, CEMAC, and global markets.",
  keywords: [
    "DigitalCap FX",
    "DigitalCapFX",
    "Digital FX",
    "Hybrid Neo Bank",
    "Fiat Crypto Wallet",
    "Multi-Currency Fiat Accounts",
    "USD Wallet",
    "GBP Wallet",
    "EUR Wallet",
    "XOF to USD Exchange",
    "XAF to EUR Exchange",
    "USDT Stablecoin Vault",
    "USDC Smart Contract Wallet",
    "Virtual Debit Cards USD GBP EUR",
    "Phone Number P2P Transfers",
    "Mobile Money MoMo FX",
    "Cross-border Settlement",
    "WAEMU FinTech",
    "CEMAC Neo Banking",
    "VTU Airtime Utility Payments",
    "African & Global Cross-Border Payments",
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
    title: "DigitalCap FX | Global Hybrid Fiat-Crypto Neo-Bank & FX Settlement Platform",
    description:
      "Instant FX conversions across USD, GBP, EUR, XOF & XAF, multi-currency wallets, virtual debit cards, phone P2P transfers, and seamless cross-border mobile money settlement.",
    url: siteUrl,
    siteName: "DigitalCap FX",
    images: [
      {
        url: "/DFXLogo.svg",
        width: 1200,
        height: 630,
        alt: "DigitalCap FX Global Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DigitalCap FX | Global Hybrid Fiat-Crypto Neo-Bank",
    description:
      "Multi-currency wallets (USD, GBP, EUR, XOF, XAF), instant FX exchange, virtual debit cards, and cross-border mobile money settlement.",
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
          "Next-Generation Hybrid Fiat-Crypto Neo-Banking Platform operating across WAEMU, CEMAC, and global international markets.",
      },
      {
        "@type": "FinancialProduct",
        "@id": `${siteUrl}/#product`,
        name: "DigitalCap FX Multi-Currency Financial Platform",
        provider: {
          "@id": `${siteUrl}/#organization`,
        },
        description:
          "Multi-currency fiat accounts (USD, GBP, EUR, XOF, XAF), USDT & USDC crypto vaults, virtual debit cards, instant FX currency exchange, mobile money settlement, phone P2P transfers, and airtime VTU services.",
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
          <MaintenanceGuard>
            {children}
          </MaintenanceGuard>
          <Toaster theme="dark" position="top-center" richColors closeButton />
        </QueryProvider>
      </body>
    </html>
  );
}

