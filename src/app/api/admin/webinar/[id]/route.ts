import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugifyEventTitle, webinarSchema } from "@/lib/validations/webinar";
import { requireAdminRequest } from "@/lib/auth/admin-request";

async function resolveUniqueSlug(baseSlug: string, excludeId: string): Promise<string> {
  const cleanBase = baseSlug || "entrehub-event";
  let candidate = cleanBase;
  let suffix = 2;

  while (true) {
    const existing = await prisma.webinar.findFirst({
      where: {
        slug: candidate,
        NOT: { id: excludeId },
      },
      select: { id: true },
    });
    if (!existing) return candidate;
    candidate = `${cleanBase}-${suffix}`;
    suffix += 1;
  }
}

// GET /api/admin/webinar/[id] - Get event & registrations (admin only)
export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const auth = await requireAdminRequest(request);
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const webinar = await prisma.webinar.findUnique({
      where: { id: params.id },
      include: {
        registrations: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!webinar) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ webinar });
  } catch (error) {
    console.error("Error fetching webinar:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/webinar/[id] - Update event details (admin only)
export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
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
      validatedData.slug?.trim() || slugifyEventTitle(validatedData.title),
      params.id
    );

    const webinar = await prisma.webinar.update({
      where: { id: params.id },
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

    return NextResponse.json({ webinar });
  } catch (error: unknown) {
    console.error("Error updating webinar:", error);
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

// DELETE /api/admin/webinar/[id] - Delete event (admin only)
export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const auth = await requireAdminRequest(request);
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    await prisma.webinar.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting webinar:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
