import { NextRequest } from 'next/server';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';

export async function canManagePortfolio(request: NextRequest) {
    const token = extractTokenFromHeader(request.headers.get('authorization')) || request.cookies.get('auth-token')?.value;
    if (!token) return false;
    const user = await verifyToken(token);
    return !!user && ['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(user.role);
}
