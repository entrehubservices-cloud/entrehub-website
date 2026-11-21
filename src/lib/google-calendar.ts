export interface GoogleCalendarIntegrationStatus {
  configured: boolean;
  missingEnvVars: string[];
  calendarId: string;
}

export function getGoogleCalendarIntegrationStatus(): GoogleCalendarIntegrationStatus {
  const missingEnvVars: string[] = [];
  if (!process.env.GOOGLE_OAUTH_CLIENT_ID?.trim()) {
    missingEnvVars.push("GOOGLE_OAUTH_CLIENT_ID");
  }
  if (!process.env.GOOGLE_OAUTH_CLIENT_SECRET?.trim()) {
    missingEnvVars.push("GOOGLE_OAUTH_CLIENT_SECRET");
  }
  if (!process.env.GOOGLE_OAUTH_REFRESH_TOKEN?.trim()) {
    missingEnvVars.push("GOOGLE_OAUTH_REFRESH_TOKEN");
  }

  return {
    configured: missingEnvVars.length === 0,
    missingEnvVars,
    calendarId: process.env.GOOGLE_CALENDAR_ID?.trim() || "primary",
  };
}

export function buildGoogleMeetRequestId(webinarId: string): string {
  return `entrehub-webinar-${webinarId}`;
}

export interface CalendarSyncEventInput {
  id: string;
  title: string;
  description?: string | null;
  shortSummary?: string | null;
  scheduledAt: Date;
  endsAt?: Date | null;
  timezone: string;
  format: string;
  location?: string | null;
  googleCalendarEventId?: string | null;
  googleMeetRequestId?: string | null;
}

export type CalendarSyncResult =
  | {
      ok: true;
      eventId: string;
      htmlLink: string | null;
      meetingLink: string | null;
      requestId: string;
    }
  | {
      ok: false;
      configured: boolean;
      reason: "NOT_CONFIGURED" | "AUTH_ERROR" | "API_ERROR" | "MEET_UNAVAILABLE";
      message: string;
    };

async function fetchGoogleAccessToken(): Promise<
  { ok: true; accessToken: string } | { ok: false; message: string }
> {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET?.trim();
  const refreshToken = process.env.GOOGLE_OAUTH_REFRESH_TOKEN?.trim();

  if (!clientId || !clientSecret || !refreshToken) {
    return { ok: false, message: "Google OAuth credentials are not configured." };
  }

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  });

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!response.ok) {
    return {
      ok: false,
      message: `Google OAuth token refresh failed (${response.status}). Check OAuth client credentials and refresh token.`,
    };
  }

  const data = (await response.json()) as { access_token?: string };
  if (!data.access_token) {
    return { ok: false, message: "Google OAuth response did not include an access token." };
  }

  return { ok: true, accessToken: data.access_token };
}

export async function createOrUpdateWebinarCalendarEvent(
  event: CalendarSyncEventInput,
  fetchImpl: typeof fetch = fetch
): Promise<CalendarSyncResult> {
  const status = getGoogleCalendarIntegrationStatus();
  if (!status.configured) {
    return {
      ok: false,
      configured: false,
      reason: "NOT_CONFIGURED",
      message: `Google Calendar API is not configured. Missing: ${status.missingEnvVars.join(", ")}.`,
    };
  }

  const tokenResult = await fetchGoogleAccessToken();
  if (!tokenResult.ok) {
    return {
      ok: false,
      configured: true,
      reason: "AUTH_ERROR",
      message:
        "message" in tokenResult
          ? tokenResult.message
          : "Google OAuth token refresh failed.",
    };
  }

  const startDate = new Date(event.scheduledAt);
  const endDate =
    event.endsAt && new Date(event.endsAt) > startDate
      ? new Date(event.endsAt)
      : new Date(startDate.getTime() + 60 * 60 * 1000);

  const requestId = event.googleMeetRequestId || buildGoogleMeetRequestId(event.id);
  const wantsMeet = event.format === "ONLINE" || event.format === "HYBRID";

  const payload: Record<string, unknown> = {
    summary: event.title,
    description: event.description || event.shortSummary || undefined,
    location: event.location || (wantsMeet ? "Google Meet" : undefined),
    start: {
      dateTime: startDate.toISOString(),
      timeZone: event.timezone || "Africa/Lagos",
    },
    end: {
      dateTime: endDate.toISOString(),
      timeZone: event.timezone || "Africa/Lagos",
    },
  };

  if (wantsMeet && !event.googleCalendarEventId) {
    payload.conferenceData = {
      createRequest: {
        requestId,
        conferenceSolutionKey: { type: "hangoutsMeet" },
      },
    };
  }

  const baseUrl = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
    status.calendarId
  )}/events`;
  const url = event.googleCalendarEventId
    ? `${baseUrl}/${encodeURIComponent(event.googleCalendarEventId)}?conferenceDataVersion=1`
    : `${baseUrl}?conferenceDataVersion=1`;

  const response = await fetchImpl(url, {
    method: event.googleCalendarEventId ? "PATCH" : "POST",
    headers: {
      Authorization: `Bearer ${tokenResult.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    return {
      ok: false,
      configured: true,
      reason: response.status === 401 || response.status === 403 ? "AUTH_ERROR" : "API_ERROR",
      message: `Google Calendar API request failed (${response.status}). Verify Calendar API enablement and OAuth scopes.`,
    };
  }

  const created = (await response.json()) as {
    id?: string;
    htmlLink?: string;
    hangoutLink?: string;
    conferenceData?: {
      createRequest?: { status?: { statusCode?: string } };
      entryPoints?: Array<{ entryPointType?: string; uri?: string }>;
    };
  };

  if (!created.id) {
    return {
      ok: false,
      configured: true,
      reason: "API_ERROR",
      message: "Google Calendar API did not return an event ID.",
    };
  }

  const videoEntry = created.conferenceData?.entryPoints?.find(
    (entry) => entry.entryPointType === "video" && entry.uri
  );
  const meetingLink = created.hangoutLink || videoEntry?.uri || null;

  if (
    wantsMeet &&
    !event.googleCalendarEventId &&
    !meetingLink &&
    created.conferenceData?.createRequest?.status?.statusCode !== "success"
  ) {
    return {
      ok: false,
      configured: true,
      reason: "MEET_UNAVAILABLE",
      message:
        "Calendar event was created, but Google Meet link generation did not succeed. Check Google Workspace Meet permissions.",
    };
  }

  return {
    ok: true,
    eventId: created.id,
    htmlLink: created.htmlLink || null,
    meetingLink,
    requestId,
  };
}
