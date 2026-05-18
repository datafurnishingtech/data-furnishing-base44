import React from "react";
import { CheckCircle2, Clock } from "lucide-react";
import FurnisherLogo from "@/components/shared/FurnisherLogo";
import AnimatedBar from "@/components/shared/AnimatedBar";

const COMPANY_TYPE_LABELS = {
  direct_furnisher: "Direct Furnisher", tradeline_provider: "Tradeline Provider",
  reporting_intermediary: "Intermediary", credit_builder: "Credit Builder",
  credit_union: "Credit Union", bank: "Bank", rent_reporting: "Rent Reporting",
  business_credit_vendor: "Business Vendor", commercial_lender: "Commercial Lender",
  mortgage_lender: "Mortgage Lender", student_loan_servicer: "Student Loan Servicer",
  fintech_lender: "Fintech Lender", auto_lender: "Auto Lender",
  bnpl_pos_finance: "BNPL / POS", specialty_reporting_company: "Specialty Reporting",
  data_infrastructure: "Data Infrastructure", bureau: "Bureau", unknown: "Unknown",
};

export default function FurnisherTable({ companies, selected, onSelect }) {
  const getDomain = (company) =>
    company.domain ||
    company.website_url?.replace(/^https?:\/\//, "").split("/")[0].replace(/^www\./, "") ||
    "";

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[600px] border-collapse">
        <thead>
          <tr className="border-b border-border/50 bg-muted/20">
            <th className="text-left px-5 py-2.5 text-[9.5px] font-medium text-muted-foreground/60 uppercase tracking-[0.06em] whitespace-nowrap">
              Furnisher
            </th>
            <th className="text-left px-4 py-2.5 text-[9.5px] font-medium text-muted-foreground/60 uppercase tracking-[0.06em] whitespace-nowrap hidden md:table-cell">
              Type
            </th>
            <th className="text-left px-4 py-2.5 text-[9.5px] font-medium text-muted-foreground/60 uppercase tracking-[0.06em] whitespace-nowrap hidden lg:table-cell">
              Headquarters
            </th>
            <th className="text-left px-4 py-2.5 text-[9.5px] font-medium text-muted-foreground/60 uppercase tracking-[0.06em] whitespace-nowrap">
              Confidence
            </th>
            <th className="text-left px-4 py-2.5 text-[9.5px] font-medium text-muted-foreground/60 uppercase tracking-[0.06em] whitespace-nowrap hidden sm:table-cell">
              Verification
            </th>
            <th className="text-left px-4 py-2.5 text-[9.5px] font-medium text-muted-foreground/60 uppercase tracking-[0.06em] whitespace-nowrap hidden xl:table-cell">
              Last Verified
            </th>
          </tr>
        </thead>
        <tbody>
          {companies.map((c) => (
            <tr
              key={c.company_id}
              onClick={() => onSelect(c)}
              className={`group border-b border-border/30 last:border-0 cursor-pointer transition-colors ${
                selected?.company_id === c.company_id
                  ? "bg-primary/5 hover:bg-primary/7"
                  : "hover:bg-muted/20"
              }`}
            >
              {/* Furnisher name + logo */}
              <td className="px-5 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <FurnisherLogo domain={getDomain(c)} name={c.company_name} size="sm" />
                  <div className="min-w-0">
                    <div className="text-[11.5px] font-medium text-foreground leading-tight truncate max-w-[180px]">
                      {c.company_name}
                    </div>
                    <div className="text-[10px] text-muted-foreground/50 truncate max-w-[180px] mt-0.5">
                      {getDomain(c) || "—"}
                    </div>
                  </div>
                </div>
              </td>

              {/* Type */}
              <td className="px-4 py-3 text-[11px] text-foreground/60 whitespace-nowrap hidden md:table-cell">
                {COMPANY_TYPE_LABELS[c.company_type] || c.company_type || "—"}
              </td>

              {/* Headquarters */}
              <td className="px-4 py-3 text-[11px] text-foreground/60 whitespace-nowrap hidden lg:table-cell">
                {c.headquarters_location || "—"}
              </td>

              {/* Confidence bar */}
              <td className="px-4 py-3">
                {c.confidence_score != null ? (
                  <div className="w-20">
                    <div className="text-[11px] font-medium text-foreground mb-1 tabular-nums">
                      {c.confidence_score}
                    </div>
                    <AnimatedBar value={c.confidence_score} />
                  </div>
                ) : (
                  <span className="text-muted-foreground/30 text-[11px]">—</span>
                )}
              </td>

              {/* Verification */}
              <td className="px-4 py-3 hidden sm:table-cell">
                <div className="flex items-center gap-1.5">
                  {c.verification_status === "verified" ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                  ) : (
                    <Clock className="w-3 h-3 text-muted-foreground/30 flex-shrink-0" />
                  )}
                  <span className={`text-[10.5px] whitespace-nowrap ${
                    c.verification_status === "verified"
                      ? "text-emerald-600"
                      : "text-muted-foreground/50"
                  }`}>
                    {c.verification_status === "verified"
                      ? "Verified"
                      : c.verification_status === "partially_verified"
                      ? "Partial"
                      : "Unverified"}
                  </span>
                </div>
              </td>

              {/* Last verified */}
              <td className="px-4 py-3 text-[10.5px] text-muted-foreground/50 whitespace-nowrap hidden xl:table-cell">
                {c.last_verified_at || "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}