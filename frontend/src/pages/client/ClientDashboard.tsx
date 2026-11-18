import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { purchasesApi } from '@/api/purchases';
import { useAuthStore } from '@/store/authStore';
import { StatCard } from '@/components/shared/StatCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import type { Purchase } from '@/types';
import { formatDate, getTimeUntilExpiry } from '@/lib/utils';

function SkeletonCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-slate-200 bg-white p-6 animate-pulse">
          <div className="h-4 w-20 bg-slate-200 rounded mb-3" />
          <div className="h-8 w-12 bg-slate-200 rounded" />
        </div>
      ))}
    </div>
  );
}

export default function ClientDashboard() {
  const { user } = useAuthStore();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await purchasesApi.getMyPurchases();
      if (res.success) setPurchases(res.data ?? []);
    } catch {
      toast.error('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const pending = purchases.filter((p) => p.status === 'PENDING').length;
  const completed = purchases.filter((p) => p.status === 'COMPLETED').length;
  const recent = [...purchases]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Halo, {user?.name ?? 'Klien'} 👋
        </h1>
        <p className="text-sm text-slate-500 mt-1">Kelola pembelian foto Anda di sini.</p>
      </div>

      {loading ? (
        <SkeletonCards />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="Total Pembelian"
            value={purchases.length}
            icon={ShoppingBag}
            iconColor="text-blue-600"
          />
          <StatCard
            title="Menunggu Pembayaran"
            value={pending}
            icon={Clock}
            iconColor="text-amber-600"
          />
          <StatCard
            title="Selesai"
            value={completed}
            icon={CheckCircle}
            iconColor="text-green-600"
          />
        </div>
      )}

      {/* Recent purchases */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Pembelian Terbaru</CardTitle>
            <Link
              to="/client/purchases"
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
                <div key={i} className="h-12 bg-slate-100 rounded-lg" />
              ))}
            </div>
          ) : recent.length === 0 ? (
            <div className="px-6 pb-8 flex flex-col items-center gap-3 text-center">
              <ShoppingBag className="h-10 w-10 text-slate-200 mt-4" />
              <p className="text-sm text-slate-500">Belum ada pembelian</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recent.map((purchase) => (
                <div
                  key={purchase.id}
                  className="flex items-center justify-between px-6 py-3 hover:bg-slate-50 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {purchase.album?.title ?? `Purchase #${purchase.id.slice(0, 8)}`}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <StatusBadge type="purchase" status={purchase.status} />
                      {purchase.payment && (
                        <StatusBadge type="payment" status={purchase.payment.status} />
                      )}
                      {purchase.status === 'PENDING' && (
                        <span className="text-xs text-amber-600">
                          · {getTimeUntilExpiry(purchase.expiredAt)}
                        </span>
                      )}
                    </div>
                  </div>
                  <Link
                    to={`/client/purchases/${purchase.id}`}
                    className="ml-3 shrink-0 text-xs text-blue-600 hover:underline flex items-center gap-1"
                  >
                    Detail <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
