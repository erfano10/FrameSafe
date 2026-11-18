import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, User } from 'lucide-react';
import { toast } from 'sonner';
import { authApi } from '@/api/auth';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterClientPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const password = watch('password');

  async function onSubmit(data: FormData) {
    try {
      const res = await authApi.register({
        name: data.name,
        email: data.email,
        password: data.password,
        role: 'CLIENT',
      });
      if (res.success) {
        // Register returns no token — login immediately after
        const loginRes = await authApi.login({ email: data.email, password: data.password });
        if (loginRes.success && loginRes.token && loginRes.data) {
          setAuth(loginRes.data as import('@/types').User, loginRes.token);
        }
        toast.success('Akun klien berhasil dibuat!');
        navigate('/client/dashboard', { replace: true });
      } else {
        toast.error(res.message || 'Registrasi gagal');
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Terjadi kesalahan saat mendaftar';
      toast.error(msg);
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-slate-500 mb-1">
          <User className="h-5 w-5" />
          <span className="text-sm font-semibold uppercase tracking-wide">Klien</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Akses foto dari fotografer Anda
        </h1>
        <p className="text-sm text-slate-500">
          Sudah punya akun?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Masuk di sini
          </Link>
          {' · '}
          <Link to="/register/photographer" className="text-blue-600 hover:underline font-medium">
            Daftar sebagai fotografer
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">Nama Lengkap</label>
          <input
            type="text"
            placeholder="Nama Anda"
            {...register('name', { required: 'Nama wajib diisi' })}
            className={`w-full h-10 rounded-lg border px-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.name ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-white'
            }`}
          />
          {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">Email</label>
          <input
            type="email"
            placeholder="nama@email.com"
            {...register('email', {
              required: 'Email wajib diisi',
              pattern: { value: /^\S+@\S+\.\S+$/, message: 'Format email tidak valid' },
            })}
            className={`w-full h-10 rounded-lg border px-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.email ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-white'
            }`}
          />
          {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Minimal 8 karakter"
              {...register('password', {
                required: 'Password wajib diisi',
                minLength: { value: 8, message: 'Password minimal 8 karakter' },
              })}
              className={`w-full h-10 rounded-lg border px-3 pr-10 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.password ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-white'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">Konfirmasi Password</label>
          <input
            type="password"
            placeholder="Ulangi password"
            {...register('confirmPassword', {
              required: 'Konfirmasi password wajib diisi',
              validate: (val) => val === password || 'Password tidak cocok',
            })}
            className={`w-full h-10 rounded-lg border px-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.confirmPassword ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-white'
            }`}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full mt-2" size="lg" loading={isSubmitting}>
          Buat Akun Klien
        </Button>
      </form>
    </div>
  );
}
