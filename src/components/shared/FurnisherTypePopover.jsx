import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export const SEGMENTS = [
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

export const ALL_TYPES = SEGMENTS.flatMap((s) => s.types);

export function getTypeLabel(value) {
  if (!value || value === "all") return "All Types";
  const found = ALL_TYPES.find((t) => t.value === value);
  return found ? found.label : value;
}

export default function FurnisherTypePopover({ value, onChange }) {
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
        className="flex items-center gap-1.5 h-7 px-2.5 rounded-md border border-border/60 text-[11px] text-foreground/70 bg-card hover:bg-muted/50 hover:text-foreground transition-colors w-[140px] justify-between"
      >
        <span className="truncate flex-1 text-left">{getTypeLabel(value)}</span>
        <ChevronDown className="w-3 h-3 opacity-50 flex-shrink-0" />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-56 bg-popover border border-border/60 rounded-lg shadow-lg z-50 py-1 max-h-80 overflow-y-auto">
          <button
            onClick={() => { onChange("all"); setOpen(false); }}
            className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] text-foreground/70 hover:bg-muted/50 hover:text-foreground transition-colors"
          >
            <span className="font-medium">All Types</span>
            {(!value || value === "all") && <Check className="w-3 h-3 text-primary" />}
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
                  className="w-full flex items-center justify-between px-3 pl-7 py-1.5 text-[11px] text-foreground/70 hover:bg-muted/50 hover:text-foreground transition-colors"
                >
                  <span className={value === t.value ? "text-primary font-medium" : ""}>{t.label}</span>
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