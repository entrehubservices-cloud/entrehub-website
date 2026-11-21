'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Calendar,
  Users,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Loader2,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Download,
  ExternalLink,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import WebinarForm, { type AdminWebinarRecord } from '@/components/admin/WebinarForm';
import { DeleteConfirmationModal } from '@/components/admin/DeleteConfirmationModal';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface WebinarRegistration {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  jobTitle?: string;
  companyName?: string;
  country: string;
  state?: string;
  city?: string;
  industry: string;
  timezone?: string;
  howDidYouHear?: string;
  topicsOfInterest?: string[];
  subscribeUpdates?: boolean;
  emailDeliveryStatus?: string;
  createdAt: string;
}

interface Webinar extends AdminWebinarRecord {
  id: string;
  slug?: string | null;
  scheduledAt: string;
  googleCalendarEventId?: string | null;
  googleCalendarHtmlLink?: string | null;
  googleCalendarLastError?: string | null;
  registrations?: WebinarRegistration[];
  _count?: {
    registrations: number;
  };
}

interface IntegrationSummary {
  googleCalendar: {
    configured: boolean;
    missingEnvVars: string[];
    calendarId: string;
  };
  email: {
    configured: boolean;
    missingEnvVars: string[];
    senderAddress: string | null;
    reason?: string;
  };
}

export default function WebinarManagementPage() {
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [integrations, setIntegrations] = useState<IntegrationSummary | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedWebinar, setSelectedWebinar] = useState<Webinar | null>(null);
  const [isRegistrantsVisible, setIsRegistrantsVisible] = useState(false);
  const [
    selectedWebinarWithRegistrants,
    setSelectedWebinarWithRegistrants,
  ] = useState<Webinar | null>(null);

  const fetchWebinars = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch('/api/admin/webinar', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setWebinars(data.webinars || []);
        setIntegrations(data.integrations || null);
      }
    } catch (error) {
      console.error('Error fetching webinars:', error);
      toast.error('Failed to load events');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWebinarDetails = async (id: string) => {
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch(`/api/admin/webinar/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedWebinarWithRegistrants(data.webinar);
        setIsRegistrantsVisible(true);
      }
    } catch (error) {
      console.error('Error fetching webinar details:', error);
      toast.error('Failed to load registrations');
    }
  };

  const handleCalendarSync = async (id: string) => {
    setSyncingId(id);
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch(`/api/admin/webinar/${id}/calendar-sync`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        toast.success('Google Calendar event & Meet link synced');
        fetchWebinars();
      } else {
        toast.error(data.error || 'Google Calendar sync failed');
        fetchWebinars();
      }
    } catch {
      toast.error('Unable to reach Google Calendar sync endpoint');
    } finally {
      setSyncingId(null);
    }
  };

  useEffect(() => {
    fetchWebinars();
  }, []);

  const handleDelete = async () => {
    if (!selectedWebinar) return;
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch(`/api/admin/webinar/${selectedWebinar.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success('Event deleted');
        fetchWebinars();
      }
    } catch (error) {
      console.error('Error deleting webinar:', error);
      toast.error('Failed to delete event');
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const exportRegistrantsCsv = (webinar: Webinar) => {
    const registrations = webinar.registrations || [];
    if (registrations.length === 0) return;

    const escapeCsv = (val: string | boolean | undefined | null) => {
      const str = val === undefined || val === null ? '' : String(val);
      return `"${str.replace(/"/g, '""')}"`;
    };

    const headers = [
      'First Name',
      'Last Name',
      'Email',
      'Phone',
      'Job Title',
      'Company',
      'Country',
      'State',
      'City',
      'Industry',
      'Timezone',
      'Topics of Interest',
      'How Did You Hear',
      'Subscribed to Updates',
      'Email Status',
      'Registered At',
    ];

    const rows = registrations.map((reg) =>
      [
        reg.firstName,
        reg.lastName,
        reg.email,
        reg.phone,
        reg.jobTitle,
        reg.companyName,
        reg.country,
        reg.state,
        reg.city,
        reg.industry,
        reg.timezone,
        reg.topicsOfInterest?.join('; '),
        reg.howDidYouHear,
        reg.subscribeUpdates ? 'Yes' : 'No',
        reg.emailDeliveryStatus || 'NOT_CONFIGURED',
        reg.createdAt,
      ]
        .map(escapeCsv)
        .join(',')
    );

    const csvContent = [headers.map(escapeCsv).join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const slug = webinar.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    link.href = url;
    link.download = `${slug || 'event'}-registrants.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-navy" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Events &amp; Webinars
          </h1>
          <p className="text-gray-500 mt-1">
            Create free events, manage Google Meet links, and export registrants.
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedWebinar(null);
            setIsFormOpen(true);
          }}
          className="bg-navy hover:bg-navy-hover text-white gap-2 h-11 px-6 rounded-xl"
        >
          <Plus className="w-4 h-4" />
          New Event
        </Button>
      </div>

      {integrations && (
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm">
            <div className="flex items-center gap-2 font-semibold text-slate-900">
              {integrations.googleCalendar.configured ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-600" />
              )}
              Google Calendar &amp; Meet API
            </div>
            <p className="mt-1 text-xs text-slate-600">
              {integrations.googleCalendar.configured
                ? `Configured (Calendar: ${integrations.googleCalendar.calendarId})`
                : `Not configured. Missing server env vars: ${integrations.googleCalendar.missingEnvVars.join(', ')}`}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm">
            <div className="flex items-center gap-2 font-semibold text-slate-900">
              {integrations.email.configured ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-600" />
              )}
              Registration Confirmation Email
            </div>
            <p className="mt-1 text-xs text-slate-600">
              {integrations.email.configured
                ? `Active from ${integrations.email.senderAddress}`
                : integrations.email.reason}
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {webinars.map((webinar) => {
          const isPublished =
            webinar.status === 'PUBLISHED' || webinar.isActive;
          const regCount = webinar._count?.registrations || 0;
          const capacityLabel = webinar.capacity
            ? `${regCount} / ${webinar.capacity} registered`
            : `${regCount} registered`;

          return (
            <div
              key={webinar.id}
              className={`bg-white rounded-2xl border ${
                isPublished ? 'border-navy/25 shadow-sm' : 'border-gray-100'
              } p-6 transition-all hover:border-navy/25`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="text-lg font-bold text-gray-900">
                      {webinar.title}
                    </h3>
                    {isPublished ? (
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold border border-green-100">
                        <CheckCircle2 className="w-3 h-3" />
                        PUBLISHED
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-50 text-gray-600 text-xs font-bold border border-gray-200">
                        <XCircle className="w-3 h-3" />
                        DRAFT
                      </span>
                    )}
                    <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-200">
                      Free
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                      {webinar.category || 'Webinar'} ·{' '}
                      {webinar.format || 'ONLINE'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-navy" />
                      {format(new Date(webinar.scheduledAt), 'PPP p')} (
                      {webinar.timezone || 'Africa/Lagos'})
                    </span>
                    <button
                      onClick={() => fetchWebinarDetails(webinar.id)}
                      className="flex items-center gap-1.5 hover:text-navy transition-colors"
                    >
                      <Users className="w-4 h-4 text-navy" />
                      {capacityLabel}
                    </button>
                  </div>
                  {webinar.googleCalendarLastError && (
                    <p className="text-xs text-amber-700">
                      Calendar sync note: {webinar.googleCalendarLastError}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {isPublished && (
                    <a
                      href={`/events/${webinar.slug || webinar.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-10 items-center gap-1.5 rounded-md border border-gray-200 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      View
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCalendarSync(webinar.id)}
                    disabled={syncingId === webinar.id}
                    className="gap-1.5 h-10 px-3 border-gray-200"
                  >
                    {syncingId === webinar.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <RefreshCw className="w-3.5 h-3.5" />
                    )}
                    {webinar.googleCalendarEventId ? 'Sync Meet' : 'Create Meet'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchWebinarDetails(webinar.id)}
                    className="gap-2 h-10 px-4 border-gray-200"
                  >
                    Registrants
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Edit event"
                    onClick={() => {
                      setSelectedWebinar(webinar);
                      setIsFormOpen(true);
                    }}
                    className="h-10 w-10 text-gray-600 hover:text-navy hover:bg-navy-tint border-gray-200"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Delete event"
                    onClick={() => {
                      setSelectedWebinar(webinar);
                      setIsDeleteModalOpen(true);
                    }}
                    className="h-10 w-10 text-gray-600 hover:text-red-600 hover:bg-red-50 border-gray-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}

        {webinars.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
            <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">
              No events scheduled yet
            </h3>
            <p className="text-gray-500">
              Create your first webinar or event as a draft, preview it, then publish.
            </p>
          </div>
        )}
      </div>

      {/* Registrants Drawer */}
      <DialogPrimitive.Root
        open={isRegistrantsVisible && !!selectedWebinarWithRegistrants}
        onOpenChange={setIsRegistrantsVisible}
      >
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-[60] bg-navy-deep/50 backdrop-blur-sm" />
          <DialogPrimitive.Content
            aria-describedby={undefined}
            className="fixed inset-y-0 right-0 z-[60] flex h-full w-full max-w-3xl flex-col bg-slate-50 shadow-2xl focus:outline-none animate-in slide-in-from-right duration-300"
          >
            {selectedWebinarWithRegistrants && (
              <>
                <div className="bg-white border-b border-gray-100 p-6 flex items-center justify-between gap-4 sticky top-0 z-10">
                  <div>
                    <DialogPrimitive.Title className="text-xl font-bold text-gray-900">
                      Event Registrations (
                      {selectedWebinarWithRegistrants.registrations?.length || 0}
                      {selectedWebinarWithRegistrants.capacity
                        ? ` / ${selectedWebinarWithRegistrants.capacity}`
                        : ''}
                      )
                    </DialogPrimitive.Title>
                    <p className="text-sm text-gray-500">
                      {selectedWebinarWithRegistrants.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        exportRegistrantsCsv(selectedWebinarWithRegistrants)
                      }
                      disabled={
                        !selectedWebinarWithRegistrants.registrations?.length
                      }
                      className="gap-2 h-10 px-4 border-gray-200"
                    >
                      <Download className="w-4 h-4" />
                      Export CSV
                    </Button>
                    <DialogPrimitive.Close asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Close registrations panel"
                        className="h-11 w-11"
                      >
                        <ChevronRight className="w-6 h-6" aria-hidden="true" />
                      </Button>
                    </DialogPrimitive.Close>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {selectedWebinarWithRegistrants.registrations?.map((reg) => (
                    <div
                      key={reg.id}
                      className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-navy-tint flex items-center justify-center text-navy font-bold text-lg">
                            {reg.firstName[0]}
                            {reg.lastName[0]}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">
                              {reg.firstName} {reg.lastName}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {format(new Date(reg.createdAt), 'MMM d, yyyy')}
                            </p>
                          </div>
                        </div>
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                          Email: {reg.emailDeliveryStatus || 'NOT_CONFIGURED'}
                        </span>
                      </div>

                      <div className="grid md:grid-cols-2 gap-y-3 gap-x-6 pt-2">
                        <div className="flex items-center gap-2.5 text-sm text-gray-600">
                          <Mail className="w-4 h-4 text-navy" />
                          {reg.email}
                        </div>
                        {reg.phone && (
                          <div className="flex items-center gap-2.5 text-sm text-gray-600">
                            <Phone className="w-4 h-4 text-green-500" />
                            {reg.phone}
                          </div>
                        )}
                        <div className="flex items-center gap-2.5 text-sm text-gray-600">
                          <Briefcase className="w-4 h-4 text-orange-500" />
                          {reg.jobTitle || 'N/A'} @ {reg.companyName || 'N/A'}
                        </div>
                        <div className="flex items-center gap-2.5 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 text-red-500" />
                          {reg.city ? `${reg.city}, ` : ''}
                          {reg.state ? `${reg.state}, ` : ''}
                          {reg.country}
                        </div>
                      </div>
                    </div>
                  ))}

                  {selectedWebinarWithRegistrants.registrations?.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                      <p className="text-gray-500">
                        No registrations for this event yet.
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>

      <WebinarForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={fetchWebinars}
        webinar={selectedWebinar}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onConfirm={handleDelete}
        title="Delete Event"
        description={`Are you sure you want to delete "${selectedWebinar?.title}"? This will also remove all associated registrations.`}
        itemName={selectedWebinar?.title || 'this event'}
      />
    </div>
  );
}
