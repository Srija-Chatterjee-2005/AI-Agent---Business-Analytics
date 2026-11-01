import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Sidebar, ActiveNavTab } from './components/layout/Sidebar';
import { OperationsOverview } from './components/dashboard/OperationsOverview';
import { AgentInquiriesView } from './components/investigation/AgentInquiriesView';
import { ScenarioSimulatorView } from './components/scenario/ScenarioSimulatorView';
import { ForecastView } from './components/forecast/ForecastView';
import { MultiMonthComparisonView } from './components/comparison/MultiMonthComparisonView';
import { SavedAnalysesView } from './components/history/SavedAnalysesView';
import { TicketDataPreview } from './components/data/TicketDataPreview';
import { BriefsView } from './components/brief/BriefsView';
import { InvestigationModal } from './components/investigation/InvestigationModal';
import { ImprovementBriefModal } from './components/brief/ImprovementBriefModal';
import { UploadModal } from './components/data/UploadModal';
import { ColumnMappingModal } from './components/data/ColumnMappingModal';
import { SettingsModal, DEFAULT_ALERT_THRESHOLDS } from './components/settings/SettingsModal';
import { PrintableReportModal } from './components/report/PrintableReportModal';
import {
  SupportTicket,
  OperationsKpis,
  TicketFilterState,
  InvestigationResult,
  ImprovementBrief,
  SlaTargetSettings,
  AlertThresholds,
  TriggeredAlert,
  SavedAnalysisRecord,
  QuestionKey,
  ColumnMapping,
  DataQualityAudit
} from './types/operations';
import {
  normalizeTicketData,
  filterTickets,
  calculateOperationsKpis,
  runComparePeriods,
  runGroupBacklog,
  runInspectSlaRisk,
  runCalculateStaffingScenario,
  runEvaluateCsatPerformance,
  runInspectReopenRate,
  runAuditCriticalSla,
  runCalculateTeamMedians,
  generateImprovementBrief,
  evaluateAlertRules,
  DEFAULT_SLA_TARGETS
} from './utils/operationsEngine';

export default function App() {
  const [activeView, setActiveView] = useState<ActiveNavTab>('overview');
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeFileName, setActiveFileName] = useState<string>('support_tickets.csv');

  // Filter state
  const [filters, setFilters] = useState<TicketFilterState>({
    team: 'all',
    category: 'all',
    priority: 'all',
    status: 'all',
    startDate: '',
    endDate: '',
    drillDownType: null,
    drillDownValue: null
  });

  // Settings & Thresholds (persisted in localStorage)
  const [slaSettings, setSlaSettings] = useState<SlaTargetSettings>(() => {
    try {
      const saved = localStorage.getItem('supportflow_sla_settings');
      return saved ? JSON.parse(saved) : DEFAULT_SLA_TARGETS;
    } catch {
      return DEFAULT_SLA_TARGETS;
    }
  });

  const [alertThresholds, setAlertThresholds] = useState<AlertThresholds>(() => {
    try {
      const saved = localStorage.getItem('supportflow_alert_thresholds');
      return saved ? JSON.parse(saved) : DEFAULT_ALERT_THRESHOLDS;
    } catch {
      return DEFAULT_ALERT_THRESHOLDS;
    }
  });

  const [customTeams, setCustomTeams] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('supportflow_custom_teams');
      return saved ? JSON.parse(saved) : [
        'Tier 1 Support',
        'Tier 2 Technical',
        'Billing Operations',
        'Security & IT Ops',
        'Enterprise VIP Squad'
      ];
    } catch {
      return [
        'Tier 1 Support',
        'Tier 2 Technical',
        'Billing Operations',
        'Security & IT Ops',
        'Enterprise VIP Squad'
      ];
    }
  });

  // Saved Analyses (persisted in localStorage)
  const [savedAnalyses, setSavedAnalyses] = useState<SavedAnalysisRecord[]>(() => {
    try {
      const saved = localStorage.getItem('supportflow_saved_analyses');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Saved Briefs (persisted in localStorage)
  const [savedBriefs, setSavedBriefs] = useState<ImprovementBrief[]>(() => {
    try {
      const saved = localStorage.getItem('supportflow_saved_briefs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modal states
  const [activeInvestigation, setActiveInvestigation] = useState<InvestigationResult | null>(null);
  const [recentInvestigations, setRecentInvestigations] = useState<InvestigationResult[]>([]);
  const [activeBrief, setActiveBrief] = useState<ImprovementBrief | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [isColumnMappingOpen, setIsColumnMappingOpen] = useState<boolean>(false);
  const [rawRowsForMapping, setRawRowsForMapping] = useState<Record<string, any>[] | null>(null);
  const [fileNameForMapping, setFileNameForMapping] = useState<string>('');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isDraftingBrief, setIsDraftingBrief] = useState<boolean>(false);
  const [isInvestigating, setIsInvestigating] = useState<boolean>(false);

  // Sync settings to localStorage
  useEffect(() => {
    localStorage.setItem('supportflow_sla_settings', JSON.stringify(slaSettings));
  }, [slaSettings]);

  useEffect(() => {
    localStorage.setItem('supportflow_alert_thresholds', JSON.stringify(alertThresholds));
  }, [alertThresholds]);

  useEffect(() => {
    localStorage.setItem('supportflow_custom_teams', JSON.stringify(customTeams));
  }, [customTeams]);

  useEffect(() => {
    localStorage.setItem('supportflow_saved_analyses', JSON.stringify(savedAnalyses));
  }, [savedAnalyses]);

  useEffect(() => {
    localStorage.setItem('supportflow_saved_briefs', JSON.stringify(savedBriefs));
  }, [savedBriefs]);

  // Load default sample support_tickets.csv on initial mount
  useEffect(() => {
    loadSampleData('/samples/support_tickets.csv', 'support_tickets.csv');
  }, []);

  const loadSampleData = async (url: string, fileName: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(url);
      const csvText = await res.text();
      Papa.parse(csvText, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          const raw = (results.data as Record<string, any>[]).filter(r => Object.keys(r).length > 2);
          const normalized = normalizeTicketData(raw, undefined, slaSettings);
          setTickets(normalized);
          setActiveFileName(fileName);
          setIsLoading(false);
        }
      });
    } catch (err) {
      console.error('Failed to load sample dataset:', err);
      setIsLoading(false);
    }
  };

  const handleResetFilters = () => {
    setFilters({
      team: 'all',
      category: 'all',
      priority: 'all',
      status: 'all',
      startDate: '',
      endDate: '',
      drillDownType: null,
      drillDownValue: null
    });
  };

  // Filter tickets dynamically in app code
  const filteredTickets = filterTickets(tickets, filters);

  // Calculate KPIs with custom SLA settings
  const kpis: OperationsKpis = calculateOperationsKpis(filteredTickets, slaSettings);

  // Evaluate In-App Alert Thresholds
  const triggeredAlerts: TriggeredAlert[] = evaluateAlertRules(kpis, alertThresholds);

  // Distinct Teams & Categories
  const uniqueTeams = Array.from(new Set([...customTeams, ...tickets.map(t => t.assigned_team)])).filter(Boolean);
  const uniqueCategories = Array.from(new Set(tickets.map(t => t.category))).filter(Boolean);

  // Execute one of the 8 verified investigation functions
  const handleRunInvestigation = async (questionKey: QuestionKey) => {
    setIsInvestigating(true);

    let baselineResult: InvestigationResult;
    switch (questionKey) {
      case 'what_changed':
        baselineResult = runComparePeriods(tickets);
        break;
      case 'largest_backlog':
        baselineResult = runGroupBacklog(tickets);
        break;
      case 'sla_breaches':
        baselineResult = runInspectSlaRisk(tickets, slaSettings);
        break;
      case 'staffing_scenario':
        baselineResult = runCalculateStaffingScenario(tickets, kpis.busiestQueue.team);
        break;
      case 'csat_performance':
        baselineResult = runEvaluateCsatPerformance(tickets);
        break;
      case 'reopen_rate':
        baselineResult = runInspectReopenRate(tickets);
        break;
      case 'critical_sla':
        baselineResult = runAuditCriticalSla(tickets, slaSettings);
        break;
      case 'team_medians':
        baselineResult = runCalculateTeamMedians(tickets);
        break;
      default:
        baselineResult = runComparePeriods(tickets);
    }

    try {
      const response = await fetch('/api/operations/investigate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionKey,
          baselineResult
        })
      });

      if (response.ok) {
        const enriched = await response.json();
        const finalResult: InvestigationResult = {
          ...baselineResult,
          finding: enriched.finding || baselineResult.finding,
          suggestedAction: enriched.suggestedAction || baselineResult.suggestedAction,
          assumptions: enriched.assumptions || baselineResult.assumptions
        };
        setActiveInvestigation(finalResult);
        setRecentInvestigations(prev => [finalResult, ...prev.filter(i => i.questionKey !== questionKey)].slice(0, 10));
      } else {
        setActiveInvestigation(baselineResult);
        setRecentInvestigations(prev => [baselineResult, ...prev.filter(i => i.questionKey !== questionKey)].slice(0, 10));
      }
    } catch {
      setActiveInvestigation(baselineResult);
      setRecentInvestigations(prev => [baselineResult, ...prev.filter(i => i.questionKey !== questionKey)].slice(0, 10));
    } finally {
      setIsInvestigating(false);
    }
  };

  // Custom User Query
  const handleCustomQuery = async (prompt: string) => {
    setIsInvestigating(true);
    const lower = prompt.toLowerCase();
    let qKey: QuestionKey = 'what_changed';
    if (lower.includes('backlog') || lower.includes('queue') || lower.includes('largest')) {
      qKey = 'largest_backlog';
    } else if (lower.includes('sla') || lower.includes('breach') || lower.includes('overdue')) {
      qKey = 'sla_breaches';
    } else if (lower.includes('staff') || lower.includes('person') || lower.includes('fte') || lower.includes('hire')) {
      qKey = 'staffing_scenario';
    } else if (lower.includes('csat') || lower.includes('satisfaction') || lower.includes('rating')) {
      qKey = 'csat_performance';
    } else if (lower.includes('reopen') || lower.includes('repeat')) {
      qKey = 'reopen_rate';
    } else if (lower.includes('critical') || lower.includes('p1')) {
      qKey = 'critical_sla';
    } else if (lower.includes('median') || lower.includes('team') || lower.includes('resolution')) {
      qKey = 'team_medians';
    }

    await handleRunInvestigation(qKey);
  };

  // Draft Operational Improvement Brief
  const handleDraftBrief = async (investigation: InvestigationResult) => {
    setIsDraftingBrief(true);
    const baselineBrief = generateImprovementBrief(investigation, kpis);

    try {
      const response = await fetch('/api/operations/draft-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ briefTemplate: baselineBrief })
      });

      if (response.ok) {
        const data = await response.json();
        setActiveBrief(data.brief || baselineBrief);
      } else {
        setActiveBrief(baselineBrief);
      }
    } catch {
      setActiveBrief(baselineBrief);
    } finally {
      setIsDraftingBrief(false);
      setActiveInvestigation(null);
    }
  };

  const handleSaveBrief = (brief: ImprovementBrief) => {
    setSavedBriefs(prev => [brief, ...prev.filter(b => b.briefId !== brief.briefId)]);
    setActiveBrief(null);
  };

  // Saved Analyses Handlers
  const handleSaveCurrentAnalysis = (title: string, notes?: string) => {
    const newRecord: SavedAnalysisRecord = {
      id: `analysis_${Date.now()}`,
      title,
      datasetName: activeFileName,
      dateSaved: new Date().toLocaleDateString(),
      ticketCount: tickets.length,
      kpis,
      filters: { ...filters },
      notes,
      briefsCount: savedBriefs.length
    };
    setSavedAnalyses(prev => [newRecord, ...prev]);
  };

  const handleLoadAnalysis = (record: SavedAnalysisRecord) => {
    setFilters(record.filters);
    setActiveView('overview');
  };

  const handleRenameAnalysis = (id: string, newTitle: string) => {
    setSavedAnalyses(prev => prev.map(a => a.id === id ? { ...a, title: newTitle } : a));
  };

  const handleDeleteAnalysis = (id: string) => {
    setSavedAnalyses(prev => prev.filter(a => a.id !== id));
  };

  // File Upload -> Column Mapping Workflow
  const handleFileSelectedForMapping = (rawRows: Record<string, any>[], fileName: string) => {
    setRawRowsForMapping(rawRows);
    setFileNameForMapping(fileName);
    setIsColumnMappingOpen(true);
  };

  const handleApplyColumnMapping = (normalized: SupportTicket[], mapping: ColumnMapping, audit: DataQualityAudit) => {
    setTickets(normalized);
    setActiveFileName(fileNameForMapping);
    handleResetFilters();
    setActiveView('overview');
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#f8fafc] text-slate-800 antialiased font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        ticketCount={tickets.length}
        openBacklogCount={kpis.openBacklog}
        onOpenUpload={() => setIsUploadOpen(true)}
        onSelectSample={() => loadSampleData('/samples/support_tickets.csv', 'support_tickets.csv')}
        activeFileName={activeFileName}
        onOpenSettings={() => setIsSettingsOpen(true)}
        alertCount={triggeredAlerts.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-semibold text-slate-600">
              Profiling operations dataset & computing metrics...
            </p>
          </div>
        ) : (
          <>
            {activeView === 'overview' && (
              <OperationsOverview
                tickets={tickets}
                filteredTickets={filteredTickets}
                kpis={kpis}
                filters={filters}
                setFilters={setFilters}
                onResetFilters={handleResetFilters}
                onRunInvestigation={handleRunInvestigation}
                teams={uniqueTeams}
                categories={uniqueCategories}
                triggeredAlerts={triggeredAlerts}
                onOpenReport={() => setIsReportModalOpen(true)}
                onOpenAlertSettings={() => setIsSettingsOpen(true)}
              />
            )}

            {activeView === 'investigations' && (
              <AgentInquiriesView
                tickets={tickets}
                kpis={kpis}
                onRunInvestigation={handleRunInvestigation}
                onCustomQuery={handleCustomQuery}
                isLoading={isInvestigating}
              />
            )}

            {activeView === 'scenarios' && (
              <ScenarioSimulatorView
                tickets={tickets}
                kpis={kpis}
                teams={uniqueTeams}
                onDraftBriefFromScenario={(sc, queueName) => {
                  const invResult = runCalculateStaffingScenario(tickets, queueName, sc.fteCount);
                  handleDraftBrief(invResult);
                }}
              />
            )}

            {activeView === 'forecast' && (
              <ForecastView
                tickets={tickets}
                kpis={kpis}
                onLoadSampleData={() => loadSampleData('/samples/support_tickets.csv', 'support_tickets.csv')}
              />
            )}

            {activeView === 'comparison' && (
              <MultiMonthComparisonView
                currentTickets={tickets}
                currentFileName={activeFileName}
                onOpenUploadMonthlyFile={() => setIsUploadOpen(true)}
              />
            )}

            {activeView === 'saved' && (
              <SavedAnalysesView
                savedAnalyses={savedAnalyses}
                onLoadAnalysis={handleLoadAnalysis}
                onSaveCurrentAnalysis={handleSaveCurrentAnalysis}
                onRenameAnalysis={handleRenameAnalysis}
                onDeleteAnalysis={handleDeleteAnalysis}
                currentTicketCount={tickets.length}
                currentDatasetName={activeFileName}
              />
            )}

            {activeView === 'data' && (
              <TicketDataPreview
                tickets={filteredTickets}
                fileName={activeFileName}
              />
            )}

            {activeView === 'briefs' && (
              <BriefsView
                briefs={savedBriefs}
                onSelectBrief={(b) => setActiveBrief(b)}
                onDeleteBrief={(briefId: string) => {
                  setSavedBriefs(prev => prev.filter(b => b.briefId !== briefId));
                }}
                onOpenInvestigationModal={() => setActiveView('investigations')}
              />
            )}
          </>
        )}
      </main>

      {/* Investigation Details Modal */}
      <InvestigationModal
        investigation={activeInvestigation}
        onClose={() => setActiveInvestigation(null)}
        onDraftBrief={handleDraftBrief}
        isDraftingBrief={isDraftingBrief}
      />

      {/* Improvement Brief Modal */}
      <ImprovementBriefModal
        brief={activeBrief}
        onClose={() => setActiveBrief(null)}
        onSaveBrief={handleSaveBrief}
      />

      {/* File Upload Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onFileSelectedForMapping={handleFileSelectedForMapping}
      />

      {/* Column Mapping & Pre-Analysis Data Audit Modal */}
      {rawRowsForMapping && (
        <ColumnMappingModal
          isOpen={isColumnMappingOpen}
          onClose={() => {
            setIsColumnMappingOpen(false);
            setRawRowsForMapping(null);
          }}
          rawRows={rawRowsForMapping}
          fileName={fileNameForMapping}
          onApplyMapping={handleApplyColumnMapping}
        />
      )}

      {/* Operations Settings & Thresholds Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        slaSettings={slaSettings}
        onSaveSlaSettings={setSlaSettings}
        alertThresholds={alertThresholds}
        onSaveAlertThresholds={setAlertThresholds}
        customTeams={customTeams}
        onSaveCustomTeams={setCustomTeams}
        kpis={kpis}
        triggeredAlerts={triggeredAlerts}
      />

      {/* Printable Operations Investigation Report Modal */}
      <PrintableReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        fileName={activeFileName}
        tickets={filteredTickets}
        kpis={kpis}
        filters={filters}
        investigations={recentInvestigations}
        savedBriefs={savedBriefs}
      />
    </div>
  );
}
