import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Clock, Image, Lock, Unlock } from 'lucide-react';
import { toast } from 'sonner';
import { purchasesApi } from '@/api/purchases';
import { paymentsApi } from '@/api/payments';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import type { Purchase } from '@/types';
import { formatDate, getTimeUntilExpiry } from '@/lib/utils';
import { useCountdown } from '@/hooks/useCountdown';

interface PaymentFormData {
  proofUrl: string;
}

function CountdownTimer({ expiredAt }: { expiredAt: string }) {
  const { hours, minutes, seconds, expired } = useCountdown(expiredAt);
  if (expired) return <span className="text-red-500 font-medium text-sm">Expired</span>;
  return (
    <span className="font-mono text-amber-600 font-semibold text-sm">
      {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </span>
  );
}

export default function PurchaseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<PaymentFormData>();

  const fetchPurchase = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await purchasesApi.getMyPurchases();
      if (res.success && res.data) {
        const found = res.data.find((p) => p.id === id);
        if (found) setPurchase(found);
        else toast.error('Pembelian tidak ditemukan');
      }
    } catch {
      toast.error('Gagal memuat detail pembelian');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchPurchase(); }, [fetchPurchase]);

  async function onSubmitPayment(data: PaymentFormData) {
    if (!purchase) return;
    setSubmitting(true);
    try {
      const res = await paymentsApi.create({
        purchaseId: purchase.id,
        proofUrl: data.proofUrl,
      });
      if (res.success && res.data) {
        toast.success('Bukti pembayaran berhasil dikirim! Menunggu konfirmasi fotografer.');
        setPurchase((prev) => prev ? { ...prev, payment: res.data! } : prev);
      } else {
        toast.error(res.message ?? 'Gagal mengirim bukti pembayaran');
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Terjadi kesalahan';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  const isHDUnlocked = purchase?.payment?.status === 'PAID';
  const photos = purchase?.album?.photos ?? [];

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6 animate-pulse">
        <div className="h-5 w-24 bg-slate-200 rounded" />
        <div className="h-40 bg-slate-100 rounded-xl" />
        <div className="h-48 bg-slate-100 rounded-xl" />
      </div>
    );
  }

  if (!purchase) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-8 text-center text-slate-500">
        Pembelian tidak ditemukan.{' '}
        <button onClick={() => navigate('/client/purchases')} className="text-blue-600 hover:underline">
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
      {/* Back */}
      <button
        onClick={() => navigate('/client/purchases')}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Kembali ke Pembelian
      </button>

      {/* Purchase info */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle>{purchase.album?.title ?? `Purchase #${purchase.id.slice(0, 8)}`}</CardTitle>
              <p className="text-sm text-slate-500 mt-1">
                Dibuat: {formatDate(purchase.createdAt)}
              </p>
            </div>
            <StatusBadge type="purchase" status={purchase.status} />
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          {purchase.status === 'PENDING' && (
            <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <Clock className="h-4 w-4 text-amber-600 shrink-0" />
              <div>
                <p className="text-sm text-amber-700 font-medium">Waktu tersisa:</p>
                <CountdownTimer expiredAt={purchase.expiredAt} />
              </div>
            </div>
          )}
          <div className="text-xs text-slate-400">
            <span>Berakhir: {formatDate(purchase.expiredAt)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Payment section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pembayaran</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* No payment yet */}
          {!purchase.payment && purchase.status === 'PENDING' && (
            <>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-sm text-slate-600 space-y-2">
                <p className="font-medium text-slate-800">Cara Pembayaran:</p>
                <ol className="list-decimal list-inside space-y-1 text-slate-500">
                  <li>Transfer ke rekening/QRIS fotografer</li>
                  <li>Upload URL bukti transfer di bawah ini</li>
                  <li>Tunggu konfirmasi dari fotografer</li>
                  <li>Setelah dikonfirmasi, foto HD akan tersedia</li>
                </ol>
              </div>
              <form onSubmit={handleSubmit(onSubmitPayment)} className="space-y-3">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">
                    URL Bukti Pembayaran *
                  </label>
                  <input
                    type="url"
                    placeholder="https://... (link gambar bukti transfer)"
                    {...register('proofUrl', {
                      required: 'URL bukti pembayaran wajib diisi',
                      pattern: { value: /^https?:\/\/.+/, message: 'URL tidak valid' },
                    })}
                    className={`w-full h-10 rounded-lg border px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${errors.proofUrl ? 'border-red-400' : 'border-slate-200'}`}
                  />
                  {errors.proofUrl && <p className="text-xs text-red-600">{errors.proofUrl.message}</p>}
                </div>
                <Button type="submit" loading={submitting}>
                  Kirim Bukti Pembayaran
                </Button>
              </form>
            </>
          )}

          {/* Payment exists */}
          {purchase.payment && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-700">Status Pembayaran:</span>
                <StatusBadge type="payment" status={purchase.payment.status} />
              </div>

              {purchase.payment.proofUrl && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700">Bukti Pembayaran:</p>
                  <div className="rounded-lg overflow-hidden border border-slate-200">
                    <img
                      src={purchase.payment.proofUrl}
                      alt="Bukti pembayaran"
                      className="w-full max-h-64 object-contain bg-slate-50"
                    />
                  </div>
                </div>
              )}

              {/* Status messages */}
              {purchase.payment.status === 'PROOF_UPLOADED' && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-sm text-blue-700">
                  Bukti pembayaran sedang menunggu konfirmasi dari fotografer.
                </div>
              )}
              {purchase.payment.status === 'PAID' && (
                <div className="p-3 bg-green-50 rounded-lg border border-green-200 text-sm text-green-700 flex items-center gap-2">
                  <Unlock className="h-4 w-4" />
                  Pembayaran dikonfirmasi! Foto HD siap diakses.
                </div>
              )}
              {purchase.payment.status === 'REJECTED' && (
                <div className="p-3 bg-red-50 rounded-lg border border-red-200 text-sm text-red-700">
                  Pembayaran ditolak. Hubungi fotografer untuk informasi lebih lanjut.
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gallery section */}
      {photos.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">Galeri Foto</CardTitle>
              {isHDUnlocked ? (
                <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                  <Unlock className="h-3 w-3" /> HD Unlocked
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                  <Lock className="h-3 w-3" /> Preview only
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {photos.map((photo) => (
                <div key={photo.id} className="relative aspect-square rounded-xl overflow-hidden bg-slate-100">
                  <img
                    src={isHDUnlocked ? (photo.highResUrl ?? photo.previewUrl) : photo.previewUrl}
                    alt="Photo"
                    className="w-full h-full object-cover"
                  />
                  {!isHDUnlocked && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <Lock className="h-6 w-6 text-white/80" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No photos */}
      {photos.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
          <Image className="h-12 w-12 text-slate-200 mx-auto mb-3" />
          <p className="text-sm text-slate-500">Belum ada foto di album ini</p>
        </div>
      )}
    </div>
  );
}
