import React, { useState } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";

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
  confirmed_reports: "Confirmed",
  likely_reports: "Likely",
  does_not_report: "Does Not Report",
  unknown: "Unknown",
  delinquency_only: "Delinquency Only",
  optional_add_on: "Optional Add-on",
};

const CREDIT_CHECK_LABELS = {
  hard_pull: "Hard Pull",
  soft_pull: "Soft Pull",
  no_check: "No Check",
  unknown: "Unknown",
};

const CREDIT_SCORE_TIER_LABELS = {
  none: "None Required",
  poor: "Poor (300–579)",
  fair: "Fair (580–669)",
  good: "Good (670–739)",
  very_good: "Very Good (740–799)",
  excellent: "Excellent (800+)",
  unknown: "Unknown",
};

const DataRow = ({ label, value }) => {
  if (value == null || value === "" || value === false) return null;
  return (
    <div className="flex items-start justify-between gap-2">
      <span className="text-muted-foreground/60 shrink-0">{label}</span>
      <span className="text-foreground font-medium text-right">{value}</span>
    </div>
  );
};

const BoolBadge = ({ label, value }) => {
  if (!value) return null;
  return (
    <span className="inline-flex items-center text-[9px] font-medium bg-primary/8 text-primary px-1.5 py-0.5 rounded">
      {label}
    </span>
  );
};

export default function ProductDataPoints({ product, bureauCoverage }) {
  const [expanded, setExpanded] = useState(false);

  const hasPricing = product.monthly_cost != null || product.setup_fee != null || product.annual_fee != null;
  const hasLimits = product.reported_limit_min != null || product.reported_limit_max != null;

  const requirementBadges = [
    { label: "SSN", value: product.requires_ssn },
    { label: "EIN", value: product.requires_ein },
    { label: "Bank Link", value: product.requires_bank_connection },
    { label: "Business Entity", value: product.requires_business_entity },
    { label: "Personal Guarantee", value: product.requires_personal_guarantee },
    { label: "Credit Check", value: product.requires_credit_check },
    { label: "Landlord", value: product.requires_landlord_participation },
    { label: "Prop. Manager", value: product.requires_property_manager },
  ];

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
        <div className="pl-2 space-y-3 text-[10px]">

          {/* Core Identity */}
          <div className="space-y-1">
            <DataRow label="Type" value={PRODUCT_TYPE_LABELS[product.product_type] || product.product_type} />
            {product.consumer_or_business && product.consumer_or_business !== "unknown" && (
              <DataRow label="Lane" value={product.consumer_or_business === "both" ? "Consumer & Business" : product.consumer_or_business.charAt(0).toUpperCase() + product.consumer_or_business.slice(1)} />
            )}
            {product.reporting_direct_or_indirect && product.reporting_direct_or_indirect !== "unknown" && (
              <DataRow label="Reporting" value={product.reporting_direct_or_indirect.charAt(0).toUpperCase() + product.reporting_direct_or_indirect.slice(1)} />
            )}
            {product.reporting_frequency && product.reporting_frequency !== "unknown" && (
              <DataRow label="Frequency" value={product.reporting_frequency.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())} />
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <p className="text-muted-foreground/60 mb-0.5">Description</p>
              <p className="text-foreground/80 leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Bureau Coverage */}
          {bureauCoverage && bureauCoverage.length > 0 && (
            <div>
              <p className="text-muted-foreground/60 mb-1">Bureaus Reported</p>
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

          {/* Credit & Approval */}
          <div>
            <p className="text-muted-foreground/60 mb-1">Approval Profile</p>
            <div className="space-y-1">
              {product.credit_check_type && product.credit_check_type !== "unknown" && (
                <DataRow label="Credit Check" value={CREDIT_CHECK_LABELS[product.credit_check_type]} />
              )}
              {product.credit_score_tier_required && product.credit_score_tier_required !== "unknown" && (
                <DataRow label="Score Tier" value={CREDIT_SCORE_TIER_LABELS[product.credit_score_tier_required]} />
              )}
              {product.minimum_credit_score_required != null && (
                <DataRow label="Min. Score" value={product.minimum_credit_score_required} />
              )}
              {product.minimum_time_in_business_months != null && (
                <DataRow label="Time in Business" value={`${product.minimum_time_in_business_months} mo.`} />
              )}
              {product.minimum_annual_revenue != null && (
                <DataRow label="Min. Revenue" value={`$${product.minimum_annual_revenue.toLocaleString()}/yr`} />
              )}
              {product.minimum_account_age_months != null && (
                <DataRow label="Min. Account Age" value={`${product.minimum_account_age_months} mo.`} />
              )}
            </div>
          </div>

          {/* Eligibility Summary */}
          {product.eligibility_summary && (
            <div>
              <p className="text-muted-foreground/60 mb-0.5">Eligibility Notes</p>
              <p className="text-foreground/80 leading-relaxed">{product.eligibility_summary}</p>
            </div>
          )}

          {/* Requirements Badges */}
          {requirementBadges.some(b => b.value) && (
            <div>
              <p className="text-muted-foreground/60 mb-1">Requirements</p>
              <div className="flex flex-wrap gap-1">
                {requirementBadges.map(b => <BoolBadge key={b.label} label={b.label} value={b.value} />)}
              </div>
            </div>
          )}

          {/* Pricing */}
          {(hasPricing || product.pricing_summary || product.deposit_or_secured_amount != null) && (
            <div>
              <p className="text-muted-foreground/60 mb-1">Pricing & Fees</p>
              <div className="space-y-1">
                {product.monthly_cost != null && <DataRow label="Monthly" value={`$${product.monthly_cost}`} />}
                {product.setup_fee != null && <DataRow label="Setup Fee" value={`$${product.setup_fee}`} />}
                {product.annual_fee != null && <DataRow label="Annual Fee" value={`$${product.annual_fee}`} />}
                {product.deposit_or_secured_amount != null && <DataRow label="Deposit / Secured" value={`$${product.deposit_or_secured_amount.toLocaleString()}`} />}
                {product.pricing_summary && <p className="text-foreground/70 mt-0.5 leading-relaxed">{product.pricing_summary}</p>}
              </div>
            </div>
          )}

          {/* Limits */}
          {hasLimits && (
            <DataRow
              label="Reported Limit"
              value={`$${product.reported_limit_min?.toLocaleString() || "0"} – $${product.reported_limit_max?.toLocaleString() || "N/A"}`}
            />
          )}

          {/* Source */}
          {product.source_url && (
            <a
              href={product.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-primary/70 hover:text-primary transition-colors mt-1"
            >
              Source <ExternalLink className="w-2.5 h-2.5" />
            </a>
          )}

          {product.last_verified_at && (
            <p className="text-muted-foreground/50 text-[9px]">Verified: {product.last_verified_at}</p>
          )}

        </div>
      )}
    </div>
  );
}