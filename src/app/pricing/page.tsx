import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import PricingCatalog from "@/components/pricing-catalog";

export const metadata: Metadata = {
  title: "Pricing | Entrehub Services",
  description: "View Entrehub Services pricing for social media management, branding, content creation, websites, advertising and lead-generation systems.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    type: "website",
    url: "/pricing",
    title: "Pricing | Entrehub Services",
    description: "Explore Entrehub Services pricing in USD and convert the displayed amounts to your preferred currency.",
  },
};

export default function PricingPage() {
  return (
    <>
      <Navigation />
      <main id="main-content" tabIndex={-1} className="min-h-screen pt-[4.25rem] focus:outline-none">
        <header className="border-b border-slate-200 bg-blue-50/60">
          <div className="mx-auto max-w-7xl px-5 pb-10 pt-7 sm:px-8 sm:pb-14 lg:px-10">
            <nav aria-label="Breadcrumb" className="mb-8 text-sm text-slate-500">
              <Link href="/" className="underline underline-offset-4 hover:text-amber-300">Home</Link>
              <span aria-hidden="true"> / </span>
              <span className="text-slate-300">Pricing</span>
            </nav>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-amber-300">Simple packages. Clear scope.</p>
            <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Pricing for your next stage of growth
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Browse our services and packages in US dollars. Select another currency to see an indicative conversion using the latest published reference rate.
            </p>
          </div>
        </header>
        <PricingCatalog />
      </main>
      <Footer />
    </>
  );
}
