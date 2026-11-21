import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminRequest } from "@/lib/auth/admin-request";
import {
  buildGoogleMeetRequestId,
  createOrUpdateWebinarCalendarEvent,
} from "@/lib/google-calendar";

// POST /api/admin/webinar/[id]/calendar-sync - Idempotently create/update Google Calendar event & Meet link
export async function POST(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params;
  try {
    const auth = await requireAdminRequest(request);
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const webinar = await prisma.webinar.findUnique({ where: { id } });
    if (!webinar) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const requestId =
      webinar.googleMeetRequestId || buildGoogleMeetRequestId(webinar.id);
    if (!webinar.googleMeetRequestId) {
      await prisma.webinar.update({
        where: { id: webinar.id },
        data: { googleMeetRequestId: requestId },
      });
    }

    const syncResult = await createOrUpdateWebinarCalendarEvent({
      id: webinar.id,
      title: webinar.title,
      description: webinar.description,
      shortSummary: webinar.shortSummary,
      scheduledAt: webinar.scheduledAt,
      endsAt: webinar.endsAt,
      timezone: webinar.timezone,
      format: webinar.format,
      location: webinar.location,
      googleCalendarEventId: webinar.googleCalendarEventId,
      googleMeetRequestId: requestId,
    });

    if (!syncResult.ok) {
      const updated = await prisma.webinar.update({
        where: { id: webinar.id },
        data: {
          googleCalendarLastError: syncResult.message.slice(0, 500),
        },
      });
      return NextResponse.json(
        {
          ok: false,
          reason: syncResult.reason,
          error: syncResult.message,
          webinar: updated,
        },
        { status: syncResult.reason === "NOT_CONFIGURED" ? 503 : 502 }
      );
    }

    const updated = await prisma.webinar.update({
      where: { id: webinar.id },
      data: {
        googleCalendarEventId: syncResult.eventId,
        googleCalendarHtmlLink: syncResult.htmlLink,
        googleMeetRequestId: syncResult.requestId,
        meetingLink: syncResult.meetingLink || webinar.meetingLink,
        googleCalendarSyncedAt: new Date(),
        googleCalendarLastError: null,
      },
    });

    return NextResponse.json({
      ok: true,
      webinar: updated,
      meetingLink: updated.meetingLink,
      calendarHtmlLink: updated.googleCalendarHtmlLink,
    });
  } catch (error) {
    console.error("Error syncing webinar to Google Calendar:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
