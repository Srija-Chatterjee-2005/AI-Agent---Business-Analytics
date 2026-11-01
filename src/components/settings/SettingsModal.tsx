import React, { useState } from 'react';
import { SlaTargetSettings, AlertThresholds, TriggeredAlert, OperationsKpis } from '../../types/operations';
import { DEFAULT_SLA_TARGETS } from '../../utils/operationsEngine';
import {
  X,
  Settings,
  Shield,
  Bell,
  Users,
  Clock,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Save,
  Plus,
  Trash2
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  slaSettings: SlaTargetSettings;
  onSaveSlaSettings: (settings: SlaTargetSettings) => void;
  alertThresholds: AlertThresholds;
  onSaveAlertThresholds: (thresholds: AlertThresholds) => void;
  customTeams: string[];
  onSaveCustomTeams: (teams: string[]) => void;
  kpis: OperationsKpis;
  triggeredAlerts: TriggeredAlert[];
}

export const DEFAULT_ALERT_THRESHOLDS: AlertThresholds = {
  maxBacklog: 25,
  maxSlaBreachRatePct: 15,
  minCsatScore: 4.0,
  maxReopenRatePct: 8
};

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  slaSettings,
  onSaveSlaSettings,
  alertThresholds,
  onSaveAlertThresholds,
  customTeams,
  onSaveCustomTeams,
  kpis,
  triggeredAlerts
}) => {
  const [activeTab, setActiveTab] = useState<'sla' | 'alerts' | 'queues'>('sla');

  // Local editable copies
  const [localSla, setLocalSla] = useState<SlaTargetSettings>({ ...slaSettings });
  const [localThresholds, setLocalThresholds] = useState<AlertThresholds>({ ...alertThresholds });
  const [localTeams, setLocalTeams] = useState<string[]>([...customTeams]);
  const [newTeamInput, setNewTeamInput] = useState<string>('');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSaveAll = () => {
    onSaveSlaSettings(localSla);
    onSaveAlertThresholds(localThresholds);
    onSaveCustomTeams(localTeams);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 600);
  };

  const handleResetDefaults = () => {
    setLocalSla({ ...DEFAULT_SLA_TARGETS });
    setLocalThresholds({ ...DEFAULT_ALERT_THRESHOLDS });
  };

  const handleAddTeam = () => {
    if (newTeamInput.trim() && !localTeams.includes(newTeamInput.trim())) {
      setLocalTeams([...localTeams, newTeamInput.trim()]);
      setNewTeamInput('');
    }
  };

  const handleRemoveTeam = (teamToRemove: string) => {
    setLocalTeams(localTeams.filter(t => t !== teamToRemove));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white border border-slate-200 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-800">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-700 flex items-center justify-center">
              <Settings className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Operations Configuration & Alert Thresholds
              </h3>
              <p className="text-xs text-slate-500">
                Customize operational SLA targets, threshold triggers, and queue definitions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Bar */}
        <div className="flex border-b border-slate-200 bg-slate-50/50 px-5 pt-2">
          <button
            onClick={() => setActiveTab('sla')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition flex items-center space-x-2 ${
              activeTab === 'sla'
                ? 'border-teal-600 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-teal-600" />
            <span>SLA Target Hours</span>
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition flex items-center space-x-2 ${
              activeTab === 'alerts'
                ? 'border-teal-600 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Bell className="w-3.5 h-3.5 text-amber-500" />
            <span>Alert Thresholds</span>
            {triggeredAlerts.length > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 font-mono">
                {triggeredAlerts.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('queues')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition flex items-center space-x-2 ${
              activeTab === 'queues'
                ? 'border-teal-600 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-sky-600" />
            <span>Teams & Queues ({localTeams.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {activeTab === 'sla' && (
            <div className="space-y-4">
              <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900 leading-relaxed">
                Adjusting SLA target hours immediately recalculates SLA breach percentages, overdue counts, and chart benchmarks across the entire dashboard.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-red-700 uppercase">Critical Priority</span>
                    <span className="text-xs font-mono text-slate-500">Default: 4 hrs</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="1"
                      max="72"
                      value={localSla.Critical}
                      onChange={(e) => setLocalSla({ ...localSla, Critical: Math.max(1, Number(e.target.value)) })}
                      className="w-full text-sm font-bold text-slate-900 bg-white border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-teal-500"
                    />
                    <span className="text-xs text-slate-500 font-semibold">Hours</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-700 uppercase">High Priority</span>
                    <span className="text-xs font-mono text-slate-500">Default: 8 hrs</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="1"
                      max="120"
                      value={localSla.High}
                      onChange={(e) => setLocalSla({ ...localSla, High: Math.max(1, Number(e.target.value)) })}
                      className="w-full text-sm font-bold text-slate-900 bg-white border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-teal-500"
                    />
                    <span className="text-xs text-slate-500 font-semibold">Hours</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-700 uppercase">Medium Priority</span>
                    <span className="text-xs font-mono text-slate-500">Default: 24 hrs</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="2"
                      max="240"
                      value={localSla.Medium}
                      onChange={(e) => setLocalSla({ ...localSla, Medium: Math.max(2, Number(e.target.value)) })}
                      className="w-full text-sm font-bold text-slate-900 bg-white border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-teal-500"
                    />
                    <span className="text-xs text-slate-500 font-semibold">Hours</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 uppercase">Low Priority</span>
                    <span className="text-xs font-mono text-slate-500">Default: 48 hrs</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="4"
                      max="360"
                      value={localSla.Low}
                      onChange={(e) => setLocalSla({ ...localSla, Low: Math.max(4, Number(e.target.value)) })}
                      className="w-full text-sm font-bold text-slate-900 bg-white border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-teal-500"
                    />
                    <span className="text-xs text-slate-500 font-semibold">Hours</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed">
                When actual operational metrics breach these custom thresholds, automated visual banners and warning badges highlight in the dashboard.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>Backlog Alert Threshold</span>
                    <span className="font-mono text-slate-500">Current: {kpis.openBacklog}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="5"
                      max="500"
                      value={localThresholds.maxBacklog}
                      onChange={(e) => setLocalThresholds({ ...localThresholds, maxBacklog: Number(e.target.value) })}
                      className="w-full text-sm font-bold text-slate-900 bg-white border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-teal-500"
                    />
                    <span className="text-xs text-slate-500 font-semibold">Tickets</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Triggers if open backlog exceeds this count.</p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>Max SLA Breach Rate</span>
                    <span className="font-mono text-slate-500">Current: {kpis.slaBreachRatePct}%</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={localThresholds.maxSlaBreachRatePct}
                      onChange={(e) => setLocalThresholds({ ...localThresholds, maxSlaBreachRatePct: Number(e.target.value) })}
                      className="w-full text-sm font-bold text-slate-900 bg-white border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-teal-500"
                    />
                    <span className="text-xs text-slate-500 font-semibold">%</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Triggers if overall SLA breach % exceeds this limit.</p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>Min CSAT Satisfaction</span>
                    <span className="font-mono text-slate-500">Current: {kpis.avgSatisfactionScore}/5.0</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      step="0.1"
                      min="1.0"
                      max="5.0"
                      value={localThresholds.minCsatScore}
                      onChange={(e) => setLocalThresholds({ ...localThresholds, minCsatScore: Number(e.target.value) })}
                      className="w-full text-sm font-bold text-slate-900 bg-white border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-teal-500"
                    />
                    <span className="text-xs text-slate-500 font-semibold">/ 5.0</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Triggers if average customer satisfaction drops below this score.</p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>Max Ticket Reopen Rate</span>
                    <span className="font-mono text-slate-500">Current: {kpis.reopenRatePct}%</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={localThresholds.maxReopenRatePct}
                      onChange={(e) => setLocalThresholds({ ...localThresholds, maxReopenRatePct: Number(e.target.value) })}
                      className="w-full text-sm font-bold text-slate-900 bg-white border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-teal-500"
                    />
                    <span className="text-xs text-slate-500 font-semibold">%</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Triggers if percentage of reopened tickets exceeds this rate.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'queues' && (
            <div className="space-y-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Enter custom team or queue name..."
                  value={newTeamInput}
                  onChange={(e) => setNewTeamInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTeam()}
                  className="flex-1 text-xs font-medium rounded-xl px-3 py-2 border border-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
                <button
                  onClick={handleAddTeam}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Queue</span>
                </button>
              </div>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                {localTeams.map(team => (
                  <div key={team} className="px-4 py-2.5 flex items-center justify-between hover:bg-white transition text-xs">
                    <span className="font-semibold text-slate-800">{team}</span>
                    <button
                      onClick={() => handleRemoveTeam(team)}
                      className="text-slate-400 hover:text-red-600 p-1 rounded transition"
                      title="Remove team"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={handleResetDefaults}
            className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-xl flex items-center space-x-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAll}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center space-x-1.5 transition"
            >
              {saveSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Settings</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
