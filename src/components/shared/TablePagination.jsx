import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function getPageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = [];
  if (current <= 4) {
    pages.push(1, 2, 3, 4, 5, "...", total);
  } else if (current >= total - 3) {
    pages.push(1, "...", total - 4, total - 3, total - 2, total - 1, total);
  } else {
    pages.push(1, "...", current - 1, current, current + 1, "...", total);
  }
  return pages;
}

export default function TablePagination({ page, totalPages, totalItems, pageSize, onPageChange, onPageSizeChange }) {
  const safeTotal = Math.max(0, Number(totalItems) || 0);
  const safePages = Math.max(1, Number(totalPages) || 1);
  const safePage = Math.min(Math.max(1, Number(page) || 1), safePages);
  const start = safeTotal === 0 ? 0 : Math.min((safePage - 1) * pageSize + 1, safeTotal);
  const end = safeTotal === 0 ? 0 : Math.min(safePage * pageSize, safeTotal);
  const pages = getPageNumbers(safePage, safePages);

  const btnBase = "h-7 min-w-[28px] px-1.5 text-[10.5px] rounded flex items-center justify-center transition-colors font-medium";
  const btnActive = "bg-primary text-primary-foreground";
  const btnInactive = "text-muted-foreground/70 hover:bg-muted/50 hover:text-foreground";
  const btnDisabled = "text-muted-foreground/30 cursor-not-allowed";

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-4 py-2.5 border-t border-border/50">
      {/* Left: context */}
      <div className="flex items-center gap-3">
        <span className="text-[10px] text-muted-foreground/60 tabular-nums">
          Showing <span className="text-foreground/70 font-medium">{start}–{end}</span> of <span className="text-foreground/70 font-medium">{safeTotal.toLocaleString()}</span>
        </span>
        {safePages > 1 && (
          <span className="text-[10px] text-muted-foreground/40 tabular-nums hidden sm:block">
            Page {safePage} of {safePages}
          </span>
        )}
      </div>

      {/* Center: page controls */}
      {safePages > 1 && (
        <div className="flex items-center gap-0.5">
          {/* Previous */}
          <button
            onClick={() => onPageChange(safePage - 1)}
            disabled={safePage === 1}
            className={`${btnBase} gap-0.5 px-2 ${safePage === 1 ? btnDisabled : btnInactive}`}
          >
            <ChevronLeft className="w-3 h-3" />
            <span className="hidden sm:inline">Prev</span>
          </button>

          {/* Page numbers */}
          <div className="flex items-center gap-0.5 mx-1">
            {pages.map((p, i) =>
              p === "..." ? (
                <span key={`ellipsis-${i}`} className="text-[10px] text-muted-foreground/40 px-1 select-none">…</span>
              ) : (
                <button
                  key={p}
                  onClick={() => onPageChange(p)}
                  className={`${btnBase} ${p === safePage ? btnActive : btnInactive}`}
                >
                  {p}
                </button>
              )
            )}
          </div>

          {/* Next */}
          <button
            onClick={() => onPageChange(safePage + 1)}
            disabled={safePage === safePages}
            className={`${btnBase} gap-0.5 px-2 ${safePage === safePages ? btnDisabled : btnInactive}`}
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Right: page size */}
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] text-muted-foreground/50 hidden sm:block">Rows:</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="h-6 text-[10px] bg-transparent border border-border/50 rounded px-1.5 text-muted-foreground/70 hover:border-border hover:text-foreground transition-colors cursor-pointer outline-none"
        >
          {[10, 20, 50, 100].map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>
    </div>
  );
}