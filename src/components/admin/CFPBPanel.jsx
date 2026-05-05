import React from "react";
import { AlertTriangle, ShieldCheck, ShieldAlert } from "lucide-react";

export default function CFPBPanel({ data }) {
  if (!data) return null;

  const { cfpb, ffiec } = data;

  return (
    <div className="space-y-4">
      {/* CFPB */}
      <div className="bg-card rounded-lg border border-border/60 p-4">
        <h3 className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-[0.06em] mb-3 flex items-center gap-1.5">
          <AlertTriangle className="w-3 h-3" />
          CFPB complaint database
        </h3>
        <div className="flex items-baseline gap-2 mb-3">
          <span className={`text-[24px] font-semibold leading-none ${cfpb?.total_complaints > 100 ? "text-destructive" : cfpb?.total_complaints > 10 ? "text-amber-500" : "text-foreground"}`}>
            {cfpb?.total_complaints?.toLocaleString() ?? "—"}
          </span>
          <span className="text-[10px] text-muted-foreground/60">total complaints</span>
        </div>

        {cfpb?.recent?.length > 0 ? (
          <div className="space-y-2">
            <p className="text-[9.5px] text-muted-foreground/60 uppercase tracking-[0.05em]">Recent complaints</p>
            {cfpb.recent.map((c, i) => (
              <div key={i} className="border border-border/30 rounded-md px-2.5 py-2 bg-muted/20">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[10px] font-medium text-foreground">{c.product || "—"}</span>
                  <span className="text-[9.5px] text-muted-foreground/60">{c.state} · {c.date?.slice(0, 10)}</span>
                </div>
                <p className="text-[10px] text-muted-foreground/70">{c.issue}</p>
                {c.company_response && (
                  <p className="text-[9.5px] text-muted-foreground/50 mt-0.5">Response: {c.company_response}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[11px] text-muted-foreground/50">No recent complaints found.</p>
        )}
      </div>

      {/* FFIEC */}
      <div className="bg-card rounded-lg border border-border/60 p-4">
        <h3 className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-[0.06em] mb-3 flex items-center gap-1.5">
          {ffiec?.ffiec_regulated ? <ShieldCheck className="w-3 h-3 text-emerald-500" /> : <ShieldAlert className="w-3 h-3 text-muted-foreground/50" />}
          FFIEC regulatory status
        </h3>
        <div className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-md ${
          ffiec?.ffiec_regulated ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"
        }`}>
          {ffiec?.ffiec_regulated ? "FFIEC Regulated" : "Not FFIEC Regulated"}
        </div>
        {ffiec?.regulator && (
          <p className="text-[10.5px] text-foreground/70 mt-2">Regulator: <span className="font-medium">{ffiec.regulator}</span></p>
        )}
        {ffiec?.charter_type && (
          <p className="text-[10.5px] text-foreground/70">Charter: <span className="font-medium">{ffiec.charter_type}</span></p>
        )}
        {ffiec?.notes && (
          <p className="text-[10px] text-muted-foreground/60 mt-2 leading-relaxed">{ffiec.notes}</p>
        )}
      </div>
    </div>
  );
}