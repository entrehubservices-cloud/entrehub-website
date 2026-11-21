import { z } from "zod";

export const eventCategories = [
  "Webinar",
  "Workshop",
  "Live Clinic",
  "Panel",
  "Training",
] as const;

export const eventFormats = ["ONLINE", "IN_PERSON", "HYBRID"] as const;
export const eventStatuses = ["DRAFT", "PUBLISHED"] as const;

export const eventTimezones = [
  { value: "Africa/Lagos", label: "Africa/Lagos (WAT, UTC+1)" },
  { value: "UTC", label: "UTC (Coordinated Universal Time)" },
  { value: "Europe/London", label: "Europe/London (GMT/BST)" },
  { value: "America/New_York", label: "America/New_York (ET)" },
  { value: "America/Chicago", label: "America/Chicago (CT)" },
  { value: "America/Los_Angeles", label: "America/Los_Angeles (PT)" },
  { value: "Asia/Dubai", label: "Asia/Dubai (GST, UTC+4)" },
] as const;

export function isValidIanaTimeZone(timeZone: string): boolean {
  if (!timeZone || typeof timeZone !== "string") return false;
  try {
    Intl.DateTimeFormat(undefined, { timeZone });
    return true;
  } catch {
    return false;
  }
}

export function slugifyEventTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

const optionalUrlSchema = z
  .string()
  .trim()
  .refine(
    (val) =>
      val === "" ||
      val.startsWith("/") ||
      /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(val),
    "Must be a valid URL or relative path"
  )
  .optional()
  .or(z.literal(""));

const optionalDateSchema = z
  .union([z.string(), z.date(), z.null(), z.undefined()])
  .transform((val) => {
    if (val === null || val === undefined || val === "") return null;
    const d = val instanceof Date ? val : new Date(val);
    return Number.isNaN(d.getTime()) ? "INVALID" : d;
  })
  .refine((val) => val !== "INVALID", "Invalid date/time");

export const webinarSchema = z
  .object({
    title: z.string().trim().min(3, "Title must be at least 3 characters").max(160),
    slug: z
      .string()
      .trim()
      .regex(/^[a-z0-9-]*$/, "Slug can only contain lowercase letters, numbers, and hyphens")
      .max(100)
      .optional()
      .or(z.literal("")),
    shortSummary: z.string().trim().max(320).optional().or(z.literal("")),
    description: z.string().trim().max(10000).optional().or(z.literal("")),
    category: z.string().trim().min(1).max(60).default("Webinar"),
    coverImage: optionalUrlSchema,
    scheduledAt: z
      .union([z.string(), z.date()])
      .transform((val) => (val instanceof Date ? val : new Date(val)))
      .refine((d) => !Number.isNaN(d.getTime()), "Valid start date and time is required"),
    endsAt: optionalDateSchema,
    timezone: z
      .string()
      .trim()
      .default("Africa/Lagos")
      .refine(isValidIanaTimeZone, "Invalid timezone"),
    format: z.enum(eventFormats).default("ONLINE"),
    meetingLink: z
      .string()
      .trim()
      .refine(
        (val) => val === "" || /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(val),
        "Invalid meeting link"
      )
      .optional()
      .or(z.literal("")),
    location: z.string().trim().max(240).optional().or(z.literal("")),
    speakerName: z.string().trim().max(120).optional().or(z.literal("")),
    speakerTitle: z.string().trim().max(160).optional().or(z.literal("")),
    speakerBio: z.string().trim().max(2000).optional().or(z.literal("")),
    capacity: z
      .union([z.number(), z.string(), z.null(), z.undefined()])
      .transform((val) => {
        if (val === null || val === undefined || val === "") return null;
        const n = typeof val === "number" ? val : Number(val);
        return Number.isFinite(n) ? Math.trunc(n) : NaN;
      })
      .refine(
        (val) => val === null || (Number.isInteger(val) && val >= 1 && val <= 10000),
        "Capacity must be between 1 and 10,000"
      ),
    registrationClosesAt: optionalDateSchema,
    status: z.enum(eventStatuses).default("DRAFT"),
    isActive: z.boolean().optional(),
    isFree: z.literal(true).default(true),
    remindersEnabled: z.boolean().default(false),
  })
  .superRefine((data, ctx) => {
    const resolvedEndsAt =
      data.endsAt instanceof Date
        ? data.endsAt
        : new Date(data.scheduledAt.getTime() + 60 * 60 * 1000);

    if (resolvedEndsAt <= data.scheduledAt) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endsAt"],
        message: "End date/time must be after the start date/time",
      });
    }

    if (
      data.registrationClosesAt instanceof Date &&
      data.registrationClosesAt > resolvedEndsAt
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["registrationClosesAt"],
        message: "Registration closing time cannot be after the event ends",
      });
    }

    const willPublish = data.status === "PUBLISHED" || data.isActive === true;
    if (willPublish) {
      if (!data.shortSummary?.trim() && !data.description?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["description"],
          message: "Provide a short summary or full description before publishing",
        });
      }
      if (data.format === "IN_PERSON" && !data.location?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["location"],
          message: "In-person events require a location before publishing",
        });
      }
    }
  });

export type WebinarInput = z.infer<typeof webinarSchema>;

export const eventRegistrationSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(80),
  lastName: z.string().trim().min(1, "Last name is required").max(80),
  email: z.string().trim().toLowerCase().email("Invalid email address").max(160),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  jobTitle: z.string().trim().max(100).optional().or(z.literal("")),
  companyName: z.string().trim().max(120).optional().or(z.literal("")),
  country: z.string().trim().min(1, "Country is required").max(100).default("Nigeria"),
  state: z.string().trim().max(100).optional().or(z.literal("")),
  city: z.string().trim().max(100).optional().or(z.literal("")),
  industry: z.string().trim().max(100).default("Other"),
  timezone: z.string().trim().min(1, "Timezone is required").default("Africa/Lagos"),
  howDidYouHear: z.string().trim().max(100).optional().or(z.literal("")),
  topicsOfInterest: z.array(z.string().trim().max(100)).default([]),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the privacy notice to register",
  }),
  subscribeUpdates: z.boolean().default(false).optional(),
  website: z.string().max(0, "Invalid submission").optional().or(z.literal("")),
});

export const webinarRegistrationSchema = eventRegistrationSchema.extend({
  country: z.string().min(1, "Country is required"),
  industry: z.string().min(1, "Industry is required"),
  timezone: z.string().min(1, "Timezone is required"),
  topicsOfInterest: z.array(z.string()).min(1, "Select at least one topic of interest"),
});

export type EventRegistrationInput = z.infer<typeof eventRegistrationSchema>;
export type WebinarRegistrationInput = z.infer<typeof webinarRegistrationSchema>;

export const industries = [
  "Tech",
  "Finance",
  "Healthcare",
  "Education",
  "Manufacturing",
  "Retail",
  "Telecom",
  "Energy",
  "Govt",
  "Non-profit",
  "Consulting",
  "Media",
  "Real Estate",
  "Transport",
  "Agriculture",
  "Other",
];

export const hearAboutUsOptions = [
  "Social Media",
  "Email Newsletter",
  "Friend/Colleague",
  "Search Engine",
  "Advertisement",
  "Other",
];

export const interestTopics = [
  "Website Design & Conversion",
  "E-commerce & Online Payments",
  "SEO & Search Visibility",
  "AI Search & Content Strategy",
  "Social Media & Content Workflows",
  "Digital Marketing Strategy",
  "Brand Identity & Positioning",
  "Business Automation & Tools",
];
