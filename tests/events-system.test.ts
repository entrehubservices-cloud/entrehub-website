import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import {
  webinarSchema,
  eventRegistrationSchema,
  slugifyEventTitle,
} from "../src/lib/validations/webinar";
import { getEventCapacityState, toPublicEvent } from "../src/lib/events";
import {
  checkRateLimit,
  resetRateLimitBucketsForTest,
} from "../src/lib/rate-limit";
import { getEmailIntegrationStatus } from "../src/lib/email";
import {
  getGoogleCalendarIntegrationStatus,
  createOrUpdateWebinarCalendarEvent,
  buildGoogleMeetRequestId,
} from "../src/lib/google-calendar";
import { contactMessageSchema } from "../src/lib/validations/contact";
import {
  siteName,
  companyRcNumber,
  companyTaxId,
  companyEmail,
  companySocialUrls,
} from "../src/lib/seo";

describe("Event validation", () => {
  it("defaults timezone to Africa/Lagos and isFree to true", () => {
    const parsed = webinarSchema.parse({
      title: "Website Conversion Workshop",
      scheduledAt: "2026-12-10T15:00:00.000Z",
      description: "Practical workshop",
      status: "PUBLISHED",
    });
    assert.equal(parsed.timezone, "Africa/Lagos");
    assert.equal(parsed.isFree, true);
    assert.equal(slugifyEventTitle(parsed.title), "website-conversion-workshop");
  });

  it("rejects end time before start time", () => {
    const result = webinarSchema.safeParse({
      title: "Invalid Dates Event",
      scheduledAt: "2026-12-10T15:00:00.000Z",
      endsAt: "2026-12-10T14:00:00.000Z",
      status: "DRAFT",
    });
    assert.equal(result.success, false);
  });

  it("prevents publishing without summary/description or in-person location", () => {
    const missingDesc = webinarSchema.safeParse({
      title: "Missing Description",
      scheduledAt: "2026-12-10T15:00:00.000Z",
      status: "PUBLISHED",
    });
    assert.equal(missingDesc.success, false);

    const missingLocation = webinarSchema.safeParse({
      title: "In-Person Clinic",
      scheduledAt: "2026-12-10T15:00:00.000Z",
      shortSummary: "In-person session",
      format: "IN_PERSON",
      status: "PUBLISHED",
    });
    assert.equal(missingLocation.success, false);
  });
});

describe("Registration validation, capacity, and rate limiting", () => {
  beforeEach(() => {
    resetRateLimitBucketsForTest();
  });

  it("normalizes email to lowercase and rejects honeypot submissions", () => {
    const valid = eventRegistrationSchema.parse({
      firstName: "Ada",
      lastName: "Okafor",
      email: "  Ada.Okafor@Example.COM ",
      agreeToTerms: true,
      website: "",
    });
    assert.equal(valid.email, "ada.okafor@example.com");

    const bot = eventRegistrationSchema.safeParse({
      firstName: "Bot",
      lastName: "User",
      email: "bot@example.com",
      agreeToTerms: true,
      website: "https://spam.example",
    });
    assert.equal(bot.success, false);
  });

  it("computes capacity, closed, and ended states accurately", () => {
    const now = new Date("2026-12-01T12:00:00.000Z");
    const fullState = getEventCapacityState({
      status: "PUBLISHED",
      isActive: true,
      scheduledAt: new Date("2026-12-10T15:00:00.000Z"),
      endsAt: new Date("2026-12-10T16:00:00.000Z"),
      capacity: 25,
      registrationCount: 25,
      now,
    });
    assert.equal(fullState.isFull, true);
    assert.equal(fullState.isOpen, false);
    assert.equal(fullState.spotsRemaining, 0);

    const closedState = getEventCapacityState({
      status: "PUBLISHED",
      isActive: true,
      scheduledAt: new Date("2026-12-10T15:00:00.000Z"),
      endsAt: new Date("2026-12-10T16:00:00.000Z"),
      registrationClosesAt: new Date("2026-12-01T10:00:00.000Z"),
      capacity: 50,
      registrationCount: 10,
      now,
    });
    assert.equal(closedState.isClosed, true);
    assert.equal(closedState.isOpen, false);
  });

  it("enforces rate limits per client key", () => {
    for (let i = 0; i < 3; i++) {
      const res = checkRateLimit({ key: "ip:1.2.3.4", limit: 3, windowMs: 60000, now: 1000 });
      assert.equal(res.allowed, true);
    }
    const blocked = checkRateLimit({ key: "ip:1.2.3.4", limit: 3, windowMs: 60000, now: 1000 });
    assert.equal(blocked.allowed, false);
    assert.equal(blocked.remaining, 0);
  });
});

describe("Access control and public data redaction", () => {
  it("strips private meetingLink and internal Google IDs from public event DTO", () => {
    const dto = toPublicEvent({
      id: "evt_123",
      slug: "growth-webinar",
      title: "Growth Webinar",
      scheduledAt: new Date("2026-12-10T15:00:00.000Z"),
      meetingLink: "https://meet.google.com/secret-room",
      isActive: true,
      status: "PUBLISHED",
      _count: { registrations: 4 },
    });

    assert.equal("meetingLink" in dto, false);
    assert.equal(dto.hasMeetingLink, true);
    assert.equal(dto.registrationCount, 4);
  });

  it("rejects unauthenticated admin requests with 401", async () => {
    process.env.JWT_SECRET = "test-secret-with-more-than-32-characters-here";
    const { requireAdminRequest } = await import("../src/lib/auth/admin-request");
    const req = {
      headers: new Headers(),
      cookies: { get: () => undefined },
    } as never;
    const auth = await requireAdminRequest(req);
    assert.equal(auth.ok, false);
    if (!auth.ok) {
      assert.equal(auth.status, 401);
    }
  });
});

describe("Integration boundaries and failure handling", () => {
  it("disables email delivery when SMTP is missing or sender is personal Gmail", () => {
    delete process.env.SMTP_HOST;
    delete process.env.SMTP_USER;
    delete process.env.SMTP_PASS;
    delete process.env.EMAIL_FROM;

    const unconfigured = getEmailIntegrationStatus();
    assert.equal(unconfigured.configured, false);

    process.env.SMTP_HOST = "smtp.example.com";
    process.env.SMTP_USER = "user";
    process.env.SMTP_PASS = "pass";
    process.env.EMAIL_FROM = "Entrehub <entrehubservices@gmail.com>";

    const gmailRejected = getEmailIntegrationStatus();
    assert.equal(gmailRejected.configured, false);

    process.env.EMAIL_FROM = "Entrehub Services <events@entrehubng.com>";
    const customDomainOk = getEmailIntegrationStatus();
    assert.equal(customDomainOk.configured, true);
  });

  it("reports missing Google Calendar configuration cleanly and builds deterministic request IDs", async () => {
    delete process.env.GOOGLE_OAUTH_CLIENT_ID;
    delete process.env.GOOGLE_OAUTH_CLIENT_SECRET;
    delete process.env.GOOGLE_OAUTH_REFRESH_TOKEN;

    const status = getGoogleCalendarIntegrationStatus();
    assert.equal(status.configured, false);
    assert.equal(buildGoogleMeetRequestId("abc"), "entrehub-webinar-abc");

    const result = await createOrUpdateWebinarCalendarEvent({
      id: "abc",
      title: "Test Event",
      scheduledAt: new Date("2026-12-10T15:00:00.000Z"),
      timezone: "Africa/Lagos",
      format: "ONLINE",
    });
    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.equal(result.reason, "NOT_CONFIGURED");
    }
  });
});

describe("Corporate compliance and B2B contact validation", () => {
  it("exposes verified ENTREHUB SERVICES LTD corporate metadata and clean social URLs", () => {
    assert.equal(siteName, "ENTREHUB SERVICES LTD");
    assert.equal(companyRcNumber, "10030133");
    assert.equal(companyTaxId, "2621823441002");
    assert.equal(companyEmail, "info@entrehubng.com");
    assert.equal(companySocialUrls.instagram.includes("srtk="), false);
  });

  it("validates optional B2B company and inquiryType fields in contact submissions", () => {
    const parsed = contactMessageSchema.parse({
      name: "Chinedu Eze",
      email: "chinedu@enterprise.ng",
      company: "Apex Infrastructure Ltd",
      inquiryType: "Corporate Profile & Capability Statement",
      message: "Please send your capability statement.",
    });
    assert.equal(parsed.company, "Apex Infrastructure Ltd");
    assert.equal(parsed.inquiryType, "Corporate Profile & Capability Statement");
  });
});
