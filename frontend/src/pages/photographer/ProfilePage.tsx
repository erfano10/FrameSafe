import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { User, AtSign, Phone, QrCode, Save } from 'lucide-react';
import { toast } from 'sonner';
import { profileApi } from '@/api/profile';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import type { PhotographerProfile } from '@/types';

interface ProfileFormData {
  brandName: string;
  bio: string;
  instagram: string;
  whatsapp: string;
  qrisUrl: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<PhotographerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrisPreview, setQrisPreview] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>();

  const watchedQris = watch('qrisUrl');

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const res = await profileApi.get();
      if (res.success && res.data) {
        setProfile(res.data);
        reset({
          brandName: res.data.brandName ?? '',
          bio: res.data.bio ?? '',
          instagram: res.data.instagram ?? '',
          whatsapp: res.data.whatsapp ?? '',
          qrisUrl: res.data.qrisUrl ?? '',
        });
        setQrisPreview(res.data.qrisUrl ?? '');
      }
    } catch {
      toast.error('Gagal memuat profil');
    } finally {
      setLoading(false);
    }
  }, [reset]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  async function onSubmit(data: ProfileFormData) {
    try {
      const res = await profileApi.update({
        brandName: data.brandName,
        bio: data.bio || undefined,
        instagram: data.instagram || undefined,
        whatsapp: data.whatsapp || undefined,
        qrisUrl: data.qrisUrl || undefined,
      });
      if (res.success && res.data) {
        setProfile(res.data);
        setQrisPreview(data.qrisUrl);
        toast.success('Profil berhasil disimpan');
      } else {
        toast.error(res.message ?? 'Gagal menyimpan profil');
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Terjadi kesalahan';
      toast.error(msg);
    }
  }

  if (loading) {
    return (
      <div className="p-6 lg:p-8 space-y-6 animate-pulse">
        <div className="h-6 w-32 bg-slate-200 rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-80 bg-slate-100 rounded-xl" />
          <div className="h-64 bg-slate-100 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Profil Fotografer</h1>
        <p className="text-sm text-slate-500 mt-1">
          Kelola informasi brand dan kontak Anda
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Profil</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700 flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" /> Brand Name *
                  </label>
                  <input
                    type="text"
                    placeholder="cth. Budi Photography"
                    {...register('brandName', { required: 'Brand name wajib diisi' })}
                    className={`w-full h-10 rounded-lg border px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.brandName ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
                  />
                  {errors.brandName && <p className="text-xs text-red-600">{errors.brandName.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">Bio</label>
                  <textarea
                    rows={4}
                    placeholder="Ceritakan tentang Anda dan layanan fotografi Anda..."
                    {...register('bio')}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-700 flex items-center gap-1.5">
                      <AtSign className="h-3.5 w-3.5" /> Instagram
                    </label>
                    <input
                      type="text"
                      placeholder="@username"
                      {...register('instagram')}
                      className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-700 flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5" /> WhatsApp
                    </label>
                    <input
                      type="text"
                      placeholder="08xx-xxxx-xxxx"
                      {...register('whatsapp')}
                      className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700 flex items-center gap-1.5">
                    <QrCode className="h-3.5 w-3.5" /> QRIS URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://... (URL gambar QRIS Anda)"
                    {...register('qrisUrl')}
                    className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-slate-400">
                    URL gambar QRIS yang akan ditampilkan kepada klien saat pembayaran
                  </p>
                </div>

                <div className="flex justify-end pt-2">
                  <Button type="submit" loading={isSubmitting}>
                    <Save className="h-4 w-4" /> Simpan Perubahan
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Pratinjau Profil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg shrink-0">
                  {profile?.brandName?.charAt(0)?.toUpperCase() ?? 'P'}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">
                    {profile?.brandName || 'Brand Name'}
                  </p>
                  {profile?.instagram && (
                    <p className="text-xs text-slate-400">{profile.instagram}</p>
                  )}
                </div>
              </div>
              {profile?.bio && (
                <p className="text-xs text-slate-500 leading-relaxed">{profile.bio}</p>
              )}
              {profile?.whatsapp && (
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Phone className="h-3 w-3" /> {profile.whatsapp}
                </div>
              )}
            </CardContent>
          </Card>

          {(watchedQris || qrisPreview) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">QRIS Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src={watchedQris || qrisPreview}
                  alt="QRIS"
                  className="w-full rounded-lg border border-slate-200"
                  onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0.3'; }}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
