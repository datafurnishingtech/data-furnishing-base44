import React, { useState, useEffect } from "react";
import { X, ExternalLink, ArrowRight } from "lucide-react";
import { base44 } from "@/api/base44Client";
import FurnisherLogo from "@/components/shared/FurnisherLogo";
import ProductDataPoints from "./ProductDataPoints";

const COMPANY_TYPE_LABELS = {
  direct_furnisher: "Direct Furnisher",
  tradeline_provider: "Tradeline Provider",
  reporting_intermediary: "Intermediary",
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
  bnpl_pos_finance: "BNPL / POS Finance",
  specialty_reporting_company: "Specialty Reporting",
  data_infrastructure: "Data Infrastructure",
  bureau: "Bureau",
  unknown: "Unknown",
};

export default function FurnisherDetailPanel({ company, productCount, onClose }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [products, setProducts] = useState([]);
  const [bureauCoverageMap, setBureauCoverageMap] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === "products" && products.length === 0) {
      loadProducts();
    }
  }, [activeTab]);

  if (!company) return null;

  const loadProducts = async () => {
    setLoading(true);
    try {
      const prods = await base44.entities.Product.filter({ company_id: company.id }, '-created_date', 100);
      setProducts(prods);

      // Fetch bureau coverage for each product
      const coverageMap = {};
      for (const prod of prods) {
        const coverage = await base44.entities.ProductBureauCoverage.filter({ product_id: prod.id }, '-created_date', 50);
        coverageMap[prod.id] = coverage;
      }
      setBureauCoverageMap(coverageMap);
    } catch (error) {
      console.error("Error loading products:", error);
    }
    setLoading(false);
  };

  const domain = company.website_url
    ? new URL(company.website_url).hostname.replace("www.", "")
    : "";

  return (
    <div className="w-[260px] flex-shrink-0">
      <div className="bg-card rounded-lg border border-border/60 p-4 sticky top-20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-0.5 h-3.5 bg-primary/60 rounded-full" />
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

        {/* Interactive Tabs */}
        <div className="flex flex-wrap gap-0 mb-4 border-b border-border/50">
          {[{ label: "Overview", key: "overview" }, { label: "Products", key: "products" }, { label: "Coverage", key: "coverage" }, { label: "Activity", key: "activity" }].map(({ label, key }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`text-[10.5px] px-2.5 py-1.5 border-b-2 transition-colors ${
                activeTab === key
                  ? "border-primary text-primary font-medium"
                  : "border-transparent text-muted-foreground/60 hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
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

            {/* Confidence bar */}
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
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${company.confidence_score}%` }}
                  />
                </div>
              </div>
            )}

            {/* Products count */}
            <div className="pt-2.5 border-t border-border/40">
              <h4 className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-[0.06em] mb-2">
                Products
              </h4>
              <div className="flex gap-4">
                <div className="text-center">
                  <p className="text-[16px] font-semibold text-foreground leading-none">{productCount}</p>
                  <p className="text-[9.5px] text-muted-foreground/60 mt-0.5">Total</p>
                </div>
              </div>
              <button className="flex items-center gap-1 text-[10px] text-primary/70 hover:text-primary transition-colors mt-2">
                View all products <ArrowRight className="w-2.5 h-2.5" />
              </button>
            </div>

            <button className="w-full mt-1 bg-primary text-primary-foreground text-[11px] font-medium h-7 rounded-md flex items-center justify-center gap-1.5 hover:bg-primary/90 transition-colors">
              View full profile <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}

        {activeTab === "products" && (
          <div className="space-y-2">
            {loading ? (
              <p className="text-[10px] text-muted-foreground/60">Loading products...</p>
            ) : products.length === 0 ? (
              <p className="text-[10px] text-muted-foreground/60">No products found</p>
            ) : (
              <div className="space-y-0">
                {products.map((prod) => (
                  <ProductDataPoints
                    key={prod.id}
                    product={prod}
                    bureauCoverage={bureauCoverageMap[prod.id] || []}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "coverage" && (
          <div className="text-[10px] text-muted-foreground/60">
            <p>Coverage analysis coming soon</p>
          </div>
        )}

        {activeTab === "activity" && (
          <div className="text-[10px] text-muted-foreground/60">
            <p>Activity log coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
}