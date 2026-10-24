'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, Target, Eye, Heart, LucideIcon } from 'lucide-react';
import SectionHeader from './section-header';

const ICON_MAP: Record<string, LucideIcon> = { Target, Eye, Heart };

interface AboutItem {
  id: string;
  type: string;
  title: string;
  content: string;
  icon: string | null;
}

export default function AboutSection() {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [accordionItems, setAccordionItems] = useState<AboutItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await fetch('/api/about');
        if (res.ok) setAccordionItems(await res.json());
      } catch (error) {
        console.error('Error fetching about section:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAbout();
  }, []);

  const toggleAccordion = (id: string) => setOpenAccordion(openAccordion === id ? null : id);

  if (!isLoading && accordionItems.length === 0) return null;

  return (
    <section id="about" aria-labelledby="about-heading" className="bg-slate-50 py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeader
          id="about-heading"
          eyebrow="About ENTREHUB"
          title={<>Our <span className="text-navy">story</span></>}
          description="Digital work should make the next step in business clearer, simpler and more achievable."
        />

        <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-4">
            <p className="border-l-[3px] border-orange-500 pl-5 text-lg font-medium leading-7 text-slate-800 sm:text-xl">
              At ENTREHUB, we create digital experiences that help businesses communicate clearly and reach the people they want to serve.
            </p>
            <p className="text-base leading-7 text-slate-600">
              We work remotely with clients across markets, bringing strategy, creative thinking and technical delivery together in one practical partnership.
            </p>
          </div>

          {isLoading ? (
            <div className="space-y-3" aria-busy="true" aria-label="Loading">
              {[0, 1, 2, 3].map((i) => <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-200/70" />)}
            </div>
          ) : (
            <div className="space-y-3">
              {accordionItems.map((item) => {
                const Icon = item.icon && ICON_MAP[item.icon] ? ICON_MAP[item.icon] : Target;
                const isOpen = openAccordion === item.id;
                const panelId = `about-panel-${item.id}`;
                const buttonId = `about-button-${item.id}`;
                return (
                  <div key={item.id} className={`overflow-hidden rounded-xl border bg-white transition-colors ${isOpen ? 'border-navy/25 shadow-sm' : 'border-slate-200'}`}>
                    <h3>
                      <button id={buttonId} type="button" onClick={() => toggleAccordion(item.id)} aria-expanded={isOpen} aria-controls={panelId} className="flex w-full items-center justify-between gap-3 p-4 text-left transition hover:bg-slate-50">
                        <span className="flex items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy-tint text-navy" aria-hidden="true"><Icon className="h-4 w-4" /></span>
                          <span className="text-base font-semibold text-slate-900">{item.title}</span>
                        </span>
                        <ChevronDown className={`h-4 w-4 shrink-0 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                      </button>
                    </h3>
                    <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!isOpen} className="px-4 pb-4">
                      <p className="leading-6 text-slate-600 sm:pl-12">{item.content}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
