import React from "react";
import { ChevronDown } from "lucide-react";

const REPORTING_STATUS_OPTIONS = [
  { value: "confirmed_reports", label: "Confirmed Reports" },
  { value: "likely_reports", label: "Likely Reports" },
  { value: "optional_add_on", label: "Optional Add-on" },
  { value: "delinquency_only", label: "Delinquency Only" },
  { value: "does_not_report", label: "Does Not Report" },
  { value: "unknown", label: "Unknown" },
];

const BUREAU_TYPE_OPTIONS = [
  { value: "consumer", label: "Consumer" },
  { value: "business", label: "Business / Commercial" },
  { value: "specialty", label: "Specialty" },
  { value: "data_exchange", label: "Data Exchange" },
];

export default function CoverageFilters({ reportingStatus, bureauType, onReportingStatusChange, onBureauTypeChange }) {
  return (
    <div className="flex gap-2 items-center">
      {/* Reporting Status Dropdown */}
      <div className="relative">
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-border/60 bg-card hover:bg-muted/50 transition-colors text-[11px] font-medium text-foreground group">
          {reportingStatus ? REPORTING_STATUS_OPTIONS.find(o => o.value === reportingStatus)?.label : "Reporting Status"}
          <ChevronDown className="w-3 h-3 text-muted-foreground/60 group-hover:text-muted-foreground/80" />
        </button>
        <div className="absolute top-full left-0 mt-1 w-48 bg-card border border-border/60 rounded shadow-lg z-20 hidden group-hover:block">
          <button
            onClick={() => onReportingStatusChange(null)}
            className="w-full text-left px-3 py-2 text-[11px] text-muted-foreground/70 hover:bg-muted/30 hover:text-foreground transition-colors"
          >
            All statuses
          </button>
          {REPORTING_STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onReportingStatusChange(opt.value)}
              className={`w-full text-left px-3 py-2 text-[11px] transition-colors ${
                reportingStatus === opt.value
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-foreground hover:bg-muted/30"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bureau Type Dropdown */}
      <div className="relative">
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-border/60 bg-card hover:bg-muted/50 transition-colors text-[11px] font-medium text-foreground group">
          {bureauType ? BUREAU_TYPE_OPTIONS.find(o => o.value === bureauType)?.label : "Bureau Type"}
          <ChevronDown className="w-3 h-3 text-muted-foreground/60 group-hover:text-muted-foreground/80" />
        </button>
        <div className="absolute top-full left-0 mt-1 w-48 bg-card border border-border/60 rounded shadow-lg z-20 hidden group-hover:block">
          <button
            onClick={() => onBureauTypeChange(null)}
            className="w-full text-left px-3 py-2 text-[11px] text-muted-foreground/70 hover:bg-muted/30 hover:text-foreground transition-colors"
          >
            All types
          </button>
          {BUREAU_TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onBureauTypeChange(opt.value)}
              className={`w-full text-left px-3 py-2 text-[11px] transition-colors ${
                bureauType === opt.value
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-foreground hover:bg-muted/30"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}