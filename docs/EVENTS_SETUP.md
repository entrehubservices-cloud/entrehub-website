# Entrehub Events & Webinars Setup Guide

## 1. Database Migration
The events schema is managed via Prisma migrations under `prisma/migrations/`.
Production Vercel builds run `prisma migrate deploy` automatically when `VERCEL_ENV=production`.
To apply locally against a PostgreSQL database:
```bash
npx prisma migrate deploy
```

## 2. Google Calendar & Meet Integration (Optional)
Events and registrations work without Google Calendar configured (admins can paste a Meet link manually). To enable one-click idempotent **Create Meet / Sync Meet** in `/admin/webinar`:
1. In Google Cloud Console for the authorized Entrehub Google account, enable the **Google Calendar API**.
2. Configure the **OAuth consent screen** (External or Internal for Workspace) and create an **OAuth 2.0 Web Application Client**.
3. Obtain a refresh token with scope `https://www.googleapis.com/auth/calendar.events`.
4. Add these server-side environment variables in Vercel (**Settings -> Environment Variables -> Production**):
   - `GOOGLE_OAUTH_CLIENT_ID`
   - `GOOGLE_OAUTH_CLIENT_SECRET`
   - `GOOGLE_OAUTH_REFRESH_TOKEN`
   - `GOOGLE_CALENDAR_ID` (optional, defaults to `primary`)

Note: Google Meet conference creation (`conferenceDataVersion=1`, `hangoutsMeet`) is idempotent per event via `googleMeetRequestId` and `googleCalendarEventId`.

## 3. Registration Confirmation Emails (Optional)
Confirmation emails remain **disabled** until a verified custom-domain sender is configured. Personal webmail addresses (e.g. `@gmail.com`) are rejected by design.
Add these server-side environment variables in Vercel:
- `SMTP_HOST`
- `SMTP_PORT` (`587` for STARTTLS or `465` for SSL)
- `SMTP_SECURE` (`false` for 587, `true` for 465)
- `SMTP_USER`
- `SMTP_PASS`
- `EMAIL_FROM` (for example `Entrehub Services <events@entrehubng.com>`)

Optional reminder emails are off by default (`remindersEnabled = false`) and require an explicit scheduler before sending.
