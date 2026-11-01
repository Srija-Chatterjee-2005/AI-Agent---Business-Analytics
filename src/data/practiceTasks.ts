import { PracticeTask } from '../types/ba';

export const PRACTICE_TASKS: PracticeTask[] = [
  {
    id: 'task-1',
    title: 'Draft User Stories & Gherkin Acceptance Criteria for Waitlist Automation',
    difficulty: 'Beginner',
    category: 'Requirements & Agile',
    estimatedTimeMin: 15,
    scenario: `At Apex College, when high-demand courses (like Computer Science and Calculus) fill up, students currently have to manually refresh the portal multiple times a day or walk into the Registrar's office with paper override slips.

The product owner has asked you to draft a comprehensive User Story for an "Automated Waitlist Queue & Notification" feature. The story needs to follow the standard Agile format ("As a... I want... So that...") and include testable acceptance criteria using the Given-When-Then (Gherkin) framework covering both the happy path (when a seat opens) and at least one boundary/exception scenario (e.g., offer expiration or maximum waitlist capacity).`,
    instructions: [
      'Write the primary user story with Role, Feature, and clear Business Value.',
      'Provide at least two distinct Given-When-Then scenarios (one positive flow, one timeout or edge case).',
      'Specify any business rule constraints (e.g. 24-hour expiration window).',
      'Ensure acceptance criteria are written so that a QA tester can write automated tests from them directly.'
    ],
    starterTemplate: `User Story:
As a [user role],
I want to [desired capability],
So that [tangible business value or outcome].

Acceptance Criteria:
Scenario 1: [Happy path description]
  Given [precondition]
  When [action taken]
  Then [expected observable outcome]
  And [additional outcome]

Scenario 2: [Edge case or timeout]
  Given [precondition]
  When [action taken]
  Then [expected observable outcome]`,
    hints: [
      'Think about what happens to the seat if the student does not claim it within 24 hours.',
      'Remember to state who gets notified (email vs SMS) and what their status changes to in the database.',
      'Avoid vague adjectives like "the system should be fast"—specify exact timing (e.g., within 2 minutes of seat drop).'
    ],
    rubric: {
      clarity: 'Uses unambiguous language; follows standard Agile story format without mixing roles or vague pronouns.',
      feasibility: 'Proposes realistic technical functionality that can be achieved within an iterative sprint cycle.',
      completeness: 'Includes both the positive happy path and boundary conditions (expiration, capacity limits, notifications).',
      businessValue: 'The "So that" clause explains the measurable outcome (e.g., saving student time, eliminating manual registrar triage).'
    },
    modelAnswer: `User Story:
As a full-time undergraduate student,
I want to automatically join a course waitlist and receive an instant SMS/email alert when a seat becomes available,
So that I can claim open course seats without continuously checking the portal or submitting manual paper waiver forms.

Acceptance Criteria:

Scenario 1: Automated Seat Offer Upon Enrolled Student Drop (Happy Path)
  Given the student is ranked #1 on the waitlist for "CS-210 Data Structures"
  And the section currently has 0 open seats (30/30 enrolled)
  When an enrolled student officially drops the course
  Then the system reserves the opened seat exclusively for waitlisted student #1
  And changes student #1's status to "Seat Offered - Claim Pending"
  And dispatches an automated SMS and email notification with a 24-hour claim deadline link
  And increments the available waitlist queue for subsequent students.

Scenario 2: Unclaimed Seat Offer Expiration (Exception Flow)
  Given student #1 was offered a reserved seat in "CS-210"
  And 24 hours have elapsed without the student clicking "Confirm Claim"
  When the automated waitlist hourly cleanup worker runs
  Then student #1's reservation expires and their waitlist status transitions to "Offer Expired"
  And the system automatically promotes waitlisted student #2 to "Seat Offered"
  And dispatches a new 24-hour reservation notification to student #2.`
  },
  {
    id: 'task-2',
    title: 'Elicitation Interview Protocol: Dean of Admissions & Registrar',
    difficulty: 'Intermediate',
    category: 'Elicitation & Stakeholders',
    estimatedTimeMin: 20,
    scenario: `You are preparing to conduct a 45-minute discovery interview with Dr. Katherine Vance, the University Registrar. Historical logs show that during the first 3 days of Fall registration, the Registrar's office receives over 1,400 angry student phone calls, 28% of registrations fail due to surprise financial holds, and staff work overtime until 9:00 PM manually processing paper prerequisite waiver slips.

Dr. Vance is protective of her team, somewhat skeptical of IT automation, and values academic integrity and audit compliance above all else. Your goal is to prepare an elicitation interview protocol containing open-ended discovery questions, probing questions, and consensus-building techniques.`,
    instructions: [
      'Write an opening statement establishing rapport and framing the interview as a collaborative fact-finding effort.',
      'Draft 4 categorized elicitation questions (covering: Current Pain Points, Business Rules & Governance, Exception Handling, and Success Metrics).',
      'For each question, specify the BA analytical objective (what exact information you are seeking).',
      'Include a follow-up probing question for each main question to uncover hidden assumptions.'
    ],
    starterTemplate: `Interview Opening & Rapport:
[Your 2-3 sentence introduction explaining the purpose of the session]

Question 1: [Process & Pain Points]
- Question:
- Analytical Objective:
- Probing Follow-Up:

Question 2: [Business Rules & Policy Exceptions]
- Question:
- Analytical Objective:
- Probing Follow-Up:

Question 3: [Data & System Hand-offs]
- Question:
- Analytical Objective:
- Probing Follow-Up:

Question 4: [Target KPIs & Success Definition]
- Question:
- Analytical Objective:
- Probing Follow-Up:`,
    hints: [
      'Avoid defensive phrasing like "Why does your office take so long?"; instead use "What manual verification steps take the most time during peak registration?"',
      'Focus on the policy vs implementation divide: let Dr. Vance define the policy rules while you explore automation.',
      'Ask how her office currently proves compliance during state accreditation audits.'
    ],
    rubric: {
      clarity: 'Questions are concise, professional, and free of technical jargon that might alienate business stakeholders.',
      feasibility: 'Protocol is realistic to execute within a standard 45-minute calendar window.',
      completeness: 'Covers discovery, policy exceptions, inter-departmental handoffs (Bursar/Advisors), and measurable success criteria.',
      businessValue: 'Directly uncovers root causes for staff overtime, call volume spikes, and student frustration.'
    },
    modelAnswer: `Interview Opening & Rapport:
"Thank you so much for your time today, Dr. Vance. I know peak registration is one of the busiest periods of the academic calendar for your office. Our goal today is not to critique how things operate, but to understand the manual bottlenecks your staff navigate every day so we can build software tools that protect your team's time and preserve the academic standards you uphold."

Question 1: Process Bottlenecks & Workload Spikes
- Question: "During the first 72 hours of open registration, which specific verification steps require the heaviest manual staff intervention?"
- Analytical Objective: Identify labor-intensive touchpoints suitable for automated business rule validation.
- Probing Follow-Up: "Of the paper waiver slips your staff processes, roughly what proportion are routine transfer equivalencies versus genuine policy exceptions?"

Question 2: Governance & Sign-Off Authority
- Question: "Under what explicit circumstances can an academic advisor or department chair override a missing prerequisite without Registrar pre-approval?"
- Analytical Objective: Map the role-based permission matrix and sign-off hierarchies for the future portal.
- Probing Follow-Up: "How does your office currently audit overrides when state accreditation or FERPA reviews occur?"

Question 3: Inter-Departmental Dependencies (Bursar Hand-Off)
- Question: "When a student with an outstanding financial hold clears their balance at the cashier window, how does your system learn that they are eligible to register?"
- Analytical Objective: Expose batch latency versus real-time sync gaps between Finance and Enrollment engines.
- Probing Follow-Up: "Would an automated pre-check 72 hours before registration open reduce the day-of phone surge for your front desk?"

Question 4: Measurable Definition of Success
- Question: "Looking forward to next year's launch, what measurable outcome would make your team celebrate and say this project was a total success?"
- Analytical Objective: Establish non-functional SLAs and business acceptance criteria agreed upon by the sponsor.
- Probing Follow-Up: "If we could eliminate 80% of routine hold-related walk-ins, how would your staff reallocate those hours?"`
  },
  {
    id: 'task-3',
    title: 'Process Gap Analysis & Fishbone Root Cause Diagram',
    difficulty: 'Intermediate',
    category: 'Process & Strategy',
    estimatedTimeMin: 20,
    scenario: `Registration audit logs from the past two semesters reveal that out of 10,000 course registration attempts, 1,840 (18.4%) resulted in immediate rejection due to "FIN_HOLD_BURSAR" (unpaid student account balances).

When students hit this rejection at 09:02 AM, they flood the Bursar cashier office in person and call the helpdesk, creating a 4-hour telephone queue and preventing staff from assisting genuine emergency hardship cases.

As the BA, conduct a Root Cause Analysis using the 5-Whys framework and construct a structured Fishbone (Ishikawa) breakdown across 4 categories: People, Process, Technology, and Policy.`,
    instructions: [
      'Perform a 5-Whys chain starting from: "Students experience high registration failure rates due to financial holds on registration morning."',
      'Categorize contributing factors across People, Process, Technology, and Policy.',
      'Propose 2 actionable, high-impact counter-measures to eliminate the root cause.'
    ],
    starterTemplate: `The 5-Whys Analysis:
1. Why do so many students fail registration on opening morning?
   Because...
2. Why did they not know about their financial hold?
   Because...
3. Why did the university not notify them earlier?
   Because...
4. Why does the billing system only check holds at the moment of registration?
   Because...
5. Why is there no proactive integration between Bursar billing and Student schedules? (Root Cause)
   Because...

Fishbone (Ishikawa) Categories:
- People:
- Process:
- Technology:
- Policy:

Proposed Counter-Measures & Business Value:
1.
2.`,
    hints: [
      'Distinguish between symptoms (e.g. long phone lines) and structural causes (e.g. lack of proactive push notifications).',
      'Consider that holds might be triggered by tiny fees (like a $15 library fine) that students did not realize existed.',
      'Think about how modern fintech handles pending charges.'
    ],
    rubric: {
      clarity: 'Logical progression in the 5-Whys sequence without skipping cause-and-effect steps.',
      feasibility: 'Proposed solutions are practical for a university IT and student affairs budget.',
      completeness: 'All 4 fishbone dimensions are populated with realistic organizational factors.',
      businessValue: 'Directly addresses reducing peak-day support ticket volume and improving student retention.'
    },
    modelAnswer: `The 5-Whys Analysis:
1. Why do so many students fail registration on opening morning?
   Because their accounts are locked by an automated "FIN_HOLD_BURSAR" error upon clicking submit.
2. Why are students blindsided by this hold at 09:00 AM on registration day?
   Because the registration portal only performs the financial hold validation check synchronously at the moment of course submission.
3. Why did the university not alert students about their hold before registration day?
   Because the Bursar system only sends monthly static billing statements via postal mail or bulk email, which students frequently ignore.
4. Why is there no proactive alert inside the student portal prior to enrollment week?
   Because the Bursar legacy database and the SIS course catalog operate on disjointed batch systems that do not share event-driven notifications.
5. Why are these systems disconnected without real-time synchronization? (Root Cause)
   Because the university historically treated student billing and academic scheduling as isolated departmental silos with no shared API architecture or unified student communication policy.

Fishbone (Ishikawa) Breakdown:
- People:
  * Students lack financial literacy regarding how incidental fees (e.g., $25 lab equipment fee) trigger automatic holds.
  * Cashier staff are overwhelmed by routine inquiries and cannot conduct proactive outreach.
- Process:
  * No pre-registration audit or "readiness checklist" before the enrollment window opens.
  * Clearing a hold after payment requires manual receipt verification by Bursar staff.
- Technology:
  * Overnight batch job latency (up to 24 hours) between payment gateway and registration database.
  * No mobile push notifications or SMS alerts for impending holds.
- Policy:
  * Blanket hold policy locks registration for any balance exceeding $50, regardless of whether pending financial aid is in transit.
  * No grace period policy for students with verified financial aid disbursements scheduled.

Proposed Counter-Measures:
1. Automated 72-Hour Pre-Registration Audit:
   Implement an automated background service that scans all eligible students 72 hours prior to their assigned registration time. If a balance > $50 exists, an SMS and in-app banner are triggered with a direct 1-click payment link and instructions to clear holds early.
2. Real-Time Webhook Clearing & Financial Aid Grace Period:
   Integrate real-time webhooks with the payment gateway so holds clear in under 5 seconds upon credit card confirmation. Update institutional policy to allow a $500 temporary grace buffer for students with verified incoming student loan disbursements.`
  },
  {
    id: 'task-4',
    title: 'Define Non-Functional Requirements (NFRs) for High-Concurrency Enrollment',
    difficulty: 'Intermediate',
    category: 'Architecture & NFRs',
    estimatedTimeMin: 15,
    scenario: `During registration morning, 4,500 students simultaneously hit the submit button between 08:59:50 AM and 09:03:00 AM. Last year, the legacy portal experienced database deadlock, p99 response times exceeded 45 seconds, and 312 students received HTTP 504 Gateway Timeouts while seats were silently allocated to others.

The engineering lead has asked you to draft a formal Non-Functional Requirements specification across 4 vital architectural pillars: Performance/Latency, Availability/Reliability, Security/Compliance (FERPA), and Scalability. Every requirement must include a verifiable, testable metric.`,
    instructions: [
      'Draft at least 4 formal NFR statements (one for each category: Performance, Availability, Security, Scalability).',
      'Follow standard specification syntax: "The system SHALL [behavior] [measurable constraint/metric]".',
      'Include the measurement mechanism (how QA or DevOps will verify compliance during load testing).',
      'Provide the business justification for each metric.'
    ],
    starterTemplate: `NFR 1: Performance & Concurrency
- Statement: The system SHALL...
- Testable Metric:
- Verification Method:
- Business Justification:

NFR 2: Availability & Disaster Recovery
- Statement: The system SHALL...
- Testable Metric:
- Verification Method:
- Business Justification:

NFR 3: Security & Regulatory Compliance (FERPA)
- Statement: The system SHALL...
- Testable Metric:
- Verification Method:
- Business Justification:

NFR 4: Elastic Scalability
- Statement: The system SHALL...
- Testable Metric:
- Verification Method:
- Business Justification:`,
    hints: [
      'Avoid subjective terms like "fast" or "secure"—use p95/p99 latency, transactions per second (TPS), uptime percentages, and AES-256 standards.',
      'FERPA requires strict audit logging for any staff viewing student transcripts or financial records.',
      'Think about auto-scaling policies: how quickly should additional cloud container instances spin up?'
    ],
    rubric: {
      clarity: 'Precise engineering language using RFC 2119 keywords ("SHALL", "MUST").',
      feasibility: 'Realistic constraints for modern cloud architectures without incurring unreasonable hosting costs.',
      completeness: 'Includes testable criteria and specific verification mechanisms for all four categories.',
      businessValue: 'Protects university reputation, eliminates server crashes, and guarantees legal compliance.'
    },
    modelAnswer: `NFR 1: Performance & Concurrency
- Statement: The registration processing engine SHALL process and commit 95% of course enrollment transactions within 2.5 seconds under a sustained concurrent load of 4,000 active student sessions.
- Testable Metric: p95 latency <= 2,500ms; maximum error rate < 0.1% at 4,000 concurrent virtual users.
- Verification Method: Distributed load testing in staging using JMeter/k6 simulating 4,500 requests over a 3-minute ramp-up window.
- Business Justification: Prevents browser timeouts, prevents duplicate submission attempts by anxious students, and delivers an intuitive, responsive user experience.

NFR 2: Availability & Disaster Recovery
- Statement: The registration portal SHALL maintain 99.9% application uptime throughout the 14-day priority enrollment window, with an automated Recovery Time Objective (RTO) of <= 15 minutes.
- Testable Metric: Maximum cumulative unplanned downtime <= 20.16 minutes over 14 days; RTO <= 15 min; RPO <= 0 seconds (zero data loss for committed enrollments).
- Verification Method: Automated Chaos Engineering fault injection testing (simulating primary database node failure).
- Business Justification: Course registration is an essential institutional event; system outages result in immediate public reputational damage and legal student appeals.

NFR 3: Security & Regulatory Compliance (FERPA)
- Statement: All student Personally Identifiable Information (PII), academic transcripts, and financial status data SHALL be encrypted in transit using TLS 1.3 and at rest using AES-256, with comprehensive immutable audit logging.
- Testable Metric: 100% of data stores encrypted; zero plain-text PII in application logs; 100% of override actions recorded with actor ID, timestamp, and IP address.
- Verification Method: Static application security testing (SAST), penetration testing, and annual independent FERPA audit verification.
- Business Justification: Federal FERPA regulations mandate strict confidentiality of educational records; non-compliance risks loss of federal institutional funding.

NFR 4: Elastic Scalability
- Statement: The application architecture SHALL automatically scale horizontal compute instances from a baseline of 2 containers to up to 20 containers within 90 seconds when CPU utilization exceeds 70% or queue depth exceeds 250 requests.
- Testable Metric: Auto-scale trigger latency <= 90 seconds; zero dropped HTTP requests during scale-out events.
- Verification Method: Synthetic load spike simulation ramping from 200 to 4,000 concurrent requests in 60 seconds.
- Business Justification: Enables cost efficiency by operating on minimal resources during normal weeks while instantly scaling up to absorb the 9:00 AM registration surge.`
  },
  {
    id: 'task-5',
    title: 'Scope Creep Defense: Evaluate a Late Change Request',
    difficulty: 'Advanced',
    category: 'Governance & Change Management',
    estimatedTimeMin: 20,
    scenario: `Two weeks prior to the scheduled User Acceptance Testing (UAT) phase of the Apex College Registration Modernization project, the Vice President of Campus Security sends an urgent email:

"We must require all students to perform facial biometric verification on their smartphones before confirming any course enrollment to stop students from sharing credentials or using bots to scalp class seats."

As the Business Analyst leading requirements management, you cannot simply say "No" to an executive sponsor, but implementing this request immediately will destabilize the current release timeline and introduce severe privacy risks. Conduct a structured Change Impact Assessment and formulate a diplomatic, evidence-based recommendation.`,
    instructions: [
      'Analyze the change across Triple Constraints: Scope, Schedule/Timeline, Cost/Budget, and Quality/Risk.',
      'Identify at least two alternative lighter-weight mitigations that address the underlying business concern (stopping bots and account sharing).',
      'Draft a professional executive response to the VP with an evidence-based recommendation (e.g., deferral to Phase 2 with interim controls).'
    ],
    starterTemplate: `Change Request Summary:
- Request ID: CR-042
- Title: Mandatory Facial Biometric Verification on Registration Commit
- Requestor: VP of Campus Security

Triple Constraint Impact Analysis:
1. Scope Impact:
2. Schedule / Timeline Impact:
3. Cost & Procurement Impact:
4. Quality, Compliance & Legal Risks:

Alternative Solution Options to Address the Root Concern:
- Option A (Lightweight technical control):
- Option B (Process & policy control):

Executive Recommendation & Diplomatic Response:
[Draft your email / memo to the VP]`,
    hints: [
      'Biometric data introduces state-level biometric privacy laws (e.g. BIPA) and accessibility challenges for students without high-end smartphones.',
      'What simpler technologies stop bots? (e.g. CAPTCHA, rate limiting, single active session enforcement).',
      'Always validate the problem before debating the solution.'
    ],
    rubric: {
      clarity: 'Executive-level framing: respectful, structured, objective, and solution-oriented.',
      feasibility: 'Proposes realistic, low-friction anti-bot alternatives that can be deployed within the existing timeline.',
      completeness: 'Analyzes legal, technical, accessibility, and timeline ramifications thoroughly.',
      businessValue: 'Protects the project launch date while genuinely addressing the security stakeholder’s core objective.'
    },
    modelAnswer: `Change Request Summary:
- Request ID: CR-042
- Title: Mandatory Facial Biometric Authentication on Course Registration
- Requestor: VP of Campus Security
- Objective: Prevent student credential sharing and third-party bot scripts from scalping high-demand class seats.

Triple Constraint Impact Analysis:
1. Scope Impact: High Expansion. Requires procurement of a 3rd-party biometric facial recognition SDK, mobile camera permissions, fallback flows for desktop users without webcams, and consent collection workflows.
2. Schedule / Timeline Impact: Critical Delay. Integrating, testing, and securing biometric verification would require 8 additional development weeks, postponing the Fall registration launch past the critical academic enrollment deadline.
3. Cost & Procurement Impact: Significant Unbudgeted Cost. Biometric vendor SaaS licensing (~$1.80/active student/year = ~$32,000 annually) plus emergency security architecture review.
4. Quality, Compliance & Accessibility Risks:
   - Severe Legal Risk: Biometric data collection triggers state privacy statutes (e.g., BIPA/CCPA) and requires student privacy opt-in consent.
   - Accessibility & Equity Barrier: Discriminates against students using legacy hardware, campus library terminals, or individuals with visual impairments (violating ADA/WCAG 2.1 AA).
   - High False Rejection Rate: Lighting variations or low-resolution webcams during 09:00 AM rush would lock innocent students out of required graduation courses.

Alternative Solution Options (Deployable Within Existing Timeline):
- Option A (Turnstile Cloudflare Bot Management & CAPTCHA):
  Implement invisible Cloudflare Turnstile anti-bot challenge and rate limiting (max 1 registration submission per 3 seconds per IP). Blocks automated python/curl scalper bots with zero UI friction for students. Effort: 2 engineering days.
- Option B (Concurrent Session Invalidation via SSO):
  Enforce a single active authentication session per student ID; if an account is logged in from a second device, the primary session is immediately terminated. Eliminates password sharing. Effort: 1 engineering day.

Executive Recommendation & Diplomatic Response:
"Dear Vice President Davis,

Thank you for bringing forward this critical concern regarding student account security and the risk of automated course scalping. We share your commitment to ensuring registration fairness and integrity for every student.

Our engineering and analysis team has conducted a formal impact assessment on integrating mandatory facial biometrics. While biometric authentication is a compelling technology, implementing it today introduces three immediate risks: it would delay the upcoming registration launch by 8 weeks (missing the Fall semester deadline), introduce substantial state biometric compliance liabilities, and create accessibility barriers for students registering on desktop computers.

To solve your core concern immediately without jeopardizing the launch, we recommend the following two-pronged strategy:
1. Immediate Phase 1 Implementation: We can deploy Cloudflare Turnstile bot detection and strict single-session concurrency locks within our current sprint. This halts automated scripts and password sharing with zero impact on the launch date.
2. Phase 2 Strategic Evaluation: We will place biometric and hardware-key (FIDO2/WebAuthn) multi-factor authentication into the Q1 Roadmap for comprehensive privacy, accessibility, and legal review with campus counsel.

I would welcome 15 minutes this Thursday to walk you through the bot protection telemetry so you can verify our defensive controls firsthand. Thank you for your leadership in keeping our campus secure."`
  },
  {
    id: 'task-6',
    title: 'Design End-to-End UAT Test Cases for Prerequisite Waiver Workflow',
    difficulty: 'Advanced',
    category: 'Testing & Validation',
    estimatedTimeMin: 20,
    scenario: `In the modernized Apex College system, when a student attempts to register for an advanced course (e.g. CS-340 Operating Systems) but has not taken the official prerequisite at Apex, they are prompted to submit an "Online Prerequisite Waiver Request".

This request routes directly to the student's assigned Academic Advisor. If the advisor approves, the student receives a notification and has 48 hours to claim their seat. If the advisor rejects, the reason is displayed clearly with recommended alternative courses.

Design a suite of 3 detailed UAT test cases:
1. Happy path: Student submits waiver with transfer transcript, advisor approves, student registers.
2. Rejection path: Advisor rejects due to insufficient prerequisite grade; system recommends alternative course.
3. Expiration path: Advisor approves, but student fails to register within the 48-hour waiver validity window.`,
    instructions: [
      'For each test case, define: Test ID, Title, Preconditions, Step-by-Step Test Procedure, Test Data, and Expected Measurable Result.',
      'Include clear pass/fail criteria so an end-user advisor or student tester can execute it without technical guidance.',
      'Specify the business rule being validated in each scenario.'
    ],
    starterTemplate: `Test Case 1: [Happy Path Approval & Enrollment]
- Test ID: UAT-WVR-001
- Preconditions:
- Test Steps:
- Test Data:
- Expected Result:
- Business Rule:

Test Case 2: [Advisor Rejection with Recommendation]
- Test ID: UAT-WVR-002
- Preconditions:
- Test Steps:
- Test Data:
- Expected Result:
- Business Rule:

Test Case 3: [48-Hour Waiver Expiration]
- Test ID: UAT-WVR-003
- Preconditions:
- Test Steps:
- Test Data:
- Expected Result:
- Business Rule:`,
    hints: [
      'Make sure test steps are numbered and specify exact clicks, dropdown selections, and verification points.',
      'Specify what happens to the seat count in the course catalog during each step.',
      'Consider the audit trail: does the system record which advisor approved the waiver and when?'
    ],
    rubric: {
      clarity: 'Steps are sequential, specific, reproducible, and easy for non-technical business testers to execute.',
      feasibility: 'Scenarios test realistic business operations under real-world time and notification constraints.',
      completeness: 'Includes happy path, negative rejection path, and temporal expiration boundary condition.',
      businessValue: 'Validates that the automated workflow eliminates paper slips while preserving academic standards.'
    },
    modelAnswer: `Test Case 1: Automated Prerequisite Waiver Submission and Approval (Happy Path)
- Test ID: UAT-WVR-001
- Preconditions: Student STU-5520 is enrolled in Computer Science major; has completed equivalent Data Structures at accredited Community College; has PDF transfer transcript on file.
- Test Steps:
  1. Student logs into portal and attempts to add "CS-340 Operating Systems".
  2. System detects missing Apex CS-210 course; displays modal: "Prerequisite Required: CS-210. Request Waiver?".
  3. Student selects "Transfer Articulation", uploads transcript PDF, types remark: "Completed at Oak Valley College with grade A", and clicks "Submit Waiver".
  4. Academic Advisor ADV-12 logs into Advisor Portal; opens "Pending Waivers" queue.
  5. Advisor clicks STU-5520 request, views attached transcript, clicks "Approve Waiver", and confirms modal.
  6. Student STU-5520 logs in; observes notification: "CS-340 Waiver Approved! Valid for 48 hours."
  7. Student clicks "Complete Enrollment in CS-340".
- Test Data: Student: STU-5520, Course: CS-340-01, Advisor: ADV-12 (Dr. Martinez).
- Expected Result: System commits enrollment, seat count updates from 22/30 to 23/30, status displays "Enrolled", and audit log stores timestamped approval signature by ADV-12.
- Business Rule: BR-WVR-01: Approved prerequisite waivers grant a 48-hour temporary enrollment authorization without requiring Registrar manual intervention.

Test Case 2: Advisor Rejection with Educational Feedback & Alternatives
- Test ID: UAT-WVR-002
- Preconditions: Student STU-2219 attempts to register for CHEM-105 General Chemistry without passing high school preparatory chemistry or equivalent test score.
- Test Steps:
  1. Student submits waiver request citing "Self-study online chemistry videos".
  2. Advisor reviews request in Advisor Dashboard.
  3. Advisor selects "Reject Waiver", selects reason code: "Insufficient Preparatory Coursework", types guidance: "Must complete CHEM-100 Prep Chem first", and clicks "Submit Decision".
  4. Student receives immediate email alert and in-app notification.
  5. Student views course registration dashboard.
- Test Data: Student: STU-2219, Course: CHEM-105, Rejection Code: PREREQ_INSUFFICIENT.
- Expected Result: Waiver status displays "Rejected: Insufficient Preparatory Coursework". Portal surfaces 1-click button: "View Recommended Prerequisite: CHEM-100 (Introductory Chemistry)" and does not allow CHEM-105 seat commitment.
- Business Rule: BR-WVR-02: Rejected waivers must provide clear pedagogical rationale and surface compliant prerequisite alternatives.

Test Case 3: Waiver Authorization Window Expiration (Temporal Boundary)
- Test ID: UAT-WVR-003
- Preconditions: Student STU-7788 received an approved waiver for "MATH-301 Linear Algebra" exactly 48 hours and 5 minutes ago, but did not complete the enrollment checkout.
- Test Steps:
  1. Student STU-7788 logs into the registration dashboard.
  2. Navigates to MATH-301 and attempts to click "Enroll with Approved Waiver".
  3. Inspect system validation check and notification banner.
- Test Data: Student: STU-7788, Course: MATH-301, Waiver Approval Timestamp: [Current Time - 48h 5m].
- Expected Result: System blocks checkout and displays alert: "Waiver Authorization Expired: Waivers are valid for 48 hours to preserve open seat availability for other students. Please re-apply or contact your advisor." Seat is not reserved.
- Business Rule: BR-WVR-03: Approved waiver authorizations expire after 48 continuous hours if unused, releasing seat reservations back to the general student waitlist.`
  }
];
