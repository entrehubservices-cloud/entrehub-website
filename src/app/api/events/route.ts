import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toPublicEvent } from "@/lib/events";

// GET /api/events - List published events & webinars (public-safe)
export async function GET() {
  try {
    const now = new Date();
    const events = await prisma.webinar.findMany({
      where: {
        OR: [{ status: "PUBLISHED" }, { isActive: true }],
      },
      orderBy: { scheduledAt: "asc" },
      include: {
        _count: { select: { registrations: true } },
      },
    });

    return NextResponse.json({
      events: events.map((event) => toPublicEvent(event, now)),
    });
  } catch (error) {
    console.error("Error fetching public events:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
