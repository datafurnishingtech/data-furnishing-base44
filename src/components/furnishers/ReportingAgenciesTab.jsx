import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import FurnisherLogo from "@/components/shared/FurnisherLogo";

const BUREAU_TYPE_LABELS = {
  consumer: "Primary Consumer",
  business: "Business",
  specialty: "Specialty",
  data_exchange: "Data Exchange",
  alternative_data_provider: "Alternative Data",
  collections_reporter: "Collections",
  telecom_utility_reporter: "Telecom / Utility",
  auto_vehicle_reporter: "Auto / Vehicle",
  subprime_nontraditional: "Subprime",
  screening_agency: "Screening",
  rental_reporter: "Rental",
};

const BUREAU_TIER_COLORS = {
  primary: "bg-primary/8 text-primary/80",
  commercial: "bg-amber-500/10 text-amber-600",
  specialty: "bg-violet-500/10 text-violet-600",
  alternative: "bg-teal-500/10 text-teal-600",
};

const TYPE_COLORS = {
  consumer: "bg-primary/8 text-primary/80",
  business: "bg-amber-500/10 text-amber-600",
  specialty: "bg-violet-500/10 text-violet-600",
  data_exchange: "bg-muted text-muted-foreground/70",
  alternative_data_provider: "bg-teal-500/10 text-teal-600",
  collections_reporter: "bg-destructive/8 text-destructive/80",
  telecom_utility_reporter: "bg-sky-500/10 text-sky-600",
  auto_vehicle_reporter: "bg-orange-500/10 text-orange-600",
  subprime_nontraditional: "bg-rose-500/10 text-rose-600",
  screening_agency: "bg-muted text-muted-foreground/70",
  rental_reporter: "bg-emerald-500/10 text-emerald-600",
};

const REPORTING_STATUS_LABELS = {
  confirmed_reports: "Confirmed",
  likely_reports: "Likely",
  does_not_report: "Does Not Report",
  unknown: "Unknown",
  delinquency_only: "Delinquency Only",
  optional_add_on: "Optional Add-on",
};

const REPORTING_STATUS_COLORS = {
  confirmed_reports: "text-emerald-500",
  likely_reports: "text-amber-500",
  does_not_report: "text-muted-foreground/40",
  unknown: "text-muted-foreground/40",
  delinquency_only: "text-amber-500",
  optional_add_on: "text-primary/70",
};

export default function ReportingAgenciesTab({ companyId }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!companyId) return;
    setLoading(true);

    Promise.all([
      base44.entities.ProductBureauCoverage.filter({ company_id: companyId }, '-created_date', 100),
      base44.entities.Bureau.list('-bureau_name', 200),
    ]).then(([coverage, bureaus]) => {
      const bureauMap = Object.fromEntries(bureaus.map(b => [b.id, b]));
      // Deduplicate by bureau_id, keeping highest-confidence record
      const byBureau = {};
      for (const c of coverage) {
        const existing = byBureau[c.bureau_id];
        if (!existing || (c.confidence_score || 0) > (existing.confidence_score || 0)) {
          byBureau[c.bureau_id] = { ...c, bureau: bureauMap[c.bureau_id] };
        }
      }
      setRows(Object.values(byBureau).filter(r => r.bureau));
    }).finally(() => setLoading(false));
  }, [companyId]);

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-8 rounded bg-muted/30 animate-pulse" />
        ))}
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <p className="text-[10px] text-muted-foreground/50 py-4 text-center">
        No reporting agency coverage data found.
      </p>
    );
  }

  // Group by tier
  const tiers = [
    { key: "primary", label: "Primary Bureaus" },
    { key: "commercial", label: "Business / Commercial" },
    { key: "specialty", label: "Specialty Agencies" },
    { key: "alternative", label: "Alternative Data" },
  ];

  const grouped = tiers.map(t => ({
    ...t,
    items: rows.filter(r => (r.bureau.bureau_tier || "primary") === t.key),
  })).filter(g => g.items.length > 0);

  // Fallback: uncategorized
  const tieredIds = new Set(rows.filter(r => r.bureau.bureau_tier).map(r => r.bureau_id));
  const uncategorized = rows.filter(r => !tieredIds.has(r.bureau_id) || !r.bureau.bureau_tier);

  return (
    <div className="space-y-3">
      {grouped.map(group => (
        <div key={group.key}>
          <h5 className="text-[9.5px] font-medium text-muted-foreground/60 uppercase tracking-[0.06em] mb-1.5">
            {group.label}
          </h5>
          <div className="space-y-1">
            {group.items.map(row => (
              <AgencyRow key={row.bureau_id} row={row} />
            ))}
          </div>
        </div>
      ))}
      {uncategorized.length > 0 && (
        <div>
          <h5 className="text-[9.5px] font-medium text-muted-foreground/60 uppercase tracking-[0.06em] mb-1.5">
            Other
          </h5>
          <div className="space-y-1">
            {uncategorized.map(row => (
              <AgencyRow key={row.bureau_id} row={row} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AgencyRow({ row }) {
  const b = row.bureau;
  const domain = b.website_url ? b.website_url.replace(/^https?:\/\//, "").split("/")[0] : "";
  const typeLabel = BUREAU_TYPE_LABELS[b.bureau_type] || b.bureau_type;
  const typeColor = TYPE_COLORS[b.bureau_type] || "bg-muted text-muted-foreground/70";
  const statusLabel = REPORTING_STATUS_LABELS[row.reporting_status] || row.reporting_status;
  const statusColor = REPORTING_STATUS_COLORS[row.reporting_status] || "text-muted-foreground/40";

  return (
    <div className="flex items-center justify-between gap-2 py-1 border-b border-border/20 last:border-0">
      <div className="flex items-center gap-2 min-w-0">
        <FurnisherLogo domain={domain} name={b.bureau_name} size="sm" />
        <div className="min-w-0">
          <p className="text-[10.5px] font-normal text-foreground truncate leading-tight">{b.bureau_name}</p>
          <span className={`text-[9px] font-medium px-1 py-0.5 rounded ${typeColor}`}>{typeLabel}</span>
        </div>
      </div>
      <span className={`text-[9.5px] font-medium flex-shrink-0 ${statusColor}`}>{statusLabel}</span>
    </div>
  );
}