import React, { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SEGMENTS = [
  {
    label: "Traditional Banking",
    types: [
      { value: "bank", label: "National / Regional Bank" },
      { value: "credit_union", label: "Credit Union" },
    ],
  },
  {
    label: "Card Issuers",
    types: [
      { value: "direct_furnisher", label: "Private Label / Co-Brand" },
      { value: "tradeline_provider", label: "General Purpose Issuer" },
    ],
  },
  {
    label: "Installment Lenders",
    types: [
      { value: "auto_lender", label: "Auto Lender" },
      { value: "mortgage_lender", label: "Mortgage Lender" },
      { value: "student_loan_servicer", label: "Student Loan Servicer" },
      { value: "fintech_lender", label: "Personal / Fintech Lender" },
      { value: "commercial_lender", label: "Commercial Lender" },
    ],
  },
  {
    label: "Credit Builders",
    types: [
      { value: "credit_builder", label: "Credit Builder" },
    ],
  },
  {
    label: "Business Credit",
    types: [
      { value: "business_credit_vendor", label: "Business Credit Vendor" },
      { value: "bnpl_pos_finance", label: "BNPL / POS Finance" },
    ],
  },
  {
    label: "Alternative Data",
    types: [
      { value: "rent_reporting", label: "Rent Reporting" },
      { value: "specialty_reporting_company", label: "Specialty Reporting" },
      { value: "reporting_intermediary", label: "Reporting Intermediary" },
    ],
  },
  {
    label: "Infrastructure & Data",
    types: [
      { value: "data_infrastructure", label: "Data Infrastructure" },
      { value: "bureau", label: "Bureau" },
    ],
  },
];

const ALL_TYPES = SEGMENTS.flatMap((s) => s.types);

function getLabel(value) {
  if (value === "all") return "All Types";
  const found = ALL_TYPES.find((t) => t.value === value);
  return found ? found.label : value;
}

const VERIFICATION_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "verified", label: "Verified" },
  { value: "partially_verified", label: "Partially Verified" },
  { value: "unverified", label: "Unverified" },
];

function TypePopover({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 h-7 px-2.5 rounded-md border border-border/60 text-[11px] text-muted-foreground bg-transparent hover:bg-muted/30 transition-colors"
      >
        <span>{getLabel(value)}</span>
        <ChevronDown className="w-3 h-3 opacity-50" />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-56 bg-popover border border-border/60 rounded-lg shadow-lg z-50 py-1 max-h-80 overflow-y-auto">
          <button
            onClick={() => { onChange("all"); setOpen(false); }}
            className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] hover:bg-muted/40 transition-colors"
          >
            <span className="font-medium text-foreground">All Types</span>
            {value === "all" && <Check className="w-3 h-3 text-primary" />}
          </button>
          <div className="h-px bg-border/50 my-1" />

          {SEGMENTS.map((seg) => (
            <div key={seg.label}>
              <div className="flex items-center gap-1.5 px-3 py-1 mt-1">
                <span className="text-[9.5px] font-semibold uppercase tracking-[0.07em] text-muted-foreground/60">{seg.label}</span>
              </div>
              {seg.types.map((t) => (
                <button
                  key={t.value}
                  onClick={() => { onChange(t.value); setOpen(false); }}
                  className="w-full flex items-center justify-between px-3 pl-7 py-1.5 text-[11px] hover:bg-muted/40 transition-colors"
                >
                  <span className={value === t.value ? "text-primary font-medium" : "text-foreground/80"}>{t.label}</span>
                  {value === t.value && <Check className="w-3 h-3 text-primary" />}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function FurnisherFilters({ search, onSearch, typeFilter, onTypeFilter, verificationFilter, onVerificationFilter, onClear, totalCount }) {
  return (
    <div className="space-y-3 mb-4">
      <div className="flex flex-wrap items-center gap-2">
        <TypePopover value={typeFilter} onChange={onTypeFilter} />

        <Select value={verificationFilter} onValueChange={onVerificationFilter}>
          <SelectTrigger className="w-auto min-w-[140px] h-7 text-[11px] border-border/60 text-muted-foreground font-normal">
            <SelectValue placeholder="Verification" />
          </SelectTrigger>
          <SelectContent>
            {VERIFICATION_OPTIONS.map((v) => (
              <SelectItem key={v.value} value={v.value}>{v.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <button
          onClick={onClear}
          className="text-[11px] text-primary/70 hover:text-primary font-normal ml-auto"
        >
          Clear all
        </button>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/60" />
          <Input
            placeholder="Search furnishers by name, description..."
            className="pl-8 h-7 text-[11px] border-border/60"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <span className="text-[10px] text-muted-foreground/60 whitespace-nowrap">{totalCount} results</span>
        <Button variant="outline" size="sm" className="text-[11px] h-7 px-2.5 font-normal text-muted-foreground border-border/60">
          Export
        </Button>
      </div>
    </div>
  );
}