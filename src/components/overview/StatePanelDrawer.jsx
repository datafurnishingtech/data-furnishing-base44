import React, { useState, useEffect } from "react";
import { X, Building2, ChevronRight, ShieldCheck, Clock, Package, Users, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import FurnisherLogo from "@/components/shared/FurnisherLogo";

const COMPANY_TYPE_LABELS = {
  direct_furnisher: "Direct Furnisher",
  tradeline_provider: "Tradeline Provider",
  reporting_intermediary: "Intermediary",
  tradeline_adjacent: "Tradeline Adjacent",
  credit_builder: "Credit Builder",
  credit_union: "Credit Union",
  bank: "Bank",
  rent_reporting: "Rent Reporting",
  business_credit_vendor: "Business Credit",
  commercial_lender: "Commercial Lender",
  mortgage_lender: "Mortgage Lender",
  student_loan_servicer: "Student Loans",
  fintech_lender: "Fintech Lender",
  auto_lender: "Auto Lender",
  bnpl_pos_finance: "BNPL / POS",
  specialty_reporting_company: "Specialty Reporting",
  data_infrastructure: "Data Infrastructure",
  bureau: "Bureau",
  unknown: "Unknown",
};

const VERIFICATION_COLORS = {
  verified: "text-emerald-500",
  partially_verified: "text-amber-500",
  unverified: "text-muted-foreground",
};

const VERIFICATION_LABELS = {
  verified: "Verified",
  partially_verified: "Partial",
  unverified: "Unverified",
};

const LANE_COLORS = {
  consumer: "bg-blue-50 text-blue-700 border-blue-200",
  business: "bg-violet-50 text-violet-700 border-violet-200",
  both: "bg-emerald-50 text-emerald-700 border-emerald-200",
  unknown: "bg-muted text-muted-foreground border-border",
};

function formatDate(dateStr) {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch (_) { return "—"; }
}

export default function StatePanelDrawer({ state, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ consumer_business: "all", verification_status: "all" });
  const [search, setSearch] = useState("");

  const fetchData = async (activeFilters) => {
    setLoading(true);
    setError(null);
    try {
      const res = await base44.functions.invoke("getCompaniesByStateDetails", {
        state: state.abbr,
        consumer_business: activeFilters.consumer_business,
        verification_status: activeFilters.verification_status,
      });
      setData(res.data);
    } catch (e) {
      setError(e.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(filters);
  }, [state.abbr]);

  const handleFilterChange = (key, value) => {
    const next = { ...filters, [key]: value };
    setFilters(next);
    fetchData(next);
  };

  const companies = (data?.companies || []).filter(c =>
    !search || c.company_name.toLowerCase().includes(search.toLowerCase())
  );
  const summary = data?.summary || {};

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />

      {/* Panel */}
      <div
        className="relative z-10 w-[520px] max-w-[95vw] h-full bg-card border-l border-border shadow-2xl flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-primary" />
              <h2 className="text-[13px] font-semibold text-foreground">{state.name}</h2>
              <span className="text-[10px] text-muted-foreground/50 font-mono">{state.abbr}</span>
            </div>
            <p className="text-[10px] text-muted-foreground/60 mt-0.5">Furnisher Coverage Intelligence</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-muted transition-colors"
          >
            <X className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>

        {/* Summary metrics */}
        {!loading && data && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border flex-shrink-0">
            <div className="bg-card px-4 py-3 text-center">
              <p className="text-[16px] font-semibold text-foreground leading-none">{summary.total ?? 0}</p>
              <p className="text-[9.5px] text-muted-foreground/60 mt-1">Total Mapped</p>
            </div>
            <div className="bg-card px-4 py-3 text-center">
              <p className="text-[16px] font-semibold text-blue-600 leading-none">{summary.consumer ?? 0}</p>
              <p className="text-[9.5px] text-muted-foreground/60 mt-1">Consumer</p>
            </div>
            <div className="bg-card px-4 py-3 text-center">
              <p className="text-[16px] font-semibold text-violet-600 leading-none">{summary.business ?? 0}</p>
              <p className="text-[9.5px] text-muted-foreground/60 mt-1">Business</p>
            </div>
            <div className="bg-card px-4 py-3 text-center">
              <p className="text-[16px] font-semibold text-foreground leading-none">
                {summary.avg_confidence != null ? `${summary.avg_confidence}` : "—"}
              </p>
              <p className="text-[9.5px] text-muted-foreground/60 mt-1">Avg. Score</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="px-4 py-3 border-b border-border flex-shrink-0 space-y-2">
          <input
            type="text"
            placeholder="Search companies..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-7 text-[11px] bg-muted/60 border border-border rounded-md px-3 placeholder:text-muted-foreground/50 outline-none focus:ring-1 focus:ring-ring"
          />
          <div className="flex gap-2">
            {/* Consumer / Business filter */}
            <div className="flex gap-1">
              {[
                { value: "all", label: "All" },
                { value: "consumer", label: "Consumer" },
                { value: "business", label: "Business" },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => handleFilterChange("consumer_business", opt.value)}
                  className={`px-2 py-1 rounded text-[10px] font-medium transition-colors ${
                    filters.consumer_business === opt.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Verification filter */}
            <select
              value={filters.verification_status}
              onChange={e => handleFilterChange("verification_status", e.target.value)}
              className="ml-auto h-6 text-[10px] bg-muted/60 border border-border rounded px-2 outline-none focus:ring-1 focus:ring-ring text-foreground"
            >
              <option value="all">All Statuses</option>
              <option value="verified">Verified</option>
              <option value="partially_verified">Partial</option>
              <option value="unverified">Unverified</option>
            </select>
          </div>
        </div>

        {/* Company list */}
        <div className="flex-1 overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center h-40">
              <div className="w-6 h-6 border-2 border-border border-t-primary rounded-full animate-spin" />
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center h-40">
              <p className="text-[11px] text-muted-foreground">{error}</p>
            </div>
          )}

          {!loading && !error && companies.length === 0 && (
            <div className="flex flex-col items-center justify-center h-40 gap-2">
              <Building2 className="w-8 h-8 text-muted-foreground/20" />
              <p className="text-[11px] text-muted-foreground/60">No furnishers mapped for {state.name}</p>
              <p className="text-[10px] text-muted-foreground/40">Try adjusting filters or check back later.</p>
            </div>
          )}

          {!loading && !error && companies.length > 0 && (
            <div className="divide-y divide-border/50">
              {companies.map(company => (
                <div key={company.id} className="px-4 py-3.5 hover:bg-muted/20 transition-colors">
                  <div className="flex items-start gap-3">
                    <FurnisherLogo
                      domain={company.website_url ? company.website_url.replace(/^https?:\/\//, "").split("/")[0] : null}
                      name={company.company_name}
                      size="md"
                    />
                    <div className="flex-1 min-w-0">
                      {/* Name + verification */}
                      <div className="flex items-center gap-2 mb-1">
                        <Link
                          to="/furnishers"
                          className="text-[12px] font-medium text-foreground hover:text-primary transition-colors truncate"
                        >
                          {company.company_name}
                        </Link>
                        <span className={`text-[9.5px] font-medium flex-shrink-0 ${VERIFICATION_COLORS[company.verification_status] || "text-muted-foreground"}`}>
                          <ShieldCheck className="w-3 h-3 inline mr-0.5" />
                          {VERIFICATION_LABELS[company.verification_status] || "—"}
                        </span>
                      </div>

                      {/* Type + Lane badges */}
                      <div className="flex items-center gap-1.5 flex-wrap mb-2">
                        <span className="text-[9.5px] text-muted-foreground/70 bg-muted px-1.5 py-0.5 rounded">
                          {COMPANY_TYPE_LABELS[company.company_type] || company.company_type}
                        </span>
                        {company.lane && company.lane !== "unknown" && (
                          <span className={`text-[9.5px] border rounded px-1.5 py-0.5 font-medium ${LANE_COLORS[company.lane]}`}>
                            {company.lane === "both" ? "Consumer + Business" : company.lane === "consumer" ? "Consumer" : "Business"}
                          </span>
                        )}
                      </div>

                      {/* Data points row */}
                      <div className="flex items-center gap-3 flex-wrap">
                        {company.product_count > 0 && (
                          <span className="flex items-center gap-1 text-[9.5px] text-muted-foreground/60">
                            <Package className="w-3 h-3" />
                            {company.product_count} product{company.product_count !== 1 ? "s" : ""}
                          </span>
                        )}
                        {company.bureau_names && company.bureau_names.length > 0 && (
                          <span className="text-[9.5px] text-muted-foreground/60">
                            Reports to: <span className="text-foreground/70">{company.bureau_names.join(", ")}</span>
                          </span>
                        )}
                        {company.confidence_score != null && (
                          <span className="text-[9.5px] text-muted-foreground/60">
                            Score: <span className="text-foreground/70 font-medium">{company.confidence_score}</span>
                          </span>
                        )}
                        {company.updated_date && (
                          <span className="flex items-center gap-1 text-[9.5px] text-muted-foreground/50 ml-auto">
                            <Clock className="w-2.5 h-2.5" />
                            {formatDate(company.updated_date)}
                          </span>
                        )}
                      </div>

                      {/* Short description */}
                      {company.short_description && (
                        <p className="text-[10px] text-muted-foreground/50 mt-1.5 line-clamp-2">
                          {company.short_description}
                        </p>
                      )}
                    </div>

                    <Link to="/furnishers" className="flex-shrink-0 mt-1">
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/30 hover:text-primary transition-colors" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {!loading && companies.length > 0 && (
          <div className="px-4 py-2.5 border-t border-border flex-shrink-0 flex items-center justify-between">
            <p className="text-[10px] text-muted-foreground/50">{companies.length} result{companies.length !== 1 ? "s" : ""} in {state.name}</p>
            <Link
              to="/furnishers"
              className="text-[10px] text-primary/70 hover:text-primary transition-colors flex items-center gap-1"
            >
              View all in registry <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}