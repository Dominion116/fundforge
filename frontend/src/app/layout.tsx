import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "@/context/Web3Provider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "FundForge | Decentralized Crowdfunding",
    template: "%s | FundForge",
  },
  description: "Secure, milestone-based crowdfunding platform powered by blockchain technology. Fund projects with confidence.",
  keywords: ["crowdfunding", "blockchain", "web3", "milestone funding", "decentralized finance", "Base network"],
  authors: [{ name: "FundForge Team" }],
  openGraph: {
    title: "FundForge | Decentralized Crowdfunding",
    description: "Secure, milestone-based crowdfunding platform powered by blockchain technology.",
    url: "https://fundforge.app",
    siteName: "FundForge",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background font-sans`}
      >
        <Web3Provider>
          {children}
          <Toaster />
        </Web3Provider>
      </body>
    </html>
  );
}
