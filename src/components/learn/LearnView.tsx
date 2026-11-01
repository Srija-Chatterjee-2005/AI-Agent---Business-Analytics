import React, { useState } from 'react';
import {
  IIBA_KNOWLEDGE_AREAS,
  BA_DELIVERABLES,
  INTERN_VS_EMPLOYEE,
  DAY_IN_THE_LIFE_SCHEDULE,
  LEARN_QUIZZES
} from '../../data/learnContent';
import {
  BookOpen,
  Layers,
  Award,
  Clock,
  CheckCircle,
  HelpCircle,
  ChevronRight,
  ExternalLink,
  Sparkles,
  FileText,
  UserCheck,
  Briefcase,
  AlertCircle,
  ArrowRight,
  Compass,
  Star
} from 'lucide-react';
import { KnowledgeArea, BaDeliverable } from '../../types/ba';

export const LearnView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'areas' | 'deliverables' | 'intern' | 'schedule' | 'quiz'>('areas');
  const [selectedArea, setSelectedArea] = useState<KnowledgeArea>(IIBA_KNOWLEDGE_AREAS[0]);
  const [selectedDeliverable, setSelectedDeliverable] = useState<BaDeliverable>(BA_DELIVERABLES[0]);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({});

  const handleSelectQuizOption = (questionId: string, optionIndex: number) => {
    if (quizSubmitted[questionId]) return;
    setQuizAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleCheckQuizAnswer = (questionId: string) => {
    setQuizSubmitted(prev => ({ ...prev, [questionId]: true }));
  };

  const handleResetQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted({});
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-[#0f172a] to-teal-950/60 border border-slate-800 p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold">
            <Compass className="w-3.5 h-3.5 text-teal-400" />
            <span>Master the Business Analyst Craft</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            The Business Analyst Learning Center
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            The Business Analyst is the vital bridge between human business problems and software engineering solutions. Explore the IIBA BABOK knowledge framework, explore essential deliverables, discover how internships differ from employee roles, and test your knowledge.
          </p>
        </div>

        {/* Decorative background grid elements */}
        <div className="absolute right-0 top-0 w-96 h-full bg-gradient-to-l from-teal-500/10 to-transparent pointer-events-none" />
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex border-b border-slate-800 space-x-1 sm:space-x-2 overflow-x-auto pb-1 text-sm">
        <button
          onClick={() => setActiveSubTab('areas')}
          className={`flex items-center space-x-2 px-4 py-2.5 font-medium rounded-t-lg transition border-b-2 whitespace-nowrap ${
            activeSubTab === 'areas'
              ? 'border-teal-400 text-teal-300 bg-slate-800/40'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/20'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>6 IIBA Knowledge Areas</span>
        </button>

        <button
          onClick={() => setActiveSubTab('deliverables')}
          className={`flex items-center space-x-2 px-4 py-2.5 font-medium rounded-t-lg transition border-b-2 whitespace-nowrap ${
            activeSubTab === 'deliverables'
              ? 'border-teal-400 text-teal-300 bg-slate-800/40'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/20'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Tools & Deliverables Catalog</span>
        </button>

        <button
          onClick={() => setActiveSubTab('intern')}
          className={`flex items-center space-x-2 px-4 py-2.5 font-medium rounded-t-lg transition border-b-2 whitespace-nowrap ${
            activeSubTab === 'intern'
              ? 'border-teal-400 text-teal-300 bg-slate-800/40'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/20'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Intern vs. Employee Matrix</span>
        </button>

        <button
          onClick={() => setActiveSubTab('schedule')}
          className={`flex items-center space-x-2 px-4 py-2.5 font-medium rounded-t-lg transition border-b-2 whitespace-nowrap ${
            activeSubTab === 'schedule'
              ? 'border-teal-400 text-teal-300 bg-slate-800/40'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/20'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Day-in-the-Life Schedule</span>
        </button>

        <button
          onClick={() => setActiveSubTab('quiz')}
          className={`flex items-center space-x-2 px-4 py-2.5 font-medium rounded-t-lg transition border-b-2 whitespace-nowrap ${
            activeSubTab === 'quiz'
              ? 'border-teal-400 text-teal-300 bg-slate-800/40'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/20'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Interactive Quizzes</span>
        </button>
      </div>

      {/* 1. IIBA KNOWLEDGE AREAS */}
      {activeSubTab === 'areas' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {IIBA_KNOWLEDGE_AREAS.map((area) => {
              const isSelected = selectedArea.id === area.id;
              return (
                <div
                  key={area.id}
                  onClick={() => setSelectedArea(area)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-800/90 border-teal-500/60 shadow-lg shadow-teal-900/20 ring-1 ring-teal-500/30'
                      : 'bg-slate-900/70 border-slate-800 hover:bg-slate-850 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                      {area.acronym}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {area.babokChapter}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-100 text-sm mb-1.5">{area.name}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {area.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Deep Dive Details Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    {selectedArea.acronym}
                  </span>
                  <span className="text-xs text-slate-400">{selectedArea.babokChapter}</span>
                </div>
                <h2 className="text-xl font-bold text-slate-100">{selectedArea.name}</h2>
              </div>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed">
              {selectedArea.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Key Tasks & Responsibilities */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-3">
                <h4 className="text-xs font-bold text-teal-300 uppercase tracking-wider flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-teal-400" />
                  <span>Key Analyst Responsibilities</span>
                </h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  {selectedArea.keyResponsibilities.map((resp, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="text-teal-400 mt-0.5">•</span>
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Key Deliverables */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-3">
                <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span>Key Deliverables Produced</span>
                </h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  {selectedArea.keyDeliverables.map((deliv, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="text-cyan-400 mt-0.5">•</span>
                      <span>{deliv}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Real World Scenario */}
            <div className="p-4 rounded-xl bg-teal-950/20 border border-teal-500/30 text-xs space-y-1.5">
              <span className="font-semibold text-teal-300 flex items-center space-x-1.5">
                <Compass className="w-3.5 h-3.5 text-teal-400" />
                <span>Real-World College Registration Scenario:</span>
              </span>
              <p className="text-slate-300 leading-relaxed">
                {selectedArea.realWorldScenario}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. DELIVERABLES CATALOG */}
      {activeSubTab === 'deliverables' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List Sidebar */}
          <div className="space-y-2 lg:col-span-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">
              Essential BA Artifacts ({BA_DELIVERABLES.length})
            </h3>
            {BA_DELIVERABLES.map((deliv) => {
              const isSelected = selectedDeliverable.id === deliv.id;
              return (
                <button
                  key={deliv.id}
                  onClick={() => setSelectedDeliverable(deliv)}
                  className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-slate-800 border-teal-500/60 text-teal-300 shadow-md'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-xs text-slate-200">{deliv.title}</div>
                    <div className="text-[10px] text-slate-400">{deliv.category}</div>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-teal-400' : 'text-slate-600'}`} />
                </button>
              );
            })}
          </div>

          {/* Deliverable Deep Dive */}
          <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <span className="text-[11px] font-semibold text-teal-400 uppercase tracking-wider">
                  {selectedDeliverable.category}
                </span>
                <h2 className="text-lg font-bold text-slate-100">{selectedDeliverable.title}</h2>
              </div>
              <div className="flex items-center space-x-1">
                {selectedDeliverable.tooling.map((tool, i) => (
                  <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate-300">Core Purpose:</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{selectedDeliverable.purpose}</p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate-300">When to Create This Artifact:</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{selectedDeliverable.whenToUse}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2 text-xs">
                <span className="font-semibold text-teal-300 flex items-center space-x-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-teal-400" />
                  <span>Must-Include Sections</span>
                </span>
                <ul className="space-y-1 text-slate-300">
                  {selectedDeliverable.keySections.map((sec, i) => (
                    <li key={i} className="flex items-center space-x-1.5">
                      <span className="text-teal-400">•</span>
                      <span>{sec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2 text-xs">
                <span className="font-semibold text-amber-300 flex items-center space-x-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Common Traps to Avoid</span>
                </span>
                <ul className="space-y-1 text-slate-300">
                  {selectedDeliverable.commonMistakes.map((mistake, i) => (
                    <li key={i} className="flex items-start space-x-1.5">
                      <span className="text-amber-400 mt-0.5">•</span>
                      <span>{mistake}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Realistic Sample Preview */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                <FileText className="w-3.5 h-3.5 text-teal-400" />
                <span>Realistic Artifact Sample:</span>
              </span>
              <pre className="text-[11px] font-mono text-teal-200/90 bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-x-auto whitespace-pre-wrap">
                {selectedDeliverable.samplePreview}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* 3. INTERN VS EMPLOYEE MATRIX */}
      {activeSubTab === 'intern' && (
        <div className="space-y-8">
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 text-sm leading-relaxed text-slate-300">
            <h3 className="font-bold text-slate-100 text-base mb-1.5 flex items-center space-x-2">
              <Briefcase className="w-5 h-5 text-teal-400" />
              <span>Demystifying the Transition: From Intern to Full-Time BA</span>
            </h3>
            <p>{INTERN_VS_EMPLOYEE.overview}</p>
          </div>

          {/* Comparison Cards */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Core Operational Differences
            </h4>
            <div className="grid grid-cols-1 gap-4">
              {INTERN_VS_EMPLOYEE.comparisonDimensions.map((dim, i) => (
                <div key={i} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h3 className="font-bold text-slate-100 text-sm sm:text-base">{dim.dimension}</h3>
                    <span className="text-[11px] font-medium text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                      Dimension {i + 1}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                      <div className="font-semibold text-cyan-300 flex items-center space-x-1.5">
                        <UserCheck className="w-4 h-4 text-cyan-400" />
                        <span>The BA Intern Experience</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">{dim.intern}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950/60 border border-teal-900/40 space-y-1.5">
                      <div className="font-semibold text-teal-300 flex items-center space-x-1.5">
                        <Award className="w-4 h-4 text-teal-400" />
                        <span>Full-Time Employee Expectations</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">{dim.employee}</p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-teal-950/20 border border-teal-500/20 text-xs text-teal-200">
                    <span className="font-semibold text-teal-300">Key Takeaway: </span>
                    {dim.keyTakeaway}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5 Golden Rules Playbook */}
          <div className="space-y-4 pt-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-2">
              <Star className="w-4 h-4 text-amber-400" />
              <span>The 5 Golden Rules: How to Secure a Full-Time Return Offer</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {INTERN_VS_EMPLOYEE.goldenRules.map((rule) => (
                <div key={rule.ruleNumber} className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs flex items-center justify-center border border-amber-500/30">
                      {rule.ruleNumber}
                    </span>
                    <h5 className="font-bold text-slate-200 text-xs">{rule.title}</h5>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed pl-8">
                    {rule.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. DAY IN THE LIFE SCHEDULE */}
      {activeSubTab === 'schedule' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 text-sm leading-relaxed text-slate-300">
            <h3 className="font-bold text-slate-100 text-base mb-1 flex items-center space-x-2">
              <Clock className="w-5 h-5 text-teal-400" />
              <span>A Day in the Life of a Business Analyst</span>
            </h3>
            <p>
              Experience a realistic Monday schedule on the Apex College modernization project. From morning Agile standups to afternoon data profiling in SQL and sprint refinement with engineers.
            </p>
          </div>

          <div className="relative pl-6 border-l-2 border-slate-800 space-y-6">
            {DAY_IN_THE_LIFE_SCHEDULE.map((item, idx) => (
              <div key={idx} className="relative group">
                {/* Timeline node */}
                <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-teal-500 border-4 border-[#0b1120] group-hover:scale-125 transition-transform" />

                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-lg space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-teal-400 px-2 py-0.5 rounded bg-teal-500/10 border border-teal-500/30">
                        {item.time}
                      </span>
                      <h4 className="font-bold text-slate-100 text-sm">{item.title}</h4>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">Duration: {item.duration}</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.activity}
                  </p>

                  <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs space-y-1">
                    <div className="font-semibold text-teal-300">What You Do as the Analyst:</div>
                    <p className="text-slate-400">{item.baRole}</p>
                  </div>

                  <div className="text-[11px] text-amber-300/90 bg-amber-950/20 px-3 py-1.5 rounded border border-amber-500/20 flex items-center space-x-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span><strong>Pro Tip:</strong> {item.keyTip}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. INTERACTIVE QUIZZES */}
      {activeSubTab === 'quiz' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-slate-100 text-base">Knowledge Check Quizzes</h3>
              <p className="text-xs text-slate-400">Test your understanding of IIBA concepts, Agile requirements, and professional BA behavior.</p>
            </div>
            <button
              onClick={handleResetQuiz}
              className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition"
            >
              Reset All
            </button>
          </div>

          <div className="space-y-6">
            {LEARN_QUIZZES.map((quiz, qIdx) => {
              const selectedOpt = quizAnswers[quiz.id];
              const isSubmitted = quizSubmitted[quiz.id];
              const isCorrect = selectedOpt === quiz.correctIndex;

              return (
                <div key={quiz.id} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-bold text-slate-100 text-sm leading-relaxed">
                      <span className="text-teal-400 font-mono mr-2">Q{qIdx + 1}.</span>
                      {quiz.question}
                    </h4>
                  </div>

                  {/* Options */}
                  <div className="space-y-2">
                    {quiz.options.map((opt, optIdx) => {
                      const isOptionSelected = selectedOpt === optIdx;
                      let optionClasses = 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700';

                      if (isOptionSelected) {
                        optionClasses = 'bg-teal-950/40 border-teal-500 text-teal-200';
                      }

                      if (isSubmitted) {
                        if (optIdx === quiz.correctIndex) {
                          optionClasses = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-medium';
                        } else if (isOptionSelected && !isCorrect) {
                          optionClasses = 'bg-red-950/60 border-red-500 text-red-200';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={isSubmitted}
                          onClick={() => handleSelectQuizOption(quiz.id, optIdx)}
                          className={`w-full text-left p-3 rounded-xl border text-xs transition flex items-center justify-between ${optionClasses}`}
                        >
                          <span>{opt}</span>
                          {isSubmitted && optIdx === quiz.correctIndex && (
                            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Submit / Feedback Row */}
                  <div className="flex items-center justify-between pt-2">
                    {!isSubmitted ? (
                      <button
                        disabled={selectedOpt === undefined}
                        onClick={() => handleCheckQuizAnswer(quiz.id)}
                        className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white text-xs font-semibold transition"
                      >
                        Check Answer
                      </button>
                    ) : (
                      <div className={`p-3 rounded-xl border text-xs w-full space-y-1 ${
                        isCorrect ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200' : 'bg-red-950/30 border-red-500/40 text-red-200'
                      }`}>
                        <div className="font-bold flex items-center space-x-1.5">
                          {isCorrect ? '✓ Correct!' : '✗ Not quite right'}
                        </div>
                        <p className="text-slate-300 leading-relaxed">{quiz.explanation}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
