import React, { useState } from 'react';
import {
  SupportTicket,
  OperationsKpis,
  TicketFilterState,
  QuestionKey,
  TriggeredAlert
} from '../../types/operations';
import {
  Inbox,
  Clock,
  AlertTriangle,
  Smile,
  Flame,
  Filter,
  RotateCcw,
  Sparkles,
  TrendingUp,
  BarChart3,
  Calendar,
  Users,
  Tag,
  ShieldAlert,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  Info,
  Printer,
  Bell,
  X,
  Table
} from 'lucide-react';

interface OperationsOverviewProps {
  tickets: SupportTicket[];
  filteredTickets: SupportTicket[];
  kpis: OperationsKpis;
  filters: TicketFilterState;
  setFilters: React.Dispatch<React.SetStateAction<TicketFilterState>>;
  onResetFilters: () => void;
  onRunInvestigation: (questionKey: QuestionKey) => void;
  teams: string[];
  categories: string[];
  triggeredAlerts?: TriggeredAlert[];
  onOpenReport?: () => void;
  onOpenAlertSettings?: () => void;
}

export const OperationsOverview: React.FC<OperationsOverviewProps> = ({
  tickets,
  filteredTickets,
  kpis,
  filters,
  setFilters,
  onResetFilters,
  onRunInvestigation,
  teams,
  categories,
  triggeredAlerts = [],
  onOpenReport,
  onOpenAlertSettings
}) => {
  const [backlogGrouping, setBacklogGrouping] = useState<'category' | 'team'>('category');
  const [showDrillDownTable, setShowDrillDownTable] = useState<boolean>(true);

  // Compute Chart 1: Tickets Over Time (by Day)
  const ticketsByDay: Record<string, { total: number; resolved: number; open: number }> = {};
  filteredTickets.forEach(t => {
    const day = t.date_created.slice(0, 10);
    if (!ticketsByDay[day]) {
      ticketsByDay[day] = { total: 0, resolved: 0, open: 0 };
    }
    ticketsByDay[day].total += 1;
    if (t.status === 'Resolved' || t.status === 'Closed') {
      ticketsByDay[day].resolved += 1;
    } else {
      ticketsByDay[day].open += 1;
    }
  });

  const timeSeriesDays = Object.keys(ticketsByDay).sort().slice(-14);
  const maxDayCount = Math.max(...timeSeriesDays.map(d => ticketsByDay[d]?.total || 0), 1);

  // Compute Chart 2: Backlog by Category or Team
  const openTickets = filteredTickets.filter(t => t.status !== 'Resolved' && t.status !== 'Closed');
  const backlogGroupMap: Record<string, number> = {};
  openTickets.forEach(t => {
    const key = backlogGrouping === 'category' ? t.category : t.assigned_team;
    backlogGroupMap[key] = (backlogGroupMap[key] || 0) + 1;
  });

  const sortedBacklogGroups = Object.entries(backlogGroupMap)
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);

  const maxBacklogCount = Math.max(...sortedBacklogGroups.map(g => g.count), 1);

  // Compute Chart 3: Resolution Time vs SLA Target by Priority
  const prioBuckets: Record<string, { resTimes: number[]; target: number }> = {
    Critical: { resTimes: [], target: 4 },
    High: { resTimes: [], target: 8 },
    Medium: { resTimes: [], target: 24 },
    Low: { resTimes: [], target: 48 }
  };

  filteredTickets.forEach(t => {
    if (prioBuckets[t.priority]) {
      if (t.status === 'Resolved' || t.status === 'Closed') {
        prioBuckets[t.priority].resTimes.push(t.resolution_time_hrs);
      }
    }
  });

  const prioComparison = Object.entries(prioBuckets).map(([prio, data]) => {
    const times = data.resTimes.sort((a, b) => a - b);
    let median = 0;
    if (times.length > 0) {
      const mid = Math.floor(times.length / 2);
      median = times.length % 2 === 0 ? (times[mid - 1] + times[mid]) / 2 : times[mid];
    }
    return {
      priority: prio,
      actualMedian: Number(median.toFixed(1)),
      slaTarget: data.target,
      count: times.length,
      breached: median > data.target
    };
  });

  // Calculate 7-Day Comparison: Recent 7 days vs Prior 7 days
  const allDays = Array.from(new Set(tickets.map(t => t.date_created.slice(0, 10)))).sort();
  const recent7Days = allDays.slice(-7);
  const prior7Days = allDays.slice(-14, -7);

  const recentTickets = tickets.filter(t => recent7Days.includes(t.date_created.slice(0, 10)));
  const priorTickets = tickets.filter(t => prior7Days.includes(t.date_created.slice(0, 10)));

  const volumeDiff = recentTickets.length - priorTickets.length;
  const recentBacklog = recentTickets.filter(t => t.status !== 'Resolved' && t.status !== 'Closed').length;
  const priorBacklog = priorTickets.filter(t => t.status !== 'Resolved' && t.status !== 'Closed').length;
  const backlogDiff = recentBacklog - priorBacklog;

  const isFilterActive =
    filters.team !== 'all' ||
    filters.category !== 'all' ||
    filters.priority !== 'all' ||
    filters.status !== 'all' ||
    Boolean(filters.drillDownType && filters.drillDownValue);

  // Drill down handlers
  const handleDrillDown = (type: 'day' | 'category' | 'team' | 'priority', value: string) => {
    setFilters(prev => ({
      ...prev,
      drillDownType: type,
      drillDownValue: value
    }));
  };

  const handleClearDrillDown = () => {
    setFilters(prev => ({
      ...prev,
      drillDownType: null,
      drillDownValue: null
    }));
  };

  return (
    <div className="space-y-6 text-slate-800">
      {/* Triggered Alerts Banner */}
      {triggeredAlerts.length > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 shadow-sm flex items-start justify-between gap-4 animate-in fade-in">
          <div className="flex items-start space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0 mt-0.5">
              <Bell className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="font-extrabold text-sm text-amber-950">
                  {triggeredAlerts.length} Operational Alert{triggeredAlerts.length > 1 ? 's' : ''} Triggered
                </h4>
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                  Threshold Breach
                </span>
              </div>
              <div className="text-xs text-amber-800 mt-1 space-y-1">
                {triggeredAlerts.slice(0, 2).map(a => (
                  <div key={a.id} className="flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                    <span><strong>{a.title}:</strong> {a.message}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {onOpenAlertSettings && (
            <button
              onClick={onOpenAlertSettings}
              className="px-3 py-1.5 bg-amber-200 hover:bg-amber-300 text-amber-900 rounded-lg text-xs font-bold transition whitespace-nowrap"
            >
              Configure Thresholds
            </button>
          )}
        </div>
      )}

      {/* Header & Quick Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Real Code Operations Analytics</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Support Operations Command Center
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Analyzing {filteredTickets.length} of {tickets.length} total tickets across {teams.length} support teams.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {onOpenReport && (
            <button
              onClick={onOpenReport}
              className="px-4 py-2 bg-slate-900 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-2 shadow-sm"
            >
              <Printer className="w-4 h-4 text-teal-400" />
              <span>Export Investigation Report</span>
            </button>
          )}

          {isFilterActive && (
            <button
              onClick={onResetFilters}
              className="px-3.5 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset All Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* 4 Interactive Operational Question Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <button
          onClick={() => onRunInvestigation('what_changed')}
          className="p-3.5 bg-white border border-slate-200 hover:border-teal-400 hover:shadow-md rounded-2xl text-left transition flex items-center justify-between group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-extrabold text-slate-800 group-hover:text-teal-700 block transition">
                What changed this week?
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Function: compare_periods
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-teal-600 transition" />
        </button>

        <button
          onClick={() => onRunInvestigation('largest_backlog')}
          className="p-3.5 bg-white border border-slate-200 hover:border-amber-400 hover:shadow-md rounded-2xl text-left transition flex items-center justify-between group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-extrabold text-slate-800 group-hover:text-amber-700 block transition">
                Largest backlog queue?
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Function: group_backlog
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-amber-600 transition" />
        </button>

        <button
          onClick={() => onRunInvestigation('sla_breaches')}
          className="p-3.5 bg-white border border-slate-200 hover:border-red-400 hover:shadow-md rounded-2xl text-left transition flex items-center justify-between group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-extrabold text-slate-800 group-hover:text-red-700 block transition">
                Where are SLA breaches highest?
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Function: inspect_sla_risk
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-red-600 transition" />
        </button>

        <button
          onClick={() => onRunInvestigation('staffing_scenario')}
          className="p-3.5 bg-white border border-slate-200 hover:border-cyan-400 hover:shadow-md rounded-2xl text-left transition flex items-center justify-between group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white transition">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-extrabold text-slate-800 group-hover:text-cyan-700 block transition">
                +1 person on busiest queue?
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Function: calculate_staffing
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-cyan-600 transition" />
        </button>
      </div>

      {/* Date Period Comparison Card */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-teal-600" />
          <span className="font-bold text-slate-900 font-sans">Period Comparison (7-Day Rolling Window):</span>
          <span className="text-slate-500 font-sans">Recent 7 Days ({recentTickets.length} tickets) vs Prior 7 Days ({priorTickets.length} tickets)</span>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <span className="text-slate-400 text-[10px] block font-sans">Volume Shift</span>
            <span className={`font-bold ${volumeDiff >= 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {volumeDiff >= 0 ? `+${volumeDiff}` : volumeDiff} tickets
            </span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block font-sans">Backlog Delta</span>
            <span className={`font-bold ${backlogDiff >= 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {backlogDiff >= 0 ? `+${backlogDiff}` : backlogDiff} tickets
            </span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block font-sans">Current SLA Breaches</span>
            <span className="font-bold text-red-600">{kpis.slaBreachRatePct}%</span>
          </div>
        </div>
      </div>

      {/* Interactive Drill-Down Active Alert */}
      {filters.drillDownType && filters.drillDownValue && (
        <div className="bg-teal-50 border border-teal-300 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs text-teal-950 animate-in fade-in">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
            <span>
              <strong>Interactive Chart Drill-Down Active:</strong> Filtering by {filters.drillDownType} = "<strong>{filters.drillDownValue}</strong>" ({filteredTickets.length} matching tickets)
            </span>
          </div>
          <button
            onClick={handleClearDrillDown}
            className="flex items-center space-x-1 px-2.5 py-1 bg-white hover:bg-teal-100 text-teal-900 rounded-lg border border-teal-300 text-xs font-bold transition"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear Drill-Down</span>
          </button>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider">
          <div className="flex items-center space-x-1.5">
            <Filter className="w-3.5 h-3.5 text-teal-600" />
            <span>Slice & Filter Tickets</span>
          </div>
          {isFilterActive && (
            <span className="text-[11px] text-teal-700 lowercase font-mono">
              active filters applied
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {/* Team Filter */}
          <div>
            <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Assigned Team</label>
            <select
              value={filters.team}
              onChange={(e) => setFilters(prev => ({ ...prev, team: e.target.value }))}
              className="w-full text-xs font-medium rounded-xl p-2 bg-slate-50 border border-slate-300 text-slate-800 focus:bg-white focus:border-teal-500 outline-none"
            >
              <option value="all">All Teams ({teams.length})</option>
              {teams.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="w-full text-xs font-medium rounded-xl p-2 bg-slate-50 border border-slate-300 text-slate-800 focus:bg-white focus:border-teal-500 outline-none"
            >
              <option value="all">All Categories ({categories.length})</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Priority</label>
            <select
              value={filters.priority}
              onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
              className="w-full text-xs font-medium rounded-xl p-2 bg-slate-50 border border-slate-300 text-slate-800 focus:bg-white focus:border-teal-500 outline-none"
            >
              <option value="all">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full text-xs font-medium rounded-xl p-2 bg-slate-50 border border-slate-300 text-slate-800 focus:bg-white focus:border-teal-500 outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Waiting on Customer">Waiting on Customer</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* 5 Core KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* KPI 1 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Tickets</span>
            <Inbox className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {kpis.totalTickets}
          </div>
          <div className="text-[11px] text-slate-500 flex justify-between">
            <span>Resolved: {kpis.resolvedTickets}</span>
            <span className="font-mono text-emerald-600 font-semibold">
              {Math.round((kpis.resolvedTickets / (kpis.totalTickets || 1)) * 100)}%
            </span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Open Backlog</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 font-mono">
            {kpis.openBacklog}
          </div>
          <div className="text-[11px] text-slate-500 flex justify-between">
            <span>Busiest: {kpis.busiestQueue.team.slice(0, 14)}...</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">SLA Breaches</span>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-black text-red-600 font-mono">
            {kpis.slaBreachesCount}
          </div>
          <div className="text-[11px] text-slate-500 flex justify-between">
            <span>Breach Rate:</span>
            <span className={`font-mono font-bold ${kpis.slaBreachRatePct > 15 ? 'text-red-600' : 'text-slate-700'}`}>
              {kpis.slaBreachRatePct}%
            </span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Median Resolution</span>
            <Clock className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {kpis.medianResolutionHours} <span className="text-xs font-normal text-slate-400">hrs</span>
          </div>
          <div className="text-[11px] text-slate-500 flex justify-between">
            <span>Mean: {kpis.avgResolutionHours} hrs</span>
          </div>
        </div>

        {/* KPI 5 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Avg CSAT</span>
            <Smile className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-teal-700 font-mono">
            {kpis.avgSatisfactionScore} <span className="text-xs font-normal text-slate-400">/ 5.0</span>
          </div>
          <div className="text-[11px] text-slate-500 flex justify-between">
            <span>Reopen: {kpis.reopenRatePct}%</span>
            <span className="text-slate-400 font-mono">({kpis.csatResponseCount} reviews)</span>
          </div>
        </div>
      </div>

      {/* 3 Real Interactive Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Chart 1: Tickets Over Time */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                1. Tickets Over Time (Daily)
              </h3>
              <p className="text-[11px] text-slate-400">Click any day to drill down</p>
            </div>
            <Calendar className="w-4 h-4 text-teal-600" />
          </div>

          <div className="pt-2 flex items-end justify-between space-x-1.5 h-44">
            {timeSeriesDays.map(day => {
              const data = ticketsByDay[day] || { total: 0, resolved: 0, open: 0 };
              const heightPct = Math.max(10, Math.round((data.total / maxDayCount) * 100));
              const isSelected = filters.drillDownType === 'day' && filters.drillDownValue === day;

              return (
                <button
                  key={day}
                  onClick={() => handleDrillDown('day', day)}
                  title={`${day}: ${data.total} tickets (${data.resolved} resolved, ${data.open} open)`}
                  className={`flex-1 flex flex-col items-center justify-end h-full group focus:outline-none transition rounded-t-lg ${
                    isSelected ? 'bg-teal-50 ring-2 ring-teal-500' : 'hover:bg-slate-50'
                  }`}
                >
                  <span className="text-[9px] font-mono text-slate-500 mb-1 opacity-0 group-hover:opacity-100 transition">
                    {data.total}
                  </span>
                  <div
                    className={`w-full rounded-t transition-all ${
                      isSelected
                        ? 'bg-teal-700'
                        : 'bg-teal-500/80 group-hover:bg-teal-600'
                    }`}
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="text-[9px] font-mono text-slate-400 mt-1 truncate max-w-full">
                    {day.slice(8)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Backlog Distribution */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                2. Unresolved Backlog
              </h3>
              <p className="text-[11px] text-slate-400">Click category/team to filter</p>
            </div>
            <div className="flex bg-slate-100 p-0.5 rounded-lg text-[10px] font-bold text-slate-600">
              <button
                onClick={() => setBacklogGrouping('category')}
                className={`px-2 py-0.5 rounded ${backlogGrouping === 'category' ? 'bg-white text-slate-900 shadow-sm' : ''}`}
              >
                Category
              </button>
              <button
                onClick={() => setBacklogGrouping('team')}
                className={`px-2 py-0.5 rounded ${backlogGrouping === 'team' ? 'bg-white text-slate-900 shadow-sm' : ''}`}
              >
                Team
              </button>
            </div>
          </div>

          <div className="space-y-2.5 pt-1 max-h-44 overflow-y-auto">
            {sortedBacklogGroups.map(group => {
              const widthPct = Math.max(12, Math.round((group.count / maxBacklogCount) * 100));
              const isSelected = filters.drillDownValue === group.label;

              return (
                <button
                  key={group.label}
                  onClick={() => handleDrillDown(backlogGrouping, group.label)}
                  className={`w-full text-left space-y-1 p-1 rounded-lg transition ${
                    isSelected ? 'bg-amber-50 ring-1 ring-amber-400' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-800 truncate max-w-[160px]">{group.label}</span>
                    <span className="font-mono font-bold text-slate-700">{group.count} tickets</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isSelected ? 'bg-amber-600' : 'bg-amber-500'
                      }`}
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chart 3: Resolution Time vs SLA Target by Priority */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                3. Median Resolution vs SLA
              </h3>
              <p className="text-[11px] text-slate-400">Click priority tier to filter</p>
            </div>
            <ShieldAlert className="w-4 h-4 text-red-500" />
          </div>

          <div className="space-y-3 pt-1">
            {prioComparison.map(prio => {
              const isSelected = filters.priority === prio.priority || filters.drillDownValue === prio.priority;
              return (
                <button
                  key={prio.priority}
                  onClick={() => handleDrillDown('priority', prio.priority)}
                  className={`w-full text-left space-y-1 p-1.5 rounded-lg transition ${
                    isSelected ? 'bg-slate-100 ring-1 ring-slate-400' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between text-xs">
                    <div className="flex items-center space-x-1.5">
                      <span className={`w-2 h-2 rounded-full ${
                        prio.priority === 'Critical' ? 'bg-red-500' :
                        prio.priority === 'High' ? 'bg-amber-500' :
                        prio.priority === 'Medium' ? 'bg-blue-500' : 'bg-slate-400'
                      }`} />
                      <span className="font-bold text-slate-800">{prio.priority}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({prio.count} tcks)</span>
                    </div>

                    <div className="text-right font-mono text-xs">
                      <span className={`font-bold ${prio.breached ? 'text-red-600' : 'text-slate-900'}`}>
                        {prio.actualMedian}h
                      </span>
                      <span className="text-slate-400 text-[10px] ml-1">/ {prio.slaTarget}h SLA</span>
                    </div>
                  </div>

                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
                    <div
                      className={`h-full rounded-full transition-all ${prio.breached ? 'bg-red-500' : 'bg-teal-500'}`}
                      style={{ width: `${Math.min(100, (prio.actualMedian / (prio.slaTarget * 1.5)) * 100)}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Drill-Down Matching Tickets Table */}
      {(filters.drillDownType || isFilterActive) && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm animate-in fade-in">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Table className="w-4 h-4 text-teal-600" />
              <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                Matching Tickets ({filteredTickets.length} records)
              </h3>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowDrillDownTable(!showDrillDownTable)}
                className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
              >
                {showDrillDownTable ? 'Collapse Table' : 'Expand Table'}
              </button>
              <button
                onClick={handleClearDrillDown}
                className="text-xs text-teal-700 hover:text-teal-900 font-bold ml-2"
              >
                Clear Selection
              </button>
            </div>
          </div>

          {showDrillDownTable && (
            <div className="overflow-x-auto max-h-72">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 sticky top-0">
                  <tr>
                    <th className="py-2 px-3">Ticket ID</th>
                    <th className="py-2 px-3">Date</th>
                    <th className="py-2 px-3">Category</th>
                    <th className="py-2 px-3">Priority</th>
                    <th className="py-2 px-3">Team</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3 text-right">Res. Hours</th>
                    <th className="py-2 px-3 text-right">CSAT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-slate-700">
                  {filteredTickets.slice(0, 15).map(t => (
                    <tr key={t.ticket_id} className="hover:bg-slate-50/70 transition">
                      <td className="py-2 px-3 font-bold text-slate-900">{t.ticket_id}</td>
                      <td className="py-2 px-3 text-slate-500">{t.date_created.slice(0, 16)}</td>
                      <td className="py-2 px-3 font-sans">{t.category}</td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          t.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                          t.priority === 'High' ? 'bg-amber-100 text-amber-800' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {t.priority}
                        </span>
                      </td>
                      <td className="py-2 px-3 font-sans text-slate-600">{t.assigned_team}</td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          t.status === 'Resolved' || t.status === 'Closed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right font-bold text-slate-800">{t.resolution_time_hrs}h</td>
                      <td className="py-2 px-3 text-right text-teal-700 font-bold">{t.satisfaction_score ?? '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredTickets.length > 15 && (
                <div className="p-2 text-center text-xs text-slate-500 bg-slate-50 border-t border-slate-100">
                  Showing 15 of {filteredTickets.length} matching tickets. Switch to "Ticket Data & Preview" for full table pagination.
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
