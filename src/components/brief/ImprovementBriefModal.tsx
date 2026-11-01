import React, { useState } from 'react';
import { ImprovementBrief } from '../../types/operations';
import {
  X,
  FileCheck2,
  Copy,
  Check,
  Sparkles,
  CheckCircle2,
  ListChecks,
  FileText,
  Workflow,
  Save
} from 'lucide-react';

interface ImprovementBriefModalProps {
  brief: ImprovementBrief | null;
  onClose: () => void;
  onSaveBrief?: (brief: ImprovementBrief) => void;
}

export const ImprovementBriefModal: React.FC<ImprovementBriefModalProps> = ({
  brief,
  onClose,
  onSaveBrief
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);
  const [uatChecks, setUatChecks] = useState(brief?.uatChecks || []);

  if (!brief) return null;

  const toggleCheck = (id: string) => {
    setUatChecks(prev => prev.map(c => c.id === id ? { ...c, verified: !c.verified } : c));
  };

  const handleCopyMarkdown = () => {
    const md = `# ${brief.title}
**Brief ID:** ${brief.briefId} | **Date:** ${brief.dateGenerated} | **Role:** ${brief.authorRole}
**Reference Investigation:** ${brief.investigationRef}

---

## 1. Problem Statement
${brief.problemStatement}

### Metrics Baseline vs Target
${brief.metricsBaseline.map(m => `- **${m.current}** &rarr; **${m.target}**`).join('\n')}

---

## 2. Proposed Requirements
${brief.proposedRequirements.map(r => `### [${r.id}] (${r.type})\n${r.statement}\n`).join('\n')}

---

## 3. Acceptance Criteria (Gherkin Syntax)
\`\`\`gherkin
${brief.acceptanceCriteria}
\`\`\`

---

## 4. User Acceptance Testing (UAT) Verification
${uatChecks.map(u => `- [${u.verified ? 'x' : ' '}] **${u.id}:** ${u.scenario} &rarr; *Expected:* ${u.expectedResult}`).join('\n')}
`;

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSave = () => {
    if (onSaveBrief) {
      onSaveBrief({ ...brief, uatChecks });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-800">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40">
                {brief.briefId}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Author: {brief.authorRole} &bull; {brief.dateGenerated}
              </span>
            </div>
            <h3 className="font-extrabold text-base sm:text-lg text-white">
              {brief.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Reference Banner */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs font-mono text-slate-600">
            <span>Root Investigation: <strong className="text-slate-900 font-sans">{brief.investigationRef}</strong></span>
            <span className="text-teal-700 font-bold">Actionable Specification</span>
          </div>

          {/* Section 1: Problem Statement & Metrics Baseline */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center space-x-1.5">
              <FileText className="w-4 h-4 text-teal-600" />
              <span>1. Problem Statement & Baseline Metrics</span>
            </h4>

            <p className="text-sm text-slate-800 bg-slate-50 p-4 rounded-xl border border-slate-200 leading-relaxed font-medium">
              {brief.problemStatement}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {brief.metricsBaseline.map((m, i) => (
                <div key={i} className="p-3 bg-teal-50/70 border border-teal-200 rounded-xl space-y-1">
                  <div className="text-[10px] uppercase font-bold text-teal-800 tracking-wider">Metric {i + 1}</div>
                  <div className="text-xs font-bold text-slate-800">{m.current}</div>
                  <div className="text-xs font-extrabold text-teal-700">{m.target}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Formal Proposed Requirements */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center space-x-1.5">
              <Workflow className="w-4 h-4 text-teal-600" />
              <span>2. Proposed Requirements (FR & NFR)</span>
            </h4>

            <div className="space-y-2.5">
              {brief.proposedRequirements.map(req => (
                <div key={req.id} className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1 shadow-sm">
                  <div className="flex items-center space-x-2">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      req.type === 'Functional' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {req.id} &bull; {req.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-800 font-medium leading-relaxed pt-1">
                    {req.statement}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Acceptance Criteria (Gherkin) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>3. Acceptance Criteria (Given-When-Then)</span>
            </h4>

            <pre className="p-4 bg-slate-900 text-teal-300 font-mono text-xs rounded-xl overflow-x-auto whitespace-pre-wrap leading-relaxed border border-slate-800">
              {brief.acceptanceCriteria}
            </pre>
          </div>

          {/* Section 4: User Acceptance Testing (UAT) Verification */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center space-x-1.5">
              <ListChecks className="w-4 h-4 text-teal-600" />
              <span>4. User Acceptance Testing (UAT) Verification Checklist</span>
            </h4>

            <div className="space-y-2">
              {uatChecks.map(check => (
                <div
                  key={check.id}
                  onClick={() => toggleCheck(check.id)}
                  className={`p-3 rounded-xl border flex items-start space-x-3 cursor-pointer transition select-none ${
                    check.verified
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100/80 text-slate-800'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={check.verified}
                    onChange={() => {}}
                    className="mt-0.5 w-4 h-4 accent-teal-600 rounded cursor-pointer"
                  />
                  <div className="space-y-0.5 flex-1 text-xs">
                    <div className="font-bold flex items-center justify-between">
                      <span>[{check.id}] {check.scenario}</span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {check.verified ? 'Verified ✓' : 'Pending Sign-Off'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600">
                      <strong>Expected Result:</strong> {check.expectedResult}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
          >
            Close
          </button>

          <div className="flex items-center space-x-2">
            {onSaveBrief && (
              <button
                onClick={handleSave}
                className="flex items-center space-x-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-sm"
              >
                <Save className="w-3.5 h-3.5 text-teal-300" />
                <span>{saved ? 'Saved!' : 'Save to Workspace'}</span>
              </button>
            )}

            <button
              onClick={handleCopyMarkdown}
              className="flex items-center space-x-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-900/20 transition active:scale-95"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Markdown Brief'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
