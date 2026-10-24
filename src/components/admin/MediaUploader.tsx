'use client';

import { useState } from 'react';
import { upload } from '@vercel/blob/client';
import { Check, Copy, ExternalLink, Upload, Video } from 'lucide-react';

type MediaCategory = 'blog' | 'social' | 'reels';
type MediaMode = 'all' | 'image';

interface MediaUploaderProps {
    defaultCategory?: MediaCategory;
    mode?: MediaMode;
    onUploaded?: (url: string, file: File) => void;
}

const MAX_IMAGE_SIZE = 25 * 1024 * 1024;
const MAX_VIDEO_SIZE = 500 * 1024 * 1024;
const ACCEPTED_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif',
    'video/mp4',
    'video/quicktime',
    'video/webm',
];

function safeFilename(filename: string) {
    return filename
        .normalize('NFKD')
        .replace(/[^a-zA-Z0-9._-]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(-120) || 'media-file';
}

export default function MediaUploader({
    defaultCategory,
    mode = 'all',
    onUploaded,
}: MediaUploaderProps) {
    const [category, setCategory] = useState<MediaCategory>(defaultCategory ?? 'social');
    const [file, setFile] = useState<File | null>(null);
    const [url, setUrl] = useState('');
    const [progress, setProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState('');

    const uploadFile = async () => {
        if (!file) {
            setError('Choose an image or video first.');
            return;
        }
        if (!ACCEPTED_TYPES.includes(file.type) || (mode === 'image' && !file.type.startsWith('image/'))) {
            setError('Choose a supported image or video file.');
            return;
        }
        if (mode === 'all' && category === 'reels' && !file.type.startsWith('video/')) {
            setError('Choose an MP4, MOV or WebM video for a reel.');
            return;
        }
        if (mode === 'all' && category !== 'reels' && !file.type.startsWith('image/')) {
            setError('Choose an image for blog or social media artwork.');
            return;
        }
        const maxSize = file.type.startsWith('video/') ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
        if (file.size > maxSize) {
            setError(file.type.startsWith('video/') ? 'Videos must be 500 MB or smaller.' : 'Images must be 25 MB or smaller.');
            return;
        }

        setError('');
        setUrl('');
        setCopied(false);
        setProgress(0);
        setIsUploading(true);
        const pathname = `entrehub/${defaultCategory ?? category}/${Date.now()}-${safeFilename(file.name)}`;
        try {
            const result = await upload(pathname, file, {
                access: 'public',
                handleUploadUrl: '/api/media/upload',
                onUploadProgress: (event) => setProgress(event.percentage),
            });
            setUrl(result.url);
            onUploaded?.(result.url, file);
        } catch (uploadError) {
            setError(uploadError instanceof Error ? uploadError.message : 'Upload failed. Check the Blob store setup and try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const copyUrl = async () => {
        if (!url) return;
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1800);
        } catch {
            setError('Could not copy the URL. Select and copy it from the field.');
        }
    };

    return (
        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
                {mode === 'image' ? <Upload className="h-4 w-4" aria-hidden="true" /> : <Video className="h-4 w-4" aria-hidden="true" />}
                Upload to Entrehub media
            </div>
            {mode === 'all' && !defaultCategory && (
                <label className="mb-3 block text-xs font-medium text-slate-600">
                    Use
                    <select
                        value={category}
                        onChange={(event) => setCategory(event.target.value as MediaCategory)}
                        className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800"
                    >
                        <option value="social">Social post</option>
                        <option value="reels">Reel or video</option>
                        <option value="blog">Blog article</option>
                    </select>
                </label>
            )}
            <input
                type="file"
                accept={mode === 'image' ? 'image/jpeg,image/png,image/webp,image/avif' : 'image/jpeg,image/png,image/webp,image/avif,video/mp4,video/quicktime,video/webm'}
                onChange={(event) => {
                    setFile(event.target.files?.[0] ?? null);
                    setUrl('');
                    setError('');
                }}
                className="block w-full text-sm text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-white file:px-3 file:py-2 file:font-medium file:text-slate-700 file:shadow-sm"
            />
            <p className="mt-2 text-xs leading-5 text-slate-500">
                Images up to 25 MB; videos up to 500 MB. Uploaded files are publicly accessible to anyone with the URL. Upload only finished, approved content.
            </p>
            <button
                type="button"
                onClick={uploadFile}
                disabled={!file || isUploading}
                className="mt-3 inline-flex items-center gap-2 rounded-md bg-navy px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-navy-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
                <Upload className="h-4 w-4" aria-hidden="true" />
                {isUploading ? `Uploading ${Math.round(progress)}%` : 'Upload file'}
            </button>
            {isUploading && (
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}>
                    <div className="h-full bg-orange-400 transition-all" style={{ width: `${progress}%` }} />
                </div>
            )}
            {error && <p className="mt-3 text-sm text-red-700" role="alert">{error}</p>}
            {url && (
                <div className="mt-4 space-y-2">
                    <label className="block text-xs font-medium text-slate-600" htmlFor="uploaded-media-url">Public media URL</label>
                    <input
                        id="uploaded-media-url"
                        value={url}
                        readOnly
                        onFocus={(event) => event.currentTarget.select()}
                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-mono text-xs text-slate-700"
                    />
                    <div className="flex flex-wrap gap-2">
                        <button type="button" onClick={copyUrl} className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
                            {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
                            {copied ? 'Copied' : 'Copy URL'}
                        </button>
                        <a href={url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
                            <ExternalLink className="h-4 w-4" aria-hidden="true" />
                            Open file
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}
