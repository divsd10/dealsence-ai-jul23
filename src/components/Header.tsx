import React from 'react';
import { FileText, Sparkles, CheckCircle2, ArrowLeft, RefreshCw, PlusCircle } from 'lucide-react';
import { DEFAULT_FILE_NAME, DEFAULT_DEAL_NAME, ACTUAL_DEAL_1_EXTRACTION_DATA } from '../data/actualDeal_1';

interface HeaderProps {
  currentScreen: 'upload' | 'review' | 'final';
  fileName?: string;
  pageCount?: number;
  borrowerName?: string;
  reviewedCount?: number;
  totalCount?: number;
  onNavigateUpload?: () => void;
  onNavigateReview?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  fileName = DEFAULT_FILE_NAME,
  pageCount = ACTUAL_DEAL_1_EXTRACTION_DATA.pageCount,
  borrowerName = ACTUAL_DEAL_1_EXTRACTION_DATA.borrowerName,
  reviewedCount = 0,
  totalCount = ACTUAL_DEAL_1_EXTRACTION_DATA.attributes.length,
  onNavigateUpload,
  onNavigateReview,
}) => {
  if (currentScreen === 'upload') {
    return (
      <header className="bg-[#0b132b] text-white border-b border-slate-800 px-6 py-3.5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-inner">
            <FileText className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold tracking-wider text-lg bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              DEALSENSE.AI
            </span>
            <span className="bg-slate-800/90 text-blue-400 text-xs font-semibold px-2.5 py-0.5 rounded-md border border-slate-700">
              v1.0 Enterprise
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-300">
          <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>API Engine Online</span>
          </div>
        </div>
      </header>
    );
  }

  if (currentScreen === 'review') {
    return (
      <header className="bg-white border-b border-slate-200 px-5 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-4">
          <button
            onClick={onNavigateUpload}
            title="Back to Upload"
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">{fileName}</span>
                <span className="bg-slate-100 text-slate-600 text-[11px] font-medium px-2 py-0.5 rounded border border-slate-200">
                  {pageCount} Pages
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {ACTUAL_DEAL_1_EXTRACTION_DATA.documentType} • {borrowerName}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 text-xs">
            <div className="text-right">
              <div className="font-semibold text-slate-800">
                {reviewedCount} of {totalCount} Reviewed
              </div>
              <div className="text-[11px] text-slate-500">{totalCount - reviewedCount} pending validation</div>
            </div>
            <div className="w-28 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${(reviewedCount / Math.max(1, totalCount)) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Final Screen Header
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center border border-emerald-200">
          <CheckCircle2 className="w-4.5 h-4.5" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            DEAL PIPELINE • SIGNED OFF
          </span>
          <span className="font-bold text-slate-900 text-base">{borrowerName}</span>
          <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-0.5 rounded-full border border-blue-200">
            Syndicated Term Loan Agreement
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onNavigateReview}
          className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-medium flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Re-open Review
        </button>
        <button
          onClick={onNavigateUpload}
          className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          Process Another Deal
        </button>
      </div>
    </header>
  );
};
