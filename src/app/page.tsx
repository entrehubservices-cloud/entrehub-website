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
  openGraph: { type: 'website', url: '/', title: 'Web Development & Digital Marketing in Nigeria | Entrehub Services', description: 'Web and app development, SEO, social media and email marketing from Kaduna, Nigeria, for clients worldwide.' },
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({
        '@context': 'https://schema.org', '@type': 'ProfessionalService',
        '@id': siteUrl + '/#business', name: 'Entrehub Services', url: siteUrl,
        telephone: '+2348129721560', image: siteUrl + '/images/logo.jpeg',
        address: { '@type': 'PostalAddress', streetAddress: 'M4, Tonjonss Plaza, Station Roundabout', addressLocality: 'Kaduna', addressRegion: 'Kaduna', addressCountry: 'NG' },
        geo: { '@type': 'GeoCoordinates', latitude: 10.488648, longitude: 7.418596 },
        openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '17:00' }],
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
