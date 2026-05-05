import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import PageHeader from "@/components/shared/PageHeader";
import ResearchForm from "@/components/admin/ResearchForm";
import DraftReview from "@/components/admin/DraftReview";
import CFPBPanel from "@/components/admin/CFPBPanel";

export default function AdminResearch() {
  const [draft, setDraft] = useState(null);
  const [cfpbData, setCfpbData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cfpbLoading, setCfpbLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedCompany, setSavedCompany] = useState(null);

  async function handleResearch({ company_name, website_url }) {
    setLoading(true);
    setDraft(null);
    setCfpbData(null);
    setSavedCompany(null);

    const [researchRes, cfpbRes] = await Promise.all([
      base44.functions.invoke("researchFurnisher", { company_name, website_url }),
      base44.functions.invoke("lookupCFPBData", { company_name }),
    ]);

    setDraft(researchRes.data.data);
    setCfpbData(cfpbRes.data);
    setLoading(false);
  }

  async function handleSave(action) {
    setSaving(true);
    const res = await base44.functions.invoke("saveFurnisherDraft", { draft, action });
    setSavedCompany(res.data.company);
    setSaving(false);
  }

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        title="Admin Research Pipeline"
        subtitle="Research a furnisher using live web data and CFPB intelligence, then approve it into the registry."
      />

      <ResearchForm onResearch={handleResearch} loading={loading} />

      {loading && (
        <div className="mt-8 flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-[11px] text-muted-foreground">Researching with live web data...</p>
        </div>
      )}

      {savedCompany && (
        <div className="mt-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-4 py-3 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <p className="text-[11px] text-emerald-700 font-medium">
            "{savedCompany.company_name}" has been saved to the registry (status: {savedCompany.status}).
          </p>
        </div>
      )}

      {draft && !loading && (
        <div className="mt-6 grid grid-cols-5 gap-5">
          <div className="col-span-3">
            <DraftReview
              draft={draft}
              onDraftChange={setDraft}
              onSave={handleSave}
              saving={saving}
            />
          </div>
          <div className="col-span-2">
            <CFPBPanel data={cfpbData} />
          </div>
        </div>
      )}
    </div>
  );
}