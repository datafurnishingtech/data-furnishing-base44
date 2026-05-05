import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, Play, Eye, Loader2 } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";

export default function SeedImport() {
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ran, setRan] = useState(false);

  async function handlePreview() {
    setLoading(true);
    setResult(null);
    const res = await base44.functions.invoke("bulkSeedFurnishers", { dry_run: true });
    setPreview(res.data);
    setLoading(false);
  }

  async function handleRun() {
    setLoading(true);
    const res = await base44.functions.invoke("bulkSeedFurnishers", { dry_run: false });
    setResult(res.data);
    setRan(true);
    setLoading(false);
  }

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader
        title="Bulk Seed Import"
        subtitle="Import the Obvious Tradeline Furnishers seed map into the Company registry."
      />

      <div className="bg-card border border-border/60 rounded-lg p-5 mb-5">
        <h3 className="text-[12px] font-semibold text-foreground mb-1">What this imports</h3>
        <p className="text-[11px] text-muted-foreground mb-3">
          ~100 companies across 10 segments: consumer credit-builders, rent reporting, business vendor credit,
          commercial lenders, consumer banks/cards, auto lenders, BNPL, telecom/utility, specialty reporting, and
          data infrastructure. All imported as <code className="text-[10px] bg-muted px-1 py-0.5 rounded">pending_review / unverified</code> with a baseline confidence score of 30.
          Existing companies (matched by name) are skipped automatically.
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-[11px] h-7"
            onClick={handlePreview}
            disabled={loading}
          >
            {loading && !ran ? <Loader2 className="w-3 h-3 animate-spin" /> : <Eye className="w-3 h-3" />}
            Preview
          </Button>
          <Button
            size="sm"
            className="gap-1.5 text-[11px] h-7"
            onClick={handleRun}
            disabled={loading || ran}
          >
            {loading && ran ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
            {ran ? "Import complete" : "Run import"}
          </Button>
        </div>
      </div>

      {/* Preview results */}
      {preview && !result && (
        <div className="bg-card border border-border/60 rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between">
            <span className="text-[11.5px] font-medium">Preview — {preview.total_in_seed} companies to import</span>
            <Badge variant="secondary" className="text-[10px]">Dry run</Badge>
          </div>
          <div className="max-h-[420px] overflow-y-auto">
            <table className="w-full">
              <thead>
                <tr className="text-[9.5px] font-medium text-muted-foreground/60 border-b border-border/50 uppercase tracking-[0.06em]">
                  <th className="text-left px-4 py-2 font-medium">#</th>
                  <th className="text-left px-3 py-2 font-medium">Company</th>
                  <th className="text-left px-3 py-2 font-medium">Type</th>
                </tr>
              </thead>
              <tbody>
                {preview.companies.map((c, i) => (
                  <tr key={i} className="border-b border-border/30 last:border-0">
                    <td className="px-4 py-2 text-[10px] text-muted-foreground/50">{i + 1}</td>
                    <td className="px-3 py-2 text-[11px] text-foreground">{c.company_name}</td>
                    <td className="px-3 py-2 text-[10px] text-muted-foreground/70">{c.company_type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Run results */}
      {result && (
        <div className="bg-card border border-border/60 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span className="text-[12px] font-semibold text-foreground">Import complete</span>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="bg-emerald-500/10 rounded-lg p-3 text-center">
              <p className="text-[20px] font-semibold text-emerald-600">{result.created}</p>
              <p className="text-[10px] text-emerald-600/70 mt-0.5">Created</p>
            </div>
            <div className="bg-amber-500/10 rounded-lg p-3 text-center">
              <p className="text-[20px] font-semibold text-amber-600">{result.skipped}</p>
              <p className="text-[10px] text-amber-600/70 mt-0.5">Skipped (duplicates)</p>
            </div>
            <div className="bg-muted rounded-lg p-3 text-center">
              <p className="text-[20px] font-semibold text-foreground">{result.total_in_seed}</p>
              <p className="text-[10px] text-muted-foreground/60 mt-0.5">Total in seed</p>
            </div>
          </div>

          {result.created_companies?.length > 0 && (
            <div>
              <p className="text-[10.5px] font-medium text-foreground mb-2">Created companies:</p>
              <div className="max-h-[260px] overflow-y-auto space-y-1">
                {result.created_companies.map((c, i) => (
                  <div key={i} className="flex items-center gap-2 text-[11px] text-foreground/70">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                    {c.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.skipped_companies?.length > 0 && (
            <div className="mt-4">
              <p className="text-[10.5px] font-medium text-foreground mb-2">Skipped (already exist):</p>
              <div className="flex flex-wrap gap-1.5">
                {result.skipped_companies.map((name, i) => (
                  <span key={i} className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded">{name}</span>
                ))}
              </div>
            </div>
          )}

          <p className="text-[10px] text-muted-foreground/60 mt-4">
            All imported companies are set to <code className="bg-muted px-1 rounded">pending_review</code>. Go to the Furnisher Registry to review and verify them.
          </p>
        </div>
      )}
    </div>
  );
}