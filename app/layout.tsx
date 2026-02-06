import type { Metadata } from "next";
import { DM_Sans, Inter } from "next/font/google";
import { ConvexClientProvider } from "@/components/layout/ConvexClientProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SL Import Calculator — Sierra Leone Import Cost Estimator",
    template: "%s | SL Import Calculator",
  },
  description:
    "Estimate import duties, taxes, and total landed costs for goods entering Sierra Leone. Based on the ECOWAS Common External Tariff (CET) system.",
  keywords: [
    "Sierra Leone",
    "import duty calculator",
    "ECOWAS CET",
    "customs duty",
    "landed cost",
    "GST",
    "import tax",
    "NRA",
  ],
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "SL Import Calculator",
    description:
      "Know your import costs before they arrive. Estimate duties, taxes, and total landed costs for Sierra Leone.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${inter.variable} font-sans antialiased`}
      >
        <ConvexClientProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
