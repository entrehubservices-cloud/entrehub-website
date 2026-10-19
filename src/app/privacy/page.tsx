import type { Metadata } from 'next';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How Entrehub Services handles enquiries, website measurement and contact information.",
  alternates: { canonical: '/privacy' },
};

export default function Page() {
  return (
    <>
      <Navigation />
      <main id="main-content" className="mx-auto max-w-3xl px-6 pb-20 pt-32">
        <h1 className="text-4xl font-bold text-slate-900">Privacy policy</h1>
        <p className="mt-3 text-sm text-slate-600">Published 19 October 2026</p>
        <div className="prose prose-slate mt-10 max-w-none">
          <section><h2>Information you share</h2><p>When you send an enquiry, we receive the name, email address, optional phone number and message you enter. If you register for an event or training, we receive the information requested on that registration form. Please do not include passwords, payment-card details or confidential client records in an enquiry.</p></section>
          <section><h2>How we use it</h2><p>We use enquiry and registration information to respond, discuss the work you request, manage registrations and communicate about those requests. Contact enquiries are stored in our website database for our team to review.</p></section>
          <section><h2>Website measurement and cookies</h2><p>This website uses Google Analytics to measure visits and interactions, and a Meta Pixel to measure page visits. These services may use cookies and collect information about your browser, device, pages visited and interactions. Our enquiry tracking sends fixed event labels for successful form submissions, phone-link clicks and WhatsApp-link clicks; it does not send your name, email, phone number or message as event parameters.</p></section>
          <section><h2>Service providers and external links</h2><p>Our website uses hosting, database, security and communication providers to operate the service. Information may be processed outside your country. When you follow a link to WhatsApp, a social network or another website, that service handles your activity under its own privacy practices.</p></section>
          <section><h2>Your choices and questions</h2><p>You can control cookies through your browser settings and choose whether to contact us through the website or an external service. For questions about information you have shared, or to request access, correction or removal, email entrehubservices@gmail.com. We will review your request and explain any information we need to retain for an ongoing service or record.</p></section>
          <section><h2>Updates</h2><p>We may update this notice as our website and services change. The date below shows when this version was published.</p></section>
        </div>
      </main>
      <Footer />
    </>
  );
}
