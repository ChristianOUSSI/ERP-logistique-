"use client";

import React, { useState } from "react";
import { Download, Search, ChevronDown, ChevronUp, Filter } from "lucide-react";

export interface ColumnDef<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
}

interface EnterpriseDataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  title?: string;
  searchPlaceholder?: string;
  exportFileName?: string;
}

export function EnterpriseDataTable<T extends Record<string, any>>({
  data,
  columns,
  title,
  searchPlaceholder = "Rechercher...",
  exportFileName = "export-evolog.csv",
}: EnterpriseDataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Filtering
  const filteredData = data.filter((row) =>
    columns.some((col) => {
      const val = row[col.key as string];
      return val
        ? String(val).toLowerCase().includes(searchTerm.toLowerCase())
        : false;
    })
  );

  // Sorting
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortKey) return 0;
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const handleExportCSV = () => {
    if (!data.length) return;
    const headers = columns.map((c) => c.header).join(",");
    const rows = sortedData.map((row) =>
      columns.map((c) => `"${row[c.key as string] ?? ""}"`).join(",")
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", exportFileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-xl shadow-lg overflow-hidden">
      {/* Top Header Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 gap-3 border-b border-slate-800 bg-slate-950/40">
        {title && (
          <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            {title}
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-mono">
              {sortedData.length} lignes
            </span>
          </h3>
        )}

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="text-xs uppercase bg-slate-950/80 text-slate-400 sticky top-0 z-10 border-b border-slate-800">
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  onClick={() => col.sortable !== false && handleSort(String(col.key))}
                  className={`px-4 py-3 font-semibold ${
                    col.sortable !== false ? "cursor-pointer select-none hover:text-slate-200" : ""
                  }`}
                >
                  <div className="flex items-center gap-1">
                    {col.header}
                    {sortKey === String(col.key) &&
                      (sortOrder === "asc" ? (
                        <ChevronUp className="w-3.5 h-3.5 text-indigo-400" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-indigo-400" />
                      ))}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {sortedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-slate-500"
                >
                  Aucune donnée disponible
                </td>
              </tr>
            ) : (
              sortedData.map((row, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-slate-800/40 transition-colors"
                >
                  {columns.map((col) => (
                    <td key={String(col.key)} className="px-4 py-3 text-slate-200">
                      {col.render ? col.render(row) : (row[col.key as string] ?? "-")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
