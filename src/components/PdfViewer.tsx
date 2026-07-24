import React, { useState, useEffect, useRef } from 'react';
import {
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Highlighter
} from 'lucide-react';
import { MOCK_PDF_PAGES } from '../data/sampleDeal';
import { DealAttribute } from '../types';

interface PdfViewerProps {
  activePage: number;
  activeAttribute: DealAttribute | null;
  pdfUrl?: string | null;
  fileName?: string;
  pageCount: number;
  pageFieldCounts: number[];
  onPageChange: (page: number) => void;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({
  activePage,
  activeAttribute,
  pdfUrl,
  fileName,
  pageCount,
  pageFieldCounts,
  onPageChange,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [pageInput, setPageInput] = useState<string>(activePage.toString());
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPageInput(activePage.toString());
  }, [activePage]);

  // Scroll to highlight when activeAttribute or activePage changes
  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activePage, activeAttribute]);

  const handlePageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseInt(pageInput, 10);
    if (!isNaN(p) && p >= 1 && p <= pageCount) {
      onPageChange(p);
    } else {
      setPageInput(activePage.toString());
    }
  };

  const currentPageData = MOCK_PDF_PAGES[activePage] || {
    title: `PAGE ${activePage} OF ${pageCount}`,
    subtitle: 'CREDIT AGREEMENT PROVISIONS',
    fieldCount: 0,
    content: `Section ${activePage}.01. Further Provisions and Obligations.
Subject to the terms and conditions hereof, the Borrower and Administrative Agent hereby agree to the terms specified on page ${activePage} of this Credit Agreement.`
  };

  const hasUploadedPdf = Boolean(pdfUrl);

  return (
    <div className="h-full flex flex-col bg-[#0f172a] text-slate-100 overflow-hidden select-none border-r border-slate-800">
      {/* Top Toolbar */}
      <div className="bg-[#1e293b] border-b border-slate-700/80 px-4 py-2 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-[10px]">
            PDF
          </div>
          <span className="font-medium text-slate-200 truncate max-w-50">
            {fileName || 'Uploaded Document.pdf'}
          </span>
          <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold px-2 py-0.5 rounded">
            {hasUploadedPdf ? 'UPLOADED PDF' : 'SAMPLE AGREEMENT'}
          </span>
        </div>

        {/* Page Nav Controls */}
        <form onSubmit={handlePageSubmit} className="flex items-center gap-1 bg-[#0f172a] px-2 py-1 rounded border border-slate-700">
          <button
            type="button"
            disabled={activePage <= 1}
            onClick={() => onPageChange(Math.max(1, activePage - 1))}
            className="p-1 hover:bg-slate-800 disabled:opacity-30 rounded transition-colors text-slate-300"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="text-slate-400 font-medium text-[11px]">Page</span>
          <input
            type="text"
            value={pageInput}
            onChange={(e) => setPageInput(e.target.value)}
            className="w-8 text-center bg-slate-900 border border-slate-700 rounded text-xs text-white font-semibold py-0.5"
          />
          <span className="text-slate-400 font-medium text-[11px]">/ {pageCount}</span>
          <button
            type="button"
            disabled={activePage >= pageCount}
            onClick={() => onPageChange(Math.min(pageCount, activePage + 1))}
            className="p-1 hover:bg-slate-800 disabled:opacity-30 rounded transition-colors text-slate-300"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1.5 bg-[#0f172a] px-2 py-1 rounded border border-slate-700 text-slate-300">
          <button
            onClick={() => setZoomLevel(Math.max(75, zoomLevel - 10))}
            className="p-1 hover:bg-slate-800 rounded transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="font-semibold text-[11px] min-w-9 text-center">{zoomLevel}%</span>
          <button
            onClick={() => setZoomLevel(Math.min(150, zoomLevel + 10))}
            className="p-1 hover:bg-slate-800 rounded transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Body: Left Thumbnails + Right Document View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Thumbnails Sidebar */}
        <div className="w-28 bg-[#0f172a] border-r border-slate-800 p-2 space-y-2.5 overflow-y-auto custom-scrollbar">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
            PAGE THUMBNAILS ({pageCount})
          </div>

          {Array.from({ length: pageCount }, (_, idx) => idx + 1).map((p) => {
            const isCurrent = p === activePage;
            const fieldsCount = pageFieldCounts[p - 1] || 0;

            return (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={`w-full text-left p-1.5 rounded-lg border transition-all group relative ${
                  isCurrent
                    ? 'border-blue-500 bg-blue-950/50 shadow-md ring-1 ring-blue-500'
                    : 'border-slate-800 hover:border-slate-700 bg-[#1e293b]/60'
                }`}
              >
                {/* Mini page box */}
                <div className="w-full aspect-[1/1.3] bg-white text-slate-900 p-1.5 rounded text-[7px] leading-tight overflow-hidden relative shadow-inner">
                  <div className="font-bold border-b border-slate-300 pb-0.5 uppercase tracking-tighter truncate">
                        {fileName ? fileName.replace(/\.pdf$/i, '') : 'CREDIT AGREEMENT'}
                  </div>
                  <div className="mt-1 space-y-0.5 opacity-60 text-[6px]">
                    <div className="h-1 bg-slate-300 rounded w-full"></div>
                    <div className="h-1 bg-slate-300 rounded w-4/5"></div>
                    <div className="h-1 bg-slate-300 rounded w-3/5"></div>
                  </div>

                  {/* Yellow pill for fields on page */}
                  {fieldsCount > 0 && (
                    <span className="absolute top-1 right-1 bg-amber-500 text-slate-950 font-extrabold text-[8px] px-1 rounded-xs shadow-xs">
                      {fieldsCount}
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center mt-1 px-0.5 text-[10px] text-slate-400">
                  <span className={isCurrent ? 'font-bold text-blue-400' : ''}>Page {p}</span>
                  {fieldsCount > 0 && (
                    <span className="text-[9px] text-amber-400 font-semibold">{fieldsCount} fields</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right PDF Canvas Stage */}
        <div
          ref={canvasRef}
          className="flex-1 bg-[#1e293b]/80 p-6 overflow-y-auto flex justify-center custom-scrollbar"
        >
          {hasUploadedPdf ? (
            <div className="relative w-full h-full max-w-245 bg-white rounded-lg overflow-hidden border border-slate-200 shadow-2xl">
              <iframe
                title={fileName || 'Uploaded PDF'}
                src={`${pdfUrl}#page=${activePage}&zoom=${zoomLevel}`}
                className="w-full h-full min-h-230 bg-white"
              />

              {activeAttribute && activeAttribute.page === activePage && (
                <div className="absolute bottom-8 right-8 max-w-md p-4 rounded-lg bg-amber-50/95 border-2 border-amber-400 text-amber-950 shadow-md animate-pulse z-10">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-900 mb-1 font-sans">
                    <span className="flex items-center gap-1.5">
                      <Highlighter className="w-4 h-4 text-amber-600" />
                      EXTRACTED VALUE SOURCE (PAGE {activePage})
                    </span>
                    <span className="bg-amber-200 text-amber-900 text-[10px] px-2 py-0.5 rounded font-extrabold">
                      {activeAttribute.label}
                    </span>
                  </div>
                  <blockquote className="italic font-serif text-xs text-amber-950 pl-2 border-l-2 border-amber-500 my-1">
                    {activeAttribute.excerpt}
                  </blockquote>
                  <div className="text-[11px] font-sans font-bold text-amber-800 mt-2">
                    Parsed Value: <span className="bg-white px-2 py-0.5 rounded border border-amber-300">{activeAttribute.value}</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div
              className="bg-white text-slate-900 shadow-2xl rounded-sm p-10 md:p-14 w-full max-w-180 min-h-230 transition-transform duration-200 relative border border-slate-200"
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            >
              <div className="flex justify-between items-center border-b border-slate-200 pb-4 mb-8 text-xs font-serif text-slate-500">
                <span className="font-bold uppercase tracking-wider text-slate-800">
                  CONFIDENTIAL CREDIT AGREEMENT
                </span>
                <span className="font-mono text-[11px]">PAGE {activePage} OF {pageCount}</span>
              </div>

              <div className="space-y-6 font-serif leading-relaxed text-sm text-slate-800">
                <h1 className="text-xl font-bold tracking-tight text-slate-950 border-b border-slate-900 pb-2 uppercase">
                  {currentPageData.title}
                </h1>

                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                  {currentPageData.subtitle}
                </h2>

                <div className="whitespace-pre-line text-justify leading-7 font-sans text-xs sm:text-sm text-slate-800 space-y-4">
                  {currentPageData.content}
                </div>

                {activeAttribute && activeAttribute.page === activePage && (
                  <div className="mt-8 p-4 rounded-lg bg-amber-50/90 border-2 border-amber-400 text-amber-950 shadow-md animate-pulse">
                    <div className="flex items-center justify-between text-xs font-bold text-amber-900 mb-1 font-sans">
                      <span className="flex items-center gap-1.5">
                        <Highlighter className="w-4 h-4 text-amber-600" />
                        EXTRACTED VALUE SOURCE (PAGE {activePage})
                      </span>
                      <span className="bg-amber-200 text-amber-900 text-[10px] px-2 py-0.5 rounded font-extrabold">
                        {activeAttribute.label}
                      </span>
                    </div>
                    <blockquote className="italic font-serif text-xs text-amber-950 pl-2 border-l-2 border-amber-500 my-1">
                      {activeAttribute.excerpt}
                    </blockquote>
                    <div className="text-[11px] font-sans font-bold text-amber-800 mt-2">
                      Parsed Value: <span className="bg-white px-2 py-0.5 rounded border border-amber-300">{activeAttribute.value}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="absolute bottom-6 left-10 right-10 flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-200 pt-3 font-sans">
                <span>ABC MANUFACTURING LTD — CREDIT AGREEMENT</span>
                <span className="font-mono">EXECUTION COPY</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
