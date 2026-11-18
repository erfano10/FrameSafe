import { Outlet } from 'react-router-dom';
import { Shield, CheckCircle2 } from 'lucide-react';

const features = [
  {
    icon: <CheckCircle2 className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />,
    title: 'Secure photo delivery',
    description: 'Your galleries are protected end-to-end with enterprise-grade encryption.',
  },
  {
    icon: <CheckCircle2 className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />,
    title: 'Payment-gated HD access',
    description: 'Clients unlock high-resolution downloads only after payment is confirmed.',
  },
  {
    icon: <CheckCircle2 className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />,
    title: 'AI watermark protection',
    description: 'Invisible AI watermarks deter theft and prove ownership automatically.',
  },
];

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex">
      {/* Left branding panel — hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-5/12 bg-slate-900 relative flex-col justify-between p-12 overflow-hidden">
        {/* Geometric background decoration */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          {/* Large circle top-right */}
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full border border-slate-700/60" />
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full border border-slate-700/40" />
          {/* Large circle bottom-left */}
          <div className="absolute -bottom-40 -left-40 w-[28rem] h-[28rem] rounded-full border border-slate-700/50" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full border border-slate-700/30" />
          {/* Subtle grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 shadow-lg shadow-blue-900/40">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">FrameSafe</span>
        </div>

        {/* Middle: tagline + feature list */}
        <div className="relative z-10 space-y-10">
          <div className="space-y-4">
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
              Protect your work.
              <br />
              <span className="text-blue-400">Get paid. Deliver.</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-sm">
              The all-in-one platform for photographers who want secure galleries and effortless payments.
            </p>
          </div>

          <ul className="space-y-6">
            {features.map((f) => (
              <li key={f.title} className="flex gap-4">
                {f.icon}
                <div>
                  <p className="text-white font-semibold text-sm">{f.title}</p>
                  <p className="text-slate-400 text-sm mt-0.5">{f.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom: legal / social proof */}
        <div className="relative z-10">
          <p className="text-slate-600 text-xs">
            © {new Date().getFullYear()} FrameSafe, Inc. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col justify-center items-center bg-white px-6 py-12 sm:px-10 lg:px-16 xl:px-24">
        {/* Mobile-only logo */}
        <div className="flex lg:hidden items-center gap-2 mb-8">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-600">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">FrameSafe</span>
        </div>

        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
