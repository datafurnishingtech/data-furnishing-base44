import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { X, ExternalLink, ArrowRight, ChevronRight } from "lucide-react";
import FurnisherLogo from "@/components/shared/FurnisherLogo";

const COMPANY_TYPE_LABELS = {
  direct_furnisher: "Direct Furnisher",
  tradeline_provider: "Tradeline Provider",
  reporting_intermediary: "Intermediary",
  credit_builder: "Credit Builder",
  rent_reporting: "Rent Reporting",
  business_credit_vendor: "Business Vendor",
  commercial_lender: "Commercial Lender",
  auto_lender: "Auto Lender",
  bnpl_pos_finance: "BNPL / POS Finance",
  specialty_reporting_company: "Specialty Reporting",
  data_infrastructure: "Data Infrastructure",
  bureau: "Bureau",
  unknown: "Unknown",
};

const PRODUCT_TYPE_LABELS = {
  credit_builder_loan: "Credit Builder Loan",
  secured_card: "Secured Card",
  charge_card: "Charge Card",
  revolving_line: "Revolving Line",
  installment_account: "Installment",
  rent_reporting: "Rent Reporting",
  utility_reporting: "Utility Reporting",
  subscription_reporting: "Subscription",
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

const TABS = ["Overview", "Products", "Coverage", "Activity"];

export default function FurnisherDetailPanel({ company, onClose }) {
  const [activeTab, setActiveTab] = useState("Overview");

  const { data: products = [], isLoading: loadingProducts } = useQuery({
    queryKey: ["products-for-company", company?.id],
    queryFn: () => base44.entities.Product.filter({ company_id: company.id }),
    enabled: !!company?.id,
  });

  if (!company) return null;

  let domain = "";
  try {
    if (company.website_url) domain = new URL(company.website_url).hostname.replace("www.", "");
  } catch {}

  return (
    <div className="w-[260px] flex-shrink-0">
      <div className="bg-card rounded-lg border border-border/60 p-4 sticky top-20 max-h-[calc(100vh-100px)] overflow-y-auto">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-0.5 h-3.5 bg-primary/60 rounded-full flex-shrink-0" />
            <h3 className="text-[11.5px] font-medium text-foreground truncate">{company.company_name}</h3>
          </div>
          <button onClick={onClose}>
            <X className="w-3.5 h-3.5 text-muted-foreground/50" />
          </button>
        </div>

        <div className="flex items-center gap-2.5 mb-4">
          <FurnisherLogo domain={domain} name={company.company_name} size="lg" />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-medium text-foreground truncate">{company.company_name}</span>
              {company.verification_status === "verified" && (
                <span className="text-[9px] font-medium bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded flex-shrink-0">
                  Verified
                </span>
              )}
            </div>
            {domain && (
              <a
                href={company.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-muted-foreground/60 flex items-center gap-1 mt-0.5 hover:text-primary transition-colors"
              >
                {domain} <ExternalLink className="w-2.5 h-2.5" />
              </a>
            )}
            <p className="text-[10px] text-muted-foreground/60">
              {COMPANY_TYPE_LABELS[company.company_type] || company.company_type}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 mb-4 border-b border-border/50">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`text-[10.5px] px-2.5 py-1.5 border-b-2 transition-colors ${
                activeTab === t
                  ? "border-primary text-primary font-medium"
                  : "border-transparent text-muted-foreground/60 hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "Overview" && (
          <div className="space-y-3">
            {company.short_description && (
              <div>
                <h4 className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-[0.06em] mb-1.5">
                  Profile summary
                </h4>
                <p className="text-[10.5px] text-muted-foreground/80 leading-relaxed">
                  {company.short_description}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-y-2 gap-x-3">
              {company.headquarters_location && (
                <div>
                  <p className="text-[9.5px] text-muted-foreground/60">Headquarters</p>
                  <p className="text-[10.5px] font-medium text-foreground">{company.headquarters_location}</p>
                </div>
              )}
              {company.country && (
                <div>
                  <p className="text-[9.5px] text-muted-foreground/60">Country</p>
                  <p className="text-[10.5px] font-medium text-foreground">{company.country}</p>
                </div>
              )}
              {company.last_verified_at && (
                <div>
                  <p className="text-[9.5px] text-muted-foreground/60">Last verified</p>
                  <p className="text-[10.5px] font-medium text-foreground">{company.last_verified_at}</p>
                </div>
              )}
              <div>
                <p className="text-[9.5px] text-muted-foreground/60">Data confidence</p>
                <p className="text-[10.5px] font-medium text-foreground">
                  {company.confidence_score != null ? `${company.confidence_score}/100` : "—"}
                </p>
              </div>
            </div>

            {company.confidence_score != null && (
              <div className="pt-2.5 border-t border-border/40">
                <h4 className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-[0.06em] mb-2">
                  Data confidence
                </h4>
                <div className="flex items-baseline gap-2">
                  <span className="text-[18px] font-semibold text-foreground leading-none">
                    {company.confidence_score}
                  </span>
                  <span className={`text-[9.5px] font-medium px-1.5 py-0.5 rounded ${
                    company.confidence_score >= 90
                      ? "bg-emerald-500/10 text-emerald-600"
                      : company.confidence_score >= 75
                      ? "bg-amber-500/10 text-amber-600"
                      : "bg-destructive/10 text-destructive"
                  }`}>
                    {company.confidence_score >= 90 ? "High" : company.confidence_score >= 75 ? "Medium" : "Low"}
                  </span>
                </div>
                <div className="w-full h-1 bg-muted rounded-full mt-2">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${company.confidence_score}%` }} />
                </div>
              </div>
            )}

            <div className="pt-2.5 border-t border-border/40">
              <div className="flex items-center justify-between mb-1.5">
                <h4 className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-[0.06em]">Products</h4>
                <span className="text-[10px] font-semibold text-foreground">{products.length}</span>
              </div>
              <button
                className="flex items-center gap-1 text-[10px] text-primary/70 hover:text-primary transition-colors"
                onClick={() => setActiveTab("Products")}
              >
                View all products <ArrowRight className="w-2.5 h-2.5" />
              </button>
            </div>

            <button className="w-full mt-1 bg-primary text-primary-foreground text-[11px] font-medium h-7 rounded-md flex items-center justify-center gap-1.5 hover:bg-primary/90 transition-colors">
              View full profile <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === "Products" && (
          <div>
            {loadingProducts ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : products.length === 0 ? (
              <p className="text-[10.5px] text-muted-foreground/60 text-center py-8">No products on file for this furnisher.</p>
            ) : (
              <div className="space-y-1.5">
                {products.map((p) => (
                  <div key={p.id} className="flex items-center justify-between gap-2 p-2 rounded-md hover:bg-muted/30 cursor-pointer group">
                    <div className="min-w-0">
                      <p className="text-[10.5px] font-medium text-foreground truncate">{p.product_name}</p>
                      <p className="text-[9.5px] text-muted-foreground/60">{PRODUCT_TYPE_LABELS[p.product_type] || p.product_type}</p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${
                        p.status === "verified"
                          ? "bg-emerald-500/10 text-emerald-600"
                          : p.status === "pending_review"
                          ? "bg-amber-500/10 text-amber-600"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {p.status || "draft"}
                      </span>
                      <ChevronRight className="w-3 h-3 text-muted-foreground/30 group-hover:text-muted-foreground/60" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Coverage & Activity tabs — coming soon placeholder */}
        {(activeTab === "Coverage" || activeTab === "Activity") && (
          <div className="flex items-center justify-center py-10">
            <p className="text-[10.5px] text-muted-foreground/50">Coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
}