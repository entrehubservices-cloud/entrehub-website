import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Instagram, Linkedin } from 'lucide-react';

const menuItems = [
  { name: 'Home', href: '/#home' },
  { name: 'About', href: '/#about' },
  { name: 'Services', href: '/#services' },
  { name: 'Our Work', href: '/#work' },
  { name: 'Blog', href: '/blog' },
];

const services = [
  'Web & App Development',
  'Social Media Marketing',
  'Email Marketing',
  'SEO',
  'Creative & Content',
];

const socialMedia = [
  { name: 'LinkedIn', href: 'https://www.linkedin.com/company/entrehub-services/', Icon: Linkedin },
  { name: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61555757332109', Icon: Facebook },
  { name: 'Instagram', href: 'https://www.instagram.com/entre_hubservices?srtk=NjQ3dXYyaHZhaTFi', Icon: Instagram },
];

const linkClass =
  'inline-flex min-h-9 items-center text-slate-300 underline-offset-4 transition-colors hover:text-white hover:underline';

export default function Footer() {
  return (
    <footer className="on-dark bg-navy-deep text-white" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-10 w-10 overflow-hidden rounded-xl ring-1 ring-white/20">
                <Image src="/images/logo.jpeg" alt="" width={40} height={40} className="h-full w-full object-cover" />
              </span>
              <span className="text-xl font-bold tracking-tight">ENTRE<span className="text-orange-400">HUB</span></span>
            </div>
            <p className="leading-relaxed text-slate-300">
              Innovative digital marketing strategies that blend creativity and data-driven insights to elevate your brand&apos;s online presence and drive measurable growth.
            </p>
            <address className="mt-4 not-italic text-sm leading-relaxed text-slate-300">
              Based in Nigeria. Working with clients worldwide.<br />
              <a href="tel:+2348129721560" className={linkClass}>+234 812 972 1560</a><br />
              Monday–Friday, 9am–5pm (WAT)
            </address>
          </div>

          <nav aria-labelledby="footer-menu">
            <h3 id="footer-menu" className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Menu</h3>
            <ul className="space-y-1">
              {menuItems.map((item) => <li key={item.name}><Link href={item.href} className={linkClass}>{item.name}</Link></li>)}
            </ul>
          </nav>

          <nav aria-labelledby="footer-services">
            <h3 id="footer-services" className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Services</h3>
            <ul className="space-y-1">
              {services.map((service) => <li key={service}><Link href="/#services" className={linkClass}>{service}</Link></li>)}
            </ul>
          </nav>

          <nav aria-labelledby="footer-social">
            <h3 id="footer-social" className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Follow Entrehub</h3>
            <ul className="flex gap-3">
              {socialMedia.map(({ name, href, Icon }) => (
                <li key={name}>
                  <a href={href} aria-label={`Entrehub on ${name} (opens in a new tab)`} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-slate-200 transition hover:border-orange-300/60 hover:bg-white/10 hover:text-orange-300 focus-visible:outline-white">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm leading-6 text-slate-400">Connect with us for updates, ideas and new work.</p>
          </nav>
        </div>

        <div className="mt-9 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 md:flex-row">
          <p className="text-sm text-slate-400">© {new Date().getFullYear()} ENTREHUB. All rights reserved.</p>
          <ul className="flex gap-6 text-sm">
            <li><Link href="/terms" className={linkClass}>Website terms</Link></li>
            <li><Link href="/privacy" className={linkClass}>Privacy policy</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
