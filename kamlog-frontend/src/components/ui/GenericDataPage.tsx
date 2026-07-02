import React from 'react';
import { Search, Plus, Edit2, Trash2, Eye, Filter, Download, MoreVertical, FileText } from 'lucide-react';
import { TableSkeletonLoader } from '@/components/ui/Loaders';

interface Column {
  key: string;
  label: string;
  render?: (val: any, row: any) => React.ReactNode;
}

interface GenericDataPageProps {
  title: string;
  description: string;
  columns: Column[];
  data: any[];
  isLoading?: boolean;
  onAdd?: () => void;
  onExport?: () => void;
  primaryActionLabel?: string;
  icon?: React.ReactNode;
}

export default function GenericDataPage({
  title,
  description,
  columns,
  data,
  isLoading = false,
  onAdd,
  onExport,
  primaryActionLabel = 'Nouveau',
  icon = <FileText className="w-6 h-6 text-blue-600" />
}: GenericDataPageProps) {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg border border-gray-200 shadow-sm">
            {icon}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h1>
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {onExport && (
            <button 
              onClick={onExport}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" />
              Exporter
            </button>
          )}
          {onAdd && (
            <button 
              onClick={onAdd}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
            >
              <Plus className="w-4 h-4" />
              {primaryActionLabel}
            </button>
          )}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors w-full sm:w-auto">
          <Filter className="w-4 h-4" />
          Filtres Avancés
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
                {columns.map((col, i) => (
                  <th key={col.key} className={`p-4 font-semibold ${i === 0 ? 'pl-6' : ''}`}>
                    {col.label}
                  </th>
                ))}
                <th className="p-4 font-semibold text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length + 1} className="p-6">
                    <TableSkeletonLoader columns={columns.length} rows={5} />
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="p-12 text-center">
                    <div className="mx-auto w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                      <Search className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-gray-900 font-medium">Aucun résultat trouvé</p>
                    <p className="text-gray-500 text-sm mt-1">Essayez d'ajuster vos filtres ou termes de recherche.</p>
                  </td>
                </tr>
              ) : (
                data.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-slate-50 transition-colors group">
                    {columns.map((col, colIndex) => (
                      <td key={col.key} className={`p-4 text-sm text-gray-600 ${colIndex === 0 ? 'pl-6 font-medium text-gray-900' : ''}`}>
                        {col.render ? col.render(row[col.key], row) : row[col.key] || '-'}
                      </td>
                    ))}
                    <td className="p-4 text-right pr-6">
                      <button className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        {!isLoading && data.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Affichage de <span className="font-medium text-gray-900">1</span> à <span className="font-medium text-gray-900">{data.length}</span> sur <span className="font-medium text-gray-900">{data.length}</span> résultats
            </span>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 text-sm border border-gray-200 rounded-md text-gray-400 bg-white cursor-not-allowed">
                Précédent
              </button>
              <button className="px-3 py-1.5 text-sm border border-gray-200 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
