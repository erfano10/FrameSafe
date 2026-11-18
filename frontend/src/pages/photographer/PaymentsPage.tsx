import { useEffect, useState, useCallback } from 'react';
import { Check, X, Eye, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { paymentsApi } from '@/api/payments';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import type { Payment, PaymentStatus } from '@/types';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

type Tab = 'all' | 'PROOF_UPLOADED' | 'PAID' | 'REJECTED';

const tabs: { key: Tab; label: string }[] = [
  { key: 'all', label: 'Semua' },
  { key: 'PROOF_UPLOADED', label: 'Menunggu Konfirmasi' },
  { key: 'PAID', label: 'Dikonfirmasi' },
  { key: 'REJECTED', label: 'Ditolak' },
];

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [proofImage, setProofImage] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await paymentsApi.getAll();
      if (res.success) setPayments(res.data ?? []);
    } catch {
      toast.error('Gagal memuat pembayaran');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPayments(); }, [fetchPayments]);

  async function handleApprove(id: string) {
    setActionLoading(id + '-approve');
    try {
      const res = await paymentsApi.approve(id);
      if (res.success) {
        toast.success('Pembayaran dikonfirmasi! Akses HD telah dibuka untuk klien.');
        setPayments((prev) => prev.map((p) => p.id === id ? { ...p, status: 'PAID' } : p));
      } else {
        toast.error(res.message ?? 'Gagal mengkonfirmasi');
      }
    } catch {
      toast.error('Terjadi kesalahan');
    } finally {
      setActionLoading(null);
    }
  }

  async function handleReject(id: string) {
    setActionLoading(id + '-reject');
    try {
      const res = await paymentsApi.reject(id);
      if (res.success) {
        toast.success('Pembayaran ditolak.');
        setPayments((prev) => prev.map((p) => p.id === id ? { ...p, status: 'REJECTED' } : p));
      } else {
        toast.error(res.message ?? 'Gagal menolak pembayaran');
      }
    } catch {
      toast.error('Terjadi kesalahan');
    } finally {
      setActionLoading(null);
    }
  }

  const filtered = activeTab === 'all'
    ? payments
    : payments.filter((p) => p.status === activeTab);

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Pembayaran</h1>
        <p className="text-sm text-slate-500 mt-1">{payments.length} transaksi total</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 rounded-lg w-fit">
        {tabs.map((tab) => {
          const count = tab.key === 'all' ? payments.length : payments.filter(p => p.status === tab.key).length;
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

      {/* Table */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-slate-100 rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title="Tidak ada pembayaran"
          description={activeTab === 'all' ? 'Belum ada transaksi pembayaran masuk' : 'Tidak ada pembayaran dengan status ini'}
        />
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-6 py-3">Purchase ID</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-6 py-3">Status</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-6 py-3">Bukti Bayar</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-6 py-3">Tanggal</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-6 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-mono text-slate-700">#{payment.purchaseId.slice(0, 12)}...</p>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge type="payment" status={payment.status} />
                    </td>
                    <td className="px-6 py-4">
                      {payment.proofUrl ? (
                        <button
                          onClick={() => setProofImage(payment.proofUrl!)}
                          className="flex items-center gap-1.5 text-xs text-blue-600 hover:underline"
                        >
                          <Eye className="h-3.5 w-3.5" /> Lihat bukti
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400">Belum ada</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-500">{formatDate(payment.createdAt)}</p>
                    </td>
                    <td className="px-6 py-4">
                      {payment.status === 'PROOF_UPLOADED' ? (
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleApprove(payment.id)}
                            loading={actionLoading === payment.id + '-approve'}
                            className="bg-green-600 hover:bg-green-700 text-white text-xs"
                          >
                            <Check className="h-3.5 w-3.5" /> Konfirmasi
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(payment.id)}
                            loading={actionLoading === payment.id + '-reject'}
                            className="text-xs"
                          >
                            <X className="h-3.5 w-3.5" /> Tolak
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Proof image dialog */}
      <Dialog open={!!proofImage} onOpenChange={(open) => !open && setProofImage(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Bukti Pembayaran</DialogTitle>
          </DialogHeader>
          {proofImage && (
            <div className="mt-2 rounded-lg overflow-hidden border border-slate-200">
              <img src={proofImage} alt="Bukti pembayaran" className="w-full object-contain max-h-[70vh]" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
