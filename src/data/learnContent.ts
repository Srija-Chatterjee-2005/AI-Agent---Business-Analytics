import { KnowledgeArea, BaDeliverable, QuizQuestion } from '../types/ba';

export const IIBA_KNOWLEDGE_AREAS: KnowledgeArea[] = [
  {
    id: 'bapm',
    name: 'Business Analysis Planning and Monitoring',
    acronym: 'BAPM',
    color: 'from-blue-600 to-cyan-600',
    babokChapter: 'BABOK Guide Chapter 3',
    description: 'Organizes and coordinates the efforts of business analysts and stakeholders. It defines how requirements will be managed, who needs to be consulted, and how work is tracked.',
    keyResponsibilities: [
      'Define the business analysis approach (Plan-driven vs. Agile Adaptive).',
      'Conduct stakeholder analysis and identify communication preferences.',
      'Establish governance processes for requirement approvals and change requests.',
      'Plan requirements management and trace information architecture.'
    ],
    keyDeliverables: [
      'Business Analysis Plan & Timeline',
      'Stakeholder Engagement Register',
      'Governance & Change Management Approach',
      'Information Management Plan'
    ],
    realWorldScenario: 'Before kickoff on the College Registration project, the BA maps out who will sign off on changes (Registrar vs IT Director) and decides whether to use 2-week Jira sprints or phased milestones.'
  },
  {
    id: 'ec',
    name: 'Elicitation and Collaboration',
    acronym: 'E&C',
    color: 'from-teal-600 to-emerald-600',
    babokChapter: 'BABOK Guide Chapter 4',
    description: 'Describes the tasks used to obtain information from stakeholders and confirm the results. It is about deep listening, asking probing questions, and securing consensus.',
    keyResponsibilities: [
      'Prepare for elicitation (interview guides, workshop agendas, surveys).',
      'Conduct elicitation activities (interviews, observation, focus groups, document analysis).',
      'Confirm elicitation results with stakeholders to prevent misinterpretation.',
      'Communicate business analysis information transparently across teams.'
    ],
    keyDeliverables: [
      'Stakeholder Interview Notes & Synthesis',
      'Workshop Transcripts & Miro/Mural Boards',
      'Survey Result Summaries',
      'Confirmed Requirements Baselines'
    ],
    realWorldScenario: 'The BA sits with an academic advisor during drop/add week, observing how they navigate 4 screens just to override a prerequisite, noticing the advisor writes error codes on sticky notes.'
  },
  {
    id: 'rlcm',
    name: 'Requirements Life Cycle Management',
    acronym: 'RLCM',
    color: 'from-indigo-600 to-blue-700',
    babokChapter: 'BABOK Guide Chapter 5',
    description: 'Manages and maintains requirements and design information from inception to retirement. Ensures alignment between requirements and business goals throughout changes.',
    keyResponsibilities: [
      'Trace requirements backward to business goals and forward to test cases (Traceability Matrix).',
      'Maintain requirements for reuse in future project phases.',
      'Prioritize requirements using MoSCoW (Must, Should, Could, Won\'t).',
      'Assess proposed change requests for cost, effort, and scope impact.'
    ],
    keyDeliverables: [
      'Requirements Traceability Matrix (RTM)',
      'MoSCoW Prioritized Backlog',
      'Change Impact Assessment Reports',
      'Reusable Requirements Repository'
    ],
    realWorldScenario: 'The Bursar asks to add biometric face verification 2 weeks before launch. The BA conducts an impact assessment showing it will delay deployment by 6 weeks and recommends deferring to v2.'
  },
  {
    id: 'sa',
    name: 'Strategy Analysis',
    acronym: 'SA',
    color: 'from-emerald-600 to-teal-700',
    babokChapter: 'BABOK Guide Chapter 6',
    description: 'Identifies the business need of tactical or strategic importance, enables the enterprise to address that need, and aligns the resulting strategy for the change with higher-level goals.',
    keyResponsibilities: [
      'Analyze the current state (As-Is bottlenecks, operational costs, pain points).',
      'Define the desired future state (target outcomes, KPIs, capabilities).',
      'Assess risks, organizational tolerance, and constraints.',
      'Define the change strategy and build the business case.'
    ],
    keyDeliverables: [
      'Business Case & Cost-Benefit Analysis (ROI)',
      'Current State vs Future State Gap Analysis',
      'Risk Register & Mitigation Strategy',
      'Scope Statement & In/Out Boundaries'
    ],
    realWorldScenario: 'The university discovers 18% of eligible freshmen fail to complete registration on day 1. The BA analyzes the root cause and presents a business case for automated waitlist management.'
  },
  {
    id: 'radd',
    name: 'Requirements Analysis and Design Definition',
    acronym: 'RADD',
    color: 'from-cyan-600 to-blue-800',
    babokChapter: 'BABOK Guide Chapter 7',
    description: 'Structures and organizes requirements discovered during elicitation, specifies and models requirements and designs, validates and verifies information, and identifies solution options.',
    keyResponsibilities: [
      'Specify and model requirements (BPMN diagrams, user stories, data models, wireframes).',
      'Verify requirements for clarity, testability, and non-ambiguity.',
      'Validate that requirements deliver actual business value.',
      'Define solution options and recommend the optimal approach.'
    ],
    keyDeliverables: [
      'Business Requirements Document (BRD) & FRD',
      'User Stories with Gherkin Acceptance Criteria',
      'BPMN 2.0 Process Models & Swimlanes',
      'Solution Architecture Comparison Matrix'
    ],
    realWorldScenario: 'The BA translates the Registrar’s broad request ("make waitlists fair") into concrete INVEST user stories with Given-When-Then criteria for 24-hour seat claim windows.'
  },
  {
    id: 'se',
    name: 'Solution Evaluation',
    acronym: 'SE',
    color: 'from-violet-600 to-indigo-700',
    babokChapter: 'BABOK Guide Chapter 8',
    description: 'Assesses the performance of and value delivered by a solution in use by the enterprise, and recommends removal of barriers or constraints that prevent full value realization.',
    keyResponsibilities: [
      'Measure solution performance using actual operational metrics.',
      'Analyze performance measures against expected target KPIs.',
      'Assess solution limitations and technical debt.',
      'Assess enterprise limitations (training gaps, adoption reluctance).'
    ],
    keyDeliverables: [
      'Post-Implementation Review (PIR) Report',
      'KPI Performance Dashboard & Trend Analysis',
      'Solution Limitation & Defect Log',
      'Continuous Improvement Recommendations'
    ],
    realWorldScenario: 'Three months post-launch, the BA queries the registration process logs in the Data Lab, discovering that advisor review turnaround dropped from 4.8 days to 2.2 hours, confirming project ROI.'
  }
];

export const BA_DELIVERABLES: BaDeliverable[] = [
  {
    id: 'brd',
    title: 'Business Requirements Document (BRD)',
    category: 'Requirements',
    purpose: 'Defines the high-level business goals, problem statement, scope boundaries, and strategic objectives for leadership and sponsors.',
    whenToUse: 'Initiation and Discovery phases before engineering or procurement begins.',
    keySections: ['Executive Summary', 'Problem Statement & Objectives', 'In-Scope & Out-of-Scope', 'Stakeholder Matrix', 'High-Level Business Rules', 'Success Metrics & KPIs'],
    commonMistakes: ['Writing technical implementation details instead of business needs', 'Leaving scope boundaries vague', 'Failing to define measurable success metrics'],
    samplePreview: `Project: Apex Registration Modernization\nExecutive Summary: Modernize university registration to reduce average drop-off by 60%.\nBusiness Objectives:\n1. Automate waitlist management by Q3.\n2. Eliminate paper prerequisite waivers.\nIn-Scope: Self-service portal, automated prerequisite check, SMS notifications.\nOut-of-Scope: Graduate medical school residency matching (deferred to Phase 2).`,
    tooling: ['Confluence', 'Google Docs', 'Microsoft Word']
  },
  {
    id: 'user_stories',
    title: 'Agile User Stories & Acceptance Criteria',
    category: 'Requirements',
    purpose: 'Captures end-user functionality from the user persona perspective in small, testable, deliverable increments for sprint planning.',
    whenToUse: 'Agile/Scrum sprints, backlog refinement, sprint planning.',
    keySections: ['Persona Role', 'Desired Action', 'Business Value (So That)', 'Acceptance Criteria (Gherkin)', 'Story Points & Assumptions'],
    commonMistakes: ['Missing the "So that" business value', 'Writing multi-week epic monsters that cannot fit in one sprint', 'Vague criteria like "the system should be fast"'],
    samplePreview: `Story US-101: Automated Waitlist Position Visibility\nAs an undergraduate student,\nI want to view my live numerical waitlist position,\nSo that I can evaluate whether to register for backup courses.\n\nAcceptance Criteria (Given-When-Then):\nScenario: Position displayed on schedule dashboard\n  Given the student is waitlisted for CS-210\n  When they view the schedule card\n  Then the badge displays "Waitlist #3 of 15"\n  And indicates estimated probability band.`,
    tooling: ['Jira Software', 'Azure DevOps', 'Trello', 'Linear']
  },
  {
    id: 'bpmn_maps',
    title: 'Process Maps (BPMN 2.0 & Swimlanes)',
    category: 'Process',
    purpose: 'Visually depicts sequential workflows, decision gateways, handoffs between departments, and operational bottlenecks.',
    whenToUse: 'Current-state analysis (As-Is) to discover pain points, and future-state design (To-Be) to guide development.',
    keySections: ['Swimlanes (Roles/Systems)', 'Start & End Events', 'Task Activities', 'Exclusive/Parallel Gateways', 'Data Stores & Artifacts'],
    commonMistakes: ['Mixing current-state and future-state into one messy diagram', 'Forgetting exception loops (what happens when payment fails?)', 'Omitting swimlane actors'],
    samplePreview: `Swimlanes: [Student] | [SIS Portal] | [Bursar System] | [Academic Advisor]\nFlow:\n[Student: Submit Course] -> [SIS: Prerequisite Check]\n  -> Gateway <Prereq Passed?>\n     |-- Yes --> [SIS: Check Capacity]\n     |-- No  --> [Advisor: Review Waiver Request] (Bottleneck: 4.8 day SLA)`,
    tooling: ['Lucidchart', 'Draw.io / diagrams.net', 'Microsoft Visio', 'Miro']
  },
  {
    id: 'raci_matrix',
    title: 'RACI Matrix (Stakeholder Governance)',
    category: 'Strategy',
    purpose: 'Clarifies roles and responsibilities across deliverables so everyone knows who executes, approves, provides input, or gets notified.',
    whenToUse: 'Project kickoff, governance alignment, and when multiple departments collaborate on software changes.',
    keySections: ['Deliverable / Decision Task', 'Responsible (Doer)', 'Accountable (Sole Decision Maker)', 'Consulted (SME Input)', 'Informed (Kept updated)'],
    commonMistakes: ['Assigning multiple "Accountable" individuals to one task (violates single accountability)', 'Marking everyone as "Consulted", leading to meeting bloat', 'Not sharing the matrix with stakeholders'],
    samplePreview: `Activity: Prerequisite Waiver Rule Approval\n- Registrar: Accountable (Final sign-off)\n- Academic Advisors: Consulted (Provide curriculum guidelines)\n- Lead BA: Responsible (Documents the business logic)\n- Students: Informed (Notified via portal update)`,
    tooling: ['Excel', 'Google Sheets', 'Confluence Tables']
  },
  {
    id: 'gap_analysis',
    title: 'Gap Analysis Matrix',
    category: 'Strategy',
    purpose: 'Compares the current state (As-Is) with the desired target state (To-Be) to pinpoint the exact gaps and required remediation steps.',
    whenToUse: 'Discovery phase to formulate project scope and justify budget investment.',
    keySections: ['Capability Area', 'Current State (As-Is)', 'Target State (To-Be)', 'Identified Gap', 'Remediation Action & Effort'],
    commonMistakes: ['Only listing symptoms rather than structural process gaps', 'Failing to tie actions to business priority'],
    samplePreview: `Capability: Financial Hold Clearance\nAs-Is: Student visits Bursar cashier window in person; receipt processed in 24h batch.\nTo-Be: Instant credit card payment gateway with real-time API unlock (< 5 seconds).\nGap: Lack of real-time webhooks between payment processor and SIS.\nAction: Integrate Stripe/Touchnet webhook listener in API gateway.`,
    tooling: ['PowerPoint', 'Miro', 'Confluence', 'Excel']
  },
  {
    id: 'uat_cases',
    title: 'User Acceptance Testing (UAT) Test Suite',
    category: 'Testing & Management',
    purpose: 'Validates that the built software actually solves the business problem and functions properly from end-user perspectives before go-live.',
    whenToUse: 'Pre-release acceptance phase, sprint review validation, final sign-off.',
    keySections: ['Test Case ID', 'Test Scenario', 'Preconditions', 'Step-by-Step Actions', 'Test Data', 'Expected vs Actual Result', 'Sign-Off Status'],
    commonMistakes: ['Testing code syntax instead of business scenarios', 'Vague steps ("test the registration button")', 'Ignoring negative edge cases'],
    samplePreview: `Test ID: UAT-REG-004\nScenario: Concurrent registration for the last open seat in a class.\nPreconditions: Section CS-101 has 1 seat remaining (29/30 filled).\nSteps: Two students click "Submit" simultaneously at 09:00:00.\nExpected Result: Exactly one student is enrolled (30/30). The second student is offered Waitlist Position #1. Zero double-booking.\nActual: Passed in Staging Build 1.4.`,
    tooling: ['TestRail', 'Jira Xray', 'Excel / Sheets']
  }
];

export const INTERN_VS_EMPLOYEE = {
  overview: 'Understanding the practical transition from a Business Analyst Intern to a Full-Time BA Employee is crucial. While both roles apply core BA techniques, the expectations around autonomy, risk ownership, and stakeholder facilitation are distinctly different.',
  comparisonDimensions: [
    {
      dimension: 'Task Scope & Ownership',
      intern: 'Assigned specific, well-bounded tasks (e.g. drafting 3 user stories, profiling a specific dataset, updating a process diagram, taking meeting synthesis notes).',
      employee: 'Owns an entire epic, feature area, or project stream end-to-end from vague concept to post-launch adoption and KPI evaluation.',
      keyTakeaway: 'Interns focus on execution excellence; employees focus on problem definition and business impact.'
    },
    {
      dimension: 'Autonomy & Sign-Off Authority',
      intern: 'All deliverables (BRDs, user stories, process flows) are reviewed and approved by a Senior BA or Manager before reaching engineering or executives.',
      employee: 'Has delegated authority to approve sprint user stories, sign off on UAT readiness, and make rapid trade-off calls with the Tech Lead.',
      keyTakeaway: 'Interns validate their thinking with mentors; employees own the consequences of their trade-offs.'
    },
    {
      dimension: 'Stakeholder Meeting Dynamics',
      intern: 'Primarily shadows senior analysts, takes meticulous structured notes, observes facilitation techniques, and presents specific assigned slides under guidance.',
      employee: 'Leads high-stakes elicitation workshops, manages conflicting department politics (e.g., Registrar vs Bursar disputes), and negotiates scope compromises.',
      keyTakeaway: 'Interns build active listening and documentation muscle; employees steer consensus.'
    },
    {
      dimension: 'Handling Ambiguity',
      intern: 'Expects starter templates, explicit guardrails, and guidance on where to find internal documentation or SME contacts.',
      employee: 'Comfortable with raw, unstructured problems ("Registration is a mess; figure out why and propose a solution") and independently unearths data.',
      keyTakeaway: 'Interns ask "Where do I start?"; employees say "Here is what I uncovered and two options forward."'
    },
    {
      dimension: 'Review Cycles & Feedback',
      intern: 'Frequent, daily or weekly 1-on-1 check-ins with heavy mentorship coaching and iterative redlines on artifacts.',
      employee: 'Self-directed progress reporting in standups; reviews are focused on strategic alignment and risk mitigation rather than formatting.',
      keyTakeaway: 'Interns learn company standards; employees uphold and evolve company standards.'
    },
    {
      dimension: 'Production & System Access',
      intern: 'Typically restricted to staging environments, sanitized test datasets, and read-only database replicas.',
      employee: 'Full access to production analytics, telemetry logs, customer feedback queues, and production Jira releases.',
      keyTakeaway: 'Interns practice in safe sandboxes; employees monitor live customer behavior.'
    }
  ],
  goldenRules: [
    {
      ruleNumber: 1,
      title: 'Never arrive with just a problem—bring 2 options and a recommendation',
      description: 'Senior managers are overwhelmed with issues. When you find an obstacle (e.g., "The API cannot return real-time hold data"), do not stop. Propose: "Option A is polling hourly; Option B is a manual daily sync. I recommend Option A because..." This single habit separates top 5% interns from the crowd.'
    },
    {
      ruleNumber: 2,
      title: 'Master the DONA meeting follow-up within 2 hours',
      description: 'After every stakeholder session, send a clean bulleted email with: Decisions made, Open questions, Next actions, and Assignees (DONA). This creates an immediate reputation for reliability and organizational prowess.'
    },
    {
      ruleNumber: 3,
      title: 'Back your opinions with data from logs or transcripts',
      description: 'Do not say "Students find the registration confusing." Instead, cite: "In our data sample of 150 requests, 18% failed due to financial hold surprises, generating 320 advisor support tickets." Data removes emotional debate.'
    },
    {
      ruleNumber: 4,
      title: 'Ask bundled, consolidated questions during check-ins',
      description: 'Avoid sending 15 individual Slack pings every 20 minutes. Keep a running note of questions, research what you can first, and bring the list to your scheduled check-in or send a concise morning summary.'
    },
    {
      ruleNumber: 5,
      title: 'Build relationships with QA and Developers early',
      description: 'The best BAs are beloved by engineering. Spend 15 minutes asking a developer: "How can I format my acceptance criteria so it is easiest for you to write unit tests?" They will become your fiercest internal champions.'
    }
  ]
};

export const DAY_IN_THE_LIFE_SCHEDULE = [
  {
    time: '09:00 AM',
    title: 'Daily Agile Standup',
    duration: '15 min',
    activity: 'Team synchronization with Scrum Master, Developers, and QA.',
    baRole: 'Shares updates: "Yesterday I finalized user stories for the waitlist notification worker. Today I am shadowing Registrar staff on prerequisite waivers. No blockers."',
    keyTip: 'Keep it to: What you finished, what you are doing today, and blockers.'
  },
  {
    time: '10:00 AM',
    title: 'Stakeholder Elicitation Workshop',
    duration: '60 min',
    activity: 'Facilitating a discovery session with the Dean of Admissions and Registrar.',
    baRole: 'Guides the conversation using prepared open-ended questions. Documents pain points on Miro virtual whiteboard. Gently brings off-track discussions back to the core registration workflow.',
    keyTip: 'Don’t just write what people say; record the underlying reason behind their pain.'
  },
  {
    time: '11:30 AM',
    title: 'Process Mapping & BPMN Modeling',
    duration: '90 min',
    activity: 'Synthesizing interview findings into As-Is swimlane diagrams in Lucidchart.',
    baRole: 'Maps the exact handoffs between Student, SIS, and Academic Advisor. Flags 3 critical bottleneck stages where manual paper forms cause multi-day delays.',
    keyTip: 'Identify the "Happy Path" first before layering in exception loops.'
  },
  {
    time: '01:00 PM',
    title: 'Lunch & Mentorship 1-on-1',
    duration: '45 min',
    activity: 'Informal sync with Senior BA mentor.',
    baRole: 'Reviews draft process map, asks for advice on navigating an advisor who resists moving from paper slips to digital approvals, and discusses career path milestones.',
    keyTip: 'Use 1-on-1s for growth and feedback, not just task status.'
  },
  {
    time: '02:00 PM',
    title: 'Backlog Refinement & Story Grooming',
    duration: '60 min',
    activity: 'Walking tech lead and QA engineers through upcoming sprint stories.',
    baRole: 'Presents User Story US-101. Answers technical boundary questions: "What happens if a student drops a course at 11:59 PM?" Refines Gherkin criteria in real time based on developer feedback.',
    keyTip: 'Embrace developer scrutiny—it saves weeks of rework later.'
  },
  {
    time: '03:30 PM',
    title: 'Data Lab & Quantitative Analysis',
    duration: '45 min',
    activity: 'Analyzing real CSV export logs of historical registration errors.',
    baRole: 'Profiles 150 registration logs, verifies that 28% of rejections stem from financial holds, and calculates exact p95 processing duration to benchmark the future cloud architecture SLA.',
    keyTip: 'A BA who knows SQL or data profiling is twice as valuable as a pure note-taker.'
  },
  {
    time: '04:30 PM',
    title: 'Acceptance Criteria Drafting & Day Wrap-Up',
    duration: '30 min',
    activity: 'Updating Jira tickets with clear Given-When-Then criteria and sending DONA notes.',
    baRole: 'Dispatches meeting summary to Registrar with action items. Logs daily work and prepares tomorrow’s agenda.',
    keyTip: 'Ending the day with a clean desk and clear priorities sets up tomorrow for success.'
  }
];

export const LEARN_QUIZZES: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'Which IIBA Knowledge Area focuses on assessing whether a deployed solution actually delivered its expected business value in production?',
    options: [
      'Strategy Analysis',
      'Solution Evaluation',
      'Requirements Life Cycle Management',
      'Business Analysis Planning and Monitoring'
    ],
    correctIndex: 1,
    explanation: 'Solution Evaluation (BABOK Chapter 8) assesses performance measures and analyzes whether the implemented solution delivers the expected ROI and metrics.'
  },
  {
    id: 'q2',
    question: 'In Agile requirements drafting, what is the primary purpose of the "So that [business value]" clause in a user story?',
    options: [
      'To specify the exact database tables needed for the feature',
      'To explain to developers why the feature matters and the value it unlocks',
      'To assign the story point estimate to the engineering team',
      'To provide the legal compliance disclaimer'
    ],
    correctIndex: 1,
    explanation: 'The "So that" clause ensures the team understands the underlying business outcome, preventing developers from building features that deliver no measurable value.'
  },
  {
    id: 'q3',
    question: 'When an intern encounters an unexpected technical roadblock (e.g. an API does not support real-time data sync), what is the best practice behavior?',
    options: [
      'Immediately tell the client that the project cannot proceed',
      'Silently ignore the requirement in hopes nobody notices',
      'Formulate at least two feasible options and bring a recommendation to their mentor',
      'Rewrite the entire backend code without telling the team'
    ],
    correctIndex: 2,
    explanation: 'Bringing feasible options alongside a clear recommendation demonstrates analytical maturity and initiative, turning obstacles into constructive discussions.'
  },
  {
    id: 'q4',
    question: 'In a RACI governance matrix, what critical rule prevents confusion and deadlock on project decisions?',
    options: [
      'Every stakeholder must be marked as Accountable',
      'There should be exactly one person marked as Accountable for each task or decision',
      'Consulted stakeholders have final veto authority over the budget',
      'Responsible and Informed must always be the exact same person'
    ],
    correctIndex: 1,
    explanation: 'Single accountability is the core rule of RACI: having more than one person Accountable creates finger-pointing and decision paralysis.'
  },
  {
    id: 'q5',
    question: 'What is the primary difference between a Functional Requirement and a Non-Functional Requirement (NFR)?',
    options: [
      'Functional requirements are written in Python; NFRs are written in SQL',
      'Functional defines WHAT the system does (behavior); NFR defines HOW WELL the system performs (quality, security, latency)',
      'Functional requirements are optional; NFRs are mandatory',
      'Functional requirements only apply to interns; NFRs apply to managers'
    ],
    correctIndex: 1,
    explanation: 'Functional requirements describe specific system behaviors and workflows (e.g., student can join waitlist), while Non-Functional Requirements specify quality attributes (e.g., 99.9% uptime, p95 latency < 2.5s).'
  }
];
