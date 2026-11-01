export interface SupportTicket {
  ticket_id: string;
  date_created: string;
  category: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  assigned_team: string;
  status: 'Closed' | 'Resolved' | 'In Progress' | 'Open' | 'Waiting on Customer';
  response_time_hrs: number;
  resolution_time_hrs: number;
  sla_target_hrs: number;
  satisfaction_score: number | null;
  reopened_count: number;
}

export interface SlaTargetSettings {
  Critical: number;
  High: number;
  Medium: number;
  Low: number;
}

export interface OperationsKpis {
  totalTickets: number;
  openBacklog: number;
  resolvedTickets: number;
  slaBreachesCount: number;
  slaBreachRatePct: number;
  medianResolutionHours: number;
  avgResolutionHours: number;
  avgSatisfactionScore: number;
  csatResponseCount: number;
  reopenedTicketsCount: number;
  reopenRatePct: number;
  busiestQueue: {
    team: string;
    category: string;
    openCount: number;
  };
}

export interface TicketFilterState {
  team: string;
  category: string;
  priority: string;
  status: string;
  startDate: string;
  endDate: string;
  drillDownType?: 'day' | 'category' | 'team' | 'priority' | null;
  drillDownValue?: string | null;
}

export interface ChartSeriesPoint {
  label: string;
  value: number;
  secondaryValue?: number;
}

export type QuestionKey =
  | 'what_changed'
  | 'largest_backlog'
  | 'sla_breaches'
  | 'staffing_scenario'
  | 'csat_performance'
  | 'reopen_rate'
  | 'critical_sla'
  | 'team_medians';

export interface InvestigationResult {
  questionKey: QuestionKey;
  questionTitle: string;
  functionUsed: string;
  finding: string;
  evidence: {
    label: string;
    value: string | number;
    benchmark?: string;
  }[];
  suggestedAction: string;
  chartData?: ChartSeriesPoint[];
  staffingImpact?: {
    currentHeadcount: number;
    proposedHeadcount: number;
    currentBacklog: number;
    projectedBacklogIn5Days: number;
    slaBreachReductionPct: number;
    throughputGainPct: number;
  };
  assumptions: string[];
}

export interface ImprovementBrief {
  briefId: string;
  title: string;
  authorRole: string;
  dateGenerated: string;
  investigationRef: string;
  problemStatement: string;
  metricsBaseline: {
    current: string;
    target: string;
  }[];
  proposedRequirements: {
    id: string;
    type: 'Functional' | 'Non-Functional';
    statement: string;
  }[];
  acceptanceCriteria: string;
  uatChecks: {
    id: string;
    scenario: string;
    expectedResult: string;
    verified: boolean;
  }[];
}

export interface ColumnMapping {
  ticket_id: string;
  date_created: string;
  category: string;
  priority: string;
  assigned_team: string;
  status: string;
  response_time_hrs: string;
  resolution_time_hrs: string;
  sla_target_hrs: string;
  satisfaction_score: string;
  reopened_count: string;
}

export interface DataQualityAudit {
  totalRows: number;
  missingFields: Record<string, number>;
  duplicateRowsCount: number;
  invalidValuesCount: number;
  invalidFindings: {
    row: number;
    field: string;
    issue: string;
    value: any;
  }[];
}

export interface AlertThresholds {
  maxBacklog: number;
  maxSlaBreachRatePct: number;
  minCsatScore: number;
  maxReopenRatePct: number;
}

export interface TriggeredAlert {
  id: string;
  type: 'backlog' | 'sla' | 'csat' | 'reopen';
  severity: 'critical' | 'warning';
  title: string;
  message: string;
  metricValue: number | string;
  thresholdValue: number | string;
}

export interface ForecastDay {
  dayLabel: string;
  projectedBacklog: number;
  lowerBound: number;
  upperBound: number;
  projectedArrivals: number;
  projectedCompletions: number;
  estimatedBreaches: number;
}

export interface ForecastResult {
  hasSufficientData: boolean;
  daysOfHistory: number;
  insufficientReason?: string;
  forecastDays: ForecastDay[];
  currentBacklog: number;
  sevenDayEndBacklog: number;
  projected7DayBreachRiskPct: number;
  avgDailyArrivalRate: number;
  avgDailyCompletionRate: number;
  methodologyNotes: string[];
  uncertaintyNotes: string[];
}

export interface ScenarioSimulationParams {
  queueName: string;
  currentFte: number;
  hoursPerDay: number;
  targetFte: number;
  incomingDeflectionPct: number; // e.g. 0% or 20%
}

export interface ScenarioProjectionResult {
  scenarioName: string;
  fteCount: number;
  dailyCapacityTickets: number;
  dailyIncomingTickets: number;
  netDailyBurnRate: number;
  sevenDayBacklog: number;
  estimatedSlaBreachRate: number;
}

export interface SavedAnalysisRecord {
  id: string;
  title: string;
  datasetName: string;
  dateSaved: string;
  ticketCount: number;
  kpis: OperationsKpis;
  filters: TicketFilterState;
  notes?: string;
  briefsCount: number;
}

export interface MultiMonthDataset {
  monthKey: string;
  monthLabel: string;
  tickets: SupportTicket[];
  kpis: OperationsKpis;
}
