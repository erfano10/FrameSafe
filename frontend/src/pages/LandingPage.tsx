import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Lock,
  Fingerprint,
  Camera,
  CheckCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

const features = [
  {
    icon: Shield,
    title: 'AI Adaptive Watermark',
    description:
      'Watermark cerdas yang menyesuaikan komposisi visual foto — mempertahankan estetika preview sekaligus mempersulit penghapusan.',
  },
  {
    icon: Lock,
    title: 'Payment-Gated HD Access',
    description:
      'Foto resolusi tinggi hanya bisa diunduh setelah pembayaran dikonfirmasi oleh fotografer.',
  },
  {
    icon: Fingerprint,
    title: 'Invisible Watermark',
    description:
      'Sidik jari digital tersembunyi di setiap foto membantu tracking penyebaran dan membuktikan kepemilikan.',
  },
  {
    icon: Camera,
    title: 'Secure Delivery',
    description:
      'Link album unik dengan kontrol akses penuh — tidak ada foto yang bisa berpindah tangan tanpa izin Anda.',
  },
];

const problems = [
  {
    icon: AlertTriangle,
    title: 'Klien menggunakan foto sebelum bayar lunas',
    description: 'Fotografer tidak memiliki leverage setelah foto dikirim melalui platform umum.',
  },
  {
    icon: AlertTriangle,
    title: 'Watermark biasa mudah dipotong atau dihapus',
    description: 'Logo di pojok foto tidak cukup melindungi karya dari penggunaan tanpa izin.',
  },
  {
    icon: AlertTriangle,
    title: 'Tidak ada bukti kepemilikan digital',
    description: 'Tanpa fingerprint digital, klaim kepemilikan foto sangat sulit dibuktikan.',
  },
];

const steps = [
  {
    num: '01',
    title: 'Upload & Proteksi',
    description: 'Fotografer upload foto. Sistem otomatis membuat protected preview dengan AI watermark.',
  },
  {
    num: '02',
    title: 'Klien Review & Bayar',
    description: 'Klien melihat preview watermarked dan melakukan pembayaran melalui platform.',
  },
  {
    num: '03',
    title: 'HD Ter-unlock Otomatis',
    description: 'Setelah fotografer konfirmasi pembayaran, akses foto HD terbuka secara instan.',
  },
];

const faqs = [
  {
    q: 'Apakah watermark FrameSafe benar-benar tidak bisa dihapus?',
    a: 'FrameSafe menggunakan AI Adaptive Watermark yang jauh lebih sulit dihapus dibanding watermark statis. Namun kami tidak mengklaim watermark 100% tidak dapat dihapus — teknologi ini dirancang untuk meningkatkan cost of effort penghapusan secara signifikan, bukan menjamin ketidakmungkinan mutlak.',
  },
  {
    q: 'Bagaimana cara klien mengakses foto HD?',
    a: 'Klien menerima link album dari fotografer, melihat preview foto, melakukan pembayaran, lalu fotografer mengkonfirmasi. Setelah konfirmasi, foto HD ter-unlock secara otomatis.',
  },
  {
    q: 'Metode pembayaran apa yang didukung?',
    a: 'Saat ini pembayaran dilakukan dengan upload bukti transfer. Integrasi payment gateway (QRIS, transfer bank, kartu kredit) akan hadir segera.',
  },
  {
    q: 'Apakah data dan foto saya aman?',
    a: 'Foto HD disimpan di private storage dan tidak pernah dapat diakses langsung tanpa otorisasi. Semua komunikasi menggunakan HTTPS dan data dienkripsi.',
  },
  {
    q: 'Berapa biaya menggunakan FrameSafe?',
    a: 'FrameSafe saat ini dalam tahap beta. Pricing akan diumumkan setelah periode beta berakhir.',
  },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* ── Navbar ───────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">FrameSafe</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Fitur</a>
            <a href="#how-it-works" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Cara Kerja</a>
            <a href="#faq" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">FAQ</a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/login">
              <Button variant="outline" size="sm">Masuk</Button>
            </Link>
            <Link to="/register/photographer">
              <Button size="sm">Daftar Gratis</Button>
            </Link>
          </div>

          <button
            className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-6 py-4 space-y-3">
            <a href="#features" className="block text-sm text-slate-600 py-2" onClick={() => setMobileMenuOpen(false)}>Fitur</a>
            <a href="#how-it-works" className="block text-sm text-slate-600 py-2" onClick={() => setMobileMenuOpen(false)}>Cara Kerja</a>
            <a href="#faq" className="block text-sm text-slate-600 py-2" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
            <div className="flex gap-3 pt-2">
              <Link to="/login" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" size="default" className="w-full">Masuk</Button>
              </Link>
              <Link to="/register/photographer" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                <Button size="default" className="w-full">Daftar</Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="pt-24 pb-32 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-xs font-semibold text-blue-700">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
            Beta · Secure Photography Platform
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight text-slate-900">
            Kirim Foto dengan Aman.{' '}
            <span className="text-blue-600">Terima Pembayaran</span>{' '}
            dengan Pasti.
          </h1>

          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Platform pengiriman foto profesional dengan watermark cerdas dan sistem pembayaran terintegrasi.
            Klien hanya mendapat akses foto HD setelah pembayaran dikonfirmasi.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register/photographer">
              <Button size="lg" className="gap-2">
                Mulai Sebagai Fotografer <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/register/client">
              <Button size="lg" variant="outline">Daftar Sebagai Klien</Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-8 pt-4 flex-wrap">
            {['Aman & Terenkripsi', 'AI Watermark', 'Payment Terintegrasi'].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-slate-500">
                <CheckCircle className="h-4 w-4 text-green-500" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Problem ──────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-red-500 uppercase tracking-widest mb-3">Masalah Yang Ada</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Mengapa fotografer perlu FrameSafe?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {problems.map((p) => (
              <div key={p.title} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-red-50 mb-4">
                  <p.icon className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{p.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">Fitur Utama</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Semua yang Anda butuhkan
            </h2>
            <p className="text-slate-500 mt-3 max-w-xl mx-auto">
              Teknologi yang melindungi karya Anda dari preview hingga delivery.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((f) => (
              <div key={f.title} className="flex gap-5 p-6 rounded-2xl border border-slate-200 hover:shadow-md transition-shadow bg-white">
                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-blue-50 shrink-0">
                  <f.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">{f.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">Cara Kerja</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Sederhana  Aman Efektif.
            </h2>
          </div>
          <div className="relative space-y-0">
            {steps.map((step, i) => (
              <div key={step.num} className="flex gap-6 items-start">
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-600 text-white font-bold text-sm shrink-0 shadow-lg shadow-blue-200">
                    {step.num}
                  </div>
                  {i < steps.length - 1 && (
                    <div className="w-0.5 h-12 bg-blue-200 my-2" />
                  )}
                </div>
                <div className="pb-10">
                  <h3 className="font-semibold text-slate-900 text-lg mb-1">{step.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits ─────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Untuk Semua Pihak</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl bg-blue-600 text-white">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Camera className="h-5 w-5" /> Untuk Fotografer
              </h3>
              <ul className="space-y-3">
                {[
                  'Kontrol akses berbasis pembayaran',
                  'Watermark adaptif yang sulit dihapus',
                  'Digital fingerprint bukti kepemilikan',
                  'Dashboard manajemen album & pembayaran',
                  'Tidak perlu khawatir foto dicuri klien',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm">
                    <CheckCircle className="h-5 w-5 text-blue-200 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-8 rounded-2xl bg-slate-900 text-white">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" /> Untuk Klien
              </h3>
              <ul className="space-y-3">
                {[
                  'Preview foto sebelum membayar penuh',
                  'Proses pembayaran yang transparan',
                  'Akses HD langsung setelah konfirmasi',
                  'Tidak perlu khawatir foto hilang',
                  'Pengalaman berbelanja yang profesional',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm">
                    <CheckCircle className="h-5 w-5 text-slate-400 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing placeholder ───────────────────────────────── */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full text-xs font-semibold text-amber-700 mb-6">
            Coming Soon
          </div>
          <h2 className="text-3xl font-bold tracking-tight mb-4">Pricing yang Transparan</h2>
          <p className="text-slate-500">
            FrameSafe saat ini dalam tahap beta. Kami sedang menyiapkan paket harga yang adil untuk fotografer semua skala. Daftar sekarang dan nikmati akses beta gratis.
          </p>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section id="faq" className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Pertanyaan Umum</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-xl border border-slate-200 overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-medium text-slate-900 pr-4">{faq.q}</span>
                  {openFaq === i
                    ? <ChevronUp className="h-5 w-5 text-slate-400 shrink-0" />
                    : <ChevronDown className="h-5 w-5 text-slate-400 shrink-0" />
                  }
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5">
                    <p className="text-sm text-slate-500 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-slate-900">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            Siap melindungi karya Anda?
          </h2>
          <p className="text-slate-400 text-lg">
            Bergabung dengan fotografer profesional yang menggunakan FrameSafe untuk keamanan dan kepercayaan.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register/photographer">
              <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 gap-2">
                Daftar Sebagai Fotografer <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/register/client">
              <Button size="lg" variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/10">
                Daftar Sebagai Klien
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="border-t border-slate-100 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-600">
              <Shield className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold tracking-tight">FrameSafe</span>
            <span className="text-xs text-slate-400 ml-2">Secure Photography Delivery Platform</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-slate-400">
            <span>© {new Date().getFullYear()} FrameSafe</span>
            <a href="#" className="hover:text-slate-700 transition-colors">Privasi</a>
            <a href="#" className="hover:text-slate-700 transition-colors">Kontak</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
