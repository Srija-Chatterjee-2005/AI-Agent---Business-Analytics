import React, { useState, useEffect } from 'react';
import { ColumnMapping, DataQualityAudit, SupportTicket } from '../../types/operations';
import { auditDataQuality, normalizeTicketData, DEFAULT_SLA_TARGETS } from '../../utils/operationsEngine';
import {
  X,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  Sparkles,
  Info
} from 'lucide-react';

interface ColumnMappingModalProps {
  isOpen: boolean;
  onClose: () => void;
  rawRows: Record<string, any>[];
  fileName: string;
  onApplyMapping: (tickets: SupportTicket[], mapping: ColumnMapping, audit: DataQualityAudit) => void;
}

const REQUIRED_FIELDS: { key: keyof ColumnMapping; label: string; desc: string; sampleMatch: string[] }[] = [
  { key: 'ticket_id', label: 'Ticket ID (Required)', desc: 'Unique identifier per record', sampleMatch: ['ticket_id', 'id', 'ticket', 'ticket_number', 'tck_id'] },
  { key: 'date_created', label: 'Date Created (Required)', desc: 'Timestamp of ticket intake', sampleMatch: ['date_created', 'date', 'created_at', 'created', 'timestamp'] },
  { key: 'category', label: 'Category (Required)', desc: 'Operational classification topic', sampleMatch: ['category', 'ticket_category', 'topic', 'type', 'issue_type'] },
  { key: 'priority', label: 'Priority (Required)', desc: 'Urgency tier (Critical, High, Medium, Low)', sampleMatch: ['priority', 'severity', 'urgency', 'level'] },
  { key: 'assigned_team', label: 'Assigned Team (Required)', desc: 'Queue or escalation group', sampleMatch: ['assigned_team', 'team', 'queue', 'group', 'owner'] },
  { key: 'status', label: 'Status (Required)', desc: 'Lifecycle state (Open, In Progress, Resolved, Closed)', sampleMatch: ['status', 'ticket_status', 'state'] },
  { key: 'response_time_hrs', label: 'Response Time (Hours)', desc: 'Hours elapsed before initial analyst response', sampleMatch: ['response_time_hrs', 'response_time', 'first_response_hrs', 'first_response'] },
  { key: 'resolution_time_hrs', label: 'Resolution Time (Hours)', desc: 'Total hours elapsed to ticket resolution', sampleMatch: ['resolution_time_hrs', 'resolution_time', 'resolution_hrs', 'duration_hrs'] },
  { key: 'sla_target_hrs', label: 'SLA Target (Hours)', desc: 'Agreed service level target in hours', sampleMatch: ['sla_target_hrs', 'sla_target', 'sla_hours', 'target_hrs'] },
  { key: 'satisfaction_score', label: 'Satisfaction Score (CSAT 1-5)', desc: 'Customer rating scale from 1 to 5', sampleMatch: ['satisfaction_score', 'csat', 'rating', 'satisfaction', 'score'] },
  { key: 'reopened_count', label: 'Reopened Count', desc: 'Number of times ticket was reopened', sampleMatch: ['reopened_count', 'reopen_count', 'reopened', 'reopens'] }
];

export const ColumnMappingModal: React.FC<ColumnMappingModalProps> = ({
  isOpen,
  onClose,
  rawRows,
  fileName,
  onApplyMapping
}) => {
  const [columnsInFile, setColumnsInFile] = useState<string[]>([]);
  const [mapping, setMapping] = useState<ColumnMapping>({
    ticket_id: '',
    date_created: '',
    category: '',
    priority: '',
    assigned_team: '',
    status: '',
    response_time_hrs: '',
    resolution_time_hrs: '',
    sla_target_hrs: '',
    satisfaction_score: '',
    reopened_count: ''
  });
  const [audit, setAudit] = useState<DataQualityAudit | null>(null);

  useEffect(() => {
    if (rawRows && rawRows.length > 0) {
      const headers = Object.keys(rawRows[0]);
      setColumnsInFile(headers);

      // Auto-detect optimal matching columns
      const initialMapping: ColumnMapping = {
        ticket_id: '',
        date_created: '',
        category: '',
        priority: '',
        assigned_team: '',
        status: '',
        response_time_hrs: '',
        resolution_time_hrs: '',
        sla_target_hrs: '',
        satisfaction_score: '',
        reopened_count: ''
      };

      REQUIRED_FIELDS.forEach(field => {
        const matched = headers.find(h => {
          const lower = h.toLowerCase().trim();
          return field.sampleMatch.some(sm => lower === sm || lower.includes(sm));
        });
        if (matched) {
          initialMapping[field.key] = matched;
        }
      });

      setMapping(initialMapping);
      const initialAudit = auditDataQuality(rawRows, initialMapping);
      setAudit(initialAudit);
    }
  }, [rawRows]);

  if (!isOpen) return null;

  const handleFieldChange = (fieldKey: keyof ColumnMapping, value: string) => {
    const updated = { ...mapping, [fieldKey]: value };
    setMapping(updated);
    if (rawRows.length > 0) {
      setAudit(auditDataQuality(rawRows, updated));
    }
  };

  const handleConfirm = () => {
    if (!rawRows || rawRows.length === 0) return;
    const currentAudit = audit || auditDataQuality(rawRows, mapping);
    const normalized = normalizeTicketData(rawRows, mapping, DEFAULT_SLA_TARGETS);
    onApplyMapping(normalized, mapping, currentAudit);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white border border-slate-200 w-full max-w-4xl rounded-2xl shadow-2xl max-h-[90vh] flex flex-col text-slate-800">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50 rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-700 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Column Mapping & Pre-Analysis Data Audit
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                {fileName} &bull; {rawRows.length} raw rows detected &bull; Non-destructive audit
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Explanation Callout */}
          <div className="p-3.5 bg-sky-50/70 border border-sky-200 rounded-xl flex items-start space-x-3 text-xs text-sky-900">
            <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="font-semibold text-sky-950">Non-Destructive Data Ingestion:</strong> SupportFlow will never silently drop or alter your raw records. Map each operational metric to your CSV/Excel columns below. The pre-analysis audit audits missing fields, duplicate IDs, and out-of-scale values in real time.
            </div>
          </div>

          {/* Audit Summary Badges */}
          {audit && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Total Records</span>
                <span className="text-xl font-black text-slate-900 font-mono">{audit.totalRows}</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Duplicates Detected</span>
                <span className={`text-xl font-black font-mono ${audit.duplicateRowsCount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {audit.duplicateRowsCount}
                </span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Invalid Values</span>
                <span className={`text-xl font-black font-mono ${audit.invalidValuesCount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {audit.invalidValuesCount}
                </span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Data Readiness</span>
                <span className="text-sm font-bold text-teal-700 flex items-center space-x-1 mt-1">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  <span>Ready to Profile</span>
                </span>
              </div>
            </div>
          )}

          {/* Mapping Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 text-xs font-bold text-slate-700 uppercase tracking-wider grid grid-cols-1 md:grid-cols-12 gap-2">
              <div className="md:col-span-4">SupportFlow Field</div>
              <div className="md:col-span-5">Mapped Column in Uploaded File</div>
              <div className="md:col-span-3 text-right">Audit Status</div>
            </div>

            <div className="divide-y divide-slate-100">
              {REQUIRED_FIELDS.map(field => {
                const mappedCol = mapping[field.key];
                const missingCount = audit?.missingFields[field.key] || 0;
                const isMapped = !!mappedCol;

                return (
                  <div key={field.key} className="px-4 py-3 grid grid-cols-1 md:grid-cols-12 gap-2 items-center hover:bg-slate-50/60 transition">
                    <div className="md:col-span-4">
                      <div className="text-xs font-bold text-slate-900">{field.label}</div>
                      <div className="text-[11px] text-slate-500">{field.desc}</div>
                    </div>

                    <div className="md:col-span-5">
                      <select
                        value={mappedCol || ''}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        className={`w-full text-xs font-medium rounded-lg px-3 py-2 border transition outline-none ${
                          isMapped
                            ? 'bg-white border-slate-300 text-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500'
                            : 'bg-amber-50 border-amber-300 text-amber-800'
                        }`}
                      >
                        <option value="">-- Select matching column --</option>
                        {columnsInFile.map(col => (
                          <option key={col} value={col}>
                            {col} (e.g. "{String(rawRows[0]?.[col] ?? '').slice(0, 20)}")
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-3 text-right text-xs">
                      {isMapped ? (
                        missingCount > 0 ? (
                          <span className="inline-flex items-center space-x-1 text-amber-600 font-medium">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>{missingCount} missing rows</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 text-emerald-600 font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Fully populated</span>
                          </span>
                        )
                      ) : (
                        <span className="text-slate-400 italic">Unmapped</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Invalid Findings Detail if any */}
          {audit && audit.invalidFindings.length > 0 && (
            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Pre-Analysis Findings ({audit.invalidFindings.length} flagged values):</span>
              </div>
              <p className="text-[11px] text-amber-800">
                The following values were flagged during verification. They will be handled safely with standard operations fallbacks without altering the original records.
              </p>
              <div className="max-h-28 overflow-y-auto text-xs space-y-1 font-mono bg-white p-2 rounded-lg border border-amber-200">
                {audit.invalidFindings.slice(0, 10).map((f, i) => (
                  <div key={i} className="text-slate-700 text-[11px]">
                    Row {f.row}: [{f.field}] {f.issue} (Value: "{String(f.value)}")
                  </div>
                ))}
                {audit.invalidFindings.length > 10 && (
                  <div className="text-[11px] text-slate-500 italic">
                    + {audit.invalidFindings.length - 10} more non-blocking findings
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-xs font-semibold text-slate-700 rounded-xl transition"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirm}
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow flex items-center space-x-2 transition"
          >
            <span>Confirm Mapping & Profile Data</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
