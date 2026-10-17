import { permanentRedirect, notFound } from 'next/navigation';
import { getBlogPostServer } from '@/lib/api/blog';
export default async function LegacyArticle({ params }: { params: Promise<{ slug: string; id: string }> }) {
  const { slug } = await params;
  const resolvedSlug = slug === 'the-future-of-digital-marketing-in-2024' ? 'digital-marketing-plan-service-businesses' : slug;
  const { post } = await getBlogPostServer(resolvedSlug);
  if (!post) notFound();
  permanentRedirect(`/blog/${encodeURIComponent(post.slug)}`);
}
