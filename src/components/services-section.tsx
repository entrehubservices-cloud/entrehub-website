'use client';

import { useState, useEffect } from 'react';
import {
  Globe,
  Share2,
  Mail,
  Search,
  Palette,
  Megaphone,
  ArrowRight,
  Building2,
  Cpu,
  ShieldCheck,
  Briefcase,
  FileText,
  LucideIcon,
} from 'lucide-react';
import Link from 'next/link';
import ContactModal from './contact-modal';
import SectionHeader from './section-header';

const ICON_MAP: Record<string, LucideIcon> = {
  Globe,
  Share2,
  Mail,
  Search,
  Palette,
  Megaphone,
};

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  included: string;
  order: number;
}

const ENTERPRISE_PILLARS = [
  {
    title: 'Enterprise ICT Consulting',
    description:
      'Systems architecture, cloud readiness, digital transformation roadmaps, and technical advisory for corporate and public-sector teams.',
    Icon: ShieldCheck,
  },
  {
    title: 'Custom Software & AI Systems',
    description:
      'Bespoke web applications, portals, workflow automation, and practical AI integrations engineered around operational requirements.',
    Icon: Cpu,
  },
  {
    title: 'Digital Growth & Platforms',
    description:
      'High-converting corporate websites, e-commerce platforms, technical SEO, and structured multi-channel acquisition.',
    Icon: Globe,
  },
  {
    title: 'Corporate & Institutional Contracting',
    description:
      'Compliant general contracting, ICT equipment/deployment support, and end-to-end project execution for organisations and institutions.',
    Icon: Building2,
  },
];

function normalizeServiceCopy(text: string): string {
  return text
    .replace(/\bmicrosite and mobile apps\b/gi, 'microsites and mobile apps')
    .replace(/\bout of the box creative contents\b/gi, 'out-of-the-box creative content');
}

export default function ServicesSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialInquiryType, setInitialInquiryType] = useState<string | undefined>(undefined);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('/api/services');
        if (res.ok) setServices(await res.json());
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, []);

  const openModalWithInquiry = (inquiry?: string) => {
    setInitialInquiryType(inquiry);
    setIsModalOpen(true);
  };

  return (
    <section id="services" aria-labelledby="services-heading" className="bg-white py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeader
          id="services-heading"
          eyebrow="What we do"
          title={
            <>
              Enterprise ICT, software &amp; digital growth,{' '}
              <span className="text-navy">thoughtfully delivered.</span>
            </>
          }
          description="From enterprise ICT consulting and custom AI/software systems to websites, digital growth, and institutional contracting—delivered under clear Statements of Work."
        >
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => openModalWithInquiry()}
              aria-haspopup="dialog"
              className="group inline-flex min-h-11 items-center gap-2 rounded-xl bg-navy px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-navy-hover"
            >
              Schedule a consultation
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </button>
            <Link
              href="/contact?inquiry=Corporate+Profile+%26+Capability+Statement"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-800 transition hover:border-navy hover:text-navy"
            >
              <FileText className="h-4 w-4 text-navy" aria-hidden="true" />
              Corporate Profile &amp; Capability Statement
            </Link>
          </div>
        </SectionHeader>

        {/* Enterprise & Institutional Pillars */}
        <div className="mb-10 rounded-3xl border border-blue-100 bg-slate-50/80 p-6 sm:p-8">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-navy">
                Enterprise &amp; Institutional Practice
              </p>
              <h3 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
                Built for organisations, procurement teams &amp; scaling brands
              </h3>
            </div>
            <p className="text-xs font-medium text-slate-600">
              ENTREHUB SERVICES LTD · RC 10030133 · TIN 2621823441002
            </p>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ENTERPRISE_PILLARS.map(({ title, description, Icon }) => (
              <li
                key={title}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <span
                  className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-navy-tint text-navy"
                  aria-hidden="true"
                >
                  <Icon className="h-5 w-5" />
                </span>
                <h4 className="mb-2 text-base font-bold text-slate-900">{title}</h4>
                <p className="mb-4 flex-1 text-sm leading-6 text-slate-600">{description}</p>
                <button
                  type="button"
                  onClick={() => openModalWithInquiry(title)}
                  className="inline-flex items-center gap-1.5 self-start text-xs font-semibold text-navy hover:underline"
                >
                  Discuss scope <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Core Digital & Growth Services */}
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="Loading services">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-56 animate-pulse rounded-2xl bg-slate-100" />
            ))}
          </div>
        ) : services.length > 0 ? (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon && ICON_MAP[service.icon] ? ICON_MAP[service.icon] : Briefcase;
              return (
                <li
                  key={service.id}
                  className="group flex min-h-[13.5rem] flex-col rounded-2xl border border-slate-200 bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg sm:p-6"
                >
                  <span
                    className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-navy transition group-hover:bg-orange-50 group-hover:text-orange-600"
                    aria-hidden="true"
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mb-2 text-lg font-semibold leading-snug text-slate-900">
                    {service.title}
                  </h3>
                  <p className="mb-4 flex-1 text-sm leading-6 text-slate-600">
                    {normalizeServiceCopy(service.description)}
                  </p>
                  <button
                    type="button"
                    onClick={() => openModalWithInquiry()}
                    aria-haspopup="dialog"
                    className="group/link inline-flex min-h-9 items-center gap-2 self-start text-sm font-semibold text-navy transition hover:text-orange-700"
                  >
                    Get started<span className="sr-only"> with {service.title}</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" aria-hidden="true" />
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialInquiryType={initialInquiryType}
      />
    </section>
  );
}
