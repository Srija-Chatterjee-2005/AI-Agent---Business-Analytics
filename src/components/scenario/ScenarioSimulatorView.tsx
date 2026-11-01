import React, { useState } from 'react';
import { SupportTicket, OperationsKpis, ScenarioProjectionResult } from '../../types/operations';
import { calculateMultiScenario } from '../../utils/operationsEngine';
import {
  Users,
  Clock,
  TrendingDown,
  Sparkles,
  Calculator,
  ShieldAlert,
  ArrowRight,
  FileCheck2,
  Sliders,
  CheckCircle2,
  Info,
  Layers
} from 'lucide-react';

interface ScenarioSimulatorViewProps {
  tickets: SupportTicket[];
  kpis: OperationsKpis;
  teams: string[];
  onDraftBriefFromScenario?: (scenario: ScenarioProjectionResult, queueName: string) => void;
}

export const ScenarioSimulatorView: React.FC<ScenarioSimulatorViewProps> = ({
  tickets,
  kpis,
  teams,
  onDraftBriefFromScenario
}) => {
  const [selectedQueue, setSelectedQueue] = useState<string>(kpis.busiestQueue.team || teams[0] || 'Tier 2 Technical');
  const [baselineFte, setBaselineFte] = useState<number>(3);
  const [hoursPerDay, setHoursPerDay] = useState<number>(8);

  // Compute side-by-side scenarios
  const scenarios: ScenarioProjectionResult[] = calculateMultiScenario(
    tickets,
    selectedQueue,
    baselineFte,
    hoursPerDay
  );

  // Filter current queue statistics
  const queueTickets = tickets.filter(t => t.assigned_team === selectedQueue);
  const queueBacklog = queueTickets.filter(t => t.status !== 'Resolved' && t.status !== 'Closed').length;
  const queueAvgRes = queueTickets.length > 0
    ? Number((queueTickets.reduce((s, t) => s + t.resolution_time_hrs, 0) / queueTickets.length).toFixed(1))
    : 14.5;

  return (
    <div className="space-y-6 text-slate-800">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-2">
            <Calculator className="w-3.5 h-3.5 text-teal-600" />
            <span>Deterministic Capacity & Staffing Simulation</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Multi-Scenario Staffing & Workload Planner
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Model queue burn-down curves, daily ticket throughput capacity, and 7-day backlog impact across 4 side-by-side staffing and automation interventions.
          </p>
        </div>
      </div>

      {/* Control Panel Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
          <Sliders className="w-4 h-4 text-teal-600" />
          <span>Simulation Parameters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Target Queue Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Target Queue / Team</label>
            <select
              value={selectedQueue}
              onChange={(e) => setSelectedQueue(e.target.value)}
              className="w-full text-xs font-medium rounded-xl px-3 py-2.5 bg-slate-50 border border-slate-300 text-slate-800 focus:bg-white focus:border-teal-500 outline-none"
            >
              {teams.map(t => (
                <option key={t} value={t}>
                  {t} {t === kpis.busiestQueue.team ? '★ (Busiest Queue)' : ''}
                </option>
              ))}
            </select>
            <div className="text-[11px] text-slate-500 flex justify-between font-mono">
              <span>Backlog: {queueBacklog} tickets</span>
              <span>Avg Res: {queueAvgRes}h</span>
            </div>
          </div>

          {/* Baseline Headcount Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-bold text-slate-700">
              <label>Current Assigned Staff (FTE)</label>
              <span className="font-mono text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                {baselineFte} Analysts
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="12"
              value={baselineFte}
              onChange={(e) => setBaselineFte(Number(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>1 Analyst</span>
              <span>6 Analysts</span>
              <span>12 Analysts</span>
            </div>
          </div>

          {/* Working Hours Per Day Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-bold text-slate-700">
              <label>Productive Hours / Shift</label>
              <span className="font-mono text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                {hoursPerDay} hrs/day
              </span>
            </div>
            <input
              type="range"
              min="4"
              max="10"
              value={hoursPerDay}
              onChange={(e) => setHoursPerDay(Number(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>4 hrs (Part-time)</span>
              <span>8 hrs (Standard)</span>
              <span>10 hrs (Surge)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {scenarios.map((sc, idx) => {
          const isBaseline = idx === 0;
          const isAutomation = idx === 3;
          const backlogDelta = queueBacklog - sc.sevenDayBacklog;

          return (
            <div
              key={sc.scenarioName}
              className={`rounded-2xl border p-5 flex flex-col justify-between transition relative overflow-hidden ${
                isBaseline
                  ? 'bg-slate-50 border-slate-300'
                  : isAutomation
                  ? 'bg-sky-50/60 border-sky-300'
                  : 'bg-white border-teal-300 shadow-sm'
              }`}
            >
              {/* Badge */}
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full font-mono ${
                  isBaseline
                    ? 'bg-slate-200 text-slate-700'
                    : isAutomation
                    ? 'bg-sky-100 text-sky-800 border border-sky-300'
                    : 'bg-teal-100 text-teal-800 border border-teal-300'
                }`}>
                  {sc.scenarioName.split(':')[0]}
                </span>
                <span className="text-xs font-mono font-bold text-slate-500">
                  {sc.fteCount} FTE
                </span>
              </div>

              {/* Title */}
              <h3 className="font-extrabold text-sm text-slate-900 leading-snug min-h-[38px]">
                {sc.scenarioName.split(': ')[1]}
              </h3>

              {/* Metrics Grid */}
              <div className="mt-4 pt-3 border-t border-slate-200/70 space-y-2.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Daily Output Capacity:</span>
                  <span className="font-mono font-bold text-slate-900">{sc.dailyCapacityTickets} tck/day</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Daily Influx Rate:</span>
                  <span className="font-mono font-bold text-slate-700">{sc.dailyIncomingTickets} tck/day</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Net Daily Burn Rate:</span>
                  <span className={`font-mono font-bold ${sc.netDailyBurnRate > 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                    {sc.netDailyBurnRate > 0 ? `+${sc.netDailyBurnRate}` : sc.netDailyBurnRate} tck/day
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200/70">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[11px] font-semibold text-slate-500">7-Day Projected Backlog:</span>
                    <span className="text-lg font-black font-mono text-slate-900">
                      {sc.sevenDayBacklog} <span className="text-xs font-normal text-slate-400">tickets</span>
                    </span>
                  </div>
                  {backlogDelta > 0 && (
                    <div className="text-[11px] text-emerald-700 font-semibold flex items-center space-x-1 mt-0.5">
                      <TrendingDown className="w-3.5 h-3.5" />
                      <span>Burned {backlogDelta} tickets from queue</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center pt-1 text-[11px]">
                  <span className="text-slate-500">Est. SLA Breach Rate:</span>
                  <span className="font-mono font-bold text-slate-800">{sc.estimatedSlaBreachRate}%</span>
                </div>
              </div>

              {/* Action Button */}
              {onDraftBriefFromScenario && !isBaseline && (
                <button
                  onClick={() => onDraftBriefFromScenario(sc, selectedQueue)}
                  className="mt-5 w-full py-2 bg-slate-900 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-sm"
                >
                  <FileCheck2 className="w-3.5 h-3.5 text-teal-300" />
                  <span>Draft Brief for this Plan</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Methodology & Mathematical Foundations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2 text-xs">
          <div className="flex items-center space-x-2 text-teal-800 font-bold">
            <Calculator className="w-4 h-4 text-teal-600" />
            <span>Mathematical Model & Equations</span>
          </div>
          <div className="font-mono bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-700 space-y-1.5 text-[11px]">
            <div>1. Daily Capacity = (FTE × HoursPerShift) / QueueAvgResolutionHours</div>
            <div>2. Net Daily Burn Rate = Daily Capacity - IncomingArrivalRate</div>
            <div>3. Projected Backlog(t=7) = max(0, InitialBacklog - (NetDailyBurn × 7))</div>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            The simulation models queue accumulation via discrete conservation laws without artificial padding. Resolution averages reflect actual historical durations from the selected queue.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2 text-xs">
          <div className="flex items-center space-x-2 text-amber-800 font-bold">
            <Info className="w-4 h-4 text-amber-600" />
            <span>Operational Assumptions & Bounds</span>
          </div>
          <ul className="text-[11px] text-slate-600 space-y-1.5 list-disc list-inside leading-relaxed">
            <li>Analyst shift efficiency assumes 100% focused resolution availability during productive hours.</li>
            <li>New FTE onboarding ramp-up is modeled as immediate full throughput for surge sprint estimation.</li>
            <li>Scenario D (Intake Deflection) models an AI self-service or tier 0 FAQ deflection reducing influx by 25%.</li>
            <li>Unforeseen priority 1 major incidents may divert headcount away from standard queue burn-down.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
