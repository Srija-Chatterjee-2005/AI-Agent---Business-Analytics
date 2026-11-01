/**
 * Core type definitions for BA Studio
 */

export interface KnowledgeArea {
  id: string;
  name: string;
  acronym: string;
  color: string;
  description: string;
  keyResponsibilities: string[];
  keyDeliverables: string[];
  realWorldScenario: string;
  babokChapter: string;
}

export interface BaDeliverable {
  id: string;
  title: string;
  category: 'Requirements' | 'Process' | 'Strategy' | 'Testing & Management';
  purpose: string;
  whenToUse: string;
  keySections: string[];
  commonMistakes: string[];
  samplePreview: string;
  tooling: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  knowledgeAreaId?: string;
}

export interface PracticeTask {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  estimatedTimeMin: number;
  scenario: string;
  instructions: string[];
  starterTemplate: string;
  hints: string[];
  rubric: {
    clarity: string;
    feasibility: string;
    completeness: string;
    businessValue: string;
  };
  modelAnswer: string;
}

export interface RubricScore {
  criterion: string;
  score: number;
  max: number;
  feedback: string;
}

export interface RubricEvaluation {
  taskTitle: string;
  totalScore: number;
  maxScore: number;
  rubricBreakdown: RubricScore[];
  strengths: string[];
  improvements: string[];
  seniorBaAdvice: string;
}

export interface ProjectMilestone {
  id: number;
  title: string;
  subtitle: string;
  iibaArea: string;
  status: 'not_started' | 'in_progress' | 'completed';
}

export interface StakeholderRecord {
  id: string;
  name: string;
  role: string;
  department: string;
  interest: 'High' | 'Medium' | 'Low';
  power: 'High' | 'Medium' | 'Low';
  raci: 'Responsible' | 'Accountable' | 'Consulted' | 'Informed';
  keyConcern: string;
}

export interface RequirementItem {
  id: string;
  type: 'Functional' | 'Non-Functional';
  title: string;
  statement: string;
  priority: 'Must Have' | 'Should Have' | 'Could Have' | "Won't Have";
  category?: string;
  rationale: string;
}

export interface UserStoryItem {
  id: string;
  asA: string;
  iWant: string;
  soThat: string;
  acceptanceCriteria: string;
}

export interface ProcessStepItem {
  step: number;
  actor: string;
  action: string;
  duration: string;
  isBottleneck: boolean;
  bottleneckReason?: string | null;
  improvement?: string;
}

export interface SolutionOption {
  id: string;
  name: string;
  type: string;
  costTier: string;
  timelineWeeks: number;
  pros: string[];
  cons: string[];
  feasibilityScore: number;
  fitScore: number;
  recommendationRank: number;
}

export interface UatCase {
  id: string;
  title: string;
  precondition: string;
  steps: string[];
  expectedResult: string;
  actualStatus: 'Pending' | 'Passed' | 'Failed' | 'Blocked';
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  testerNotes?: string;
}

export interface DataProfileReport {
  totalRows: number;
  totalColumns: number;
  columns: {
    name: string;
    type: 'string' | 'number' | 'date' | 'boolean';
    missingCount: number;
    missingPct: number;
    uniqueCount: number;
    sampleValues: any[];
  }[];
  duplicateRowsCount: number;
  invalidValuesCount: number;
  invalidFindings: { row: number; column: string; issue: string; value: any }[];
}

export interface CleaningAction {
  id: string;
  title: string;
  description: string;
  rowsAffected: number;
  type: 'dedup' | 'trim' | 'impute' | 'standardize_status' | 'filter_invalid';
}

export interface RegistrationKpis {
  totalRequests: number;
  approvedCount: number;
  rejectedCount: number;
  waitlistedCount: number;
  pendingAdvisorCount: number;
  systemErrorCount: number;
  approvalRatePct: number;
  rejectionRatePct: number;
  waitlistRatePct: number;
  errorRatePct: number;
  averageProcessingSeconds: number;
  p95ProcessingSeconds: number;
  financialHoldCount: number;
  prereqFailCount: number;
  topBottleneck: string;
  peakHour: string;
}

export interface AiFunctionResponse {
  success: boolean;
  functionUsed: string;
  executionTimeMs: number;
  result: any;
  assumptions: string[];
  missingInfoNeeded: string[];
  isAiGenerated: boolean;
}
