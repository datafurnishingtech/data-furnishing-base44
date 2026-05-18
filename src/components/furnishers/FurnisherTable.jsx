import React from "react";
import { CheckCircle2, Clock, MoreVertical } from "lucide-react";
import FurnisherLogo from "@/components/shared/FurnisherLogo";
import AnimatedBar from "@/components/shared/AnimatedBar";

const COMPANY_TYPE_LABELS = {
  direct_furnisher: "Direct Furnisher",
  tradeline_provider: "Tradeline Provider",
  reporting_intermediary: "Intermediary",
  tradeline_adjacent: "Adjacent",
  credit_builder: "Credit Builder",
  credit_union: "Credit Union",
  bank: "Bank",
  rent_reporting: "Rent Reporting",
  business_credit_vendor: "Business Vendor",
  commercial_lender: "Commercial Lender",
  mortgage_lender: "Mortgage Lender",
  student_loan_servicer: "Student Loan Servicer",
  fintech_lender: "Fintech Lender",
  auto_lender: "Auto Lender",
  bnpl_pos_finance: "BNPL / POS",
  specialty_reporting_company: "Specialty Reporting",
  data_infrastructure: "Data Infrastructure",
  bureau: "Bureau",
  unknown: "Unknown",
};

export default function FurnisherTable({ companies, selected, onSelect }) {
  return (
    <div className="bg-card rounded-lg border border-border/60 overflow-hidden">
      <div className="overflow-x-auto">
      <table className="w-full min-w-[720px]">
        <thead>
          <tr className="text-[9.5px] font-medium text-muted-foreground/60 border-b border-border/50 uppercase tracking-[0.06em]">
            <th className="text-left px-4 py-2.5 font-medium">Furnisher</th>
            <th className="text-left px-3 py-2.5 font-medium">Type</th>
            <th className="text-left px-3 py-2.5 font-medium">Headquarters</th>
            <th className="text-left px-3 py-2.5 font-medium">Confidence</th>
            <th className="text-left px-3 py-2.5 font-medium">Verification</th>
            <th className="text-left px-3 py-2.5 font-medium">Last Verified</th>
            <th className="w-8"></th>
          </tr>
        </thead>
        <tbody>
          {companies.map((c) => (
            <tr
              key={c.id}
              onClick={() => onSelect(c)}
              className={`border-b border-border/30 last:border-0 hover:bg-muted/20 cursor-pointer transition-colors ${
                selected?.id === c.id ? "bg-primary/5" : ""
              }`}
            >
              <td className="px-4 py-2.5">
                <div className="flex items-center gap-2.5">
                  <FurnisherLogo
                    domain={c.website_url ? new URL(c.website_url).hostname.replace("www.", "") : ""}
                    name={c.company_name}
                    size="sm"
                  />
                  <div>
                    <p className="text-[11px] font-normal text-foreground">{c.company_name}</p>
                    <p className="text-[10px] text-muted-foreground/60">
                      {c.website_url ? new URL(c.website_url).hostname.replace("www.", "") : "—"}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-3 py-2.5 text-[11px] text-foreground/70">
                {COMPANY_TYPE_LABELS[c.company_type] || c.company_type}
              </td>
              <td className="px-3 py-2.5 text-[11px] text-foreground/70">{c.headquarters_location || "—"}</td>
              <td className="px-3 py-2.5">
                {c.confidence_score != null ? (
                  <div className="flex items-center gap-1.5">
                    <div className="w-12 h-1 bg-muted rounded-full overflow-hidden">
                      <AnimatedBar value={c.confidence_score} />
                    </div>
                    <span className="text-[10px] tabular-nums text-foreground/70">{c.confidence_score}</span>
                  </div>
                ) : (
                  <span className="text-[10px] text-muted-foreground/40">—</span>
                )}
              </td>
              <td className="px-3 py-2.5">
                <span className={`inline-flex items-center gap-1 text-[10px] font-medium ${
                  c.verification_status === "verified" ? "text-emerald-500" :
                  c.verification_status === "partially_verified" ? "text-amber-500" :
                  "text-muted-foreground/50"
                }`}>
                  {c.verification_status === "verified" ? <CheckCircle2 className="w-2.5 h-2.5" /> : <Clock className="w-2.5 h-2.5" />}
                  {c.verification_status === "verified" ? "Verified" :
                   c.verification_status === "partially_verified" ? "Partial" : "Unverified"}
                </span>
              </td>
              <td className="px-3 py-2.5 text-[10px] text-muted-foreground/60 tabular-nums">
                {c.last_verified_at || "—"}
              </td>
              <td className="px-2 py-2.5">
                <MoreVertical className="w-3.5 h-3.5 text-muted-foreground/40" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}