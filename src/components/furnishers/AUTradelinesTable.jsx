import React from "react";
import { CheckCircle2, MoreVertical } from "lucide-react";
import FurnisherLogo from "@/components/shared/FurnisherLogo";

const BUREAU_LABELS = {
  EX: "EX",
  EQ: "EQ",
  TU: "TU",
};

const BUREAU_COLORS = {
  EX: "bg-blue-100 text-blue-700",
  EQ: "bg-purple-100 text-purple-700",
  TU: "bg-emerald-100 text-emerald-700",
};

// AU tradeline products surface key fields from the Product entity
// seat_price → monthly_cost, primary card age etc. are stored in product description/eligibility for now
// We show what's available and gracefully handle missing data

export default function AUTradelinesTable({ companies, products, selected, onSelect }) {
  // Find best matching AU product per company
  const productByCompany = {};
  products.forEach((p) => {
    if (!productByCompany[p.company_id]) productByCompany[p.company_id] = p;
  });

  return (
    <div className="bg-card rounded-lg border border-border/60 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="text-[9.5px] font-medium text-muted-foreground/60 border-b border-border/50 uppercase tracking-[0.06em]">
            <th className="text-left px-4 py-2.5 font-medium">Company</th>
            <th className="text-left px-3 py-2.5 font-medium">Seat Price</th>
            <th className="text-left px-3 py-2.5 font-medium">Bureaus Reported</th>
            <th className="text-left px-3 py-2.5 font-medium">Limit Range</th>
            <th className="text-left px-3 py-2.5 font-medium">Turnaround</th>
            <th className="text-left px-3 py-2.5 font-medium">Affiliate</th>
            <th className="text-left px-3 py-2.5 font-medium">Status</th>
            <th className="w-8"></th>
          </tr>
        </thead>
        <tbody>
          {companies.map((c) => {
            const p = productByCompany[c.id];
            const domain = c.website_url
              ? (() => { try { return new URL(c.website_url).hostname.replace("www.", ""); } catch { return ""; } })()
              : "";

            const seatPrice = p?.monthly_cost != null ? `$${p.monthly_cost}/mo` : "—";
            const limitRange =
              p?.reported_limit_min != null && p?.reported_limit_max != null
                ? `$${(p.reported_limit_min / 1000).toFixed(0)}k–$${(p.reported_limit_max / 1000).toFixed(0)}k`
                : p?.reported_limit_min != null
                ? `$${(p.reported_limit_min / 1000).toFixed(0)}k+`
                : "—";
            const turnaround = p?.reporting_speed || "—";
            const affiliateAvail = p?.affiliate_available;

            return (
              <tr
                key={c.id}
                onClick={() => onSelect(c)}
                className={`border-b border-border/30 last:border-0 hover:bg-muted/20 cursor-pointer transition-colors ${
                  selected?.id === c.id ? "bg-primary/5" : ""
                }`}
              >
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <FurnisherLogo domain={domain} name={c.company_name} size="sm" />
                    <div>
                      <p className="text-[11px] font-normal text-foreground">{c.company_name}</p>
                      <p className="text-[10px] text-muted-foreground/60">{domain || "—"}</p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2.5 text-[11px] text-foreground/80 tabular-nums">{seatPrice}</td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-1">
                    {["EX", "EQ", "TU"].map((b) => (
                      <span
                        key={b}
                        className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${BUREAU_COLORS[b]} opacity-30`}
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-3 py-2.5 text-[11px] text-foreground/70 tabular-nums">{limitRange}</td>
                <td className="px-3 py-2.5 text-[11px] text-foreground/70">{turnaround}</td>
                <td className="px-3 py-2.5">
                  {affiliateAvail === true ? (
                    <span className="text-[9.5px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Yes</span>
                  ) : affiliateAvail === false ? (
                    <span className="text-[9.5px] text-muted-foreground/50">No</span>
                  ) : (
                    <span className="text-[10px] text-muted-foreground/40">—</span>
                  )}
                </td>
                <td className="px-3 py-2.5">
                  <span className={`inline-flex items-center gap-1 text-[10px] font-medium ${
                    c.verification_status === "verified" ? "text-emerald-500" : "text-muted-foreground/50"
                  }`}>
                    {c.verification_status === "verified" && <CheckCircle2 className="w-2.5 h-2.5" />}
                    {c.verification_status === "verified" ? "Verified" : "Unverified"}
                  </span>
                </td>
                <td className="px-2 py-2.5">
                  <MoreVertical className="w-3.5 h-3.5 text-muted-foreground/40" />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}