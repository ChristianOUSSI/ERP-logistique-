'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { getModuleIcon, getModuleName } from '../../config/moduleColors';
import { ModuleType } from './ModuleSidebar'; // Still needed for ModuleHeaderProps type
import { useModuleTheme } from '../../hooks/useModuleTheme'; // Import the hook
import { getRouteFromTCode, canAccessTCode, TCODE_MAP } from '@/utils/tcodeLookup';
import { useAuth } from './AuthProvider';
import { useSettings, ThemePreference } from './SettingsProvider';
import { toast } from 'sonner';

const NOTIFICATIONS_STORAGE_KEY = 'kamlog_erp_notifications';

interface ERPNotification {
  id: string;
  message: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  timestamp: string;
  read: boolean;
}

interface ModuleHeaderProps {
  currentModule: ModuleType;
}

export function ModuleHeader({ currentModule }: ModuleHeaderProps) {
  const { theme } = useModuleTheme(currentModule); // Use the hook to get theme
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [notifications, setNotifications] = useState<ERPNotification[]>([]); // Notifications remain local to header
  const [wsStatus, setWsStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const [mounted, setMounted] = useState(false);
  const moduleIcon = getModuleIcon(currentModule);
  const moduleName = getModuleName(currentModule);
  const themeClasses = theme.headerClasses || 'text-gray-600 bg-gray-50'; // Fallback for safety (consider moving to theme config)
  
  const { user, logout, sessionExpiresAt, renewSession, sessionExpired } = useAuth();
  const suggestionRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const soundEnabledRef = useRef(true); // Ref for soundEnabled to avoid re-creating WebSocket

  // Consume settings from context
  const { 
    soundEnabled,
    toggleSound,
    showSoundBadge, 
    triggerSoundBadge, 
    theme: uiTheme, 
    setTheme,
    language,
    setLanguage 
  } = useSettings();

  const [isModuleMenuOpen, setIsModuleMenuOpen] = useState(false);

  const MODULES_LIST: { id: ModuleType; label: string; icon: string; path: string }[] = [
    { id: 'transport', label: 'Logistique / Transport', icon: 'local_shipping', path: '/transport/control' },
    { id: 'finance', label: 'Comptabilité / Finance', icon: 'account_balance', path: '/finance/overview' },
    { id: 'magasin', label: 'Entrepôt / Magasin', icon: 'warehouse', path: '/magasin/dashboard' },
    { id: 'parc', label: 'Yard / Parc', icon: 'directions_car', path: '/parc/overview' },
    { id: 'master-data', label: 'Données Maîtres', icon: 'hub', path: '/master-data/tiers' },
    { id: 'admin', label: 'Administration', icon: 'admin_panel_settings', path: '/admin/user-management/listing' },
  ];

  // Session Monitoring
  const [minutesLeft, setMinutesLeft] = useState<number | null>(null);
  const [showSessionExpiredModal, setShowSessionExpiredModal] = useState(false); // New state for modal

  useEffect(() => {
    // Update soundEnabledRef whenever soundEnabled changes from context
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  useEffect(() => {
    if (!sessionExpiresAt) return;
    
    const checkSession = () => {
      const diffMs = sessionExpiresAt.getTime() - Date.now();
      const diffMins = Math.floor(diffMs / 60000);
      setMinutesLeft(diffMins > 0 ? diffMins : 0);

      // If session has expired, show modal
      if (diffMins <= 0 && sessionExpired) {
        setShowSessionExpiredModal(true);
      }
    };

    checkSession();
    const timer = setInterval(checkSession, 1000); // Check every second for more precise countdown
    return () => clearInterval(timer);
  }, [sessionExpiresAt, sessionExpired]); // Added sessionExpired to dependencies

  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  const cycleTheme = () => {
    const themes: ThemePreference[] = ['light', 'dark', 'system'];
    const nextIndex = (themes.indexOf(uiTheme) + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'fr' ? 'en' : 'fr');
  };

  // 1. WebSocket Connection Logic
  const connect = useCallback(() => {
    if (!user) return;
    
    // Mode Démo Vercel / Standalone : Émulation asynchrone des alertes logistiques
    if (process.env.NEXT_PUBLIC_MOCK_AUTH === 'true') {
      setWsStatus('connected');
      const mockAlerts = [
        { message: "🚨 ALERTE CRITIQUE: Détection de siphonnage de carburant suspect sur le camion LT-982-CH (Mission #1204) !", severity: 'CRITICAL' },
        { message: "⚠️ ATTENTION: Le Bon d'Enlèvement Mag3 #RS-2026-004 est en attente d'autorisation depuis plus de 2 heures.", severity: 'WARNING' },
        { message: "🚨 ALERTE CRITIQUE: Anomalie thermique détectée sur le conteneur frigorifique MSCU-88219 (Zone Parc B3).", severity: 'CRITICAL' },
        { message: "ℹ️ INFO: Nouveau manifeste maritime douanier (CAMCIS) reçu pour l'agent Bolloré.", severity: 'INFO' },
        { message: "⚠️ ATTENTION: Seuil de stock minimum franchi pour l'article MAT-054 (Rupture proche).", severity: 'WARNING' }
      ];

      const interval = setInterval(() => {
        const randomAlert = mockAlerts[Math.floor(Math.random() * mockAlerts.length)];
        const newNotif: ERPNotification = {
          id: Math.random().toString(36).substring(2, 11),
          message: randomAlert.message,
          severity: randomAlert.severity as 'CRITICAL' | 'WARNING' | 'INFO',
          read: false,
          timestamp: new Date().toISOString(),
        };
        
        setNotifications((prev) => [newNotif, ...prev]);
        
        if (randomAlert.severity === 'CRITICAL' && soundEnabledRef.current) {
          triggerSoundBadge();
          const audio = new Audio('/assets/sounds/critical-alert.mp3');
          audio.volume = 0.4;
          audio.play().catch(() => console.warn('Lecture audio bloquée par le navigateur en mode démo.'));
        }

        toast(randomAlert.message, {
          icon: randomAlert.severity === 'CRITICAL' ? '🚨' : '⚠️',
          duration: 5000,
        });
      }, 20000); // Émet une alerte portuaire fictive toutes les 20 secondes

      return () => clearInterval(interval);
    }

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws/alerts';
    const socket = new WebSocket(`${wsUrl}?token=${user.id}`);
    socketRef.current = socket;
    setWsStatus('connecting');

    socket.onopen = () => {
      reconnectAttemptsRef.current = 0;
      setWsStatus('connected');
    };

    socket.onmessage = (event) => {
      const alert = JSON.parse(event.data);
      const newNotif: ERPNotification = {
        ...alert,
        id: Math.random().toString(36).substr(2, 9),
        read: false,
        timestamp: alert.timestamp || new Date().toISOString(),
      };
      setNotifications((prev) => [newNotif, ...prev]);
      
      // Play sound for CRITICAL alerts to ensure immediate attention
      if (alert.severity === 'CRITICAL' && soundEnabledRef.current) {
        const audio = new Audio('/assets/sounds/critical-alert.mp3');
        triggerSoundBadge(); // Trigger the visual badge
        audio.volume = 0.5;
        audio.play().catch(e => console.warn('Audio playback failed (blocked by browser or missing file):', e));
      }

      toast(alert.message, {
        icon: alert.severity === 'CRITICAL' ? '🚨' : '⚠️',
        duration: 6000,
        style: {
          background: '#0f172a',
          color: '#fff',
          borderLeft: alert.severity === 'CRITICAL' ? '4px solid #ba1a1a' : '4px solid #f59e0b',
        },
      });
    };

    socket.onclose = (e) => {
      if (e.wasClean) return;
      setWsStatus('disconnected');
      const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
      reconnectTimeoutRef.current = setTimeout(() => {
        reconnectAttemptsRef.current++;
        connect();
      }, delay);
    };

    socket.onerror = () => socket.close();
  }, [user]);

  // 1.1 WebSocket Real-time Alerts Implementation
  useEffect(() => {
    setMounted(true);
    if (!user) return;

    // Load persisted notifications on mount
    const savedNotifs = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (savedNotifs) {
      try { setNotifications(JSON.parse(savedNotifs)); } 
      catch (err) { console.error('Failed to load notifications'); }
    }

    const demoCleanup = connect();
    
    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      socketRef.current?.close();
      if (demoCleanup && typeof demoCleanup === 'function') demoCleanup();
    };
  }, [user, connect]);

  const handleManualRetry = () => {
    if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    socketRef.current?.close();
    connect();
  };

  // Handle marking individual notifications as read
  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearReadNotifications = () => {
    setNotifications(prev => prev.filter(n => !n.read));
    toast.success('Notifications lues effacées');
  };

  // Persistance hook
  useEffect(() => {
    if (notifications.length > 0 || localStorage.getItem(NOTIFICATIONS_STORAGE_KEY)) {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
    }
  }, [notifications]);

  const tcodeKey = searchValue.toUpperCase();
  const matchedSuggestion = TCODE_MAP[tcodeKey];

  useEffect(() => {
    setShowSuggestion(!!matchedSuggestion);
  }, [searchValue, matchedSuggestion]);

  // Global keyboard shortcut: Ctrl + K to focus search
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setShowSuggestion(false);
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const navigateToTCode = (code: string) => {
    if (!canAccessTCode(user?.role, code)) {
      toast.error(`Accès Interdit : Votre profil (${user?.role || 'INVITÉ'}) ne dispose pas des droits pour ${code}.`, { id: 'forbidden-tcode', icon: 'lock' });
      return;
    }

    const targetRoute = getRouteFromTCode(code);
    if (targetRoute) {
      router.push(targetRoute);
      setSearchValue('');
      setShowSuggestion(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const code = searchValue.toUpperCase();
      navigateToTCode(code);
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <>
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo et nom du projet */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-kamlog-primary">KAMLOG</span>
              <span className="text-sm text-gray-500">EM-ERP</span>
            </div>
            
            {/* Séparateur */}
            <div className="h-6 w-px bg-slate-200" />
            
            {/* Module Switcher Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsModuleMenuOpen(!isModuleMenuOpen)}
                className={`flex items-center space-x-2 px-4 py-1.5 rounded-full transition-all hover:ring-2 hover:ring-offset-2 hover:ring-slate-200 ${themeClasses}`}
              >
                <span className="material-symbols-outlined text-[20px]" aria-hidden="true">{moduleIcon}</span>
                <span className="text-sm font-bold tracking-tight uppercase">{moduleName}</span>
                <span className="material-symbols-outlined text-sm">expand_more</span>
              </button>

              {isModuleMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsModuleMenuOpen(false)} />
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-slate-200 shadow-xl rounded-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-2 border-b border-slate-100 bg-slate-50">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Basculer de module</span>
                    </div>
                    <div className="py-1">
                      {MODULES_LIST.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => {
                            setIsModuleMenuOpen(false);
                            router.push(m.path);
                          }}
                          className={`w-full flex items-center space-x-3 px-4 py-2.5 text-left hover:bg-slate-50 transition-colors ${currentModule === m.id ? 'bg-slate-50 border-l-4 border-kamlog-primary' : 'border-l-4 border-transparent'}`}
                        >
                          <span className={`material-symbols-outlined text-[20px] ${currentModule === m.id ? 'text-kamlog-primary' : 'text-slate-400'}`}>{m.icon}</span>
                          <span className={`text-sm font-medium ${currentModule === m.id ? 'text-kamlog-primary font-bold' : 'text-slate-700'}`}>{m.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* T-Code Search Bar - DESIGN.md Compliant */}
          <div className="flex-1 max-w-lg mx-12" role="search">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-kamlog-primary transition-colors">
                <span className="material-symbols-outlined text-[20px]" aria-hidden="true">{moduleIcon}</span>
              </div>
              <input
                type="text"
                ref={searchInputRef}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Saisir Transaction (ex: KM24)..."
                aria-label="Recherche de transaction par T-Code"
                className="block w-full pl-10 pr-12 py-2 border border-slate-200 rounded-md leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-kamlog-primary/20 focus:border-kamlog-primary sm:text-sm transition-all"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-[10px] font-bold text-slate-300 border border-slate-200 px-1.5 py-0.5 rounded uppercase tracking-tighter">T-Code</span>
              </div>

              {/* Quick Jump Suggestion Dropdown */}
              {showSuggestion && matchedSuggestion && (
                <div 
                  ref={suggestionRef}
                  className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 shadow-xl rounded-lg overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                >
                  <button
                    onClick={() => navigateToTCode(tcodeKey)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-sm font-bold text-kamlog-primary bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{tcodeKey}</span>
                      <span className="text-sm font-medium text-slate-700">Aller vers : {matchedSuggestion.route.split('/').pop()?.replace(/-/g, ' ')}</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 border border-slate-200 px-1.5 py-0.5 rounded uppercase">Entrée ↵</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Navigation utilisateur */}
          <div className="flex items-center space-x-4">
            {/* WebSocket Status Indicator */}
            {wsStatus !== 'connected' && (
              <div className="flex items-center space-x-2 px-2 py-1 bg-slate-100 rounded-md">
                <span className={`h-2 w-2 rounded-full ${wsStatus === 'connecting' ? 'bg-amber-500' : 'bg-red-500'}`} />
                <span className="text-[10px] font-bold text-slate-500 uppercase">
                  {wsStatus === 'connecting' ? 'Reconnexion...' : 'Déconnecté'}
                </span>
                {wsStatus === 'disconnected' && (
                  <button 
                    onClick={handleManualRetry}
                    className="ml-1 text-[10px] text-kamlog-primary hover:underline font-bold"
                  >
                    REESSAYER
                  </button>
                )}
              </div>
            )}

            {/* Theme Switcher */}
            <button 
              onClick={cycleTheme}
              className="p-2 rounded-full text-slate-500 hover:text-kamlog-primary hover:bg-slate-100 transition-colors"
              title={`Thème actuel: ${uiTheme}`}
            >
              <span className="material-symbols-outlined text-[22px]">
                {uiTheme === 'light' ? 'light_mode' : uiTheme === 'dark' ? 'dark_mode' : 'settings_brightness'}
              </span>
            </button>

            {/* Language Switcher */}
            <button 
              onClick={toggleLanguage}
              className="flex items-center space-x-1 px-2 py-1 rounded border border-slate-200 text-slate-500 hover:text-kamlog-primary hover:bg-slate-100 transition-colors"
              title="Changer la langue / Switch Language"
            >
              <span className="material-symbols-outlined text-[18px]">language</span>
              <span className="text-[11px] font-bold uppercase">{language}</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound} // Use toggleSound from context
              className={`relative p-2 rounded-full transition-colors ${soundEnabled ? 'text-kamlog-primary hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-100'}`}
              title={soundEnabled ? 'Désactiver le son des alertes' : 'Activer le son des alertes'} // Title for accessibility
            >
              {showSoundBadge && ( // Conditional rendering for the badge
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              )}
              <span className="material-symbols-outlined text-[22px]">
                {soundEnabled ? 'volume_up' : 'volume_off'}
              </span>
            </button>

            {/* Notifications */}
            <button 
              onClick={() => setIsDrawerOpen(true)}
              className="p-2 text-slate-500 hover:text-kamlog-primary hover:bg-slate-100 rounded-full transition relative"
            >
              <span className="material-symbols-outlined">notifications</span>
              {notifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-white">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>

            {/* Profil utilisateur */}
            <div className="flex items-center space-x-3">
              {minutesLeft !== null && minutesLeft <= 5 && minutesLeft > 0 && ( // Only show warning if > 0 minutes left
                <div 
                  className="hidden md:flex flex-col items-end animate-pulse bg-red-50 px-2 py-1 rounded-md border border-red-100"
                  title={`Session expire dans ${minutesLeft}m`}
                >
                  <div className="flex items-center space-x-1">
                    <span className="text-[10px] font-bold text-red-600">SESSION: {minutesLeft}m</span>
                    <button 
                      onClick={renewSession}
                      className="text-[10px] font-black text-kamlog-primary hover:underline ml-1"
                    >
                      RENOUVELER
                    </button>
                  </div>
                </div>
              )}
              
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-900 leading-tight">{user?.fullName || 'Chargement...'}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
              <div className="h-9 w-9 rounded-lg bg-kamlog-primary flex items-center justify-center text-white font-bold shadow-sm">
                {user?.fullName?.charAt(0) || '?'}
              </div>
            </div>

            {/* Bouton déconnexion */}
            <button 
              onClick={logout}
              className="p-2 text-slate-400 hover:text-kamlog-danger hover:bg-red-50 rounded-full transition"
            >
              <span className="material-symbols-outlined">logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>

      {/* Notification Drawer */}
      {isDrawerOpen && (
        <>
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          />
          
          <div className="fixed inset-y-0 right-0 w-80 sm:w-96 bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-2">
                <span className="material-symbols-outlined text-slate-500">history</span>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">Historique Alertes</h2>
              </div>
              <button onClick={() => setIsDrawerOpen(false)} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
                <span className="material-symbols-outlined text-slate-500">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-slate-50/50">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                  <span className="material-symbols-outlined text-4xl mb-2">notifications_off</span>
                  <p className="text-xs">Aucune notification</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div 
                    key={notif.id}
                    className={`p-3 rounded-lg border border-slate-200 bg-white shadow-sm transition-all relative group ${
                      notif.severity === 'CRITICAL' ? 'border-l-4 border-l-red-500' : 'border-l-4 border-l-amber-500'
                    } ${notif.read ? 'opacity-60' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                        notif.severity === 'CRITICAL' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {notif.severity}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {mounted ? new Date(notif.timestamp).toLocaleTimeString() : '--:--'}
                      </span>
                    </div>
                    <p className={`text-xs leading-relaxed ${notif.read ? 'text-slate-500' : 'text-slate-700 font-medium'}`}>
                      {notif.message}
                    </p>
                    {!notif.read && (
                      <button
                        onClick={() => markAsRead(notif.id)}
                        className="absolute bottom-2 right-2 p-1 bg-slate-100 rounded text-slate-500 hover:text-kamlog-primary opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <span className="material-symbols-outlined text-sm">done</span>
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-slate-200 bg-white grid grid-cols-2 gap-3">
              <button 
                onClick={markAllAsRead}
                className="py-2 text-[10px] font-bold text-slate-600 hover:bg-slate-50 border border-slate-200 rounded uppercase tracking-wider transition-colors"
              >
                Tout marquer lu
              </button>
              <button 
                onClick={clearReadNotifications}
                disabled={!notifications.some(n => n.read)}
                className="py-2 text-[10px] font-bold text-red-600 hover:bg-red-50 border border-red-100 rounded uppercase tracking-wider transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Effacer les lus
              </button>
            </div>
          </div>
        </>
      )}

    {/* Session Expired Modal */}
    {showSessionExpiredModal && (
      <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-sm text-center">
          <span className="material-symbols-outlined text-red-500 text-6xl mb-4">lock_clock</span>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Session Expirée</h3>
          <p className="text-slate-600 mb-6">
            Votre session a expiré pour des raisons de sécurité. Veuillez vous reconnecter.
          </p>
          <button
            onClick={logout}
            className="w-full py-3 px-4 bg-kamlog-primary text-white font-bold rounded-md hover:bg-kamlog-primary/90 transition-colors"
          >
            Se reconnecter
          </button>
        </div>
      </div>
    )}
    </>
  );
}
