import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toPublicEvent } from "@/lib/events";

// GET /api/events/[slug] - Fetch a single published event by slug or ID (public-safe)
export async function GET(
  _request: NextRequest,
  props: { params: Promise<{ slug: string }> }
) {
  const { slug } = await props.params;
  try {
    const now = new Date();
    const event = await prisma.webinar.findFirst({
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

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ event: toPublicEvent(event, now) });
  } catch (error) {
    console.error("Error fetching public event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
