import {
  ProjectMilestone,
  StakeholderRecord,
  RequirementItem,
  UserStoryItem,
  ProcessStepItem,
  SolutionOption,
  UatCase
} from '../types/ba';

export const PROJECT_MILESTONES: ProjectMilestone[] = [
  { id: 1, title: 'Define the Problem', subtitle: 'Background, root causes, business objectives, and scope boundaries', iibaArea: 'Strategy Analysis', status: 'completed' },
  { id: 2, title: 'Identify Stakeholders', subtitle: 'Stakeholder register, power/interest matrix, and RACI governance', iibaArea: 'BA Planning & Monitoring', status: 'completed' },
  { id: 3, title: 'Prepare Elicitation Questions', subtitle: 'Categorized discovery questions and interview protocol for key actors', iibaArea: 'Elicitation & Collaboration', status: 'completed' },
  { id: 4, title: 'Map As-Is & To-Be Processes', subtitle: 'Swimlane diagrams, cycle time analysis, and bottleneck identification', iibaArea: 'Requirements Analysis & Design', status: 'completed' },
  { id: 5, title: 'Write Requirements (FR & NFR)', subtitle: 'MoSCoW prioritized functional specs and verifiable non-functional standards', iibaArea: 'Requirements Analysis & Design', status: 'completed' },
  { id: 6, title: 'User Stories & Acceptance Criteria', subtitle: 'INVEST-compliant user stories with Given-When-Then Gherkin criteria', iibaArea: 'Requirements Life Cycle', status: 'completed' },
  { id: 7, title: 'Compare Solution Options', subtitle: 'Multi-criteria decision analysis (Build vs Buy vs SaaS Workflow)', iibaArea: 'Requirements Analysis & Design', status: 'completed' },
  { id: 8, title: 'Create UAT Test Cases', subtitle: 'End-to-end acceptance scenarios, test data, and pass/fail criteria', iibaArea: 'Requirements Analysis & Design', status: 'completed' },
  { id: 9, title: 'Define Success Measures & KPIs', subtitle: 'Measurable targets, tracking cadence, and post-launch evaluation plan', iibaArea: 'Solution Evaluation', status: 'completed' }
];

export const INITIAL_PROBLEM_DEFINITION = {
  projectName: 'Apex College: Student Registration Modernization (SRM)',
  clientInstitution: 'Apex State University (Enrollment: 18,500 Undergraduate & Graduate Students)',
  problemStatement: `Apex University's legacy on-premise registration system experiences catastrophic failure during the first 72 hours of semester enrollment opening. Students face multi-minute latency, unannounced financial hold blocks at checkout, and an entirely manual paper-based prerequisite override workflow that forces students to stand in line for days.

This operational dysfunction results in an 18.2% registration failure/drop-off rate, generates over 1,400 frantic telephone calls and helpdesk tickets within 48 hours, delays degree completion timelines, and causes substantial student frustration and administrative burnout.`,
  symptomsVsRootCauses: [
    {
      symptom: 'Students wait in physical lines for up to 3 hours outside the Registrar and Bursar offices.',
      rootCause: 'Financial hold checks occur synchronously only upon registration commit, with zero pre-registration audit or push alert notifications.'
    },
    {
      symptom: 'Over 300 students receive HTTP 504 Gateway Timeouts and database lock crashes at 09:00 AM.',
      rootCause: 'Monolithic legacy database architecture cannot handle concurrency spikes (> 4,000 requests/sec) and lacks horizontal auto-scaling and queue decoupling.'
    },
    {
      symptom: 'Waitlists are managed manually via paper spreadsheets and ad-hoc department emails.',
      rootCause: 'No automated first-come first-served waitlist engine or expiration claim mechanism exists in the legacy SIS.'
    },
    {
      symptom: 'Academic advisors spend 35% of their working week manually stamping prerequisite override slips.',
      rootCause: 'The course catalog does not support transfer equivalency rules or digital one-click approval workflows.'
    }
  ],
  inScope: [
    'Cloud-native student self-service course registration and schedule builder portal.',
    'Automated 72-hour pre-registration financial hold scanner and real-time webhook clearing.',
    'First-come first-served automated waitlist queue with 24-hour SMS/email seat claim windows.',
    'Single-pane-of-glass advisor workflow for electronic prerequisite waiver reviews.',
    'Real-time concurrency queue management to protect core database transactions during 09:00 AM rush.'
  ],
  outOfScope: [
    'Replacing the core General Ledger and financial accounting software (Finance SIS).',
    'Graduate Medical School residency matching program (managed under separate NRMP regulations).',
    'Classroom physical room reservation and facilities management scheduling.',
    'Campus bookstore textbook e-commerce integration (deferred to Phase 2).'
  ],
  businessObjectives: [
    'Reduce average registration completion time from 18 minutes to under 2.5 minutes.',
    'Cut registration day support ticket volume by 70% within the first post-launch semester.',
    'Eliminate 100% of physical paper prerequisite waiver slips through digital advisor routing.',
    'Maintain 99.9% uptime during the 14-day priority enrollment window with zero database deadlocks.'
  ]
};

export const INITIAL_STAKEHOLDERS: StakeholderRecord[] = [
  {
    id: 'STK-01',
    name: 'Dr. Katherine Vance',
    role: 'University Registrar',
    department: 'Registrar & Academic Records',
    interest: 'High',
    power: 'High',
    raci: 'Accountable',
    keyConcern: 'Must ensure strict academic policy compliance, audit traceability for graduation credits, and zero inadvertent over-enrollment beyond classroom fire codes.'
  },
  {
    id: 'STK-02',
    name: 'Marcus Chen',
    role: 'Lead Academic Advisor',
    department: 'Undergraduate Advising Center',
    interest: 'High',
    power: 'Medium',
    raci: 'Consulted',
    keyConcern: 'Requires student degree audits, transfer credits, and GPAs on a single screen so they can approve or deny prerequisite waivers in under 30 seconds.'
  },
  {
    id: 'STK-03',
    name: 'Elena Rostova',
    role: 'Bursar & Student Accounts Director',
    department: 'Student Financial Services',
    interest: 'High',
    power: 'High',
    raci: 'Accountable',
    keyConcern: 'Tuition holds must be enforced strictly to prevent uncollectible debt, but students must be able to clear holds online instantly with real-time unlocking.'
  },
  {
    id: 'STK-04',
    name: 'Tariq Al-Mansoor',
    role: 'Enterprise Systems Architect',
    department: 'Central IT Infrastructure',
    interest: 'Medium',
    power: 'High',
    raci: 'Responsible',
    keyConcern: 'Architecture must scale horizontally to handle 4,500 concurrent connections, integrate cleanly with existing LDAP/SSO, and avoid taxing legacy SQL instances.'
  },
  {
    id: 'STK-05',
    name: 'Maya Lin',
    role: 'Student Government Association President',
    department: 'Undergraduate Student Body',
    interest: 'High',
    power: 'Low',
    raci: 'Informed',
    keyConcern: 'Mobile-friendly intuitive registration experience, transparent waitlist ranking, and schedule conflict warnings to avoid accidental overlaps.'
  }
];

export const INITIAL_REQUIREMENTS: RequirementItem[] = [
  {
    id: 'FR-01',
    type: 'Functional',
    title: 'Automated 72-Hour Pre-Enrollment Hold Audit',
    statement: 'The system SHALL perform an automated financial, academic, and administrative hold verification scan 72 hours prior to a student assigned registration appointment.',
    priority: 'Must Have',
    category: 'Billing & Compliance',
    rationale: 'Allows students 3 full days to resolve outstanding bursar liabilities before registration opens, eliminating registration morning panic.'
  },
  {
    id: 'FR-02',
    type: 'Functional',
    title: 'Real-Time Prerequisite & Corequisite Engine',
    statement: 'The system SHALL evaluate student transcripts against published course prerequisites in-memory and display real-time eligibility tags on course cards.',
    priority: 'Must Have',
    category: 'Academic Rules',
    rationale: 'Prevents students from attempting to register for advanced courses without prerequisites and eliminates invalid queue submissions.'
  },
  {
    id: 'FR-03',
    type: 'Functional',
    title: 'First-Come First-Served Automated Waitlist & Seat Offer',
    statement: 'When an enrolled student drops a seat, the system SHALL automatically offer the seat to waitlist rank #1 with a 24-hour expiration token via SMS/email.',
    priority: 'Must Have',
    category: 'Enrollment',
    rationale: 'Maximizes class capacity utilization and eliminates manual registrar intervention.'
  },
  {
    id: 'FR-04',
    type: 'Functional',
    title: 'Digital Prerequisite Waiver Approval Workflow',
    statement: 'The system SHALL enable students to submit an online prerequisite waiver request that routes to the assigned academic advisor with attached transcripts.',
    priority: 'Should Have',
    category: 'Advising',
    rationale: 'Replaces paper waiver slips and reduces waiver processing turnaround from 4.8 days to under 4 hours.'
  },
  {
    id: 'FR-05',
    type: 'Functional',
    title: 'Visual Schedule Builder with Conflict Detection',
    statement: 'The system SHALL display a weekly color-coded grid previewing selected courses and flag time overlaps or insufficient walking buffer between campus halls.',
    priority: 'Could Have',
    category: 'Student UX',
    rationale: 'Improves student satisfaction and reduces add/drop churn during the first week of classes.'
  },
  {
    id: 'NFR-01',
    type: 'Non-Functional',
    title: 'Peak Concurrency & Response Latency',
    statement: 'The system SHALL maintain a p95 response time of under 2.5 seconds under a sustained load of 4,000 concurrent student transactions.',
    priority: 'Must Have',
    category: 'Performance',
    rationale: 'Eliminates 504 gateway timeouts and browser crashes during 09:00 AM rush.'
  },
  {
    id: 'NFR-02',
    type: 'Non-Functional',
    title: 'High Availability During Enrollment Window',
    statement: 'The application SHALL achieve 99.9% uptime across the 14-day priority enrollment period with automated multi-zone failover.',
    priority: 'Must Have',
    category: 'Reliability',
    rationale: 'Enrollment is mission-critical; outages disrupt academic progression.'
  },
  {
    id: 'NFR-03',
    type: 'Non-Functional',
    title: 'FERPA Data Confidentiality & Encryption',
    statement: 'All student identifiable information and academic records SHALL be encrypted at rest using AES-256 and in transit via TLS 1.3 with role-based access control.',
    priority: 'Must Have',
    category: 'Security & Legal',
    rationale: 'Compliance with federal educational privacy regulations is mandatory to protect institutional funding.'
  },
  {
    id: 'NFR-04',
    type: 'Non-Functional',
    title: 'Accessibility Standard Compliance',
    statement: 'All public and authenticated web interfaces SHALL conform to W3C Web Content Accessibility Guidelines (WCAG) 2.1 Level AA.',
    priority: 'Must Have',
    category: 'Accessibility',
    rationale: 'Ensures equitable access for students with visual, auditory, motor, or cognitive disabilities.'
  }
];

export const INITIAL_USER_STORIES: UserStoryItem[] = [
  {
    id: 'US-01',
    asA: 'Undergraduate Student',
    iWant: 'to see my live waitlist numerical rank and estimated probability of enrollment',
    soThat: 'I can make informed decisions about registering for backup elective courses before sections fill up',
    acceptanceCriteria: `Scenario: Viewing waitlist position on schedule dashboard
  Given the student is enrolled on the waitlist for "CS-210 Data Structures"
  When they visit their current semester schedule view
  Then the system displays badge: "Waitlist Rank: #3 of 15"
  And displays historical roll-in likelihood: "High (Historically 4.2 seats open)"`
  },
  {
    id: 'US-02',
    asA: 'Academic Advisor',
    iWant: 'a unified pending waiver inbox with student transcripts and degree progress side-by-side',
    soThat: 'I can evaluate and approve prerequisite exception requests in a single click without switching between 3 legacy databases',
    acceptanceCriteria: `Scenario: 1-click prerequisite waiver approval
  Given an advisor is viewing student STU-5520 waiver request for "CS-340"
  When the advisor clicks "Approve Waiver" and inputs optional note: "Equivalent course verified"
  Then the student record is instantly updated to "Waiver Authorized" for 48 hours
  And an automated notification is sent to the student with 1-click registration link
  And an immutable audit entry is logged with the advisor ID and timestamp`
  },
  {
    id: 'US-03',
    asA: 'Student with an Outstanding Balance',
    iWant: 'to be alerted 72 hours before my registration window opens with a direct online payment link',
    soThat: 'I can pay my tuition balance online and have the hold cleared instantly before registration opening day',
    acceptanceCriteria: `Scenario: Pre-registration hold alert and instant clearance
  Given student STU-9102 has an unpaid Bursar balance of $1,420
  And registration opens in 72 hours
  When the pre-registration hold daemon runs
  Then the student receives an SMS and email alert with a direct secure payment link
  When the student pays the balance via credit card
  Then the payment webhook clears the "FIN_HOLD_BURSAR" flag in under 5 seconds
  And sends a confirmation SMS: "Hold cleared! You are clear to register on Monday at 09:00 AM"`
  }
];

export const INITIAL_AS_IS_PROCESS: ProcessStepItem[] = [
  { step: 1, actor: 'Student', action: 'Logs into legacy web portal at 08:59 AM; experiences high latency and multiple 504 timeouts', duration: '5 - 12 min', isBottleneck: true, bottleneckReason: 'Monolithic server CPU saturation under 4,000 concurrent sessions.' },
  { step: 2, actor: 'Bursar Mainframe', action: 'Synchronously checks billing balance upon clicking submit; blocks student without prior warning if > $50 is due', duration: '2 - 4 min', isBottleneck: true, bottleneckReason: 'Sudden hold surprise; forces student to abandon checkout and visit campus cashier.' },
  { step: 3, actor: 'Student', action: 'Enters 5-digit course CRN numbers manually; if course is full, screen simply says "Registration Error - Closed"', duration: '3 min', isBottleneck: false },
  { step: 4, actor: 'Academic Advisor & Registrar', action: 'Student prints paper override form, walks across campus to get advisor physical signature, then drops slip in Registrar box', duration: '3 - 5 days', isBottleneck: true, bottleneckReason: 'Manual paper walk-around; slips get lost and turnaround averages 4.8 business days.' },
  { step: 5, actor: 'Registrar Staff', action: 'Registrar staff member manually types course enrollment code into mainframe terminal late at night', duration: '10 min', isBottleneck: false }
];

export const INITIAL_TO_BE_PROCESS: ProcessStepItem[] = [
  { step: 1, actor: 'Automated Daemon', action: 'Scans student holds 72 hours prior; alerts student via SMS with instant 1-click credit card payment gateway', duration: '< 2 sec', isBottleneck: false, improvement: '100% of solvable holds resolved before registration morning.' },
  { step: 2, actor: 'Student & Cloud Portal', action: 'Student loads pre-saved schedule draft and clicks "1-Click Enroll"; cloud auto-scales across serverless instances', duration: '1.8 sec', isBottleneck: false, improvement: 'Absorbs 4,500 requests with zero dropped packets and p95 < 2.5s.' },
  { step: 3, actor: 'Rules Engine & Waitlist', action: 'In-memory engine verifies prerequisites; if full, offers transparent waitlist rank #1 with automated SMS roll-in', duration: 'Real-time', isBottleneck: false, improvement: 'Zero manual waitlist spreadsheets; 100% seat utilization.' },
  { step: 4, actor: 'Advisor Portal', action: 'Prerequisite waiver routed electronically to advisor inbox with transcript preview; approved with 1 tap', duration: '< 2 hours', isBottleneck: false, improvement: 'Turnaround slashed from 4.8 days to under 2 hours.' },
  { step: 5, actor: 'SIS Engine', action: 'Real-time database commit logs student enrollment and dispatches calendar invite and receipt', duration: '0.4 sec', isBottleneck: false, improvement: 'Instant digital confirmation with zero manual staff data entry.' }
];

export const INITIAL_SOLUTION_OPTIONS: SolutionOption[] = [
  {
    id: 'OPT-1',
    name: 'Custom Cloud-Native Self-Service Portal (Recommended)',
    type: 'In-House Build / Cloud Modernization',
    costTier: '$$$ ($180k - $240k one-time; $18k/yr cloud)',
    timelineWeeks: 18,
    pros: [
      'Tailored 100% to Apex University unique prerequisite and academic policy rules.',
      'Elastic cloud auto-scaling handles 09:00 AM spike without touching legacy database directly.',
      'Full internal ownership of IP with zero recurring per-student vendor license fees.'
    ],
    cons: [
      'Requires internal development team allocation and continuous DevOps maintenance.',
      'Higher initial upfront engineering effort compared to off-the-shelf software.'
    ],
    feasibilityScore: 92,
    fitScore: 96,
    recommendationRank: 1
  },
  {
    id: 'OPT-2',
    name: 'Commercial Off-The-Shelf SIS SaaS Upgrade',
    type: 'Vendor Package (Ellucian / Workday Education)',
    costTier: '$$$$$ ($450k implementation + $120k/yr licensing)',
    timelineWeeks: 36,
    pros: [
      'Pre-built industry modules with ongoing regulatory updates.',
      'Vendor provides 24/7 enterprise support SLAs.'
    ],
    cons: [
      'Extremely expensive recurring multi-year SaaS contracts.',
      'Rigid vendor data schema requires changing internal university business processes to match software.'
    ],
    feasibilityScore: 68,
    fitScore: 78,
    recommendationRank: 2
  },
  {
    id: 'OPT-3',
    name: 'Low-Code Form & Workflow Overlay (Quick Patch)',
    type: 'Low-Code / RPA Workflow',
    costTier: '$ ($45k one-time; $12k/yr license)',
    timelineWeeks: 8,
    pros: [
      'Fastest time to market (can be deployed in under 2 months).',
      'Provides a clean digital form interface for paper waiver requests.'
    ],
    cons: [
      'Does not solve the underlying 09:00 AM database concurrency bottleneck.',
      'Fragile RPA screen-scraping connectors prone to break during minor SIS updates.'
    ],
    feasibilityScore: 62,
    fitScore: 54,
    recommendationRank: 3
  }
];

export const INITIAL_UAT_CASES: UatCase[] = [
  {
    id: 'UAT-001',
    title: 'Standard Course Enrollment (Happy Path)',
    precondition: 'Student has zero holds, meets course prerequisites, and course has open seats.',
    steps: [
      '1. Student logs into portal at assigned registration time.',
      '2. Searches for course "CS-101 Section 01".',
      '3. Clicks "Add to Schedule" and then "Submit Registration".',
      '4. Observe screen banner and enrollment confirmation.'
    ],
    expectedResult: 'System registers student within 2.5 seconds, increments enrolled seats, and displays green confirmation banner.',
    actualStatus: 'Passed',
    severity: 'Critical',
    testerNotes: 'Validated in Staging. p95 response time was 1.4s.'
  },
  {
    id: 'UAT-002',
    title: 'Financial Hold Pre-Check Block & Payment Clearance',
    precondition: 'Student has an outstanding Bursar balance of $1,420 flagged by Financial Services.',
    steps: [
      '1. Student logs into portal.',
      '2. Observes warning alert: "Registration Blocked: Bursar Balance".',
      '3. Clicks "Pay Online Now" and completes test payment.',
      '4. Returns to portal and clicks "Submit Registration".'
    ],
    expectedResult: 'Payment webhook clears hold in < 5 seconds; registration proceeds successfully with zero staff intervention.',
    actualStatus: 'Passed',
    severity: 'Critical',
    testerNotes: 'Webhook responded in 2.8 seconds; hold released immediately.'
  },
  {
    id: 'UAT-003',
    title: 'Automated Waitlist Promotion & 24h Expiration',
    precondition: 'Course MATH-201 is full (30/30). Student STU-2049 is #1 on waitlist. Enrolled student drops.',
    steps: [
      '1. Enrolled student drops MATH-201.',
      '2. Background worker evaluates waitlist.',
      '3. Verify STU-2049 notification and status update.',
      '4. Simulate 24-hour expiration without student claim.'
    ],
    expectedResult: 'Seat is offered to #1 with 24h claim link. Upon 24h expiry, seat is automatically transferred to student #2.',
    actualStatus: 'Passed',
    severity: 'High',
    testerNotes: 'Timer cron triggered exactly on schedule.'
  },
  {
    id: 'UAT-004',
    title: 'Prerequisite Waiver Digital Advisor Approval',
    precondition: 'Student lacks prerequisite course; submits digital waiver request with transfer transcript.',
    steps: [
      '1. Student submits online waiver for CS-340 with attached syllabus.',
      '2. Academic Advisor opens Advisor Queue and clicks "Approve".',
      '3. Student returns to registration portal.'
    ],
    expectedResult: 'Advisor approval authorizes student enrollment for 48 hours; student successfully commits course.',
    actualStatus: 'Passed',
    severity: 'High',
    testerNotes: 'Audit log captured advisor ID and timestamp.'
  }
];

export const INITIAL_SUCCESS_MEASURES = [
  {
    metric: 'Registration Failure / Error Rate',
    baseline: '18.2% of registration attempts failed',
    target: '< 4.0% total failure rate',
    measurementMethod: 'Automated daily registration transaction logs in Data Lab',
    owner: 'University Registrar & Systems Lead'
  },
  {
    metric: 'Average Registration Completion Time',
    baseline: '18.4 minutes average duration',
    target: '< 2.5 minutes average duration',
    measurementMethod: 'Application frontend timestamp from session start to confirmation commit',
    owner: 'UX & Student Experience Team'
  },
  {
    metric: 'Peak Helpdesk Calls & Support Tickets',
    baseline: '1,420 tickets in first 48 hours',
    target: '< 350 tickets (75% reduction)',
    measurementMethod: 'ServiceNow / Zendesk institutional helpdesk tag reporting',
    owner: 'Student Affairs & Helpdesk Operations'
  },
  {
    metric: 'Prerequisite Waiver Turnaround Time',
    baseline: '4.8 business days (manual paper walk)',
    target: '< 4 business hours (electronic routing)',
    measurementMethod: 'Advisor workflow queue timestamp delta (Submission to Sign-Off)',
    owner: 'Dean of Undergraduate Advising'
  },
  {
    metric: 'Student Net Satisfaction (CSAT)',
    baseline: '24% satisfied with registration experience',
    target: '> 85% satisfied on post-registration pulse survey',
    measurementMethod: '1-click 5-star rating prompt upon enrollment confirmation',
    owner: 'Student Government & VP Enrollment'
  }
];
