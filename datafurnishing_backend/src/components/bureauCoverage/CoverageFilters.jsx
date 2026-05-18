import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const REPORTING_STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "pending", label: "Pending" },
];

const BUREAU_TYPE_OPTIONS = [
  { value: "all", label: "All bureau types" },
  { value: "consumer", label: "Consumer" },
  { value: "business", label: "Business" },
  { value: "specialty", label: "Specialty" },
];

function FilterDropdown({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectedLabel = options.find((o) => o.value === value)?.label || label;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-border/60 bg-card text-[11px] font-medium text-foreground transition-colors hover:bg-muted/50"
      >
        {selectedLabel}
        <ChevronDown className="w-3 h-3 text-muted-foreground/60 group-hover:opacity-100 transition-opacity" />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-card border border-border/60 rounded shadow-lg z-20">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full text-left px-3 py-2 text-[11px] transition-colors hover:bg-muted/50 hover:text-foreground ${
                value === opt.value ? "bg-primary/5 text-primary font-medium" : "text-foreground/70"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CoverageFilters({ statusFilter, onStatusChange, typeFilter, onTypeChange }) {
  return (
    <div className="flex gap-2 items-center">
      <FilterDropdown
        label="Reporting Status"
        options={REPORTING_STATUS_OPTIONS}
        value={statusFilter}
        onChange={onStatusChange}
      />
      <FilterDropdown
        label="Bureau Type"
        options={BUREAU_TYPE_OPTIONS}
        value={typeFilter}
        onChange={onTypeChange}
      />
    </div>
  );
}