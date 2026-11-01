import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  FolderGit2,
  Database,
  Presentation,
  Bot,
  Download,
  Sparkles,
  ChevronDown,
  Layers,
  GraduationCap
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'learn' | 'practice' | 'project' | 'datalab' | 'webinar';
  setActiveTab: (tab: 'learn' | 'practice' | 'project' | 'datalab' | 'webinar') => void;
  onOpenAssistant: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAssistant
}) => {
  const [downloadOpen, setDownloadOpen] = useState(false);

  const navItems = [
    { id: 'learn' as const, label: 'Learn', icon: BookOpen, badge: '6 Areas' },
    { id: 'practice' as const, label: 'Practice', icon: CheckCircle2, badge: '6 Tasks' },
    { id: 'project' as const, label: 'Project Studio', icon: FolderGit2, badge: 'Case Study' },
    { id: 'datalab' as const, label: 'Data Lab', icon: Database, badge: 'Interactive' },
    { id: 'webinar' as const, label: 'Webinar Studio', icon: Presentation, badge: '60 Min' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0f172a]/95 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('learn')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 via-teal-600 to-cyan-500 p-0.5 shadow-lg shadow-teal-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-[#0b1120] rounded-[10px] flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-teal-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  BA Studio
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-teal-950/80 text-teal-300 border border-teal-500/30">
                  v1.0 Pro
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Business Analyst Learning & Project Workspace
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-teal-500/15 text-teal-300 border border-teal-500/40 shadow-sm shadow-teal-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                      isActive
                        ? 'bg-teal-500/25 text-teal-200'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center space-x-2.5">
            {/* Download Sample Datasets Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDownloadOpen(!downloadOpen)}
                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-lg transition"
                title="Download Fictional Sample Datasets"
              >
                <Download className="w-3.5 h-3.5 text-teal-400" />
                <span className="hidden sm:inline">Sample Files</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {downloadOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-[#111827] border border-slate-700 rounded-xl shadow-2xl py-2 z-50 text-xs"
                  onMouseLeave={() => setDownloadOpen(false)}
                >
                  <div className="px-3 py-1.5 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Fictional Datasets (CSV)
                  </div>
                  <a
                    href="/samples/registration_requests.csv"
                    download="registration_requests.csv"
                    className="flex items-start px-3 py-2 text-slate-300 hover:bg-teal-500/10 hover:text-teal-300 transition"
                    onClick={() => setDownloadOpen(false)}
                  >
                    <div className="mt-0.5 mr-2">
                      <Database className="w-3.5 h-3.5 text-teal-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-200">registration_requests.csv</div>
                      <div className="text-[11px] text-slate-400">150 student enrollment attempts</div>
                    </div>
                  </a>
                  <a
                    href="/samples/registration_process_log.csv"
                    download="registration_process_log.csv"
                    className="flex items-start px-3 py-2 text-slate-300 hover:bg-teal-500/10 hover:text-teal-300 transition"
                    onClick={() => setDownloadOpen(false)}
                  >
                    <div className="mt-0.5 mr-2">
                      <Layers className="w-3.5 h-3.5 text-teal-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-200">registration_process_log.csv</div>
                      <div className="text-[11px] text-slate-400">Process step & audit event logs</div>
                    </div>
                  </a>
                </div>
              )}
            </div>

            {/* AI Assistant Co-Pilot Trigger */}
            <button
              onClick={onOpenAssistant}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-teal-100 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 rounded-lg shadow-md shadow-teal-700/20 transition active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-200 animate-pulse" />
              <span>BA Co-Pilot</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-800 text-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center py-1 px-2 rounded ${
                  isActive ? 'text-teal-300 font-semibold' : 'text-slate-400'
                }`}
              >
                <Icon className="w-4 h-4 mb-0.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
