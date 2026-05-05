import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search, Loader2, CheckCircle2, AlertCircle, ChevronDown, ChevronUp,
  Building2, Package, Database, ArrowRight, Plus, RotateCcw
} from "lucide-react";

const STATUS_COLORS = {
  confirmed_reports: "text-emerald-600 bg-emerald-500/10",
  likely_reports: "text-blue-600 bg-blue-500/10",
  does_not_report: "text-muted-foreground bg-muted",
  unknown: "text-muted-foreground bg-muted",
  delinquency_only: "text-amber-600 bg-amber-500/10",
  optional_add_on: "text-purple-600 bg-purple-500/10",
};

export default function ResearchPipeline() {
  const [companyName, setCompanyName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [expandedProducts, setExpandedProducts] = useState({});

  async function handleResearch() {
    if (!companyName.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setSavedSuccess(false);

    const res = await base44.functions.invoke("researchFurnisher", {
      company_name: companyName.trim(),
      website_url: websiteUrl.trim() || undefined,
    });

    setLoading(false);
    if (res.data?.success) {
      setResult(res.data.data);
      setExpandedProducts({});
    } else {
      setError("Research failed. Please try again.");
    }
  }

  async function handleSave() {
    if (!result) return;
    setSaving(true);
    const res = await base44.functions.invoke("saveFurnisherResearch", result);
    setSaving(false);
    if (res.data?.success) {
      setSavedSuccess(true);
    } else {
      setError("Save failed. Please try again.");
    }
  }

  function handleReset() {
    setCompanyName("");
    setWebsiteUrl("");
    setResult(null);
    setError(null);
    setSavedSuccess(false);
  }

  function toggleProduct(name) {
    setExpandedProducts((prev) => ({ ...prev, [name]: !prev[name] }));
  }

  function coverageForProduct(productName) {
    return (result?.bureau_coverage || []).filter((c) => c.product_name === productName);
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-[15px] font-semibold text-foreground tracking-tight">Research Pipeline</h1>
        <p className="text-[11px] text-muted-foreground/70 mt-0.5">
          AI-powered furnisher research — enter a company name and we'll extract structured bureau coverage data automatically.
        </p>
      </div>

      {/* Input card */}
      <div className="bg-card rounded-lg border border-border/60 p-5 mb-5">
        <div className="flex items-center gap-2 mb-1">
          <Search className="w-3.5 h-3.5 text-primary/70" />
          <h2 className="text-[12px] font-medium text-foreground">Research a furnisher</h2>
        </div>
        <p className="text-[10.5px] text-muted-foreground/60 mb-4">
          We'll use live web data to populate Company, Product, and Bureau Coverage fields ready for your review.
        </p>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-[0.05em] mb-1.5 block">
              Company name *
            </label>
            <Input
              placeholder="e.g. Self Financial"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleResearch()}
              className="h-8 text-[12px]"
              disabled={loading}
            />
          </div>
          <div>
            <label className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-[0.05em] mb-1.5 block">
              Website URL (optional)
            </label>
            <Input
              placeholder="e.g. https://www.self.inc"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              className="h-8 text-[12px]"
              disabled={loading}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleResearch}
            disabled={loading || !companyName.trim()}
            className="h-8 text-[12px] gap-2"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
            {loading ? "Researching…" : "Research furnisher"}
          </Button>
          {result && (
            <Button variant="ghost" size="sm" onClick={handleReset} className="h-8 text-[11px] gap-1.5 text-muted-foreground">
              <RotateCcw className="w-3 h-3" /> Reset
            </Button>
          )}
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="bg-card rounded-lg border border-border/60 p-10 flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
          <p className="text-[11.5px] text-muted-foreground">
            Researching <strong>{companyName}</strong> across the web…
          </p>
          <p className="text-[10.5px] text-muted-foreground/60">This may take 10–20 seconds</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-3 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
          <p className="text-[11.5px] text-destructive">{error}</p>
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="space-y-4">
          {/* Company card */}
          <div className="bg-card rounded-lg border border-border/60 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="w-3.5 h-3.5 text-primary/70" />
              <h2 className="text-[12px] font-medium text-foreground">Company profile</h2>
              <span className="ml-auto text-[10px] text-muted-foreground/60 bg-muted px-2 py-0.5 rounded-full">
                Confidence: {result.company?.confidence_score ?? "—"}/100
              </span>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {[
                { label: "Company Name", value: result.company?.company_name },
                { label: "Legal Name", value: result.company?.legal_name },
                { label: "Type", value: result.company?.company_type },
                { label: "Headquarters", value: result.company?.headquarters_location },
                { label: "Website", value: result.company?.website_url },
                { label: "Country / State", value: [result.company?.country, result.company?.state].filter(Boolean).join(" / ") || null },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-[9.5px] text-muted-foreground/60 uppercase tracking-[0.05em] mb-0.5">{label}</p>
                  <p className="text-[11px] font-normal text-foreground">{value || "—"}</p>
                </div>
              ))}
            </div>
            {result.company?.short_description && (
              <div className="mt-3 pt-3 border-t border-border/40">
                <p className="text-[9.5px] text-muted-foreground/60 uppercase tracking-[0.05em] mb-1">Summary</p>
                <p className="text-[11px] text-muted-foreground/80">{result.company.short_description}</p>
              </div>
            )}
            {result.company?.long_description && (
              <p className="text-[10.5px] text-muted-foreground/70 mt-1.5 leading-relaxed">
                {result.company.long_description}
              </p>
            )}
          </div>

          {/* Products */}
          {result.products?.length > 0 && (
            <div className="bg-card rounded-lg border border-border/60 overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-border/50">
                <Package className="w-3.5 h-3.5 text-primary/70" />
                <h2 className="text-[12px] font-medium text-foreground">Products found</h2>
                <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full ml-1">
                  {result.products.length}
                </span>
              </div>
              <div className="divide-y divide-border/40">
                {result.products.map((product) => {
                  const coverage = coverageForProduct(product.product_name);
                  const isExpanded = expandedProducts[product.product_name];
                  return (
                    <div key={product.product_name} className="px-5 py-3">
                      <button
                        onClick={() => toggleProduct(product.product_name)}
                        className="w-full flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-2 text-left">
                          <span className="text-[11.5px] font-medium text-foreground">{product.product_name}</span>
                          <span className="text-[9.5px] text-muted-foreground/60 bg-muted px-1.5 py-0.5 rounded">
                            {product.product_type}
                          </span>
                          <span className="text-[9.5px] text-muted-foreground/60">{product.consumer_or_business}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-muted-foreground/60">{coverage.length} bureaus</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground/40" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground/40" />}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="mt-3 space-y-3">
                          {product.description && (
                            <p className="text-[10.5px] text-muted-foreground/70">{product.description}</p>
                          )}
                          <div className="grid grid-cols-3 gap-2 text-[10px]">
                            {product.pricing_summary && (
                              <div><span className="text-muted-foreground/60">Pricing: </span>{product.pricing_summary}</div>
                            )}
                            {product.reporting_frequency && (
                              <div><span className="text-muted-foreground/60">Reporting: </span>{product.reporting_frequency}</div>
                            )}
                            {product.requires_credit_check !== undefined && product.requires_credit_check !== null && (
                              <div><span className="text-muted-foreground/60">Credit check: </span>{product.requires_credit_check ? "Yes" : "No"}</div>
                            )}
                          </div>

                          {coverage.length > 0 && (
                            <div>
                              <p className="text-[9.5px] text-muted-foreground/60 uppercase tracking-[0.05em] mb-1.5">Bureau coverage</p>
                              <div className="flex flex-wrap gap-1.5">
                                {coverage.map((c) => (
                                  <span
                                    key={c.bureau_abbr}
                                    className={`text-[10px] font-medium px-2 py-0.5 rounded ${STATUS_COLORS[c.reporting_status] || "text-muted-foreground bg-muted"}`}
                                  >
                                    {c.bureau_abbr} · {c.reporting_status?.replace(/_/g, " ")}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bureau coverage summary */}
          {result.bureau_coverage?.length > 0 && (
            <div className="bg-card rounded-lg border border-border/60 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Database className="w-3.5 h-3.5 text-primary/70" />
                <h2 className="text-[12px] font-medium text-foreground">Bureau coverage summary</h2>
                <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full ml-1">
                  {result.bureau_coverage.length} signals
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {Array.from(new Set(result.bureau_coverage.map(c => c.bureau_abbr))).map((abbr) => {
                  const entries = result.bureau_coverage.filter(c => c.bureau_abbr === abbr);
                  const confirmed = entries.some(e => e.reporting_status === "confirmed_reports");
                  return (
                    <span
                      key={abbr}
                      className={`text-[10.5px] font-semibold px-2.5 py-1 rounded ${confirmed ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground/70"}`}
                    >
                      {abbr}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Save actions */}
          <div className="bg-card rounded-lg border border-border/60 px-5 py-4 flex items-center justify-between">
            <div>
              <p className="text-[11.5px] font-medium text-foreground">Ready to save?</p>
              <p className="text-[10.5px] text-muted-foreground/60 mt-0.5">
                Saves as <span className="font-medium text-foreground">pending_review</span> — you can verify and approve in the Furnisher Registry.
              </p>
            </div>
            {savedSuccess ? (
              <div className="flex items-center gap-1.5 text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-[11.5px] font-medium">Saved!</span>
              </div>
            ) : (
              <Button onClick={handleSave} disabled={saving} className="h-8 text-[12px] gap-2">
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                {saving ? "Saving…" : "Save to database"}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}