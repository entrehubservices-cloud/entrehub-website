import { z } from 'zod';

export const portfolioSchema = z.object({
    title: z.string().trim().min(1).max(200),
    category: z.string().trim().min(1).max(100),
    description: z.string().trim().min(1).max(10000),
    image: z.string().trim().min(1).refine(value => /^\/(?!\/)/.test(value) || /^https?:\/\//.test(value), 'Use a local image path or HTTP(S) URL'),
    metric: z.string().trim().max(100).optional().default(''),
    metricLabel: z.string().trim().max(200).optional().default(''),
    order: z.number().int().min(0).default(0),
    projectUrl: z.union([z.literal(''), z.url({ protocol: /^https?$/ })]).optional().nullable(),
    status: z.enum(['DRAFT', 'IN_PROGRESS', 'COMPLETED']).default('DRAFT'),
    published: z.boolean().default(false),
}).refine(data => !data.published || data.status === 'COMPLETED', {
    message: 'Only completed projects can be published', path: ['published'],
});
