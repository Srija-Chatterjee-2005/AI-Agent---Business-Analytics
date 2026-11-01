export interface WebinarSlide {
  id: number;
  slideNumber: number;
  title: string;
  keyTakeaway: string;
  visualConcept: string;
  bullets: string[];
  durationEstimate: string;
}

export interface WebinarAgendaItem {
  id: string;
  timeRange: string;
  title: string;
  presenter: string;
  objective: string;
  tips: string;
  completed?: boolean;
}

export interface WebinarQuizItem {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  pollVoteCount: number[];
}

export const WEBINAR_METADATA = {
  title: 'Demystifying the Business Analyst: From Classroom to Your First BA Internship',
  subtitle: 'A practical, 60-minute roadmap to mastering requirements, data profiling, and high-impact BA deliverables.',
  presenter: 'Senior Business Analyst & Lead Instructor',
  targetAudience: 'Undergraduate & Graduate Students, Career Switchers, Aspiring Business Analysts',
  durationMinutes: 60,
  webinarDate: 'November 2026',
  expectedAttendees: 150
};

export const INITIAL_WEBINAR_AGENDA: WebinarAgendaItem[] = [
  {
    id: 'ag-1',
    timeRange: '00:00 - 00:05 (5 min)',
    title: 'Welcome, Logistics & Audience Icebreaker',
    presenter: 'Host / Instructor',
    objective: 'Set energy, introduce session goals, run rapid opening poll to gauge attendees academic background (CS, Business, Engineering, Humanities).',
    tips: 'Ask attendees in the chat: "Where are you joining from and what is your current major or career goal?"'
  },
  {
    id: 'ag-2',
    timeRange: '00:05 - 00:18 (13 min)',
    title: 'The Real BA Role: Beyond the Buzzwords',
    presenter: 'Lead BA',
    objective: 'Explain the BA as the bridge between business stakeholders and engineering. Break down the 6 IIBA BABOK Knowledge Areas in simple, relatable language.',
    tips: 'Use the analogy of a master translator at the United Nations: translating "We need more sales" into concrete system capabilities.'
  },
  {
    id: 'ag-3',
    timeRange: '00:18 - 00:30 (12 min)',
    title: 'Intern vs Full-Time Employee: What Truly Changes?',
    presenter: 'Lead BA & Former Intern Panelist',
    objective: 'Contrast day-to-day autonomy, risk exposure, and review cycles. Share the 5 Golden Rules that convert an internship into a return offer.',
    tips: 'Highlight Rule #1: "Never show up with just a problem—bring 2 options and your recommendation."'
  },
  {
    id: 'ag-4',
    timeRange: '00:30 - 00:45 (15 min)',
    title: 'Live Hands-On Demo: The Apex College Case in BA Studio',
    presenter: 'Lead BA',
    objective: 'Live walkthrough of real BA work: profile 150 registration logs in Data Lab, detect the 18% financial hold bottleneck, and show the As-Is vs To-Be process map.',
    tips: 'Show the exact calculated KPIs on screen. Show how data changes the conversation with executive sponsors.'
  },
  {
    id: 'ag-5',
    timeRange: '00:45 - 00:52 (7 min)',
    title: 'Interactive Live Knowledge Poll & Audience Challenge',
    presenter: 'Host & Attendees',
    objective: 'Engage audience with 3 realistic scenario questions; reveal live aggregate responses and explain why certain options stand out.',
    tips: 'Celebrate students who identify the negative edge case in the user story question.'
  },
  {
    id: 'ag-6',
    timeRange: '00:52 - 01:00 (8 min)',
    title: 'Live Q&A and Free Starter Toolkit Handout',
    presenter: 'Lead BA & Host',
    objective: 'Answer top upvoted questions from chat; distribute downloadable BA Starter Kit (BABOK summary, resume verbs, DONA meeting template).',
    tips: 'Remind attendees that practical portfolios (like the Project Studio dossier) beat generic resumes every single time.'
  }
];

export const INITIAL_WEBINAR_SLIDES: WebinarSlide[] = [
  {
    id: 1,
    slideNumber: 1,
    title: 'The Business Analyst: The Architect of Clarity',
    keyTakeaway: 'BAs don\'t just write requirements; they solve real human and operational problems.',
    visualConcept: 'Split screen: Left side shows chaotic sticky notes and confused stakeholders; Right side shows a clean, organized product backlog and smiling developers.',
    bullets: [
      'Welcome to the modern Business Analysis profession.',
      'Why tech companies, banks, and healthcare giants are hiring more BAs than ever before.',
      'How BAs prevent millions in software development waste by clarifying requirements before coding.'
    ],
    durationEstimate: '4 min'
  },
  {
    id: 2,
    slideNumber: 2,
    title: 'The Six Core Knowledge Areas (BABOK Demystified)',
    keyTakeaway: 'The IIBA BABOK is not an exam to memorize—it is a practical toolbox for problem-solving.',
    visualConcept: 'Circular radar diagram connecting Strategy Analysis -> Planning -> Elicitation -> Analysis & Design -> Life Cycle -> Solution Evaluation.',
    bullets: [
      'Strategy Analysis: Identifying the business problem before jumping to code.',
      'Elicitation & Collaboration: Asking the questions stakeholders didn\'t know they had to answer.',
      'Requirements Analysis: Turning conversations into testable User Stories & Process Maps.',
      'Solution Evaluation: Verifying that the delivered product actually solved the problem.'
    ],
    durationEstimate: '7 min'
  },
  {
    id: 3,
    slideNumber: 3,
    title: 'The Essential BA Toolkit (What to Put on Your Resume)',
    keyTakeaway: 'Employers look for tool proficiency paired with structured analytical thinking.',
    visualConcept: 'Four quadrants: Agile Backlog (Jira), Process Mapping (Lucidchart/BPMN), Data Analysis (SQL/Excel/Data Lab), Documentation (Confluence).',
    bullets: [
      'Jira & Confluence: Writing epics, user stories, and acceptance criteria developers love.',
      'BPMN 2.0 & Swimlanes: Visualizing handoffs, decision gateways, and bottlenecks.',
      'SQL & Data Profiling: Validating assumptions with real log data rather than gut feelings.',
      'Gherkin Syntax (Given-When-Then): The language that bridges product managers and QA engineers.'
    ],
    durationEstimate: '6 min'
  },
  {
    id: 4,
    slideNumber: 4,
    title: 'Internship Reality vs. Full-Time Expectations',
    keyTakeaway: 'Interns focus on execution excellence and learning; full-timers own outcomes and manage politics.',
    visualConcept: 'Side-by-side comparison table contrasting Scope, Autonomy, Risk, and Meeting dynamics.',
    bullets: [
      'Interns receive structured tasks with guidance; employees tackle vague, open-ended ambiguity.',
      'Interns validate artifacts with their senior mentor; employees sign off on sprint readiness.',
      'The biggest myth: You don\'t need to know how to code, but you must know how systems talk to each other.'
    ],
    durationEstimate: '6 min'
  },
  {
    id: 5,
    slideNumber: 5,
    title: 'The 5 Golden Rules to Turn an Internship into a Return Offer',
    keyTakeaway: 'Stand out by being proactive, structured, and obsessively reliable.',
    visualConcept: 'Numbered golden medals with clear actionable mantras.',
    bullets: [
      '1. Never bring a problem without 2 feasible options and your recommendation.',
      '2. Send the DONA (Decisions, Open questions, Next actions) notes within 2 hours.',
      '3. Anchor every debate in verifiable data from logs or transcripts.',
      '4. Consolidate your questions for scheduled check-ins instead of constant pings.',
      '5. Partner with QA and Developers early—ask how you can make their lives easier.'
    ],
    durationEstimate: '6 min'
  },
  {
    id: 6,
    slideNumber: 6,
    title: 'Live Case Study: Modernizing College Course Registration',
    keyTakeaway: 'Real-world business analysis applied to an everyday student frustration.',
    visualConcept: 'Diagram of student trying to register at 09:00 AM encountering 504 timeouts and bursar holds.',
    bullets: [
      'The Problem: 18.2% drop-off rate, 1,400 frantic support calls, 4.8 day waiver delays.',
      'The BA Investigation: Uncovering that 70% of issues stem from financial holds and server locks.',
      'The Solution: Cloud auto-scaling, automated waitlists, and instant 1-click advisor overrides.'
    ],
    durationEstimate: '5 min'
  },
  {
    id: 7,
    slideNumber: 7,
    title: 'Building a BA Portfolio That Gets Interviews',
    keyTakeaway: 'A complete project dossier speaks louder than a 1-page generic resume.',
    visualConcept: 'Mockup of a student GitHub/PDF portfolio showing a Problem Statement, BPMN Process Map, User Stories with Gherkin, and UAT Cases.',
    bullets: [
      'Recruiters look at dozens of identical student resumes with "Proficient in Microsoft Office".',
      'A portfolio with an As-Is/To-Be process flow and real UAT cases immediately proves competence.',
      'How you can use BA Studio to export your own portfolio-ready college registration case today.'
    ],
    durationEstimate: '6 min'
  },
  {
    id: 8,
    slideNumber: 8,
    title: 'Your 30-Day BA Action Plan & Free Handout',
    keyTakeaway: 'Start small, practice consistently, and master one core deliverable each week.',
    visualConcept: '30-day calendar roadmap with milestone checkmarks and QR code for starter handout download.',
    bullets: [
      'Week 1: Complete the BA Studio Learn modules and master the 6 IIBA areas.',
      'Week 2: Complete 3 Practice tasks (User Stories, Interview Guide, Root Cause Analysis).',
      'Week 3: Build your full Project Studio case study and export your portfolio.',
      'Week 4: Tailor your LinkedIn profile and apply to your top 10 target internships.'
    ],
    durationEstimate: '5 min'
  }
];

export const INITIAL_SPEAKER_NOTES = [
  {
    slideNumber: 1,
    script: `Good afternoon, everyone! If you've ever felt that disconnect between what a business leader wants and what developers actually build, you are in the right room.

A lot of students ask me: "What does a Business Analyst actually do all day? Do you write Python? Do you balance balance sheets?" The answer is simple: The Business Analyst is the architect of clarity. You are the problem-solver who takes chaotic, contradictory stakeholder desires and translates them into actionable, elegant technology solutions.

In today's 60 minutes, we are going to pull back the curtain on the entire profession, walk through real tools, analyze real data logs, and give you a blueprint to land your first BA internship. Let's dive in.`
  },
  {
    slideNumber: 2,
    script: `When you open the IIBA BABOK guide, it can look intimidating with hundreds of pages of methodology. But here is the secret: it all boils down to six intuitive steps.

First, Strategy Analysis: understanding the 'Why' before anyone writes a line of code.
Second, Elicitation: asking the smart questions that get people talking.
Third, Requirements Analysis: turning those conversations into testable user stories and process maps.
And finally, Solution Evaluation: proving that the software delivered the business value promised.

As an intern or junior BA, you will spend 80% of your initial time in Elicitation and Requirements Analysis. That is where we will focus our hands-on practice today.`
  },
  {
    slideNumber: 3,
    script: `Let's talk about the hard skills recruiters look for. Nobody hires a BA because they know how to make bullet points in Word.

They want to see: Can you write a User Story with Given-When-Then Gherkin acceptance criteria that a QA tester can automate? Can you map a business workflow using standard BPMN swimlanes in Lucidchart so the Vice President can spot the bottleneck in 10 seconds? And can you run basic SQL or data profiling to prove your point?

Notice none of these require a 4-year computer science degree. What they require is rigorous, structured curiosity.`
  },
  {
    slideNumber: 4,
    script: `Here is the truth about transitioning from student to intern: Nobody expects you to know everything on Day 1. What they do expect is that you ask thoughtful questions and handle feedback with grace.

As an intern, your deliverable will be redlined by your senior BA mentor. That is not failure; that is apprenticeship. In contrast, when you step into a full-time role, you are the one presenting to the department heads and negotiating scope trade-offs. Learn the craft as an intern so you can lead as an employee.`
  },
  {
    slideNumber: 5,
    script: `Commit these 5 golden rules to memory. If you remember nothing else from this webinar, remember Rule Number One:

When an obstacle comes up—for example, the registration database times out—never just walk into your manager's office and say 'It's broken, what should I do?' Instead, say: 'The server is timing out at 4,000 connections. Option A is spinning up an automated Redis queue; Option B is staggering registration by class year. I recommend Option B because it costs zero dollars and can be implemented by Friday.'

That is the difference between a student asking for homework answers and an analyst providing executive solutions.`
  }
];

export const INITIAL_WEBINAR_QUIZ: WebinarQuizItem[] = [
  {
    id: 'wq-1',
    question: 'A stakeholder tells you: "Our customer onboarding system is too slow." What is the most effective next question for a Business Analyst?',
    options: [
      'Should we rewrite the backend in Go or Rust?',
      'Can you show me where the delay happens, and how many minutes the process currently takes from end to end?',
      'I will submit a Jira ticket right away to make it faster.',
      'Why didn\'t the previous engineering team optimize the database?'
    ],
    correctIndex: 1,
    explanation: 'A great BA quantifies the problem and observes the current state before discussing technical solutions. Asking for current duration and observing the workflow turns a vague complaint into measurable baseline data.',
    pollVoteCount: [12, 118, 14, 6]
  },
  {
    id: 'wq-2',
    question: 'Which of the following represents an acceptance criterion written in proper Gherkin syntax?',
    options: [
      'The portal must be user-friendly and load within a few seconds.',
      'As a student, I want to view my grades so that I can monitor my GPA.',
      'Given the user is on the login page, When they enter valid credentials, Then they are redirected to their personalized dashboard.',
      'The database shall enforce AES-256 encryption on all stored passwords.'
    ],
    correctIndex: 2,
    explanation: 'Option 3 follows the standard Given (precondition), When (action), Then (expected outcome) Gherkin structure used in Behavior-Driven Development (BDD).',
    pollVoteCount: [8, 22, 114, 6]
  },
  {
    id: 'wq-3',
    question: 'What is the primary purpose of creating an "As-Is" process map before designing the "To-Be" system?',
    options: [
      'To prove that the current staff are doing their jobs poorly',
      'To baseline current cycle times, handoffs, and uncover hidden bottlenecks so the new solution actually addresses root causes',
      'To satisfy administrative documentation requirements that nobody reads',
      'To delay the software engineering team from starting development'
    ],
    correctIndex: 1,
    explanation: 'You cannot fix what you do not understand. The As-Is map illuminates where manual handoffs and delays live, establishing the baseline against which project success will be measured.',
    pollVoteCount: [2, 138, 7, 3]
  }
];
