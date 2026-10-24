import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm'];
const MAX_IMAGE_SIZE = 25 * 1024 * 1024;
const MAX_VIDEO_SIZE = 500 * 1024 * 1024;

export async function POST(request: NextRequest) {
    let body: HandleUploadBody;
    try {
        body = (await request.json()) as HandleUploadBody;
    } catch {
        return NextResponse.json({ error: 'Invalid upload request.' }, { status: 400 });
    }

    const isCompletionCallback = (body as { type?: string }).type === 'blob.upload-completed';
    if (!isCompletionCallback) {
        const sessionToken = request.cookies.get('auth-token')?.value;
        const user = sessionToken ? await verifyToken(sessionToken) : null;
        if (!user) {
            return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
        }
    }

    try {
        const result = await handleUpload({
            body,
            request,
            onBeforeGenerateToken: async (pathname) => {
                const sessionToken = request.cookies.get('auth-token')?.value;
                const user = sessionToken ? await verifyToken(sessionToken) : null;
                if (!user) throw new Error('Authentication required.');

                if (!/^entrehub\/(blog|social|reels)\/[A-Za-z0-9._-]+$/.test(pathname)) {
                    throw new Error('Invalid media path.');
                }

                const isVideo = pathname.startsWith('entrehub/reels/');
                return {
                    allowedContentTypes: isVideo ? VIDEO_TYPES : IMAGE_TYPES,
                    maximumSizeInBytes: isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE,
                    addRandomSuffix: true,
                    cacheControlMaxAge: 60 * 60 * 24 * 30,
                };
            },
            onUploadCompleted: async ({ blob }) => {
                console.info('Entrehub media uploaded', {
                    pathname: blob.pathname,
                    contentType: blob.contentType,
                });
            },
        });

        return NextResponse.json(result);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Upload failed.';
        return NextResponse.json({ error: message }, { status: 400 });
    }
}
