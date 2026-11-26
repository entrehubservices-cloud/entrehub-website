import { z } from 'zod';

export const contactInquiryTypes = [
  'Enterprise ICT Consulting',
  'Custom Software / AI Systems',
  'Website / E-commerce Development',
  'SEO & Digital Growth',
  'Corporate / Institutional General Contracting',
  'Corporate Profile & Capability Statement',
  'General Inquiry',
] as const;

export const contactMessageSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name is too long'),
  email: z.string().trim().email('Invalid email address').max(160),
  phone: z.string().trim().max(30, 'Phone number is too long').optional().or(z.literal('')),
  company: z.string().trim().max(160, 'Company name is too long').optional().or(z.literal('')),
  inquiryType: z.string().trim().max(120, 'Inquiry type is too long').optional().or(z.literal('')),
  message: z.string().trim().min(1, 'Message is required').max(5000, 'Message is too long'),
});

export const updateContactMessageSchema = z.object({
  status: z.enum(['UNREAD', 'READ', 'REPLIED', 'ARCHIVED']).optional(),
  notes: z.string().max(5000, 'Notes are too long').optional(),
});
