import type { Metadata } from 'next';
import { jsonLd, siteUrl } from '@/lib/seo';
import Navigation from '@/components/navigation';
import HeroSection from '@/components/hero-section';
import AboutSection from '@/components/about-section';
import ServicesSection from '@/components/services-section';
import WorkSection from '@/components/work-section';
import CTASection from '@/components/cta-section';
import Footer from '@/components/footer';
import Link from 'next/link';
import { servicePages } from '@/lib/service-pages';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
  openGraph: { type: 'website', url: '/', title: 'Web Development & Digital Marketing | Entrehub Services', description: 'Web and app development, SEO, social media and email marketing for personal brands and businesses worldwide.' },
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({
        '@context': 'https://schema.org', '@type': 'Organization',
        '@id': siteUrl + '/#business', name: 'Entrehub Services', url: siteUrl,
        telephone: '+2348129721560', image: siteUrl + '/images/logo.jpeg',
        foundingLocation: { '@type': 'Country', name: 'Nigeria' },
      }) }} />
      <Navigation />
      <main id="main-content" tabIndex={-1} className="min-h-screen focus:outline-none">
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <section aria-labelledby="service-guides" className="bg-blue-50/60 py-11 lg:py-12">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <h2 id="service-guides" className="mb-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Explore website development and SEO services</h2>
            <p className="mb-5 max-w-3xl text-base leading-6 text-slate-600">Read about the scope, completed work and questions to consider before starting a project.</p>
            <ul className="grid gap-3 md:grid-cols-3">{servicePages.map(service => <li key={service.slug} className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm"><h3 className="mb-2 text-base font-semibold"><Link href={`/services/${service.slug}`} className="text-navy underline underline-offset-4">{service.title}</Link></h3><p className="text-sm leading-6 text-slate-600">{service.description}</p></li>)}</ul>
          </div>
        </section>
        <WorkSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
