import React from "react";
import { CheckCircle2, Save, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const COMPANY_TYPES = [
  "direct_furnisher", "tradeline_provider", "reporting_intermediary", "tradeline_adjacent",
  "credit_builder", "rent_reporting", "business_credit_vendor", "commercial_lender",
  "auto_lender", "bnpl_pos_finance", "specialty_reporting_company", "data_infrastructure", "bureau", "unknown"
];

function Field({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="text-[9.5px] text-muted-foreground/60 mb-1 block uppercase tracking-[0.05em]">{label}</label>
      {onChange ? (
        <Input
          type={type}
          className="h-7 text-[11px]"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <p className="text-[11px] text-foreground/80 py-1">{value || "—"}</p>
      )}
    </div>
  );
}

export default function DraftReview({ draft, onDraftChange, onSave, saving }) {
  function update(field, value) {
    onDraftChange({ ...draft, [field]: value });
  }

  const confidence = draft.confidence_score || 0;

  return (
    <div className="bg-card rounded-lg border border-border/60 p-5 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[13px] font-semibold text-foreground">{draft.company_name}</h2>
          <p className="text-[10px] text-muted-foreground/60 mt-0.5">{draft.short_description}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`text-[10px] font-medium px-2 py-0.5 rounded ${
            confidence >= 80 ? "bg-emerald-500/10 text-emerald-600" :
            confidence >= 60 ? "bg-amber-500/10 text-amber-600" :
            "bg-destructive/10 text-destructive"
          }`}>
            {confidence}% confidence
          </div>
        </div>
      </div>

      {/* Core fields */}
      <div>
        <h3 className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-[0.06em] mb-3">Company details</h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          <Field label="Company name" value={draft.company_name} onChange={(v) => update("company_name", v)} />
          <Field label="Legal name" value={draft.legal_name} onChange={(v) => update("legal_name", v)} />
          <Field label="Website URL" value={draft.website_url} onChange={(v) => update("website_url", v)} />
          <Field label="Headquarters" value={draft.headquarters_location} onChange={(v) => update("headquarters_location", v)} />
          <Field label="Phone" value={draft.phone} onChange={(v) => update("phone", v)} />
          <Field label="Support email" value={draft.support_email} onChange={(v) => update("support_email", v)} />
        </div>
      </div>

      {/* Company type */}
      <div>
        <label className="text-[9.5px] text-muted-foreground/60 mb-1.5 block uppercase tracking-[0.05em]">Company type</label>
        <Select value={draft.company_type} onValueChange={(v) => update("company_type", v)}>
          <SelectTrigger className="h-7 text-[11px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {COMPANY_TYPES.map((t) => (
              <SelectItem key={t} value={t}>{t.replace(/_/g, " ")}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Description */}
      <div>
        <label className="text-[9.5px] text-muted-foreground/60 mb-1.5 block uppercase tracking-[0.05em]">Short description</label>
        <textarea
          className="w-full h-16 text-[11px] border border-input rounded-md px-3 py-2 bg-transparent resize-none focus:outline-none focus:ring-1 focus:ring-ring"
          value={draft.short_description || ""}
          onChange={(e) => update("short_description", e.target.value)}
        />
      </div>

      {/* Bureaus reported */}
      {draft.bureaus_reported?.length > 0 && (
        <div>
          <h3 className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-[0.06em] mb-2">Bureaus reported</h3>
          <div className="flex flex-wrap gap-1.5">
            {draft.bureaus_reported.map((b) => (
              <span key={b} className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-medium">{b}</span>
            ))}
          </div>
        </div>
      )}

      {/* Products */}
      {draft.products?.length > 0 && (
        <div>
          <h3 className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-[0.06em] mb-2">
            Products ({draft.products.length})
          </h3>
          <div className="space-y-2">
            {draft.products.map((p, i) => (
              <div key={i} className="border border-border/40 rounded-md px-3 py-2.5 bg-muted/20">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-medium text-foreground">{p.product_name}</p>
                  <span className="text-[9.5px] text-muted-foreground/60">{p.product_type?.replace(/_/g, " ")}</span>
                </div>
                {p.description && (
                  <p className="text-[10px] text-muted-foreground/70 mt-1">{p.description}</p>
                )}
                <div className="flex gap-3 mt-1.5 flex-wrap">
                  {p.monthly_cost != null && <span className="text-[9.5px] text-muted-foreground/60">${p.monthly_cost}/mo</span>}
                  {p.reported_limit_min != null && (
                    <span className="text-[9.5px] text-muted-foreground/60">
                      Limit: ${p.reported_limit_min.toLocaleString()}–${(p.reported_limit_max || p.reported_limit_min).toLocaleString()}
                    </span>
                  )}
                  <span className="text-[9.5px] text-muted-foreground/60">{p.reporting_frequency}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Source notes */}
      {draft.source_notes && (
        <div>
          <h3 className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-[0.06em] mb-1.5">Source notes</h3>
          <p className="text-[10.5px] text-muted-foreground/70 leading-relaxed">{draft.source_notes}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-2 border-t border-border/40">
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-[11px] font-normal gap-1.5"
          onClick={() => onSave("save_draft")}
          disabled={saving}
        >
          <Save className="w-3 h-3" />
          Save as draft
        </Button>
        <Button
          size="sm"
          className="h-7 text-[11px] gap-1.5 bg-emerald-600 hover:bg-emerald-700"
          onClick={() => onSave("approve")}
          disabled={saving}
        >
          <CheckCircle2 className="w-3 h-3" />
          Approve & publish
        </Button>
      </div>
    </div>
  );
}