'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Pause, Play, Sparkles } from 'lucide-react';
import ContactModal from './contact-modal';

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      videoRef.current?.pause();
      setIsPlaying(false);
    }
  }, []);

  const toggleVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  return (
    <section
      id="home"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-white pt-[4.25rem]"
    >
      <div className="mx-auto grid min-h-[min(760px,calc(100svh-4.25rem))] max-w-7xl items-center gap-9 px-5 py-12 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12 lg:px-10 lg:py-14">
        <div className="relative z-10 max-w-2xl">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-navy">
            <span className="h-2 w-2 rounded-full bg-orange-500" aria-hidden="true" />
            Digital partner for growing brands
          </p>

          <h1
            id="hero-heading"
            className="mb-5 max-w-[12ch] text-[2.75rem] font-bold leading-[1.02] tracking-[-0.045em] text-slate-950 sm:text-6xl lg:text-[4.25rem]"
          >
            Build a digital presence that <span className="text-navy">moves you forward.</span>
          </h1>

          <p className="mb-7 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
            Entrehub builds websites, apps and digital marketing systems for businesses ready to grow. We work remotely with clients across markets and time zones.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              aria-haspopup="dialog"
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-navy px-6 text-sm font-semibold text-white shadow-md shadow-blue-950/15 transition hover:bg-navy-hover"
            >
              Tell us what you’re building
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </button>
            <a
              href="#work"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 text-sm font-semibold text-slate-800 transition hover:border-navy hover:text-navy"
            >
              Explore selected work
            </a>
          </div>

          <div className="mt-7 flex flex-wrap gap-2" aria-label="Areas of work">
            {['Web & app development', 'SEO', 'Digital marketing'].map((item) => (
              <span key={item} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-2xl lg:max-w-none">
          <div className="absolute -right-4 -top-4 h-28 w-28 rounded-full bg-orange-100 blur-2xl sm:-right-5 sm:-top-5 sm:h-40 sm:w-40" aria-hidden="true" />
          <div className="absolute -bottom-5 -left-5 h-36 w-36 rounded-full bg-blue-100 blur-3xl" aria-hidden="true" />
          <div className="relative overflow-hidden rounded-[1.6rem] border border-slate-200 bg-navy-deep p-2.5 shadow-2xl shadow-blue-950/15 sm:rounded-[2rem] sm:p-3">
            <div className="relative aspect-[1.15/1] overflow-hidden rounded-[1.1rem] bg-slate-900 sm:aspect-[1.28/1] sm:rounded-[1.5rem]">
              <video
                ref={videoRef}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label="Decorative preview of digital design work"
                className="absolute inset-0 h-full w-full object-cover opacity-80"
              >
                <source src="/videos/digi-3.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-br from-navy-deep/30 via-transparent to-navy-deep/80" aria-hidden="true" />
              <div className="absolute inset-x-0 top-0 flex items-center justify-between border-b border-white/10 bg-navy-deep/55 px-4 py-3 backdrop-blur-sm sm:px-6">
                <span className="flex items-center gap-2 text-xs font-semibold tracking-wide text-white">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-orange-300">
                    <Sparkles className="h-4 w-4" aria-hidden="true" />
                  </span>
                  ENTREHUB / DIGITAL STUDIO
                </span>
                <span className="rounded-full border border-white/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-blue-100">Ideas to impact</span>
              </div>

              <div className="absolute bottom-5 left-4 right-4 sm:bottom-7 sm:left-6 sm:right-6">
                <div className="mb-3 flex flex-wrap gap-2">
                  {['Strategy', 'Design', 'Development'].map((item) => (
                    <span key={item} className="rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                      {item}
                    </span>
                  ))}
                </div>
                <p className="max-w-md text-xl font-semibold leading-tight tracking-tight text-white sm:text-3xl">
                  Thoughtful digital work, built around your next move.
                </p>
              </div>
              <button
                type="button"
                onClick={toggleVideo}
                aria-label={isPlaying ? 'Pause decorative background video' : 'Play decorative background video'}
                className="absolute bottom-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-navy-deep/70 text-white backdrop-blur-sm transition hover:bg-navy-deep"
              >
                {isPlaying ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
              </button>
            </div>
          </div>
          <div className="absolute -left-1 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-lg sm:flex">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="text-xs font-semibold leading-5 text-slate-700">Clear thinking.<br />Useful outcomes.</span>
          </div>
        </div>
      </div>

      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
