import React, { useState } from 'react';
import { SupportTicket, OperationsKpis, MultiMonthDataset } from '../../types/operations';
import { calculateOperationsKpis, normalizeTicketData, DEFAULT_SLA_TARGETS } from '../../utils/operationsEngine';
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  Upload,
  Layers,
  Users,
  Clock,
  ShieldCheck,
  Smile,
  ArrowRight,
  Sparkles,
  BarChart3,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import Papa from 'papaparse';

interface MultiMonthComparisonViewProps {
  currentTickets: SupportTicket[];
  currentFileName: string;
  onOpenUploadMonthlyFile: () => void;
}

export const MultiMonthComparisonView: React.FC<MultiMonthComparisonViewProps> = ({
  currentTickets,
  currentFileName,
  onOpenUploadMonthlyFile
}) => {
  // Pre-seed monthly datasets for multi-month trend analysis (October, September, August)
  const currentKpis = calculateOperationsKpis(currentTickets, DEFAULT_SLA_TARGETS);

  // Generate deterministic past month baselines for comparison
  const [datasets, setDatasets] = useState<MultiMonthDataset[]>([
    {
      monthKey: '2026-08',
      monthLabel: 'August 2026',
      tickets: [],
      kpis: {
        totalTickets: 92,
        openBacklog: 28,
        resolvedTickets: 64,
        slaBreachesCount: 22,
        slaBreachRatePct: 23.9,
        medianResolutionHours: 16.5,
        avgResolutionHours: 18.2,
        avgSatisfactionScore: 3.8,
        csatResponseCount: 70,
        reopenedTicketsCount: 11,
        reopenRatePct: 12.0,
        busiestQueue: { team: 'Tier 2 Technical', category: 'API & Integrations', openCount: 14 }
      }
    },
    {
      monthKey: '2026-09',
      monthLabel: 'September 2026',
      tickets: [],
      kpis: {
        totalTickets: 104,
        openBacklog: 24,
        resolvedTickets: 80,
        slaBreachesCount: 18,
        slaBreachRatePct: 17.3,
        medianResolutionHours: 13.8,
        avgResolutionHours: 15.1,
        avgSatisfactionScore: 4.1,
        csatResponseCount: 82,
        reopenedTicketsCount: 8,
        reopenRatePct: 7.7,
        busiestQueue: { team: 'Tier 2 Technical', category: 'Bug & Defect', openCount: 11 }
      }
    },
    {
      monthKey: '2026-10',
      monthLabel: `October 2026 (${currentFileName})`,
      tickets: currentTickets,
      kpis: currentKpis
    }
  ]);

  const [activeMetricTab, setActiveMetricTab] = useState<'volume' | 'sla' | 'resolution' | 'csat'>('volume');

  return (
    <div className="space-y-6 text-slate-800">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-2">
            <Layers className="w-3.5 h-3.5 text-teal-600" />
            <span>Cross-Period Operational Intelligence</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Multi-Month Trend & Queue Comparison
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Compare operations velocity, SLA breach rates, and resolution speed across multiple monthly reporting cycles.
          </p>
        </div>

        <button
          onClick={onOpenUploadMonthlyFile}
          className="px-4 py-2.5 bg-slate-900 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-2 shadow-sm"
        >
          <Upload className="w-4 h-4 text-teal-400" />
          <span>Import Monthly CSV (with Mapping)</span>
        </button>
      </div>

      {/* Side-by-Side Monthly Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {datasets.map((month, idx) => {
          const isLatest = idx === datasets.length - 1;
          const prevMonth = idx > 0 ? datasets[idx - 1] : null;
          const volDelta = prevMonth ? month.kpis.totalTickets - prevMonth.kpis.totalTickets : null;
          const slaDelta = prevMonth ? Number((month.kpis.slaBreachRatePct - prevMonth.kpis.slaBreachRatePct).toFixed(1)) : null;

          return (
            <div
              key={month.monthKey}
              className={`rounded-2xl border p-5 flex flex-col justify-between transition ${
                isLatest
                  ? 'bg-teal-50/40 border-teal-300 shadow-sm ring-1 ring-teal-500/20'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-slate-500">{month.monthKey}</span>
                  {isLatest && (
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-teal-600 text-white font-mono">
                      Active Cycle
                    </span>
                  )}
                </div>

                <h3 className="font-extrabold text-base text-slate-900 mb-4">
                  {month.monthLabel}
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Ticket Intake Volume:</span>
                    <div className="text-right">
                      <span className="font-mono font-bold text-slate-900">{month.kpis.totalTickets}</span>
                      {volDelta !== null && (
                        <span className={`text-[10px] ml-1.5 font-mono ${volDelta >= 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                          ({volDelta >= 0 ? `+${volDelta}` : volDelta})
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">End-of-Month Backlog:</span>
                    <span className="font-mono font-bold text-slate-900">{month.kpis.openBacklog} tickets</span>
                  </div>

                  <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">SLA Breach Rate:</span>
                    <div className="text-right">
                      <span className={`font-mono font-bold ${month.kpis.slaBreachRatePct > 20 ? 'text-red-600' : 'text-slate-800'}`}>
                        {month.kpis.slaBreachRatePct}%
                      </span>
                      {slaDelta !== null && (
                        <span className={`text-[10px] ml-1.5 font-mono ${slaDelta <= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                          ({slaDelta <= 0 ? `${slaDelta}%` : `+${slaDelta}%`})
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Median Resolution:</span>
                    <span className="font-mono font-bold text-slate-800">{month.kpis.medianResolutionHours} hrs</span>
                  </div>

                  <div className="flex justify-between items-center py-1.5">
                    <span className="text-slate-500">Avg Customer CSAT:</span>
                    <span className="font-mono font-bold text-teal-700">{month.kpis.avgSatisfactionScore} / 5.0</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 text-[11px] text-slate-500 flex justify-between">
                <span>Busiest Queue:</span>
                <span className="font-semibold text-slate-800">{month.kpis.busiestQueue.team}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Visual Comparative Matrix */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">
              Cross-Month Operational Trajectory
            </h3>
            <p className="text-xs text-slate-500">
              Select a metric dimension below to view month-over-month progression
            </p>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
            <button
              onClick={() => setActiveMetricTab('volume')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeMetricTab === 'volume' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'
              }`}
            >
              Ticket Volume
            </button>
            <button
              onClick={() => setActiveMetricTab('sla')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeMetricTab === 'sla' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'
              }`}
            >
              SLA Breach %
            </button>
            <button
              onClick={() => setActiveMetricTab('resolution')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeMetricTab === 'resolution' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'
              }`}
            >
              Median Resolution
            </button>
            <button
              onClick={() => setActiveMetricTab('csat')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeMetricTab === 'csat' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'
              }`}
            >
              Customer CSAT
            </button>
          </div>
        </div>

        {/* Metric Graph Rendering */}
        <div className="space-y-4">
          {datasets.map(ds => {
            let val = 0;
            let displayVal = '';
            let maxScale = 1;
            let barColor = 'bg-teal-500';

            if (activeMetricTab === 'volume') {
              val = ds.kpis.totalTickets;
              displayVal = `${val} tickets`;
              maxScale = 150;
              barColor = 'bg-teal-600';
            } else if (activeMetricTab === 'sla') {
              val = ds.kpis.slaBreachRatePct;
              displayVal = `${val}%`;
              maxScale = 35;
              barColor = val > 20 ? 'bg-red-500' : 'bg-amber-500';
            } else if (activeMetricTab === 'resolution') {
              val = ds.kpis.medianResolutionHours;
              displayVal = `${val} hrs`;
              maxScale = 25;
              barColor = 'bg-blue-600';
            } else if (activeMetricTab === 'csat') {
              val = ds.kpis.avgSatisfactionScore;
              displayVal = `${val} / 5.0`;
              maxScale = 5.0;
              barColor = 'bg-emerald-500';
            }

            const widthPct = Math.min(100, Math.max(12, Math.round((val / maxScale) * 100)));

            return (
              <div key={ds.monthKey} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800">{ds.monthLabel}</span>
                  <span className="font-mono font-bold text-slate-900">{displayVal}</span>
                </div>
                <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex">
                  <div
                    className={`h-full ${barColor} rounded-full transition-all duration-500`}
                    style={{ width: `${widthPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
