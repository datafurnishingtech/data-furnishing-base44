import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  const user = await base44.auth.me();
  if (!user || user.role !== 'admin') {
    return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
  }

  const { company_name, website_url } = await req.json();
  if (!company_name) {
    return Response.json({ error: 'company_name is required' }, { status: 400 });
  }

  const prompt = `
You are a credit industry intelligence researcher. Research the company "${company_name}"${website_url ? ` (website: ${website_url})` : ''} and extract structured data about them as a credit data furnisher or credit-related company.

Return a JSON object with the following fields:

COMPANY fields:
- company_name: string (official display name)
- legal_name: string (legal registered name, or same as company_name if unknown)
- slug: string (lowercase, hyphenated, URL-friendly, e.g. "self-financial")
- website_url: string (full URL with https://)
- short_description: string (one crisp sentence, 15 words max, what they do in credit context)
- long_description: string (2-3 sentences about the company's credit reporting role, products, and who they serve)
- company_type: one of: "direct_furnisher", "tradeline_provider", "reporting_intermediary", "credit_builder", "rent_reporting", "business_credit_vendor", "commercial_lender", "auto_lender", "bnpl_pos_finance", "specialty_reporting_company", "data_infrastructure", "bureau", "unknown"
- headquarters_location: string (City, State format)
- country: string (2-letter, default "US")
- state: string (2-letter state code)
- phone: string or null
- support_email: string or null
- confidence_score: number 0-100 (how confident you are in the data accuracy)

PRODUCTS array — list each distinct credit product they offer that gets reported to bureaus:
Each product:
- product_name: string
- product_type: one of: "credit_builder_loan", "secured_card", "charge_card", "revolving_line", "installment_account", "rent_reporting", "utility_reporting", "subscription_reporting", "business_tradeline", "net_terms", "vendor_credit", "fleet_card", "commercial_loan", "business_credit_card", "auto_loan", "auto_lease", "bnpl", "pos_financing", "lease_to_own", "specialty_data", "bureau_data", "api_infrastructure", "other"
- consumer_or_business: "consumer", "business", "both", or "unknown"
- description: string (1-2 sentences)
- pricing_summary: string (e.g. "$25/mo", "Free", "Net 30", etc.) or null
- monthly_cost: number or null
- reporting_frequency: "monthly", "weekly", "real_time", "unknown", or "other"
- requires_credit_check: boolean or null
- requires_ssn: boolean or null
- requires_ein: boolean or null
- apply_url: string or null
- confidence_score: number 0-100

BUREAU_COVERAGE array — for each product, which bureaus do they report to:
Each entry:
- product_name: string (must match a product_name above)
- bureau_abbr: one of: "EX", "EQ", "TU", "IN", "SB", "ESB", "EQB", "DNB"
- reporting_status: one of: "confirmed_reports", "likely_reports", "does_not_report", "unknown", "delinquency_only", "optional_add_on"
- reporting_type: one of: "positive_payment_history", "negative_only", "full_tradeline", "inquiry_only", "alternative_data", "business_payment_data", "rental_payment_data", "unknown"
- confidence_score: number 0-100

Return ONLY valid JSON with keys: company, products, bureau_coverage. No markdown, no explanation.
`;

  const result = await base44.integrations.Core.InvokeLLM({
    prompt,
    add_context_from_internet: true,
    response_json_schema: {
      type: "object",
      properties: {
        company: { type: "object" },
        products: { type: "array", items: { type: "object" } },
        bureau_coverage: { type: "array", items: { type: "object" } }
      }
    }
  });

  return Response.json({ success: true, data: result });
});