'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Send } from 'lucide-react';
import { submitContactForm } from '@/lib/api/client';
import { contactInquiryTypes } from '@/lib/validations/contact';

export default function ContactPageForm() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    inquiryType: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const prefill = searchParams.get('inquiry');
    if (prefill) {
      setFormData((prev) => ({
        ...prev,
        inquiryType: prefill,
        message:
          prefill === 'Corporate Profile & Capability Statement' && !prev.message
            ? 'Please share ENTREHUB SERVICES LTD’s Corporate Profile & Capability Statement for our organisation.'
            : prev.message,
      }));
    }
  }, [searchParams]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (submitStatus === 'error') {
      setSubmitStatus('idle');
      setErrorMessage('');
    }
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      await submitContactForm(formData);
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        inquiryType: '',
        message: '',
      });
    } catch (error: unknown) {
      setSubmitStatus('error');
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Failed to send message. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 space-y-5"
    >
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Send a project or procurement enquiry</h2>
        <p className="mt-1 text-sm text-slate-600">
          Fields marked <span aria-hidden="true">*</span>
          <span className="sr-only">with an asterisk</span> are required.
        </p>
      </div>

      <div role="status" aria-live="polite">
        {submitStatus === 'success' && (
          <div className="rounded-xl border border-green-200 bg-green-50 p-4">
            <p className="font-semibold text-green-900">Enquiry received</p>
            <p className="mt-1 text-sm text-green-800">
              Thank you for contacting ENTREHUB SERVICES LTD. Our team will respond during business hours.
            </p>
          </div>
        )}
      </div>

      <div role="alert">
        {submitStatus === 'error' && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-800">{errorMessage}</p>
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-slate-800">
            Name <span className="text-red-700" aria-hidden="true">*</span>
          </label>
          <input
            type="text"
            id="contact-name"
            name="name"
            autoComplete="name"
            required
            disabled={isSubmitting}
            value={formData.name}
            onChange={handleChange}
            placeholder="Your full name"
            className="min-h-12 w-full rounded-xl border border-slate-400 px-3.5 py-2.5 text-base text-slate-900 placeholder:text-slate-500 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy"
          />
        </div>

        <div>
          <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-slate-800">
            Email <span className="text-red-700" aria-hidden="true">*</span>
          </label>
          <input
            type="email"
            id="contact-email"
            name="email"
            autoComplete="email"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            required
            disabled={isSubmitting}
            value={formData.email}
            onChange={handleChange}
            placeholder="you@organisation.com"
            className="min-h-12 w-full rounded-xl border border-slate-400 px-3.5 py-2.5 text-base text-slate-900 placeholder:text-slate-500 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-company" className="mb-1.5 block text-sm font-medium text-slate-800">
            Company / Organization (Optional)
          </label>
          <input
            type="text"
            id="contact-company"
            name="company"
            autoComplete="organization"
            disabled={isSubmitting}
            value={formData.company}
            onChange={handleChange}
            placeholder="Company, agency, or institution"
            className="min-h-12 w-full rounded-xl border border-slate-400 px-3.5 py-2.5 text-base text-slate-900 placeholder:text-slate-500 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy"
          />
        </div>

        <div>
          <label htmlFor="contact-phone" className="mb-1.5 block text-sm font-medium text-slate-800">
            Phone / WhatsApp (Optional)
          </label>
          <input
            type="tel"
            id="contact-phone"
            name="phone"
            autoComplete="tel"
            disabled={isSubmitting}
            value={formData.phone}
            onChange={handleChange}
            placeholder="+234..."
            className="min-h-12 w-full rounded-xl border border-slate-400 px-3.5 py-2.5 text-base text-slate-900 placeholder:text-slate-500 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy"
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-inquiryType" className="mb-1.5 block text-sm font-medium text-slate-800">
          Project / Inquiry Type (Optional)
        </label>
        <select
          id="contact-inquiryType"
          name="inquiryType"
          disabled={isSubmitting}
          value={formData.inquiryType}
          onChange={handleChange}
          className="min-h-12 w-full rounded-xl border border-slate-400 bg-white px-3.5 py-2.5 text-base text-slate-900 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy"
        >
          <option value="">Select an inquiry type…</option>
          {contactInquiryTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-slate-800">
          Message <span className="text-red-700" aria-hidden="true">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          disabled={isSubmitting}
          rows={5}
          value={formData.message}
          onChange={handleChange}
          placeholder="Describe your requirements, timeline, or procurement request..."
          className="w-full rounded-xl border border-slate-400 px-3.5 py-2.5 text-base text-slate-900 placeholder:text-slate-500 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy resize-y"
        />
      </div>

      <p className="text-xs leading-5 text-slate-600">
        By submitting this form, you acknowledge that ENTREHUB SERVICES LTD processes your enquiry in accordance with our{' '}
        <Link href="/privacy" className="font-semibold text-navy underline">
          Privacy Policy
        </Link>
        .
      </p>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-navy px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-navy-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Send className="h-4 w-4" aria-hidden="true" />
        {isSubmitting ? 'Sending enquiry...' : 'Submit Enquiry'}
      </button>
    </form>
  );
}
