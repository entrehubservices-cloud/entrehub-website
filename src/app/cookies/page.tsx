import type { Metadata } from 'next';
import Link from 'next/link';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import CookiePreferencesCard from '@/components/cookie-preferences-card';
import CopyableEmail from '@/components/copyable-email';
import { companyRcNumber, companyTaxId, siteName } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Cookie Notice',
  description:
    'How ENTREHUB SERVICES LTD uses essential storage and optional consent-gated analytics cookies on www.entrehubng.com.',
  alternates: { canonical: '/cookies' },
};

export default function CookieNoticePage() {
  return (
    <>
      <Navigation />
      <main id="main-content" tabIndex={-1} className="mx-auto max-w-3xl px-6 pb-20 pt-32 focus:outline-none">
        <h1 className="text-4xl font-bold text-slate-900">Cookie Notice</h1>
        <p className="mt-3 text-sm text-slate-600">Effective Date: 26 November 2026</p>

        <CookiePreferencesCard />

        <div className="prose prose-slate mt-8 max-w-none">
          <section>
            <h2>1. Overview</h2>
            <p>
              This Cookie Notice explains how <strong>{siteName}</strong> (RC {companyRcNumber} · TIN {companyTaxId}) uses cookies and browser local storage on <code>www.entrehubng.com</code>. Non-essential analytics and advertising measurement scripts are disabled by default and load only if you click <strong>Accept All</strong> on our cookie banner or enable them above.
            </p>
          </section>

          <section>
            <h2>2. Categories of Cookies &amp; Storage We Use</h2>
            <ul>
              <li>
                <strong>Strictly Necessary / Essential Storage (Always Active):</strong>
                <ul>
                  <li>
                    <code>entrehub_cookie_consent</code> (Local Storage): Remembers whether you selected <em>Accept All</em> or <em>Essential Only</em> so we do not prompt you on every page load.
                  </li>
                  <li>
                    <code>auth-token</code> (HTTP Cookie, staff only): Secures authenticated administrator sessions on <code>/admin</code> routes. Not set for public visitors.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Analytics &amp; Measurement Cookies (Optional — Consent Required):</strong>
                <ul>
                  <li>
                    <strong>Google Analytics 4 (<code>_ga</code>, <code>_ga_*</code>):</strong> Helps us understand aggregated page visits, traffic sources, and non-personal interaction events (such as whether an enquiry form or contact button was used) with IP anonymisation enabled.
                  </li>
                  <li>
                    <strong>Meta Pixel (<code>_fbp</code>):</strong> Measures aggregated page views and campaign effectiveness for ENTREHUB&rsquo;s official social channels.
                  </li>
                </ul>
              </li>
            </ul>
          </section>

          <section>
            <h2>3. How to Control or Delete Cookies</h2>
            <p>
              You can update or withdraw your consent at any time using the preference controls at the top of this page. If you switch from <em>Accept All</em> to <em>Essential Only</em>, Google Analytics and Meta Pixel scripts will not load on subsequent page views, and you can clear any previously set browser cookies through your browser&rsquo;s privacy settings.
            </p>
          </section>

          <section>
            <h2>4. Further Information</h2>
            <p>
              For full details on how we handle personal data and your rights under the Nigeria Data Protection Act (NDPA) 2023, please read our <Link href="/privacy">Privacy Policy</Link> or contact us at <CopyableEmail />.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
