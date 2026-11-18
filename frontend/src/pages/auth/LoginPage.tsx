import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { authApi } from '@/api/auth';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>();

  async function onSubmit(data: LoginFormData) {
    try {
      const res = await authApi.login(data);
      if (res.success && res.token && res.data) {
        setAuth(res.data as import('@/types').User, res.token);
        toast.success('Selamat datang kembali!');
        if (res.data.role === 'PHOTOGRAPHER') {
          navigate('/photographer/dashboard', { replace: true });
        } else {
          navigate('/client/dashboard', { replace: true });
        }
      } else {
        toast.error(res.message || 'Login gagal');
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Email atau password salah';
      toast.error(msg);
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Masuk ke akun Anda</h1>
        <p className="text-sm text-slate-500">
          Belum punya akun?{' '}
          <Link to="/register/photographer" className="text-blue-600 hover:underline font-medium">
            Daftar sebagai Fotografer
          </Link>{' '}
          atau{' '}
          <Link to="/register/client" className="text-blue-600 hover:underline font-medium">
            Klien
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">Email</label>
          <input
            type="email"
            autoComplete="email"
            placeholder="nama@email.com"
            {...register('email', {
              required: 'Email wajib diisi',
              pattern: { value: /^\S+@\S+\.\S+$/, message: 'Format email tidak valid' },
            })}
            className={`w-full h-10 rounded-lg border px-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.email ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-white'
            }`}
          />
          {errors.email && (
            <p className="text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Minimal 6 karakter"
              {...register('password', {
                required: 'Password wajib diisi',
                minLength: { value: 6, message: 'Password minimal 6 karakter' },
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
          {errors.password && (
            <p className="text-xs text-red-600">{errors.password.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          loading={isSubmitting}
        >
          Masuk
        </Button>
      </form>
    </div>
  );
}
