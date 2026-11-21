export interface EventCapacityState {
  isPublished: boolean;
  isEnded: boolean;
  isClosed: boolean;
  isFull: boolean;
  isOpen: boolean;
  spotsRemaining: number | null;
}

export function getEventCapacityState({
  status,
  isActive,
  scheduledAt,
  endsAt,
  registrationClosesAt,
  capacity,
  registrationCount,
  now = new Date(),
}: {
  status?: string | null;
  isActive?: boolean;
  scheduledAt: Date | string;
  endsAt?: Date | string | null;
  registrationClosesAt?: Date | string | null;
  capacity?: number | null;
  registrationCount: number;
  now?: Date;
}): EventCapacityState {
  const start = new Date(scheduledAt);
  const end = endsAt ? new Date(endsAt) : new Date(start.getTime() + 60 * 60 * 1000);
  const closes = registrationClosesAt ? new Date(registrationClosesAt) : null;

  const isPublished = status ? status === "PUBLISHED" : Boolean(isActive);
  const isEnded = end <= now;
  const isClosed = Boolean(closes && closes <= now);
  const spotsRemaining =
    typeof capacity === "number" && capacity > 0
      ? Math.max(0, capacity - registrationCount)
      : null;
  const isFull = spotsRemaining !== null && spotsRemaining <= 0;
  const isOpen = isPublished && !isEnded && !isClosed && !isFull;

  return {
    isPublished,
    isEnded,
    isClosed,
    isFull,
    isOpen,
    spotsRemaining,
  };
}

export interface PublicEventDTO {
  id: string;
  slug: string;
  title: string;
  shortSummary: string | null;
  description: string | null;
  category: string;
  coverImage: string | null;
  scheduledAt: string;
  endsAt: string;
  timezone: string;
  format: string;
  location: string | null;
  hasMeetingLink: boolean;
  speakerName: string | null;
  speakerTitle: string | null;
  speakerBio: string | null;
  capacity: number | null;
  registrationCount: number;
  spotsRemaining: number | null;
  registrationClosesAt: string | null;
  isFree: boolean;
  isOpen: boolean;
  isFull: boolean;
  isClosed: boolean;
  isEnded: boolean;
}

export function toPublicEvent(
  webinar: {
    id: string;
    slug?: string | null;
    title: string;
    shortSummary?: string | null;
    description?: string | null;
    category?: string;
    coverImage?: string | null;
    scheduledAt: Date;
    endsAt?: Date | null;
    timezone?: string;
    format?: string;
    meetingLink?: string | null;
    location?: string | null;
    speakerName?: string | null;
    speakerTitle?: string | null;
    speakerBio?: string | null;
    capacity?: number | null;
    registrationClosesAt?: Date | null;
    status?: string;
    isActive: boolean;
    isFree?: boolean;
    _count?: { registrations: number };
  },
  now = new Date()
): PublicEventDTO {
  const start = new Date(webinar.scheduledAt);
  const end = webinar.endsAt
    ? new Date(webinar.endsAt)
    : new Date(start.getTime() + 60 * 60 * 1000);
  const registrationCount = webinar._count?.registrations ?? 0;

  const state = getEventCapacityState({
    status: webinar.status,
    isActive: webinar.isActive,
    scheduledAt: start,
    endsAt: end,
    registrationClosesAt: webinar.registrationClosesAt,
    capacity: webinar.capacity,
    registrationCount,
    now,
  });

  return {
    id: webinar.id,
    slug: webinar.slug || webinar.id,
    title: webinar.title,
    shortSummary: webinar.shortSummary ?? null,
    description: webinar.description ?? null,
    category: webinar.category || "Webinar",
    coverImage: webinar.coverImage ?? null,
    scheduledAt: start.toISOString(),
    endsAt: end.toISOString(),
    timezone: webinar.timezone || "Africa/Lagos",
    format: webinar.format || "ONLINE",
    location: webinar.location ?? null,
    hasMeetingLink: Boolean(webinar.meetingLink),
    speakerName: webinar.speakerName ?? null,
    speakerTitle: webinar.speakerTitle ?? null,
    speakerBio: webinar.speakerBio ?? null,
    capacity: webinar.capacity ?? null,
    registrationCount,
    spotsRemaining: state.spotsRemaining,
    registrationClosesAt: webinar.registrationClosesAt
      ? new Date(webinar.registrationClosesAt).toISOString()
      : null,
    isFree: webinar.isFree ?? true,
    isOpen: state.isOpen,
    isFull: state.isFull,
    isClosed: state.isClosed,
    isEnded: state.isEnded,
  };
}
