import type { Metadata } from 'next';
import Link from 'next/link';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import CopyableEmail from '@/components/copyable-email';
import {
  companyOperatingAddress,
  companyPhoneDisplay,
  companyRcNumber,
  companyRegisteredAddress,
  companyTaxId,
  siteName,
} from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How ENTREHUB SERVICES LTD processes personal data in compliance with the Nigeria Data Protection Act (NDPA) 2023 and international data protection standards.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navigation />
      <main id="main-content" tabIndex={-1} className="mx-auto max-w-3xl px-6 pb-20 pt-32 focus:outline-none">
        <h1 className="text-4xl font-bold text-slate-900">Privacy Policy</h1>
        <p className="mt-3 text-sm text-slate-600">Effective Date: 26 November 2026</p>

        <div className="prose prose-slate mt-10 max-w-none">
          <section>
            <h2>1. Data Controller &amp; Corporate Details</h2>
            <p>
              This Privacy Policy explains how <strong>{siteName}</strong>, a private company limited by shares incorporated in the Federal Republic of Nigeria (Corporate Affairs Commission Registration No. <strong>RC {companyRcNumber}</strong> · Tax Identification No. <strong>TIN {companyTaxId}</strong>), collects, uses, stores, and protects personal data when you visit <code>www.entrehubng.com</code>, submit an enquiry, register for an event, or engage our services.
            </p>
            <ul>
              <li>
                <strong>Operating Office:</strong> {companyOperatingAddress}
              </li>
              <li>
                <strong>Registered Office:</strong> {companyRegisteredAddress}
              </li>
              <li>
                <strong>Privacy &amp; Data Protection Contact:</strong> <CopyableEmail /> ·{' '}
                <a href="tel:+2348129721560">{companyPhoneDisplay}</a>
              </li>
            </ul>
          </section>

          <section>
            <h2>2. Personal Data We Collect</h2>
            <p>We collect only the personal data reasonably necessary for business communication, event management, and service delivery:</p>
            <ul>
              <li>
                <strong>Enquiry &amp; Project Data:</strong> Name, work or personal email address, optional phone number, optional company/organisation name, project or inquiry type, and the message details you submit.
              </li>
              <li>
                <strong>Event &amp; Webinar Registration Data:</strong> Name, email address, optional phone/company/role, selected timezone, and communication preferences.
              </li>
              <li>
                <strong>Contract &amp; Billing Records:</strong> Authorised representative contact details, statements of work, invoices, and statutory tax documentation for active clients and suppliers.
              </li>
              <li>
                <strong>Website Usage &amp; Cookie Data:</strong> Technical request logs required for security and, only where you grant consent via our cookie banner, aggregated analytics and page-view data via Google Analytics and Meta Pixel (see our <Link href="/cookies">Cookie Notice</Link>).
              </li>
            </ul>
            <p>
              Please do not submit passwords, payment-card numbers, government identity numbers, or sensitive personal data through public website forms.
            </p>
          </section>

          <section>
            <h2>3. Lawful Bases for Processing</h2>
            <p>
              In accordance with the <strong>Nigeria Data Protection Act (NDPA) 2023</strong> and applicable international data protection frameworks (including GDPR principles where relevant to international clients), we process personal data only where at least one lawful basis applies:
            </p>
            <ul>
              <li>
                <strong>Consent:</strong> Where you opt in to optional analytics cookies, subscribe to event updates, or submit voluntary enquiries. You may withdraw consent at any time without affecting prior lawful processing.
              </li>
              <li>
                <strong>Contractual Necessity:</strong> To prepare proposals, enter into Statements of Work (SOWs), deliver contracted ICT, software, digital, or contracting services, and manage event attendance you requested.
              </li>
              <li>
                <strong>Legal Obligation:</strong> To comply with Nigerian corporate, tax (FIRS/VAT/WHT), accounting, anti-fraud, and regulatory obligations.
              </li>
              <li>
                <strong>Legitimate Interests:</strong> To maintain website security, prevent spam or abuse, respond to B2B correspondence, and improve service quality where those interests do not override your fundamental rights.
              </li>
            </ul>
          </section>

          <section>
            <h2>4. How We Use Personal Data &amp; Analytics</h2>
            <p>
              We use your information to respond to enquiries, scope and deliver engagements, administer webinar/event registrations, issue invoices, and maintain statutory business records. We do not sell personal data to third parties.
            </p>
            <p>
              Optional measurement tools (Google Analytics and Meta Pixel) remain disabled until you select <strong>Accept All</strong> on our cookie banner. Our enquiry tracking records only fixed interaction labels (form submission, phone link click, or WhatsApp click) and never transmits your name, email, phone number, or message text as analytics parameters.
            </p>
          </section>

          <section>
            <h2>5. Data Retention Periods</h2>
            <p>We retain personal data only for as long as necessary to fulfil the purpose for which it was collected:</p>
            <ul>
              <li>
                <strong>Client Contracts, Invoices &amp; Financial Records:</strong> Retained for the duration of the service relationship plus <strong>six (6) years</strong> to satisfy statutory tax, audit, and corporate record-keeping obligations under Nigerian law.
              </li>
              <li>
                <strong>General Website Enquiries &amp; Event Registrations:</strong> Retained for up to <strong>twenty-four (24) months</strong> after the last interaction or event completion unless an active business relationship begins or you request earlier erasure.
              </li>
              <li>
                <strong>Analytics &amp; Cookie Preferences:</strong> Stored according to the lifespans described in our <Link href="/cookies">Cookie Notice</Link> until cleared or withdrawn.
              </li>
            </ul>
          </section>

          <section>
            <h2>6. Service Providers &amp; Cross-Border Data Transfers</h2>
            <p>
              We rely on vetted cloud hosting, database, email, analytics, and collaboration infrastructure (which may process data in Nigeria, the United States, the European Economic Area, or the United Kingdom). Where personal data is transferred outside Nigeria, <strong>{siteName}</strong> ensures appropriate safeguards are in place under Part VI of the NDPA 2023, including adequacy assessments, standard contractual data-protection clauses, encrypted transport (TLS), and strict access controls.
            </p>
            <p>
              When you follow external links (such as WhatsApp, LinkedIn, Facebook, Instagram, Google Meet, or client portfolio sites), those third-party platforms process data under their own privacy policies.
            </p>
          </section>

          <section>
            <h2>7. Your Data Subject Rights</h2>
            <p>Under the NDPA 2023 and applicable international privacy laws, you have the right to:</p>
            <ul>
              <li><strong>Access</strong> a copy of the personal data we hold about you;</li>
              <li><strong>Rectification</strong> of inaccurate or incomplete personal data;</li>
              <li><strong>Erasure</strong> (&ldquo;right to be forgotten&rdquo;) where data is no longer required for a lawful purpose or statutory retention period;</li>
              <li><strong>Restriction of processing</strong> in specific circumstances;</li>
              <li><strong>Data portability</strong> in a structured, commonly used electronic format where technically feasible;</li>
              <li><strong>Object</strong> to processing based on legitimate interests or direct marketing; and</li>
              <li><strong>Withdraw consent</strong> at any time (including via our <Link href="/cookies">Cookie Notice</Link> for analytics cookies).</li>
            </ul>
            <p>
              To exercise any of these rights, contact us at <CopyableEmail />. We may verify your identity before fulfilling a request and will respond within statutory timelines.
            </p>
          </section>

          <section>
            <h2>8. Right to Lodge a Complaint</h2>
            <p>
              If you believe your data protection rights have been infringed, please contact us first at <CopyableEmail /> so we can address your concern promptly. You also have the statutory right to lodge a complaint with the <strong>Nigeria Data Protection Commission (NDPC)</strong> (<a href="https://ndpc.gov.ng" target="_blank" rel="noopener noreferrer">https://ndpc.gov.ng</a>) or, if you reside outside Nigeria, with the competent data protection supervisory authority in your jurisdiction.
            </p>
          </section>

          <section>
            <h2>9. Updates to This Policy</h2>
            <p>
              We may update this Privacy Policy periodically to reflect legal, operational, or multi-jurisdictional changes (including international subsidiary operations). Material updates will carry a revised Effective Date at the top of this page.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
