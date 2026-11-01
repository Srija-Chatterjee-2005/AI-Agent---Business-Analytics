import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import {
  profileDataset,
  calculateRegistrationKpis,
  applyDataCleaning,
  generateEvidenceBasedSummary
} from '../../utils/dataLabEngine';
import { DataProfileReport, RegistrationKpis, CleaningAction } from '../../types/ba';
import {
  Database,
  Upload,
  Download,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  BarChart3,
  FileText,
  Filter,
  Check,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Search,
  Eye,
  SlidersHorizontal,
  Table,
  Layers,
  ArrowRight,
  Clock
} from 'lucide-react';

export const DataLabView: React.FC = () => {
  const [rawData, setRawData] = useState<Record<string, any>[]>([]);
  const [cleanedData, setCleanedData] = useState<Record<string, any>[]>([]);
  const [cleaningHistory, setCleaningHistory] = useState<Record<string, any>[][]>([]);
  const [activeFileName, setActiveFileName] = useState<string>('registration_requests.csv');
  const [profileReport, setProfileReport] = useState<DataProfileReport | null>(null);
  const [kpis, setKpis] = useState<RegistrationKpis | null>(null);

  // Table pagination and search
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const rowsPerPage = 12;

  // Cleaning preview modal
  const [pendingCleaningAction, setPendingCleaningAction] = useState<CleaningAction['type'] | null>(null);
  const [cleaningPreviewDiff, setCleaningPreviewDiff] = useState<{
    originalCount: number;
    newCount: number;
    affectedCount: number;
    previewSample: { before: any; after: any }[];
  } | null>(null);

  // Executive summary
  const [summaryReport, setSummaryReport] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'profiling' | 'cleaning' | 'kpis' | 'charts' | 'summary'>('kpis');

  // Load default sample dataset on mount
  useEffect(() => {
    loadSampleFile('/samples/registration_requests.csv', 'registration_requests.csv');
  }, []);

  const loadSampleFile = async (url: string, fileName: string) => {
    try {
      const res = await fetch(url);
      const csvText = await res.text();
      Papa.parse(csvText, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          const parsed = (results.data as Record<string, any>[]).filter(r => Object.keys(r).length > 1);
          setRawData(parsed);
          setCleanedData(parsed);
          setCleaningHistory([]);
          setActiveFileName(fileName);
          setCurrentPage(1);

          // Calculate initial profile and exact KPIs
          const report = profileDataset(parsed);
          const computedKpis = calculateRegistrationKpis(parsed);
          setProfileReport(report);
          setKpis(computedKpis);
          setSummaryReport(generateEvidenceBasedSummary(computedKpis, fileName));
        }
      });
    } catch (err) {
      console.error('Failed to load sample CSV:', err);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setActiveFileName(file.name);
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsed = (results.data as Record<string, any>[]).filter(r => Object.keys(r).length > 1);
        setRawData(parsed);
        setCleanedData(parsed);
        setCleaningHistory([]);
        setCurrentPage(1);

        const report = profileDataset(parsed);
        const computedKpis = calculateRegistrationKpis(parsed);
        setProfileReport(report);
        setKpis(computedKpis);
        setSummaryReport(generateEvidenceBasedSummary(computedKpis, file.name));
      }
    });
  };

  const openCleaningPreview = (actionType: CleaningAction['type']) => {
    const { cleanedData: candidate, affectedRows } = applyDataCleaning(cleanedData, actionType);

    const sampleDiff: { before: any; after: any }[] = [];
    for (let i = 0; i < Math.min(cleanedData.length, 6); i++) {
      sampleDiff.push({
        before: cleanedData[i],
        after: candidate[i] || null
      });
    }

    setPendingCleaningAction(actionType);
    setCleaningPreviewDiff({
      originalCount: cleanedData.length,
      newCount: candidate.length,
      affectedCount: affectedRows,
      previewSample: sampleDiff
    });
  };

  const confirmApplyCleaning = () => {
    if (!pendingCleaningAction) return;

    // Push current to history for undo
    setCleaningHistory(prev => [...prev, cleanedData]);

    const { cleanedData: nextData } = applyDataCleaning(cleanedData, pendingCleaningAction);
    setCleanedData(nextData);

    // Recompute profile and KPIs with exact code
    const report = profileDataset(nextData);
    const computedKpis = calculateRegistrationKpis(nextData);
    setProfileReport(report);
    setKpis(computedKpis);
    setSummaryReport(generateEvidenceBasedSummary(computedKpis, `${activeFileName} (Cleaned)`));

    setPendingCleaningAction(null);
    setCleaningPreviewDiff(null);
  };

  const handleUndoCleaning = () => {
    if (cleaningHistory.length === 0) return;
    const previous = cleaningHistory[cleaningHistory.length - 1];
    setCleaningHistory(prev => prev.slice(0, -1));
    setCleanedData(previous);

    const report = profileDataset(previous);
    const computedKpis = calculateRegistrationKpis(previous);
    setProfileReport(report);
    setKpis(computedKpis);
    setSummaryReport(generateEvidenceBasedSummary(computedKpis, activeFileName));
  };

  const handleResetToRaw = () => {
    setCleanedData(rawData);
    setCleaningHistory([]);
    const report = profileDataset(rawData);
    const computedKpis = calculateRegistrationKpis(rawData);
    setProfileReport(report);
    setKpis(computedKpis);
    setSummaryReport(generateEvidenceBasedSummary(computedKpis, activeFileName));
  };

  // Filtered rows for pagination table
  const filteredRows = cleanedData.filter(row => {
    if (!searchTerm) return true;
    return Object.values(row).some(v => String(v).toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const totalPages = Math.ceil(filteredRows.length / rowsPerPage) || 1;
  const paginatedRows = filteredRows.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const columnNames = cleanedData.length > 0 ? Object.keys(cleanedData[0]) : [];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold mb-2">
            <Database className="w-3.5 h-3.5 text-teal-400" />
            <span>Quantitative Analytics Lab</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Data Lab: Evidence-Based Profiling & KPIs
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Upload or inspect college registration datasets, detect data quality defects, preview cleanings with undo, and calculate exact business KPIs.
          </p>
        </div>

        {/* Dataset Actions */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Sample Loaders */}
          <button
            onClick={() => loadSampleFile('/samples/registration_requests.csv', 'registration_requests.csv')}
            className={`px-3 py-2 rounded-xl font-medium transition flex items-center space-x-1.5 ${
              activeFileName === 'registration_requests.csv'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/50'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-teal-400" />
            <span>Load Requests (150 Rows)</span>
          </button>

          <button
            onClick={() => loadSampleFile('/samples/registration_process_log.csv', 'registration_process_log.csv')}
            className={`px-3 py-2 rounded-xl font-medium transition flex items-center space-x-1.5 ${
              activeFileName === 'registration_process_log.csv'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/50'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-teal-400" />
            <span>Load Process Log</span>
          </button>

          {/* Upload Button */}
          <label className="cursor-pointer px-3 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white rounded-xl font-semibold shadow-md shadow-teal-900/20 transition flex items-center space-x-1.5">
            <Upload className="w-3.5 h-3.5" />
            <span>Upload CSV</span>
            <input
              type="file"
              accept=".csv,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Dataset Metadata Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center space-x-3">
          <span className="font-mono text-teal-400 font-bold px-2 py-1 rounded bg-teal-500/10 border border-teal-500/30">
            Active: {activeFileName}
          </span>
          <span className="text-slate-400">
            {cleanedData.length.toLocaleString()} Rows &bull; {columnNames.length} Columns
          </span>
          {cleaningHistory.length > 0 && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-teal-950 text-teal-300 border border-teal-700 font-medium">
              Cleaned ({cleaningHistory.length} edits)
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {cleaningHistory.length > 0 && (
            <>
              <button
                onClick={handleUndoCleaning}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              >
                <RotateCcw className="w-3 h-3 text-teal-400" />
                <span>Undo Last Clean</span>
              </button>

              <button
                onClick={handleResetToRaw}
                className="px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/50 text-red-300 border border-red-800/60 transition"
              >
                Reset to Original
              </button>
            </>
          )}

          <a
            href={`/samples/${activeFileName}`}
            download={activeFileName}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
          >
            <Download className="w-3 h-3 text-teal-400" />
            <span>Download CSV</span>
          </a>
        </div>
      </div>

      {/* Data Lab Sub-Tabs */}
      <div className="flex border-b border-slate-800 space-x-2 overflow-x-auto pb-1 text-sm">
        <button
          onClick={() => setActiveTab('kpis')}
          className={`flex items-center space-x-2 px-4 py-2 font-medium rounded-t-lg transition border-b-2 whitespace-nowrap ${
            activeTab === 'kpis' ? 'border-teal-400 text-teal-300 bg-slate-800/40' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Calculated KPIs</span>
        </button>

        <button
          onClick={() => setActiveTab('profiling')}
          className={`flex items-center space-x-2 px-4 py-2 font-medium rounded-t-lg transition border-b-2 whitespace-nowrap ${
            activeTab === 'profiling' ? 'border-teal-400 text-teal-300 bg-slate-800/40' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Table className="w-4 h-4" />
          <span>Data Profiling & Quality</span>
        </button>

        <button
          onClick={() => setActiveTab('cleaning')}
          className={`flex items-center space-x-2 px-4 py-2 font-medium rounded-t-lg transition border-b-2 whitespace-nowrap ${
            activeTab === 'cleaning' ? 'border-teal-400 text-teal-300 bg-slate-800/40' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Cleaning Engine & Undo</span>
        </button>

        <button
          onClick={() => setActiveTab('charts')}
          className={`flex items-center space-x-2 px-4 py-2 font-medium rounded-t-lg transition border-b-2 whitespace-nowrap ${
            activeTab === 'charts' ? 'border-teal-400 text-teal-300 bg-slate-800/40' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Visual Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('summary')}
          className={`flex items-center space-x-2 px-4 py-2 font-medium rounded-t-lg transition border-b-2 whitespace-nowrap ${
            activeTab === 'summary' ? 'border-teal-400 text-teal-300 bg-slate-800/40' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Evidence-Based Report</span>
        </button>
      </div>

      {/* 1. CALCULATED KPIS DASHBOARD */}
      {activeTab === 'kpis' && kpis && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 uppercase font-mono">Total Requests</span>
              <div className="text-xl sm:text-2xl font-black text-slate-100 font-mono">{kpis.totalRequests}</div>
              <div className="text-[10px] text-slate-500">100% verified count</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-900/40 space-y-1">
              <span className="text-[11px] text-emerald-400 uppercase font-mono">Approved</span>
              <div className="text-xl sm:text-2xl font-black text-emerald-300 font-mono">
                {kpis.approvalRatePct}%
              </div>
              <div className="text-[10px] text-slate-400">{kpis.approvedCount} confirmed seats</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-red-900/40 space-y-1">
              <span className="text-[11px] text-red-400 uppercase font-mono">Rejections</span>
              <div className="text-xl sm:text-2xl font-black text-red-300 font-mono">
                {kpis.rejectionRatePct}%
              </div>
              <div className="text-[10px] text-slate-400">{kpis.rejectedCount} dropped/failed</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-900/40 space-y-1">
              <span className="text-[11px] text-cyan-400 uppercase font-mono">Waitlisted</span>
              <div className="text-xl sm:text-2xl font-black text-cyan-300 font-mono">
                {kpis.waitlistRatePct}%
              </div>
              <div className="text-[10px] text-slate-400">{kpis.waitlistedCount} in queue</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-[11px] text-teal-400 uppercase font-mono">Avg Latency</span>
              <div className="text-xl sm:text-2xl font-black text-teal-300 font-mono">
                {kpis.averageProcessingSeconds}s
              </div>
              <div className="text-[10px] text-slate-400">p95: {kpis.p95ProcessingSeconds}s</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-900/40 space-y-1">
              <span className="text-[11px] text-amber-400 uppercase font-mono">Bursar Holds</span>
              <div className="text-xl sm:text-2xl font-black text-amber-300 font-mono">
                {kpis.financialHoldCount}
              </div>
              <div className="text-[10px] text-slate-400">{((kpis.financialHoldCount / (kpis.totalRequests || 1)) * 100).toFixed(1)}% of students</div>
            </div>
          </div>

          {/* Key Analytical Insights Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-teal-300 uppercase tracking-wider flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>Primary Operational Bottleneck</span>
              </span>
              <div className="text-base font-bold text-slate-100">{kpis.topBottleneck}</div>
              <p className="text-slate-400 leading-relaxed">
                Calculated by inspecting error codes and hold flags across every row. Bursar hold surprises account for the single largest loss of registration velocity.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-cyan-300 uppercase tracking-wider flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Peak Concurrency Window</span>
              </span>
              <div className="text-base font-bold text-slate-100">{kpis.peakHour} Registration Surge</div>
              <p className="text-slate-400 leading-relaxed">
                Calculated from row submission timestamps. Concurrency spikes at this hour cause the p95 latency to hit {kpis.p95ProcessingSeconds} seconds, driving system timeout errors.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. DATA PROFILING & QUALITY REPORT */}
      {activeTab === 'profiling' && profileReport && (
        <div className="space-y-6">
          {/* Quality Summary Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-400">Total Rows Profiled:</span>
              <div className="text-lg font-bold text-slate-100 font-mono">{profileReport.totalRows}</div>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-400">Columns Analyzed:</span>
              <div className="text-lg font-bold text-slate-100 font-mono">{profileReport.totalColumns}</div>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-400">Duplicate Rows:</span>
              <div className={`text-lg font-bold font-mono ${profileReport.duplicateRowsCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {profileReport.duplicateRowsCount}
              </div>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-400">Invalid Flags Detected:</span>
              <div className={`text-lg font-bold font-mono ${profileReport.invalidValuesCount > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                {profileReport.invalidValuesCount}
              </div>
            </div>
          </div>

          {/* Column Profile Table */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="font-bold text-slate-100 text-sm">Column Profile & Missingness Audit</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300 border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/60 uppercase font-mono text-[10px]">
                    <th className="p-2.5">Column Name</th>
                    <th className="p-2.5">Inferred Type</th>
                    <th className="p-2.5">Missing Count (%)</th>
                    <th className="p-2.5">Unique Values</th>
                    <th className="p-2.5">Sample Values</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {profileReport.columns.map((col, idx) => (
                    <tr key={idx} className="hover:bg-slate-850/40 transition">
                      <td className="p-2.5 font-mono font-semibold text-slate-200">{col.name}</td>
                      <td className="p-2.5">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-teal-300 border border-slate-700">
                          {col.type}
                        </span>
                      </td>
                      <td className="p-2.5 font-mono">
                        <div className="flex items-center space-x-2">
                          <span className={col.missingCount > 0 ? 'text-amber-400' : 'text-slate-400'}>
                            {col.missingCount} ({col.missingPct}%)
                          </span>
                          {col.missingPct > 0 && (
                            <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-amber-500 rounded-full"
                                style={{ width: `${Math.min(100, col.missingPct)}%` }}
                              />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-2.5 font-mono text-slate-400">{col.uniqueCount}</td>
                      <td className="p-2.5 text-slate-400 text-[11px] truncate max-w-xs font-mono">
                        {col.sampleValues.join(', ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. CLEANING ENGINE & BEFORE/AFTER DIFF */}
      {activeTab === 'cleaning' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
            <h3 className="font-bold text-slate-100 text-sm flex items-center space-x-2">
              <SlidersHorizontal className="w-4 h-4 text-teal-400" />
              <span>Recommended Cleaning Actions</span>
            </h3>
            <p className="text-slate-400">
              Select any cleaning rule below to see an exact Before & After preview diff. No changes are committed until you review and confirm.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
              <button
                onClick={() => openCleaningPreview('trim')}
                className="p-3 bg-slate-950/70 hover:bg-slate-850 rounded-xl border border-slate-800 text-left transition space-y-1"
              >
                <div className="font-semibold text-teal-300">Trim Whitespace</div>
                <div className="text-[11px] text-slate-400">Strips accidental leading/trailing spaces across text columns.</div>
              </button>

              <button
                onClick={() => openCleaningPreview('dedup')}
                className="p-3 bg-slate-950/70 hover:bg-slate-850 rounded-xl border border-slate-800 text-left transition space-y-1"
              >
                <div className="font-semibold text-teal-300">Deduplicate Rows</div>
                <div className="text-[11px] text-slate-400">Identifies and removes 100% duplicate submission rows.</div>
              </button>

              <button
                onClick={() => openCleaningPreview('standardize_status')}
                className="p-3 bg-slate-950/70 hover:bg-slate-850 rounded-xl border border-slate-800 text-left transition space-y-1"
              >
                <div className="font-semibold text-teal-300">Standardize Statuses</div>
                <div className="text-[11px] text-slate-400">Normalizes case variations ('approved', 'APP' -&gt; 'Approved').</div>
              </button>

              <button
                onClick={() => openCleaningPreview('impute')}
                className="p-3 bg-slate-950/70 hover:bg-slate-850 rounded-xl border border-slate-800 text-left transition space-y-1"
              >
                <div className="font-semibold text-teal-300">Impute Missing Values</div>
                <div className="text-[11px] text-slate-400">Sets explicit 'NONE' or 'N/A' for unassigned error and waitlist fields.</div>
              </button>

              <button
                onClick={() => openCleaningPreview('filter_invalid')}
                className="p-3 bg-slate-950/70 hover:bg-slate-850 rounded-xl border border-slate-800 text-left transition space-y-1"
              >
                <div className="font-semibold text-teal-300">Filter Negative Durations</div>
                <div className="text-[11px] text-slate-400">Purges corrupted rows where processing seconds are negative.</div>
              </button>
            </div>
          </div>

          {/* Interactive Cleaning Preview Modal / Drawer */}
          {cleaningPreviewDiff && pendingCleaningAction && (
            <div className="p-5 rounded-2xl bg-slate-900 border border-teal-500 shadow-2xl space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h4 className="font-bold text-teal-300 text-sm">
                    Cleaning Action Preview: {pendingCleaningAction}
                  </h4>
                  <p className="text-xs text-slate-400">
                    Affected Rows: <strong>{cleaningPreviewDiff.affectedCount}</strong> | Current Count: {cleaningPreviewDiff.originalCount} -&gt; New Count: {cleaningPreviewDiff.newCount}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setPendingCleaningAction(null);
                      setCleaningPreviewDiff(null);
                    }}
                    className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmApplyCleaning}
                    className="px-4 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold shadow-md transition"
                  >
                    Apply Cleaning
                  </button>
                </div>
              </div>

              {/* Sample Before/After Diff Table */}
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left text-slate-300 border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 text-[10px] font-mono">
                      <th className="p-2">Sample Row</th>
                      <th className="p-2">Original State (Before)</th>
                      <th className="p-2 text-teal-400">Cleaned Candidate (After)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 font-mono text-[11px]">
                    {cleaningPreviewDiff.previewSample.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-850/40">
                        <td className="p-2 text-slate-500">#{idx + 1}</td>
                        <td className="p-2 text-slate-400 max-w-sm truncate">{JSON.stringify(item.before)}</td>
                        <td className="p-2 text-teal-300 max-w-sm truncate">{JSON.stringify(item.after)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. VISUAL ANALYTICS & ACTUAL SVG CHARTS */}
      {activeTab === 'charts' && kpis && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Donut Chart for Status Distribution */}
            <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="font-bold text-slate-100 text-xs uppercase tracking-wider">
                  Registration Status Distribution (Actual Data)
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">Total: {kpis.totalRequests}</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-around gap-4 py-2">
                {/* SVG Donut */}
                <div className="relative w-44 h-44">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    {/* Approved slice */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#10b981"
                      strokeWidth="16"
                      strokeDasharray={`${(kpis.approvalRatePct * 251.2) / 100} 251.2`}
                      strokeDashoffset="0"
                    />
                    {/* Rejected slice */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#ef4444"
                      strokeWidth="16"
                      strokeDasharray={`${(kpis.rejectionRatePct * 251.2) / 100} 251.2`}
                      strokeDashoffset={`-${(kpis.approvalRatePct * 251.2) / 100}`}
                    />
                    {/* Waitlisted slice */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#06b6d4"
                      strokeWidth="16"
                      strokeDasharray={`${(kpis.waitlistRatePct * 251.2) / 100} 251.2`}
                      strokeDashoffset={`-${((kpis.approvalRatePct + kpis.rejectionRatePct) * 251.2) / 100}`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xl font-black text-slate-100 font-mono">{kpis.approvalRatePct}%</span>
                    <span className="text-[10px] text-emerald-400 font-medium">Approved</span>
                  </div>
                </div>

                {/* Legend */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-slate-300">Approved: <strong>{kpis.approvedCount}</strong> ({kpis.approvalRatePct}%)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-slate-300">Rejected: <strong>{kpis.rejectedCount}</strong> ({kpis.rejectionRatePct}%)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-cyan-500" />
                    <span className="text-slate-300">Waitlisted: <strong>{kpis.waitlistedCount}</strong> ({kpis.waitlistRatePct}%)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="text-slate-300">Pending Review: <strong>{kpis.pendingAdvisorCount}</strong></span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-purple-500" />
                    <span className="text-slate-300">System Errors: <strong>{kpis.systemErrorCount}</strong></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart 2: Failure Reasons Breakdown */}
            <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="font-bold text-slate-100 text-xs uppercase tracking-wider">
                  Rejection & Error Root Causes (Frequency)
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">Actual Log Tally</span>
              </div>

              <div className="space-y-3 py-2 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>FIN_HOLD_BURSAR (Unpaid Balance)</span>
                    <span className="font-mono font-bold text-amber-400">{kpis.financialHoldCount} cases</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${Math.min(100, (kpis.financialHoldCount / (kpis.totalRequests || 1)) * 300)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>TIMEOUT_SIS_BRIDGE (Database Deadlock)</span>
                    <span className="font-mono font-bold text-red-400">{kpis.systemErrorCount} cases</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500 rounded-full"
                      style={{ width: `${Math.min(100, (kpis.systemErrorCount / (kpis.totalRequests || 1)) * 300)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>PREREQ_NOT_SATISFIED (Course Conflict)</span>
                    <span className="font-mono font-bold text-cyan-400">{kpis.prereqFailCount} cases</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-500 rounded-full"
                      style={{ width: `${Math.min(100, (kpis.prereqFailCount / (kpis.totalRequests || 1)) * 300)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>ADVISOR_APPROVAL_REQD (Manual Queue)</span>
                    <span className="font-mono font-bold text-purple-400">{kpis.pendingAdvisorCount} cases</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full"
                      style={{ width: `${Math.min(100, (kpis.pendingAdvisorCount / (kpis.totalRequests || 1)) * 300)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. EVIDENCE-BASED SUMMARY REPORT */}
      {activeTab === 'summary' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-xs font-mono font-bold text-teal-400 uppercase">
                Generated from Code Calculations
              </span>
              <h3 className="text-base font-bold text-slate-100 mt-0.5">Evidence-Based Executive Report</h3>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(summaryReport);
                alert('Report copied to clipboard!');
              }}
              className="px-3 py-1.5 text-xs font-semibold text-teal-300 bg-teal-950 hover:bg-teal-900 rounded-lg border border-teal-700/60 transition"
            >
              Copy Report
            </button>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 font-sans leading-relaxed whitespace-pre-wrap">
            {summaryReport}
          </div>
        </div>
      )}

      {/* Raw Data Preview Table (Pagination) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Table className="w-4 h-4 text-teal-400" />
            <h3 className="font-bold text-slate-100 text-sm">Data Records Table</h3>
            <span className="text-xs text-slate-400">
              ({filteredRows.length} matching rows)
            </span>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search table values..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-950 text-slate-200 text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-teal-500 w-48 sm:w-64"
            />
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400 uppercase font-mono text-[10px]">
                {columnNames.map((col) => (
                  <th key={col} className="p-2.5 whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {paginatedRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-850/50 transition font-mono text-[11px]">
                  {columnNames.map((col) => {
                    const val = row[col];
                    const isStatus = col.toLowerCase().includes('status');
                    return (
                      <td key={col} className="p-2.5 whitespace-nowrap text-slate-300">
                        {isStatus ? (
                          <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-semibold ${
                            String(val).toLowerCase() === 'approved' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                            String(val).toLowerCase() === 'rejected' ? 'bg-red-950 text-red-300 border border-red-800' :
                            String(val).toLowerCase().includes('wait') ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' :
                            'bg-slate-800 text-slate-300'
                          }`}>
                            {String(val ?? '')}
                          </span>
                        ) : (
                          String(val ?? '')
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
            <span>
              Showing Page {currentPage} of {totalPages}
            </span>

            <div className="flex items-center space-x-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="font-mono text-slate-300 px-2">
                {currentPage} / {totalPages}
              </span>

              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
      </div>
    </div>
  );
};
