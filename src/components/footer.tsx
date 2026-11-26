import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Instagram, Linkedin } from 'lucide-react';
import CopyableEmail from './copyable-email';
import { companyPhoneDisplay, companySocialUrls } from '@/lib/seo';

const menuItems = [
  { name: 'Home', href: '/#home' },
  { name: 'About', href: '/#about' },
  { name: 'Services', href: '/#services' },
  { name: 'Our Work', href: '/#work' },
  { name: 'Events', href: '/events' },
  { name: 'Blog', href: '/blog' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Contact', href: '/contact' },
];

const services = [
  'Enterprise ICT Consulting',
  'Custom Software & AI Systems',
  'Web & E-commerce Development',
  'SEO & Digital Growth',
  'Creative & Content',
  'Corporate General Contracting',
];

const socialMedia = [
  { name: 'LinkedIn', href: companySocialUrls.linkedin, Icon: Linkedin },
  { name: 'Facebook', href: companySocialUrls.facebook, Icon: Facebook },
  { name: 'Instagram', href: companySocialUrls.instagram, Icon: Instagram },
];

const linkClass =
  'inline-flex min-h-9 items-center text-slate-300 underline-offset-4 transition-colors hover:text-white hover:underline';

export default function Footer() {
  return (
    <footer className="brand-skin on-dark bg-navy-deep text-white" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-10 w-10 overflow-hidden rounded-xl ring-1 ring-white/20">
                <Image src="/images/logo.jpeg" alt="" width={40} height={40} className="h-full w-full object-cover" />
              </span>
              <span className="text-xl font-bold tracking-tight text-blue-200">
                ENTRE<span className="text-amber-300">HUB</span>
              </span>
            </div>
            <p className="leading-relaxed text-slate-300">
              Enterprise ICT consulting, custom software and AI systems, digital growth, and institutional contracting delivered for ambitious organisations worldwide.
            </p>
            <address className="mt-4 not-italic text-sm leading-relaxed text-slate-300 space-y-1.5">
              <p className="font-medium text-slate-200">
                Global Digital Delivery · Nigeria Office: M4 Tonjos Plaza, Kachia Road, Kaduna
              </p>
              <div>
                <CopyableEmail variant="dark" />
              </div>
              <p>
                <a href="tel:+2348129721560" className={linkClass}>
                  {companyPhoneDisplay}
                </a>
                <br />
                Monday–Friday, 9am–5pm (WAT)
              </p>
            </address>
          </div>

          <nav aria-labelledby="footer-menu">
            <h3 id="footer-menu" className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Menu</h3>
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className={linkClass}>{item.name}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-services">
            <h3 id="footer-services" className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Capabilities</h3>
            <ul className="space-y-1">
              {services.map((service) => (
                <li key={service}>
                  <Link href="/#services" className={linkClass}>{service}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-social">
            <h3 id="footer-social" className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Follow ENTREHUB</h3>
            <ul className="flex gap-3">
              {socialMedia.map(({ name, href, Icon }) => (
                <li key={name}>
                  <a
                    href={href}
                    aria-label={`ENTREHUB on ${name} (opens in a new tab)`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-slate-200 transition hover:border-orange-300/60 hover:bg-white/10 hover:text-orange-300 focus-visible:outline-white"
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs leading-5 text-slate-400">
              Need our Corporate Profile &amp; Capability Statement for vendor onboarding?{' '}
              <Link href="/contact?inquiry=Corporate+Profile+%26+Capability+Statement" className="text-amber-300 underline underline-offset-2 hover:text-amber-200">
                Request it here
              </Link>
              .
            </p>
          </nav>
        </div>

        <div className="mt-9 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 md:flex-row">
          <p className="text-center text-sm text-slate-400 md:text-left">
            © 2026 ENTREHUB SERVICES LTD (RC 10030133 · TIN 2621823441002). All rights reserved.
          </p>
          <ul className="flex flex-wrap justify-center gap-6 text-sm">
            <li><Link href="/terms" className={linkClass}>Website Terms</Link></li>
            <li><Link href="/privacy" className={linkClass}>Privacy Policy</Link></li>
            <li><Link href="/cookies" className={linkClass}>Cookie Notice</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
