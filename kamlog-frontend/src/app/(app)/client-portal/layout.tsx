'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Package, FileText, User, LogOut, Hexagon } from 'lucide-react';

export default function ClientPortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const links = [
    { href: '/client-portal', icon: <Package className="w-5 h-5" />, label: 'Mes Expéditions' },
    { href: '/client-portal/factures', icon: <FileText className="w-5 h-5" />, label: 'Mes Factures' },
    { href: '/client-portal/profil', icon: <User className="w-5 h-5" />, label: 'Mon Profil' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Navbar B2B */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Hexagon className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-xl tracking-tight">EVO-LOG <span className="font-medium text-slate-400">B2B</span></span>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            {links.map(link => {
              const active = pathname === link.href;
              return (
                <Link key={link.href} href={link.href} className={`flex items-center gap-2 text-sm font-semibold transition-colors ${active ? 'text-blue-400' : 'text-slate-400 hover:text-white'}`}>
                  {link.icon}
                  {link.label}
                </Link>
              );
            })}
          </nav>
          
          <button className="flex items-center gap-2 text-sm font-semibold text-red-400 hover:text-red-300 transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="hidden md:inline">Déconnexion</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:py-10">
        {children}
      </main>

      {/* Footer B2B */}
      <footer className="bg-white border-t border-slate-200 py-8 text-center">
        <p className="text-sm font-semibold text-slate-500">
          © {new Date().getFullYear()} EVO-LOG Enterprise Management. Espace Client Sécurisé.
        </p>
      </footer>

    </div>
  );
}
