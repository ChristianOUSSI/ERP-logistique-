'use client';

import { useEffect, useState } from 'react';
import { Download, Smartphone, X, Sparkles, CheckCircle2, Share } from 'lucide-react';

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // 1. Enregistrement automatique du Service Worker PWA
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('✅ Service Worker KAMLOG enregistré avec succès:', reg.scope);
        })
        .catch((err) => {
          console.warn('⚠️ Échec enregistrement Service Worker:', err);
        });
    }

    // 2. Détecter si l'application est déjà installée en mode standalone
    if (typeof window !== 'undefined') {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
      if (isStandalone) {
        setIsInstalled(true);
        return;
      }
    }

    // 3. Détection iOS Safari
    if (typeof window !== 'undefined') {
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
      if (isIosDevice) {
        setIsIOS(true);
        // Afficher l'avertissement iOS si non installé
        const dismissed = localStorage.getItem('pwa_prompt_dismissed_ios');
        if (!dismissed) {
          setShowPrompt(true);
        }
      }
    }

    // 4. Écoute de l'événement PWA 'beforeinstallprompt' pour Android / Chrome Desktop
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      const dismissed = localStorage.getItem('pwa_prompt_dismissed');
      if (!dismissed) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 5. Écoute de l'événement d'installation réussie
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
      console.log('🎉 KAMLOG EM-ERP installé avec succès comme PWA !');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the PWA install prompt');
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    if (isIOS) {
      localStorage.setItem('pwa_prompt_dismissed_ios', 'true');
    } else {
      localStorage.setItem('pwa_prompt_dismissed', 'true');
    }
  };

  if (!showPrompt || isInstalled) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-[9999] animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-slate-900/95 backdrop-blur-2xl text-white border border-amber-500/40 rounded-3xl p-5 shadow-2xl shadow-black/80 relative overflow-hidden">
        {/* Lueur dorée décorative */}
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />

        <button
          onClick={handleDismiss}
          className="absolute top-3.5 right-3.5 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition"
          title="Fermer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 p-0.5 shrink-0 shadow-lg shadow-amber-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-amber-400" />
            </div>
          </div>

          <div className="flex-1 pr-4">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[10px] font-black tracking-widest text-amber-400 uppercase bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                PWA Officielle CADC
              </span>
            </div>

            <h3 className="text-sm font-black text-slate-100">Installer KAMLOG EM-ERP</h3>

            {isIOS ? (
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Sur iPhone / iPad : appuyez sur le bouton <strong className="text-amber-300 inline-flex items-center gap-0.5">Partager <Share className="w-3 h-3 inline" /></strong> dans Safari, puis sélectionnez <strong className="text-amber-300">« Sur l'écran d'accueil » ➕</strong>.
              </p>
            ) : (
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Ajoutez l'application sur votre écran d'accueil pour un accès instantané, rapide et utilisable hors-ligne.
              </p>
            )}

            {!isIOS && deferredPrompt && (
              <button
                onClick={handleInstallClick}
                className="mt-3 w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition active:scale-95 cursor-pointer"
              >
                <Download className="w-4 h-4" /> Installer l'Application Maintenant
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
