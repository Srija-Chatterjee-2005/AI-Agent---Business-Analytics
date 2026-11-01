import React from 'react';
import { ImprovementBrief, QuestionKey } from '../../types/operations';
import {
  FileCheck2,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Plus,
  Eye,
  FileText,
  Trash2,
  Copy,
  Sparkles
} from 'lucide-react';

interface BriefsViewProps {
  briefs: ImprovementBrief[];
  onSelectBrief?: (brief: ImprovementBrief) => void;
  onDeleteBrief?: (briefId: string) => void;
  onOpenInvestigationModal?: () => void;
  onRunInvestigation?: (q: QuestionKey) => void;
}

export const BriefsView: React.FC<BriefsViewProps> = ({
  briefs,
  onSelectBrief,
  onDeleteBrief,
  onOpenInvestigationModal,
  onRunInvestigation
}) => {
  return (
    <div className="space-y-6 text-slate-800">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-2">
            <FileCheck2 className="w-3.5 h-3.5 text-teal-600" />
            <span>Executive Deliverables</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Operational Improvement Briefs ({briefs.length})
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Actionable specifications drafted by SupportFlow with problem statements, proposed functional requirements, Gherkin acceptance criteria, and UAT test cases.
          </p>
        </div>

        {onOpenInvestigationModal && (
          <button
            onClick={onOpenInvestigationModal}
            className="px-4 py-2 bg-slate-900 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-teal-300" />
            <span>Draft New Brief from Investigation</span>
          </button>
        )}
      </div>

      {briefs.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 mx-auto flex items-center justify-center">
            <FileText className="w-7 h-7 text-teal-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">No Improvement Briefs Drafted Yet</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Run any of the 8 operational inquiries or capacity simulations and click <strong>“Draft Practical Improvement Brief”</strong> to generate an executive deliverable.
            </p>
          </div>

          {onOpenInvestigationModal && (
            <div className="pt-2">
              <button
                onClick={onOpenInvestigationModal}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition"
              >
                Go to Ops Analyst Agent
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {briefs.map((brief) => (
            <div
              key={brief.briefId}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-4 hover:border-teal-300 transition"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                    {brief.briefId}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {brief.dateGenerated}
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-slate-900 leading-snug">
                  {brief.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {brief.problemStatement}
                </p>

                <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2 text-[11px] text-slate-500 font-mono">
                  <span>{brief.proposedRequirements.length} Requirements</span>
                  <span>&bull;</span>
                  <span>{brief.uatChecks.length} UAT Scenarios</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                {onSelectBrief ? (
                  <button
                    onClick={() => onSelectBrief(brief)}
                    className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center space-x-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Full Specification</span>
                  </button>
                ) : <div />}

                {onDeleteBrief && (
                  <button
                    onClick={() => onDeleteBrief(brief.briefId)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Delete brief"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
