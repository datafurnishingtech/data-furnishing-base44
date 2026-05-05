import React from "react";
import FurnisherLogo from "@/components/shared/FurnisherLogo";
import { ExternalLink } from "lucide-react";

const VERIFICATION_STYLES = {
  verified: "bg-emerald-500/10 text-emerald-600",
  partially_verified: "bg-amber-500/10 text-amber-600",
  unverified: "bg-muted text-muted-foreground",
};

const VERIFICATION_LABELS = {
  verified: "Verified",
  partially_verified: "Partial",
  unverified: "Unverified",
};

export default function AUVendorTable({ companies, products, selected, onSelect }) {
  // Index products by company_id
  const productsByCompany = products.reduce((acc, p) => {
    if (!acc[p.company_id]) acc[p.company_id] = [];
    acc[p.company_id].push(p);
    return acc;
  }, {});

  return (
    <div className="bg-card rounded-lg border border-border/60 overflow-hidden">
      <table className="w-full text-[11px]">
        <thead>
          <tr className="border-b border-border/50 bg-muted/30">
            <th className="text-left px-4 py-2.5 text-[10px] font-medium text-muted-foreground/70 uppercase tracking-[0.06em]">Vendor</th>
            <th className="text-left px-3 py-2.5 text-[10px] font-medium text-muted-foreground/70 uppercase tracking-[0.06em]">Website</th>
            <th className="text-left px-3 py-2.5 text-[10px] font-medium text-muted-foreground/70 uppercase tracking-[0.06em]">Location</th>
            <th className="text-center px-3 py-2.5 text-[10px] font-medium text-muted-foreground/70 uppercase tracking-[0.06em]">Products</th>
            <th className="text-center px-3 py-2.5 text-[10px] font-medium text-muted-foreground/70 uppercase tracking-[0.06em]">Confidence</th>
            <th className="text-center px-3 py-2.5 text-[10px] font-medium text-muted-foreground/70 uppercase tracking-[0.06em]">Status</th>
          </tr>
        </thead>
        <tbody>
          {companies.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center py-12 text-muted-foreground/50">No AU vendors found.</td>
            </tr>
          )}
          {companies.map((company) => {
            const domain = company.website_url
              ? (() => { try { return new URL(company.website_url).hostname.replace("www.", ""); } catch { return ""; } })()
              : "";
            const pCount = (productsByCompany[company.id] || []).length;
            const isSelected = selected?.id === company.id;

            return (
              <tr
                key={company.id}
                onClick={() => onSelect(company)}
                className={`border-b border-border/30 cursor-pointer transition-colors ${
                  isSelected ? "bg-primary/5" : "hover:bg-muted/30"
                }`}
              >
                {/* Vendor */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <FurnisherLogo domain={domain} name={company.company_name} size="sm" />
                    <div className="min-w-0">
                      <p className="font-medium text-foreground truncate">{company.company_name}</p>
                      {company.short_description && (
                        <p className="text-[10px] text-muted-foreground/60 truncate max-w-[220px]">
                          {company.short_description}
                        </p>
                      )}
                    </div>
                  </div>
                </td>

                {/* Website */}
                <td className="px-3 py-3">
                  {domain ? (
                    <a
                      href={company.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 text-primary/70 hover:text-primary transition-colors"
                    >
                      {domain} <ExternalLink className="w-2.5 h-2.5 flex-shrink-0" />
                    </a>
                  ) : (
                    <span className="text-muted-foreground/40">—</span>
                  )}
                </td>

                {/* Location */}
                <td className="px-3 py-3 text-muted-foreground/70">
                  {company.headquarters_location || company.state || "—"}
                </td>

                {/* Products */}
                <td className="px-3 py-3 text-center">
                  <span className={`font-medium ${pCount > 0 ? "text-foreground" : "text-muted-foreground/40"}`}>
                    {pCount > 0 ? pCount : "—"}
                  </span>
                </td>

                {/* Confidence */}
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2 justify-center">
                    <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${company.confidence_score || 0}%` }}
                      />
                    </div>
                    <span className="text-muted-foreground/70 w-6 text-right">
                      {company.confidence_score ?? "—"}
                    </span>
                  </div>
                </td>

                {/* Status */}
                <td className="px-3 py-3 text-center">
                  <span className={`text-[9.5px] font-medium px-2 py-0.5 rounded ${VERIFICATION_STYLES[company.verification_status] || "bg-muted text-muted-foreground"}`}>
                    {VERIFICATION_LABELS[company.verification_status] || company.verification_status}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}