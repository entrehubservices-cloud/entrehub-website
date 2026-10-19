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
        if (res.ok) {
          const data = await res.json();
          setProjects(data);
        }
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
      <section id="work" aria-labelledby="work-heading" className="bg-slate-50 py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 id="work-heading" className="text-3xl font-bold text-slate-900">Selected work</h2>
          <p className="mt-4 text-lg text-slate-600">We’re preparing a closer look at our completed client projects. In the meantime, tell us what you’re working on.</p>
          <a href="#contact" className="mt-6 inline-flex rounded-xl bg-navy px-6 py-3 font-semibold text-white">Discuss your project</a>
        </div>
      </section>
    );
  }

  return (
    <section id="work" aria-labelledby="work-heading" className="bg-slate-50 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          id="work-heading"
          eyebrow="Selected work"
          title={<>Our <span className="text-navy">portfolio</span></>}
          description="A selection of websites, campaigns and creative work delivered by Entrehub Services."
        />

        {isLoading ? (
          <div className="grid items-center gap-10 lg:grid-cols-2" aria-busy="true" aria-label="Loading projects">
            <div className="space-y-4">
              <div className="h-6 w-32 animate-pulse rounded-full bg-slate-200" />
              <div className="h-10 w-3/4 animate-pulse rounded-lg bg-slate-200" />
              <div className="h-24 animate-pulse rounded-lg bg-slate-200" />
            </div>
            <div className="aspect-[4/3] animate-pulse rounded-3xl bg-slate-200" />
          </div>
        ) : (
          <ul className="space-y-16 lg:space-y-24">
            {projects.map((project, index) => (
              <li key={project.id}>
                <article className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
                  <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                    <p className="mb-4 inline-flex rounded-full bg-orange-50 px-3 py-1 text-sm font-semibold text-orange-800 ring-1 ring-orange-200">
                      {project.category}
                    </p>
                    <h3 className="mb-4 text-2xl font-bold leading-tight text-slate-900 sm:text-3xl lg:text-4xl">
                      {project.title}
                    </h3>
                    <p className="mb-8 text-lg leading-relaxed text-slate-600">{project.description}</p>

                    {project.metric && project.metricLabel ? <dl className="inline-flex flex-col-reverse border-l-4 border-navy pl-4">
                      <dt className="text-sm font-medium uppercase tracking-wide text-slate-600">{project.metricLabel}</dt>
                      <dd className="text-3xl font-bold text-slate-900">{project.metric}</dd>
                    </dl> : null}
                    {project.projectUrl ? <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="mt-6 block font-semibold text-navy underline">Visit project website<span className="sr-only"> (opens in a new tab)</span></a> : null}
                  </div>

                  <div className={`relative aspect-[4/3] overflow-hidden rounded-3xl bg-slate-200 shadow-xl ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                    <Image
                      src={project.image}
                      alt={`${project.title} project preview`}
                      fill
                      sizes="(min-width: 1024px) 560px, 100vw"
                      className="object-cover"
                    />
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
