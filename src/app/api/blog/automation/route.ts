import { timingSafeEqual } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const publishSchema = z.object({
    title: z.string().trim().min(1).max(200),
    slug: z.string().trim().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    excerpt: z.string().trim().min(1).max(500),
    content: z.string().min(1).max(200000),
    coverImage: z.string().url(),
    coverImageAlt: z.string().trim().max(250).optional().default(''),
    category: z.string().trim().min(1).max(100),
    tags: z.array(z.string().trim().min(1).max(50)).max(12).default([]),
    readTime: z.string().trim().min(1).max(40),
    featured: z.boolean().default(false),
});

function isAuthorised(request: NextRequest) {
    const expected = process.env.BLOG_PUBLISH_TOKEN;
    const supplied = request.headers.get('x-entrehub-publish-token');
    if (!expected || !supplied) return false;

    const expectedBuffer = Buffer.from(expected);
    const suppliedBuffer = Buffer.from(supplied);
    return expectedBuffer.length === suppliedBuffer.length && timingSafeEqual(expectedBuffer, suppliedBuffer);
}

function toSlug(value: string) {
    return value
        .normalize('NFKD')
        .toLowerCase()
        .replace(/[\\u0300-\\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 60);
}

export async function POST(request: NextRequest) {
    if (!isAuthorised(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let input: z.infer<typeof publishSchema>;
    try {
        input = publishSchema.parse(await request.json());
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Invalid article data', details: error.issues }, { status: 400 });
        }
        return NextResponse.json({ error: 'Invalid JSON request body' }, { status: 400 });
    }

    try {
        const existing = await prisma.blogPost.findUnique({ where: { slug: input.slug } });
        if (existing) {
            return NextResponse.json({ error: 'A blog post already uses this slug.' }, { status: 409 });
        }

        const author = await prisma.author.findFirst({ where: { name: 'Gabriel Adinga' } });
        if (!author) {
            return NextResponse.json({ error: 'Approved author Gabriel Adinga was not found in the blog CMS.' }, { status: 422 });
        }

        let category = await prisma.category.findUnique({ where: { name: input.category } });
        if (!category) {
            const categorySlug = toSlug(input.category);
            category = await prisma.category.findUnique({ where: { slug: categorySlug } });
            if (!category) {
                category = await prisma.category.create({
                    data: { name: input.category, slug: categorySlug, description: `Articles about ${input.category}.` },
                });
            }
        }

        const tagNames = [...new Set(input.tags)];
        const tags = await Promise.all(tagNames.map(async (name) => {
            const slug = toSlug(name);
            return prisma.tag.upsert({
                where: { slug },
                update: {},
                create: { name, slug },
            });
        }));

        const publishedAt = new Date();
        const post = await prisma.blogPost.create({
            data: {
                title: input.title,
                slug: input.slug,
                excerpt: input.excerpt,
                content: input.content,
                coverImage: input.coverImage,
                coverImageAlt: input.coverImageAlt,
                featured: input.featured,
                published: true,
                publishedAt,
                readTime: input.readTime,
                authorId: author.id,
                categoryId: category.id,
                tags: { connect: tags.map(({ id }) => ({ id })) },
            },
            select: { id: true, slug: true, publishedAt: true },
        });

        return NextResponse.json({
            post,
            url: `https://www.entrehubng.com/blog/${post.slug}`,
        }, { status: 201 });
    } catch (error) {
        console.error('Automated blog publishing failed', error instanceof Error ? error.message : 'Unknown error');
        return NextResponse.json({ error: 'The blog post could not be published.' }, { status: 500 });
    }
}
