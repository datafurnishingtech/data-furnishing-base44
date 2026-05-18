import React from "react";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const PRODUCT_TYPE_LABELS = {
  credit_builder_loan: "Credit Builder Loan", secured_card: "Secured Card",
  unsecured_card: "Unsecured Card", charge_card: "Charge Card", revolving_line: "Revolving Line",
  installment_account: "Installment Account", personal_loan: "Personal Loan",
  student_loan: "Student Loan", mortgage: "Mortgage", home_equity: "Home Equity",
  rent_reporting: "Rent Reporting", utility_reporting: "Utility Reporting",
  business_tradeline: "Business Tradeline", net_terms: "Net Terms",
  vendor_credit: "Vendor Credit", fleet_card: "Fleet Card", commercial_loan: "Commercial Loan",
  business_credit_card: "Business Credit Card", auto_loan: "Auto Loan", auto_lease: "Auto Lease",
  bnpl: "BNPL", pos_financing: "POS Financing", lease_to_own: "Lease to Own",
  specialty_data: "Specialty Data", bureau_data: "Bureau Data",
  api_infrastructure: "API Infrastructure", other: "Other",
};

const REPORTING_STATUS_LABELS = {
  confirmed_reports: "Confirmed Reports", likely_reports: "Likely Reports",
  does_not_report: "Does Not Report", unknown: "Unknown",
  delinquency_only: "Delinquency Only", optional_add_on: "Optional Add-on",
};

function formatJson(value) {
  if (value == null || value === "") return null;
  if (typeof value === "string") return value;
  try { return JSON.stringify(value, null, 2); } catch { return String(value); }
}

function Row({ label, children }) {
  if (children == null || children === "" || children === false) return null;
  return (
    <div className="flex gap-2 py-1 border-b border-border/20 last:border-0">
      <span className="text-muted-foreground/60 w-36 shrink-0">{label}</span>
      <span className="flex-1 text-foreground/80">{children}</span>
    </div>
  );
}

export default function ProductEnrichedDetail({ product, bureauCoverage = [] }) {
  const slug = product.product_slug || product.product_id;
  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-3 text-[11px]">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="font-semibold text-foreground">{product.product_name}</h4>
          <div className="text-muted-foreground/60 mt-0.5">
            {PRODUCT_TYPE_LABELS[product.product_type] || product.product_type || "—"}
            {product.consumer_or_business && product.consumer_or_business !== "unknown" ? ` · ${product.consumer_or_business}` : ""}
          </div>
        </div>
        <div className="flex gap-2">
          {product.confidence_score != null && <span className="bg-primary/10 text-primary text-[9px] px-1.5 py-0.5 rounded">Confidence {product.confidence_score}</span>}
          <Link to={`/tradelines/${slug}`} className="text-[9px] text-primary hover:underline flex items-center gap-1">
            Tradeline view <ExternalLink className="w-2.5 h-2.5" />
          </Link>
        </div>
      </div>
      {product.description && <p className="text-muted-foreground mb-2">{product.description}</p>}
      <div className="space-y-0">
        <Row label="Bureaus reported">{product.bureaus_reported?.length ? product.bureaus_reported.join(", ") : "—"}</Row>
        <Row label="Reporting relationship">{product.reporting_relationship ? String(product.reporting_relationship).replace(/_/g, " ") : "—"}</Row>
        <Row label="Reporting frequency">{product.reporting_frequency && product.reporting_frequency !== "unknown" ? String(product.reporting_frequency).replace(/_/g, " ") : null}</Row>
        <Row label="Pricing">{product.pricing_summary}</Row>
        <Row label="Monthly cost">{product.monthly_cost != null ? `$${product.monthly_cost}` : null}</Row>
        <Row label="Min credit score">{product.min_credit_score != null ? product.min_credit_score : null}</Row>
        <Row label="Last verified">{product.last_verified_at}</Row>
        <Row label="Data completeness">{product.data_completeness_score != null ? `${product.data_completeness_score}` : null}</Row>
      </div>
      {bureauCoverage.length > 0 && (
        <div className="mt-3">
          <div className="text-[10px] font-semibold text-muted-foreground/60 uppercase mb-1.5">Per-bureau reporting</div>
          {bureauCoverage.map((cov) => (
            <div key={cov.bureau} className="flex items-center justify-between py-1 border-b border-border/20 last:border-0">
              <span className="text-foreground/80">{cov.bureau_name || cov.bureau || "Bureau"}</span>
              <span className="text-muted-foreground/60">{REPORTING_STATUS_LABELS[cov.reporting_status] || cov.reporting_status || cov.reporting_relationship || ""}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}