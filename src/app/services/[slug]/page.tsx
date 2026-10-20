import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import { servicePages } from '@/lib/service-pages';
import { jsonLd, siteUrl } from '@/lib/seo';

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return servicePages.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = servicePages.find(item => item.slug === slug);
  if (!service) return { title: 'Service not found', robots: { index: false } };
  return {
    title: service.title, description: service.description,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: { type: 'website', url: `/services/${service.slug}`, title: service.title, description: service.description },
    twitter: { card: 'summary', title: service.title, description: service.description },
  };
}
export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = servicePages.find(item => item.slug === slug);
  if (!service) notFound();
  const url = `${siteUrl}/services/${service.slug}`;
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({
      '@context': 'https://schema.org', '@graph': [
        { '@type': 'Service', '@id': url + '#service', name: service.title, description: service.description, url,
          provider: { '@type': 'Organization', '@id': siteUrl + '/#business', name: 'Entrehub Services', url: siteUrl } },
        { '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl + '/' },
          { '@type': 'ListItem', position: 2, name: service.title, item: url }
        ] }
      ]
    }) }} />
    <Navigation />
    <main id="main-content" tabIndex={-1} className="bg-white pt-28 pb-20 focus:outline-none">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-slate-600"><Link href="/" className="underline">Home</Link><span aria-hidden="true"> / </span><span>{service.title}</span></nav>
        <p className="mb-4 font-semibold text-navy">Entrehub Services · Nigeria-based, working remotely worldwide</p>
        <h1 className="mb-6 text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">{service.title}</h1>
        <p className="mb-10 text-xl leading-relaxed text-slate-600">{service.intro}</p>
        <div className="space-y-10 text-lg leading-relaxed text-slate-700">
          <section><h2 className="mb-4 text-2xl font-semibold text-slate-900">{service.heading}</h2><p>{service.detail}</p></section>
          <section><h2 className="mb-4 text-2xl font-semibold text-slate-900">What we can plan with you</h2><ul className="list-disc space-y-3 pl-6">{service.items.map(item => <li key={item}>{item}</li>)}</ul></section>
          <section><h2 className="mb-4 text-2xl font-semibold text-slate-900">From brief to an agreed scope</h2><p>{service.process}</p></section>
          <section><h2 className="mb-4 text-2xl font-semibold text-slate-900">{service.proofTitle}</h2><p>{service.proof}</p>
            {service.projects.length > 0 && <ul className="mt-4 space-y-2">{service.projects.map(project => <li key={project.url}><a href={project.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-navy underline">{project.name}<span className="sr-only"> (opens in a new tab)</span></a></li>)}</ul>}
            <p className="mt-4"><Link href={`/blog/${service.article.slug}`} className="font-semibold text-navy underline">{service.article.title}</Link></p>
          </section>
          <section><h2 className="mb-5 text-2xl font-semibold text-slate-900">Questions before you start</h2><div className="space-y-6">{service.questions.map(item => <div key={item.q}><h3 className="mb-2 text-xl font-semibold text-slate-900">{item.q}</h3><p>{item.a}</p></div>)}</div></section>
          <section className="rounded-2xl bg-slate-50 p-7"><h2 className="mb-3 text-2xl font-semibold text-slate-900">Tell us about your project</h2><p className="mb-5">Share your business, target customers, current website and the problem you want to solve. We will discuss the next useful step.</p><Link href="/#contact" className="inline-block rounded-lg bg-navy px-6 py-3 font-semibold text-white">Discuss your project</Link></section>
          <nav aria-label="Related services"><h2 className="mb-4 text-2xl font-semibold text-slate-900">Related services</h2><ul className="space-y-3">{servicePages.filter(item => item.slug !== slug).map(item => <li key={item.slug}><Link href={`/services/${item.slug}`} className="font-semibold text-navy underline">{item.title}</Link></li>)}</ul></nav>
        </div>
      </div>
    </main>
    <Footer />
  </>;
}
