import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { Building2, Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import CopyableEmail from '@/components/copyable-email';
import ContactPageForm from '@/components/contact-page-form';
import {
  companyEmail,
  companyPhoneDisplay,
  companyRcNumber,
  companyTaxId,
  jsonLd,
  siteName,
  siteUrl,
} from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Contact ENTREHUB SERVICES LTD for enterprise ICT consulting, custom software and AI systems, website and e-commerce development, digital growth, or our Corporate Profile.',
  alternates: { canonical: '/contact' },
  openGraph: {
    type: 'website',
    url: '/contact',
    title: 'Contact | ENTREHUB SERVICES LTD',
    description:
      'Discuss your project, RFP, or request the ENTREHUB SERVICES LTD Corporate Profile & Capability Statement.',
  },
};

const whatsappUrl =
  'https://wa.me/2348129721560?text=' +
  encodeURIComponent(
    "Hello ENTREHUB! I'd like to discuss a project or request your Corporate Profile."
  );

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            name: `Contact ${siteName}`,
            url: `${siteUrl}/contact`,
            mainEntity: {
              '@id': `${siteUrl}/#business`,
            },
          }),
        }}
      />
      <Navigation />

      <main
        id="main-content"
        tabIndex={-1}
        className="min-h-screen bg-slate-50 pt-20 focus:outline-none"
      >
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
            <nav aria-label="Breadcrumb" className="mb-5 text-sm text-slate-600">
              <Link href="/" className="underline">
                Home
              </Link>{' '}
              / <span className="font-medium text-slate-900">Contact</span>
            </nav>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-navy">
              ENTREHUB SERVICES LTD · RC {companyRcNumber}
            </p>
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Start a conversation with <span className="text-navy">our team</span>
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
              Global Digital Delivery · Supporting enterprises, public institutions, and ambitious brands across Nigeria and international markets.
            </p>
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-5">
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7 space-y-5">
                <h2 className="text-xl font-bold text-slate-900">Direct contact &amp; offices</h2>

                <div className="space-y-4 text-sm text-slate-700">
                  <div className="flex items-start gap-3.5">
                    <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy-tint text-navy" aria-hidden="true">
                      <Mail className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-semibold text-slate-900">Official Email</p>
                      <CopyableEmail email={companyEmail} />
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy-tint text-navy" aria-hidden="true">
                      <Phone className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-semibold text-slate-900">Telephone</p>
                      <a href="tel:+2348129721560" className="font-semibold text-navy underline underline-offset-4">
                        {companyPhoneDisplay}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy-tint text-navy" aria-hidden="true">
                      <MapPin className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-semibold text-slate-900">Global Digital Delivery</p>
                      <p className="text-slate-600">
                        Nigeria Office: M4 Tonjos Plaza, Kachia Road, Kaduna
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy-tint text-navy" aria-hidden="true">
                      <Clock className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-semibold text-slate-900">Business Hours</p>
                      <p className="text-slate-600">Monday–Friday, 9am–5pm (WAT)</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy-tint text-navy" aria-hidden="true">
                      <Building2 className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-semibold text-slate-900">Corporate Registration</p>
                      <p className="text-slate-600">
                        {siteName} · CAC RC {companyRcNumber} · FIRS TIN {companyTaxId}
                      </p>
                    </div>
                  </div>
                </div>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  Chat on WhatsApp
                </a>
              </section>
            </div>

            <div className="lg:col-span-7">
              <Suspense fallback={<div className="h-96 animate-pulse rounded-3xl bg-white border border-slate-200" />}>
                <ContactPageForm />
              </Suspense>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
