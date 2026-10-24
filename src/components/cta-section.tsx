'use client';

import { useState } from 'react';
import { ArrowRight, MessageCircle } from 'lucide-react';
import ContactModal from './contact-modal';

export default function CTASection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <section id="contact" aria-labelledby="cta-heading" className="bg-white py-12 lg:py-14">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="on-dark relative overflow-hidden rounded-3xl bg-navy-deep px-6 py-11 text-center shadow-xl sm:px-12 sm:py-14">
          <div className="pointer-events-none absolute -right-10 -top-16 h-52 w-52 rounded-full border border-white/10" aria-hidden="true" />
          <div className="pointer-events-none absolute -right-3 -top-9 h-36 w-36 rounded-full border border-orange-400/20" aria-hidden="true" />
          <div className="relative">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-orange-300">Start a conversation</p>
            <h2 id="cta-heading" className="mx-auto mb-4 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
              Let&apos;s make your next digital move a good one.
            </h2>
            <p className="mx-auto mb-7 max-w-2xl text-base leading-7 text-slate-300">
              Tell us where you want to go. We’ll help you work out the right digital steps to take.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button type="button" onClick={() => setIsModalOpen(true)} aria-haspopup="dialog" className="group inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-semibold text-slate-900 shadow-lg transition hover:bg-orange-50 sm:w-auto">
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Let&apos;s talk
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </button>
              <a href="#work" className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-white/35 px-6 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10 sm:w-auto">View selected work</a>
            </div>
          </div>
        </div>
      </div>
      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
