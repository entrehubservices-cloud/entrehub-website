'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Loader2,
  Calendar as CalendarIcon,
  Link as LinkIcon,
  MapPin,
  User,
  Eye,
  Edit3,
  Tag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
  eventCategories,
  eventFormats,
  eventTimezones,
  slugifyEventTitle,
} from '@/lib/validations/webinar';

export interface AdminWebinarRecord {
  id?: string;
  slug?: string | null;
  title: string;
  shortSummary?: string | null;
  description?: string | null;
  category?: string;
  coverImage?: string | null;
  scheduledAt: string | Date;
  endsAt?: string | Date | null;
  timezone?: string;
  format?: string;
  meetingLink?: string | null;
  location?: string | null;
  speakerName?: string | null;
  speakerTitle?: string | null;
  speakerBio?: string | null;
  capacity?: number | null;
  registrationClosesAt?: string | Date | null;
  status?: string;
  isActive: boolean;
  isFree?: boolean;
  remindersEnabled?: boolean;
}

interface WebinarFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  webinar: AdminWebinarRecord | null;
}

function toLocalDateTimeInput(value?: string | Date | null): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
}

export default function WebinarForm({
  isOpen,
  onClose,
  onSave,
  webinar,
}: WebinarFormProps) {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [slugTouched, setSlugTouched] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState<string>('Webinar');
  const [shortSummary, setShortSummary] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [endsAt, setEndsAt] = useState('');
  const [timezone, setTimezone] = useState('Africa/Lagos');
  const [format, setFormat] = useState<'ONLINE' | 'IN_PERSON' | 'HYBRID'>('ONLINE');
  const [meetingLink, setMeetingLink] = useState('');
  const [location, setLocation] = useState('');
  const [speakerName, setSpeakerName] = useState('');
  const [speakerTitle, setSpeakerTitle] = useState('');
  const [speakerBio, setSpeakerBio] = useState('');
  const [capacity, setCapacity] = useState('');
  const [registrationClosesAt, setRegistrationClosesAt] = useState('');
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED'>('DRAFT');
  const [remindersEnabled, setRemindersEnabled] = useState(false);

  useEffect(() => {
    setActiveTab('edit');
    setErrorMsg(null);
    if (webinar) {
      setTitle(webinar.title || '');
      setSlug(webinar.slug || '');
      setSlugTouched(Boolean(webinar.slug));
      setCategory(webinar.category || 'Webinar');
      setShortSummary(webinar.shortSummary || '');
      setDescription(webinar.description || '');
      setCoverImage(webinar.coverImage || '');
      setScheduledAt(toLocalDateTimeInput(webinar.scheduledAt));
      setEndsAt(toLocalDateTimeInput(webinar.endsAt));
      setTimezone(webinar.timezone || 'Africa/Lagos');
      setFormat(
        (webinar.format as 'ONLINE' | 'IN_PERSON' | 'HYBRID') || 'ONLINE'
      );
      setMeetingLink(webinar.meetingLink || '');
      setLocation(webinar.location || '');
      setSpeakerName(webinar.speakerName || '');
      setSpeakerTitle(webinar.speakerTitle || '');
      setSpeakerBio(webinar.speakerBio || '');
      setCapacity(
        typeof webinar.capacity === 'number' ? String(webinar.capacity) : ''
      );
      setRegistrationClosesAt(
        toLocalDateTimeInput(webinar.registrationClosesAt)
      );
      setStatus(
        webinar.status === 'PUBLISHED' || webinar.isActive
          ? 'PUBLISHED'
          : 'DRAFT'
      );
      setRemindersEnabled(Boolean(webinar.remindersEnabled));
    } else {
      setTitle('');
      setSlug('');
      setSlugTouched(false);
      setCategory('Webinar');
      setShortSummary('');
      setDescription('');
      setCoverImage('');
      setScheduledAt('');
      setEndsAt('');
      setTimezone('Africa/Lagos');
      setFormat('ONLINE');
      setMeetingLink('');
      setLocation('');
      setSpeakerName('');
      setSpeakerTitle('');
      setSpeakerBio('');
      setCapacity('');
      setRegistrationClosesAt('');
      setStatus('DRAFT');
      setRemindersEnabled(false);
    }
  }, [webinar, isOpen]);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slugTouched) {
      setSlug(slugifyEventTitle(value));
    }
  };

  const validateBeforeSubmit = (): string | null => {
    if (title.trim().length < 3) {
      return 'Event title must be at least 3 characters.';
    }
    if (!scheduledAt) {
      return 'Start date and time are required.';
    }
    const start = new Date(scheduledAt);
    if (Number.isNaN(start.getTime())) {
      return 'Start date and time are invalid.';
    }
    const end = endsAt
      ? new Date(endsAt)
      : new Date(start.getTime() + 60 * 60 * 1000);
    if (Number.isNaN(end.getTime()) || end <= start) {
      return 'End date and time must be after the start date and time.';
    }
    if (registrationClosesAt) {
      const closes = new Date(registrationClosesAt);
      if (Number.isNaN(closes.getTime()) || closes > end) {
        return 'Registration closing time cannot be after the event ends.';
      }
    }
    if (capacity && (!Number.isInteger(Number(capacity)) || Number(capacity) < 1)) {
      return 'Capacity must be a positive whole number.';
    }
    if (status === 'PUBLISHED') {
      if (!shortSummary.trim() && !description.trim()) {
        return 'Add a short summary or full description before publishing.';
      }
      if (format === 'IN_PERSON' && !location.trim()) {
        return 'In-person events require a location before publishing.';
      }
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateBeforeSubmit();
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    setErrorMsg(null);
    setIsSaving(true);
    const token = localStorage.getItem('admin_token');

    try {
      const url = webinar?.id
        ? `/api/admin/webinar/${webinar.id}`
        : '/api/admin/webinar';
      const method = webinar?.id ? 'PUT' : 'POST';

      const payload = {
        title: title.trim(),
        slug: slug.trim() || slugifyEventTitle(title),
        shortSummary: shortSummary.trim(),
        description: description.trim(),
        category,
        coverImage: coverImage.trim(),
        scheduledAt: new Date(scheduledAt).toISOString(),
        endsAt: endsAt ? new Date(endsAt).toISOString() : null,
        timezone,
        format,
        meetingLink: meetingLink.trim(),
        location: location.trim(),
        speakerName: speakerName.trim(),
        speakerTitle: speakerTitle.trim(),
        speakerBio: speakerBio.trim(),
        capacity: capacity ? Number(capacity) : null,
        registrationClosesAt: registrationClosesAt
          ? new Date(registrationClosesAt).toISOString()
          : null,
        status,
        isActive: status === 'PUBLISHED',
        isFree: true,
        remindersEnabled,
      };

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        onSave();
        onClose();
      } else {
        setErrorMsg(
          data.details?.[0]?.message || data.error || 'Failed to save event'
        );
      }
    } catch (error) {
      console.error('Error saving webinar:', error);
      setErrorMsg('An error occurred while saving the event');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[680px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex flex-wrap items-center justify-between gap-3 pr-6">
            <DialogTitle className="text-xl font-bold text-slate-900">
              {webinar ? 'Edit Event / Webinar' : 'Create Event / Webinar'}
            </DialogTitle>
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
              <button
                type="button"
                onClick={() => setActiveTab('edit')}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  activeTab === 'edit'
                    ? 'bg-white text-navy shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Edit3 className="h-3.5 w-3.5" />
                Edit
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  activeTab === 'preview'
                    ? 'bg-white text-navy shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Eye className="h-3.5 w-3.5" />
                Preview
              </button>
            </div>
          </div>
        </DialogHeader>

        {activeTab === 'preview' ? (
          <div className="space-y-4 py-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              {coverImage && (
                <div className="mb-4 overflow-hidden rounded-xl border border-slate-100 bg-slate-100">
                  <img
                    src={coverImage}
                    alt={title || 'Event cover preview'}
                    className="h-48 w-full object-cover"
                  />
                </div>
              )}
              <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-semibold">
                <span className="rounded-full bg-navy-tint px-3 py-1 text-navy">
                  {category}
                </span>
                <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-800 ring-1 ring-amber-200">
                  Free
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                  {format === 'ONLINE'
                    ? 'Online (Google Meet)'
                    : format === 'IN_PERSON'
                      ? 'In-person'
                      : 'Hybrid'}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                  {status}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">
                {title || 'Untitled Event'}
              </h3>
              <p className="mt-2 text-sm font-medium text-slate-600">
                {scheduledAt
                  ? `${new Date(scheduledAt).toLocaleString()} (${timezone})`
                  : 'Date & time not set'}
                {capacity ? ` · Capacity: ${capacity} seats` : ' · Unlimited seats'}
              </p>
              {shortSummary && (
                <p className="mt-3 text-base text-slate-700">{shortSummary}</p>
              )}
              {description && (
                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-600">
                  {description}
                </p>
              )}
              {speakerName && (
                <div className="mt-4 rounded-xl bg-slate-50 p-4 border border-slate-100">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Speaker
                  </p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {speakerName}
                    {speakerTitle ? ` — ${speakerTitle}` : ''}
                  </p>
                  {speakerBio && (
                    <p className="mt-1 text-sm text-slate-600">{speakerBio}</p>
                  )}
                </div>
              )}
            </div>
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setActiveTab('edit')}
              >
                Back to editing
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 py-3">
            {errorMsg && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMsg}
              </div>
            )}

            <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50/70 px-4 py-2.5 text-sm">
              <span className="font-medium text-slate-800">
                Admission Price: <strong className="text-navy">Free</strong>
              </span>
              <span className="text-xs text-slate-600">
                Paid ticketing is disabled
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  required
                  placeholder="e.g., How Small Businesses Turn Their Website Into an Enquiry Channel"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  placeholder="auto-generated-from-title"
                  value={slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'));
                  }}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="category">Category *</Label>
                <div className="relative">
                  <Tag className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm"
                  >
                    {eventCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="shortSummary">Short Summary</Label>
                <Input
                  id="shortSummary"
                  maxLength={320}
                  placeholder="1–2 sentence summary shown on event cards"
                  value={shortSummary}
                  onChange={(e) => setShortSummary(e.target.value)}
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="description">Full Description</Label>
                <Textarea
                  id="description"
                  rows={4}
                  placeholder="What attendees will learn, agenda highlights, and who should attend..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="coverImage">Cover Image URL (optional)</Label>
                <Input
                  id="coverImage"
                  placeholder="https://... or /images/..."
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="scheduledAt">Start Date &amp; Time *</Label>
                <div className="relative">
                  <CalendarIcon className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="scheduledAt"
                    type="datetime-local"
                    required
                    className="pl-9"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="endsAt">End Date &amp; Time</Label>
                <Input
                  id="endsAt"
                  type="datetime-local"
                  value={endsAt}
                  onChange={(e) => setEndsAt(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="timezone">Timezone *</Label>
                <select
                  id="timezone"
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
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="format">Event Format *</Label>
                <select
                  id="format"
                  value={format}
                  onChange={(e) =>
                    setFormat(
                      e.target.value as (typeof eventFormats)[number]
                    )
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="ONLINE">Online (Google Meet)</option>
                  <option value="IN_PERSON">In-person</option>
                  <option value="HYBRID">Hybrid (Online + In-person)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="meetingLink">
                  Google Meet / Join Link (optional)
                </Label>
                <div className="relative">
                  <LinkIcon className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="meetingLink"
                    type="url"
                    placeholder="https://meet.google.com/xxx-xxxx-xxx"
                    className="pl-9"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                  />
                </div>
              </div>

              {(format === 'IN_PERSON' || format === 'HYBRID') && (
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="location">
                    Venue / Physical Location {format === 'IN_PERSON' ? '*' : ''}
                  </Label>
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="location"
                      placeholder="Full venue address"
                      className="pl-9"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <User className="h-4 w-4 text-navy" />
                Speaker Details (optional — entered by admin only)
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label htmlFor="speakerName">Speaker Name</Label>
                  <Input
                    id="speakerName"
                    placeholder="e.g., Gabriel Adinga"
                    value={speakerName}
                    onChange={(e) => setSpeakerName(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="speakerTitle">Speaker Role / Title</Label>
                  <Input
                    id="speakerTitle"
                    placeholder="e.g., ENTREHUB SERVICES LTD"
                    value={speakerTitle}
                    onChange={(e) => setSpeakerTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <Label htmlFor="speakerBio">Speaker Bio</Label>
                  <Textarea
                    id="speakerBio"
                    rows={2}
                    placeholder="Approved short bio..."
                    value={speakerBio}
                    onChange={(e) => setSpeakerBio(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="capacity">Capacity (optional)</Label>
                <Input
                  id="capacity"
                  type="number"
                  min={1}
                  max={10000}
                  placeholder="Unlimited"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="registrationClosesAt">
                  Registration Closes At
                </Label>
                <Input
                  id="registrationClosesAt"
                  type="datetime-local"
                  value={registrationClosesAt}
                  onChange={(e) => setRegistrationClosesAt(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="status">Publication Status *</Label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as 'DRAFT' | 'PUBLISHED')
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm font-medium"
                >
                  <option value="DRAFT">Draft (hidden from public)</option>
                  <option value="PUBLISHED">Published (live on /events)</option>
                </select>
              </div>
            </div>

            <div className="flex items-start space-x-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <Checkbox
                id="remindersEnabled"
                checked={remindersEnabled}
                onCheckedChange={(checked) =>
                  setRemindersEnabled(Boolean(checked))
                }
              />
              <div className="grid gap-0.5 leading-none">
                <Label
                  htmlFor="remindersEnabled"
                  className="text-sm font-semibold text-slate-900 cursor-pointer"
                >
                  Enable optional reminder emails (for future scheduler)
                </Label>
                <p className="text-xs text-slate-500">
                  Off by default. No reminder emails are sent unless explicitly enabled and email is configured.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-navy hover:bg-navy-hover text-white"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : webinar ? (
                  'Save Changes'
                ) : (
                  'Create Event'
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
