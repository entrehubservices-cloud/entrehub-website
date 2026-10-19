import type { Metadata } from 'next';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';

export const metadata: Metadata = {
  title: "Website terms",
  description: "Information about using the Entrehub Services website and requesting our services.",
  alternates: { canonical: '/terms' },
};

export default function Page() {
  return (
    <>
      <Navigation />
      <main id="main-content" className="mx-auto max-w-3xl px-6 pb-20 pt-32">
        <h1 className="text-4xl font-bold text-slate-900">Website terms</h1>
        <p className="mt-3 text-sm text-slate-600">Published 19 October 2026</p>
        <div className="prose prose-slate mt-10 max-w-none">
          <section><h2>About this website</h2><p>This website introduces Entrehub Services, our work and our services. Blog articles provide general information; they do not replace advice tailored to your business or circumstances.</p></section>
          <section><h2>Enquiries and project agreements</h2><p>Sending an enquiry does not create a service contract. Deliverables, fees, schedules, payment arrangements, ownership and support are agreed separately in a written proposal or project agreement before work begins.</p></section>
          <section><h2>Results and portfolio examples</h2><p>Portfolio entries describe completed work. Results depend on the project, market, budget and other factors. We do not guarantee a particular Google ranking, sales result or return on investment.</p></section>
          <section><h2>Content and third-party material</h2><p>Entrehub materials and client portfolio assets remain subject to their respective owners&rsquo; rights. Please contact us before republishing our content or using a client&rsquo;s brand assets. External links are provided for reference; we do not control those websites.</p></section>
          <section><h2>Using the website</h2><p>Please use the website responsibly. Do not submit misleading enquiries, attempt to access another person&rsquo;s information or interfere with the website. If you notice an error or security concern, contact us without including private credentials.</p></section>
          <section><h2>Contact</h2><p>For website or service questions, email entrehubservices@gmail.com or call +234 812 972 1560 during business hours, Monday–Friday, 9am–5pm (WAT).</p></section>
        </div>
      </main>
      <Footer />
    </>
  );
}
