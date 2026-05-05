import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();

  if (user?.role !== 'admin') {
    return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
  }

  const { company_name, website_url, mode } = await req.json();

  if (!company_name) {
    return Response.json({ error: 'company_name is required' }, { status: 400 });
  }

  const prompt = `
You are a credit industry analyst and data researcher. Research the following company and return structured intelligence about them as a credit furnisher.

Company name: "${company_name}"
${website_url ? `Website: ${website_url}` : ''}

Research and return ALL of the following fields with real, accurate data. Use your internet search to find current information.

Return ONLY valid JSON matching this exact schema:
{
  "company_name": string,
  "legal_name": string or null,
  "slug": string (url-friendly, lowercase, hyphens),
  "website_url": string or null,
  "short_description": string (1 sentence, what they do in the credit ecosystem),
  "long_description": string (2-3 sentences with more detail),
  "company_type": one of: "direct_furnisher" | "tradeline_provider" | "reporting_intermediary" | "tradeline_adjacent" | "credit_builder" | "rent_reporting" | "business_credit_vendor" | "commercial_lender" | "auto_lender" | "bnpl_pos_finance" | "specialty_reporting_company" | "data_infrastructure" | "bureau" | "unknown",
  "headquarters_location": string (City, State) or null,
  "state": string (2-letter state code) or null,
  "country": "US" or other,
  "phone": string or null,
  "support_email": string or null,
  "bureaus_reported": array of bureau names from: ["Experian", "Equifax", "TransUnion", "Dun & Bradstreet", "SBFE", "Innovis", "ChexSystems", "LexisNexis", "CoreLogic", "PRBC", "CIBIL"],
  "reporting_type": one of: "positive_payment_history" | "negative_only" | "full_tradeline" | "alternative_data" | "business_payment_data" | "rental_payment_data" | "unknown",
  "consumer_or_business": one of: "consumer" | "business" | "both" | "unknown",
  "products": array of objects: [
    {
      "product_name": string,
      "product_type": one of: "credit_builder_loan" | "secured_card" | "charge_card" | "revolving_line" | "installment_account" | "rent_reporting" | "utility_reporting" | "subscription_reporting" | "business_tradeline" | "net_terms" | "vendor_credit" | "fleet_card" | "commercial_loan" | "business_credit_card" | "auto_loan" | "auto_lease" | "bnpl" | "pos_financing" | "lease_to_own" | "specialty_data" | "bureau_data" | "api_infrastructure" | "other",
      "description": string,
      "monthly_cost": number or null,
      "setup_fee": number or null,
      "annual_fee": number or null,
      "requires_credit_check": boolean,
      "requires_ssn": boolean,
      "reporting_frequency": one of: "monthly" | "weekly" | "real_time" | "unknown" | "other",
      "reported_limit_min": number or null,
      "reported_limit_max": number or null
    }
  ],
  "cfpb_complaints_found": boolean,
  "ffiec_regulated": boolean,
  "confidence_score": number 0-100 (your confidence in the data accuracy),
  "source_notes": string (where you found this info),
  "verification_status": "unverified"
}
`;

  const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
    prompt,
    add_context_from_internet: true,
    response_json_schema: {
      type: "object",
      properties: {
        company_name: { type: "string" },
        legal_name: { type: ["string", "null"] },
        slug: { type: "string" },
        website_url: { type: ["string", "null"] },
        short_description: { type: "string" },
        long_description: { type: "string" },
        company_type: { type: "string" },
        headquarters_location: { type: ["string", "null"] },
        state: { type: ["string", "null"] },
        country: { type: "string" },
        phone: { type: ["string", "null"] },
        support_email: { type: ["string", "null"] },
        bureaus_reported: { type: "array", items: { type: "string" } },
        reporting_type: { type: "string" },
        consumer_or_business: { type: "string" },
        products: { type: "array" },
        cfpb_complaints_found: { type: "boolean" },
        ffiec_regulated: { type: "boolean" },
        confidence_score: { type: "number" },
        source_notes: { type: "string" },
        verification_status: { type: "string" }
      }
    }
  });

  return Response.json({ data: result });
});