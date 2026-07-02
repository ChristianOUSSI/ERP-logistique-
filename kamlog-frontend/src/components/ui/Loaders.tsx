import React from 'react';

/**
 * FullScreenLoader: Utilisé lors du chargement initial de l'application
 * (ex: validation de session dans layout.tsx)
 */
export const FullScreenLoader = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-surface-container-lowest z-50">
      <div className="relative flex items-center justify-center">
        {/* Cercles de pulsation */}
        <div className="absolute w-24 h-24 bg-primary/20 rounded-full animate-ping" style={{ animationDuration: '2s' }}></div>
        <div className="absolute w-16 h-16 bg-primary/40 rounded-full animate-pulse"></div>
        
        {/* Logo Icon */}
        <div className="relative z-10 w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
          <span className="material-symbols-outlined text-white text-2xl animate-spin" style={{ animationDuration: '3s', animationTimingFunction: 'linear' }}>
            sync
          </span>
        </div>
      </div>
      <div className="mt-8 text-center">
        <h2 className="text-xl font-bold text-on-surface tracking-tight mb-2">KAMLOG EM-ERP</h2>
        <p className="text-sm font-medium text-secondary animate-pulse">Initialisation du système d'entreprise...</p>
      </div>
    </div>
  );
};

/**
 * TableSkeletonLoader: Squelette élégant pour les tableaux de données
 * Utilisé dans GenericDataPage ou tout autre tableau en cours de chargement
 */
export const TableSkeletonLoader = ({ columns = 5, rows = 6 }: { columns?: number, rows?: number }) => {
  return (
    <div className="w-full animate-pulse bg-white rounded-xl border border-outline-variant overflow-hidden">
      {/* Header Squelette */}
      <div className="flex border-b border-outline-variant bg-surface-container-lowest p-4">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={`head-${i}`} className={`h-4 bg-slate-200 rounded ${i === 0 ? 'w-1/4' : 'w-1/6'} mr-4`}></div>
        ))}
      </div>
      {/* Lignes Squelette */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex border-b border-outline-variant p-4 items-center">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div 
              key={`cell-${rowIndex}-${colIndex}`} 
              className={`h-3 bg-slate-100 rounded ${colIndex === 0 ? 'w-1/3' : 'w-1/5'} mr-4`}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
};

/**
 * CardSkeletonLoader: Pour les widgets, KPI, ou cartes du Dashboard
 */
export const CardSkeletonLoader = () => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm animate-pulse flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 bg-slate-200 rounded-xl"></div>
        <div className="w-16 h-6 bg-slate-100 rounded-full"></div>
      </div>
      <div className="mt-auto">
        <div className="w-24 h-3 bg-slate-200 rounded mb-2"></div>
        <div className="w-32 h-8 bg-slate-300 rounded"></div>
      </div>
    </div>
  );
};
