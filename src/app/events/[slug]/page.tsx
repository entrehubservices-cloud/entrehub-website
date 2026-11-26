import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Clock, MapPin, Users, Video, User } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { toPublicEvent } from "@/lib/events";
import { formatDateInTimeZone } from "@/lib/email";
import { jsonLd, siteUrl } from "@/lib/seo";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import EventRegistrationForm from "@/components/events/event-registration-form";

export const dynamic = "force-dynamic";

async function getPublishedEvent(slug: string) {
  return prisma.webinar.findFirst({
    where: {
      AND: [
        { OR: [{ slug }, { id: slug }] },
        { OR: [{ status: "PUBLISHED" }, { isActive: true }] },
      ],
    },
    include: {
      _count: { select: { registrations: true } },
    },
  });
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const record = await getPublishedEvent(slug);
  if (!record) {
    return { title: "Event Not Found" };
  }
  const description =
    record.shortSummary ||
    record.description?.slice(0, 160) ||
    "Free event hosted by ENTREHUB SERVICES LTD.";
  return {
    title: record.title,
    description,
    alternates: { canonical: `/events/${record.slug || record.id}` },
    openGraph: {
      type: "website",
      url: `/events/${record.slug || record.id}`,
      title: record.title,
      description,
    },
  };
}

export default async function EventDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const record = await getPublishedEvent(slug);

  if (!record) {
    notFound();
  }

  const event = toPublicEvent(record, new Date());
  const formattedStart = formatDateInTimeZone(
    new Date(event.scheduledAt),
    event.timezone
  );
  const formattedEnd = formatDateInTimeZone(
    new Date(event.endsAt),
    event.timezone
  );
  const formattedDeadline = event.registrationClosesAt
    ? formatDateInTimeZone(
        new Date(event.registrationClosesAt),
        event.timezone
      )
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "Event",
            name: event.title,
            startDate: event.scheduledAt,
            endDate: event.endsAt,
            eventAttendanceMode:
              event.format === "IN_PERSON"
                ? "https://schema.org/OfflineEventAttendanceMode"
                : event.format === "HYBRID"
                  ? "https://schema.org/MixedEventAttendanceMode"
                  : "https://schema.org/OnlineEventAttendanceMode",
            isAccessibleForFree: true,
            organizer: {
              "@type": "Organization",
              name: "ENTREHUB SERVICES LTD",
              url: siteUrl,
            },
          }),
        }}
      />
      <Navigation />

      <main
        id="main-content"
        tabIndex={-1}
        className="min-h-screen bg-slate-50 pt-20 focus:outline-none"
      >
        <div className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
            <nav aria-label="Breadcrumb" className="mb-5 text-sm text-slate-600">
              <Link href="/" className="underline">
                Home
              </Link>{" "}
              /{" "}
              <Link href="/events" className="underline">
                Events
              </Link>{" "}
              / <span className="text-slate-900">{event.title}</span>
            </nav>

            <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-semibold">
              <span className="rounded-full bg-navy-tint px-3 py-1 text-navy">
                {event.category}
              </span>
              <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-800 ring-1 ring-amber-200">
                Free
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                {event.format === "ONLINE"
                  ? "Online (Google Meet)"
                  : event.format === "IN_PERSON"
                    ? "In-person"
                    : "Hybrid"}
              </span>
            </div>

            <h1 className="max-w-4xl text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              {event.title}
            </h1>
            {event.shortSummary && (
              <p className="mt-4 max-w-3xl text-lg text-slate-600">
                {event.shortSummary}
              </p>
            )}
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="space-y-8 lg:col-span-7">
              {event.coverImage && (
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
                  <img
                    src={event.coverImage}
                    alt={event.title}
                    className="h-auto w-full object-cover"
                  />
                </div>
              )}

              <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 space-y-4">
                <h2 className="text-xl font-bold text-slate-900">
                  Event details
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 text-sm text-slate-700">
                  <div className="flex items-start gap-3">
                    <Calendar className="mt-0.5 h-5 w-5 shrink-0 text-navy" />
                    <div>
                      <p className="font-semibold text-slate-900">Starts</p>
                      <p>
                        {formattedStart} ({event.timezone})
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="mt-0.5 h-5 w-5 shrink-0 text-navy" />
                    <div>
                      <p className="font-semibold text-slate-900">Ends</p>
                      <p>
                        {formattedEnd} ({event.timezone})
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    {event.format === "IN_PERSON" ? (
                      <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-navy" />
                    ) : (
                      <Video className="mt-0.5 h-5 w-5 shrink-0 text-navy" />
                    )}
                    <div>
                      <p className="font-semibold text-slate-900">Venue</p>
                      <p>
                        {event.format === "ONLINE"
                          ? "Online via Google Meet (link provided upon registration)"
                          : event.format === "IN_PERSON"
                            ? event.location || "Venue details sent on registration"
                            : `${event.location || "In-person"} + Google Meet`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="mt-0.5 h-5 w-5 shrink-0 text-navy" />
                    <div>
                      <p className="font-semibold text-slate-900">
                        Capacity &amp; Admission
                      </p>
                      <p>
                        Free ·{" "}
                        {event.capacity === null
                          ? "Open registration"
                          : event.spotsRemaining === 0
                            ? "Full"
                            : `${event.spotsRemaining} of ${event.capacity} seats available`}
                      </p>
                    </div>
                  </div>
                </div>
                {formattedDeadline && (
                  <p className="border-t border-slate-100 pt-4 text-xs text-slate-500">
                    Registration closes: {formattedDeadline} ({event.timezone})
                  </p>
                )}
              </section>

              {event.description && (
                <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 space-y-3">
                  <h2 className="text-xl font-bold text-slate-900">
                    About this session
                  </h2>
                  <p className="whitespace-pre-line text-base leading-relaxed text-slate-600">
                    {event.description}
                  </p>
                </section>
              )}

              {event.speakerName && (
                <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-navy">
                    <User className="h-4 w-4" />
                    Speaker
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {event.speakerName}
                  </h2>
                  {event.speakerTitle && (
                    <p className="text-sm font-medium text-slate-600">
                      {event.speakerTitle}
                    </p>
                  )}
                  {event.speakerBio && (
                    <p className="text-sm leading-relaxed text-slate-600">
                      {event.speakerBio}
                    </p>
                  )}
                </section>
              )}
            </div>

            <div className="lg:col-span-5">
              <div className="sticky top-28">
                {event.isOpen ? (
                  <EventRegistrationForm
                    eventId={event.id}
                    eventTitle={event.title}
                    defaultTimezone={event.timezone}
                  />
                ) : (
                  <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 text-center space-y-3">
                    <h3 className="text-xl font-bold text-slate-900">
                      {event.isEnded
                        ? "This event has ended"
                        : event.isFull
                          ? "This event is full"
                          : "Registration is closed"}
                    </h3>
                    <p className="text-sm text-slate-600">
                      Explore other upcoming sessions on our{" "}
                      <Link
                        href="/events"
                        className="font-semibold text-navy underline"
                      >
                        events page
                      </Link>
                      .
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
