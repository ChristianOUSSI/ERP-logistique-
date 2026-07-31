'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, ShieldCheck, Ship, Sparkles } from 'lucide-react';

export default function SplashScreenPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const timeout = setTimeout(() => {
        router.push('/login');
      }, 400);
      return () => clearTimeout(timeout);
    }
  }, [progress, router]);

  const handleSkip = () => {
    router.push('/login');
  };

  if (!mounted) return <div className="min-h-screen bg-black" />;

  return (
    <div className="relative min-h-screen w-full bg-black text-white flex flex-col items-center justify-between p-6 sm:p-12 overflow-hidden select-none font-sans">
      {/* Dynamic Background Glow FX */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-amber-500/10 via-yellow-500/15 to-amber-600/5 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Header Badge */}
      <div className="z-10 pt-4 animate-in fade-in slide-in-from-top-6 duration-1000">
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/80 border border-amber-500/30 text-amber-300 text-xs font-bold tracking-wider uppercase shadow-2xl backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-spin" style={{ animationDuration: '4s' }} />
          Plateforme ERP Logistique Portuaire N°1
        </div>
      </div>

      {/* Main Hero Branding */}
      <div className="z-10 flex flex-col items-center text-center my-auto max-w-4xl px-4 animate-in fade-in zoom-in-95 duration-1000">
        {/* CADC Monogram */}
        <div className="relative mb-6">
          <h1 className="text-7xl sm:text-9xl font-black tracking-tighter bg-gradient-to-b from-amber-100 via-amber-300 to-amber-600 bg-clip-text text-transparent drop-shadow-[0_0_45px_rgba(245,158,11,0.45)]">
            CADC
          </h1>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-[3px] bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_15px_#f59e0b]" />
        </div>

        {/* Code Axis Digital Cameroun */}
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-widest uppercase mb-4 drop-shadow-md">
          Code Axis Digital Cameroun
        </h2>

        <p className="text-slate-400 text-sm sm:text-base max-w-2xl font-medium leading-relaxed tracking-wide mb-8">
          <span className="text-amber-300 font-semibold">EVO-LOG SaaS</span> • Système Intégré de Gestion Portuaire, Transport Multimodal & Douanes ZLECAF.
        </p>

        {/* Progress Bar Container */}
        <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 p-2 rounded-2xl shadow-2xl backdrop-blur-xl mb-6">
          <div className="flex items-center justify-between text-xs font-mono px-3 mb-1.5 text-slate-400">
            <span className="flex items-center gap-1.5 text-amber-400 font-bold">
              <Ship className="w-3.5 h-3.5 animate-bounce" style={{ animationDuration: '2s' }} /> Initialisation des services...
            </span>
            <span className="text-amber-300 font-bold">{progress}%</span>
          </div>

          <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800/80">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 rounded-full transition-all duration-150 shadow-[0_0_12px_rgba(245,158,11,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Skip Action Button */}
        <button
          onClick={handleSkip}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-black px-8 py-3.5 rounded-xl text-sm shadow-xl shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          Accéder à l&apos;ERP <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Footer Branding */}
      <div className="z-10 pb-4 text-center text-xs text-slate-500 font-mono flex flex-col sm:flex-row items-center gap-4">
        <span>© 2026 Code Axis Digital Cameroun (CADC). Tous droits réservés.</span>
        <span className="hidden sm:inline text-slate-700">•</span>
        <span className="inline-flex items-center gap-1 text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Version Enterprise 2.0
        </span>
      </div>
    </div>
  );
}
