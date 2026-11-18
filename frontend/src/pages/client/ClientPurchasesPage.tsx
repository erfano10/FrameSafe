import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { purchasesApi } from '@/api/purchases';
import { Card, CardContent } from '@/components/ui/Card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import type { Purchase, PurchaseStatus } from '@/types';
import { formatDate, getTimeUntilExpiry } from '@/lib/utils';
import { cn } from '@/lib/utils';

type Tab = 'all' | PurchaseStatus;
const tabs: { key: Tab; label: string }[] = [
  { key: 'all', label: 'Semua' },
  { key: 'PENDING', label: 'Pending' },
  { key: 'COMPLETED', label: 'Selesai' },
  { key: 'CANCELLED', label: 'Dibatalkan' },
];

export default function ClientPurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('all');

  const fetchPurchases = useCallback(async () => {
    setLoading(true);
    try {
      const res = await purchasesApi.getMyPurchases();
      if (res.success) setPurchases(res.data ?? []);
    } catch {
      toast.error('Gagal memuat pembelian');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPurchases(); }, [fetchPurchases]);

  const filtered = activeTab === 'all'
    ? purchases
    : purchases.filter((p) => p.status === activeTab);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Pembelian Saya</h1>
        <p className="text-sm text-slate-500 mt-1">{purchases.length} pembelian total</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 rounded-lg w-fit">
        {tabs.map((tab) => {
          const count = tab.key === 'all' ? purchases.length : purchases.filter(p => p.status === tab.key).length;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'px-3 py-1.5 rounded-md text-sm font-medium transition-all',
                activeTab === tab.key
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              )}
            >
              {tab.label}
              {count > 0 && (
                <span className={cn(
                  'ml-1.5 text-xs px-1.5 py-0.5 rounded-full',
                  activeTab === tab.key ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-500'
                )}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 bg-slate-100 rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="Tidak ada pembelian"
          description={activeTab === 'all' ? 'Anda belum memiliki pembelian' : 'Tidak ada pembelian dengan status ini'}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((purchase) => (
            <Card key={purchase.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 flex-wrap">
                    <h3 className="font-semibold text-slate-900 text-sm">
                      {purchase.album?.title ?? `Purchase #${purchase.id.slice(0, 8)}`}
                    </h3>
                    <StatusBadge type="purchase" status={purchase.status} />
                    {purchase.payment && (
                      <StatusBadge type="payment" status={purchase.payment.status} />
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <span className="text-xs text-slate-400">{formatDate(purchase.createdAt)}</span>
                    {purchase.status === 'PENDING' && (
                      <span className="flex items-center gap-1 text-xs text-amber-600 font-medium">
                        <Clock className="h-3 w-3" />
                        Berakhir dalam {getTimeUntilExpiry(purchase.expiredAt)}
                      </span>
                    )}
                  </div>
                  {purchase.status === 'PENDING' && !purchase.payment && (
                    <p className="text-xs text-slate-500 mt-1">
                      Upload bukti pembayaran untuk melanjutkan
                    </p>
                  )}
                </div>
                <Link
                  to={`/client/purchases/${purchase.id}`}
                  className="shrink-0 flex items-center gap-1 text-sm text-blue-600 hover:underline font-medium"
                >
                  Detail <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
