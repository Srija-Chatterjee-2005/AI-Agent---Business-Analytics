import React, { useState, useEffect } from 'react';
import {
  WEBINAR_METADATA,
  INITIAL_WEBINAR_AGENDA,
  INITIAL_WEBINAR_SLIDES,
  INITIAL_SPEAKER_NOTES,
  INITIAL_WEBINAR_QUIZ,
  WebinarSlide,
  WebinarAgendaItem,
  WebinarQuizItem
} from '../../data/webinarData';
import {
  Presentation,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  FileText,
  HelpCircle,
  Download,
  Copy,
  Printer,
  Edit3,
  CheckCircle2,
  Users,
  Compass,
  Star,
  Award,
  Video,
  ListOrdered
} from 'lucide-react';
import { AiFunctionResponse } from '../../types/ba';

export const WebinarStudioView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'agenda' | 'slides' | 'notes' | 'demo' | 'quiz' | 'handout'>('agenda');
  const [agenda, setAgenda] = useState<WebinarAgendaItem[]>(INITIAL_WEBINAR_AGENDA);
  const [slides, setSlides] = useState<WebinarSlide[]>(INITIAL_WEBINAR_SLIDES);
  const [selectedSlide, setSelectedSlide] = useState<WebinarSlide>(INITIAL_WEBINAR_SLIDES[0]);
  const [quizItems, setQuizItems] = useState<WebinarQuizItem[]>(INITIAL_WEBINAR_QUIZ);
  const [studentVotes, setStudentVotes] = useState<Record<string, number>>({});

  // Live Stopwatch / Timer for webinar rehearsal
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // AI Function execution
  const [aiRunning, setAiRunning] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<AiFunctionResponse | null>(null);

  // Timer effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleToggleAgendaItem = (id: string) => {
    setAgenda(prev => prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  };

  const handleVotePoll = (quizId: string, optIndex: number) => {
    setStudentVotes(prev => ({ ...prev, [quizId]: optIndex }));
  };

  const runWebinarAiPlanner = async () => {
    setAiRunning(true);
    setAiResult(null);

    try {
      const res = await fetch('/api/ai/execute-function', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          functionName: 'prepare_webinar_assets',
          parameters: {
            topic: 'Breaking into Business Analysis & Internships',
            duration: 60
          },
          userPrompt: 'Prepare an updated timed agenda and slide deck outline with live demo plan for BA Studio.'
        })
      });
      const data: AiFunctionResponse = await res.json();
      setAiResult(data);
    } catch (err) {
      console.error('Failed to run webinar AI planner:', err);
    } finally {
      setAiRunning(false);
    }
  };

  const copyHandoutToClipboard = () => {
    const text = `# The Aspiring Business Analyst Starter Toolkit
## Free Webinar Handout: From Classroom to Your First BA Internship

### 1. The Six Core IIBA Knowledge Areas
- **BAPM (Planning & Monitoring):** Who to talk to, how work is scoped, governance rules.
- **E&C (Elicitation & Collaboration):** Conducting interviews, workshops, and active listening.
- **RLCM (Life Cycle Management):** Prioritizing user stories (MoSCoW) and managing change.
- **SA (Strategy Analysis):** Current As-Is vs Desired To-Be gap analysis.
- **RADD (Analysis & Design):** Writing Given-When-Then criteria, BPMN swimlanes, and wireframes.
- **SE (Solution Evaluation):** Analyzing post-launch KPIs and metrics.

### 2. The 5 Golden Rules to Turn an Internship into a Full-Time Offer
1. **Never bring just a problem:** Bring 2 feasible options and your recommendation.
2. **Master the DONA meeting follow-up within 2 hours:** Decisions, Open Questions, Next Actions, Assignees.
3. **Anchor your opinions in data:** Numbers from logs or transcripts prevent emotional debate.
4. **Bundle your questions:** Keep a running list for 1-on-1s rather than sending 15 ad-hoc pings.
5. **Partner with QA & Developers early:** Ask how you can structure user stories to make their testing easier.

### 3. Gherkin User Story Cheat Sheet
\`\`\`gherkin
As a [user role],
I want to [action],
So that [business outcome].

Scenario: [Feature behavior]
  Given [precondition]
  When [action executed]
  Then [observable measurable result]
\`\`\`
`;
    navigator.clipboard.writeText(text);
    alert('Webinar Student Handout copied to clipboard!');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold mb-2">
            <Presentation className="w-3.5 h-3.5 text-teal-400" />
            <span>Webinar & Workshop Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Webinar Studio: Beginner BA Masterclass
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Timed agenda, editable slide deck, speaker talking notes, live software demo plan, and printable student handouts.
          </p>
        </div>

        {/* Live Rehearsal Stopwatch */}
        <div className="flex items-center space-x-3 bg-slate-900 border border-slate-800 p-2.5 rounded-2xl shadow-lg">
          <div className="flex items-center space-x-2 pl-2">
            <Clock className="w-4 h-4 text-teal-400" />
            <span className="font-mono text-lg font-black text-slate-100 tracking-wider">
              {formatTimer(timerSeconds)}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">/ 60:00</span>
          </div>

          <div className="flex items-center space-x-1 pl-2 border-l border-slate-800">
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className={`p-1.5 rounded-lg text-white transition ${
                isTimerRunning ? 'bg-amber-600 hover:bg-amber-500' : 'bg-teal-600 hover:bg-teal-500'
              }`}
              title={isTimerRunning ? 'Pause Rehearsal' : 'Start Rehearsal Timer'}
            >
              {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            <button
              onClick={() => {
                setIsTimerRunning(false);
                setTimerSeconds(0);
              }}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* AI Webinar Planner Trigger Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2">
          <span className="font-mono text-teal-300 font-bold px-2 py-0.5 rounded bg-teal-500/10 border border-teal-500/30">
            Session: 60-Minute Virtual Presentation
          </span>
          <span className="text-slate-400 hidden sm:inline">
            Topic: Breaking Into Business Analysis & Internship Success
          </span>
        </div>

        <button
          onClick={runWebinarAiPlanner}
          disabled={aiRunning}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 disabled:opacity-40 text-white rounded-lg font-semibold shadow-md transition"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{aiRunning ? 'Generating Assets...' : 'Run `prepare_webinar_assets`'}</span>
        </button>
      </div>

      {/* AI Function Result Display */}
      {aiResult && (
        <div className="p-4 rounded-xl bg-slate-950 border border-teal-500/50 space-y-3 text-xs animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-mono text-teal-300 font-bold">
              Function Executed: {aiResult.functionUsed} ({aiResult.executionTimeMs}ms)
            </span>
            <span className="text-slate-400">Target Duration: 60 Minutes</span>
          </div>

          <pre className="font-mono text-[11px] text-teal-200 bg-black/40 p-2.5 rounded max-h-48 overflow-y-auto">
            {JSON.stringify(aiResult.result, null, 2)}
          </pre>

          {aiResult.assumptions.length > 0 && (
            <div className="text-blue-200 space-y-1">
              <span className="font-semibold text-blue-300">Explicit Assumptions:</span>
              <ul className="list-disc list-inside text-slate-300">
                {aiResult.assumptions.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Sub-Tabs Navigation */}
      <div className="flex border-b border-slate-800 space-x-2 overflow-x-auto pb-1 text-sm">
        <button
          onClick={() => setActiveTab('agenda')}
          className={`flex items-center space-x-2 px-4 py-2 font-medium rounded-t-lg transition border-b-2 whitespace-nowrap ${
            activeTab === 'agenda' ? 'border-teal-400 text-teal-300 bg-slate-800/40' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Timed Agenda (60 Min)</span>
        </button>

        <button
          onClick={() => setActiveTab('slides')}
          className={`flex items-center space-x-2 px-4 py-2 font-medium rounded-t-lg transition border-b-2 whitespace-nowrap ${
            activeTab === 'slides' ? 'border-teal-400 text-teal-300 bg-slate-800/40' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Presentation className="w-4 h-4" />
          <span>Slide Deck Outline</span>
        </button>

        <button
          onClick={() => setActiveTab('notes')}
          className={`flex items-center space-x-2 px-4 py-2 font-medium rounded-t-lg transition border-b-2 whitespace-nowrap ${
            activeTab === 'notes' ? 'border-teal-400 text-teal-300 bg-slate-800/40' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Speaker Talking Notes</span>
        </button>

        <button
          onClick={() => setActiveTab('demo')}
          className={`flex items-center space-x-2 px-4 py-2 font-medium rounded-t-lg transition border-b-2 whitespace-nowrap ${
            activeTab === 'demo' ? 'border-teal-400 text-teal-300 bg-slate-800/40' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Live Demo Script</span>
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex items-center space-x-2 px-4 py-2 font-medium rounded-t-lg transition border-b-2 whitespace-nowrap ${
            activeTab === 'quiz' ? 'border-teal-400 text-teal-300 bg-slate-800/40' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Interactive Poll Quiz</span>
        </button>

        <button
          onClick={() => setActiveTab('handout')}
          className={`flex items-center space-x-2 px-4 py-2 font-medium rounded-t-lg transition border-b-2 whitespace-nowrap ${
            activeTab === 'handout' ? 'border-teal-400 text-teal-300 bg-slate-800/40' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Download className="w-4 h-4" />
          <span>Student Handout & Toolkit</span>
        </button>
      </div>

      {/* 1. TIMED AGENDA */}
      {activeTab === 'agenda' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Click any session item to toggle its completed checkmark during your live delivery.</span>
            <span>Estimated Total: 60 Minutes</span>
          </div>

          <div className="space-y-3">
            {agenda.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => handleToggleAgendaItem(item.id)}
                className={`p-4 rounded-xl border cursor-pointer transition flex items-start justify-between gap-4 ${
                  item.completed
                    ? 'bg-slate-950/40 border-slate-800 text-slate-500'
                    : 'bg-slate-900/90 border-slate-800 hover:bg-slate-850 hover:border-slate-700 text-slate-200'
                }`}
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-teal-400 px-2 py-0.5 rounded bg-teal-500/10 border border-teal-500/30">
                      {item.timeRange}
                    </span>
                    <h4 className={`font-bold text-sm ${item.completed ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                      {item.title}
                    </h4>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    <strong>Objective:</strong> {item.objective}
                  </p>

                  <div className="text-[11px] text-amber-300/90 bg-amber-950/20 px-2.5 py-1 rounded border border-amber-500/20 inline-block">
                    <strong>Presenter Cue:</strong> {item.tips}
                  </div>
                </div>

                <div className="pt-1">
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    item.completed ? 'bg-emerald-500 border-emerald-400 text-white' : 'border-slate-700'
                  }`}>
                    {item.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. SLIDE DECK OUTLINE */}
      {activeTab === 'slides' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Slide List */}
          <div className="lg:col-span-4 space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1 mb-2">
              Presentation Slides ({slides.length})
            </h3>
            {slides.map((s) => {
              const isSelected = selectedSlide.id === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedSlide(s)}
                  className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-slate-800 border-teal-500 text-teal-300 shadow-md'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-850'
                  }`}
                >
                  <div className="truncate">
                    <span className="font-mono text-[10px] text-slate-500 block">Slide {s.slideNumber}</span>
                    <span className="font-semibold text-xs text-slate-200">{s.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono ml-2 shrink-0">{s.durationEstimate}</span>
                </button>
              );
            })}
          </div>

          {/* Slide Details Preview */}
          <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-teal-400">
                  Slide {selectedSlide.slideNumber} of {slides.length} ({selectedSlide.durationEstimate})
                </span>
                <h3 className="text-lg font-bold text-slate-100 mt-1">{selectedSlide.title}</h3>
              </div>
            </div>

            <div className="p-3 bg-teal-950/20 border border-teal-500/20 rounded-xl text-xs space-y-1">
              <span className="font-semibold text-teal-300">Audience Key Takeaway:</span>
              <p className="text-slate-300">{selectedSlide.keyTakeaway}</p>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1.5">
              <span className="font-semibold text-slate-300">Recommended Visual Concept:</span>
              <p className="text-slate-400 leading-relaxed">{selectedSlide.visualConcept}</p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Slide Bullet Points:</h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {selectedSlide.bullets.map((b, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-teal-400 font-bold">•</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 3. SPEAKER TALKING NOTES */}
      {activeTab === 'notes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Word-for-word scripts and conversational talking points for seamless delivery.</span>
            <button
              onClick={() => {
                const allNotes = INITIAL_SPEAKER_NOTES.map(n => `Slide ${n.slideNumber} Notes:\n${n.script}\n`).join('\n---\n\n');
                navigator.clipboard.writeText(allNotes);
                alert('All Speaker Notes copied to clipboard!');
              }}
              className="text-teal-400 hover:text-teal-300 font-semibold"
            >
              Copy All Notes
            </button>
          </div>

          <div className="space-y-4">
            {INITIAL_SPEAKER_NOTES.map((note) => (
              <div key={note.slideNumber} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-mono font-bold text-teal-400">Slide {note.slideNumber} Speaking Script</span>
                </div>
                <p className="text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">
                  "{note.script}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. LIVE DEMO PLAN */}
      {activeTab === 'demo' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-xs font-mono font-bold text-teal-400 uppercase">
              15-Minute Live Software Walkthrough
            </span>
            <h3 className="text-base font-bold text-slate-100 mt-1">
              Live Demo Script: Analyzing Apex College in BA Studio
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Follow this step-by-step roadmap to captivate attendees by demonstrating real data profiling and process mapping on screen.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2">
              <div className="font-bold text-teal-300 flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center font-mono text-[11px]">1</span>
                <span>Minute 0:00 - 3:00 &bull; Open the Data Lab</span>
              </div>
              <p className="text-slate-300 pl-7 leading-relaxed">
                Click on the <strong>Data Lab</strong> tab. Click <em>"Load Requests (150 Rows)"</em>. Explain to students: "Notice that we didn't just guess that registration was broken; we have 150 real audit rows."
              </p>
            </div>

            <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2">
              <div className="font-bold text-cyan-300 flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-mono text-[11px]">2</span>
                <span>Minute 3:00 - 7:00 &bull; Spotlight the 18% Financial Hold Bottleneck</span>
              </div>
              <p className="text-slate-300 pl-7 leading-relaxed">
                Point out the KPI card: <strong>18% Rejections</strong> and <strong>28 Financial Holds</strong>. Explain: "As a BA, this is your smoking gun. Students aren't dropping out because they changed their mind; they hit a surprise balance hold at 09:00 AM."
              </p>
            </div>

            <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2">
              <div className="font-bold text-teal-300 flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center font-mono text-[11px]">3</span>
                <span>Minute 7:00 - 11:00 &bull; Process Mapping: As-Is vs To-Be</span>
              </div>
              <p className="text-slate-300 pl-7 leading-relaxed">
                Switch to <strong>Project Studio &gt; Milestone 4 (Process Mapping)</strong>. Show the comparison metric: <strong>4.8 business days</strong> down to <strong>2.4 minutes</strong>. Explain how automated pre-registration hold scans eliminate the paper slip walk-around.
              </p>
            </div>

            <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2">
              <div className="font-bold text-amber-300 flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-mono text-[11px]">4</span>
                <span>Minute 11:00 - 15:00 &bull; UAT Acceptance & Dossier Export</span>
              </div>
              <p className="text-slate-300 pl-7 leading-relaxed">
                Navigate to <strong>Milestone 8 (UAT Test Cases)</strong>. Toggle a test case from 'Pending' to 'Passed'. Click <em>"Export Full Dossier"</em> to show attendees how they can leave with an entire capstone portfolio for their job search.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 5. INTERACTIVE LIVE POLL QUIZ */}
      {activeTab === 'quiz' && (
        <div className="space-y-6">
          <div className="text-xs text-slate-400">
            Interactive polling simulator for webinar attendees with aggregate vote results and discussion prompts.
          </div>

          <div className="space-y-6">
            {quizItems.map((q, qIdx) => {
              const userVoted = studentVotes[q.id];
              const totalVotes = q.pollVoteCount.reduce((a, b) => a + b, 0);

              return (
                <div key={q.id} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-mono font-bold text-teal-400">Live Poll Question #{qIdx + 1}</span>
                    <span className="text-slate-500">{totalVotes} Audience Responses</span>
                  </div>

                  <h4 className="font-bold text-slate-100 text-sm leading-relaxed">{q.question}</h4>

                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isUserChoice = userVoted === optIdx;
                      const count = q.pollVoteCount[optIdx] || 0;
                      const pct = Math.round((count / totalVotes) * 100);

                      return (
                        <div key={optIdx} className="space-y-1">
                          <button
                            onClick={() => handleVotePoll(q.id, optIdx)}
                            className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between ${
                              isUserChoice
                                ? 'bg-teal-950 border-teal-500 text-teal-200'
                                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-850'
                            }`}
                          >
                            <span>{opt}</span>
                            {userVoted !== undefined && (
                              <span className="font-mono text-[11px] text-teal-400 font-bold ml-2">
                                {pct}% ({count})
                              </span>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {userVoted !== undefined && (
                    <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-xl space-y-1">
                      <div className="font-bold text-emerald-300">Explanation & Facilitator Commentary:</div>
                      <p className="text-slate-300 leading-relaxed">{q.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. STUDENT HANDOUT & TOOLKIT */}
      {activeTab === 'handout' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-xs font-mono font-bold text-teal-400 uppercase">
                Downloadable Cheat Sheet & Toolkit
              </span>
              <h3 className="text-base font-bold text-slate-100 mt-1">
                The Aspiring Business Analyst Starter Toolkit
              </h3>
            </div>

            <button
              onClick={copyHandoutToClipboard}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold shadow-md transition"
            >
              Copy Handout (Markdown)
            </button>
          </div>

          <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 font-sans leading-relaxed space-y-5">
            <div>
              <h4 className="font-bold text-teal-300 uppercase tracking-wider mb-2">
                1. The 6 IIBA BABOK Knowledge Areas at a Glance
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-400">
                <div>&bull; <strong>BAPM:</strong> Scoping stakeholders, governance, and planning approach.</div>
                <div>&bull; <strong>E&C:</strong> Interviews, workshops, and clarifying requirements.</div>
                <div>&bull; <strong>RLCM:</strong> MoSCoW prioritization and managing change requests.</div>
                <div>&bull; <strong>SA:</strong> Current As-Is vs Desired To-Be gap analysis.</div>
                <div>&bull; <strong>RADD:</strong> Modeling user stories, Gherkin criteria, and BPMN.</div>
                <div>&bull; <strong>SE:</strong> Measuring actual post-launch KPIs and business value.</div>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-4">
              <h4 className="font-bold text-cyan-300 uppercase tracking-wider mb-2">
                2. The DONA Meeting Protocol (Send Within 2 Hours of Any Session)
              </h4>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-[11px] font-mono text-teal-200/90 space-y-1">
                <div><strong>D - Decisions:</strong> What was definitively approved?</div>
                <div><strong>O - Open Questions:</strong> What policy/technical questions remain unanswered?</div>
                <div><strong>N - Next Actions:</strong> What tasks need to be completed before next sprint?</div>
                <div><strong>A - Assignees:</strong> Who owns each task and by what exact date?</div>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-4">
              <h4 className="font-bold text-amber-300 uppercase tracking-wider mb-2">
                3. The INVEST Checklist for User Stories
              </h4>
              <p className="text-slate-400 text-[11px]">
                <strong>Independent</strong> (can be built on its own), <strong>Negotiable</strong> (leaves room for developer discussion), <strong>Valuable</strong> (has a clear "so that" outcome), <strong>Estimable</strong> (developers understand scope), <strong>Small</strong> (fits in one sprint), <strong>Testable</strong> (has concrete Given-When-Then criteria).
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
