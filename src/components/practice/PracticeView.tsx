import React, { useState, useEffect } from 'react';
import { PRACTICE_TASKS } from '../../data/practiceTasks';
import { PracticeTask, RubricEvaluation } from '../../types/ba';
import {
  CheckCircle2,
  HelpCircle,
  Sparkles,
  BookOpen,
  Award,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  FileCheck,
  Eye,
  Send,
  AlertCircle,
  Lightbulb,
  Clock,
  Check
} from 'lucide-react';

export const PracticeView: React.FC = () => {
  const [selectedTask, setSelectedTask] = useState<PracticeTask>(PRACTICE_TASKS[0]);
  const [studentText, setStudentText] = useState<string>('');
  const [showHints, setShowHints] = useState<boolean>(false);
  const [showModelAnswer, setShowModelAnswer] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<RubricEvaluation | null>(null);
  const [loadingEvaluation, setLoadingEvaluation] = useState<boolean>(false);
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});

  // Load saved student text for current task from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`ba_task_${selectedTask.id}`);
    if (saved) {
      setStudentText(saved);
    } else {
      setStudentText(selectedTask.starterTemplate);
    }

    const savedEval = localStorage.getItem(`ba_task_eval_${selectedTask.id}`);
    if (savedEval) {
      try {
        setEvaluation(JSON.parse(savedEval));
      } catch (e) {
        setEvaluation(null);
      }
    } else {
      setEvaluation(null);
    }

    setShowModelAnswer(false);
    setShowHints(false);
  }, [selectedTask.id]);

  // Persist text on change
  const handleTextChange = (val: string) => {
    setStudentText(val);
    localStorage.setItem(`ba_task_${selectedTask.id}`, val);
  };

  const handleResetTemplate = () => {
    setStudentText(selectedTask.starterTemplate);
    localStorage.setItem(`ba_task_${selectedTask.id}`, selectedTask.starterTemplate);
  };

  const handleRunEvaluation = async () => {
    if (!studentText.trim()) return;
    setLoadingEvaluation(true);

    try {
      const response = await fetch('/api/ai/execute-function', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          functionName: 'review_practice_submission',
          parameters: {
            taskTitle: selectedTask.title,
            submissionText: studentText,
            rubric: selectedTask.rubric
          },
          userPrompt: `Evaluate this student submission against the 4-tier rubric for "${selectedTask.title}". Provide specific numeric scores and constructive improvements.`
        })
      });

      const data = await response.json();
      if (data.success && data.result) {
        setEvaluation(data.result);
        localStorage.setItem(`ba_task_eval_${selectedTask.id}`, JSON.stringify(data.result));
        if (data.result.totalScore >= 70) {
          setCompletedTasks(prev => ({ ...prev, [selectedTask.id]: true }));
        }
      }
    } catch (err) {
      console.error('Failed to run rubric evaluation:', err);
    } finally {
      setLoadingEvaluation(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold mb-2">
            <Award className="w-3.5 h-3.5 text-teal-400" />
            <span>Interactive BA Practice Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Realistic Business Analyst Challenges
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Write real deliverables, test edge cases, and get immediate automated rubric feedback scored by our BA evaluation engine.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-mono">
            Tasks Completed: {Object.keys(completedTasks).length} / {PRACTICE_TASKS.length}
          </div>
        </div>
      </div>

      {/* Task Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {PRACTICE_TASKS.map((task, idx) => {
          const isSelected = selectedTask.id === task.id;
          const isDone = completedTasks[task.id];

          return (
            <button
              key={task.id}
              onClick={() => setSelectedTask(task)}
              className={`p-4 rounded-xl border text-left transition flex flex-col justify-between space-y-2 ${
                isSelected
                  ? 'bg-slate-800/90 border-teal-500 text-teal-300 shadow-lg shadow-teal-950/30 ring-1 ring-teal-500/40'
                  : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <span className="font-mono text-slate-400 font-semibold">Task {idx + 1}</span>
                  <div className="flex items-center space-x-1.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                      task.difficulty === 'Beginner' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                      task.difficulty === 'Intermediate' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' :
                      'bg-purple-950 text-purple-300 border border-purple-800'
                    }`}>
                      {task.difficulty}
                    </span>
                    {isDone && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                </div>
                <h4 className="font-bold text-xs text-slate-100 line-clamp-2 leading-snug">
                  {task.title}
                </h4>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
                <span>{task.category}</span>
                <span className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{task.estimatedTimeMin} min</span>
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Scenario & Instructions */}
        <div className="lg:col-span-5 space-y-5">
          {/* Scenario Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono font-semibold text-teal-400 uppercase tracking-wider">
                {selectedTask.category}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Est: {selectedTask.estimatedTimeMin} mins
              </span>
            </div>

            <h3 className="font-bold text-slate-100 text-base">{selectedTask.title}</h3>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Business Context:</h4>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                {selectedTask.scenario}
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800">
              <h4 className="text-xs font-bold text-teal-300 uppercase tracking-wider flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                <span>Deliverable Instructions:</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {selectedTask.instructions.map((inst, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-teal-400 font-bold">•</span>
                    <span>{inst}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Rubric Criteria Summary */}
            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 space-y-2 text-xs">
              <span className="font-semibold text-slate-200 flex items-center space-x-1.5">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Evaluation Rubric (100 pts):</span>
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                <div><strong className="text-slate-300">Clarity (25%):</strong> Unambiguous phrasing</div>
                <div><strong className="text-slate-300">Feasibility (25%):</strong> Realistic scope</div>
                <div><strong className="text-slate-300">Completeness (25%):</strong> Edge cases covered</div>
                <div><strong className="text-slate-300">Value (25%):</strong> Business impact</div>
              </div>
            </div>

            {/* Hints Toggle */}
            <div className="border-t border-slate-800 pt-3">
              <button
                onClick={() => setShowHints(!showHints)}
                className="w-full flex items-center justify-between text-xs text-teal-400 hover:text-teal-300 font-medium py-1"
              >
                <span className="flex items-center space-x-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <span>{showHints ? 'Hide Hints' : 'Need a Hint? (Scaffolding)'}</span>
                </span>
                {showHints ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showHints && (
                <div className="mt-2 p-3 bg-amber-950/20 border border-amber-500/20 rounded-xl text-xs text-amber-200/90 space-y-1.5">
                  <div className="font-semibold text-amber-300">Senior BA Hints:</div>
                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                    {selectedTask.hints.map((hint, i) => (
                      <li key={i}>{hint}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Student Work Area & Rubric Feedback */}
        <div className="lg:col-span-7 space-y-5">
          {/* Work Area Editor */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <h3 className="font-bold text-slate-100 text-sm flex items-center space-x-2">
                <FileCheck className="w-4 h-4 text-teal-400" />
                <span>Your Deliverable Workspace</span>
              </h3>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleResetTemplate}
                  className="px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded border border-slate-700/60 transition flex items-center space-x-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset Starter</span>
                </button>

                <button
                  onClick={() => setShowModelAnswer(!showModelAnswer)}
                  className="px-2.5 py-1 text-xs text-teal-300 hover:text-teal-200 bg-teal-950/60 hover:bg-teal-900/60 rounded border border-teal-700/60 transition flex items-center space-x-1"
                >
                  <Eye className="w-3 h-3" />
                  <span>{showModelAnswer ? 'Hide Sample' : 'Model Sample Answer'}</span>
                </button>
              </div>
            </div>

            <textarea
              value={studentText}
              onChange={(e) => handleTextChange(e.target.value)}
              rows={12}
              placeholder="Write your BA deliverable here..."
              className="w-full bg-[#0b1120] text-slate-100 placeholder-slate-500 font-mono text-xs p-4 rounded-xl border border-slate-700 focus:outline-none focus:border-teal-500 leading-relaxed transition"
            />

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Auto-saved in browser session
              </span>

              <button
                onClick={handleRunEvaluation}
                disabled={loadingEvaluation || !studentText.trim()}
                className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 disabled:opacity-40 text-white rounded-xl text-xs font-semibold shadow-lg shadow-teal-900/30 transition active:scale-95"
              >
                {loadingEvaluation ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Scoring Rubric...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Run Rubric Evaluation</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Side-by-Side Model Sample Answer View */}
          {showModelAnswer && (
            <div className="bg-slate-900 border border-teal-500/40 rounded-2xl p-5 shadow-xl space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-xs text-teal-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <Award className="w-4 h-4 text-teal-400" />
                  <span>Industry Model Sample Solution</span>
                </span>
                <span className="text-[10px] text-slate-400">Benchmarked for Enterprise Agile Sprints</span>
              </div>
              <pre className="text-xs font-mono text-teal-200/90 bg-slate-950 p-4 rounded-xl border border-slate-800/80 overflow-x-auto whitespace-pre-wrap">
                {selectedTask.modelAnswer}
              </pre>
            </div>
          )}

          {/* Automated Rubric Evaluation Results */}
          {evaluation && (
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-2xl space-y-5 animate-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    Function: review_practice_submission
                  </span>
                  <h3 className="text-base font-bold text-slate-100 mt-1">Rubric Assessment Breakdown</h3>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-black text-teal-400 font-mono">
                    {evaluation.totalScore} / {evaluation.maxScore}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {evaluation.totalScore >= 80 ? 'Distinction Standard' : evaluation.totalScore >= 70 ? 'Passing Standard' : 'Revision Recommended'}
                  </div>
                </div>
              </div>

              {/* Rubric Criteria Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {evaluation.rubricBreakdown.map((item, i) => (
                  <div key={i} className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1 text-xs">
                    <div className="flex items-center justify-between font-semibold text-slate-200">
                      <span>{item.criterion}</span>
                      <span className="font-mono text-teal-400">{item.score} / {item.max}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{item.feedback}</p>
                  </div>
                ))}
              </div>

              {/* Strengths & Improvements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-xl space-y-1.5">
                  <div className="font-semibold text-emerald-300 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Identified Strengths:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                    {evaluation.strengths.map((str, i) => (
                      <li key={i}>{str}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-xl space-y-1.5">
                  <div className="font-semibold text-amber-300 flex items-center space-x-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    <span>Areas for Improvement:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                    {evaluation.improvements.map((imp, i) => (
                      <li key={i}>{imp}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Senior BA Coaching Advice */}
              <div className="p-3.5 bg-teal-950/30 border border-teal-500/40 rounded-xl text-xs space-y-1">
                <span className="font-semibold text-teal-300 flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-teal-400" />
                  <span>Lead BA Coach Recommendation:</span>
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {evaluation.seniorBaAdvice}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
