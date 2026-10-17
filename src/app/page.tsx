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
        <WorkSection />
        {/* <TeamSection /> */}
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
