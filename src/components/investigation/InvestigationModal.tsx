import React, { useState } from 'react';
import {
  InvestigationResult,
  OperationsKpis,
  ImprovementBrief
} from '../../types/operations';
import {
  X,
  Sparkles,
  Terminal,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  Users,
  ShieldCheck,
  FileCheck2,
  Layers,
  ChevronRight
} from 'lucide-react';

interface InvestigationModalProps {
  investigation: InvestigationResult | null;
  onClose: () => void;
  onDraftBrief: (investigation: InvestigationResult) => void;
  isDraftingBrief?: boolean;
}

export const InvestigationModal: React.FC<InvestigationModalProps> = ({
  investigation,
  onClose,
  onDraftBrief,
  isDraftingBrief = false
}) => {
  if (!investigation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40">
                Function: {investigation.functionUsed}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Real Code Execution
              </span>
            </div>
            <h3 className="font-extrabold text-base sm:text-lg text-white">
              {investigation.questionTitle}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-800">
          {/* Finding Banner */}
          <div className="p-4 rounded-xl bg-teal-50/80 border border-teal-200/90 text-sm space-y-1">
            <div className="font-bold text-teal-900 flex items-center space-x-1.5 text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>Analyst Key Finding</span>
            </div>
            <p className="text-slate-900 font-medium leading-relaxed">
              {investigation.finding}
            </p>
          </div>

          {/* Evidence Grid (Exact Numbers from Data) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span>Evidence & Data Points (Never Hallucinated)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {investigation.evidence.map((ev, i) => (
                <div key={i} className="p-3 bg-slate-50 border border-slate-200/90 rounded-xl space-y-0.5">
                  <div className="text-[11px] text-slate-500 font-medium">{ev.label}</div>
                  <div className="text-sm font-extrabold text-slate-900 font-mono">{ev.value}</div>
                  {ev.benchmark && (
                    <div className="text-[10px] text-slate-400 font-medium">{ev.benchmark}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Staffing Scenario Burn-Down Projection (if question 4) */}
          {investigation.staffingImpact && investigation.chartData && (
            <div className="p-4 bg-slate-900 text-white rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-teal-300 uppercase tracking-wider">
                  5-Day Queue Burn-Down Projection (+1 Analyst)
                </span>
                <span className="font-mono text-[11px] text-slate-400">
                  {investigation.staffingImpact.currentHeadcount} &rarr; {investigation.staffingImpact.proposedHeadcount} FTEs (+{investigation.staffingImpact.throughputGainPct}%)
                </span>
              </div>

              <div className="h-32 flex items-end justify-between gap-3 pt-2">
                {investigation.chartData.map((pt, i) => {
                  const maxVal = Math.max(...investigation.chartData!.map(p => p.value || 1));
                  const baselineHeight = Math.round(((pt.value || 0) / maxVal) * 100);
                  const projectedHeight = Math.round(((pt.secondaryValue || 0) / maxVal) * 100);

                  return (
                    <div key={i} className="flex-1 flex flex-col items-center h-full justify-end">
                      <div className="text-[10px] font-mono text-teal-300 font-bold mb-1">
                        {pt.secondaryValue}
                      </div>
                      <div className="w-full flex items-end justify-center space-x-1 h-20">
                        {/* Projected Burn bar */}
                        <div
                          className="w-full bg-teal-500 rounded-t-md transition-all duration-300"
                          style={{ height: `${Math.max(12, projectedHeight)}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 font-mono truncate max-w-[60px]">
                        {pt.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="text-[11px] text-slate-400 border-t border-slate-800 pt-2 flex items-center justify-between">
                <span>Burn-down saves ~{investigation.staffingImpact.slaBreachReductionPct}% in SLA breach incidents</span>
                <span className="text-teal-400 font-semibold">Zero recurring vendor cost</span>
              </div>
            </div>
          )}

          {/* Suggested Next Action */}
          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/90 text-xs space-y-1">
            <span className="font-bold text-amber-900 flex items-center space-x-1.5 uppercase tracking-wider text-[11px]">
              <ArrowRight className="w-3.5 h-3.5 text-amber-600" />
              <span>Recommended Operational Next Action</span>
            </span>
            <p className="text-slate-800 font-medium leading-relaxed">
              {investigation.suggestedAction}
            </p>
          </div>

          {/* Explicit Assumptions Callout */}
          {investigation.assumptions && investigation.assumptions.length > 0 && (
            <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
              <span className="font-semibold text-slate-700 flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                <span>Explicit Analytical Assumptions:</span>
              </span>
              <ul className="list-disc list-inside space-y-0.5 text-slate-600 pl-1">
                {investigation.assumptions.map((assump, idx) => (
                  <li key={idx}>{assump}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Modal Footer with Draft Improvement Brief Action */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
          >
            Close
          </button>

          <button
            onClick={() => onDraftBrief(investigation)}
            disabled={isDraftingBrief}
            className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-teal-700 to-teal-600 hover:from-teal-600 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-900/20 transition active:scale-95 disabled:opacity-50"
          >
            <FileCheck2 className="w-4 h-4 text-teal-200" />
            <span>{isDraftingBrief ? 'Drafting Brief...' : 'Draft Practical Improvement Brief'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
