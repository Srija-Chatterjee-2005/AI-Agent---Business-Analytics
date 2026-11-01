import React, { useState } from 'react';
import {
  SupportTicket,
  OperationsKpis,
  QuestionKey
} from '../../types/operations';
import {
  Sparkles,
  Bot,
  Send,
  HelpCircle,
  Clock,
  Flame,
  AlertTriangle,
  Users,
  ChevronRight,
  TrendingUp,
  Smile,
  RotateCcw,
  ShieldCheck,
  BarChart2,
  CheckCircle2,
  FileCheck2
} from 'lucide-react';

interface AgentInquiriesViewProps {
  tickets: SupportTicket[];
  kpis: OperationsKpis;
  onRunInvestigation: (q: QuestionKey) => void;
  onCustomQuery: (prompt: string) => void;
  isLoading?: boolean;
}

export const AgentInquiriesView: React.FC<AgentInquiriesViewProps> = ({
  tickets,
  kpis,
  onRunInvestigation,
  onCustomQuery,
  isLoading = false
}) => {
  const [customInput, setCustomInput] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'volume' | 'sla' | 'staffing' | 'quality'>('all');

  const questions: {
    key: QuestionKey;
    title: string;
    func: string;
    category: 'volume' | 'sla' | 'staffing' | 'quality';
    desc: string;
    metricBadge: string;
    icon: any;
    color: string;
  }[] = [
    {
      key: 'what_changed',
      title: 'What changed this week?',
      func: 'compare_periods',
      category: 'volume',
      desc: 'Compares the current 7-day period against the prior 7 days. Computes exact volume shift %, active backlog change, and SLA breach rate shift.',
      metricBadge: `${kpis.totalTickets} total tickets evaluated`,
      icon: TrendingUp,
      color: 'teal'
    },
    {
      key: 'largest_backlog',
      title: 'Which category has the largest backlog?',
      func: 'group_backlog',
      category: 'volume',
      desc: 'Groups unresolved tickets by category and team. Identifies queue size, percentage share of total backlog, and urgency concentration.',
      metricBadge: `${kpis.openBacklog} active backlog tickets`,
      icon: Flame,
      color: 'amber'
    },
    {
      key: 'sla_breaches',
      title: 'Where are SLA breaches highest?',
      func: 'inspect_sla_risk',
      category: 'sla',
      desc: 'Audits resolution time against target thresholds across Category, Priority, and Team. Isolates root cause overdue intervals.',
      metricBadge: `${kpis.slaBreachRatePct}% overall breach rate`,
      icon: AlertTriangle,
      color: 'red'
    },
    {
      key: 'staffing_scenario',
      title: 'What if one more person handled the busiest queue?',
      func: 'calculate_staffing_scenario',
      category: 'staffing',
      desc: 'Models adding +1 Full-Time Analyst to the busiest queue. Simulates 5-day queue burn-down and projected SLA breach rate reduction.',
      metricBadge: `Busiest: ${kpis.busiestQueue.team}`,
      icon: Users,
      color: 'cyan'
    },
    {
      key: 'csat_performance',
      title: 'How is Customer Satisfaction (CSAT) trending across teams?',
      func: 'evaluate_csat_performance',
      category: 'quality',
      desc: 'Evaluates CSAT scores across teams, isolating high-satisfaction vs low-satisfaction queues and identifying correlated reopen drivers.',
      metricBadge: `Avg: ${kpis.avgSatisfactionScore} / 5.0 (${kpis.csatResponseCount} reviews)`,
      icon: Smile,
      color: 'emerald'
    },
    {
      key: 'reopen_rate',
      title: 'Which queue has the highest reopen rate?',
      func: 'inspect_reopen_rate',
      category: 'quality',
      desc: 'Analyzes tickets that were reopened by customers. Identifies root categories suffering from incomplete first-contact resolutions.',
      metricBadge: `${kpis.reopenRatePct}% reopened (${kpis.reopenedTicketsCount} tickets)`,
      icon: RotateCcw,
      color: 'purple'
    },
    {
      key: 'critical_sla',
      title: 'What is our Critical priority SLA compliance?',
      func: 'audit_critical_sla',
      category: 'sla',
      desc: 'Deep-dive audit into P1 Critical tickets against the 4-hour SLA standard. Highlights mean response latency and breach root causes.',
      metricBadge: `Target: 4.0 hrs SLA`,
      icon: ShieldCheck,
      color: 'rose'
    },
    {
      key: 'team_medians',
      title: 'What are the median resolution hours by team?',
      func: 'calculate_team_medians',
      category: 'staffing',
      desc: 'Computes robust non-parametric median resolution durations for every support tier and operational team in the organization.',
      metricBadge: `Overall: ${kpis.medianResolutionHours}h median`,
      icon: BarChart2,
      color: 'blue'
    }
  ];

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim() || isLoading) return;
    onCustomQuery(customInput);
    setCustomInput('');
  };

  const filteredQuestions = activeCategory === 'all'
    ? questions
    : questions.filter(q => q.category === activeCategory);

  return (
    <div className="space-y-6 text-slate-800">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-2">
            <Bot className="w-3.5 h-3.5 text-teal-600" />
            <span>Autonomous Operations Intelligence</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Business Operations Analyst Agent
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Choose an operational inquiry below or submit a custom question. The agent executes deterministic code calculations on the actual dataset and formulates executive findings with improvement briefs.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1 rounded-lg transition ${activeCategory === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'}`}
          >
            All Questions (8)
          </button>
          <button
            onClick={() => setActiveCategory('volume')}
            className={`px-3 py-1 rounded-lg transition ${activeCategory === 'volume' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'}`}
          >
            Volume & Backlog
          </button>
          <button
            onClick={() => setActiveCategory('sla')}
            className={`px-3 py-1 rounded-lg transition ${activeCategory === 'sla' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'}`}
          >
            SLA Risk
          </button>
          <button
            onClick={() => setActiveCategory('staffing')}
            className={`px-3 py-1 rounded-lg transition ${activeCategory === 'staffing' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'}`}
          >
            Capacity & Medians
          </button>
          <button
            onClick={() => setActiveCategory('quality')}
            className={`px-3 py-1 rounded-lg transition ${activeCategory === 'quality' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'}`}
          >
            Quality & CSAT
          </button>
        </div>
      </div>

      {/* 8 Verified Example Questions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredQuestions.map((q) => {
          const Icon = q.icon;
          return (
            <div
              key={q.key}
              className="bg-white border border-slate-200 hover:border-teal-400 rounded-2xl p-5 shadow-sm transition flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center group-hover:scale-105 transition">
                      <Icon className="w-4 h-4 text-teal-600" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                        Function: {q.func}
                      </span>
                      <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-teal-700 transition">
                        {q.title}
                      </h3>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {q.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/80">
                  {q.metricBadge}
                </span>

                <button
                  onClick={() => onRunInvestigation(q.key)}
                  disabled={isLoading}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-teal-600 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1 shadow-sm disabled:opacity-50"
                >
                  <span>Investigate</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom Inquiry Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-900">
          <Sparkles className="w-4 h-4 text-teal-600" />
          <span>Ask Custom Operational Question</span>
        </div>
        <p className="text-xs text-slate-500">
          Have a specific queue question? Type it below. The agent maps your prompt to the nearest deterministic calculation function or executes a multi-dimensional slice on the dataset.
        </p>

        <form onSubmit={handleCustomSubmit} className="flex gap-2">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="e.g. Which team had the highest response delay for High priority billing issues?"
            disabled={isLoading}
            className="flex-1 text-xs font-medium rounded-xl px-4 py-2.5 border border-slate-300 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 bg-slate-50 focus:bg-white"
          />
          <button
            type="submit"
            disabled={isLoading || !customInput.trim()}
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-sm disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Analyze</span>
          </button>
        </form>
      </div>
    </div>
  );
};
