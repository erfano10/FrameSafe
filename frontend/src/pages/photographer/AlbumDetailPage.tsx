import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Plus, Trash2, Image, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { albumsApi } from '@/api/albums';
import { photosApi } from '@/api/photos';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import type { Album, Photo } from '@/types';
import { formatDate } from '@/lib/utils';

interface PhotoFormData {
  previewUrl: string;
  highResUrl: string;
  originalUrl: string;
}

export default function AlbumDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [album, setAlbum] = useState<Album | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [savingPhoto, setSavingPhoto] = useState(false);
  const [deletePhotoId, setDeletePhotoId] = useState<string | null>(null);
  const [deletingPhoto, setDeletingPhoto] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PhotoFormData>();

  const fetchData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [albumRes, photosRes] = await Promise.all([
        albumsApi.getById(id),
        photosApi.getByAlbum(id),
      ]);
      if (albumRes.success && albumRes.data) setAlbum(albumRes.data);
      else toast.error('Album tidak ditemukan');
      if (photosRes.success) setPhotos(photosRes.data ?? []);
    } catch {
      toast.error('Gagal memuat data album');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function onAddPhoto(data: PhotoFormData) {
    if (!id) return;
    setSavingPhoto(true);
    try {
      const res = await photosApi.create({
        albumId: id,
        previewUrl: data.previewUrl,
        highResUrl: data.highResUrl || undefined,
        originalUrl: data.originalUrl || undefined,
      });
      if (res.success && res.data) {
        toast.success('Foto berhasil ditambahkan');
        setPhotos((prev) => [...prev, res.data!]);
        reset();
        setPhotoDialogOpen(false);
      } else {
        toast.error(res.message ?? 'Gagal menambahkan foto');
      }
    } catch {
      toast.error('Terjadi kesalahan');
    } finally {
      setSavingPhoto(false);
    }
  }

  async function handleDeletePhoto() {
    if (!deletePhotoId) return;
    setDeletingPhoto(true);
    try {
      const res = await photosApi.delete(deletePhotoId);
      if (res.success) {
        toast.success('Foto berhasil dihapus');
        setPhotos((prev) => prev.filter((p) => p.id !== deletePhotoId));
      } else {
        toast.error(res.message ?? 'Gagal menghapus foto');
      }
    } catch {
      toast.error('Terjadi kesalahan');
    } finally {
      setDeletingPhoto(false);
      setDeletePhotoId(null);
    }
  }

  async function handlePublish() {
    if (!id) return;
    setPublishing(true);
    try {
      const res = await albumsApi.updateStatus(id, 'PUBLISHED');
      if (res.success) {
        toast.success('Album berhasil dipublikasikan');
        setAlbum((prev) => prev ? { ...prev, status: 'PUBLISHED' } : prev);
      } else {
        toast.error(res.message ?? 'Gagal publish album');
      }
    } catch {
      toast.error('Terjadi kesalahan');
    } finally {
      setPublishing(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6 lg:p-8 space-y-6 animate-pulse">
        <div className="h-6 w-32 bg-slate-200 rounded" />
        <div className="h-24 bg-slate-100 rounded-xl" />
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 bg-slate-100 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="p-8 text-center text-slate-500">
        Album tidak ditemukan.{' '}
        <button onClick={() => navigate('/photographer/albums')} className="text-blue-600 hover:underline">
          Kembali ke daftar album
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Back + header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/photographer/albums')}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900">{album.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <StatusBadge type="album" status={album.status} />
              {album.clientName && (
                <span className="text-xs text-slate-400">· {album.clientName}</span>
              )}
              <span className="text-xs text-slate-400">· {formatDate(album.createdAt)}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {album.status === 'DRAFT' && (
            <Button
              variant="outline"
              onClick={handlePublish}
              loading={publishing}
              size="default"
            >
              <CheckCircle className="h-4 w-4" /> Publish Album
            </Button>
          )}
          <Button onClick={() => { reset(); setPhotoDialogOpen(true); }}>
            <Plus className="h-4 w-4" /> Tambah Foto
          </Button>
        </div>
      </div>

      {/* Description */}
      {album.description && (
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-600">{album.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Photo count info */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-700">{photos.length} foto</p>
      </div>

      {/* Photos grid */}
      {photos.length === 0 ? (
        <EmptyState
          icon={Image}
          title="Belum ada foto"
          description="Tambahkan foto ke album ini untuk mulai berbagi dengan klien"
          action={{ label: 'Tambah Foto', onClick: () => { reset(); setPhotoDialogOpen(true); } }}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group rounded-xl overflow-hidden aspect-square bg-slate-100">
              {photo.previewUrl ? (
                <img
                  src={photo.previewUrl}
                  alt="Photo preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Image className="h-10 w-10 text-slate-300" />
                </div>
              )}
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                <div className="flex items-center justify-between w-full">
                  <StatusBadge type="photo" status={photo.processingStatus} />
                  <button
                    onClick={() => setDeletePhotoId(photo.id)}
                    className="p-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add photo dialog */}
      <Dialog open={photoDialogOpen} onOpenChange={setPhotoDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Foto</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onAddPhoto)} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">Preview URL *</label>
              <input
                type="url"
                placeholder="https://..."
                {...register('previewUrl', { required: 'Preview URL wajib diisi' })}
                className={`w-full h-10 rounded-lg border px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${errors.previewUrl ? 'border-red-400' : 'border-slate-200'}`}
              />
              {errors.previewUrl && <p className="text-xs text-red-600">{errors.previewUrl.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">HD URL (opsional)</label>
              <input
                type="url"
                placeholder="https://..."
                {...register('highResUrl')}
                className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">Original URL (opsional)</label>
              <input
                type="url"
                placeholder="https://..."
                {...register('originalUrl')}
                className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setPhotoDialogOpen(false)}>
                Batal
              </Button>
              <Button type="submit" loading={savingPhoto}>Tambah Foto</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete photo confirm */}
      <ConfirmDialog
        open={!!deletePhotoId}
        onOpenChange={(open) => !open && setDeletePhotoId(null)}
        title="Hapus Foto?"
        description="Foto ini akan dihapus secara permanen."
        confirmLabel="Hapus"
        onConfirm={handleDeletePhoto}
        loading={deletingPhoto}
        variant="destructive"
      />
    </div>
  );
}
