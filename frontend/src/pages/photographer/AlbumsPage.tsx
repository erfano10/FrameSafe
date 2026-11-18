import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Plus, Search, Pencil, Trash2, ArrowRight, FolderOpen } from 'lucide-react';
import { toast } from 'sonner';
import { albumsApi } from '@/api/albums';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import type { Album, AlbumStatus } from '@/types';
import { formatDate } from '@/lib/utils';

interface AlbumFormData {
  title: string;
  clientName: string;
  description: string;
}

function AlbumCard({
  album,
  onEdit,
  onDelete,
  onPublish,
}: {
  album: Album;
  onEdit: (a: Album) => void;
  onDelete: (id: string) => void;
  onPublish: (id: string) => void;
}) {
  const navigate = useNavigate();
  return (
    <Card className="flex flex-col hover:shadow-md transition-shadow">
      <CardContent className="p-5 flex flex-col gap-4 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-slate-900 truncate text-sm leading-tight">
              {album.title}
            </h3>
            {album.clientName && (
              <p className="text-xs text-slate-400 mt-0.5 truncate">{album.clientName}</p>
            )}
          </div>
          <StatusBadge type="album" status={album.status} />
        </div>

        {album.description && (
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {album.description}
          </p>
        )}

        <div className="mt-auto pt-2 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400">{formatDate(album.createdAt)}</span>
          <div className="flex items-center gap-1">
            {album.status === 'DRAFT' && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onPublish(album.id)}
                className="text-xs"
              >
                Publish
              </Button>
            )}
            <Button
              size="icon"
              variant="ghost"
              onClick={() => navigate(`/photographer/albums/${album.id}`)}
              title="Lihat detail"
              className="h-8 w-8"
            >
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onEdit(album)}
              title="Edit"
              className="h-8 w-8"
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onDelete(album.id)}
              title="Hapus"
              className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AlbumsPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'status'>('newest');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [savingAlbum, setSavingAlbum] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AlbumFormData>();

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

  function openCreate() {
    setEditingAlbum(null);
    reset({ title: '', clientName: '', description: '' });
    setDialogOpen(true);
  }

  function openEdit(album: Album) {
    setEditingAlbum(album);
    reset({ title: album.title, clientName: album.clientName ?? '', description: album.description ?? '' });
    setDialogOpen(true);
  }

  async function onSubmit(data: AlbumFormData) {
    setSavingAlbum(true);
    try {
      if (editingAlbum) {
        const res = await albumsApi.update(editingAlbum.id, data);
        if (res.success) {
          toast.success('Album berhasil diperbarui');
          setAlbums((prev) => prev.map((a) => (a.id === editingAlbum.id ? { ...a, ...data } : a)));
        } else {
          toast.error(res.message ?? 'Gagal memperbarui album');
        }
      } else {
        const res = await albumsApi.create(data);
        if (res.success && res.data) {
          toast.success('Album berhasil dibuat');
          setAlbums((prev) => [res.data!, ...prev]);
        } else {
          toast.error(res.message ?? 'Gagal membuat album');
        }
      }
      setDialogOpen(false);
    } catch {
      toast.error('Terjadi kesalahan');
    } finally {
      setSavingAlbum(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await albumsApi.delete(deleteId);
      if (res.success) {
        toast.success('Album berhasil dihapus');
        setAlbums((prev) => prev.filter((a) => a.id !== deleteId));
      } else {
        toast.error(res.message ?? 'Gagal menghapus album');
      }
    } catch {
      toast.error('Terjadi kesalahan');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  }

  async function handlePublish(id: string) {
    try {
      const res = await albumsApi.updateStatus(id, 'PUBLISHED' as AlbumStatus);
      if (res.success) {
        toast.success('Album berhasil dipublikasikan');
        setAlbums((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'PUBLISHED' } : a)));
      } else {
        toast.error(res.message ?? 'Gagal publish album');
      }
    } catch {
      toast.error('Terjadi kesalahan');
    }
  }

  const filtered = albums
    .filter((a) => {
      const q = search.toLowerCase();
      return (
        a.title.toLowerCase().includes(q) ||
        (a.clientName ?? '').toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'status') {
        const order: Record<AlbumStatus, number> = { DRAFT: 0, PUBLISHED: 1, COMPLETED: 2 };
        return order[a.status] - order[b.status];
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Albums</h1>
          <p className="text-sm text-slate-500 mt-1">{albums.length} album total</p>
        </div>
        <Button onClick={openCreate} size="default">
          <Plus className="h-4 w-4" /> Buat Album
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari album atau klien..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'newest' | 'status')}
          className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="newest">Terbaru</option>
          <option value="status">Status</option>
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-44 bg-slate-100 rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title={search ? 'Tidak ditemukan' : 'Belum ada album'}
          description={search ? 'Coba kata kunci lain' : 'Buat album pertama Anda untuk mulai mengelola foto'}
          action={search ? undefined : { label: 'Buat Album', onClick: openCreate }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((album) => (
            <AlbumCard
              key={album.id}
              album={album}
              onEdit={openEdit}
              onDelete={(id) => setDeleteId(id)}
              onPublish={handlePublish}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingAlbum ? 'Edit Album' : 'Buat Album Baru'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">Judul Album *</label>
              <input
                type="text"
                placeholder="cth. Wedding Budi & Sari"
                {...register('title', { required: 'Judul wajib diisi' })}
                className={`w-full h-10 rounded-lg border px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.title ? 'border-red-400' : 'border-slate-200'}`}
              />
              {errors.title && <p className="text-xs text-red-600">{errors.title.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">Nama Klien</label>
              <input
                type="text"
                placeholder="cth. Budi Santoso"
                {...register('clientName')}
                className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">Deskripsi</label>
              <textarea
                rows={3}
                placeholder="Deskripsi singkat album..."
                {...register('description')}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Batal
              </Button>
              <Button type="submit" loading={savingAlbum}>
                {editingAlbum ? 'Simpan' : 'Buat Album'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Hapus Album?"
        description="Semua foto dalam album ini juga akan dihapus. Tindakan ini tidak dapat dibatalkan."
        confirmLabel="Hapus"
        onConfirm={handleDelete}
        loading={deleting}
        variant="destructive"
      />
    </div>
  );
}
