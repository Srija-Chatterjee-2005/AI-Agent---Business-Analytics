import React, { useState } from 'react';
import { SavedAnalysisRecord, SupportTicket, TicketFilterState, OperationsKpis, ImprovementBrief } from '../../types/operations';
import {
  Archive,
  Save,
  Download,
  Trash2,
  Edit2,
  FolderOpen,
  CheckCircle2,
  Clock,
  HardDrive,
  FileCheck2,
  Layers,
  ArrowRight,
  ShieldCheck,
  Plus
} from 'lucide-react';

interface SavedAnalysesViewProps {
  savedAnalyses: SavedAnalysisRecord[];
  onLoadAnalysis: (record: SavedAnalysisRecord) => void;
  onSaveCurrentAnalysis: (title: string, notes?: string) => void;
  onRenameAnalysis: (id: string, newTitle: string) => void;
  onDeleteAnalysis: (id: string) => void;
  currentTicketCount: number;
  currentDatasetName: string;
}

export const SavedAnalysesView: React.FC<SavedAnalysesViewProps> = ({
  savedAnalyses,
  onLoadAnalysis,
  onSaveCurrentAnalysis,
  onRenameAnalysis,
  onDeleteAnalysis,
  currentTicketCount,
  currentDatasetName
}) => {
  const [isSavingModalOpen, setIsSavingModalOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>(`Analysis - ${new Date().toLocaleDateString()}`);
  const [newNotes, setNewNotes] = useState<string>('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitleInput, setEditTitleInput] = useState<string>('');

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onSaveCurrentAnalysis(newTitle.trim(), newNotes.trim());
    setIsSavingModalOpen(false);
    setNewTitle(`Analysis - ${new Date().toLocaleDateString()}`);
    setNewNotes('');
  };

  const startRename = (record: SavedAnalysisRecord) => {
    setEditingId(record.id);
    setEditTitleInput(record.title);
  };

  const handleSaveRename = (id: string) => {
    if (editTitleInput.trim()) {
      onRenameAnalysis(id, editTitleInput.trim());
    }
    setEditingId(null);
  };

  const handleDownloadAnalysis = (record: SavedAnalysisRecord) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(record, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `${record.title.replace(/\s+/g, '_')}_snapshot.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  };

  return (
    <div className="space-y-6 text-slate-800">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-2">
            <HardDrive className="w-3.5 h-3.5 text-teal-600" />
            <span>Browser-Native Local Workspace</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Saved Operations Analyses & Reports
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Manage, load, rename, and export offline snapshots stored strictly inside your browser sandbox.
          </p>
        </div>

        <button
          onClick={() => setIsSavingModalOpen(true)}
          className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Save Current Workspace Snapshot</span>
        </button>
      </div>

      {/* Privacy Notice Card */}
      <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-2xl flex items-start space-x-3 text-xs text-teal-900">
        <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="font-semibold text-teal-950">Air-Gapped Local Storage:</strong> All saved analyses, filter states, and reports are persisted directly to your browser's IndexedDB / LocalStorage. Zero ticket data or operational metrics are ever transmitted to an external database.
        </div>
      </div>

      {/* Empty State */}
      {savedAnalyses.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
            <Archive className="w-7 h-7" />
          </div>
          <h3 className="font-extrabold text-base text-slate-800">
            No Saved Analyses Yet
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            You haven't saved any analysis snapshots. Click "Save Current Workspace Snapshot" above to preserve your active dataset ({currentDatasetName}), active filter queries, and KPI calculations.
          </p>
          <button
            onClick={() => setIsSavingModalOpen(true)}
            className="px-4 py-2 bg-slate-900 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition"
          >
            Save Initial Snapshot
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedAnalyses.map(record => {
            const isEditing = editingId === record.id;

            return (
              <div
                key={record.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:border-teal-300 transition"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{record.dateSaved}</span>
                    </span>
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
                      {record.ticketCount} tickets
                    </span>
                  </div>

                  {/* Title or Edit Input */}
                  {isEditing ? (
                    <div className="flex items-center space-x-2 my-2">
                      <input
                        type="text"
                        value={editTitleInput}
                        onChange={(e) => setEditTitleInput(e.target.value)}
                        className="flex-1 text-xs font-bold border border-teal-500 rounded-lg p-1.5 focus:outline-none"
                      />
                      <button
                        onClick={() => handleSaveRename(record.id)}
                        className="px-2 py-1 bg-teal-600 text-white text-xs font-bold rounded"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <h3 className="font-extrabold text-sm text-slate-900 mb-1 leading-snug">
                        {record.title}
                      </h3>
                      <button
                        onClick={() => startRename(record)}
                        className="text-slate-400 hover:text-slate-600 p-1"
                        title="Rename analysis"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <p className="text-[11px] text-slate-500 font-mono mb-3">
                    Dataset: {record.datasetName}
                  </p>

                  {record.notes && (
                    <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 mb-3 italic">
                      "{record.notes}"
                    </p>
                  )}

                  {/* Metrics Badges */}
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-slate-100">
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <span className="text-[10px] text-slate-400 block uppercase">Backlog</span>
                      <span className="font-bold text-slate-800">{record.kpis.openBacklog}</span>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <span className="text-[10px] text-slate-400 block uppercase">SLA Breach %</span>
                      <span className="font-bold text-slate-800">{record.kpis.slaBreachRatePct}%</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => onLoadAnalysis(record)}
                    className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-lg text-xs font-bold flex items-center space-x-1 transition"
                  >
                    <FolderOpen className="w-3.5 h-3.5 text-teal-600" />
                    <span>Load Workspace</span>
                  </button>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleDownloadAnalysis(record)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                      title="Download Snapshot JSON"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteAnalysis(record.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete Snapshot"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Save Modal */}
      {isSavingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center space-x-2">
                <Save className="w-4 h-4 text-teal-600" />
                <span>Save Workspace Analysis Snapshot</span>
              </h3>
              <button onClick={() => setIsSavingModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Analysis Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-xs font-medium rounded-xl p-2.5 border border-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Operational Notes (Optional)</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. Pre-shift Monday triage snapshot before sprint planning..."
                  className="w-full text-xs font-medium rounded-xl p-2.5 border border-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-500 font-mono space-y-1">
                <div>Dataset: {currentDatasetName}</div>
                <div>Records: {currentTicketCount} tickets</div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSavingModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition"
                >
                  Save to Browser
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
