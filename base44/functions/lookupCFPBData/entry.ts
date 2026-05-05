import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();

  if (user?.role !== 'admin') {
    return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
  }

  const { company_name } = await req.json();

  if (!company_name) {
    return Response.json({ error: 'company_name is required' }, { status: 400 });
  }

  // CFPB public complaints API — no auth required
  const cfpbUrl = `https://api.consumerfinance.gov/data/complaints?company=${encodeURIComponent(company_name)}&size=5&sort=created_date_desc&format=json`;
  const cfpbRes = await fetch(cfpbUrl);
  const cfpbData = await cfpbRes.json();

  const hits = cfpbData?.hits?.hits || [];
  const total = cfpbData?.hits?.total?.value || 0;

  const complaints = hits.map((h) => ({
    date: h._source?.date_received,
    product: h._source?.product,
    issue: h._source?.issue,
    state: h._source?.state,
    company_response: h._source?.company_response,
  }));

  // FFIEC lookup — use LLM to check regulatory status
  const ffiecResult = await base44.asServiceRole.integrations.Core.InvokeLLM({
    prompt: `Is "${company_name}" regulated by the FFIEC (Federal Financial Institutions Examination Council)? This means it is a bank, credit union, or other depository institution regulated by OCC, FDIC, Federal Reserve, NCUA, or CFPB as a supervised entity. Answer with a JSON object: { "ffiec_regulated": boolean, "regulator": string or null, "charter_type": string or null, "notes": string }`,
    add_context_from_internet: true,
    response_json_schema: {
      type: "object",
      properties: {
        ffiec_regulated: { type: "boolean" },
        regulator: { type: ["string", "null"] },
        charter_type: { type: ["string", "null"] },
        notes: { type: "string" }
      }
    }
  });

  return Response.json({
    cfpb: {
      total_complaints: total,
      recent: complaints,
    },
    ffiec: ffiecResult,
  });
});