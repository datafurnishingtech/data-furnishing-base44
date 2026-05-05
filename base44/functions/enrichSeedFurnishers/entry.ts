import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Enriches unverified/pending_review companies that are missing key fields
// by using the LLM to fill in logo_url, slug, legal_name, headquarters_location, state, short_description
Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user || user.role !== 'admin') {
    return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const batchSize = body.batch_size || 10;
  const offset = body.offset || 0;

  // Get companies missing core fields
  const allCompanies = await base44.asServiceRole.entities.Company.list('-created_date', 500);
  const needsEnrichment = allCompanies.filter(c =>
    !c.slug || !c.headquarters_location || !c.logo_url
  );

  const batch = needsEnrichment.slice(offset, offset + batchSize);

  if (batch.length === 0) {
    return Response.json({ success: true, message: 'Nothing to enrich', total_needing: needsEnrichment.length, offset });
  }

  // Use LLM to enrich all companies in this batch at once
  const companiesInfo = batch.map(c => ({
    id: c.id,
    company_name: c.company_name,
    website_url: c.website_url,
    company_type: c.company_type,
  }));

  const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
    prompt: `You are a financial data research expert. For each of the following companies, return enriched data.
    
Companies to research:
${JSON.stringify(companiesInfo, null, 2)}

For each company, provide:
- id: same as provided
- slug: URL-friendly lowercase slug (e.g. "self-inc", "lending-club")  
- legal_name: the official legal registered name of the company
- headquarters_location: "City, State" format (e.g. "Austin, TX")
- state: two-letter US state abbreviation (e.g. "TX")
- short_description: a precise 1-sentence description of what this company does in the credit/lending ecosystem (max 120 chars)
- logo_url: use clearbit format: https://logo.clearbit.com/<domain> where <domain> is extracted from website_url

Return ONLY factual, accurate information. If unsure about a field, use null.`,
    response_json_schema: {
      type: "object",
      properties: {
        companies: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              slug: { type: "string" },
              legal_name: { type: "string" },
              headquarters_location: { type: "string" },
              state: { type: "string" },
              short_description: { type: "string" },
              logo_url: { type: "string" },
            },
            required: ["id"]
          }
        }
      },
      required: ["companies"]
    }
  });

  const enriched = result.companies || [];
  const updated = [];
  const errors = [];

  await Promise.all(enriched.map(async (enrichment) => {
    const updates = {};
    if (enrichment.slug) updates.slug = enrichment.slug;
    if (enrichment.legal_name) updates.legal_name = enrichment.legal_name;
    if (enrichment.headquarters_location) updates.headquarters_location = enrichment.headquarters_location;
    if (enrichment.state) updates.state = enrichment.state;
    if (enrichment.short_description) updates.short_description = enrichment.short_description;
    if (enrichment.logo_url) updates.logo_url = enrichment.logo_url;

    if (Object.keys(updates).length > 0) {
      await base44.asServiceRole.entities.Company.update(enrichment.id, updates);
      updated.push({ id: enrichment.id, fields: Object.keys(updates) });
    }
  }));

  return Response.json({
    success: true,
    total_needing_enrichment: needsEnrichment.length,
    batch_offset: offset,
    batch_size: batch.length,
    enriched: updated.length,
    remaining: Math.max(0, needsEnrichment.length - offset - batchSize),
    updated_companies: updated,
    errors,
  });
});