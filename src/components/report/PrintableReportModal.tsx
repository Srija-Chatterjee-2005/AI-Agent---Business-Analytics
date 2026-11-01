import React from 'react';
import {
  SupportTicket,
  OperationsKpis,
  TicketFilterState,
  InvestigationResult,
  ImprovementBrief
} from '../../types/operations';
import {
  Printer,
  Download,
  X,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  ShieldCheck
} from 'lucide-react';

interface PrintableReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  tickets: SupportTicket[];
  kpis: OperationsKpis;
  filters: TicketFilterState;
  investigations: InvestigationResult[];
  savedBriefs: ImprovementBrief[];
}

export const PrintableReportModal: React.FC<PrintableReportModalProps> = ({
  isOpen,
  onClose,
  fileName,
  tickets,
  kpis,
  filters,
  investigations,
  savedBriefs
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadMarkdown = () => {
    let md = `# SupportFlow - Business Operations Investigation Report\n\n`;
    md += `**Generated:** ${new Date().toLocaleString()}\n`;
    md += `**Dataset Source:** ${fileName}\n`;
    md += `**Total Records Evaluated:** ${tickets.length} tickets\n\n`;

    md += `## 1. Active Filter Scope\n`;
    md += `- Assigned Team: ${filters.team}\n`;
    md += `- Category: ${filters.category}\n`;
    md += `- Priority: ${filters.priority}\n`;
    md += `- Status: ${filters.status}\n`;
    if (filters.drillDownType && filters.drillDownValue) {
      md += `- Drill-Down Active: ${filters.drillDownType} = "${filters.drillDownValue}"\n`;
    }
    md += `\n`;

    md += `## 2. Key Performance Indicators (KPIs)\n`;
    md += `| Metric | Value | Target / Benchmark |\n`;
    md += `|---|---|---|\n`;
    md += `| Total Ticket Influx | ${kpis.totalTickets} | Operational Base |\n`;
    md += `| Active Open Backlog | ${kpis.openBacklog} | < 15 tickets |\n`;
    md += `| SLA Breach Rate | ${kpis.slaBreachRatePct}% (${kpis.slaBreachesCount} breaches) | < 8.0% |\n`;
    md += `| Median Resolution Time | ${kpis.medianResolutionHours} hrs | < 8.0 hrs |\n`;
    md += `| Customer Satisfaction (CSAT) | ${kpis.avgSatisfactionScore} / 5.0 | > 4.2 / 5.0 |\n`;
    md += `| Reopened Rate | ${kpis.reopenRatePct}% (${kpis.reopenedTicketsCount} reopened) | < 5.0% |\n`;
    md += `| Busiest Operational Queue | ${kpis.busiestQueue.team} (${kpis.busiestQueue.openCount} open) | - |\n\n`;

    if (investigations.length > 0) {
      md += `## 3. Operations Investigations & Findings\n\n`;
      investigations.forEach((inv, i) => {
        md += `### 3.${i + 1} ${inv.questionTitle}\n`;
        md += `- **Function Executed:** \`${inv.functionUsed}\`\n`;
        md += `- **Key Finding:** ${inv.finding}\n`;
        md += `- **Evidence Metrics:**\n`;
        inv.evidence.forEach(ev => {
          md += `  - ${ev.label}: **${ev.value}** ${ev.benchmark ? `(${ev.benchmark})` : ''}\n`;
        });
        md += `- **Suggested Action:** ${inv.suggestedAction}\n\n`;
      });
    }

    if (savedBriefs.length > 0) {
      md += `## 4. Improvement Briefs & Requirements\n\n`;
      savedBriefs.forEach((brief, bIdx) => {
        md += `### 4.${bIdx + 1} ${brief.title} (${brief.briefId})\n`;
        md += `**Problem Statement:** ${brief.problemStatement}\n\n`;
        md += `#### Proposed Requirements:\n`;
        brief.proposedRequirements.forEach(req => {
          md += `- **[${req.type}] ${req.id}:** ${req.statement}\n`;
        });
        md += `\n#### Acceptance Criteria:\n\`\`\`gherkin\n${brief.acceptanceCriteria}\n\`\`\`\n\n`;
        md += `#### UAT Checks:\n`;
        brief.uatChecks.forEach(uat => {
          md += `- [ ] **${uat.id}:** ${uat.scenario} -> *Expected:* ${uat.expectedResult}\n`;
        });
        md += `\n`;
      });
    }

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SupportFlow_Investigation_Report_${new Date().toISOString().slice(0, 10)}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="bg-white border border-slate-200 w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col my-8 max-h-[92vh] text-slate-800">
        {/* Top Control Bar (Hidden on print) */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-2xl print:hidden">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-teal-600" />
            <h3 className="font-extrabold text-sm text-slate-900">
              Operations Investigation Report Preview
            </h3>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownloadMarkdown}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center space-x-1.5 transition"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Download Markdown</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg flex items-center space-x-1.5 transition shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 overflow-y-auto space-y-6 flex-1 text-slate-900 bg-white">
          {/* Document Header */}
          <div className="border-b-2 border-slate-900 pb-5 flex flex-wrap justify-between items-start gap-4">
            <div>
              <div className="text-xs font-black tracking-widest text-teal-700 uppercase mb-1">
                SupportFlow Operations Intelligence
              </div>
              <h1 className="text-2xl font-black text-slate-950 tracking-tight">
                Operations Performance & Root-Cause Investigation Report
              </h1>
              <p className="text-xs text-slate-500 mt-1 font-mono">
                Source: {fileName} &bull; Generated: {new Date().toLocaleString()} &bull; Sample: {tickets.length} tickets
              </p>
            </div>
            <div className="text-right text-xs font-mono">
              <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-800 font-bold border border-slate-300">
                OFFICIAL REPORT
              </span>
            </div>
          </div>

          {/* Active Filter Scope */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-1">
            <span className="font-bold text-slate-700 block uppercase tracking-wider text-[10px]">
              Active Scope Parameters:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-slate-600 pt-1">
              <div>Team: <span className="font-bold text-slate-800">{filters.team}</span></div>
              <div>Category: <span className="font-bold text-slate-800">{filters.category}</span></div>
              <div>Priority: <span className="font-bold text-slate-800">{filters.priority}</span></div>
              <div>Status: <span className="font-bold text-slate-800">{filters.status}</span></div>
            </div>
            {filters.drillDownType && filters.drillDownValue && (
              <div className="text-teal-700 font-semibold pt-1">
                Interactive Drill-Down Applied: [{filters.drillDownType}] = "{filters.drillDownValue}"
              </div>
            )}
          </div>

          {/* Executive KPI Summary Table */}
          <div className="space-y-2">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-500">
              1. Key Operational Metrics Summary
            </h2>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 font-bold text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">Metric Name</th>
                    <th className="p-2.5 text-center">Calculated Figure</th>
                    <th className="p-2.5 text-center">Operational Benchmark</th>
                    <th className="p-2.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  <tr>
                    <td className="p-2.5 font-sans font-semibold">Total Ticket Influx</td>
                    <td className="p-2.5 text-center font-bold">{kpis.totalTickets}</td>
                    <td className="p-2.5 text-center text-slate-500">--</td>
                    <td className="p-2.5 text-right text-emerald-600 font-bold">Standard</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-sans font-semibold">Active Open Backlog</td>
                    <td className="p-2.5 text-center font-bold text-amber-700">{kpis.openBacklog}</td>
                    <td className="p-2.5 text-center text-slate-500">&lt; 15 tickets</td>
                    <td className="p-2.5 text-right text-amber-600 font-bold">Elevated</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-sans font-semibold">SLA Breach Rate</td>
                    <td className="p-2.5 text-center font-bold text-red-600">{kpis.slaBreachRatePct}% ({kpis.slaBreachesCount} breaches)</td>
                    <td className="p-2.5 text-center text-slate-500">&lt; 8.0%</td>
                    <td className="p-2.5 text-right text-red-600 font-bold">Action Required</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-sans font-semibold">Median Resolution Time</td>
                    <td className="p-2.5 text-center font-bold">{kpis.medianResolutionHours} hrs</td>
                    <td className="p-2.5 text-center text-slate-500">&lt; 8.0 hrs</td>
                    <td className="p-2.5 text-right text-slate-600">Monitored</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-sans font-semibold">Customer Satisfaction (CSAT)</td>
                    <td className="p-2.5 text-center font-bold text-teal-700">{kpis.avgSatisfactionScore} / 5.0</td>
                    <td className="p-2.5 text-center text-slate-500">&gt; 4.2 / 5.0</td>
                    <td className="p-2.5 text-right text-emerald-600 font-bold">Acceptable</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-sans font-semibold">Reopened Ticket Rate</td>
                    <td className="p-2.5 text-center font-bold">{kpis.reopenRatePct}% ({kpis.reopenedTicketsCount} reopened)</td>
                    <td className="p-2.5 text-center text-slate-500">&lt; 5.0%</td>
                    <td className="p-2.5 text-right text-slate-600">Stable</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Investigation Findings */}
          {investigations.length > 0 && (
            <div className="space-y-4 pt-2">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-500">
                2. Operations Agent Findings & Evidence
              </h2>
              <div className="space-y-4">
                {investigations.map((inv, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-sm text-slate-900">
                        {inv.questionTitle}
                      </h3>
                      <span className="font-mono text-[10px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        Function: {inv.functionUsed}
                      </span>
                    </div>

                    <p className="text-slate-800 leading-relaxed font-medium">
                      {inv.finding}
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200">
                      {inv.evidence.map((ev, i) => (
                        <div key={i} className="bg-white p-2 rounded-lg border border-slate-100">
                          <span className="text-[10px] text-slate-500 block truncate">{ev.label}</span>
                          <span className="font-mono font-bold text-slate-900">{ev.value}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 text-[11px] text-slate-600">
                      <strong className="text-slate-800">Suggested Action:</strong> {inv.suggestedAction}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Saved Improvement Briefs */}
          {savedBriefs.length > 0 && (
            <div className="space-y-4 pt-2">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-500">
                3. Operational Improvement Briefs
              </h2>
              {savedBriefs.map((brief, bIdx) => (
                <div key={brief.briefId || bIdx} className="p-4 border border-slate-200 rounded-xl space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h3 className="font-black text-sm text-slate-900">
                      {brief.title} ({brief.briefId})
                    </h3>
                    <span className="text-slate-400 font-mono text-[10px]">{brief.dateGenerated}</span>
                  </div>

                  <div>
                    <span className="font-bold text-slate-700 text-[11px] block uppercase">Problem Statement:</span>
                    <p className="text-slate-700 mt-0.5 leading-relaxed">{brief.problemStatement}</p>
                  </div>

                  <div>
                    <span className="font-bold text-slate-700 text-[11px] block uppercase mb-1">Proposed Requirements:</span>
                    <ul className="list-disc list-inside space-y-1 text-slate-700">
                      {brief.proposedRequirements.map(req => (
                        <li key={req.id}>
                          <strong>[{req.type}] {req.id}:</strong> {req.statement}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="font-bold text-slate-700 text-[11px] block uppercase mb-1">User Acceptance Testing (UAT):</span>
                    <div className="space-y-1">
                      {brief.uatChecks.map(uat => (
                        <div key={uat.id} className="text-slate-600 font-mono text-[11px]">
                          [{uat.id}] {uat.scenario} &rarr; <em>{uat.expectedResult}</em>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
