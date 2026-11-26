import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { eventRegistrationSchema } from "@/lib/validations/webinar";
import { sendWebinarConfirmation } from "@/lib/email";
import { generateCalendarLinks } from "@/lib/calendar";
import { getEventCapacityState } from "@/lib/events";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const REGISTER_RATE_LIMIT = 10;
const REGISTER_WINDOW_MS = 15 * 60 * 1000;

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit({
      key: `event-register:${clientIp}`,
      limit: REGISTER_RATE_LIMIT,
      windowMs: REGISTER_WINDOW_MS,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many registration attempts. Please try again shortly." },
        {
          status: 429,
          headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
        }
      );
    }

    const body = await request.json();
    const validatedData = eventRegistrationSchema.parse(body);
    const webinarId =
      typeof body?.webinarId === "string" ? body.webinarId.trim() : "";

    if (!webinarId) {
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
      );
    }

    const webinar = await prisma.webinar.findUnique({
      where: { id: webinarId },
      include: { _count: { select: { registrations: true } } },
    });

    if (!webinar) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const capacityState = getEventCapacityState({
      status: webinar.status,
      isActive: webinar.isActive,
      scheduledAt: webinar.scheduledAt,
      endsAt: webinar.endsAt,
      registrationClosesAt: webinar.registrationClosesAt,
      capacity: webinar.capacity,
      registrationCount: webinar._count.registrations,
    });

    if (!capacityState.isPublished) {
      return NextResponse.json(
        { error: "This event is not open for public registration." },
        { status: 403 }
      );
    }
    if (capacityState.isEnded) {
      return NextResponse.json(
        { error: "This event has already ended." },
        { status: 409 }
      );
    }
    if (capacityState.isClosed) {
      return NextResponse.json(
        { error: "Registration for this event has closed." },
        { status: 409 }
      );
    }
    if (capacityState.isFull) {
      return NextResponse.json(
        { error: "This event has reached capacity." },
        { status: 409 }
      );
    }

    const existing = await prisma.webinarRegistration.findUnique({
      where: {
        webinarId_email: {
          webinarId: webinar.id,
          email: validatedData.email,
        },
      },
      select: { id: true },
    });

    if (existing) {
      return NextResponse.json(
        {
          error:
            "You are already registered for this event with this email address.",
        },
        { status: 409 }
      );
    }

    const registration = await prisma.webinarRegistration.create({
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        phone: validatedData.phone || null,
        jobTitle: validatedData.jobTitle || null,
        companyName: validatedData.companyName || null,
        country: validatedData.country || "Nigeria",
        state: validatedData.state || null,
        city: validatedData.city || null,
        industry: validatedData.industry || "Other",
        timezone: validatedData.timezone || webinar.timezone || "Africa/Lagos",
        howDidYouHear: validatedData.howDidYouHear || null,
        topicsOfInterest: validatedData.topicsOfInterest,
        agreeToTerms: validatedData.agreeToTerms,
        subscribeUpdates: Boolean(validatedData.subscribeUpdates),
        webinarId: webinar.id,
      },
    });

    const webinarDate = new Date(webinar.scheduledAt);
    const endDate = webinar.endsAt
      ? new Date(webinar.endsAt)
      : new Date(webinarDate.getTime() + 60 * 60 * 1000);

    const calendarDescription = [
      webinar.description ||
        webinar.shortSummary ||
        "Join us for a live session with ENTREHUB SERVICES LTD.",
      webinar.meetingLink ? `Google Meet link: ${webinar.meetingLink}` : null,
    ]
      .filter(Boolean)
      .join("\n\n");

    const calendarLinks = generateCalendarLinks({
      title: webinar.title,
      description: calendarDescription,
      location:
        webinar.meetingLink ||
        webinar.location ||
        "Google Meet (link to be sent via email)",
      startTime: webinarDate,
      endTime: endDate,
    });

    const emailResult = await sendWebinarConfirmation({
      webinarId: webinar.id,
      registrationId: registration.id,
      email: validatedData.email,
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      webinarTitle: webinar.title,
      scheduledAt: webinarDate,
      endsAt: endDate,
      eventTimezone: webinar.timezone || "Africa/Lagos",
      meetingLink: webinar.meetingLink,
      location: webinar.location,
      format: webinar.format,
      calendarLinks,
    });

    await prisma.webinarRegistration
      .update({
        where: { id: registration.id },
        data: {
          emailDeliveryStatus: emailResult.status,
          emailDeliveryError: emailResult.error ? emailResult.error.slice(0, 500) : null,
          emailSentAt: emailResult.status === "SENT" ? new Date() : null,
        },
      })
      .catch((updateError) => {
        console.error("Failed to record email delivery status", {
          registrationId: registration.id,
          error:
            updateError instanceof Error ? updateError.message : "Unknown error",
        });
      });

    return NextResponse.json(
      {
        message: "Registration successful!",
        id: registration.id,
        calendarLinks,
        emailDeliveryStatus: emailResult.status,
        event: {
          title: webinar.title,
          scheduledAt: webinarDate.toISOString(),
          endsAt: endDate.toISOString(),
          timezone: webinar.timezone || "Africa/Lagos",
          format: webinar.format,
          location: webinar.location,
          meetingLink: webinar.meetingLink,
          isFree: webinar.isFree,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        {
          error: "Validation error",
          details: (error as unknown as { errors: unknown[] }).errors,
        },
        { status: 400 }
      );
    }

    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        {
          error:
            "You are already registered for this event with this email address.",
        },
        { status: 409 }
      );
    }

    console.error("Error in webinar registration", {
      error: error instanceof Error ? error.message : "Internal server error",
    });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
