-- Expand Webinar & WebinarRegistration for the full public/admin events system.
ALTER TABLE "Webinar"
  ADD COLUMN IF NOT EXISTS "slug" TEXT,
  ADD COLUMN IF NOT EXISTS "shortSummary" TEXT,
  ADD COLUMN IF NOT EXISTS "category" TEXT NOT NULL DEFAULT 'Webinar',
  ADD COLUMN IF NOT EXISTS "coverImage" TEXT,
  ADD COLUMN IF NOT EXISTS "endsAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "timezone" TEXT NOT NULL DEFAULT 'Africa/Lagos',
  ADD COLUMN IF NOT EXISTS "format" TEXT NOT NULL DEFAULT 'ONLINE',
  ADD COLUMN IF NOT EXISTS "location" TEXT,
  ADD COLUMN IF NOT EXISTS "speakerName" TEXT,
  ADD COLUMN IF NOT EXISTS "speakerTitle" TEXT,
  ADD COLUMN IF NOT EXISTS "speakerBio" TEXT,
  ADD COLUMN IF NOT EXISTS "capacity" INTEGER,
  ADD COLUMN IF NOT EXISTS "registrationClosesAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'DRAFT',
  ADD COLUMN IF NOT EXISTS "isFree" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS "remindersEnabled" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "googleCalendarEventId" TEXT,
  ADD COLUMN IF NOT EXISTS "googleCalendarHtmlLink" TEXT,
  ADD COLUMN IF NOT EXISTS "googleMeetRequestId" TEXT,
  ADD COLUMN IF NOT EXISTS "googleCalendarSyncedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "googleCalendarLastError" TEXT;

-- Preserve any existing active webinars as PUBLISHED and backfill slug.
UPDATE "Webinar"
SET
  "slug" = COALESCE("slug", "id"),
  "status" = CASE WHEN "isActive" = true THEN 'PUBLISHED' ELSE 'DRAFT' END
WHERE "slug" IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "Webinar_slug_key" ON "Webinar"("slug");
CREATE INDEX IF NOT EXISTS "Webinar_status_idx" ON "Webinar"("status");

ALTER TABLE "WebinarRegistration"
  ADD COLUMN IF NOT EXISTS "emailDeliveryStatus" TEXT NOT NULL DEFAULT 'NOT_CONFIGURED',
  ADD COLUMN IF NOT EXISTS "emailDeliveryError" TEXT,
  ADD COLUMN IF NOT EXISTS "emailSentAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "reminderSentAt" TIMESTAMP(3);

-- Normalize existing emails to lowercase before enforcing per-event uniqueness.
UPDATE "WebinarRegistration"
SET "email" = LOWER(TRIM("email"))
WHERE "email" <> LOWER(TRIM("email"));

CREATE UNIQUE INDEX IF NOT EXISTS "WebinarRegistration_webinarId_email_key"
  ON "WebinarRegistration"("webinarId", "email");
