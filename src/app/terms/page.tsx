import type { Metadata } from 'next';
import Link from 'next/link';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import CopyableEmail from '@/components/copyable-email';
import {
  companyOperatingAddress,
  companyPhoneDisplay,
  companyRcNumber,
  companyTaxId,
  siteName,
} from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Website Terms',
  description:
    'Terms of use and standard commercial framework for visiting www.entrehubng.com and engaging ENTREHUB SERVICES LTD.',
  alternates: { canonical: '/terms' },
};

export default function WebsiteTermsPage() {
  return (
    <>
      <Navigation />
      <main id="main-content" tabIndex={-1} className="mx-auto max-w-3xl px-6 pb-20 pt-32 focus:outline-none">
        <h1 className="text-4xl font-bold text-slate-900">Website Terms</h1>
        <p className="mt-3 text-sm text-slate-600">Effective Date: 26 November 2026</p>

        <div className="prose prose-slate mt-10 max-w-none">
          <section>
            <h2>1. About This Website &amp; Corporate Identity</h2>
            <p>
              This website (<code>www.entrehubng.com</code>) is operated by <strong>{siteName}</strong>, a private company limited by shares registered in Nigeria with the Corporate Affairs Commission under <strong>RC {companyRcNumber}</strong> (FIRS <strong>TIN {companyTaxId}</strong>), operating from {companyOperatingAddress}. Content published on this website (including articles, guides, webinars, and indicative package pricing) is provided for general informational purposes and does not constitute tailored legal, financial, tax, or regulated advisory services.
            </p>
          </section>

          <section>
            <h2>2. Scope of Engagement &amp; SOW Precedence</h2>
            <p>
              Submitting an enquiry, requesting our Corporate Profile, or viewing indicative pricing on this website does not create a binding client engagement or service contract. All commercial engagements—whether for Enterprise ICT Consulting, Custom Software &amp; AI Systems, Website/E-commerce Development, Digital Growth, or Corporate/Institutional General Contracting—are governed by a written Proposal, Master Services Agreement (MSA), Purchase Order, or Statement of Work (<strong>SOW</strong>) signed by authorised representatives of both parties. Where a signed SOW or contract conflicts with these Website Terms, the signed SOW or contract prevails.
            </p>
          </section>

          <section>
            <h2>3. Intellectual Property Rights</h2>
            <p>
              Unless otherwise stated, all website copy, visual design, brand marks (including the ENTREHUB wordmark and logo), original articles, and underlying code on this site belong to <strong>{siteName}</strong> or our licensors and may not be reproduced commercially without prior written permission.
            </p>
            <p>
              For client engagements, each party retains ownership of its pre-existing background intellectual property, frameworks, and tools. Subject to full payment of all agreed fees under the applicable SOW, bespoke client deliverables are assigned or licensed to the client strictly as specified in that SOW. Third-party software, fonts, cloud infrastructure, and open-source components remain governed by their respective licences.
            </p>
          </section>

          <section>
            <h2>4. Confidentiality</h2>
            <p>
              Non-public business, technical, operational, or procurement information exchanged during scoping or delivery of an engagement shall be treated as confidential and used solely to evaluate or perform the agreed work, subject to mandatory legal or regulatory disclosures. Please avoid sending passwords, secret keys, or sensitive personal data through unauthenticated public forms; dedicated secure channels are established once an engagement begins.
            </p>
          </section>

          <section>
            <h2>5. Fees, Invoicing &amp; Applicable Taxes (VAT / WHT)</h2>
            <p>
              Prices displayed on our <Link href="/pricing">Pricing</Link> page are indicative baseline figures; currency conversions shown on the website are reference estimates rather than binding foreign-exchange quotes. Binding fees, milestone schedules, retainers, and third-party pass-through costs (such as cloud hosting, domains, software licences, or advertising media spend) are set out in the applicable SOW or invoice.
            </p>
            <p>
              Unless expressly stated otherwise in an invoice or contract, quoted fees are exclusive of Value Added Tax (<strong>VAT</strong>), sales tax, customs duties, and payment-processor or wire-transfer charges. Where a corporate or institutional client is legally required to deduct Withholding Tax (<strong>WHT</strong>), the client shall remit the deducted tax to the relevant tax authority and promptly issue the official WHT credit note to <strong>{siteName}</strong> (TIN {companyTaxId}).
            </p>
          </section>

          <section>
            <h2>6. Portfolio Examples &amp; Commercial Outcomes</h2>
            <p>
              Portfolio items describe real projects delivered by our team. Commercial outcomes—such as search engine rankings, traffic, conversion rates, or revenue—depend on market competition, client operations, product-market fit, and ad spend. <strong>{siteName}</strong> does not guarantee specific search rankings, lead volumes, or financial returns.
            </p>
          </section>

          <section>
            <h2>7. Acceptable Use &amp; Third-Party Links</h2>
            <p>
              You agree not to misuse this website, submit fraudulent or automated spam enquiries, probe or circumvent security controls, or interfere with service availability. Links to external websites or client projects are provided for convenience; we do not control and are not responsible for third-party sites.
            </p>
          </section>

          <section>
            <h2>8. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by applicable law, this website is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis without warranties of uninterrupted availability. Neither <strong>{siteName}</strong> nor its directors, employees, or contractors shall be liable for indirect, incidental, special, or consequential losses, loss of profits, or loss of data arising out of your use of this website. Liability under any paid client engagement is governed by and capped in accordance with the signed SOW or contract.
            </p>
          </section>

          <section>
            <h2>9. Governing Law &amp; Dispute Resolution</h2>
            <p>
              These Website Terms and any non-contractual obligations arising from them are governed by the laws of the <strong>Federal Republic of Nigeria</strong>. In the event of any dispute arising out of or in connection with this website or our services (unless a signed contract specifies another forum), the parties shall first seek an amicable resolution through good-faith executive negotiation within thirty (30) days. Any dispute not resolved amicably shall be referred to mediation and, if necessary, binding arbitration in Nigeria in accordance with the <strong>Arbitration and Mediation Act 2023</strong>.
            </p>
          </section>

          <section>
            <h2>10. Contact</h2>
            <p>
              For legal, procurement, or service enquiries, contact <strong>{siteName}</strong> at <CopyableEmail /> or call{' '}
              <a href="tel:+2348129721560">{companyPhoneDisplay}</a> during business hours, Monday–Friday, 9am–5pm (WAT), or visit our <Link href="/contact">Contact page</Link>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
