import nodemailer from "nodemailer";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendWebinarConfirmation({
  email,
  firstName,
  webinarTitle,
  scheduledAt,
  meetingLink,
  calendarLinks,
}: {
  email: string;
  firstName: string;
  webinarTitle?: string;
  scheduledAt?: Date;
  meetingLink?: string | null;
  calendarLinks: { google: string; outlook: string };
}) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("Skipping webinar confirmation email: SMTP environment variables are not configured.");
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const safeFirstName = escapeHtml(firstName);
  const safeTitle = webinarTitle ? escapeHtml(webinarTitle) : "Upcoming Webinar";
  const formattedSchedule = scheduledAt
    ? `${scheduledAt.toUTCString().replace(":00 GMT", " UTC")}`
    : null;
  const safeMeetingLink = meetingLink ? escapeHtml(meetingLink) : null;

  const mailOptions = {
    from: process.env.EMAIL_FROM || "no-reply@entrehubng.com",
    to: email,
    subject: `Registration Confirmed: ${webinarTitle || "Upcoming Webinar"}`,
    html: `
      <div style="font-family: sans-serif; line-height: 1.6; color: #1e293b;">
        <h2>Hi ${safeFirstName},</h2>
        <p>Thank you for registering for <strong>${safeTitle}</strong>. We look forward to having you join us.</p>
        ${formattedSchedule ? `<p><strong>Date &amp; Time:</strong> ${escapeHtml(formattedSchedule)}</p>` : ""}
        ${
          safeMeetingLink
            ? `<p><strong>Venue:</strong> Google Meet</p>
               <div style="margin: 16px 0;">
                 <a href="${safeMeetingLink}" style="background: #0f172a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block;">Join Google Meet</a>
               </div>`
            : `<p>We'll email your Google Meet link ahead of the session.</p>`
        }
        <p>Save the event to your calendar:</p>
        <div style="margin: 20px 0;">
          <a href="${calendarLinks.google}" style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; margin-right: 10px; display: inline-block;">Add to Google Calendar</a>
          <a href="${calendarLinks.outlook}" style="background: #0078D4; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block;">Add to Outlook</a>
        </div>
        <p>Best regards,<br>Entrehub Services</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Confirmation email sent to ${email}`);
  } catch (error) {
    console.error("Error sending confirmation email:", error);
  }
}
