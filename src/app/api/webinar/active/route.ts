import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toPublicEvent } from "@/lib/events";

// GET /api/webinar/active - Get the next upcoming published webinar/event (public-safe)
export async function GET() {
  try {
    const now = new Date();
    const webinar = await prisma.webinar.findFirst({
      where: {
        OR: [{ status: "PUBLISHED" }, { isActive: true }],
        scheduledAt: { gte: new Date(now.getTime() - 2 * 60 * 60 * 1000) },
      },
      orderBy: { scheduledAt: "asc" },
      include: {
        _count: { select: { registrations: true } },
      },
    });

    if (!webinar) {
      return NextResponse.json({ webinar: null }, { status: 200 });
    }

    return NextResponse.json({ webinar: toPublicEvent(webinar, now) });
  } catch (error) {
    console.error("Error fetching active webinar:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
