import React, { useState } from 'react';
import Papa from 'papaparse';
import {
  X,
  Upload,
  FileSpreadsheet,
  AlertCircle,
  Download,
  ArrowRight
} from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFileSelectedForMapping: (rawRows: Record<string, any>[], fileName: string) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onFileSelectedForMapping
}) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const processFile = (file: File) => {
    setErrorMsg('');

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const raw = (results.data as Record<string, any>[]).filter(r => Object.keys(r).length > 2);
          if (raw.length === 0) {
            setErrorMsg('Uploaded file appears empty or lacks standard header rows.');
            return;
          }
          // Pass raw parsed rows directly to Column Mapping & Pre-Analysis Audit!
          onFileSelectedForMapping(raw, file.name);
          onClose();
        } catch (e: any) {
          setErrorMsg(e?.message || 'Error processing ticket records.');
        }
      },
      error: (err) => {
        setErrorMsg(`CSV Parser error: ${err.message}`);
      }
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white border border-slate-200 w-full max-w-lg rounded-2xl shadow-2xl p-6 space-y-4 text-slate-800">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <Upload className="w-5 h-5 text-teal-600" />
            <h3 className="font-extrabold text-base text-slate-900">Upload Operations Dataset</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          Upload a support operations CSV or export. You will be prompted to map column names and inspect pre-analysis data quality (missing, duplicates, and invalid values) without altering raw data.
        </p>

        {/* Drop Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-8 text-center transition flex flex-col items-center justify-center space-y-3 cursor-pointer ${
            dragActive
              ? 'border-teal-500 bg-teal-50/50'
              : 'border-slate-300 hover:border-teal-400 bg-slate-50/60'
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-teal-100/70 flex items-center justify-center">
            <FileSpreadsheet className="w-6 h-6 text-teal-700" />
          </div>

          <div>
            <span className="text-xs font-bold text-slate-800 block">
              Drag & Drop your CSV file here
            </span>
            <span className="text-[11px] text-slate-400">
              or click below to browse local files
            </span>
          </div>

          <label className="cursor-pointer px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl shadow-md transition">
            <span>Browse CSV File</span>
            <input
              type="file"
              accept=".csv,.txt"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  processFile(e.target.files[0]);
                }
              }}
              className="hidden"
            />
          </label>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs">
          <span className="text-slate-400">Need sample test data?</span>
          <a
            href="/samples/support_tickets.csv"
            download="support_tickets.csv"
            className="text-teal-700 hover:text-teal-800 font-bold flex items-center space-x-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Sample CSV (105 rows)</span>
          </a>
        </div>
      </div>
    </div>
  );
};
