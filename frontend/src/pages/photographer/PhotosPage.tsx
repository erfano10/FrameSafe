import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Image, ArrowRight, FolderOpen } from 'lucide-react';
import { toast } from 'sonner';
import { albumsApi } from '@/api/albums';
import { Card, CardContent } from '@/components/ui/Card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import type { Album } from '@/types';

export default function PhotosPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAlbums = useCallback(async () => {
    setLoading(true);
    try {
      const res = await albumsApi.getAll();
      if (res.success) setAlbums(res.data ?? []);
    } catch {
      toast.error('Gagal memuat album');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAlbums(); }, [fetchAlbums]);

  const totalPhotos = albums.reduce((sum, a) => sum + (a._count?.photos ?? 0), 0);

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Photos</h1>
        <p className="text-sm text-slate-500 mt-1">
          {totalPhotos} foto tersebar di {albums.length} album
        </p>
      </div>

      <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 text-sm text-blue-700 flex items-start gap-3">
        <Image className="h-5 w-5 mt-0.5 shrink-0" />
        <span>
          Foto dikelola per album. Pilih album di bawah untuk melihat dan mengelola foto di dalamnya.
        </span>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-28 bg-slate-100 rounded-xl" />
          ))}
        </div>
      ) : albums.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="Belum ada album"
          description="Buat album terlebih dahulu untuk mulai mengelola foto"
          action={{ label: 'Buat Album', onClick: () => window.location.assign('/photographer/albums') }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {albums.map((album) => (
            <Card key={album.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5 flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-slate-900 text-sm truncate">{album.title}</h3>
                    <StatusBadge type="album" status={album.status} />
                  </div>
                  <p className="text-xs text-slate-400">
                    {album._count?.photos ?? 0} foto
                    {album.clientName && ` · ${album.clientName}`}
                  </p>
                </div>
                <Link
                  to={`/photographer/albums/${album.id}`}
                  className="shrink-0 flex items-center gap-1 text-xs text-blue-600 hover:underline font-medium"
                >
                  Kelola <ArrowRight className="h-3 w-3" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
