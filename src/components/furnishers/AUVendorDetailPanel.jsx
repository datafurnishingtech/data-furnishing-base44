import React from "react";
import { X, ExternalLink, ArrowRight } from "lucide-react";
import FurnisherLogo from "@/components/shared/FurnisherLogo";

const VERIFICATION_STYLES = {
  verified: "bg-emerald-500/10 text-emerald-600",
  partially_verified: "bg-amber-500/10 text-amber-600",
  unverified: "bg-muted text-muted-foreground",
};

const VERIFICATION_LABELS = {
  verified: "Verified",
  partially_verified: "Partially Verified",
  unverified: "Unverified",
};

export default function AUVendorDetailPanel({ company, products, onClose }) {
  if (!company) return null;

  const domain = company.website_url
    ? (() => { try { return new URL(company.website_url).hostname.replace("www.", ""); } catch { return ""; } })()
    : "";

  const companyProducts = products.filter((p) => p.company_id === company.id);

  return (
    <div className="w-[260px] flex-shrink-0">
      <div className="bg-card rounded-lg border border-border/60 p-4 sticky top-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-0.5 h-3.5 bg-primary/60 rounded-full" />
            <h3 className="text-[11.5px] font-medium text-foreground truncate">AU Vendor</h3>
          </div>
          <button onClick={onClose}>
            <X className="w-3.5 h-3.5 text-muted-foreground/50" />
          </button>
        </div>

        {/* Identity */}
        <div className="flex items-center gap-2.5 mb-4">
          <FurnisherLogo domain={domain} name={company.company_name} size="lg" />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-medium text-foreground truncate">{company.company_name}</span>
              {company.verification_status && (
                <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded flex-shrink-0 ${VERIFICATION_STYLES[company.verification_status]}`}>
                  {VERIFICATION_LABELS[company.verification_status]}
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
          </div>
        </div>

        {/* Description */}
        {company.short_description && (
          <div className="mb-4">
            <p className="text-[10.5px] text-muted-foreground/80 leading-relaxed">
              {company.short_description}
            </p>
          </div>
        )}

        {/* Meta grid */}
        <div className="grid grid-cols-2 gap-y-2.5 gap-x-3 mb-4">
          <div>
            <p className="text-[9.5px] text-muted-foreground/60">Location</p>
            <p className="text-[10.5px] font-medium text-foreground">
              {company.headquarters_location || company.state || "—"}
            </p>
          </div>
          <div>
            <p className="text-[9.5px] text-muted-foreground/60">Country</p>
            <p className="text-[10.5px] font-medium text-foreground">{company.country || "—"}</p>
          </div>
          <div>
            <p className="text-[9.5px] text-muted-foreground/60">Confidence</p>
            <p className="text-[10.5px] font-medium text-foreground">
              {company.confidence_score != null ? `${company.confidence_score}/100` : "—"}
            </p>
          </div>
          <div>
            <p className="text-[9.5px] text-muted-foreground/60">Products</p>
            <p className="text-[10.5px] font-medium text-foreground">{companyProducts.length}</p>
          </div>
        </div>

        {/* Confidence bar */}
        {company.confidence_score != null && (
          <div className="pt-3 border-t border-border/40 mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-[0.06em]">Data Confidence</span>
              <span className={`text-[9.5px] font-medium px-1.5 py-0.5 rounded ${
                company.confidence_score >= 80 ? "bg-emerald-500/10 text-emerald-600"
                : company.confidence_score >= 65 ? "bg-amber-500/10 text-amber-600"
                : "bg-destructive/10 text-destructive"
              }`}>
                {company.confidence_score >= 80 ? "High" : company.confidence_score >= 65 ? "Medium" : "Low"}
              </span>
            </div>
            <div className="w-full h-1 bg-muted rounded-full">
              <div
                className="h-full bg-primary rounded-full"
                style={{ width: `${company.confidence_score}%` }}
              />
            </div>
          </div>
        )}

        {/* Products list */}
        {companyProducts.length > 0 && (
          <div className="pt-3 border-t border-border/40">
            <h4 className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-[0.06em] mb-2">
              Known Products ({companyProducts.length})
            </h4>
            <div className="space-y-1.5">
              {companyProducts.slice(0, 4).map((p) => (
                <div key={p.id} className="flex items-center justify-between bg-muted/30 rounded px-2.5 py-1.5">
                  <span className="text-[10px] text-foreground truncate">{p.product_name}</span>
                  {p.monthly_cost != null && (
                    <span className="text-[9.5px] text-primary font-medium ml-2 flex-shrink-0">${p.monthly_cost}/mo</span>
                  )}
                </div>
              ))}
              {companyProducts.length > 4 && (
                <p className="text-[9.5px] text-muted-foreground/50 text-center">+{companyProducts.length - 4} more</p>
              )}
            </div>
          </div>
        )}

        {/* CTA */}
        {company.website_url && (
          <a
            href={company.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full mt-4 bg-primary text-primary-foreground text-[11px] font-medium h-7 rounded-md flex items-center justify-center gap-1.5 hover:bg-primary/90 transition-colors"
          >
            Visit Vendor Site <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
}