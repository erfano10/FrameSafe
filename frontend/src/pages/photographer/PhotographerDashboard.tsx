import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FolderOpen, CreditCard, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { albumsApi } from '@/api/albums';
import { paymentsApi } from '@/api/payments';
import { useAuthStore } from '@/store/authStore';
import { StatCard } from '@/components/shared/StatCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import type { Album, Payment } from '@/types';
import { formatDate } from '@/lib/utils';

function SkeletonStatCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-slate-200 bg-white p-6 animate-pulse">
          <div className="h-4 w-24 bg-slate-200 rounded mb-3" />
          <div className="h-8 w-16 bg-slate-200 rounded mb-2" />
          <div className="h-3 w-20 bg-slate-100 rounded" />
        </div>
      ))}
    </div>
  );
}

export default function PhotographerDashboard() {
  const { user } = useAuthStore();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [albumsRes, paymentsRes] = await Promise.all([
        albumsApi.getAll(),
        paymentsApi.getAll(),
      ]);
      if (albumsRes.success) setAlbums(albumsRes.data ?? []);
      if (paymentsRes.success) setPayments(paymentsRes.data ?? []);
    } catch {
      toast.error('Gagal memuat data dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const pendingReview = payments.filter((p) => p.status === 'PROOF_UPLOADED').length;
  const completed = payments.filter((p) => p.status === 'PAID').length;
  const recentAlbums = [...albums].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 5);
  const recentPayments = [...payments].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  ).slice(0, 5);

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Selamat datang, {user?.name ?? 'Fotografer'} 👋
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Berikut ringkasan aktivitas akun Anda hari ini.
        </p>
      </div>

      {/* Stat Cards */}
      {loading ? (
        <SkeletonStatCards />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Album"
            value={albums.length}
            icon={FolderOpen}
            description="album dibuat"
            iconColor="text-blue-600"
          />
          <StatCard
            title="Menunggu Konfirmasi"
            value={pendingReview}
            icon={Clock}
            description="bukti pembayaran"
            iconColor="text-amber-600"
          />
          <StatCard
            title="Pembayaran Selesai"
            value={completed}
            icon={CheckCircle}
            description="transaksi berhasil"
            iconColor="text-green-600"
          />
          <StatCard
            title="Total Pembayaran"
            value={payments.length}
            icon={CreditCard}
            description="semua transaksi"
            iconColor="text-purple-600"
          />
        </div>
      )}

      {/* Recent data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Albums */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Album Terbaru</CardTitle>
              <Link
                to="/photographer/albums"
                className="text-xs text-blue-600 hover:underline flex items-center gap-1"
              >
                Lihat semua <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="px-6 pb-6 space-y-3 animate-pulse">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-10 bg-slate-100 rounded-lg" />
                ))}
              </div>
            ) : recentAlbums.length === 0 ? (
              <div className="px-6 pb-6 text-sm text-slate-400 text-center py-8">
                Belum ada album
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentAlbums.map((album) => (
                  <div
                    key={album.id}
                    className="flex items-center justify-between px-6 py-3 hover:bg-slate-50 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/photographer/albums/${album.id}`}
                        className="text-sm font-medium text-slate-900 hover:text-blue-600 truncate block"
                      >
                        {album.title}
                      </Link>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {album.clientName ?? 'Tanpa nama klien'} · {formatDate(album.createdAt)}
                      </p>
                    </div>
                    <div className="ml-3 shrink-0">
                      <StatusBadge type="album" status={album.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Payments */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Pembayaran Terbaru</CardTitle>
              <Link
                to="/photographer/payments"
                className="text-xs text-blue-600 hover:underline flex items-center gap-1"
              >
                Lihat semua <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="px-6 pb-6 space-y-3 animate-pulse">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-10 bg-slate-100 rounded-lg" />
                ))}
              </div>
            ) : recentPayments.length === 0 ? (
              <div className="px-6 pb-6 text-sm text-slate-400 text-center py-8">
                Belum ada pembayaran
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between px-6 py-3 hover:bg-slate-50 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        Purchase #{payment.purchaseId.slice(0, 8)}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {formatDate(payment.createdAt)}
                      </p>
                    </div>
                    <div className="ml-3 shrink-0">
                      <StatusBadge type="payment" status={payment.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
