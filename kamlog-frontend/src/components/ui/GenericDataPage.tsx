'use client';

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Search, Plus, Edit2, Trash2, Eye, Filter, Download, X, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
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
  onView?: (row: any) => void;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  primaryActionLabel?: string;
  icon?: React.ReactNode;
  /** Optional KPI cards rendered above the table */
  kpiCards?: React.ReactNode;
  /** Page size for pagination */
  pageSize?: number;
}

// ── Detail Drawer ──────────────────────────────────────────────────────────────
function DetailDrawer({
  row,
  columns,
  onClose,
}: {
  row: any;
  columns: Column[];
  onClose: () => void;
}) {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />
      {/* Drawer */}
      <div
        ref={drawerRef}
        className="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl z-[70] flex flex-col animate-in slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Détail de l&apos;enregistrement</h3>
            <p className="text-sm text-slate-500 mt-0.5">Vue complète des données</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-1">
          {columns.map((col) => (
            <div key={col.key} className="group">
              <div className="flex flex-col sm:flex-row sm:items-start gap-1 py-4 px-4 rounded-xl hover:bg-slate-50 transition-colors">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider min-w-[140px] shrink-0 pt-0.5">
                  {col.label}
                </span>
                <span className="text-sm text-slate-800 font-medium flex-1 break-words">
                  {col.render
                    ? col.render(row[col.key], row)
                    : row[col.key] != null
                    ? String(row[col.key])
                    : <span className="text-slate-300 italic">—</span>}
                </span>
              </div>
              <div className="mx-4 border-b border-slate-100 group-last:border-0" />
            </div>
          ))}
        </div>
        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
          >
            Fermer
          </button>
        </div>
      </div>
    </>
  );
}

// ── CSV Export ──────────────────────────────────────────────────────────────────
function exportToCSV(columns: Column[], data: any[], title: string) {
  const header = columns.map((c) => c.label).join(',');
  const rows = data.map((row) =>
    columns
      .map((c) => {
        const val = row[c.key];
        const str = val != null ? String(val) : '';
        // Escape commas and quotes
        return str.includes(',') || str.includes('"')
          ? `"${str.replace(/"/g, '""')}"`
          : str;
      })
      .join(',')
  );
  const csv = [header, ...rows].join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title.replace(/\s+/g, '_').toLowerCase()}_export.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function GenericDataPage({
  title,
  description,
  columns,
  data,
  isLoading = false,
  onAdd,
  onExport,
  onView,
  onEdit,
  onDelete,
  primaryActionLabel = 'Nouveau',
  icon = <FileText className="w-6 h-6 text-blue-600" />,
  kpiCards,
  pageSize = 15,
}: GenericDataPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [drawerRow, setDrawerRow] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page on search or data change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, data]);

  // ── Client-side search filtering ─────────────────────────────────────────
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    const term = searchTerm.toLowerCase();
    return data.filter((row) =>
      columns.some((col) => {
        const val = row[col.key];
        if (val == null) return false;
        return String(val).toLowerCase().includes(term);
      })
    );
  }, [data, searchTerm, columns]);

  // ── Pagination ───────────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleView = useCallback(
    (row: any) => {
      if (onView) {
        onView(row);
      } else {
        // Default: open the detail drawer
        setDrawerRow(row);
      }
    },
    [onView]
  );

  const handleExport = useCallback(() => {
    if (onExport) {
      onExport();
    } else {
      exportToCSV(columns, filteredData, title);
    }
  }, [onExport, columns, filteredData, title]);

  const hasRowActions = !!(onView || onEdit || onDelete || true); // Always show View

  return (
    <>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white rounded-xl border border-gray-200 shadow-sm">
              {icon}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h1>
              <p className="text-sm text-gray-500 mt-1">{description}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
            >
              <Download className="w-4 h-4" />
              Exporter
            </button>
            {onAdd && (
              <button
                onClick={onAdd}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm shadow-blue-200 hover:shadow-md hover:shadow-blue-200"
              >
                <Plus className="w-4 h-4" />
                {primaryActionLabel}
              </button>
            )}
          </div>
        </div>

        {/* KPI Cards */}
        {kpiCards && <div className="mb-6">{kpiCards}</div>}

        {/* Filters Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher dans toutes les colonnes..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm bg-gray-50/50 focus:bg-white"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            {!isLoading && (
              <span className="text-sm text-gray-500">
                <span className="font-semibold text-gray-800">{filteredData.length}</span>
                {' '}résultat{filteredData.length !== 1 ? 's' : ''}
                {searchTerm && (
                  <span className="text-gray-400"> sur {data.length}</span>
                )}
              </span>
            )}
            <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors">
              <Filter className="w-4 h-4" />
              Filtres
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
                  {columns.map((col, i) => (
                    <th key={col.key} className={`p-4 font-semibold ${i === 0 ? 'pl-6' : ''}`}>
                      {col.label}
                    </th>
                  ))}
                  {hasRowActions && (
                    <th className="p-4 font-semibold text-right pr-6 w-[140px]">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  <tr>
                    <td colSpan={columns.length + (hasRowActions ? 1 : 0)} className="p-6">
                      <TableSkeletonLoader columns={columns.length} rows={5} />
                    </td>
                  </tr>
                ) : paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length + (hasRowActions ? 1 : 0)} className="p-12 text-center">
                      <div className="mx-auto w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
                        <Search className="w-6 h-6 text-gray-300" />
                      </div>
                      <p className="text-gray-900 font-semibold">Aucun résultat trouvé</p>
                      <p className="text-gray-500 text-sm mt-1.5">
                        {searchTerm
                          ? `Aucun résultat pour « ${searchTerm} ». Essayez un autre terme.`
                          : 'Aucune donnée disponible pour le moment.'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className="hover:bg-blue-50/30 transition-colors group cursor-pointer"
                      onClick={() => handleView(row)}
                    >
                      {columns.map((col, colIndex) => (
                        <td
                          key={col.key}
                          className={`p-4 text-sm text-gray-600 ${colIndex === 0 ? 'pl-6 font-medium text-gray-900' : ''}`}
                        >
                          {col.render ? col.render(row[col.key], row) : row[col.key] || '-'}
                        </td>
                      ))}
                      {hasRowActions && (
                        <td className="p-4 text-right pr-6">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleView(row);
                              }}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                              title="Voir le détail"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {onEdit && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEdit(row);
                                }}
                                className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                                title="Modifier"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                            )}
                            {onDelete && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDelete(row);
                                }}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                title="Supprimer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {!isLoading && filteredData.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Affichage de{' '}
                <span className="font-semibold text-gray-800">
                  {(currentPage - 1) * pageSize + 1}
                </span>{' '}
                à{' '}
                <span className="font-semibold text-gray-800">
                  {Math.min(currentPage * pageSize, filteredData.length)}
                </span>{' '}
                sur{' '}
                <span className="font-semibold text-gray-800">{filteredData.length}</span> résultats
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg border text-sm transition-all ${
                    currentPage === 1
                      ? 'border-gray-100 text-gray-300 bg-white cursor-not-allowed'
                      : 'border-gray-200 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let page: number;
                  if (totalPages <= 5) {
                    page = i + 1;
                  } else if (currentPage <= 3) {
                    page = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    page = totalPages - 4 + i;
                  } else {
                    page = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                        page === currentPage
                          ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg border text-sm transition-all ${
                    currentPage === totalPages
                      ? 'border-gray-100 text-gray-300 bg-white cursor-not-allowed'
                      : 'border-gray-200 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detail Drawer */}
      {drawerRow && (
        <DetailDrawer row={drawerRow} columns={columns} onClose={() => setDrawerRow(null)} />
      )}
    </>
  );
}
