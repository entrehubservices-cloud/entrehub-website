import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugifyEventTitle, webinarSchema } from "@/lib/validations/webinar";
import { requireAdminRequest } from "@/lib/auth/admin-request";
import { getGoogleCalendarIntegrationStatus } from "@/lib/google-calendar";
import { getEmailIntegrationStatus } from "@/lib/email";

async function resolveUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
  const cleanBase = baseSlug || "entrehub-event";
  let candidate = cleanBase;
  let suffix = 2;

  while (true) {
    const existing = await prisma.webinar.findFirst({
      where: {
        slug: candidate,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true },
    });
    if (!existing) return candidate;
    candidate = `${cleanBase}-${suffix}`;
    suffix += 1;
  }
}

// GET /api/admin/webinar - List all events & integration status (admin only)
export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdminRequest(request);
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const webinars = await prisma.webinar.findMany({
      orderBy: { scheduledAt: "desc" },
      include: {
        _count: {
          select: { registrations: true },
        },
      },
    });

    return NextResponse.json({
      webinars,
      integrations: {
        googleCalendar: getGoogleCalendarIntegrationStatus(),
        email: getEmailIntegrationStatus(),
      },
    });
  } catch (error) {
    console.error("Error fetching webinars:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/admin/webinar - Create a new event/webinar (admin only)
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdminRequest(request);
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    const validatedData = webinarSchema.parse(body);

    const status =
      validatedData.status === "PUBLISHED" || validatedData.isActive === true
        ? "PUBLISHED"
        : "DRAFT";
    const isActive = status === "PUBLISHED";
    const endsAt =
      validatedData.endsAt ??
      new Date(validatedData.scheduledAt.getTime() + 60 * 60 * 1000);
    const slug = await resolveUniqueSlug(
      validatedData.slug?.trim() || slugifyEventTitle(validatedData.title)
    );

    const webinar = await prisma.webinar.create({
      data: {
        slug,
        title: validatedData.title,
        shortSummary: validatedData.shortSummary || null,
        description: validatedData.description || null,
        category: validatedData.category,
        coverImage: validatedData.coverImage || null,
        scheduledAt: validatedData.scheduledAt,
        endsAt,
        timezone: validatedData.timezone,
        format: validatedData.format,
        meetingLink: validatedData.meetingLink || null,
        location: validatedData.location || null,
        speakerName: validatedData.speakerName || null,
        speakerTitle: validatedData.speakerTitle || null,
        speakerBio: validatedData.speakerBio || null,
        capacity: validatedData.capacity ?? null,
        registrationClosesAt: validatedData.registrationClosesAt ?? null,
        status,
        isActive,
        isFree: true,
        remindersEnabled: validatedData.remindersEnabled,
      },
    });

    return NextResponse.json({ webinar }, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating webinar:", error);
    if (
      error &&
      typeof error === "object" &&
      "name" in error &&
      error.name === "ZodError"
    ) {
      return NextResponse.json(
        {
          error: "Validation error",
          details: "errors" in error ? error.errors : [],
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
