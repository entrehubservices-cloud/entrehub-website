import { permanentRedirect, notFound } from 'next/navigation';
import { getBlogPostServer } from '@/lib/api/blog';
export default async function LegacyArticle({ params }: { params: Promise<{ slug: string; id: string }> }) {
  const { slug } = await params;
  const { post } = await getBlogPostServer(slug);
  if (!post) notFound();
  permanentRedirect(`/blog/${encodeURIComponent(post.slug)}`);
}
