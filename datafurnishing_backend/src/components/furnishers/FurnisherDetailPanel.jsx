import React, { useState, useEffect } from "react";
import { X, ExternalLink } from "lucide-react";
import FurnisherLogo from "@/components/shared/FurnisherLogo";
import ProductDataPoints from "./ProductDataPoints";
import AnimatedBar from "@/components/shared/AnimatedBar";
import { listProductsPaged, listProductBureauReporting } from "@/services/intelligenceService";

const COMPANY_TYPE_LABELS = {
  direct_furnisher: "Direct Furnisher", tradeline_provider: "Tradeline Provider",
  reporting_intermediary: "Intermediary", credit_builder: "Credit Builder",
  credit_union: "Credit Union", bank: "Bank", rent_reporting: "Rent Reporting",
  business_credit_vendor: "Business Vendor", commercial_lender: "Commercial Lender",
  mortgage_lender: "Mortgage Lender", student_loan_servicer: "Student Loan Servicer",
  fintech_lender: "Fintech Lender", auto_lender: "Auto Lender",
  bnpl_pos_finance: "BNPL / POS Finance", specialty_reporting_company: "Specialty Reporting",
  data_infrastructure: "Data Infrastructure", bureau: "Bureau", unknown: "Unknown",
};

export default function FurnisherDetailPanel({ company, productCount, onClose, onOpenFullProfile }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [products, setProducts] = useState([]);
  const [bureauCoverageMap, setBureauCoverageMap] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => { setProducts([]); setBureauCoverageMap({}); }, [company?.company_id]);

  useEffect(() => {
    if (company && activeTab === "products" && products.length === 0) loadProducts();
  }, [activeTab, company]);

  if (!company) return null;

  const loadProducts = async () => {
    setLoading(true);
    const { rows: prods } = await listProductsPaged({ companyId: company.company_id, page: 1, pageSize: 80, search: "", productType: "all", bureau: "all", target: "all" });
    setProducts(prods);
    const coverageMap = {};
    const coverage = await listProductBureauReporting(prods.map((p) => p.product_id));
    coverage.forEach((item) => { coverageMap[item.product_id] = [...(coverageMap[item.product_id] || []), item]; });
    setBureauCoverageMap(coverageMap);
    setLoading(false);
  };

  const domain = company.domain || company.website_url?.replace(/^https?:\/\//, "").split("/")[0].replace(/^www\./, "") || "";
  const tabs = [{ label: "Overview", key: "overview" }, { label: "Products", key: "products" }, { label: "Coverage", key: "coverage" }, { label: "Activity", key: "activity" }];

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-start justify-between px-4 pt-4 pb-3.5 border-b border-border/50">
        <div className="flex items-center gap-3 min-w-0">
          <FurnisherLogo domain={domain} name={company.company_name} size="md" />
          <div className="min-w-0">
            <div className="text-[12px] font-semibold text-foreground leading-tight truncate">{company.company_name}</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              {company.verification_status === "verified" && (
                <span className="text-[9px] bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded font-medium leading-none">Verified</span>
              )}
              {domain && (
                <span className="text-[9px] text-muted-foreground/40 truncate">{domain}</span>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-muted-foreground/30 hover:text-muted-foreground transition-colors p-0.5 mt-0.5"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border/50 px-3 gap-0.5">
        {tabs.map(({ label, key }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`text-[10.5px] px-2.5 py-2 border-b-2 transition-colors flex-shrink-0 ${
              activeTab === key
                ? "border-primary text-primary font-medium"
                : "border-transparent text-muted-foreground/50 hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 text-[11px]">
        {activeTab === "overview" && (
          <div className="space-y-4">
            {company.short_description && (
              <p className="text-[10.5px] text-muted-foreground/70 leading-relaxed">{company.short_description}</p>
            )}
            <div className="space-y-2">
              {[
                company.headquarters_location && ["Headquarters", company.headquarters_location],
                company.country && ["Country", company.country],
                company.last_verified_at && ["Last verified", company.last_verified_at],
                ["Data confidence", company.confidence_score != null ? `${company.confidence_score}/100` : "—"],
              ].filter(Boolean).map(([label, val]) => (
                <div key={label} className="flex items-center justify-between gap-2">
                  <span className="text-[10px] text-muted-foreground/50 shrink-0">{label}</span>
                  <span className="text-[10.5px] font-medium text-foreground/80 text-right">{val}</span>
                </div>
              ))}
            </div>
            {company.confidence_score != null && (
              <AnimatedBar value={company.confidence_score} />
            )}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-muted-foreground/50">Products tracked</span>
              <span className="text-[12px] font-semibold text-foreground tabular-nums">{productCount}</span>
            </div>
            <button
              onClick={() => onOpenFullProfile?.(company)}
              className="w-full bg-primary text-primary-foreground text-[11px] font-medium h-8 rounded-md flex items-center justify-center gap-1.5 hover:bg-primary/90 transition-colors mt-1"
            >
              View full profile <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        )}
        {activeTab === "products" && (
          <div>
            {loading
              ? <div className="text-center py-6 text-[10.5px] text-muted-foreground/50">Loading products…</div>
              : products.length === 0
              ? <div className="text-center py-6 text-[10.5px] text-muted-foreground/50">No products found</div>
              : products.map((prod) => (
                <ProductDataPoints key={prod.product_id} product={prod} bureauCoverage={bureauCoverageMap[prod.product_id]} />
              ))
            }
          </div>
        )}
        {activeTab === "coverage" && (
          <div className="space-y-2">
            {[
              ["Detected bureaus", company.detected_bureaus || "—"],
              ["Reporting relationship", company.reporting_relationship || "Unknown"],
              ["API available", company.api_available ? "Yes" : "No / unknown"],
            ].map(([label, val]) => (
              <div key={label} className="flex items-center justify-between gap-2">
                <span className="text-[10px] text-muted-foreground/50 shrink-0">{label}</span>
                <span className="text-[10.5px] font-medium text-foreground/80 text-right">{val}</span>
              </div>
            ))}
          </div>
        )}
        {activeTab === "activity" && (
          <div className="space-y-2">
            {[
              ["Enrichment status", company.enrichment_status || "Unknown"],
              ["Crawl status", company.crawl_status || "Unknown"],
              ["Last updated", company.updated_at ? new Date(company.updated_at).toLocaleDateString() : "—"],
            ].map(([label, val]) => (
              <div key={label} className="flex items-center justify-between gap-2">
                <span className="text-[10px] text-muted-foreground/50 shrink-0">{label}</span>
                <span className="text-[10.5px] font-medium text-foreground/80 text-right">{val}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}