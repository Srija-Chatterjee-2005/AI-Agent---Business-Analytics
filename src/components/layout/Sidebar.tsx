import React from 'react';
import {
  LayoutDashboard,
  Bot,
  Table,
  FileCheck2,
  Download,
  Upload,
  Sparkles,
  Layers,
  Activity,
  Calculator,
  HardDrive,
  Settings,
  Bell,
  TrendingUp,
  Shield
} from 'lucide-react';

export type ActiveNavTab =
  | 'overview'
  | 'investigations'
  | 'scenarios'
  | 'forecast'
  | 'comparison'
  | 'saved'
  | 'data'
  | 'briefs';

interface SidebarProps {
  activeView: ActiveNavTab;
  setActiveView: (view: ActiveNavTab) => void;
  ticketCount: number;
  openBacklogCount: number;
  onOpenUpload: () => void;
  onSelectSample: () => void;
  activeFileName: string;
  onOpenSettings: () => void;
  alertCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  ticketCount,
  openBacklogCount,
  onOpenUpload,
  onSelectSample,
  activeFileName,
  onOpenSettings,
  alertCount
}) => {
  const navItems = [
    { id: 'overview' as const, label: 'Operations Dashboard', icon: LayoutDashboard },
    { id: 'investigations' as const, label: 'Ops Analyst Agent', icon: Bot, badge: '8 Inquiries' },
    { id: 'scenarios' as const, label: 'Scenario Simulator', icon: Calculator, badge: '4 Plans' },
    { id: 'forecast' as const, label: '7-Day Forecast', icon: TrendingUp },
    { id: 'comparison' as const, label: 'Multi-Month Trends', icon: Layers },
    { id: 'saved' as const, label: 'Saved Analyses', icon: HardDrive },
    { id: 'data' as const, label: 'Ticket Data & Audit', icon: Table, count: ticketCount },
    { id: 'briefs' as const, label: 'Improvement Briefs', icon: FileCheck2 },
  ];

  return (
    <aside className="w-full md:w-64 bg-[#0b1329] border-r border-slate-800 flex flex-col justify-between shrink-0 select-none">
      {/* Brand & App Identifier */}
      <div className="p-4 sm:p-5">
        <div className="flex items-center space-x-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 via-teal-600 to-cyan-500 p-0.5 shadow-lg shadow-teal-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-[#0b1329] rounded-[10px] flex items-center justify-center">
              <Activity className="w-5 h-5 text-teal-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg tracking-tight text-white">
                SupportFlow
              </span>
              <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-teal-950 text-teal-300 border border-teal-500/40 font-mono">
                v3.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Business Operations Analyst
            </p>
          </div>
        </div>

        {/* Active Dataset Status Widget */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 mb-4 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-medium">Dataset:</span>
            <span className="font-mono text-teal-400 font-semibold truncate max-w-[130px]" title={activeFileName}>
              {activeFileName}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/80 font-mono">
            <span className="text-slate-300 font-bold">{ticketCount} tickets</span>
            <span className="text-amber-400 font-semibold">{openBacklogCount} backlog</span>
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <a
              href="/samples/support_tickets.csv"
              download="support_tickets.csv"
              className="flex-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-[11px] font-medium text-slate-300 rounded-lg border border-slate-700/80 flex items-center justify-center space-x-1 transition"
              title="Download sample support_tickets.csv"
            >
              <Download className="w-3 h-3 text-teal-400" />
              <span>Sample CSV</span>
            </a>

            <button
              onClick={onOpenUpload}
              className="py-1.5 px-2 bg-teal-500/15 hover:bg-teal-500/25 text-[11px] font-medium text-teal-300 rounded-lg border border-teal-500/30 flex items-center justify-center space-x-1 transition"
              title="Upload custom CSV or Excel file"
            >
              <Upload className="w-3 h-3 text-teal-400" />
              <span>Upload</span>
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-teal-500/15 text-teal-300 border border-teal-500/40 shadow-sm shadow-teal-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-700/50 font-mono">
                    {item.badge}
                  </span>
                )}
                {item.count !== undefined && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Settings & System Footer */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center justify-between px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700/60 rounded-xl text-xs text-slate-300 font-semibold transition"
        >
          <div className="flex items-center space-x-2">
            <Settings className="w-4 h-4 text-teal-400" />
            <span>Settings & SLA Targets</span>
          </div>
          {alertCount > 0 && (
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
              {alertCount} alert{alertCount > 1 ? 's' : ''}
            </span>
          )}
        </button>

        <div className="text-[11px] text-slate-500 space-y-0.5 pt-1">
          <div className="flex items-center space-x-1 text-slate-400">
            <Sparkles className="w-3 h-3 text-teal-400" />
            <span>Deterministic App Engine</span>
          </div>
          <p className="leading-tight text-[10px]">
            No external database or paid APIs. All data persisted locally.
          </p>
        </div>
      </div>
    </aside>
  );
};
