import type { Metadata } from "next";
import { Inter } from "next/font/google";
import EnquiryTracking from "@/components/enquiry-tracking";
import CookieConsentManager from "@/components/cookie-consent";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.entrehubng.com'),
  title: {
    default: 'Enterprise ICT, Digital Systems & Growth | ENTREHUB SERVICES LTD',
    template: '%s | ENTREHUB SERVICES LTD',
  },
  description:
    'Enterprise ICT consulting, custom software and AI systems, websites, e-commerce, SEO, digital marketing, and corporate general contracting by ENTREHUB SERVICES LTD.',
  openGraph: {
    type: 'website',
    siteName: 'ENTREHUB SERVICES LTD',
    title: 'ENTREHUB SERVICES LTD',
    description:
      'Enterprise ICT consulting, custom software, digital growth, and institutional contracting delivered globally.',
  },
  twitter: {
    card: 'summary',
    title: 'ENTREHUB SERVICES LTD',
    description:
      'Enterprise ICT consulting, software & AI systems, web development, and digital growth.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <CookieConsentManager />
        <EnquiryTracking />
        {children}
      </body>
    </html>
  );
}
