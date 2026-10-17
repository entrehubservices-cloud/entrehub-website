import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

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
    ...posts.map(post => ({
      url: origin + '/blog/' + encodeURIComponent(post.slug),
      lastModified: post.updatedAt,
    })),
  ];
}
