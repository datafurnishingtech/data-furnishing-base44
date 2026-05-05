import React, { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ResearchForm({ onResearch, loading }) {
  const [companyName, setCompanyName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!companyName.trim()) return;
    onResearch({ company_name: companyName.trim(), website_url: websiteUrl.trim() || null });
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-lg border border-border/60 p-5">
      <h2 className="text-[11px] font-medium text-muted-foreground/70 uppercase tracking-[0.06em] mb-4">
        Research a furnisher
      </h2>
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="text-[10px] text-muted-foreground/70 mb-1.5 block">Company name *</label>
          <Input
            placeholder="e.g. Self Financial, Kikoff, Nav Technologies"
            className="h-8 text-[11px]"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="w-64">
          <label className="text-[10px] text-muted-foreground/70 mb-1.5 block">Website URL (optional)</label>
          <Input
            placeholder="https://example.com"
            className="h-8 text-[11px]"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="flex items-end">
          <Button type="submit" disabled={loading || !companyName.trim()} className="h-8 text-[11px] px-4 gap-2">
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
            {loading ? "Researching..." : "Research"}
          </Button>
        </div>
      </div>
      <p className="text-[10px] text-muted-foreground/50 mt-2.5">
        Uses live web search + CFPB complaint database. Takes 10–20 seconds.
      </p>
    </form>
  );
}