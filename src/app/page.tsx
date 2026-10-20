import type { Metadata } from 'next';
import { jsonLd, siteUrl } from '@/lib/seo';
import Navigation from '@/components/navigation';
import HeroSection from '@/components/hero-section';
import AboutSection from '@/components/about-section';
import ServicesSection from '@/components/services-section';
import WorkSection from '@/components/work-section';
import TeamSection from '@/components/team-section';
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
        <section aria-labelledby="service-guides" className="bg-slate-50 py-14">
          <div className="mx-auto max-w-6xl px-5">
            <h2 id="service-guides" className="mb-4 text-3xl font-bold text-slate-900">Explore website development and SEO services</h2>
            <p className="mb-7 text-lg text-slate-600">Read about the scope, completed work and questions to consider before starting a project.</p>
            <ul className="grid gap-5 md:grid-cols-3">{servicePages.map(service => <li key={service.slug} className="rounded-xl border border-slate-200 bg-white p-6"><h3 className="mb-3 text-xl font-semibold"><Link href={`/services/${service.slug}`} className="text-navy underline">{service.title}</Link></h3><p className="leading-relaxed text-slate-600">{service.description}</p></li>)}</ul>
          </div>
        </section>
        <WorkSection />
        {/* <TeamSection /> */}
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
