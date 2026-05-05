import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const PRODUCT_TYPE_LABELS = {
  credit_builder_loan: "Credit Builder Loan",
  secured_card: "Secured Card",
  unsecured_card: "Unsecured Card",
  charge_card: "Charge Card",
  revolving_line: "Revolving Line",
  installment_account: "Installment Account",
  share_secured_loan: "Share Secured Loan",
  personal_loan: "Personal Loan",
  student_loan: "Student Loan",
  mortgage: "Mortgage",
  home_equity: "Home Equity",
  rent_reporting: "Rent Reporting",
  utility_reporting: "Utility Reporting",
  subscription_reporting: "Subscription Reporting",
  business_tradeline: "Business Tradeline",
  net_terms: "Net Terms",
  vendor_credit: "Vendor Credit",
  fleet_card: "Fleet Card",
  commercial_loan: "Commercial Loan",
  business_credit_card: "Business Credit Card",
  auto_loan: "Auto Loan",
  auto_lease: "Auto Lease",
  bnpl: "BNPL",
  pos_financing: "POS Financing",
  lease_to_own: "Lease to Own",
  specialty_data: "Specialty Data",
  bureau_data: "Bureau Data",
  api_infrastructure: "API Infrastructure",
  other: "Other",
};

const REPORTING_STATUS_LABELS = {
  confirmed_reports: "Confirmed Reports",
  likely_reports: "Likely Reports",
  does_not_report: "Does Not Report",
  unknown: "Unknown",
  delinquency_only: "Delinquency Only",
  optional_add_on: "Optional Add-on",
};

export default function ProductDataPoints({ product, bureauCoverage }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="space-y-2 border-t border-border/40 pt-2">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between text-[10.5px] font-medium text-foreground hover:text-primary transition-colors"
      >
        <span>{product.product_name}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>

      {expanded && (
        <div className="pl-2 space-y-2 text-[10px]">
          <div>
            <p className="text-muted-foreground/60">Type</p>
            <p className="text-foreground font-medium">{PRODUCT_TYPE_LABELS[product.product_type] || product.product_type}</p>
          </div>

          {product.consumer_or_business && product.consumer_or_business !== "unknown" && (
            <div>
              <p className="text-muted-foreground/60">Target</p>
              <p className="text-foreground font-medium capitalize">{product.consumer_or_business}</p>
            </div>
          )}

          {product.description && (
            <div>
              <p className="text-muted-foreground/60">Description</p>
              <p className="text-foreground/80 leading-relaxed">{product.description}</p>
            </div>
          )}

          {product.eligibility_summary && (
            <div>
              <p className="text-muted-foreground/60">Eligibility</p>
              <p className="text-foreground/80 leading-relaxed">{product.eligibility_summary}</p>
            </div>
          )}

          {(product.monthly_cost || product.setup_fee || product.annual_fee) && (
            <div>
              <p className="text-muted-foreground/60">Pricing</p>
              <div className="space-y-0.5">
                {product.monthly_cost != null && <p className="text-foreground">Monthly: ${product.monthly_cost}</p>}
                {product.setup_fee != null && <p className="text-foreground">Setup: ${product.setup_fee}</p>}
                {product.annual_fee != null && <p className="text-foreground">Annual: ${product.annual_fee}</p>}
              </div>
            </div>
          )}

          {product.reported_limit_min != null || product.reported_limit_max != null ? (
            <div>
              <p className="text-muted-foreground/60">Reported Limit</p>
              <p className="text-foreground">
                ${product.reported_limit_min?.toLocaleString() || "0"} - ${product.reported_limit_max?.toLocaleString() || "N/A"}
              </p>
            </div>
          ) : null}

          {product.reporting_frequency && product.reporting_frequency !== "unknown" && (
            <div>
              <p className="text-muted-foreground/60">Reporting Frequency</p>
              <p className="text-foreground font-medium capitalize">{product.reporting_frequency}</p>
            </div>
          )}

          {bureauCoverage && bureauCoverage.length > 0 && (
            <div>
              <p className="text-muted-foreground/60 mb-1">Bureau Coverage</p>
              <div className="space-y-1">
                {bureauCoverage.map((cov) => (
                  <div key={cov.id} className="bg-muted/30 rounded px-2 py-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">{cov.bureau_name}</span>
                      <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${
                        cov.reporting_status === "confirmed_reports"
                          ? "bg-emerald-500/10 text-emerald-600"
                          : cov.reporting_status === "likely_reports"
                          ? "bg-amber-500/10 text-amber-600"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {REPORTING_STATUS_LABELS[cov.reporting_status] || cov.reporting_status}
                      </span>
                    </div>
                    {cov.reporting_type && cov.reporting_type !== "unknown" && (
                      <p className="text-[9px] text-muted-foreground/70 mt-0.5">
                        {cov.reporting_type.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {product.requires_credit_check || product.requires_ssn || product.requires_bank_connection ? (
            <div>
              <p className="text-muted-foreground/60 mb-0.5">Requirements</p>
              <div className="space-y-0.5 text-foreground/80">
                {product.requires_credit_check && <p>✓ Credit Check</p>}
                {product.requires_ssn && <p>✓ SSN</p>}
                {product.requires_bank_connection && <p>✓ Bank Connection</p>}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}