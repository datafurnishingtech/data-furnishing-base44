const VERIFIED_WEIGHT = {
  verified: 3,
  partially_verified: 2,
  unverified: 1,
};

export const COMPANY_QUALITY_FIELDS = [
  "company_name", "legal_name", "slug", "website_url", "logo_url",
  "short_description", "long_description", "company_type", "verification_status",
  "confidence_score", "headquarters_location", "country", "state", "phone",
  "support_email", "contact_page_url", "pricing_page_url", "application_url",
  "source_url", "domain", "canonical_url", "furnisher_status", "entity_type",
  "lane", "detected_bureaus", "reporting_capabilities", "api_available",
  "partner_program", "research_score", "reason", "source_evidence_title",
  "source_evidence_snippet", "raw_tradline_info", "enrichment_status",
  "crawl_status", "evidence_sources", "enrichment_data", "data_completeness_score",
  "reporting_relationship", "pricing_public", "requirements_public",
];

export const PRODUCT_QUALITY_FIELDS = [
  "product_name", "product_slug", "product_type", "consumer_or_business",
  "description", "eligibility_summary", "pricing_summary", "monthly_cost",
  "setup_fee", "annual_fee", "reported_limit_min", "reported_limit_max",
  "reporting_speed", "reporting_frequency", "account_type_reported",
  "payment_required", "requires_credit_check", "requires_business_entity",
  "requires_ein", "requires_ssn", "requires_bank_connection",
  "requires_landlord_participation", "requires_property_manager",
  "affiliate_available", "marketplace_available", "apply_url",
  "bureaus_reported", "reporting_relationship", "credit_check_type",
  "requires_personal_guarantee", "identifier_requirement", "min_credit_score",
  "credit_score_notes", "time_in_business_months_min", "annual_revenue_min",
  "deposit_required", "deposit_amount_min", "secured_amount_min",
  "minimum_account_age_months", "approval_requirements_json",
  "bureau_reporting_details", "source_evidence", "extraction_notes",
  "data_completeness_score", "pricing_public", "requirements_public",
];

export function countFilledFields(row, fields) {
  return fields.reduce((count, field) => {
    const value = row?.[field];
    if (value == null || value === "") return count;
    if (Array.isArray(value)) return value.length ? count + 1 : count;
    if (typeof value === "object") return Object.keys(value).length ? count + 1 : count;
    return count + 1;
  }, 0);
}

export function getQualityScore(row, fields) {
  const completeness = Number(row?.data_completeness_score || 0);
  const confidence = Number(row?.confidence_score || row?.research_score || 0);
  const verification = VERIFIED_WEIGHT[row?.verification_status] || VERIFIED_WEIGHT[row?.status] || 0;
  const filled = countFilledFields(row, fields);
  return completeness * 10000 + confidence * 100 + verification * 10 + filled;
}

export function sortByQuality(rows, fields) {
  return [...(rows || [])].sort((a, b) => getQualityScore(b, fields) - getQualityScore(a, fields));
}