import MediaUploader from '@/components/admin/MediaUploader';

export default function AdminMediaPage() {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Media Library</h1>
                <p className="max-w-3xl text-gray-600">
                    Upload approved blog covers, social graphics and finished reels. Copy the resulting public URL into a blog cover field or the media URL column used by the Make publishing queue.
                </p>
            </div>
            <div className="max-w-3xl">
                <MediaUploader />
            </div>
        </div>
    );
}
