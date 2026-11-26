import nodemailer from "nodemailer";

const PERSONAL_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "yahoo.co.uk",
  "hotmail.com",
  "outlook.com",
  "live.com",
  "aol.com",
  "icloud.com",
]);

export interface EmailIntegrationStatus {
  configured: boolean;
  missingEnvVars: string[];
  senderAddress: string | null;
  reason?: string;
}

export function getEmailIntegrationStatus(): EmailIntegrationStatus {
  const missingEnvVars: string[] = [];
  if (!process.env.SMTP_HOST?.trim()) missingEnvVars.push("SMTP_HOST");
  if (!process.env.SMTP_USER?.trim()) missingEnvVars.push("SMTP_USER");
  if (!process.env.SMTP_PASS?.trim()) missingEnvVars.push("SMTP_PASS");
  const rawFrom = process.env.EMAIL_FROM?.trim();
  if (!rawFrom) missingEnvVars.push("EMAIL_FROM");

  if (missingEnvVars.length > 0) {
    return {
      configured: false,
      missingEnvVars,
      senderAddress: null,
      reason: `Email delivery is disabled until ${missingEnvVars.join(", ")} are configured.`,
    };
  }

  const emailMatch = rawFrom!.match(/<([^>]+)>/) || [null, rawFrom!];
  const address = (emailMatch[1] || "").trim().toLowerCase();
  const domain = address.split("@")[1] || "";

  if (!address.includes("@") || !domain || PERSONAL_EMAIL_DOMAINS.has(domain)) {
    return {
      configured: false,
      missingEnvVars: [],
      senderAddress: null,
      reason:
        "EMAIL_FROM must be a verified Entrehub custom-domain address (personal webmail senders are disabled).",
    };
  }

  return {
    configured: true,
    missingEnvVars: [],
    senderAddress: rawFrom!,
  };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatIcsDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

export function buildIcsInvite({
  uid,
  title,
  description,
  location,
  startTime,
  endTime,
}: {
  uid: string;
  title: string;
  description: string;
  location: string;
  startTime: Date;
  endTime: Date;
}): string {
  const now = formatIcsDate(new Date());
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ENTREHUB SERVICES LTD//Events//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}@entrehubng.com`,
    `DTSTAMP:${now}`,
    `DTSTART:${formatIcsDate(startTime)}`,
    `DTEND:${formatIcsDate(endTime)}`,
    `SUMMARY:${escapeIcsText(title)}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
    `LOCATION:${escapeIcsText(location)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function formatDateInTimeZone(date: Date, timeZone: string): string {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone,
      timeZoneName: "short",
    }).format(date);
  } catch {
    return date.toUTCString();
  }
}

export type EmailDeliveryResult = {
  status: "SENT" | "SKIPPED_UNCONFIGURED" | "FAILED";
  error?: string;
};

export async function sendWebinarConfirmation({
  webinarId,
  registrationId,
  email,
  firstName,
  lastName,
  webinarTitle,
  scheduledAt,
  endsAt,
  eventTimezone = "Africa/Lagos",
  meetingLink,
  location,
  format = "ONLINE",
  calendarLinks,
}: {
  webinarId?: string;
  registrationId?: string;
  email: string;
  firstName: string;
  lastName?: string;
  webinarTitle?: string;
  scheduledAt?: Date;
  endsAt?: Date;
  eventTimezone?: string;
  meetingLink?: string | null;
  location?: string | null;
  format?: string;
  calendarLinks: { google: string; outlook: string };
}): Promise<EmailDeliveryResult> {
  const integration = getEmailIntegrationStatus();
  if (!integration.configured || !integration.senderAddress) {
    console.info("Webinar confirmation email skipped", {
      webinarId,
      registrationId,
      status: "SKIPPED_UNCONFIGURED",
    });
    return { status: "SKIPPED_UNCONFIGURED", error: integration.reason };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const safeFirstName = escapeHtml(firstName);
  const safeFullName = escapeHtml(
    [firstName, lastName].filter(Boolean).join(" ")
  );
  const safeTitle = webinarTitle ? escapeHtml(webinarTitle) : "Entrehub Event";
  const formattedSchedule = scheduledAt
    ? formatDateInTimeZone(scheduledAt, eventTimezone)
    : null;
  const safeMeetingLink = meetingLink ? escapeHtml(meetingLink) : null;
  const safeLocation = location ? escapeHtml(location) : null;

  const icsContent =
    scheduledAt && webinarTitle
      ? buildIcsInvite({
          uid: registrationId || webinarId || "entrehub-event",
          title: webinarTitle,
          description: meetingLink
            ? `Join via Google Meet: ${meetingLink}`
            : `ENTREHUB SERVICES LTD event (${location || "Online"})`,
          location: meetingLink || location || "Online",
          startTime: scheduledAt,
          endTime: endsAt || new Date(scheduledAt.getTime() + 60 * 60 * 1000),
        })
      : null;

  const venueHtml = safeMeetingLink
    ? `<p><strong>Venue:</strong> Google Meet</p>
       <div style="margin: 16px 0;">
         <a href="${safeMeetingLink}" style="background: #1e3a8a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block;">Join Google Meet</a>
       </div>`
    : format === "IN_PERSON" && safeLocation
      ? `<p><strong>Location:</strong> ${safeLocation}</p>`
      : `<p>Your Google Meet link will be shared once confirmed.</p>`;

  const mailOptions = {
    from: integration.senderAddress,
    to: email,
    subject: `Registration Confirmed (Free): ${webinarTitle || "Entrehub Event"}`,
    html: `
      <div style="font-family: sans-serif; line-height: 1.6; color: #1e293b;">
        <h2>Hi ${safeFirstName},</h2>
        <p>Your registration is confirmed for <strong>${safeTitle}</strong> (Free admission).</p>
        ${
          formattedSchedule
            ? `<p><strong>Date &amp; Time:</strong> ${escapeHtml(formattedSchedule)} (${escapeHtml(eventTimezone)})</p>`
            : ""
        }
        <p><strong>Registered as:</strong> ${safeFullName}</p>
        ${venueHtml}
        <p>Add this event to your calendar:</p>
        <div style="margin: 20px 0;">
          <a href="${calendarLinks.google}" style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; margin-right: 10px; display: inline-block;">Add to Google Calendar</a>
          <a href="${calendarLinks.outlook}" style="background: #0f172a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block;">Add to Outlook</a>
        </div>
        <p>Best regards,<br>ENTREHUB SERVICES LTD</p>
      </div>
    `,
    ...(icsContent
      ? {
          attachments: [
            {
              filename: "entrehub-event.ics",
              content: icsContent,
              contentType: "text/calendar; method=PUBLISH; charset=UTF-8",
            },
          ],
        }
      : {}),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.info("Webinar confirmation email sent", {
      webinarId,
      registrationId,
      status: "SENT",
    });
    return { status: "SENT" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Email send failed";
    console.error("Webinar confirmation email failed", {
      webinarId,
      registrationId,
      status: "FAILED",
      error: message,
    });
    return { status: "FAILED", error: message };
  }
}
