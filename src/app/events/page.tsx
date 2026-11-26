import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, ArrowRight, MapPin, Video, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { toPublicEvent, type PublicEventDTO } from "@/lib/events";
import { formatDateInTimeZone } from "@/lib/email";
import { jsonLd, siteUrl } from "@/lib/seo";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Webinars & Events",
  description:
    "Free webinars, workshops, and live clinics from ENTREHUB SERVICES LTD on enterprise ICT, websites, e-commerce, SEO, and digital growth.",
  alternates: { canonical: "/events" },
  openGraph: {
    type: "website",
    url: "/events",
    title: "Webinars & Events | ENTREHUB SERVICES LTD",
    description:
      "Join free upcoming webinars and workshops hosted by ENTREHUB SERVICES LTD.",
  },
};

function EventCard({ event }: { event: PublicEventDTO }) {
  const formattedStart = formatDateInTimeZone(
    new Date(event.scheduledAt),
    event.timezone
  );

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      {event.coverImage && (
        <div className="aspect-[16/9] overflow-hidden bg-slate-100">
          <img
            src={event.coverImage}
            alt={event.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="rounded-full bg-navy-tint px-3 py-1 text-navy">
            {event.category}
          </span>
          <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-800 ring-1 ring-amber-200">
            Free
          </span>
          {event.isFull ? (
            <span className="rounded-full bg-red-50 px-3 py-1 text-red-700">
              Full
            </span>
          ) : event.isClosed ? (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
              Registration closed
            </span>
          ) : null}
        </div>

        <h3 className="text-xl font-bold leading-snug text-slate-900 group-hover:text-navy">
          <Link href={`/events/${event.slug}`}>{event.title}</Link>
        </h3>

        <div className="mt-3 space-y-1.5 text-sm text-slate-600">
          <p className="flex items-center gap-2">
            <Calendar className="h-4 w-4 shrink-0 text-navy" />
            <span>
              {formattedStart} ({event.timezone})
            </span>
          </p>
          <p className="flex items-center gap-2">
            {event.format === "IN_PERSON" ? (
              <MapPin className="h-4 w-4 shrink-0 text-navy" />
            ) : (
              <Video className="h-4 w-4 shrink-0 text-navy" />
            )}
            <span>
              {event.format === "ONLINE"
                ? "Online via Google Meet"
                : event.format === "IN_PERSON"
                  ? event.location || "In-person"
                  : `Hybrid · ${event.location || "Online + In-person"}`}
            </span>
          </p>
          {event.capacity !== null && (
            <p className="flex items-center gap-2">
              <Users className="h-4 w-4 shrink-0 text-navy" />
              <span>
                {event.spotsRemaining === 0
                  ? "No seats remaining"
                  : `${event.spotsRemaining} of ${event.capacity} seats remaining`}
              </span>
            </p>
          )}
        </div>

        {(event.shortSummary || event.description) && (
          <p className="mt-4 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">
            {event.shortSummary || event.description}
          </p>
        )}

        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
          <span className="text-xs font-medium text-slate-500">
            {event.speakerName ? `Hosted by ${event.speakerName}` : "ENTREHUB SERVICES LTD"}
          </span>
          <Link
            href={`/events/${event.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy hover:underline"
          >
            {event.isOpen ? "View & register" : "View details"}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default async function EventsPage() {
  const now = new Date();
  let publicEvents: PublicEventDTO[] = [];

  try {
    const records = await prisma.webinar.findMany({
      where: {
        OR: [{ status: "PUBLISHED" }, { isActive: true }],
      },
      orderBy: { scheduledAt: "asc" },
      include: {
        _count: { select: { registrations: true } },
      },
    });
    publicEvents = records.map((record) => toPublicEvent(record, now));
  } catch (error) {
    console.error("Failed to load events:", error);
  }

  const upcomingEvents = publicEvents.filter((e) => !e.isEnded);
  const pastEvents = publicEvents.filter((e) => e.isEnded).reverse();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: siteUrl + "/" },
              {
                "@type": "ListItem",
                position: 2,
                name: "Events",
                item: siteUrl + "/events",
              },
            ],
          }),
        }}
      />
      <Navigation />

      <main
        id="main-content"
        tabIndex={-1}
        className="min-h-screen bg-slate-50 pt-20 focus:outline-none"
      >
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-20">
            <nav aria-label="Breadcrumb" className="mb-5 text-sm">
              <Link href="/" className="underline">
                Home
              </Link>{" "}
              / Events
            </nav>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-navy">
              ENTREHUB Events &amp; Webinars
            </p>
            <h1 className="mb-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Practical sessions for <span className="text-navy">growing teams</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-600">
              Free live webinars and workshops on websites, e-commerce, search visibility, and digital operations.
            </p>
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16 space-y-16">
          <section aria-labelledby="upcoming-events-heading">
            <h2
              id="upcoming-events-heading"
              className="mb-6 text-2xl font-bold text-slate-900"
            >
              Upcoming events
            </h2>
            {upcomingEvents.length > 0 ? (
              <div className="grid gap-8 md:grid-cols-2">
                {upcomingEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
                <Calendar className="mx-auto mb-3 h-8 w-8 text-slate-400" />
                <h3 className="text-lg font-semibold text-slate-900">
                  No upcoming events scheduled right now
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Check back soon for new webinar dates, or explore our{" "}
                  <Link href="/blog" className="font-semibold text-navy underline">
                    blog articles
                  </Link>
                  .
                </p>
              </div>
            )}
          </section>

          {pastEvents.length > 0 && (
            <section aria-labelledby="past-events-heading">
              <h2
                id="past-events-heading"
                className="mb-6 text-xl font-bold text-slate-800"
              >
                Past events
              </h2>
              <div className="grid gap-8 md:grid-cols-2 opacity-90">
                {pastEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
