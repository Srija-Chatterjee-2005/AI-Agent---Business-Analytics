import React, { useState, useEffect } from 'react';
import {
  PROJECT_MILESTONES,
  INITIAL_PROBLEM_DEFINITION,
  INITIAL_STAKEHOLDERS,
  INITIAL_REQUIREMENTS,
  INITIAL_USER_STORIES,
  INITIAL_AS_IS_PROCESS,
  INITIAL_TO_BE_PROCESS,
  INITIAL_SOLUTION_OPTIONS,
  INITIAL_UAT_CASES,
  INITIAL_SUCCESS_MEASURES
} from '../../data/projectData';
import {
  FolderGit2,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Download,
  Share2,
  AlertTriangle,
  Users,
  GitCommit,
  CheckSquare,
  BarChart3,
  FileText,
  Workflow,
  Plus,
  Trash2,
  Terminal,
  HelpCircle,
  ShieldCheck,
  Printer
} from 'lucide-react';
import {
  ProjectMilestone,
  StakeholderRecord,
  RequirementItem,
  UserStoryItem,
  ProcessStepItem,
  SolutionOption,
  UatCase,
  AiFunctionResponse
} from '../../types/ba';

export const ProjectStudioView: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [problemDef, setProblemDef] = useState(INITIAL_PROBLEM_DEFINITION);
  const [stakeholders, setStakeholders] = useState<StakeholderRecord[]>(INITIAL_STAKEHOLDERS);
  const [requirements, setRequirements] = useState<RequirementItem[]>(INITIAL_REQUIREMENTS);
  const [userStories, setUserStories] = useState<UserStoryItem[]>(INITIAL_USER_STORIES);
  const [asIsProcess, setAsIsProcess] = useState<ProcessStepItem[]>(INITIAL_AS_IS_PROCESS);
  const [toBeProcess, setToBeProcess] = useState<ProcessStepItem[]>(INITIAL_TO_BE_PROCESS);
  const [solutionOptions, setSolutionOptions] = useState<SolutionOption[]>(INITIAL_SOLUTION_OPTIONS);
  const [uatCases, setUatCases] = useState<UatCase[]>(INITIAL_UAT_CASES);
  const [successMeasures, setSuccessMeasures] = useState(INITIAL_SUCCESS_MEASURES);

  // AI Function execution state
  const [aiRunning, setAiRunning] = useState<boolean>(false);
  const [lastAiResponse, setLastAiResponse] = useState<AiFunctionResponse | null>(null);

  // Export dossier modal
  const [showExportModal, setShowExportModal] = useState<boolean>(false);

  // Local storage persistence
  useEffect(() => {
    const saved = localStorage.getItem('ba_project_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.problemDef) setProblemDef(parsed.problemDef);
        if (parsed.stakeholders) setStakeholders(parsed.stakeholders);
        if (parsed.requirements) setRequirements(parsed.requirements);
        if (parsed.userStories) setUserStories(parsed.userStories);
        if (parsed.asIsProcess) setAsIsProcess(parsed.asIsProcess);
        if (parsed.toBeProcess) setToBeProcess(parsed.toBeProcess);
        if (parsed.solutionOptions) setSolutionOptions(parsed.solutionOptions);
        if (parsed.uatCases) setUatCases(parsed.uatCases);
        if (parsed.successMeasures) setSuccessMeasures(parsed.successMeasures);
      } catch (e) {
        console.error('Failed to parse saved project state');
      }
    }
  }, []);

  const saveState = () => {
    const stateObj = {
      problemDef,
      stakeholders,
      requirements,
      userStories,
      asIsProcess,
      toBeProcess,
      solutionOptions,
      uatCases,
      successMeasures
    };
    localStorage.setItem('ba_project_state', JSON.stringify(stateObj));
  };

  const handleToggleUatStatus = (caseId: string) => {
    setUatCases(prev => prev.map(c => {
      if (c.id === caseId) {
        const nextStatus: UatCase['actualStatus'] =
          c.actualStatus === 'Passed' ? 'Failed' :
          c.actualStatus === 'Failed' ? 'Blocked' :
          c.actualStatus === 'Blocked' ? 'Pending' : 'Passed';
        return { ...c, actualStatus: nextStatus };
      }
      return c;
    }));
  };

  const runAiFunctionForStep = async (functionName: string, params: any) => {
    setAiRunning(true);
    setLastAiResponse(null);

    try {
      const res = await fetch('/api/ai/execute-function', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          functionName,
          parameters: params,
          userPrompt: `Enhance milestone ${activeStep} for Apex College course registration modernization case.`
        })
      });
      const data: AiFunctionResponse = await res.json();
      setLastAiResponse(data);
    } catch (err) {
      console.error('Failed to run AI function:', err);
    } finally {
      setAiRunning(false);
    }
  };

  const generateFullDossierMarkdown = () => {
    return `# Business Analyst Project Dossier
## ${problemDef.projectName}
**Client Institution:** ${problemDef.clientInstitution}
**Methodology:** IIBA BABOK & Agile Scrum Framework

---

### 1. Executive Summary & Problem Definition
${problemDef.problemStatement}

#### Business Objectives:
${problemDef.businessObjectives.map(o => `- ${o}`).join('\n')}

#### Scope Boundaries:
- **In-Scope:** ${problemDef.inScope.join(', ')}
- **Out-of-Scope:** ${problemDef.outOfScope.join(', ')}

---

### 2. Stakeholder Register & RACI
| Stakeholder | Role | Power | Interest | RACI | Key Concern |
|---|---|---|---|---|---|
${stakeholders.map(s => `| ${s.name} | ${s.role} | ${s.power} | ${s.interest} | ${s.raci} | ${s.keyConcern} |`).join('\n')}

---

### 3. Requirements (Functional & Non-Functional)
${requirements.map(r => `#### [${r.id}] ${r.title} (${r.type} - Priority: ${r.priority})\n- **Statement:** ${r.statement}\n- **Business Rationale:** ${r.rationale}\n`).join('\n')}

---

### 4. Agile User Stories & Acceptance Criteria
${userStories.map(u => `#### [${u.id}] ${u.asA}\n**Story:** As an ${u.asA}, I want ${u.iWant}, so that ${u.soThat}.\n\n**Acceptance Criteria:**\n\`\`\`gherkin\n${u.acceptanceCriteria}\n\`\`\`\n`).join('\n')}

---

### 5. Process Mapping Summary (As-Is vs To-Be)
- **As-Is Baseline Cycle Time:** 4.8 Business Days (with manual paper walk-around)
- **To-Be Automated Cycle Time:** 2.4 Minutes (Cloud Self-Service)
- **Cycle Time Reduction:** 98.5%

---

### 6. User Acceptance Testing (UAT) Execution Status
| Test ID | Scenario | Severity | Status |
|---|---|---|---|
${uatCases.map(t => `| ${t.id} | ${t.title} | ${t.severity} | **${t.actualStatus}** |`).join('\n')}

---

### 7. Target Success Metrics (KPIs)
${successMeasures.map(m => `- **${m.metric}:** Baseline = ${m.baseline} -> Target = **${m.target}** (Owner: ${m.owner})`).join('\n')}
`;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold mb-2">
            <FolderGit2 className="w-3.5 h-3.5 text-teal-400" />
            <span>Capstone Case Study</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Apex College Registration Modernization
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Walk step-by-step through a complete enterprise Business Analyst engagement from Strategy Analysis to Solution Evaluation.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition"
          >
            <Download className="w-3.5 h-3.5 text-teal-400" />
            <span>Export Full Dossier</span>
          </button>
        </div>
      </div>

      {/* 9-Milestone Horizontal Stepper */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl overflow-x-auto">
        <div className="flex items-center justify-between min-w-[760px] space-x-2">
          {PROJECT_MILESTONES.map((milestone) => {
            const isActive = activeStep === milestone.id;
            const isCompleted = activeStep > milestone.id;

            return (
              <button
                key={milestone.id}
                onClick={() => setActiveStep(milestone.id)}
                className={`flex-1 p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                  isActive
                    ? 'bg-teal-500/15 border-teal-500/60 text-teal-300 ring-1 ring-teal-500/30'
                    : isCompleted
                    ? 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                    : 'bg-slate-950/40 border-slate-800 text-slate-500 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-mono font-bold">Step {milestone.id}</span>
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                      {milestone.iibaArea.split(' ')[0]}
                    </span>
                  )}
                </div>
                <div className="font-bold text-xs truncate text-slate-200">
                  {milestone.title}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Milestone Content Area */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        {/* Milestone Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                Milestone {activeStep} of 9
              </span>
              <span className="text-xs text-slate-400">
                IIBA Focus: {PROJECT_MILESTONES[activeStep - 1].iibaArea}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 mt-1">
              {PROJECT_MILESTONES[activeStep - 1].title}
            </h2>
            <p className="text-xs text-slate-400">
              {PROJECT_MILESTONES[activeStep - 1].subtitle}
            </p>
          </div>

          {/* AI Function Invocation Trigger */}
          <div className="flex items-center space-x-2">
            {activeStep === 3 && (
              <button
                onClick={() => runAiFunctionForStep('generate_stakeholder_questions', { role: 'Registrar', topic: 'Apex Course Registration' })}
                disabled={aiRunning}
                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-teal-200 bg-teal-950 hover:bg-teal-900 border border-teal-700/60 rounded-lg transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                <span>Run `generate_stakeholder_questions`</span>
              </button>
            )}

            {activeStep === 4 && (
              <button
                onClick={() => runAiFunctionForStep('map_process_flow', { type: 'Comparison' })}
                disabled={aiRunning}
                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-teal-200 bg-teal-950 hover:bg-teal-900 border border-teal-700/60 rounded-lg transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                <span>Run `map_process_flow`</span>
              </button>
            )}

            {activeStep === 5 && (
              <button
                onClick={() => runAiFunctionForStep('draft_requirements_and_stories', { epic: 'Waitlist Automation', priority: 'MoSCoW' })}
                disabled={aiRunning}
                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-teal-200 bg-teal-950 hover:bg-teal-900 border border-teal-700/60 rounded-lg transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                <span>Run `draft_requirements_and_stories`</span>
              </button>
            )}

            {activeStep === 8 && (
              <button
                onClick={() => runAiFunctionForStep('generate_uat_test_cases', { featureArea: 'Prerequisite Overrides' })}
                disabled={aiRunning}
                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-teal-200 bg-teal-950 hover:bg-teal-900 border border-teal-700/60 rounded-lg transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                <span>Run `generate_uat_test_cases`</span>
              </button>
            )}
          </div>
        </div>

        {/* Display Tool Execution Result Callout (if ran) */}
        {lastAiResponse && (
          <div className="p-4 rounded-xl bg-slate-950 border border-teal-500/50 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
              <span className="font-mono text-teal-300 flex items-center space-x-1.5">
                <Terminal className="w-4 h-4 text-teal-400" />
                <span>Function Executed: {lastAiResponse.functionUsed} ({lastAiResponse.executionTimeMs}ms)</span>
              </span>
              <span className="text-[10px] text-slate-400">Deterministic + AI Augmented</span>
            </div>

            <pre className="text-[11px] font-mono text-teal-200 max-h-48 overflow-y-auto bg-black/40 p-2 rounded">
              {JSON.stringify(lastAiResponse.result, null, 2)}
            </pre>

            {lastAiResponse.assumptions.length > 0 && (
              <div className="text-xs text-blue-200 space-y-1">
                <span className="font-semibold text-blue-300">Explicit Assumptions:</span>
                <ul className="list-disc list-inside text-slate-300">
                  {lastAiResponse.assumptions.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* STEP 1: DEFINE THE PROBLEM */}
        {activeStep === 1 && (
          <div className="space-y-6">
            <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2">
              <h3 className="text-xs font-bold text-teal-300 uppercase tracking-wider">Problem Statement</h3>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                {problemDef.problemStatement}
              </p>
            </div>

            {/* Symptoms vs Root Causes */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Symptoms vs. Underlying Root Causes
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {problemDef.symptomsVsRootCauses.map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="space-y-1">
                      <span className="font-semibold text-amber-300 flex items-center space-x-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                        <span>Observed Symptom:</span>
                      </span>
                      <p className="text-slate-300">{item.symptom}</p>
                    </div>
                    <div className="space-y-1 border-t md:border-t-0 md:border-l border-slate-800 pt-2 md:pt-0 md:pl-3">
                      <span className="font-semibold text-teal-300 flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                        <span>Root Cause (BA Analysis):</span>
                      </span>
                      <p className="text-slate-300">{item.rootCause}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Scope In/Out */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-950/70 rounded-xl border border-emerald-900/40 space-y-2">
                <span className="font-bold text-emerald-300 uppercase tracking-wider">In-Scope Boundaries</span>
                <ul className="space-y-1.5 text-slate-300">
                  {problemDef.inScope.map((item, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="text-emerald-400">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-slate-950/70 rounded-xl border border-red-900/40 space-y-2">
                <span className="font-bold text-red-300 uppercase tracking-wider">Out-of-Scope (Deferred)</span>
                <ul className="space-y-1.5 text-slate-300">
                  {problemDef.outOfScope.map((item, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="text-red-400">✕</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: IDENTIFY STAKEHOLDERS & RACI */}
        {activeStep === 2 && (
          <div className="space-y-5">
            <p className="text-xs text-slate-300">
              The Stakeholder Register maps organizational influence, interest levels, and RACI governance to ensure alignment across faculty, administration, and students.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300 border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/60 uppercase font-mono text-[10px]">
                    <th className="p-3">Stakeholder</th>
                    <th className="p-3">Role & Dept</th>
                    <th className="p-3">Power / Interest</th>
                    <th className="p-3">RACI</th>
                    <th className="p-3">Primary Concern</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {stakeholders.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-850/50 transition">
                      <td className="p-3 font-semibold text-slate-200">{s.name}</td>
                      <td className="p-3 text-slate-300">{s.role}<br/><span className="text-[10px] text-slate-500">{s.department}</span></td>
                      <td className="p-3 font-mono text-[11px]">
                        <span className="text-teal-400">Power: {s.power}</span><br/>
                        <span className="text-cyan-400">Interest: {s.interest}</span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                          s.raci === 'Accountable' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                          s.raci === 'Responsible' ? 'bg-teal-950 text-teal-300 border border-teal-800' :
                          s.raci === 'Consulted' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' :
                          'bg-slate-800 text-slate-400'
                        }`}>
                          {s.raci}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400 leading-relaxed text-[11px] max-w-xs">{s.keyConcern}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* STEP 3: PREPARE ELICITATION QUESTIONS */}
        {activeStep === 3 && (
          <div className="space-y-6">
            <p className="text-xs text-slate-300">
              Prepare structured interview protocols for the University Registrar, Academic Advisors, and Bursar. Use open-ended inquiry before probing policy details.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-teal-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <Users className="w-4 h-4 text-teal-400" />
                  <span>Registrar Discovery Protocol (Dr. Vance)</span>
                </span>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                    <strong className="text-slate-200">Q1. Workload Bottlenecks:</strong>
                    <p className="text-slate-400">"Which specific verification steps create the longest lines outside your window during peak week?"</p>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                    <strong className="text-slate-200">Q2. Overrides & Accreditation:</strong>
                    <p className="text-slate-400">"What audit evidence does state accreditation require when an advisor overrides a course prerequisite?"</p>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                    <strong className="text-slate-200">Q3. Waitlist Expiration SLA:</strong>
                    <p className="text-slate-400">"Should waitlist seat offers expire after 24 hours or 12 hours during late add/drop period?"</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <Users className="w-4 h-4 text-cyan-400" />
                  <span>Bursar & Academic Advisor Protocol</span>
                </span>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                    <strong className="text-slate-200">Bursar Threshold:</strong>
                    <p className="text-slate-400">"What is the exact dollar debt threshold that automatically sets a registration hold? ($50 vs $0 balance)"</p>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                    <strong className="text-slate-200">Advisor Single Screen:</strong>
                    <p className="text-slate-400">"What 3 transcript pieces do you need visible side-by-side to approve a course overload in under 30 seconds?"</p>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                    <strong className="text-slate-200">Payment Webhook Latency:</strong>
                    <p className="text-slate-400">"When a student pays their bill online, how many minutes before the lock releases in the SIS database?"</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: MAP AS-IS & TO-BE PROCESSES */}
        {activeStep === 4 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-red-950/20 border border-red-500/30 rounded-xl">
                <div className="text-[10px] text-slate-400 font-mono">Current As-Is Cycle Time</div>
                <div className="text-lg font-bold text-red-300">4.8 Business Days</div>
                <div className="text-[10px] text-slate-400">Manual paper forms</div>
              </div>

              <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-xl">
                <div className="text-[10px] text-slate-400 font-mono">Target To-Be Cycle Time</div>
                <div className="text-lg font-bold text-emerald-300">2.4 Minutes</div>
                <div className="text-[10px] text-slate-400">Cloud self-service</div>
              </div>

              <div className="p-3 bg-teal-950/20 border border-teal-500/30 rounded-xl">
                <div className="text-[10px] text-slate-400 font-mono">Process Improvement</div>
                <div className="text-lg font-bold text-teal-300">98.5% Cycle Time Cut</div>
                <div className="text-[10px] text-slate-400">Zero paper slips</div>
              </div>
            </div>

            {/* As-Is Flow */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Workflow className="w-4 h-4 text-red-400" />
                <span>Current State Workflow (As-Is with Bottlenecks)</span>
              </h3>
              <div className="space-y-2">
                {asIsProcess.map((step) => (
                  <div key={step.step} className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 flex items-start justify-between text-xs gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-slate-400">Step {step.step}:</span>
                        <span className="font-semibold text-slate-200">[{step.actor}]</span>
                        <span className="text-slate-300">{step.action}</span>
                      </div>
                      {step.isBottleneck && (
                        <div className="text-amber-300 text-[11px] flex items-center space-x-1 mt-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span><strong>Bottleneck:</strong> {step.bottleneckReason}</span>
                        </div>
                      )}
                    </div>
                    <span className="font-mono text-slate-400 whitespace-nowrap text-[11px]">{step.duration}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* To-Be Flow */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Workflow className="w-4 h-4 text-emerald-400" />
                <span>Future State Workflow (To-Be Modernized)</span>
              </h3>
              <div className="space-y-2">
                {toBeProcess.map((step) => (
                  <div key={step.step} className="p-3 bg-slate-950/70 rounded-xl border border-teal-900/30 flex items-start justify-between text-xs gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-teal-400">Step {step.step}:</span>
                        <span className="font-semibold text-teal-200">[{step.actor}]</span>
                        <span className="text-slate-300">{step.action}</span>
                      </div>
                      {step.improvement && (
                        <div className="text-emerald-300 text-[11px] flex items-center space-x-1 mt-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span><strong>Enhancement:</strong> {step.improvement}</span>
                        </div>
                      )}
                    </div>
                    <span className="font-mono text-teal-400 whitespace-nowrap text-[11px]">{step.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: REQUIREMENTS (FR & NFR) */}
        {activeStep === 5 && (
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs text-slate-400">
                MoSCoW Prioritized Specifications (Must, Should, Could, Won't Have)
              </span>
            </div>

            <div className="space-y-3">
              {requirements.map((req) => (
                <div key={req.id} className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-teal-400">{req.id}</span>
                      <span className="font-bold text-slate-200">{req.title}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                        {req.type}
                      </span>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                      req.priority === 'Must Have' ? 'bg-red-950 text-red-300 border border-red-800' :
                      req.priority === 'Should Have' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {req.priority}
                    </span>
                  </div>

                  <p className="text-slate-300 leading-relaxed font-sans">
                    <strong>Statement:</strong> {req.statement}
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    <strong>Business Rationale:</strong> {req.rationale}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 6: USER STORIES & ACCEPTANCE CRITERIA */}
        {activeStep === 6 && (
          <div className="space-y-5">
            <p className="text-xs text-slate-300">
              Agile user stories written from user persona perspectives with Given-When-Then (Gherkin) acceptance criteria ready for sprint backlog grooming.
            </p>

            <div className="space-y-4">
              {userStories.map((story) => (
                <div key={story.id} className="p-5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-mono font-bold text-teal-400">{story.id}</span>
                    <span className="text-slate-400 text-[11px]">INVEST Compliant</span>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-slate-200 space-y-1">
                    <div><strong>As an</strong> {story.asA},</div>
                    <div><strong>I want to</strong> {story.iWant},</div>
                    <div><strong>So that</strong> {story.soThat}.</div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="font-semibold text-slate-300">Acceptance Criteria (Gherkin):</span>
                    <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-teal-200/90 whitespace-pre-wrap overflow-x-auto">
                      {story.acceptanceCriteria}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 7: COMPARE SOLUTION OPTIONS */}
        {activeStep === 7 && (
          <div className="space-y-5">
            <p className="text-xs text-slate-300">
              Multi-criteria decision analysis comparing In-House Cloud Build vs Commercial Off-The-Shelf SaaS vs Low-Code Workflow Automation.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {solutionOptions.map((opt) => (
                <div
                  key={opt.id}
                  className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 ${
                    opt.recommendationRank === 1
                      ? 'bg-slate-900 border-teal-500 shadow-xl ring-1 ring-teal-500/40'
                      : 'bg-slate-950/70 border-slate-800'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        Rank #{opt.recommendationRank}
                      </span>
                      {opt.recommendationRank === 1 && (
                        <span className="text-[10px] font-bold text-teal-300 bg-teal-950 px-2 py-0.5 rounded border border-teal-700">
                          Recommended
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-slate-100 text-sm">{opt.name}</h4>
                    <div className="text-[11px] text-slate-400">{opt.type}</div>

                    <div className="pt-2 text-xs text-slate-300 space-y-1">
                      <div><strong>Est. Cost:</strong> {opt.costTier}</div>
                      <div><strong>Timeline:</strong> {opt.timelineWeeks} weeks</div>
                    </div>

                    <div className="space-y-1.5 pt-2">
                      <div className="text-[11px] font-semibold text-emerald-400">Pros:</div>
                      <ul className="text-[11px] text-slate-300 list-disc list-inside space-y-0.5">
                        {opt.pros.map((p, i) => (
                          <li key={i}>{p}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <div className="text-[11px] font-semibold text-amber-400">Cons & Risks:</div>
                      <ul className="text-[11px] text-slate-400 list-disc list-inside space-y-0.5">
                        {opt.cons.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Strategic Fit:</span>
                    <span className="font-bold text-teal-400">{opt.fitScore} / 100</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 8: UAT TEST CASES */}
        {activeStep === 8 && (
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs text-slate-400">
                Click the status badge to toggle execution outcomes (Passed / Failed / Blocked / Pending).
              </span>
            </div>

            <div className="space-y-3">
              {uatCases.map((tc) => (
                <div key={tc.id} className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-teal-400">{tc.id}</span>
                      <h4 className="font-bold text-slate-200">{tc.title}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                        {tc.severity}
                      </span>
                    </div>

                    <button
                      onClick={() => handleToggleUatStatus(tc.id)}
                      className={`px-3 py-1 rounded text-xs font-mono font-bold transition ${
                        tc.actualStatus === 'Passed' ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' :
                        tc.actualStatus === 'Failed' ? 'bg-red-950 text-red-300 border border-red-700' :
                        tc.actualStatus === 'Blocked' ? 'bg-amber-950 text-amber-300 border border-amber-700' :
                        'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {tc.actualStatus}
                    </button>
                  </div>

                  <div className="text-[11px] text-slate-400">
                    <strong>Precondition:</strong> {tc.precondition}
                  </div>

                  <div className="space-y-1">
                    <strong className="text-slate-300 text-[11px]">Test Steps:</strong>
                    <ul className="text-slate-400 space-y-0.5 pl-2">
                      {tc.steps.map((st, i) => (
                        <li key={i}>{st}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-[11px] text-slate-300">
                    <strong className="text-teal-300">Expected Result: </strong>
                    {tc.expectedResult}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 9: SUCCESS MEASURES & KPIS */}
        {activeStep === 9 && (
          <div className="space-y-5">
            <p className="text-xs text-slate-300">
              Solution Evaluation baseline targets and monitoring mechanism to measure return on investment (ROI) post go-live.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300 border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/60 uppercase font-mono text-[10px]">
                    <th className="p-3">Performance Metric</th>
                    <th className="p-3">Current Baseline</th>
                    <th className="p-3">Target Post-Launch</th>
                    <th className="p-3">Tracking Method</th>
                    <th className="p-3">Metric Owner</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {successMeasures.map((m, idx) => (
                    <tr key={idx} className="hover:bg-slate-850/50 transition">
                      <td className="p-3 font-semibold text-slate-200">{m.metric}</td>
                      <td className="p-3 text-red-300 font-mono text-[11px]">{m.baseline}</td>
                      <td className="p-3 text-emerald-300 font-mono font-bold text-[11px]">{m.target}</td>
                      <td className="p-3 text-slate-400 text-[11px]">{m.measurementMethod}</td>
                      <td className="p-3 text-slate-300 text-[11px]">{m.owner}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Milestone Navigation Footer */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-4 text-xs">
          <button
            onClick={() => {
              saveState();
              setActiveStep(prev => Math.max(1, prev - 1));
            }}
            disabled={activeStep === 1}
            className="flex items-center space-x-1.5 px-3.5 py-2 text-slate-400 hover:text-slate-200 disabled:opacity-30 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous Step</span>
          </button>

          <span className="text-slate-500 font-mono">
            Progress Saved
          </span>

          <button
            onClick={() => {
              saveState();
              setActiveStep(prev => Math.min(9, prev + 1));
            }}
            disabled={activeStep === 9}
            className="flex items-center space-x-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-30 text-white rounded-xl font-semibold shadow-md shadow-teal-900/20 transition"
          >
            <span>Next Step</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Export Dossier Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-2xl p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-slate-100 text-base flex items-center space-x-2">
                <FileText className="w-5 h-5 text-teal-400" />
                <span>Export Project Portfolio Dossier</span>
              </h3>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-slate-400 hover:text-slate-200 text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              This formatted dossier compiles all 9 milestones into an executive-ready Markdown deliverable to showcase on your portfolio or LinkedIn.
            </p>

            <textarea
              readOnly
              value={generateFullDossierMarkdown()}
              className="flex-1 bg-slate-950 text-teal-200 font-mono text-xs p-4 rounded-xl border border-slate-800 resize-none overflow-y-auto leading-relaxed"
            />

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400">Ready for Markdown, GitHub, or PDF rendering</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generateFullDossierMarkdown());
                  alert('Full Project Dossier copied to clipboard!');
                }}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-xl shadow-md transition"
              >
                Copy Markdown to Clipboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
