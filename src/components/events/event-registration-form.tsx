'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, CheckCircle2, Loader2, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { eventTimezones } from '@/lib/validations/webinar';

interface EventRegistrationFormProps {
  eventId: string;
  eventTitle: string;
  defaultTimezone: string;
}

interface ConfirmationPayload {
  id: string;
  emailDeliveryStatus: 'SENT' | 'SKIPPED_UNCONFIGURED' | 'FAILED';
  calendarLinks: {
    google: string;
    outlook: string;
  };
  event: {
    title: string;
    scheduledAt: string;
    timezone: string;
    format: string;
    location: string | null;
    meetingLink: string | null;
    isFree: boolean;
  };
}

export default function EventRegistrationForm({
  eventId,
  eventTitle,
  defaultTimezone,
}: EventRegistrationFormProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [timezone, setTimezone] = useState(defaultTimezone || 'Africa/Lagos');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [subscribeUpdates, setSubscribeUpdates] = useState(false);
  const [website, setWebsite] = useState(''); // honeypot
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<ConfirmationPayload | null>(
    null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!agreeToTerms) {
      setErrorMsg('Please agree to the privacy notice before registering.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/webinar/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          webinarId: eventId,
          firstName,
          lastName,
          email,
          phone,
          companyName,
          country: 'Nigeria',
          industry: 'Other',
          timezone,
          topicsOfInterest: [],
          agreeToTerms,
          subscribeUpdates,
          website,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setErrorMsg(
          data.details?.[0]?.message ||
            data.error ||
            'Registration could not be completed.'
        );
        return;
      }

      setConfirmation(data);
    } catch {
      setErrorMsg('Network error while submitting registration. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (confirmation) {
    return (
      <div className="rounded-3xl border border-green-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900">
          You&apos;re registered
        </h3>
        <p className="mt-2 text-sm text-slate-600">
          Your free seat for <strong>{confirmation.event.title}</strong> is
          confirmed ({firstName} {lastName} · {email}).
        </p>

        {confirmation.event.meetingLink && (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Google Meet Link
            </p>
            <a
              href={confirmation.event.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-navy underline break-all"
            >
              <Video className="h-4 w-4 shrink-0" />
              {confirmation.event.meetingLink}
            </a>
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href={confirmation.calendarLinks.google}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-hover"
          >
            <Calendar className="h-4 w-4" />
            Add to Google Calendar
          </a>
          <a
            href={confirmation.calendarLinks.outlook}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            Add to Outlook
          </a>
        </div>

        <p className="mt-5 text-xs text-slate-500">
          {confirmation.emailDeliveryStatus === 'SENT'
            ? 'A confirmation email with your calendar invite has been sent.'
            : 'Please save your calendar link above now (automated confirmation email is currently disabled on this server).'}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-5"
    >
      <div>
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-xl font-bold text-slate-900">
            Reserve your free spot
          </h3>
          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-200">
            Free
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-600">
          Register for {eventTitle}. Only essential details are collected.
        </p>
      </div>

      {errorMsg && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {errorMsg}
        </div>
      )}

      {/* Honeypot field for spam protection */}
      <div className="hidden" aria-hidden="true">
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="firstName">First name *</Label>
          <Input
            id="firstName"
            required
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="lastName">Last name *</Label>
          <Input
            id="lastName"
            required
            placeholder="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Email address *</Label>
        <Input
          id="email"
          type="email"
          required
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone / WhatsApp (optional)</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+234..."
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="companyName">Company (optional)</Label>
          <Input
            id="companyName"
            placeholder="Business or organisation"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="reg-timezone">Your timezone *</Label>
        <select
          id="reg-timezone"
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
        >
          {eventTimezones.map((tz) => (
            <option key={tz.value} value={tz.value}>
              {tz.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-3 pt-1">
        <div className="flex items-start space-x-3">
          <Checkbox
            id="agreeToTerms"
            checked={agreeToTerms}
            onCheckedChange={(checked) => setAgreeToTerms(Boolean(checked))}
          />
          <Label
            htmlFor="agreeToTerms"
            className="text-xs leading-relaxed text-slate-600 cursor-pointer"
          >
            I agree to Entrehub Services using my registration details to manage my
            attendance for this event in line with the{' '}
            <Link href="/privacy" className="font-semibold text-navy underline">
              Privacy Policy
            </Link>
            . *
          </Label>
        </div>

        <div className="flex items-start space-x-3">
          <Checkbox
            id="subscribeUpdates"
            checked={subscribeUpdates}
            onCheckedChange={(checked) => setSubscribeUpdates(Boolean(checked))}
          />
          <Label
            htmlFor="subscribeUpdates"
            className="text-xs leading-relaxed text-slate-600 cursor-pointer"
          >
            Send me occasional updates about future Entrehub Services events (optional).
          </Label>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-11 rounded-xl bg-navy hover:bg-navy-hover text-white font-semibold"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          'Complete Free Registration'
        )}
      </Button>
    </form>
  );
}
