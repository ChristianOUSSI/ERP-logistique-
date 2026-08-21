$root = "c:\Users\chris\Documents\Projet\Documents\evo-log\ERP-logistique-\evo-log-frontend\src"
$utf8 = New-Object System.Text.UTF8Encoding($false)

function WriteFile($relPath, $content) {
    $fullPath = Join-Path $root $relPath
    $dir = Split-Path $fullPath -Parent
    if (!(Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
    [System.IO.File]::WriteAllText($fullPath, $content, $utf8)
    Write-Output "Created: $relPath"
}

# 1. Providers.tsx (CRITICAL - imported by layout.tsx)
WriteFile "components\shared\Providers.tsx" @"
'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ComingSoonProvider } from '@/contexts/ComingSoonContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: { queries: { staleTime: 300000, retry: 1 } },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <ComingSoonProvider>
        {children}
      </ComingSoonProvider>
    </QueryClientProvider>
  );
}
"@

# 2. forbidden.tsx
WriteFile "app\forbidden.tsx" @"
import Link from 'next/link';

export default function Forbidden() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-6xl font-bold text-red-600">403</h1>
      <p className="mt-4 text-xl text-gray-700">Acces interdit</p>
      <p className="mt-2 text-gray-500">Vous n&apos;avez pas les permissions necessaires pour acceder a cette page.</p>
      <Link href="/" className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        Retour a l&apos;accueil
      </Link>
    </div>
  );
}
"@

# 3. not-found.tsx
WriteFile "app\not-found.tsx" @"
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-6xl font-bold text-blue-600">404</h1>
      <p className="mt-4 text-xl text-gray-700">Page non trouvee</p>
      <p className="mt-2 text-gray-500">La page que vous recherchez n&apos;existe pas ou a ete deplacee.</p>
      <Link href="/" className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        Retour a l&apos;accueil
      </Link>
    </div>
  );
}
"@

# 4. PermissionGuard.tsx
WriteFile "components\auth\PermissionGuard.tsx" @"
'use client';

import React from 'react';

interface PermissionGuardProps {
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function PermissionGuard({ permission, children, fallback }: PermissionGuardProps) {
  // TODO: Implement actual permission check from auth context
  const hasPermission = true;

  if (!hasPermission) {
    return <>{fallback || null}</>;
  }

  return <>{children}</>;
}
"@

# 5. RoleBadges.tsx
WriteFile "components\auth\RoleBadges.tsx" @"
'use client';

import React from 'react';

const roleColors: Record<string, string> = {
  admin: 'bg-red-100 text-red-800',
  manager: 'bg-blue-100 text-blue-800',
  user: 'bg-gray-100 text-gray-800',
  viewer: 'bg-green-100 text-green-800',
};

interface RoleBadgeProps {
  role: string;
  size?: 'sm' | 'md' | 'lg';
}

export function RoleBadge({ role, size = 'sm' }: RoleBadgeProps) {
  const color = roleColors[role.toLowerCase()] || 'bg-gray-100 text-gray-800';
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : size === 'md' ? 'px-3 py-1 text-sm' : 'px-4 py-1.5 text-base';

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${color} ${sizeClass}`}>
      {role}
    </span>
  );
}
"@

# 6. LoginPanelSVG.tsx
WriteFile "components\illustrations\LoginPanelSVG.tsx" @"
'use client';

import React from 'react';

export default function LoginPanelSVG() {
  return (
    <svg viewBox="0 0 400 400" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#1e40af', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="url(#grad1)" rx="20" />
      <g transform="translate(100, 80)">
        <rect x="20" y="40" width="160" height="120" rx="8" fill="white" opacity="0.9" />
        <rect x="40" y="60" width="60" height="8" rx="4" fill="#1e40af" opacity="0.6" />
        <rect x="40" y="80" width="100" height="8" rx="4" fill="#1e40af" opacity="0.4" />
        <rect x="40" y="100" width="80" height="8" rx="4" fill="#1e40af" opacity="0.3" />
        <circle cx="100" cy="200" r="30" fill="white" opacity="0.2" />
        <path d="M90 200 L100 210 L115 190" stroke="white" strokeWidth="4" fill="none" />
      </g>
    </svg>
  );
}
"@

# 7. PortIllustration.tsx
WriteFile "components\illustrations\PortIllustration.tsx" @"
'use client';

import React from 'react';

export default function PortIllustration() {
  return (
    <svg viewBox="0 0 500 300" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect width="500" height="300" fill="#0c4a6e" rx="12" />
      <rect x="0" y="200" width="500" height="100" fill="#0369a1" rx="0" />
      <rect x="50" y="120" width="80" height="80" fill="#64748b" />
      <rect x="60" y="100" width="10" height="20" fill="#94a3b8" />
      <rect x="100" y="90" width="10" height="30" fill="#94a3b8" />
      <rect x="200" y="140" width="120" height="60" fill="#475569" />
      <rect x="220" y="130" width="80" height="10" fill="#64748b" />
      <polygon points="350,160 420,160 400,200 370,200" fill="#1e293b" />
      <rect x="380" y="130" width="5" height="30" fill="#94a3b8" />
      <path d="M0 220 Q50 210 100 220 T200 220 T300 220 T400 220 T500 220" stroke="#38bdf8" strokeWidth="2" fill="none" opacity="0.5" />
    </svg>
  );
}
"@

# 8. DropdownSelect.tsx
WriteFile "components\magasin\DropdownSelect.tsx" @"
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface DropdownSelectProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export default function DropdownSelect({ options, value, onChange, placeholder = 'Selectionner...', label }: DropdownSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selected = options.find(o => o.value === value);

  return (
    <div ref={ref} className="relative">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg bg-white text-left hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span className={selected ? 'text-gray-900' : 'text-gray-400'}>{selected?.label || placeholder}</span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => { onChange(option.value); setIsOpen(false); }}
              className={`w-full px-3 py-2 text-left hover:bg-blue-50 ${option.value === value ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
"@

# 9. OperationCancel.tsx
WriteFile "components\magasin\OperationCancel.tsx" @"
'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

interface OperationCancelProps {
  operationId: string;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}

export default function OperationCancel({ operationId, onConfirm, onCancel }: OperationCancelProps) {
  const [reason, setReason] = useState('');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Annuler l&apos;operation</h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <p className="text-sm text-gray-500 mb-4">Operation #{operationId}</p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Raison de l&apos;annulation..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
          rows={3}
        />
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Retour</button>
          <button
            onClick={() => onConfirm(reason)}
            disabled={!reason.trim()}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            Confirmer l&apos;annulation
          </button>
        </div>
      </div>
    </div>
  );
}
"@

# 10. StockFilter.tsx
WriteFile "components\magasin\StockFilter.tsx" @"
'use client';

import React from 'react';
import { Search, Filter } from 'lucide-react';

interface StockFilterProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  categories?: string[];
}

export default function StockFilter({ searchValue, onSearchChange, categoryFilter, onCategoryChange, categories = [] }: StockFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Rechercher un article..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="relative">
        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <select
          value={categoryFilter}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
        >
          <option value="">Toutes les categories</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>
    </div>
  );
}
"@

# 11. TransactionSearch.tsx
WriteFile "components\magasin\TransactionSearch.tsx" @"
'use client';

import React from 'react';
import { Search, Calendar } from 'lucide-react';

interface TransactionSearchProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  typeFilter: string;
  onTypeChange: (value: string) => void;
}

export default function TransactionSearch({ searchValue, onSearchChange, typeFilter, onTypeChange }: TransactionSearchProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Rechercher une transaction..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <select
          value={typeFilter}
          onChange={(e) => onTypeChange(e.target.value)}
          className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
        >
          <option value="">Tous les types</option>
          <option value="entree">Entree</option>
          <option value="sortie">Sortie</option>
          <option value="transfert">Transfert</option>
        </select>
      </div>
    </div>
  );
}
"@

# 12. MapViewer.tsx
WriteFile "components\map\MapViewer.tsx" @"
'use client';

import React from 'react';
import { MapPin } from 'lucide-react';

interface MapViewerProps {
  latitude?: number;
  longitude?: number;
  zoom?: number;
  markers?: { lat: number; lng: number; label?: string }[];
  className?: string;
}

export default function MapViewer({ latitude, longitude, markers = [], className = '' }: MapViewerProps) {
  return (
    <div className={`relative bg-blue-50 border border-blue-200 rounded-xl overflow-hidden ${className}`} style={{ minHeight: 400 }}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-12 h-12 text-blue-400 mx-auto mb-3" />
          <p className="text-lg font-medium text-blue-700">Carte Interactive</p>
          <p className="text-sm text-blue-500 mt-1">
            {latitude && longitude ? `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` : 'Fonctionnalite de carte en cours de developpement'}
          </p>
          {markers.length > 0 && (
            <p className="text-xs text-blue-400 mt-2">{markers.length} point(s) affiche(s)</p>
          )}
        </div>
      </div>
    </div>
  );
}
"@

# 13. DataTable.tsx
WriteFile "components\shared\DataTable.tsx" @"
'use client';

import React from 'react';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: string;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
}

export default function DataTable<T extends Record<string, any>>({ columns, data, keyField, onRowClick, emptyMessage = 'Aucune donnee' }: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            {columns.map(col => (
              <th key={col.key} className="text-left px-4 py-3 font-medium text-gray-600">{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr
              key={item[keyField] || idx}
              onClick={() => onRowClick?.(item)}
              className={`border-b border-gray-100 ${onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}`}
            >
              {columns.map(col => (
                <td key={col.key} className="px-4 py-3 text-gray-700">
                  {col.render ? col.render(item) : item[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
"@

# 14. EnterpriseDataTable.tsx
WriteFile "components\shared\EnterpriseDataTable.tsx" @"
'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface EnterpriseDataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: string;
  pageSize?: number;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
}

export default function EnterpriseDataTable<T extends Record<string, any>>({ columns, data, keyField, pageSize = 10, onRowClick, emptyMessage = 'Aucune donnee' }: EnterpriseDataTableProps<T>) {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(data.length / pageSize);
  const paginatedData = data.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {columns.map(col => (
                <th key={col.key} className="text-left px-4 py-3 font-semibold text-gray-600 border-b">{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr><td colSpan={columns.length} className="text-center py-12 text-gray-500">{emptyMessage}</td></tr>
            ) : (
              paginatedData.map((item, idx) => (
                <tr
                  key={item[keyField] || idx}
                  onClick={() => onRowClick?.(item)}
                  className={`border-b border-gray-100 hover:bg-blue-50/50 ${onRowClick ? 'cursor-pointer' : ''}`}
                >
                  {columns.map(col => (
                    <td key={col.key} className="px-4 py-3 text-gray-700">
                      {col.render ? col.render(item) : item[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
          <span className="text-sm text-gray-500">Page {page + 1} sur {totalPages}</span>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"><ChevronLeft className="w-4 h-4" /></button>
            <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      )}
    </div>
  );
}
"@

# 15. KeyboardShortcutHandler.tsx
WriteFile "components\shared\KeyboardShortcutHandler.tsx" @"
'use client';

import { useEffect } from 'react';

interface Shortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  action: () => void;
  description?: string;
}

interface KeyboardShortcutHandlerProps {
  shortcuts: Shortcut[];
  children?: React.ReactNode;
}

export default function KeyboardShortcutHandler({ shortcuts, children }: KeyboardShortcutHandlerProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') return;

      for (const shortcut of shortcuts) {
        const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = shortcut.ctrlKey ? e.ctrlKey || e.metaKey : true;
        const shiftMatch = shortcut.shiftKey ? e.shiftKey : true;
        const altMatch = shortcut.altKey ? e.altKey : true;

        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
          e.preventDefault();
          shortcut.action();
          break;
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);

  return <>{children}</>;
}
"@

# 16. PwaInstallPrompt.tsx
WriteFile "components\shared\PwaInstallPrompt.tsx" @"
'use client';

import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

export default function PwaInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      if (!isStandalone && !localStorage.getItem('pwa-dismissed')) {
        setShowPrompt(true);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-xl shadow-lg p-4 max-w-sm z-50">
      <button onClick={dismiss} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
      <div className="flex items-start gap-3">
        <div className="p-2 bg-blue-100 rounded-lg"><Download className="w-5 h-5 text-blue-600" /></div>
        <div>
          <h4 className="font-semibold text-gray-900 text-sm">Installer EVO-LOG</h4>
          <p className="text-xs text-gray-500 mt-1">Installez l&apos;application pour un acces rapide</p>
        </div>
      </div>
    </div>
  );
}
"@

# 17. MapComponent.tsx
WriteFile "app\(app)\transport\carte-live\MapComponent.tsx" @"
'use client';

import React from 'react';
import { MapPin, Truck } from 'lucide-react';

export default function MapComponent() {
  return (
    <div className="relative bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl overflow-hidden" style={{ minHeight: 500 }}>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center shadow-sm">
          <Truck className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800">Carte de suivi en temps reel</h2>
          <p className="text-gray-500 mt-2 max-w-md">Le suivi GPS en temps reel de votre flotte sera disponible ici.</p>
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-blue-600">
            <MapPin className="w-4 h-4" />
            <span>Integration en cours de developpement</span>
          </div>
        </div>
      </div>
    </div>
  );
}
"@

# 18-23. Transport components
WriteFile "components\transport\CreateCamionModal.tsx" @"
'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

interface CreateCamionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export default function CreateCamionModal({ isOpen, onClose, onSubmit }: CreateCamionModalProps) {
  const [formData, setFormData] = useState({ immatriculation: '', marque: '', modele: '', capacite: '', chauffeur: '' });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Nouveau Camion</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Immatriculation</label>
            <input type="text" value={formData.immatriculation} onChange={e => setFormData({...formData, immatriculation: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marque</label>
              <input type="text" value={formData.marque} onChange={e => setFormData({...formData, marque: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Modele</label>
              <input type="text" value={formData.modele} onChange={e => setFormData({...formData, modele: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Capacite (tonnes)</label>
            <input type="number" value={formData.capacite} onChange={e => setFormData({...formData, capacite: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Annuler</button>
          <button onClick={() => onSubmit(formData)} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Creer</button>
        </div>
      </div>
    </div>
  );
}
"@

WriteFile "components\transport\HistoriqueCouplageModal.tsx" @"
'use client';

import React from 'react';
import { X, History } from 'lucide-react';

interface HistoriqueCouplageModalProps {
  isOpen: boolean;
  onClose: () => void;
  couplageId?: string;
}

export default function HistoriqueCouplageModal({ isOpen, onClose }: HistoriqueCouplageModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Historique de couplage</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-3">
          <p className="text-sm text-gray-500 text-center py-8">Aucun historique de couplage disponible</p>
        </div>
      </div>
    </div>
  );
}
"@

WriteFile "components\transport\HseBlockModal.tsx" @"
'use client';

import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface HseBlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBlock: (reason: string) => void;
}

export default function HseBlockModal({ isOpen, onClose, onBlock }: HseBlockModalProps) {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 rounded-lg"><AlertTriangle className="w-6 h-6 text-red-600" /></div>
          <h3 className="text-lg font-semibold text-gray-900">Blocage HSE</h3>
        </div>
        <p className="text-sm text-gray-500 mb-4">Cette action bloquera le vehicule pour des raisons de securite (Hygiene, Securite, Environnement).</p>
        <textarea
          value={reason}
          onChange={e => setReason(e.target.value)}
          placeholder="Motif du blocage HSE..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
          rows={3}
        />
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Annuler</button>
          <button onClick={() => onBlock(reason)} disabled={!reason.trim()} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50">Bloquer</button>
        </div>
      </div>
    </div>
  );
}
"@

WriteFile "components\transport\LiveMap.tsx" @"
'use client';

import React from 'react';
import { MapPin, Navigation } from 'lucide-react';

interface VehiclePosition {
  id: string;
  lat: number;
  lng: number;
  speed?: number;
  driver?: string;
}

interface LiveMapProps {
  vehicles?: VehiclePosition[];
  className?: string;
}

export default function LiveMap({ vehicles = [], className = '' }: LiveMapProps) {
  return (
    <div className={`relative bg-blue-50 border border-blue-200 rounded-xl overflow-hidden ${className}`} style={{ minHeight: 400 }}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <Navigation className="w-12 h-12 text-blue-400 mx-auto mb-3" />
          <p className="text-lg font-medium text-blue-700">Suivi en temps reel</p>
          <p className="text-sm text-blue-500 mt-1">{vehicles.length} vehicule(s) connecte(s)</p>
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-blue-400">
            <MapPin className="w-3 h-3" />
            <span>GPS tracking en cours de configuration</span>
          </div>
        </div>
      </div>
    </div>
  );
}
"@

WriteFile "components\transport\SignaturePadModal.tsx" @"
'use client';

import React, { useRef, useState } from 'react';
import { X, Eraser } from 'lucide-react';

interface SignaturePadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSign: (signatureData: string) => void;
  title?: string;
}

export default function SignaturePadModal({ isOpen, onClose, onSign, title = 'Signature' }: SignaturePadModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      onSign(canvas.toDataURL('image/png'));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <div className="border-2 border-dashed border-gray-300 rounded-lg mb-4">
          <canvas ref={canvasRef} width={450} height={200} className="w-full cursor-crosshair rounded-lg" />
        </div>
        <div className="flex gap-3">
          <button onClick={clearCanvas} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2"><Eraser className="w-4 h-4" /> Effacer</button>
          <button onClick={handleSave} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Valider la signature</button>
        </div>
      </div>
    </div>
  );
}
"@

WriteFile "components\transport\VehiculeDocuments.tsx" @"
'use client';

import React from 'react';
import { FileText, Download, Eye } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: string;
  date: string;
  status: 'valide' | 'expire' | 'bientot_expire';
}

interface VehiculeDocumentsProps {
  vehiculeId: string;
  documents?: Document[];
}

export default function VehiculeDocuments({ documents = [] }: VehiculeDocumentsProps) {
  const statusColors = {
    valide: 'bg-green-100 text-green-800',
    expire: 'bg-red-100 text-red-800',
    bientot_expire: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-blue-600" />
        Documents du vehicule
      </h3>
      {documents.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-8">Aucun document disponible</p>
      ) : (
        <div className="space-y-3">
          {documents.map(doc => (
            <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                  <p className="text-xs text-gray-500">{doc.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[doc.status]}`}>{doc.status}</span>
                <button className="p-1 hover:bg-gray-200 rounded"><Eye className="w-4 h-4 text-gray-500" /></button>
                <button className="p-1 hover:bg-gray-200 rounded"><Download className="w-4 h-4 text-gray-500" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
"@

Write-Output "`nAll 23 files recreated successfully!"
