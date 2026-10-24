'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import SectionHeader from './section-header';

interface Project {
  id: string;
  category: string;
  title: string;
  description: string;
  metric: string;
  metricLabel: string;
  image: string;
  projectUrl?: string | null;
}

export default function WorkSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await fetch('/api/portfolio');
        if (res.ok) setProjects(await res.json());
      } catch (error) {
        console.error('Error fetching portfolio:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPortfolio();
  }, []);

  if (!isLoading && projects.length === 0) {
    return (
      <section id="work" aria-labelledby="work-heading" className="bg-slate-50 py-14">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <h2 id="work-heading" className="text-3xl font-bold text-slate-900">Selected work</h2>
          <p className="mt-3 text-base text-slate-600">We’re preparing a closer look at our completed client projects. In the meantime, tell us what you’re working on.</p>
          <a href="#contact" className="mt-5 inline-flex rounded-xl bg-navy px-6 py-3 font-semibold text-white">Discuss your project</a>
        </div>
      </section>
    );
  }

  return (
    <section id="work" aria-labelledby="work-heading" className="bg-slate-50 py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeader
          id="work-heading"
          eyebrow="Selected work"
          title={<>Our <span className="text-navy">portfolio</span></>}
          description="A selection of websites, campaigns and creative work delivered by Entrehub Services."
        />

        {isLoading ? (
          <div className="grid items-center gap-7 lg:grid-cols-2" aria-busy="true" aria-label="Loading projects">
            <div className="space-y-3">
              <div className="h-5 w-28 animate-pulse rounded-full bg-slate-200" />
              <div className="h-9 w-3/4 animate-pulse rounded-lg bg-slate-200" />
              <div className="h-20 animate-pulse rounded-lg bg-slate-200" />
            </div>
            <div className="aspect-[4/3] animate-pulse rounded-2xl bg-slate-200" />
          </div>
        ) : (
          <ul className="space-y-12 lg:space-y-16">
            {projects.map((project, index) => (
              <li key={project.id}>
                <article className="grid items-center gap-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:grid-cols-2 lg:gap-10 lg:p-7">
                  <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                    <p className="mb-3 inline-flex rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-800 ring-1 ring-orange-200">{project.category}</p>
                    <h3 className="mb-3 text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">{project.title}</h3>
                    <p className="mb-5 text-base leading-7 text-slate-600">{project.description}</p>

                    {project.metric && project.metricLabel ? (
                      <dl className="inline-flex flex-col-reverse border-l-[3px] border-navy pl-3">
                        <dt className="text-xs font-medium uppercase tracking-wide text-slate-600">{project.metricLabel}</dt>
                        <dd className="text-2xl font-bold text-slate-900">{project.metric}</dd>
                      </dl>
                    ) : null}
                    {project.projectUrl ? <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="mt-4 block text-sm font-semibold text-navy underline underline-offset-4">Visit project website<span className="sr-only"> (opens in a new tab)</span></a> : null}
                  </div>

                  <div className={`relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-200 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                    <Image src={project.image} alt={`${project.title} project preview`} fill sizes="(min-width: 1024px) 560px, 100vw" className="object-cover transition duration-500 hover:scale-[1.02]" />
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
