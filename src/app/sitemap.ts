import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { servicePages } from '@/lib/service-pages';

export const dynamic = 'force-dynamic';
const origin = 'https://www.entrehubng.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
    orderBy: { publishedAt: 'desc' },
  });
  return [
    { url: origin + '/' },
    { url: origin + '/blog' },
    { url: origin + '/privacy' },
    { url: origin + '/terms' },
    ...servicePages.map(service => ({ url: origin + '/services/' + service.slug })),
    ...posts.map(post => ({
      url: origin + '/blog/' + encodeURIComponent(post.slug),
      lastModified: post.updatedAt,
    })),
  ];
}
