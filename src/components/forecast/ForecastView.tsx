import React from 'react';
import { SupportTicket, OperationsKpis, ForecastResult } from '../../types/operations';
import { calculateForecast } from '../../utils/operationsEngine';
import {
  TrendingUp,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  Layers,
  ShieldAlert,
  HelpCircle,
  FileSpreadsheet,
  Activity,
  ArrowRight,
  Info
} from 'lucide-react';

interface ForecastViewProps {
  tickets: SupportTicket[];
  kpis: OperationsKpis;
  onLoadSampleData?: () => void;
}

export const ForecastView: React.FC<ForecastViewProps> = ({
  tickets,
  kpis,
  onLoadSampleData
}) => {
  const forecast: ForecastResult = calculateForecast(tickets);

  // If insufficient historical data (< 7 calendar days), do not produce a forecast!
  if (!forecast.hasSufficientData) {
    return (
      <div className="space-y-6 text-slate-800">
        {/* Header */}
        <div className="border-b border-slate-200 pb-5">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold mb-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Statistical Validation Guardrail Active</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            7-Day Backlog & SLA Risk Forecast
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Empirical operations forecasting engine with uncertainty bounds and conservative sample size checks.
          </p>
        </div>

        {/* Insufficient Data Guardrail Banner */}
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6 text-amber-700" />
            </div>
            <div className="space-y-2">
              <h3 className="font-extrabold text-lg text-amber-950">
                Forecast Suppressed: Insufficient Historical Depth
              </h3>
              <p className="text-sm text-amber-900 leading-relaxed max-w-2xl">
                {forecast.insufficientReason ||
                  `To ensure operational integrity, SupportFlow requires a minimum of 7 distinct calendar days of ticket observations to compute reliable daily arrival and completion velocity parameters. Your active dataset contains only ${forecast.daysOfHistory} distinct day(s).`}
              </p>
            </div>
          </div>

          <div className="p-4 bg-white/80 border border-amber-200 rounded-xl text-xs text-slate-700 space-y-2">
            <div className="font-bold text-slate-900 flex items-center space-x-2">
              <Info className="w-4 h-4 text-teal-600" />
              <span>Why We Enforce This Guardrail:</span>
            </div>
            <p className="leading-relaxed text-slate-600">
              Predicting queue behavior on small sample intervals creates severe sampling bias and artificial volatility. Suppressing speculative predictions prevents operational leaders from making costly staffing decisions based on unverified forecasts.
            </p>
          </div>

          {onLoadSampleData && (
            <div className="pt-2">
              <button
                onClick={onLoadSampleData}
                className="px-5 py-2.5 bg-slate-900 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-2 shadow-sm"
              >
                <span>Load Verified Sample Dataset (14 Days of History)</span>
                <ArrowRight className="w-4 h-4 text-teal-400" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Sufficient Historical Data Available: Render Full Forecast
  const maxProjected = Math.max(...forecast.forecastDays.map(d => d.upperBound), 1);

  return (
    <div className="space-y-6 text-slate-800">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-2">
            <Activity className="w-3.5 h-3.5 text-teal-600" />
            <span>Empirical Time-Series Projection</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            7-Day Backlog & SLA Risk Forecast
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Grounded in {forecast.daysOfHistory} distinct operational days of historical ticket arrivals and completions.
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700">
          <Calendar className="w-3.5 h-3.5 text-teal-600" />
          <span>Historical Horizon: {forecast.daysOfHistory} Days</span>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Current Backlog</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-black text-slate-900 font-mono">{forecast.currentBacklog}</span>
            <span className="text-xs text-slate-400">tickets</span>
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Projected 7-Day Backlog</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className={`text-2xl font-black font-mono ${forecast.sevenDayEndBacklog > forecast.currentBacklog ? 'text-amber-600' : 'text-emerald-600'}`}>
              {forecast.sevenDayEndBacklog}
            </span>
            <span className="text-xs text-slate-400">tickets</span>
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Arrival Rate (λ)</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-black text-teal-700 font-mono">{forecast.avgDailyArrivalRate}</span>
            <span className="text-xs text-slate-400">tck/day</span>
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Est. 7-Day Breach Risk</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-black text-red-600 font-mono">{forecast.projected7DayBreachRiskPct}%</span>
            <span className="text-xs text-slate-400">of queue</span>
          </div>
        </div>
      </div>

      {/* Projection Chart & Trajectory Envelope */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">
              7-Day Backlog Trajectory with 95% Confidence Envelope
            </h3>
            <p className="text-xs text-slate-500">
              Shows projected midpoint backlog (teal line) bounded by empirical variance bounds [lower, upper].
            </p>
          </div>
          <div className="flex items-center space-x-4 text-xs font-medium">
            <div className="flex items-center space-x-1.5">
              <div className="w-3 h-3 rounded bg-teal-500" />
              <span className="text-slate-600">Projected Midpoint</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <div className="w-3 h-3 rounded bg-teal-100 border border-teal-300" />
              <span className="text-slate-600">Uncertainty Envelope</span>
            </div>
          </div>
        </div>

        {/* Forecast Chart Columns */}
        <div className="pt-4 grid grid-cols-7 gap-2 sm:gap-4 items-end min-h-[220px]">
          {forecast.forecastDays.map((day, idx) => {
            const barHeightPct = Math.max(12, Math.round((day.projectedBacklog / maxProjected) * 100));
            const upperPct = Math.min(100, Math.round((day.upperBound / maxProjected) * 100));
            const lowerPct = Math.max(0, Math.round((day.lowerBound / maxProjected) * 100));

            return (
              <div key={day.dayLabel} className="flex flex-col items-center h-full justify-end group">
                <div className="text-[10px] font-mono font-bold text-slate-600 mb-1 opacity-90 group-hover:opacity-100">
                  {day.projectedBacklog}
                </div>

                <div className="w-full max-w-[42px] bg-slate-100 rounded-t-xl relative flex items-end justify-center overflow-hidden h-[180px]">
                  {/* Confidence Interval Shaded Background */}
                  <div
                    className="absolute w-full bg-teal-100/70 border-t border-teal-300"
                    style={{ height: `${upperPct}%` }}
                  />

                  {/* Midpoint Solid Bar */}
                  <div
                    className="w-full bg-gradient-to-t from-teal-600 to-teal-500 rounded-t-lg transition-all z-10"
                    style={{ height: `${barHeightPct}%` }}
                  />
                </div>

                <div className="text-center mt-2">
                  <span className="block text-xs font-bold text-slate-800">{day.dayLabel}</span>
                  <span className="block text-[10px] font-mono text-slate-400">
                    [{day.lowerBound}-{day.upperBound}]
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily Breakdown Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
            Daily Forecast Parameters & Risk Breakdown
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            Arrivals: {forecast.avgDailyArrivalRate}/day &bull; Completions: {forecast.avgDailyCompletionRate}/day
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Forecast Horizon</th>
                <th className="py-2.5 px-4 text-center">Projected Arrivals (λ)</th>
                <th className="py-2.5 px-4 text-center">Projected Completions (μ)</th>
                <th className="py-2.5 px-4 text-center">Expected Backlog</th>
                <th className="py-2.5 px-4 text-center">95% Confidence Range</th>
                <th className="py-2.5 px-4 text-center">Est. Overdue Breaches</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-slate-700">
              {forecast.forecastDays.map(day => (
                <tr key={day.dayLabel} className="hover:bg-slate-50/70 transition">
                  <td className="py-2.5 px-4 font-bold text-slate-900">{day.dayLabel}</td>
                  <td className="py-2.5 px-4 text-center text-slate-600">+{day.projectedArrivals}</td>
                  <td className="py-2.5 px-4 text-center text-teal-700">-{day.projectedCompletions}</td>
                  <td className="py-2.5 px-4 text-center font-bold text-slate-900">{day.projectedBacklog}</td>
                  <td className="py-2.5 px-4 text-center text-slate-500">[{day.lowerBound} to {day.upperBound}]</td>
                  <td className="py-2.5 px-4 text-center text-red-600 font-bold">{day.estimatedBreaches}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Methodology & Uncertainty Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2 text-xs">
          <div className="flex items-center space-x-2 text-teal-800 font-bold">
            <Info className="w-4 h-4 text-teal-600" />
            <span>Forecasting Methodology</span>
          </div>
          <ul className="text-[11px] text-slate-600 space-y-2 list-disc list-inside leading-relaxed">
            {forecast.methodologyNotes.map((note, i) => (
              <li key={i}>{note}</li>
            ))}
          </ul>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2 text-xs">
          <div className="flex items-center space-x-2 text-amber-800 font-bold">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Uncertainty & Operational Risks</span>
          </div>
          <ul className="text-[11px] text-slate-600 space-y-2 list-disc list-inside leading-relaxed">
            {forecast.uncertaintyNotes.map((note, i) => (
              <li key={i}>{note}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
