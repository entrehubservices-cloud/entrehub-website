import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { canManagePortfolio } from '@/lib/auth/portfolio';
import { portfolioSchema } from '@/lib/validations/portfolio';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const admin = request.nextUrl.searchParams.get('admin') === 'true';
    if (admin && !(await canManagePortfolio(request))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        const projects = await prisma.portfolioProject.findMany({
            where: admin ? {} : { published: true, status: 'COMPLETED' },
            orderBy: { order: 'asc' },
        });
        return NextResponse.json(projects, { headers: { 'Cache-Control': 'no-store' } });
    } catch (error) {
        console.error('Error fetching portfolio:', error);
        return NextResponse.json({ error: 'Failed to fetch portfolio' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    if (!(await canManagePortfolio(request))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        const parsed = portfolioSchema.safeParse(await request.json());
        if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
        const project = await prisma.portfolioProject.create({ data: parsed.data });
        return NextResponse.json(project, { status: 201 });
    } catch (error) {
        console.error('Error creating project:', error);
        return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
    }
}
