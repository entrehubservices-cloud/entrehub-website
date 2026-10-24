'use client';

import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import ContactModal from './contact-modal';

const navItems = [
  { name: 'Home', href: '/#home' },
  { name: 'About', href: '/#about' },
  { name: 'Services', href: '/#services' },
  { name: 'Work', href: '/#work' },
  { name: 'Blog', href: '/blog' },
];

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isMenuOpen]);

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>

      <header
        className={`fixed inset-x-0 top-0 z-50 border-b bg-white/95 backdrop-blur-md transition-shadow duration-300 ${
          isScrolled ? 'border-slate-200 shadow-sm' : 'border-transparent'
        }`}
      >
        <nav aria-label="Main" className="mx-auto max-w-7xl px-4 sm:px-7 lg:px-10">
          <div className="flex h-[4.25rem] items-center justify-between">
            <Link href="/#home" className="flex items-center gap-2.5 rounded-lg" aria-label="ENTREHUB home">
              <span className="h-9 w-9 overflow-hidden rounded-lg ring-1 ring-slate-200">
                <Image src="/images/logo.jpeg" alt="" width={36} height={36} className="h-full w-full object-cover" priority />
              </span>
              <span className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                ENTRE<span className="text-orange-600">HUB</span>
              </span>
            </Link>

            <ul className="hidden items-center gap-0.5 md:flex">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="inline-flex min-h-10 items-center rounded-lg px-3 text-[13px] font-medium text-slate-700 transition hover:bg-slate-100 hover:text-navy">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="hidden md:block">
              <button type="button" onClick={() => setIsModalOpen(true)} aria-haspopup="dialog" className="inline-flex min-h-10 items-center rounded-xl bg-navy px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-navy-hover">
                Let&apos;s Talk
              </button>
            </div>

            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 transition hover:bg-slate-100 md:hidden"
            >
              {isMenuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>

          {isMenuOpen && (
            <div id="mobile-menu" className="border-t border-slate-200 pb-4 pt-3 md:hidden">
              <ul className="space-y-0.5">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-navy" onClick={() => setIsMenuOpen(false)}>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <button type="button" onClick={() => { setIsModalOpen(true); setIsMenuOpen(false); }} aria-haspopup="dialog" className="mt-3 min-h-11 w-full rounded-xl bg-navy text-sm font-semibold text-white shadow-sm transition hover:bg-navy-hover">
                Let&apos;s Talk
              </button>
            </div>
          )}
        </nav>
      </header>

      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
