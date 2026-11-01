import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '15mb' }));

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Shared Gemini AI client with telemetry header
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Deterministic BA Engine & Function Definitions
interface FunctionExecutionResult {
  functionUsed: string;
  result: any;
  assumptions: string[];
  missingInfoNeeded: string[];
  isAiGenerated: boolean;
}

// 1. Stakeholder Question Generator
function runGenerateStakeholderQuestions(params: any): FunctionExecutionResult {
  const role = params.role || 'Registrar';
  const topic = params.topic || 'College Course Registration System';
  const projectScope = params.scope || 'Self-service registration portal with prerequisite and financial hold automation';

  const defaultQuestionsByRole: Record<string, any[]> = {
    'Registrar': [
      {
        id: 'Q-REG-01',
        category: 'Process Discovery',
        question: 'What manual verification steps does your office currently perform during peak registration week?',
        purpose: 'Identify manual bottlenecks and labor-intensive validation checkpoints.',
        followUp: 'How many staff hours are diverted to manual prerequisite overrides each term?'
      },
      {
        id: 'Q-REG-02',
        category: 'Policy & Exceptions',
        question: 'Under what exact criteria can a student bypass a course prerequisite, and who has sign-off authority?',
        purpose: 'Define the decision logic and permission matrix for automated override workflows.',
        followUp: 'Is there an audit log maintained for manual dean-level overrides today?'
      },
      {
        id: 'Q-REG-03',
        category: 'Pain Points & Volume',
        question: 'At what point during registration opening does system sluggishness or lockups typically spike?',
        purpose: 'Quantify peak concurrency windows and database lock contention intervals.',
        followUp: 'What error messages do students report seeing most frequently?'
      },
      {
        id: 'Q-REG-04',
        category: 'Success Metrics',
        question: 'What would an acceptable turnaround time look like for handling waitlist roll-ins when a seat opens?',
        purpose: 'Establish non-functional SLA requirements for automated seat re-allocation.',
        followUp: 'Should students receive a 24-hour expiration notification before forfeiting the seat?'
      }
    ],
    'Academic Advisor': [
      {
        id: 'Q-ADV-01',
        category: 'Workflow & Triaging',
        question: 'How do you currently receive and prioritize student course overload and elective approval requests?',
        purpose: 'Assess the intake channel (emails, paper slips, or CRM tickets) to design unified approval queues.',
        followUp: 'What percentage of requests could be auto-approved based on GPA thresholds (e.g. GPA >= 3.5)?'
      },
      {
        id: 'Q-ADV-02',
        category: 'Information Visibility',
        question: 'What student degree audit information do you need to see on one screen before approving an add/drop waiver?',
        purpose: 'Define UI data elements for the Advisor Single-Pane-of-Glass view.',
        followUp: 'Do you need real-time visibility into the student financial hold status?'
      }
    ],
    'Bursar / Finance': [
      {
        id: 'Q-BUR-01',
        category: 'Hold Management',
        question: 'What is the minimum outstanding debt amount that triggers a registration hold on a student account?',
        purpose: 'Clarify business rule thresholds (e.g., balance > $100 vs $0 balance strictly).',
        followUp: 'Can students with approved financial aid disbursement pending be placed on a conditional waiver?'
      },
      {
        id: 'Q-BUR-02',
        category: 'Integration Latency',
        question: 'When a student clears their balance online, how quickly does the Bursar system synchronize with the SIS?',
        purpose: 'Determine batch sync vs real-time API latency requirements.',
        followUp: 'Are holds cleared immediately or via an hourly reconciliation batch job?'
      }
    ],
    'Student / End User': [
      {
        id: 'Q-STU-01',
        category: 'User Experience',
        question: 'When attempting to register for a full section, how do you discover alternative open sections or waitlist options?',
        purpose: 'Uncover UX friction in timetable schedule building and course discovery.',
        followUp: 'Would automated schedule conflict detection and alternative recommendation save you time?'
      },
      {
        id: 'Q-STU-02',
        category: 'Transparency',
        question: 'When your registration is rejected or pending advisor review, is the reason clear in the interface?',
        purpose: 'Evaluate error messaging clarity and self-service resolution paths.',
        followUp: 'Do you know who to contact when an unhandled system timeout occurs?'
      }
    ]
  };

  const selectedQuestions = defaultQuestionsByRole[role] || defaultQuestionsByRole['Registrar'];

  return {
    functionUsed: 'generate_stakeholder_questions',
    result: {
      role,
      topic,
      scope: projectScope,
      interviewGuideTitle: `Elicitation Interview Protocol: ${role} Focus`,
      suggestedQuestions: selectedQuestions,
      facilitationTips: [
        'Establish rapport by clarifying you are studying the workflow, not evaluating individual employee performance.',
        'Ask open-ended "What" and "How" questions before asking "Why" to avoid stakeholder defensiveness.',
        'Use silence effectively: allow 3-5 seconds after an answer for the stakeholder to share deeper unprompted context.',
        'Summarize understanding at the end of each topic: "So if I heard you correctly, the biggest holdup is..."'
      ]
    },
    assumptions: [
      `Assumed stakeholder role is ${role} operating under a standard 4-year collegiate credit model.`,
      'Assumed current registration infrastructure is on-premise SIS with batch-based overnight synchronization.',
      'Assumed the interview is 45 minutes with time allocated for follow-up and process artifact review.'
    ],
    missingInfoNeeded: [
      'Specific regulatory or union restrictions regarding advisor working hours during add/drop week.',
      'Existing ticketing or email intake software currently used by the department.'
    ],
    isAiGenerated: false
  };
}

// 2. Requirements & User Stories Drafter
function runDraftRequirements(params: any): FunctionExecutionResult {
  const epicTitle = params.epic || 'Automated Student Registration & Waitlist Management';
  const priority = params.priority || 'MoSCoW';

  return {
    functionUsed: 'draft_requirements_and_stories',
    result: {
      epicTitle,
      businessObjective: 'Reduce student registration completion time from 18 minutes to under 3 minutes, eliminate manual waitlist processing, and minimize registration error drop-offs by 60%.',
      functionalRequirements: [
        {
          id: 'FR-01',
          title: 'Real-Time Prerequisite & Corequisite Evaluation',
          statement: 'The system SHALL validate student prerequisite courses and minimum passing grade requirements in real time upon course selection before allowing submission.',
          moscow: 'Must Have',
          rationale: 'Prevents ineligible registrations from entering registrar queues and reduces downstream course drops.'
        },
        {
          id: 'FR-02',
          title: 'Automated Financial Hold Pre-Check',
          statement: 'The system SHALL perform an asynchronous financial status check 72 hours prior to the student registration window and alert the student with resolution steps if a hold exists.',
          moscow: 'Must Have',
          rationale: 'Eliminates peak-hour traffic jams caused by students discovering bursar holds at 09:00 AM on registration day.'
        },
        {
          id: 'FR-03',
          title: 'First-Come First-Served Waitlist Queue with Automated Seat Offer',
          statement: 'When an enrolled student drops a seat, the system SHALL automatically offer the seat to the first eligible student on the waitlist with a 24-hour expiration window.',
          moscow: 'Must Have',
          rationale: 'Replaces manual registrar phone calls and spreadsheet seat tracking with automated lifecycle management.'
        },
        {
          id: 'FR-04',
          title: 'Single-Click Advisor Waiver Workflow',
          statement: 'The system SHALL allow academic advisors to review prerequisite waiver requests with student transcripts side-by-side and approve or reject with one click.',
          moscow: 'Should Have',
          rationale: 'Reduces advisor turnaround time from 4 days to under 4 hours.'
        },
        {
          id: 'FR-05',
          title: 'Multi-Schedule Visual Conflict Detector',
          statement: 'The system SHALL display an interactive weekly calendar preview highlighting time overlaps and travel buffer warnings between campus buildings.',
          moscow: 'Could Have',
          rationale: 'Enhances student satisfaction and reduces schedule changes during add/drop period.'
        }
      ],
      nonFunctionalRequirements: [
        {
          id: 'NFR-01',
          category: 'Performance & Concurrency',
          statement: 'The registration transaction processing SHALL complete within 2.5 seconds for 95% of requests under peak load of 4,000 concurrent students.',
          metric: 'p95 latency <= 2.5s; 4,000 active sessions'
        },
        {
          id: 'NFR-02',
          category: 'Availability',
          statement: 'The registration portal SHALL maintain 99.9% uptime during the 14-day priority enrollment window with automatic failover.',
          metric: 'Max unplanned downtime <= 20 minutes across enrollment window'
        },
        {
          id: 'NFR-03',
          category: 'Security & Compliance',
          statement: 'All student identifiable information and academic records SHALL be encrypted at rest (AES-256) and in transit (TLS 1.3) adhering to FERPA compliance.',
          metric: 'Zero plain-text PII storage; annual FERPA audit compliance'
        },
        {
          id: 'NFR-04',
          category: 'Accessibility',
          statement: 'All student and staff facing user interfaces SHALL conform to WCAG 2.1 Level AA standards including keyboard navigation and screen reader compatibility.',
          metric: '100% WCAG 2.1 AA automated audit compliance'
        }
      ],
      userStories: [
        {
          id: 'US-REG-101',
          role: 'Undergraduate Student',
          feature: 'view my waitlist rank in real time',
          benefit: 'I can make informed backup course selections without repeatedly contacting the department chair',
          acceptanceCriteriaGherkin: [
            'Scenario: Student views position on a full course waitlist\n  Given the student is enrolled on the waitlist for "CS-210 Data Structures"\n  When the student visits the "My Current Enrollments" page\n  Then the system displays their exact waitlist numerical position (e.g., "#3 of 14")\n  And displays the estimated probability band based on historical drop rates',
            'Scenario: Seat becomes available and email trigger fires\n  Given an enrolled student drops a seat in "CS-210"\n  When the automated seat allocation worker runs\n  Then student #1 receives an email and SMS alert with a 24-hour claim token\n  And the student waitlist status updates to "Seat Offered - Claim Pending"'
          ]
        },
        {
          id: 'US-REG-102',
          role: 'Academic Advisor',
          feature: 'batch approve prerequisite waivers for students with equivalent transfer credits',
          benefit: 'I can clear high-volume transfer student registrations before priority window closes',
          acceptanceCriteriaGherkin: [
            'Scenario: Batch approval of eligible transfer students\n  Given the advisor has selected 5 pending waiver requests with verified transfer articulation\n  When the advisor clicks "Batch Approve Selected"\n  Then all 5 requests transition to "Approved"\n  And an audit log entry records the advisor ID, timestamp, and justification'
          ]
        }
      ]
    },
    assumptions: [
      'Assumed the institution follows semester-based course codes with standard credit tiers (1 to 4 credits per class).',
      'Assumed student authentication is federated via campus SAML/OAuth SSO.',
      'Assumed FERPA compliance is mandatory for all student record accesses.'
    ],
    missingInfoNeeded: [
      'Does the institution permit variable waitlist capacities per department (e.g. max 10 students vs unlimited)?',
      'Are tuition charges calculated immediately upon registration commit or via end-of-day billing batch?'
    ],
    isAiGenerated: false
  };
}

// 3. Process Flow Mapper
function runMapProcessFlow(params: any): FunctionExecutionResult {
  const processType = params.type || 'Comparison';

  const asIsSteps = [
    {
      step: 1,
      actor: 'Student',
      action: 'Logs into legacy SIS portal at 9:00 AM registration opening',
      duration: '4-8 min',
      isBottleneck: true,
      bottleneckReason: 'High concurrent login attempts cause 504 gateway timeouts and dropped sessions.',
      handoffTo: 'Bursar Verification'
    },
    {
      step: 2,
      actor: 'SIS Batch System',
      action: 'Validates financial hold status synchronously against Bursar mainframe',
      duration: '2-4 min',
      isBottleneck: true,
      bottleneckReason: 'Synchronous mainframe locking causes database queue backlog; student learns of $50 fee hold with zero prior warning.',
      handoffTo: 'Course Selection or Drop'
    },
    {
      step: 3,
      actor: 'Student',
      action: 'Enters 5-digit course CRN numbers manually from printed PDF catalog',
      duration: '3-6 min',
      isBottleneck: false,
      bottleneckReason: null,
      handoffTo: 'Prerequisite Check'
    },
    {
      step: 4,
      actor: 'Registrar Staff',
      action: 'Receives unhandled prerequisite conflict; student directed to paper waiver form in Hall B',
      duration: '2-5 days',
      isBottleneck: true,
      bottleneckReason: 'Manual paper walk-around to department chair and academic advisor signature.',
      handoffTo: 'Manual Enrollment Entry'
    },
    {
      step: 5,
      actor: 'Registrar Staff',
      action: 'Staff member types course enrollment into green-screen terminal manually',
      duration: '5 min',
      isBottleneck: false,
      bottleneckReason: null,
      handoffTo: 'Postal / Email Confirmation'
    }
  ];

  const toBeSteps = [
    {
      step: 1,
      actor: 'Automated Background Daemon',
      action: 'Performs pre-registration hold checks 72 hours early and sends push alerts with 1-click payment links',
      duration: '< 1 sec',
      isBottleneck: false,
      improvement: '100% of solvable financial holds cleared before registration opening bell.'
    },
    {
      step: 2,
      actor: 'Student & Cloud Portal',
      action: 'Student selects saved schedule draft with 1-click registration submission using distributed queue',
      duration: '1.2 sec',
      isBottleneck: false,
      improvement: 'Horizontal auto-scaling absorbs 4,000 concurrent requests without timeout.'
    },
    {
      step: 3,
      actor: 'Automated Rule Engine',
      action: 'Validates degree audit, prerequisites, and co-requisites in-memory via Redis cache',
      duration: '0.4 sec',
      isBottleneck: false,
      improvement: 'Instant feedback; alternative courses recommended if section is full.'
    },
    {
      step: 4,
      actor: 'Automated Waitlist Worker',
      action: 'If course is full, places student into priority queue and triggers SMS when seat opens with 24h hold',
      duration: 'Real-time',
      isBottleneck: false,
      improvement: 'Zero registrar manual intervention; 100% seat utilization.'
    },
    {
      step: 5,
      actor: 'Advisor Workflow Portal',
      action: 'Exceptions routed digitally to advisor inbox with transcript preview and 1-tap sign-off',
      duration: '< 2 hours',
      isBottleneck: false,
      improvement: 'Cycle time reduced from 4.5 days to under 2 hours.'
    }
  ];

  return {
    functionUsed: 'map_process_flow',
    result: {
      processTitle: 'Apex College Course Registration Modernization: As-Is vs To-Be',
      summaryComparison: {
        asIsAverageCycleTime: '4.8 Days (with manual waivers)',
        toBeAverageCycleTime: '2.4 Minutes (self-service automated)',
        cycleTimeReductionPct: '98.5%',
        manualTouchpointsRemoved: 4,
        bottlenecksIdentified: 3
      },
      asIsFlow: asIsSteps,
      toBeFlow: toBeSteps,
      keyHandoffRisks: [
        'Mainframe connection pool exhaustion during the first 45 minutes of registration.',
        'Paper waiver slip misplacement between academic departments and registrar intake.',
        'Stale seat availability data causing double-booking or rejected final commits.'
      ]
    },
    assumptions: [
      'Assumed current registration process involves a legacy on-premise SIS with periodic batch jobs.',
      'Assumed advisors work standard academic business hours (09:00 - 17:00).',
      'Assumed campus IT has access to containerized cloud infrastructure or modern API gateways.'
    ],
    missingInfoNeeded: [
      'Exact database schema and vendor name of current SIS (e.g. Ellucian Banner, Peoplesoft, or custom Oracle DB).',
      'Policy on whether professors can directly override course maximum capacity caps.'
    ],
    isAiGenerated: false
  };
}

// 4. UAT Test Cases Generator
function runGenerateUatTestCases(params: any): FunctionExecutionResult {
  const featureArea = params.featureArea || 'Waitlist & Prerequisite Automation';

  const testCases = [
    {
      testId: 'UAT-REG-001',
      scenario: 'Eligible student registers for open course section with all prerequisites satisfied',
      preconditions: 'Student STU-4821 is logged in, has zero financial holds, and completed CS-101 with grade B.',
      testSteps: [
        '1. Navigate to Course Registration dashboard.',
        '2. Search for "CS-210 Data Structures" (Section 01, CRN 1004).',
        '3. Click "Add to Schedule" and then "Submit Registration".',
        '4. Observe screen feedback and enrollment summary.'
      ],
      testData: 'Student: STU-4821, Course: CS-210-01, Term: Fall 2026',
      expectedResult: 'System confirms enrollment within 2.5 seconds, updates seat count from 24/30 to 25/30, and displays green success confirmation banner.',
      severity: 'Critical / Blocker',
      businessRuleTested: 'BR-REG-01: Direct instant enrollment for eligible students in sections with available seats.'
    },
    {
      testId: 'UAT-REG-002',
      scenario: 'Registration blocked due to outstanding Bursar financial hold',
      preconditions: 'Student STU-9102 has an unpaid balance of $1,420 flagged by Bursar office.',
      testSteps: [
        '1. Log into Registration portal as student STU-9102.',
        '2. Attempt to add "BIO-110 General Biology".',
        '3. Click "Submit Registration".'
      ],
      testData: 'Student: STU-9102, HoldCode: FIN_HOLD_BURSAR',
      expectedResult: 'System displays prominent warning banner: "Registration Blocked: Bursar Account Balance $1,420", provides direct link to Bursar Payment Portal, and logs rejection reason FIN_HOLD_BURSAR.',
      severity: 'High',
      businessRuleTested: 'BR-REG-02: Zero-tolerance enrollment lock for financial liabilities exceeding $100.'
    },
    {
      testId: 'UAT-REG-003',
      scenario: 'Automatic waitlist placement when section hits max capacity',
      preconditions: 'Course section MATH-201 Section 02 has 30/30 seats filled.',
      testSteps: [
        '1. Student STU-2049 selects MATH-201 Section 02.',
        '2. System displays modal: "Section Full. 3 students currently waitlisted. Join Waitlist?".',
        '3. Student clicks "Confirm Join Waitlist".'
      ],
      testData: 'Student: STU-2049, Course: MATH-201, Current Waitlist Size: 3',
      expectedResult: 'Student receives waitlist position #4, email confirmation is dispatched, and enrollment status indicates "Waitlisted - Position 4".',
      severity: 'High',
      businessRuleTested: 'BR-REG-03: First-come first-served waitlist queuing with transparent rank indicator.'
    },
    {
      testId: 'UAT-REG-004',
      scenario: 'Seat opens in full section; first waitlist student receives 24-hour claim window',
      preconditions: 'Student STU-2049 is #1 on waitlist for MATH-201. Enrolled student STU-1002 drops the course.',
      testSteps: [
        '1. Trigger drop event for enrolled student STU-1002.',
        '2. Waitlist allocation batch executes.',
        '3. Verify database state for STU-2049.',
        '4. Inspect notification queue.'
      ],
      testData: 'Dropped Student: STU-1002, Waitlisted Student #1: STU-2049',
      expectedResult: 'Status updates to "Seat Offered"; SMS and email sent with 24-hour claim deadline; seat is reserved exclusively for STU-2049 until expiration.',
      severity: 'Critical / Blocker',
      businessRuleTested: 'BR-REG-04: Automated seat roll-in with 24-hour reservation window.'
    },
    {
      testId: 'UAT-REG-005',
      scenario: 'Concurrent registration edge case (last seat race condition)',
      preconditions: 'Course CS-450 has exactly 1 remaining seat available (24/25 filled).',
      testSteps: [
        '1. Two students STU-8855 and STU-6611 click "Submit Registration" at the exact same millisecond.',
        '2. Verify database transactional locking mechanism.',
        '3. Inspect outcomes for both students.'
      ],
      testData: 'Students: STU-8855, STU-6611; Course: CS-450-01',
      expectedResult: 'Exactly one student receives "Enrolled" (25/25 filled). The second student receives polite prompt: "Seat was claimed; would you like position #1 on the waitlist?". Zero duplicate seat assignments.',
      severity: 'Critical / Blocker',
      businessRuleTested: 'BR-REG-05: ACID transaction consistency; zero seat overselling.'
    }
  ];

  return {
    functionUsed: 'generate_uat_test_cases',
    result: {
      featureArea,
      testSuiteTitle: `UAT Acceptance Test Suite: ${featureArea}`,
      totalCases: testCases.length,
      testCases,
      passCriteria: '100% of Critical/Blocker test cases must pass without workarounds. High severity must have approved mitigations.'
    },
    assumptions: [
      'Assumed UAT will be executed in a dedicated staging environment cloned from production data with masked PII.',
      'Assumed test accounts exist for student, academic advisor, registrar administrator, and bursar officer.'
    ],
    missingInfoNeeded: [
      'Specific test user login credentials for automated staging runs.',
      'Whether email dispatch should be validated via Mailtrap or actual institutional SMTP gateway.'
    ],
    isAiGenerated: false
  };
}

// 5. Practice Submission Reviewer & Rubric Grader
function runReviewPracticeSubmission(params: any): FunctionExecutionResult {
  const taskTitle = params.taskTitle || 'User Story & Acceptance Criteria';
  const studentText = params.submissionText || '';

  // Deterministic rubric evaluation based on content signals
  const hasUserStoryFormat = /as a|as an|i want|so that/i.test(studentText);
  const hasGherkin = /given|when|then|scenario/i.test(studentText);
  const hasBusinessValue = /because|so that|benefit|reduce|increase|save/i.test(studentText);
  const hasEdgeCases = /error|invalid|fail|timeout|exceed|hold/i.test(studentText);

  let clarityScore = hasUserStoryFormat ? 23 : 15;
  let feasibilityScore = studentText.length > 120 ? 22 : 14;
  let completenessScore = hasGherkin ? 24 : 12;
  let businessValueScore = hasBusinessValue ? 24 : 14;

  if (hasEdgeCases) completenessScore = Math.min(25, completenessScore + 3);

  const totalScore = clarityScore + feasibilityScore + completenessScore + businessValueScore;

  const strengths: string[] = [];
  const improvements: string[] = [];

  if (hasUserStoryFormat) {
    strengths.push('Clean adherence to standard Agile story framing ("As a... I want... So that...").');
  } else {
    improvements.push('Structure your primary user stories explicitly using the Agile template: "As a [role], I want [capability] so that [business value]".');
  }

  if (hasGherkin) {
    strengths.push('Excellent adoption of Given-When-Then (Gherkin) behavior-driven acceptance criteria.');
  } else {
    improvements.push('Define acceptance criteria using the Gherkin format (Given [precondition], When [action], Then [measurable outcome]).');
  }

  if (hasBusinessValue) {
    strengths.push('Clear articulation of the business outcome and end-user benefit.');
  } else {
    improvements.push('Strengthen the "So that" clause to highlight measurable business value (e.g. saving time, preventing error drops) rather than repeating technical implementation.');
  }

  if (!hasEdgeCases) {
    improvements.push('Include at least one negative or boundary scenario (e.g., handling what happens when a student exceeds maximum credits or has a delinquent hold).');
  } else {
    strengths.push('Thoughtful consideration of edge cases and exception handling paths.');
  }

  return {
    functionUsed: 'review_practice_submission',
    result: {
      taskTitle,
      totalScore,
      maxScore: 100,
      rubricBreakdown: [
        {
          criterion: 'Clarity & Framing',
          score: clarityScore,
          max: 25,
          feedback: clarityScore >= 20 ? 'Well structured and unambiguous language.' : 'Needs clearer role and intent definitions.'
        },
        {
          criterion: 'Technical Feasibility',
          score: feasibilityScore,
          max: 25,
          feedback: feasibilityScore >= 20 ? 'Realistic constraints and achievable technical scope.' : 'Could benefit from more concrete system boundaries.'
        },
        {
          criterion: 'Completeness & Acceptance Criteria',
          score: completenessScore,
          max: 25,
          feedback: completenessScore >= 20 ? 'Robust acceptance conditions covering positive and negative flows.' : 'Missing testable acceptance criteria scenarios.'
        },
        {
          criterion: 'Business Value Focus',
          score: businessValueScore,
          max: 25,
          feedback: businessValueScore >= 20 ? 'Directly ties system capability to institutional success.' : 'Connect technical tasks back to the core business ROI.'
        }
      ],
      strengths,
      improvements,
      seniorBaAdvice: totalScore >= 80 
        ? 'Great job! This artifact meets industry standards for junior-to-mid BA sprint planning. Next step: review this directly with your tech lead during backlog grooming.'
        : 'Good effort! Review the suggested improvements above. As a BA intern or analyst, having crisp Gherkin criteria is what makes developers and QA love working with you.'
    },
    assumptions: [
      'Assumed this deliverable is targeted for a 2-week Agile sprint refinement session.',
      'Assumed the reader is a mixed audience of developers, QA testers, and business product owners.'
    ],
    missingInfoNeeded: [
      'Specific team definition of ready (DoR) conventions used in your student capstone or workplace.'
    ],
    isAiGenerated: false
  };
}

// 6. Webinar Preparation Function
function runPrepareWebinarAssets(params: any): FunctionExecutionResult {
  const webinarTopic = params.topic || 'Breaking Into Business Analysis & Internship Success';
  const durationMinutes = params.duration || 60;

  return {
    functionUsed: 'prepare_webinar_assets',
    result: {
      webinarTitle: 'From Student to Business Analyst: Launching Your BA Career & Acing Your First Internship',
      targetAudience: 'College students, career switchers, and aspiring Business Analysts.',
      durationMinutes,
      timedAgenda: [
        { time: '00:00 - 00:05', duration: '5 min', session: 'Welcome & Icebreaker', objective: 'Poll audience background (majors, career stage) and define webinar agenda.' },
        { time: '00:05 - 00:18', duration: '13 min', session: 'The Real Role of a Business Analyst', objective: 'Demystify the BA: Bridge between Business & Tech; IIBA BABOK core areas.' },
        { time: '00:18 - 00:30', duration: '12 min', session: 'Intern vs Employee: What Actually Changes?', objective: 'Compare day-to-day autonomy, review cycles, and 5 golden rules to secure a return offer.' },
        { time: '00:30 - 00:45', duration: '15 min', session: 'Live Hands-On Demo: BA Studio in Action', objective: 'Walk through real data profiling in Data Lab + As-Is to To-Be process mapping.' },
        { time: '00:45 - 00:52', duration: '7 min', session: 'Interactive Knowledge Check & Live Quiz', objective: 'Engage audience with 3 rapid scenario questions with live polling.' },
        { time: '00:52 - 00:60', duration: '8 min', session: 'Audience Q&A & Resource Handout Kit', objective: 'Address live chat questions and distribute free BA Starter Cheat Sheet.' }
      ],
      slideDeckOutline: [
        { slide: 1, title: 'Title & Introduction', keyTakeaway: 'The BA is the problem-solver who turns messy chaos into high-value software.' },
        { slide: 2, title: 'The Six Core Knowledge Areas (BABOK simplified)', keyTakeaway: 'From Strategy Analysis to Solution Evaluation—how it all connects.' },
        { slide: 3, title: 'Internship Reality vs Classroom Theory', keyTakeaway: 'Nobody hands you clean requirements; you have to elicit, clarify, and validate.' },
        { slide: 4, title: 'The Essential BA Toolkit (Jira, SQL, BPMN, Excel)', keyTakeaway: 'Tools change, but structured analytical thinking remains timeless.' },
        { slide: 5, title: 'Case Study: Modernizing College Course Registration', keyTakeaway: 'Walking through a real enterprise registration headache.' },
        { slide: 6, title: 'Data-Driven Analysis: Finding the $100K Bottleneck', keyTakeaway: 'How data logs reveal that financial holds and server timeouts cause 70% of issues.' },
        { slide: 7, title: 'How to Build a Portfolio that Gets You Hired', keyTakeaway: 'Show, don\'t tell: present a complete problem dossier, user stories, and UAT test cases.' },
        { slide: 8, title: 'Action Plan & Next Steps', keyTakeaway: 'Start practicing today with BA Studio and join the community.' }
      ],
      speakerNotes: [
        'Intro hook: "Raise your virtual hand if you ever registered for a college course at 9:00 AM only to have the screen crash on you. Today, we are going to fix that as Business Analysts."',
        'Emphasize that BAs do not write production code, but they must understand system architectures, data flows, and human user behaviors.',
        'During the Data Lab live demo: highlight how a BA uses real numbers (e.g. 18% rejection rate due to bursar holds) to convince an executive sponsor.'
      ],
      liveDemoScript: [
        'Step 1: Open BA Studio Data Lab.',
        'Step 2: Load "registration_requests.csv" with 150 student records.',
        'Step 3: Point out the Profiling findings: 18 financial hold failures, 8 system timeout crashes.',
        'Step 4: Execute Cleaning Preview: deduplicate 1 row, trim course name whitespaces.',
        'Step 5: Switch to Project Studio Step 4: Show the visual As-Is vs To-Be process comparison diagram.'
      ],
      handoutHighlights: [
        'Summary of 6 IIBA Knowledge Areas with memory mnemonic.',
        'The 5-Question Elicitation Cheat Sheet.',
        'INVEST Checklist for Agile User Stories.',
        'Resume bullet point formula: "Analyzed [system/process] using [tool] resulting in [quantifiable % improvement]".'
      ]
    },
    assumptions: [
      'Assumed a 60-minute virtual presentation format on Zoom/Google Meet/Teams.',
      'Assumed attendees have diverse backgrounds ranging from computer science to business administration.'
    ],
    missingInfoNeeded: [
      'Preferred webinar platform poll integration capability (e.g. Zoom Polls, Slido, or Mentimeter).'
    ],
    isAiGenerated: false
  };
}

// POST endpoint: Execute BA Function (with Gemini AI augmentation if key present, deterministic engine fallback)
app.post('/api/ai/execute-function', async (req: Request, res: Response) => {
  const startTime = Date.now();
  const { functionName, parameters = {}, userPrompt = '' } = req.body;

  try {
    // 1. Run deterministic baseline function
    let baselineResult: FunctionExecutionResult;
    switch (functionName) {
      case 'generate_stakeholder_questions':
        baselineResult = runGenerateStakeholderQuestions(parameters);
        break;
      case 'draft_requirements_and_stories':
        baselineResult = runDraftRequirements(parameters);
        break;
      case 'map_process_flow':
        baselineResult = runMapProcessFlow(parameters);
        break;
      case 'generate_uat_test_cases':
        baselineResult = runGenerateUatTestCases(parameters);
        break;
      case 'review_practice_submission':
        baselineResult = runReviewPracticeSubmission(parameters);
        break;
      case 'prepare_webinar_assets':
        baselineResult = runPrepareWebinarAssets(parameters);
        break;
      default:
        baselineResult = {
          functionUsed: functionName || 'general_ba_query',
          result: { message: 'Function executed successfully.', parameters },
          assumptions: ['Assumed standard enterprise agile business analysis practices.'],
          missingInfoNeeded: ['Specific business domain rules and technical constraints.'],
          isAiGenerated: false
        };
    }

    // 2. Check if Gemini AI can augment or tailor the result
    const ai = getGeminiClient();
    if (ai && userPrompt && userPrompt.trim().length > 5) {
      try {
        const systemPrompt = `You are the lead Business Analyst AI engine for BA Studio.
You are executing the registered BA function "${functionName}".
Tailor the result to specifically address the user prompt: "${userPrompt}".
CRITICAL RULES:
1. Return valid JSON only.
2. Label all assumptions clearly.
3. State any missing information or clarifications required.
4. Never invent factual figures from thin air; if dealing with data, reference the provided context.
5. Emphasize standard IIBA / BABOK best practices.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `Here is the baseline structured result from our deterministic function engine:\n${JSON.stringify(baselineResult.result, null, 2)}\n\nUser custom instructions:\n${userPrompt}\n\nEnhance, refine, and output the response matching this JSON structure:
{
  "functionUsed": "${functionName}",
  "result": <refined result object>,
  "assumptions": ["assumption 1", "assumption 2"],
  "missingInfoNeeded": ["missing item 1", "missing item 2"]
}`,
          config: {
            responseMimeType: 'application/json',
          }
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          return res.json({
            success: true,
            functionUsed: functionName,
            executionTimeMs: Date.now() - startTime,
            result: parsed.result || baselineResult.result,
            assumptions: Array.isArray(parsed.assumptions) && parsed.assumptions.length > 0 ? parsed.assumptions : baselineResult.assumptions,
            missingInfoNeeded: Array.isArray(parsed.missingInfoNeeded) && parsed.missingInfoNeeded.length > 0 ? parsed.missingInfoNeeded : baselineResult.missingInfoNeeded,
            isAiGenerated: true
          });
        }
      } catch (geminiError: any) {
        console.warn('Gemini AI augmentation failed, falling back to deterministic result:', geminiError?.message || geminiError);
        // Fall back seamlessly to baseline
      }
    }

    // Return baseline result
    return res.json({
      success: true,
      functionUsed: baselineResult.functionUsed,
      executionTimeMs: Date.now() - startTime,
      result: baselineResult.result,
      assumptions: baselineResult.assumptions,
      missingInfoNeeded: baselineResult.missingInfoNeeded,
      isAiGenerated: false
    });
  } catch (error: any) {
    console.error('Error executing function:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Internal server error executing function'
    });
  }
});

// POST endpoint: Interactive BA Copilot Chat
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  const { message = '', context = {} } = req.body;

  try {
    const ai = getGeminiClient();

    // Determine function to run based on message keywords
    let chosenFunction = 'general_ba_consult';
    const lower = message.toLowerCase();
    if (lower.includes('question') || lower.includes('interview') || lower.includes('stakeholder') || lower.includes('elicit')) {
      chosenFunction = 'generate_stakeholder_questions';
    } else if (lower.includes('requirement') || lower.includes('story') || lower.includes('acceptance') || lower.includes('gherkin')) {
      chosenFunction = 'draft_requirements_and_stories';
    } else if (lower.includes('process') || lower.includes('map') || lower.includes('as-is') || lower.includes('to-be') || lower.includes('swimlane')) {
      chosenFunction = 'map_process_flow';
    } else if (lower.includes('uat') || lower.includes('test') || lower.includes('scenario')) {
      chosenFunction = 'generate_uat_test_cases';
    } else if (lower.includes('webinar') || lower.includes('slide') || lower.includes('presentation') || lower.includes('agenda')) {
      chosenFunction = 'prepare_webinar_assets';
    } else if (lower.includes('review') || lower.includes('rubric') || lower.includes('grade') || lower.includes('feedback')) {
      chosenFunction = 'review_practice_submission';
    }

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `You are the lead Business Analyst AI advisor inside "BA Studio".
The student asks: "${message}"
Active studio context: ${JSON.stringify(context)}

CRITICAL REQUIREMENTS:
1. Always state which BA function was invoked (e.g. "${chosenFunction}").
2. Explicitly separate your answer into:
   - Direct advice / deliverable output
   - Explicitly labeled assumptions (e.g., "[Assumption: ...]")
   - Missing information or clarifications needed (e.g., "[Information Needed: ...]")
3. Keep the tone professional, encouraging, practical, and rigorous according to IIBA BABOK and Agile BA standards.
4. If figures or calculations are mentioned, NEVER invent numbers; remind the student to compute exact metrics in the Data Lab.
Format response in clean Markdown with clear headers.`,
        });

        return res.json({
          reply: response.text || 'Business analysis consultation completed.',
          functionUsed: chosenFunction,
          assumptions: [
            'Assumed university administrative environment with semester-based enrollment.',
            'Assumed standard Agile Scrum sprint cadence (2-week sprints).'
          ],
          missingInfoNeeded: [
            'Current system integration architecture and data privacy constraints.'
          ]
        });
      } catch (err: any) {
        console.warn('Gemini chat error, using deterministic response:', err?.message);
      }
    }

    // Deterministic fallback response
    let deterministicReply = '';
    if (chosenFunction === 'generate_stakeholder_questions') {
      deterministicReply = `### BA Function Executed: \`generate_stakeholder_questions\`\n\n` +
        `**Key Elicitation Protocol for College Registration:**\n\n` +
        `1. **Registrar Focus:** "What manual verification steps consume the most staff hours during peak registration week?"\n` +
        `2. **Academic Advisor Focus:** "Under what conditions can a student bypass a course prerequisite, and what approval evidence is required?"\n` +
        `3. **Bursar Focus:** "What outstanding financial threshold triggers a registration hold, and how quickly does payment reflect?"\n\n` +
        `**[Assumption: Course registration peaks across a 72-hour enrollment opening window.]**\n` +
        `**[Information Needed: Exact FERPA audit and student signature policy for course overrides.]**`;
    } else if (chosenFunction === 'draft_requirements_and_stories') {
      deterministicReply = `### BA Function Executed: \`draft_requirements_and_stories\`\n\n` +
        `**User Story:**\n` +
        `> **As an** undergraduate student,\n` +
        `> **I want** to see my live waitlist rank and receive automated SMS seat claim alerts,\n` +
        `> **So that** I don't miss open course seats or repeatedly email the department chair.\n\n` +
        `**Acceptance Criteria (Gherkin):**\n` +
        `\`\`\`gherkin\nScenario: Seat opens in full course\n  Given student #1 is on the waitlist for "CS-210"\n  When an enrolled student drops the course\n  Then student #1 receives an SMS offer with a 24-hour expiration token\n  And the seat is held exclusively for them\n\`\`\`\n\n` +
        `**[Assumption: SMS gateway integration (e.g. Twilio) is within scope and funded.]**\n` +
        `**[Information Needed: Should students have 24 hours or 12 hours during late add/drop week?]**`;
    } else {
      deterministicReply = `### BA Function Executed: \`${chosenFunction}\`\n\n` +
        `Hello! I am your **BA Studio Co-Pilot**. I am connected to real BA function engines for stakeholder elicitation, requirements drafting, process mapping, data profiling, and UAT generation.\n\n` +
        `**How I can help:**\n` +
        `- Navigate to **Learn** to study the 6 IIBA Knowledge Areas.\n` +
        `- Go to **Practice** to write user stories and receive rubric-based grading.\n` +
        `- Use **Project Studio** for the step-by-step Apex College registration case.\n` +
        `- Open **Data Lab** to run exact data profiling and KPI calculations on actual CSV files.\n\n` +
        `**[Assumption: User is exploring Business Analysis foundational skills or coursework.]**\n` +
        `**[Information Needed: What specific deliverable or exercise are you currently working on?]**`;
    }

    return res.json({
      reply: deterministicReply,
      functionUsed: chosenFunction,
      assumptions: ['Assumed standard Agile Business Analyst environment.'],
      missingInfoNeeded: ['Specific organizational business rules.']
    });
  } catch (error: any) {
    console.error('Chat endpoint error:', error);
    return res.status(500).json({ error: 'Failed to process chat message' });
  }
});

// Operations Analyst Investigation Endpoint
app.post('/api/operations/investigate', async (req: Request, res: Response) => {
  const { questionKey, baselineResult, userPrompt = '' } = req.body;
  const startTime = Date.now();

  try {
    const ai = getGeminiClient();
    if (ai && baselineResult) {
      try {
        const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 4000));
        const aiPromise = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `You are SupportFlow, a Senior Business Operations Analyst Agent.
The user clicked the operational investigation question: "${baselineResult.questionTitle}"
Here are the exact deterministic calculation results from the actual ticket data:
- Function Executed: ${baselineResult.functionUsed}
- Finding: ${baselineResult.finding}
- Evidence Data: ${JSON.stringify(baselineResult.evidence, null, 2)}
- Baseline Action: ${baselineResult.suggestedAction}
- Baseline Assumptions: ${JSON.stringify(baselineResult.assumptions, null, 2)}

CRITICAL INSTRUCTIONS:
1. NEVER invent or alter numerical figures. Use the exact numbers from the evidence provided.
2. Provide a crisp, executive finding (2-3 sentences max).
3. Provide an actionable operational recommendation for team leads.
4. Output valid JSON matching this schema:
{
  "finding": "Crisp executive summary with exact numbers",
  "suggestedAction": "Practical operational recommendation",
  "assumptions": ["Assumption 1", "Assumption 2"]
}`,
          config: {
            responseMimeType: 'application/json',
          }
        });

        const response: any = await Promise.race([aiPromise, timeoutPromise]);

        if (response && response.text) {
          const parsed = JSON.parse(response.text);
          return res.json({
            success: true,
            functionUsed: baselineResult.functionUsed,
            executionTimeMs: Date.now() - startTime,
            finding: parsed.finding || baselineResult.finding,
            evidence: baselineResult.evidence,
            suggestedAction: parsed.suggestedAction || baselineResult.suggestedAction,
            chartData: baselineResult.chartData,
            staffingImpact: baselineResult.staffingImpact,
            assumptions: Array.isArray(parsed.assumptions) && parsed.assumptions.length > 0 ? parsed.assumptions : baselineResult.assumptions,
            isAiGenerated: true
          });
        }
      } catch (err: any) {
        console.warn('Gemini investigation enrichment failed, returning exact code calculation:', err?.message);
      }
    }

    // Deterministic fallback (exact calculation results)
    return res.json({
      success: true,
      functionUsed: baselineResult?.functionUsed || 'operations_analytics',
      executionTimeMs: Date.now() - startTime,
      finding: baselineResult?.finding || 'Analysis complete.',
      evidence: baselineResult?.evidence || [],
      suggestedAction: baselineResult?.suggestedAction || 'Review active queue assignments.',
      chartData: baselineResult?.chartData,
      staffingImpact: baselineResult?.staffingImpact,
      assumptions: baselineResult?.assumptions || ['Assumed standard operational queue metrics.'],
      isAiGenerated: false
    });
  } catch (error: any) {
    console.error('Error in operations investigate:', error);
    return res.status(500).json({ error: 'Failed to process investigation' });
  }
});

// Operations Improvement Brief Generation Endpoint
app.post('/api/operations/draft-brief', async (req: Request, res: Response) => {
  const { briefTemplate, userFeedback = '' } = req.body;
  const startTime = Date.now();

  try {
    const ai = getGeminiClient();
    if (ai && briefTemplate) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `You are SupportFlow, a Senior Business Operations Analyst.
Draft or refine an Operational Improvement Brief based on this baseline template:
${JSON.stringify(briefTemplate, null, 2)}
User custom feedback or constraints: "${userFeedback}"

CRITICAL INSTRUCTIONS:
1. Problem statement must be concise and cite the baseline metrics.
2. Formulate 2-3 formal functional/non-functional requirements (FR/NFR).
3. Provide testable Given-When-Then (Gherkin) acceptance criteria.
4. Output 2-3 UAT acceptance check scenarios.
5. Return JSON matching the template structure.`,
          config: {
            responseMimeType: 'application/json',
          }
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          return res.json({
            success: true,
            functionUsed: 'draft_improvement_brief',
            executionTimeMs: Date.now() - startTime,
            brief: parsed,
            isAiGenerated: true
          });
        }
      } catch (err: any) {
        console.warn('Gemini brief generation failed, returning baseline brief:', err?.message);
      }
    }

    return res.json({
      success: true,
      functionUsed: 'draft_improvement_brief',
      executionTimeMs: Date.now() - startTime,
      brief: briefTemplate,
      isAiGenerated: false
    });
  } catch (error: any) {
    console.error('Error drafting brief:', error);
    return res.status(500).json({ error: 'Failed to draft brief' });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BA Studio Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
