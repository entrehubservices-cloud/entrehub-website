import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { servicePages } from '@/lib/service-pages';

export const dynamic = 'force-dynamic';
const origin = 'https://www.entrehubng.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, events] = await Promise.all([
    prisma.blogPost.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
      orderBy: { publishedAt: 'desc' },
    }),
    prisma.webinar.findMany({
      where: { OR: [{ status: 'PUBLISHED' }, { isActive: true }] },
      select: { id: true, slug: true, updatedAt: true },
      orderBy: { scheduledAt: 'desc' },
    }),
  ]);
  return [
    { url: origin + '/' },
    { url: origin + '/pricing' },
    { url: origin + '/contact' },
    { url: origin + '/events' },
    { url: origin + '/blog' },
    { url: origin + '/terms' },
    { url: origin + '/privacy' },
    { url: origin + '/cookies' },
    ...servicePages.map((service) => ({ url: origin + '/services/' + service.slug })),
    ...posts.map((post) => ({
      url: origin + '/blog/' + encodeURIComponent(post.slug),
      lastModified: post.updatedAt,
    })),
    ...events.map((event) => ({
      url: origin + '/events/' + encodeURIComponent(event.slug || event.id),
      lastModified: event.updatedAt,
    })),
  ];
}
