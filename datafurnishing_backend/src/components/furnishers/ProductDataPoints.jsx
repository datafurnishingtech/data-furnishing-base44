import React, { useState } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const PRODUCT_TYPE_LABELS = {
  credit_builder_loan: "Credit Builder Loan", secured_card: "Secured Card", unsecured_card: "Unsecured Card",
  charge_card: "Charge Card", revolving_line: "Revolving Line", installment_account: "Installment Account",
  personal_loan: "Personal Loan", student_loan: "Student Loan", mortgage: "Mortgage",
  auto_loan: "Auto Loan", auto_lease: "Auto Lease", bnpl: "BNPL", pos_financing: "POS Financing",
  business_tradeline: "Business Tradeline", business_credit_card: "Business Credit Card",
  rent_reporting: "Rent Reporting", other: "Other",
};

const REPORTING_STATUS_LABELS = {
  confirmed_reports: "Confirmed Reports", likely_reports: "Likely Reports",
  does_not_report: "Does Not Report", unknown: "Unknown",
};

export default function ProductDataPoints({ product, bureauCoverage }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="py-2 border-b border-border/30 last:border-0">
      <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center justify-between text-[10.5px] font-medium text-foreground hover:text-primary transition-colors">
        {product.product_name}
        <ChevronDown className={`w-3 h-3 text-muted-foreground/60 transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>
      {expanded && (
        <div className="mt-2 space-y-1.5 pl-2 text-[10px] text-muted-foreground">
          {product.product_type && <div><span className="font-medium text-foreground/70">Type:</span> {PRODUCT_TYPE_LABELS[product.product_type] || product.product_type}</div>}
          {product.description && <div><span className="font-medium text-foreground/70">Description:</span> {product.description}</div>}
          {product.bureaus_reported?.length > 0 && <div><span className="font-medium text-foreground/70">Bureaus:</span> {product.bureaus_reported.join(", ")}</div>}
          {product.reporting_frequency && product.reporting_frequency !== "unknown" && <div><span className="font-medium text-foreground/70">Frequency:</span> {product.reporting_frequency}</div>}
          {bureauCoverage?.length > 0 && (
            <div className="mt-1">
              <span className="font-medium text-foreground/70">Bureau Coverage:</span>
              {bureauCoverage.map((cov) => (
                <div key={cov.bureau} className="ml-2 flex items-center gap-1.5">
                  <span>{cov.bureau_name || cov.bureau}:</span>
                  <span className="text-foreground/60">{REPORTING_STATUS_LABELS[cov.reporting_status] || cov.reporting_relationship || "Unknown"}</span>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center gap-2 mt-1.5">
            <Link to={`/tradelines/${product.product_slug || product.product_id}`} className="text-primary hover:underline flex items-center gap-1">
              See details <ExternalLink className="w-2.5 h-2.5" />
            </Link>
            {product.apply_url && (
              <a href={product.apply_url} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">Apply now</a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}