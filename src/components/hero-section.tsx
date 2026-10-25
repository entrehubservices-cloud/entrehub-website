'use client';

import { useState } from 'react';
import { ArrowRight, ArrowUpRight, Code2, Search, Share2, Sparkles } from 'lucide-react';
import { League_Spartan } from 'next/font/google';
import ContactModal from './contact-modal';

const heroFont = League_Spartan({ subsets: ['latin'], weight: ['800'], display: 'swap' });

const services = [
  { label: 'Web', Icon: Code2, className: 'hub-node--web' },
  { label: 'Search', Icon: Search, className: 'hub-node--search' },
  { label: 'Content', Icon: Share2, className: 'hub-node--content' },
];

export default function HeroSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section
        id="home"
        aria-labelledby="hero-heading"
        className="relative isolate overflow-hidden bg-[#0e1b36] pt-[4.25rem] text-white"
      >
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
          <div className="absolute -right-40 top-0 h-[38rem] w-[38rem] rounded-full bg-blue-500/15 blur-3xl" />
          <div className="absolute -left-48 bottom-[-16rem] h-[34rem] w-[34rem] rounded-full bg-amber-400/10 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(112deg,rgba(14,27,54,0.96)_0%,rgba(14,27,54,0.9)_46%,rgba(14,27,54,0.68)_100%)]" />
        </div>

        <div className="mx-auto grid min-h-[min(660px,calc(100svh-4.25rem))] max-w-7xl items-center gap-6 px-5 py-10 sm:px-8 sm:py-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-8 lg:px-10 lg:py-14">
          <div className="relative z-10 max-w-2xl">
            <p className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-blue-100 sm:text-xs">
              <span className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_14px_rgba(251,191,36,0.8)]" aria-hidden="true" />
              Digital partner for ambitious brands
            </p>

            <h1
              id="hero-heading"
              className={`${heroFont.className} mb-5 max-w-[13ch] text-[3.15rem] font-extrabold leading-[0.94] tracking-[-0.045em] text-white motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-5 motion-safe:duration-700 sm:text-[4.5rem] lg:text-[4.65rem] xl:text-[5.15rem]`}
            >
              Your digital presence, <span className="text-amber-300">working as one.</span>
            </h1>

            <p className="mb-7 max-w-xl text-base leading-7 text-blue-50/80 sm:text-lg sm:leading-8">
              From your website to search visibility and content, we connect the pieces into a clear experience for customers worldwide.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                aria-haspopup="dialog"
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-amber-300 px-6 text-sm font-bold text-[#16213a] shadow-lg shadow-amber-950/20 transition duration-200 hover:-translate-y-0.5 hover:bg-amber-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300"
              >
                Start a conversation
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </button>
              <a
                href="#services"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/25 bg-white/[0.04] px-6 text-sm font-semibold text-white transition duration-200 hover:border-white/50 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                Explore our services
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-blue-100/80 sm:text-sm" aria-label="Areas of work">
              {['Web & app development', 'SEO', 'Digital marketing'].map((item) => (
                <span key={item} className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-300" aria-hidden="true" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[34rem] lg:max-w-none" aria-hidden="true">
            <div className="hub-art relative mx-auto aspect-[1.05/0.92] w-full max-w-[34rem] overflow-hidden rounded-[2rem] border border-white/10 bg-[#13284f] shadow-[0_32px_90px_rgba(0,0,0,0.35)] sm:rounded-[2.4rem]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_52%_48%,rgba(59,130,246,0.26),transparent_52%)]" />
              <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.18)_1px,transparent_1px)] [background-size:42px_42px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_78%)]" />

              <div className="hub-orbit hub-orbit--one" />
              <div className="hub-orbit hub-orbit--two" />
              <div className="hub-orbit hub-orbit--three" />

              <div className="hub-core absolute left-1/2 top-1/2 flex h-36 w-36 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-amber-200/50 bg-[radial-gradient(circle_at_35%_28%,#f9d977_0%,#e9a92d_36%,#a96616_100%)] shadow-[0_0_70px_rgba(245,179,54,0.3),inset_0_5px_16px_rgba(255,255,255,0.45),inset_0_-12px_18px_rgba(83,42,9,0.32)] sm:h-44 sm:w-44">
                <div className="flex h-[72%] w-[72%] items-center justify-center rounded-full border border-white/30 bg-[#f6c44d]/40 shadow-inner">
                  <ArrowUpRight className="h-14 w-14 text-white drop-shadow-md sm:h-16 sm:w-16" strokeWidth={1.7} />
                </div>
              </div>

              <div className="hub-node hub-node--web">
                <span className="hub-node__icon"><Code2 className="h-4 w-4" /></span>
                <span>Web</span>
              </div>
              <div className="hub-node hub-node--search">
                <span className="hub-node__icon"><Search className="h-4 w-4" /></span>
                <span>Search</span>
              </div>
              <div className="hub-node hub-node--content">
                <span className="hub-node__icon"><Share2 className="h-4 w-4" /></span>
                <span>Content</span>
              </div>

              <div className="absolute inset-x-5 top-5 flex items-center justify-between sm:inset-x-7 sm:top-7">
                <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/75 sm:text-xs">
                  <Sparkles className="h-4 w-4 text-amber-300" />
                  ENTREHUB / DIGITAL STUDIO
                </span>
                <span className="rounded-full border border-white/15 bg-white/[0.05] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-blue-100/80 sm:text-[10px]">
                  Strategy · Design · Delivery
                </span>
              </div>

              <div className="absolute inset-x-5 bottom-5 flex items-end justify-between sm:inset-x-7 sm:bottom-7">
                <div>
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-300/90">Connected by design</p>
                  <p className="max-w-[15rem] text-lg font-bold leading-tight tracking-tight text-white sm:text-2xl">
                    One clear path from idea to online.
                  </p>
                </div>
                <span className="hidden h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-amber-300 sm:flex">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .hub-orbit {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 69%;
          height: 48%;
          border: 1px solid rgba(255, 255, 255, 0.19);
          border-radius: 50%;
          transform-style: preserve-3d;
          pointer-events: none;
        }
        .hub-orbit--one {
          transform: translate(-50%, -50%) rotateX(67deg) rotateZ(-18deg);
          animation: hub-spin-one 24s linear infinite;
        }
        .hub-orbit--two {
          width: 84%;
          height: 60%;
          border-color: rgba(251, 191, 36, 0.2);
          transform: translate(-50%, -50%) rotateX(67deg) rotateZ(35deg);
          animation: hub-spin-two 30s linear infinite;
        }
        .hub-orbit--three {
          width: 54%;
          height: 74%;
          border-color: rgba(96, 165, 250, 0.22);
          transform: translate(-50%, -50%) rotateY(68deg) rotateZ(-22deg);
        }
        .hub-core {
          animation: hub-float 6s ease-in-out infinite;
        }
        .hub-node {
          position: absolute;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 0.55rem;
          padding: 0.6rem 0.8rem;
          border: 1px solid rgba(255,255,255,.16);
          border-radius: 0.9rem;
          background: rgba(10, 24, 48, .88);
          box-shadow: 0 14px 35px rgba(0,0,0,.24);
          color: white;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: .01em;
          backdrop-filter: blur(10px);
        }
        .hub-node__icon {
          display: grid;
          width: 2rem;
          height: 2rem;
          place-items: center;
          border-radius: .65rem;
          background: rgba(59,130,246,.2);
          color: #bfdbfe;
        }
        .hub-node--web { left: 8%; top: 31%; animation: hub-float 5.7s ease-in-out infinite; }
        .hub-node--search { right: 7%; top: 38%; animation: hub-float 6.3s ease-in-out -1.2s infinite; }
        .hub-node--content { left: 18%; bottom: 25%; animation: hub-float 5.2s ease-in-out -2.1s infinite; }
        @keyframes hub-float {
          0%, 100% { translate: 0 0; }
          50% { translate: 0 -10px; }
        }
        @keyframes hub-spin-one {
          from { transform: translate(-50%, -50%) rotateX(67deg) rotateZ(-18deg); }
          to { transform: translate(-50%, -50%) rotateX(67deg) rotateZ(342deg); }
        }
        @keyframes hub-spin-two {
          from { transform: translate(-50%, -50%) rotateX(67deg) rotateZ(35deg); }
          to { transform: translate(-50%, -50%) rotateX(67deg) rotateZ(-325deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .hub-orbit, .hub-core, .hub-node { animation: none !important; }
        }
        @media (max-width: 639px) {
          .hub-node { gap: .35rem; padding: .42rem .52rem; font-size: .68rem; }
          .hub-node__icon { width: 1.65rem; height: 1.65rem; }
          .hub-node--web { left: 4%; top: 27%; }
          .hub-node--search { right: 3%; top: 35%; }
          .hub-node--content { left: 8%; bottom: 23%; }
        }
      `}</style>

      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
