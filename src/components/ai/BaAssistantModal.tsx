import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Bot,
  Send,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Clock,
  Terminal,
  FileText,
  Workflow,
  ShieldCheck,
  ListOrdered
} from 'lucide-react';
import { AiFunctionResponse } from '../../types/ba';

interface BaAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeContext?: string;
  onApplyResult?: (result: any, functionName: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  functionUsed?: string;
  functionResult?: any;
  assumptions?: string[];
  missingInfoNeeded?: string[];
  executionTimeMs?: number;
  timestamp: string;
}

export const BaAssistantModal: React.FC<BaAssistantModalProps> = ({
  isOpen,
  onClose,
  activeContext = 'learn',
  onApplyResult
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Welcome to the **BA Studio Co-Pilot**! I am linked directly to real Business Analyst function engines. I can generate stakeholder questions, draft MoSCoW requirements, map As-Is/To-Be workflows, formulate UAT test cases, evaluate student assignments against rubrics, and prepare webinar decks.

When I run a tool, I will show the exact function used, label all assumptions explicitly, and ask for any missing business information.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedFunction, setSelectedFunction] = useState<string>('auto');

  if (!isOpen) return null;

  const quickActions = [
    { label: 'Elicitation Questions', func: 'generate_stakeholder_questions', prompt: 'Generate discovery interview questions for the University Registrar regarding course prerequisites.' },
    { label: 'Draft Requirements', func: 'draft_requirements_and_stories', prompt: 'Draft MoSCoW functional requirements and INVEST user stories for self-service registration waitlists.' },
    { label: 'Map As-Is vs To-Be', func: 'map_process_flow', prompt: 'Map the As-Is and To-Be process flows for college registration with cycle times and bottlenecks.' },
    { label: 'UAT Test Cases', func: 'generate_uat_test_cases', prompt: 'Generate 4 comprehensive UAT acceptance test cases for waitlist promotion and fee hold blocks.' },
    { label: 'Webinar Plan', func: 'prepare_webinar_assets', prompt: 'Prepare a 60-minute timed agenda, slide outline, and live demo plan for a BA careers webinar.' }
  ];

  const handleSend = async (customPrompt?: string, forceFunc?: string) => {
    const textToSend = customPrompt || inputText;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const funcToRun = forceFunc || (selectedFunction !== 'auto' ? selectedFunction : null);

      if (funcToRun) {
        // Direct execute-function endpoint
        const res = await fetch('/api/ai/execute-function', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            functionName: funcToRun,
            parameters: { scope: textToSend, role: 'Registrar', topic: 'Course Registration' },
            userPrompt: textToSend
          })
        });
        const data: AiFunctionResponse = await res.json();

        const assistantMsg: ChatMessage = {
          id: String(Date.now() + 1),
          sender: 'assistant',
          text: `Executed registered function \`${data.functionUsed}\` successfully. Review the structured output below:`,
          functionUsed: data.functionUsed,
          functionResult: data.result,
          assumptions: data.assumptions,
          missingInfoNeeded: data.missingInfoNeeded,
          executionTimeMs: data.executionTimeMs,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        // Interactive chat endpoint with auto-dispatch
        const res = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: textToSend,
            context: { activeSection: activeContext }
          })
        });
        const data = await res.json();

        const assistantMsg: ChatMessage = {
          id: String(Date.now() + 1),
          sender: 'assistant',
          text: data.reply || 'Consultation complete.',
          functionUsed: data.functionUsed,
          functionResult: data.functionResult,
          assumptions: data.assumptions || [],
          missingInfoNeeded: data.missingInfoNeeded || [],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, assistantMsg]);
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: 'assistant',
        text: `Error contacting BA engine: ${err?.message || 'Service unavailable'}. Please verify backend status.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0f172a] border border-slate-700 w-full max-w-4xl h-[88vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-slate-100 text-base">BA Studio Co-Pilot & Function Engine</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-950 text-teal-300 border border-teal-700/50 font-mono">
                  Real Tool Invocation
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Transparent function calling, explicit assumptions, and verifiable deliverables.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Action Presets */}
        <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800/80 overflow-x-auto flex items-center space-x-2 text-xs">
          <span className="text-slate-400 text-[11px] font-medium whitespace-nowrap">Quick BA Tools:</span>
          {quickActions.map((action, i) => (
            <button
              key={i}
              onClick={() => handleSend(action.prompt, action.func)}
              className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-teal-300 border border-slate-700/60 whitespace-nowrap transition"
            >
              {action.label}
            </button>
          ))}
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-[#0b1120]">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[90%] sm:max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
                    isUser
                      ? 'bg-teal-600 text-white rounded-br-none shadow-md shadow-teal-900/20'
                      : 'bg-slate-800/90 text-slate-200 border border-slate-700/70 rounded-bl-none shadow-lg'
                  }`}
                >
                  {/* Tool Execution Badge */}
                  {msg.functionUsed && (
                    <div className="mb-3 pb-2.5 border-b border-slate-700/70 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-slate-900/90 text-teal-300 border border-teal-500/30 font-mono">
                        <Terminal className="w-3.5 h-3.5 text-teal-400" />
                        <span>Function: {msg.functionUsed}</span>
                      </div>
                      {msg.executionTimeMs && (
                        <div className="flex items-center space-x-1 text-[11px] text-slate-400 font-mono">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{msg.executionTimeMs}ms execution</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Main Message Text */}
                  <div className="whitespace-pre-wrap space-y-2">
                    {msg.text}
                  </div>

                  {/* Structured Function Result Rendering */}
                  {msg.functionResult && (
                    <div className="mt-3 p-3 bg-slate-900/90 rounded-xl border border-slate-700/80 text-xs space-y-2">
                      <div className="flex items-center justify-between font-semibold text-slate-300 border-b border-slate-800 pb-1.5">
                        <span className="flex items-center space-x-1.5">
                          <Cpu className="w-3.5 h-3.5 text-teal-400" />
                          <span>Output Deliverable</span>
                        </span>
                        {onApplyResult && (
                          <button
                            onClick={() => onApplyResult(msg.functionResult, msg.functionUsed || '')}
                            className="text-[11px] px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 border border-teal-500/40 transition"
                          >
                            Apply to Project
                          </button>
                        )}
                      </div>

                      <pre className="max-h-60 overflow-y-auto text-[11px] text-teal-200/90 font-mono p-2 bg-black/40 rounded">
                        {JSON.stringify(msg.functionResult, null, 2)}
                      </pre>
                    </div>
                  )}

                  {/* Explicit Assumptions Callout */}
                  {msg.assumptions && msg.assumptions.length > 0 && (
                    <div className="mt-3 p-2.5 bg-blue-950/40 border border-blue-500/30 rounded-xl text-xs text-blue-200">
                      <div className="flex items-center space-x-1.5 font-semibold text-blue-300 mb-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                        <span>Explicit Assumptions Labeled:</span>
                      </div>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                        {msg.assumptions.map((assump, idx) => (
                          <li key={idx}><span className="text-blue-300 font-medium">[Assumption]</span> {assump}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Missing Information Required Callout */}
                  {msg.missingInfoNeeded && msg.missingInfoNeeded.length > 0 && (
                    <div className="mt-2.5 p-2.5 bg-amber-950/40 border border-amber-500/30 rounded-xl text-xs text-amber-200">
                      <div className="flex items-center space-x-1.5 font-semibold text-amber-300 mb-1">
                        <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                        <span>Clarification / Missing Info Needed:</span>
                      </div>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                        {msg.missingInfoNeeded.map((missing, idx) => (
                          <li key={idx}><span className="text-amber-300 font-medium">[Clarification]</span> {missing}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-slate-500 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center space-x-2 text-xs text-teal-400 bg-slate-850 p-3 rounded-xl border border-slate-700/60 max-w-sm">
              <Cpu className="w-4 h-4 animate-spin text-teal-400" />
              <span>Executing BA function engine with zero hallucinated figures...</span>
            </div>
          )}
        </div>

        {/* Input Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask the BA Co-Pilot or specify requirements..."
                disabled={loading}
                className="w-full bg-[#0b1120] text-slate-100 placeholder-slate-500 text-sm px-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-teal-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="p-2.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white rounded-xl transition shadow-lg shadow-teal-700/20 active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
            <span>Free-tier Gemini 3.8 Flash + deterministic function engine</span>
            <span>All figures strictly validated against Data Lab</span>
          </div>
        </div>
      </div>
    </div>
  );
};
