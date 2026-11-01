import React, { useState } from 'react';
import { SupportTicket } from '../../types/operations';
import {
  Table,
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Download,
  AlertTriangle,
  CheckCircle2,
  Filter,
  FileSpreadsheet
} from 'lucide-react';

interface TicketDataPreviewProps {
  tickets: SupportTicket[];
  fileName: string;
}

export const TicketDataPreview: React.FC<TicketDataPreviewProps> = ({
  tickets,
  fileName
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortField, setSortField] = useState<keyof SupportTicket>('date_created');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const rowsPerPage = 12;

  const handleSort = (field: keyof SupportTicket) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const filtered = tickets.filter(t => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      t.ticket_id.toLowerCase().includes(term) ||
      t.category.toLowerCase().includes(term) ||
      t.assigned_team.toLowerCase().includes(term) ||
      t.priority.toLowerCase().includes(term) ||
      t.status.toLowerCase().includes(term)
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];
    if (valA === null || valA === undefined) return 1;
    if (valB === null || valB === undefined) return -1;
    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sorted.length / rowsPerPage) || 1;
  const paginated = sorted.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 text-slate-800">
      {/* Table Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
            <Table className="w-4 h-4 text-teal-600" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">
              Support Ticket Data Preview
            </h3>
            <p className="text-xs text-slate-500 font-mono">
              {fileName} &bull; {filtered.length} of {tickets.length} records matching
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by ID, category, team..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-50 text-slate-800 text-xs pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 w-48 sm:w-64"
            />
          </div>

          <a
            href={`/samples/${fileName.includes('csv') ? fileName : 'support_tickets.csv'}`}
            download={fileName.includes('csv') ? fileName : 'support_tickets.csv'}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">Download Active</span>
          </a>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase font-mono text-[10px]">
              <th className="p-2.5 cursor-pointer hover:text-slate-800" onClick={() => handleSort('ticket_id')}>
                <div className="flex items-center space-x-1">
                  <span>Ticket ID</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="p-2.5 cursor-pointer hover:text-slate-800" onClick={() => handleSort('date_created')}>
                <div className="flex items-center space-x-1">
                  <span>Date Created</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="p-2.5 cursor-pointer hover:text-slate-800" onClick={() => handleSort('category')}>
                <div className="flex items-center space-x-1">
                  <span>Category</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="p-2.5 cursor-pointer hover:text-slate-800" onClick={() => handleSort('priority')}>
                <div className="flex items-center space-x-1">
                  <span>Priority</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="p-2.5 cursor-pointer hover:text-slate-800" onClick={() => handleSort('assigned_team')}>
                <div className="flex items-center space-x-1">
                  <span>Team</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="p-2.5 cursor-pointer hover:text-slate-800" onClick={() => handleSort('status')}>
                <div className="flex items-center space-x-1">
                  <span>Status</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="p-2.5 cursor-pointer hover:text-slate-800 text-right" onClick={() => handleSort('response_time_hrs')}>
                <div className="flex items-center justify-end space-x-1">
                  <span>Resp (h)</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="p-2.5 cursor-pointer hover:text-slate-800 text-right" onClick={() => handleSort('resolution_time_hrs')}>
                <div className="flex items-center justify-end space-x-1">
                  <span>Res / SLA Target</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="p-2.5 text-center cursor-pointer hover:text-slate-800" onClick={() => handleSort('satisfaction_score')}>
                <div className="flex items-center justify-center space-x-1">
                  <span>CSAT</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="p-2.5 text-center">Reopen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
            {paginated.map((t) => {
              const isBreached = t.resolution_time_hrs > t.sla_target_hrs;
              const isClosed = t.status === 'Resolved' || t.status === 'Closed';

              return (
                <tr key={t.ticket_id} className="hover:bg-slate-50 transition">
                  <td className="p-2.5 font-bold text-teal-800">{t.ticket_id}</td>
                  <td className="p-2.5 text-slate-500 whitespace-nowrap">{t.date_created}</td>
                  <td className="p-2.5 font-sans font-medium text-slate-800 truncate max-w-[140px]" title={t.category}>
                    {t.category}
                  </td>
                  <td className="p-2.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      t.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                      t.priority === 'High' ? 'bg-amber-100 text-amber-800' :
                      t.priority === 'Medium' ? 'bg-cyan-100 text-cyan-800' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {t.priority}
                    </span>
                  </td>
                  <td className="p-2.5 font-sans text-slate-600 text-xs whitespace-nowrap">{t.assigned_team}</td>
                  <td className="p-2.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-semibold ${
                      t.status === 'Resolved' || t.status === 'Closed' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                      t.status === 'In Progress' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                      t.status === 'Open' ? 'bg-red-50 text-red-800 border border-red-200' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="p-2.5 text-right text-slate-500">{t.response_time_hrs}h</td>
                  <td className="p-2.5 text-right font-semibold">
                    <span className={isBreached ? 'text-red-600 font-bold' : 'text-slate-800'}>
                      {t.resolution_time_hrs}h
                    </span>
                    <span className="text-slate-400 font-normal"> / {t.sla_target_hrs}h</span>
                    {isBreached && (
                      <span className="ml-1 text-[9px] px-1 rounded bg-red-100 text-red-700 font-bold">
                        SLA
                      </span>
                    )}
                  </td>
                  <td className="p-2.5 text-center font-bold text-slate-800">
                    {t.satisfaction_score !== null ? `${t.satisfaction_score}★` : '-'}
                  </td>
                  <td className="p-2.5 text-center text-slate-500 font-bold">
                    {t.reopened_count > 0 ? (
                      <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px]">
                        {t.reopened_count}
                      </span>
                    ) : '0'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
        <span>
          Showing {paginated.length} rows &bull; Page {currentPage} of {totalPages}
        </span>

        <div className="flex items-center space-x-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-mono text-slate-800 font-bold px-2">
            {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
