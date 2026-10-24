'use client';

import { useState, useEffect } from 'react';
import { Globe, Share2, Mail, Search, Palette, Megaphone, ArrowRight, LucideIcon } from 'lucide-react';
import ContactModal from './contact-modal';
import SectionHeader from './section-header';

const ICON_MAP: Record<string, LucideIcon> = { Globe, Share2, Mail, Search, Palette, Megaphone };

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  included: string;
  order: number;
}

export default function ServicesSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  if (!isLoading && services.length === 0) return null;

  return (
    <section id="services" aria-labelledby="services-heading" className="bg-white py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeader
          id="services-heading"
          eyebrow="What we do"
          title={<>Digital services, <span className="text-navy">thoughtfully delivered.</span></>}
          description="Bring your website, product and marketing into one clear growth plan."
        >
          <button type="button" onClick={() => setIsModalOpen(true)} aria-haspopup="dialog" className="group inline-flex min-h-11 items-center gap-2 rounded-xl bg-navy px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-navy-hover">
            Schedule a consultation
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </button>
        </SectionHeader>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="Loading services">
            {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} className="h-56 animate-pulse rounded-2xl bg-slate-100" />)}
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon && ICON_MAP[service.icon] ? ICON_MAP[service.icon] : Globe;
              return (
                <li key={service.id} className="group flex min-h-[13.5rem] flex-col rounded-2xl border border-slate-200 bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg sm:p-6">
                  <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-navy transition group-hover:bg-orange-50 group-hover:text-orange-600" aria-hidden="true"><Icon className="h-5 w-5" /></span>
                  <h3 className="mb-2 text-lg font-semibold leading-snug text-slate-900">{service.title}</h3>
                  <p className="mb-4 flex-1 text-sm leading-6 text-slate-600">{service.description}</p>
                  <button type="button" onClick={() => setIsModalOpen(true)} aria-haspopup="dialog" className="group/link inline-flex min-h-9 items-center gap-2 self-start text-sm font-semibold text-navy transition hover:text-orange-700">
                    Get started<span className="sr-only"> with {service.title}</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" aria-hidden="true" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
